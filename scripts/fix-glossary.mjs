#!/usr/bin/env node
/**
 * Fixes the terms machine translation gets wrong for search.
 *
 * A translator optimises for correctness, not for the words people type. Google
 * renders "batch code" into Russian as «пакетный код» — defensible, and nobody
 * searches it: Search Console shows «батч код». A page that is fluent, accurate
 * and invisible is worth as much as no page.
 *
 *   node scripts/fix-glossary.mjs            # every locale below
 *   node scripts/fix-glossary.mjs ru tr
 *
 * Some rules are scoped to headings and metadata only. Turkish is the reason:
 * people search "batch kodu", so a title should say that — but the body of a
 * guide legitimately calls a lot code a "parti kodu", and rewriting the term
 * everywhere turned "a batch code (also called a lot code)" into a sentence that
 * defined the phrase with itself. Search terms belong in headings; prose should
 * read like prose.
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

// NB: JavaScript's \w is ASCII-only, so a Cyrillic word never matches it. Use an
// explicit letter class, or the rule silently does nothing — which is exactly
// what the first version of this script did.
const CYR = "[\\u0430-\\u044f\\u0451]";
const toBatchCode = (m, _adj, code) =>
  matchCase(m, `батч-${code.toLowerCase()}`);

/**
 * locale -> rules. `keys` (optional) limits a rule to matching key paths; without
 * it, the rule applies to every string in the locale.
 */
const GLOSSARY = {
  ru: [
    {
      // «пакетный код» is simply not the word anyone uses. Fix it everywhere.
      pattern: new RegExp(`(пакетн${CYR}*)\\s+(код${CYR}*)`, "giu"),
      replace: toBatchCode,
    },
  ],
  uk: [
    {
      pattern: new RegExp(`(пакетн${CYR}*)\\s+(код${CYR}*)`, "giu"),
      replace: toBatchCode,
    },
  ],
  tr: [
    {
      // "toplu kod" means "bulk code" — wrong wherever it appears.
      pattern: /(toplu)\s+(kod(?:u|ları|unu|una|unda|undan|larını)?)/giu,
      replace: (m, _t, code) => matchCase(m, `batch ${code.toLowerCase()}`),
    },
    {
      // Headings and metadata only — see the note at the top of this file.
      keys: /(\.title$|\.desc$|metaTitle|metaDescription|checkerTitle|\.s\d+\.h$)/,
      pattern: /(parti)\s+(kod(?:u|ları|unu|una|unda|undan|larını)?)/giu,
      replace: (m, _p, code) => matchCase(m, `batch ${code.toLowerCase()}`),
    },
  ],
};

/** Walk every string leaf, handing the rule its dotted key path. */
function mapStrings(obj, path, fn) {
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? `${path}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) mapStrings(v, p, fn);
    else if (typeof v === "string") obj[k] = fn(p, v);
  }
}

const only = process.argv.slice(2);

for (const [code, rules] of Object.entries(GLOSSARY)) {
  if (only.length && !only.includes(code)) continue;

  for (const path of [`messages/${code}.json`, `messages/content/${code}.json`]) {
    if (!existsSync(path)) continue;
    const dict = JSON.parse(readFileSync(path, "utf8"));
    let changed = 0;

    mapStrings(dict, "", (key, value) => {
      let out = value;
      for (const { keys, pattern, replace } of rules) {
        if (keys && !keys.test(key)) continue;
        out = out.replace(pattern, replace);
      }
      if (out !== value) changed++;
      return out;
    });

    if (changed) {
      writeFileSync(path, JSON.stringify(dict, null, 2) + "\n");
      console.log(`${path}: ${changed} strings rewritten`);
    } else {
      console.log(`${path}: nothing to fix`);
    }
  }
}
