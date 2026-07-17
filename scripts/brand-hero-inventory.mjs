import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const source = await readFile("src/lib/brands.ts", "utf8");
const manifest = await readFile("src/lib/brand-hero-assets.ts", "utf8");
const rows = source.slice(source.indexOf("const ROWS"), source.indexOf("const HIDDEN_SLUGS"));
const names = [...rows.matchAll(/^\s*\["([^"]+)"/gm)].map((match) => match[1]);
const hiddenStart = source.indexOf("const HIDDEN_SLUGS");
const hiddenBlock = source.slice(hiddenStart, source.indexOf("]);", hiddenStart));
const hidden = new Set([...hiddenBlock.matchAll(/^\s*"([a-z0-9-]+)",?$/gm)].map((match) => match[1]));
const slug = (name) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/['".]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const publicBrands = names.map((name) => ({ name, slug: slug(name) })).filter((brand) => !hidden.has(brand.slug));
const dir = "public/brands/heroes";
const files = await readdir(dir).catch(() => []);
const configured = new Set([...manifest.matchAll(/^\s{2}(?:"([a-z0-9-]+)"|([a-z0-9-]+)):\s*\{/gm)].map((match) => match[1] ?? match[2]));
const ready = publicBrands.filter((brand) => configured.has(brand.slug));
const missing = publicBrands.filter((brand) => !configured.has(brand.slug));
const oversized = [];
for (const file of files) {
  const bytes = (await stat(join(dir, file))).size;
  if (bytes > 700_000) oversized.push({ file, kb: Math.round(bytes / 1024) });
}
console.log(`Hero inventory: ${ready.length}/${publicBrands.length} public brands have artwork`);
console.log(`Missing: ${missing.length}`);
for (const brand of missing) console.log(`- ${brand.slug} — ${brand.name}`);
if (oversized.length) {
  console.log("\nFiles over 700 KB:");
  for (const item of oversized) console.log(`- ${item.file}: ${item.kb} KB`);
  process.exitCode = 1;
}
