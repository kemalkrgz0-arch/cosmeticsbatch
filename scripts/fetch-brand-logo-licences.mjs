#!/usr/bin/env node
/**
 * Record the Wikimedia Commons licence for every brand logo we ship.
 *
 * `wikidata-brand-logos.json` stored where each file came from but not what we
 * are allowed to do with it, so there was no way to show the site complies and
 * no way to notice a re-fetch swapping a public-domain file for a licensed one.
 * That is finding 20.
 *
 * The licence is read from Commons' own `extmetadata`, not inferred, and the
 * uploader-stated author and source are stored beside it — for the files whose
 * licence tag turns out to be doubtful, the source is the evidence.
 *
 *   node scripts/fetch-brand-logo-licences.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const INVENTORY = "src/lib/wikidata-brand-logos.json";
const API = "https://commons.wikimedia.org/w/api.php";
const BATCH = 25;

/** Commons wraps these values in markup; the manifest wants plain text. */
function plain(value) {
  if (!value) return null;
  const text = value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text || null;
}

async function fetchMetadata(titles) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "imageinfo",
    iiprop: "extmetadata",
    iiextmetadatafilter:
      "LicenseShortName|License|Artist|Credit|UsageTerms|AttributionRequired",
    titles: titles.join("|"),
  });
  const response = await fetch(`${API}?${params}`, {
    headers: { "User-Agent": "cosmeticsbatch-logo-licence-audit/1.0" },
  });
  if (!response.ok) throw new Error(`Commons returned ${response.status}`);
  const body = await response.json();
  const out = new Map();
  for (const page of Object.values(body.query?.pages ?? {})) {
    const meta = page.imageinfo?.[0]?.extmetadata ?? {};
    out.set(page.title, {
      licence: plain(meta.LicenseShortName?.value),
      licenceId: plain(meta.License?.value),
      author: plain(meta.Artist?.value),
      source: plain(meta.Credit?.value),
      attributionRequired: plain(meta.AttributionRequired?.value) === "true",
    });
  }
  return out;
}

const inventory = JSON.parse(readFileSync(INVENTORY, "utf8"));
const slugs = Object.keys(inventory).filter((slug) => inventory[slug].commonsFile);
const titles = slugs.map((slug) => `File:${inventory[slug].commonsFile}`);

const metadata = new Map();
for (let i = 0; i < titles.length; i += BATCH) {
  const batch = await fetchMetadata(titles.slice(i, i + BATCH));
  for (const [title, value] of batch) metadata.set(title, value);
  if (i + BATCH < titles.length) await new Promise((r) => setTimeout(r, 400));
}

let missing = 0;
for (const slug of slugs) {
  const found = metadata.get(`File:${inventory[slug].commonsFile}`);
  if (!found?.licence) {
    missing += 1;
    console.warn(`  no licence returned for ${slug} (${inventory[slug].commonsFile})`);
    continue;
  }
  // Key order is fixed so a re-run produces no incidental diff.
  inventory[slug] = {
    ...inventory[slug],
    licence: found.licence,
    licenceId: found.licenceId,
    licenceAuthor: found.author,
    licenceSource: found.source,
    attributionRequired: found.attributionRequired,
  };
}

writeFileSync(INVENTORY, `${JSON.stringify(inventory, null, 2)}\n`);

const counts = new Map();
for (const slug of slugs) {
  const licence = inventory[slug].licence ?? "(unknown)";
  counts.set(licence, (counts.get(licence) ?? 0) + 1);
}
console.log(`${INVENTORY}: ${slugs.length} logos`);
for (const [licence, n] of [...counts].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(3)}  ${licence}`);
}
const needsAttribution = slugs.filter((slug) => inventory[slug].attributionRequired);
console.log(
  needsAttribution.length
    ? `\nattribution required: ${needsAttribution.join(", ")}`
    : "\nattribution required: none",
);
if (missing) process.exitCode = 1;
