import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const API = "https://www.wikidata.org/w/api.php";
const COMMONS = "https://commons.wikimedia.org/wiki/Special:Redirect/file/";
const USER_AGENT = "CosmeticsBatch/0.6 (https://cosmeticsbatch.com; logo-source-audit)";

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['".]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function host(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function claimStrings(entity, property) {
  return (entity.claims?.[property] ?? [])
    .map((claim) => claim.mainsnak?.datavalue?.value)
    .filter((value) => typeof value === "string");
}

async function json(url, attempt = 0) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (response.status === 429 && attempt < 6) {
    const retryAfter = Number(response.headers.get("retry-after")) || 2 ** attempt;
    await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter, 20) * 1000));
    return json(url, attempt + 1);
  }
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function responseWithRetry(url, attempt = 0) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT }, redirect: "follow" });
  if (response.status === 429 && attempt < 6) {
    const retryAfter = Number(response.headers.get("retry-after")) || 2 ** attempt;
    await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter, 20) * 1000));
    return responseWithRetry(url, attempt + 1);
  }
  return response;
}

async function mapLimit(items, limit, worker) {
  const output = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        output[index] = await worker(items[index], index);
      }
    }),
  );
  return output;
}

const brandsSource = await readFile(path.join(ROOT, "src/lib/brands.ts"), "utf8");
const logoSource = await readFile(path.join(ROOT, "src/lib/brand-logos.ts"), "utf8");
const rowBlock = brandsSource.match(/const ROWS: Row\[\] = \[([\s\S]*?)\n\];/)?.[1] ?? "";
const domainBlock = logoSource.match(/const DOMAINS:[\s\S]*?= \{([\s\S]*?)\n\};/)?.[1] ?? "";

const names = [...rowBlock.matchAll(/^\s*\["([^"]+)"/gm)].map((match) => match[1]);
const domains = Object.fromEntries(
  [...domainBlock.matchAll(/^\s*"?([a-z0-9-]+)"?:\s*"([^"]+)"/gm)].map((match) => [
    match[1],
    match[2],
  ]),
);
const brands = names.map((name) => ({ name, slug: slugify(name), domain: domains[slugify(name)] }));

await mkdir(path.join(ROOT, "public/brand-logos"), { recursive: true });

const resolved = await mapLimit(brands, 2, async (brand) => {
  const search = new URL(API);
  search.search = new URLSearchParams({
    action: "wbsearchentities",
    search: brand.name,
    language: "en",
    uselang: "en",
    type: "item",
    limit: "10",
    format: "json",
    origin: "*",
  });
  const results = (await json(search)).search ?? [];
  if (results.length === 0) return { brand, reason: "no Wikidata search result" };

  const entitiesUrl = new URL(API);
  entitiesUrl.search = new URLSearchParams({
    action: "wbgetentities",
    ids: results.map((result) => result.id).join("|"),
    props: "claims|labels",
    languages: "en",
    format: "json",
    origin: "*",
  });
  const entities = Object.values((await json(entitiesUrl)).entities ?? {});
  const expectedHost = brand.domain?.replace(/^www\./, "").toLowerCase();
  const normalizedName = brand.name.toLocaleLowerCase("en");
  const candidates = entities
    .filter((entity) => claimStrings(entity, "P154").length > 0)
    .map((entity) => {
      const websites = claimStrings(entity, "P856");
      const domainMatch = Boolean(
        expectedHost && websites.some((website) => {
          const candidate = host(website);
          return candidate === expectedHost || candidate.endsWith(`.${expectedHost}`);
        }),
      );
      const label = entity.labels?.en?.value?.toLocaleLowerCase("en") ?? "";
      const labelMatch = label === normalizedName;
      return { entity, domainMatch, labelMatch, score: (domainMatch ? 4 : 0) + (labelMatch ? 2 : 0) };
    })
    .filter((candidate) => candidate.domainMatch)
    .sort((a, b) => b.score - a.score);

  const selected = candidates[0];
  if (!selected) return { brand, reason: "no P154 logo with matching official site or label" };
  const file = claimStrings(selected.entity, "P154")[0];
  return { brand, qid: selected.entity.id, file, domainMatch: selected.domainMatch };
});

const manifest = {};
const missing = [];
for (const result of resolved) {
  if (!result.file) {
    missing.push({ slug: result.brand.slug, name: result.brand.name, reason: result.reason });
    continue;
  }
  const extension = path.extname(result.file).toLowerCase().replace(/[^.a-z0-9]/g, "") || ".svg";
  const filename = `${result.brand.slug}${extension}`;
  const source = `${COMMONS}${encodeURIComponent(result.file.replace(/ /g, "_"))}`;
  const response = await responseWithRetry(source);
  if (!response.ok) {
    missing.push({ slug: result.brand.slug, name: result.brand.name, reason: `download ${response.status}` });
    continue;
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 100) {
    missing.push({ slug: result.brand.slug, name: result.brand.name, reason: "empty logo file" });
    continue;
  }
  await writeFile(path.join(ROOT, "public/brand-logos", filename), bytes);
  manifest[result.brand.slug] = {
    src: `/brand-logos/${filename}`,
    qid: result.qid,
    commonsFile: result.file,
    domainVerified: result.domainMatch,
  };
}

await writeFile(
  path.join(ROOT, "src/lib/wikidata-brand-logos.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
await writeFile(
  path.join(ROOT, "public/brand-logos/missing.json"),
  `${JSON.stringify(missing, null, 2)}\n`,
);

console.log(`Wikidata logos: ${Object.keys(manifest).length}/${brands.length}`);
console.log(`Missing: ${missing.length} (public/brand-logos/missing.json)`);
