#!/usr/bin/env node
/**
 * Regenerate the per-locale brand-detail gap manifest.
 *
 * A gap is an English `brandDetail` key a given catalog does not have. The
 * brand page uses this to avoid pairing a localized question with an English
 * fallback answer — see `src/lib/locale-message-gaps.ts`.
 *
 * Generated rather than hand-written: the list was uniform across locales only
 * while no locale had been translated ahead of the others. Turkish now carries
 * all 30, so the manifest has to be per-locale, and a per-locale list is not
 * something anyone should maintain by hand.
 *
 *   node scripts/build-locale-message-gaps.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MESSAGES = "messages";
const OUTPUT = "src/lib/locale-message-gaps.json";

function flattenBrandDetail(catalog) {
  const keys = new Set();
  for (const [slug, fields] of Object.entries(catalog.brandDetail ?? {})) {
    for (const field of Object.keys(fields ?? {})) keys.add(`${slug}.${field}`);
  }
  return keys;
}

const english = flattenBrandDetail(
  JSON.parse(readFileSync(join(MESSAGES, "en.json"), "utf8")),
);

const gaps = {};
for (const file of readdirSync(MESSAGES).filter((name) => name.endsWith(".json")).sort()) {
  const locale = file.replace(/\.json$/, "");
  if (locale === "en") continue;
  const mine = flattenBrandDetail(JSON.parse(readFileSync(join(MESSAGES, file), "utf8")));
  const missing = [...english].filter((key) => !mine.has(key)).sort();
  if (missing.length) gaps[locale] = missing;
}

writeFileSync(OUTPUT, `${JSON.stringify(gaps, null, 2)}\n`);
const total = Object.values(gaps).reduce((sum, list) => sum + list.length, 0);
console.log(
  `${OUTPUT}: ${Object.keys(gaps).length} locale with gaps, ${total} keys total`,
);
