#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseTsv } from "./lib/tsv.mjs";

const SOURCE_ID = "GSC-2026-07-19-01";
const evidenceRoot = join(process.cwd(), "data", "search-performance");
const sourceRoot = join(evidenceRoot, "normalized", SOURCE_ID);
const output = join(evidenceRoot, "GROWTH_BASELINE.md");
const site = "https://cosmeticsbatch.com";

const tier1Countries = [
  ["Amerika Birleşik Devletleri", "United States", "en"],
  ["İngiltere", "United Kingdom", "en"],
  ["Kanada", "Canada", "en/fr"],
  ["Avustralya", "Australia", "en"],
  ["Almanya", "Germany", "de"],
  ["Fransa", "France", "fr"],
  ["İtalya", "Italy", "it"],
  ["Japonya", "Japan", "ja"],
];

function numeric(value) {
  const number = Number(value);
  assert.ok(Number.isFinite(number), `invalid numeric metric: ${value}`);
  return number;
}

function metrics(row) {
  return {
    clicks: numeric(row[1]),
    impressions: numeric(row[2]),
    ctr: numeric(row[3]),
    position: numeric(row[4]),
  };
}

function percent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

const pageRows = parseTsv(readFileSync(join(sourceRoot, "Sayfa-sayısı.tsv"), "utf8")).slice(1);
const brandRows = pageRows
  .filter((row) => new RegExp(`^${site.replaceAll(".", "\\.")}\/brands\/[^/?#]+\/?$`).test(row[0]))
  .map((row) => ({
    url: row[0].replace(/\/$/, ""),
    slug: row[0].replace(/\/$/, "").split("/").at(-1),
    ...metrics(row),
  }))
  .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks || a.slug.localeCompare(b.slug));

const countryRows = new Map(
  parseTsv(readFileSync(join(sourceRoot, "Ülkeler.tsv"), "utf8"))
    .slice(1)
    .map((row) => [row[0], metrics(row)]),
);

const filters = parseTsv(readFileSync(join(sourceRoot, "Filtreler.tsv"), "utf8"))
  .slice(1)
  .map(([key, value]) => `${key}: ${value}`)
  .join("; ");
const chart = parseTsv(readFileSync(join(sourceRoot, "Grafik.tsv"), "utf8")).slice(1);
const observedFrom = chart[0]?.[0] ?? "needs verification";
const observedTo = chart.at(-1)?.[0] ?? "needs verification";

const lines = [
  "# Growth measurement baseline",
  "",
  `Generated deterministically from \`${SOURCE_ID}\`. Re-run with`,
  "`npm run growth:baseline`; do not hand-edit measured tables.",
  "",
  "## Evidence boundary",
  "",
  `- Export filters: ${filters}.`,
  `- Observed chart rows: ${observedFrom} through ${observedTo}. Earlier omitted/zero-data days remain \`needs verification\`.`,
  "- Page and country tables are independent aggregates. They cannot be joined to infer a brand's country, query or locale.",
  "- Checker conversion, decode success, AdSense RPM and revenue are unavailable in this static GSC export and are shown as `not available`, never zero.",
  "- No private submissions, email, IP, account identifier or raw checked code is used.",
  "",
  "## Existing English brand URLs",
  "",
  "| Rank | Existing URL | Clicks | Impressions | CTR | Position | Checker conversion | Decode success | RPM/revenue |",
  "|---:|---|---:|---:|---:|---:|---|---|---|",
  ...brandRows.map((row, index) =>
    `| ${index + 1} | \`${row.url.slice(site.length)}\` | ${row.clicks} | ${row.impressions} | ${percent(row.ctr)} | ${row.position.toFixed(2)} | not available | not available | not available |`,
  ),
  "",
  "## Owner-approved Tier-1 markets",
  "",
  "| Market | Content locale | Clicks | Impressions | CTR | Position | RPM/revenue |",
  "|---|---|---:|---:|---:|---:|---|",
  ...tier1Countries.map(([sourceName, market, locale]) => {
    const row = countryRows.get(sourceName);
    return row
      ? `| ${market} | ${locale} | ${row.clicks} | ${row.impressions} | ${percent(row.ctr)} | ${row.position.toFixed(2)} | not available |`
      : `| ${market} | ${locale} | needs verification | needs verification | needs verification | needs verification | not available |`;
  }),
  "",
  "## Decision rules",
  "",
  "- Prioritize meaningful impressions near page one with weak CTR for a snippet experiment.",
  "- Prioritize meaningful views with weak checker conversion only after internal activity/check data is measured over the same window.",
  "- Do not infer country, query or locale performance for a brand by joining aggregate tables.",
  "- Do not add a URL from this report. Existing brand URLs remain the landing pages.",
  "- Add post-release 14/28-day comparisons to the experiment ledger; preserve this baseline.",
  "",
].join("\n");

writeFileSync(output, lines, "utf8");
console.log(`growth baseline written: ${brandRows.length} brands, ${tier1Countries.length} Tier-1 markets`);
