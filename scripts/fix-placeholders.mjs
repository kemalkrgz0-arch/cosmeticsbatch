#!/usr/bin/env node
/**
 * Repairs what machine translation does to interpolated strings.
 *
 * Two failure modes, both seen in production output:
 *
 *   "{n} min read"  ->  "{n}минута чтения"      (the space next to the
 *                                                placeholder is swallowed)
 *   "Updated {date}" -> "Обновлен{date}"        (same, other side)
 *
 * Left alone these render as «5минута чтения» — fluent-ish, visibly broken. And a
 * string that loses a placeholder outright is worse: it renders as a sentence with
 * a hole in it.
 *
 *   node scripts/fix-placeholders.mjs           # every locale
 *   node scripts/fix-placeholders.mjs ru de
 *
 * Rules, per string, against the English source:
 *   - placeholder set differs  -> revert to English (a hole is worse than English)
 *   - English has a space beside a placeholder and the translation doesn't -> restore it
 *
 * Idempotent. Run after every translation pass.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { readdirSync } from "node:fs";

const PH = /\{[^}]+\}/g;
const setOf = (s) => (s.match(PH) || []).sort().join("|");

/** Restore a space between a placeholder and an adjacent word where English has one. */
function fixSpacing(en, tr) {
  let out = tr;
  for (const ph of en.match(PH) || []) {
    const i = en.indexOf(ph);
    const spaceBefore = i > 0 && /\s/.test(en[i - 1]);
    const spaceAfter = /\s/.test(en[i + ph.length] ?? "");
    const esc = ph.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (spaceBefore) out = out.replace(new RegExp(`(\\S)${esc}`, "g"), `$1 ${ph}`);
    if (spaceAfter) out = out.replace(new RegExp(`${esc}(\\S)`, "g"), `${ph} $1`);
  }
  return out;
}

function walk(obj, path, fn) {
  for (const [k, v] of Object.entries(obj)) {
    const p = [...path, k];
    if (v && typeof v === "object" && !Array.isArray(v)) walk(v, p, fn);
    else fn(p, v, obj, k);
  }
}

const get = (obj, path) => path.reduce((o, k) => (o == null ? o : o[k]), obj);

const only = process.argv.slice(2);
const en = JSON.parse(readFileSync("messages/en.json", "utf8"));

const locales = readdirSync("messages")
  .filter((f) => f.endsWith(".json") && f !== "en.json")
  .map((f) => f.slice(0, -5))
  .filter((c) => !only.length || only.includes(c));

for (const code of locales) {
  const path = `messages/${code}.json`;
  if (!existsSync(path)) continue;
  const dict = JSON.parse(readFileSync(path, "utf8"));
  let reverted = 0;
  let respaced = 0;

  walk(dict, [], (p, value, parent, key) => {
    const source = get(en, p);
    if (typeof source !== "string" || typeof value !== "string") return;
    if (!PH.test(source)) return;
    PH.lastIndex = 0;

    if (setOf(source) !== setOf(value)) {
      parent[key] = source; // lost or mangled a placeholder — English is safer
      reverted++;
      return;
    }
    const fixed = fixSpacing(source, value);
    if (fixed !== value) {
      parent[key] = fixed;
      respaced++;
    }
  });

  if (reverted || respaced) {
    writeFileSync(path, JSON.stringify(dict, null, 2) + "\n");
    console.log(`${code}: ${respaced} respaced, ${reverted} reverted to English`);
  }
}
console.log("done");
