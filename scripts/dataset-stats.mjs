#!/usr/bin/env node
/**
 * Summarise the user-check dataset (the JSONL files logCheck writes).
 *
 * Usage:
 *   node scripts/dataset-stats.mjs                 # reads ./.data
 *   DATASET_DIR=/data node scripts/dataset-stats.mjs
 *   node scripts/dataset-stats.mjs --csv > checks.csv   # flatten to CSV
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIR = process.env.DATASET_DIR || join(process.cwd(), ".data");
const csv = process.argv.includes("--csv");

if (!existsSync(DIR)) {
  console.error(`No dataset dir at ${DIR}`);
  process.exit(1);
}

const rows = [];
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".jsonl"))) {
  for (const line of readFileSync(join(DIR, f), "utf8").split("\n")) {
    if (line.trim()) {
      try { rows.push(JSON.parse(line)); } catch { /* skip bad line */ }
    }
  }
}

if (csv) {
  const cols = ["ts", "source", "brand", "code", "decoderId", "locale", "country", "confidence", "freshness", "mfg"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  console.log(cols.join(","));
  for (const r of rows) console.log(cols.map((c) => esc(r[c])).join(","));
  process.exit(0);
}

const top = (key, n = 10) => {
  const m = new Map();
  for (const r of rows) {
    const v = r[key] ?? "—";
    m.set(v, (m.get(v) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
};

const decoded = rows.filter((r) => r.mfg).length;
const pct = (x) => rows.length ? ((x / rows.length) * 100).toFixed(1) + "%" : "0%";

console.log(`\nDataset: ${rows.length} checks in ${DIR}\n`);
console.log(`Decoded (got a date): ${decoded} (${pct(decoded)})`);
console.log(`Source:`, Object.fromEntries(top("source", 5)));
console.log(`Confidence:`, Object.fromEntries(top("confidence", 5)));
console.log(`Freshness:`, Object.fromEntries(top("freshness", 6)));
console.log(`\nTop brands:`);
for (const [b, c] of top("brand", 15)) console.log(`  ${String(c).padStart(5)}  ${b}`);
console.log(`\nTop countries:`);
for (const [c, n] of top("country", 10)) console.log(`  ${String(n).padStart(5)}  ${c}`);
console.log(`\nTop locales:`);
for (const [l, n] of top("locale", 10)) console.log(`  ${String(n).padStart(5)}  ${l}`);
