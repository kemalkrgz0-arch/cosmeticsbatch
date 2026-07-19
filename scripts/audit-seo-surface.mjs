const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const concurrency = Math.max(1, Math.min(Number(process.env.SEO_AUDIT_CONCURRENCY ?? 8), 16));
const requestTimeoutMs = Math.max(1_000, Number(process.env.SEO_AUDIT_TIMEOUT_MS ?? 15_000));

async function checkedFetch(url, init = {}) {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(requestTimeoutMs) });
  } catch (error) {
    return { ok: false, status: 0, text: async () => "", error };
  }
}

function decode(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function tagContent(html, tag) {
  return decode(html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "");
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, "i"))?.[1];
}

function linkTags(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
}

function metaTags(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
}

function normalizePath(value) {
  const url = new URL(value, baseUrl);
  return `${url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "")}${url.search}`;
}

async function mapLimit(values, worker) {
  const results = new Array(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      results[index] = await worker(values[index], index);
    }
  }));
  return results;
}

const sitemapResponse = await checkedFetch(`${baseUrl}/sitemap.xml`, { redirect: "manual" });
if (!sitemapResponse.ok) throw new Error(`sitemap returned ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
if (!sitemapUrls.length) throw new Error("sitemap contains no URLs");

const failures = [];
const pages = await mapLimit(sitemapUrls, async (publicUrl) => {
  const publicPath = normalizePath(publicUrl);
  const response = await checkedFetch(new URL(publicPath, baseUrl), { redirect: "manual" });
  if (response.status !== 200) {
    failures.push(`${publicPath}: sitemap URL returned ${response.status}`);
    return { publicPath, alternates: [], hrefs: [] };
  }
  const html = await response.text();
  const title = tagContent(html, "title");
  const metas = metaTags(html);
  const description = decode(attribute(metas.find((tag) => attribute(tag, "name")?.toLowerCase() === "description") ?? "", "content") ?? "");
  const robots = attribute(metas.find((tag) => attribute(tag, "name")?.toLowerCase() === "robots") ?? "", "content") ?? "";
  const links = linkTags(html);
  const canonical = attribute(links.find((tag) => attribute(tag, "rel")?.toLowerCase() === "canonical") ?? "", "href");
  const alternates = links
    .filter((tag) => attribute(tag, "rel")?.toLowerCase() === "alternate" && attribute(tag, "hreflang"))
    .map((tag) => ({ lang: attribute(tag, "hreflang"), path: normalizePath(attribute(tag, "href") ?? "/") }));
  if (!title) failures.push(`${publicPath}: missing title`);
  if ([...title].length > 60) failures.push(`${publicPath}: title ${[...title].length}/60`);
  if (!description) failures.push(`${publicPath}: missing description`);
  if ([...description].length > 160) failures.push(`${publicPath}: description ${[...description].length}/160`);
  if (!canonical) failures.push(`${publicPath}: missing canonical`);
  else if (normalizePath(canonical) !== publicPath) failures.push(`${publicPath}: canonical points to ${normalizePath(canonical)}`);
  if (/noindex/i.test(robots)) failures.push(`${publicPath}: sitemap URL is noindex`);
  const hrefs = [...html.matchAll(/<a\b[^>]*\shref=["']([^"']+)["']/gi)]
    .map((match) => decode(match[1]))
    .filter((href) => href.startsWith("/") && !href.startsWith("//"))
    .map((href) => normalizePath(href.split("#")[0]))
    .filter((href) => !href.startsWith("/review") && !href.startsWith("/api/"));
  return { publicPath, alternates, hrefs };
});

const pageByPath = new Map(pages.map((page) => [page.publicPath, page]));
for (const page of pages) {
  for (const alternate of page.alternates) {
    if (alternate.lang === "x-default") continue;
    const target = pageByPath.get(alternate.path);
    if (!target) {
      failures.push(`${page.publicPath}: hreflang ${alternate.lang} target ${alternate.path} is absent from sitemap`);
      continue;
    }
    if (!target.alternates.some((candidate) => candidate.path === page.publicPath)) {
      failures.push(`${page.publicPath}: hreflang target ${alternate.path} is not reciprocal`);
    }
  }
}

const internalPaths = [...new Set(pages.flatMap((page) => page.hrefs))];
await mapLimit(internalPaths, async (path, index) => {
  if (index > 0 && index % 500 === 0) console.log(`Checked ${index}/${internalPaths.length} internal paths…`);
  const response = await checkedFetch(new URL(path, baseUrl), { method: "HEAD", redirect: "manual" });
  if (response.status === 0) failures.push(`${path}: internal link timed out or failed to connect`);
  if (response.status >= 400) failures.push(`${path}: internal link returned ${response.status}`);
  if ([301, 302, 303, 307, 308].includes(response.status)) failures.push(`${path}: internal link redirects (${response.status})`);
});

if (failures.length) {
  console.error(`SEO surface audit failed: ${failures.length} issue(s) across ${sitemapUrls.length} sitemap URLs and ${internalPaths.length} internal paths`);
  failures.slice(0, 200).forEach((failure) => console.error(`- ${failure}`));
  if (failures.length > 200) console.error(`- … ${failures.length - 200} more`);
  process.exit(1);
}
console.log(`SEO surface audit passed: ${sitemapUrls.length} sitemap URLs, ${internalPaths.length} internal paths`);
