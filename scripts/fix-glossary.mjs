#!/usr/bin/env node
/**
 * Fixes the terms machine translation gets wrong for search.
 *
 * A translator optimises for correctness, not for the words people type. Google
 * renders "batch code" into Russian as «пакетный код» — defensible, and nobody
 * searches it: Search Console shows «батч код» and «код партии». Turkish users
 * type "batch kodu", not "parti kodu". Getting this wrong means a page that is
 * fluent, accurate and invisible.
 *
 *   node scripts/fix-glossary.mjs            # every locale below
 *   node scripts/fix-glossary.mjs ru tr
 *
 * Runs over both dictionaries (UI strings and long-form content), is idempotent,
 * and is safe to re-run after every translation pass.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

/** Keep the capitalisation of the phrase we replaced — these sit in headings. */
const matchCase = (source, replacement) =>
  /^\p{Lu}/u.test(source)
    ? replacement[0].toUpperCase() + replacement.slice(1)
    : replacement;

// NB: JavaScript's \w is ASCII-only, so a Cyrillic word never matches it. Use
// explicit letter classes (or \p{L} with /u) or the rules silently do nothing —
// which is exactly what happened on the first pass.
const RU_CYR = "[\\u0430-\\u044f\\u0451]";

/** locale -> [pattern, replacement] pairs, applied in order. */
const GLOSSARY = {
  ru: [
    // «пакетный код» — a fluent, accurate translation nobody searches for.
    // Search Console says «батч-код». Any case, any inflection.
    [
      new RegExp(`(пакетн${RU_CYR}*)\\s+(код${RU_CYR}*)`, "giu"),
      (m, _adj, code) => matchCase(m, `батч-${code.toLowerCase()}`),
    ],
  ],
  tr: [
    [
      /(parti)\s+(kod(?:u|ları|unu|una|unda|undan|larını))/giu,
      (m, _p, code) => matchCase(m, `batch ${code.toLowerCase()}`),
    ],
  ],
  uk: [
    [
      new RegExp(`(пакетн${RU_CYR}*)\\s+(код${RU_CYR}*)`, "giu"),
      (m, _adj, code) => matchCase(m, `батч-${code.toLowerCase()}`),
    ],
  ],
};

const files = (code) => [
  `messages/${code}.json`,
  `messages/content/${code}.json`,
];

const only = process.argv.slice(2);

for (const [code, rules] of Object.entries(GLOSSARY)) {
  if (only.length && !only.includes(code)) continue;
  for (const path of files(code)) {
    if (!existsSync(path)) continue;
    const before = readFileSync(path, "utf8");
    let after = before;
    for (const [pattern, replacement] of rules) {
      after = after.replace(pattern, replacement);
    }
    if (after !== before) {
      JSON.parse(after); // never write a file we just corrupted
      writeFileSync(path, after);
      const hits = before.length - after.length;
      console.log(`${path}: rewritten (${hits > 0 ? "-" : "+"}${Math.abs(hits)} chars)`);
    } else {
      console.log(`${path}: nothing to fix`);
    }
  }
}
