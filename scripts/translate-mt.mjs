#!/usr/bin/env node
// Fast, key-free machine translation of messages/en.json via Google's gtx
// endpoint. Placeholders ({name}, {count}, …) are preserved by the engine; as a
// safety net, if a translation's placeholder set doesn't match the source we
// keep the English original for that string (so nothing renders broken).
//
// Usage: node scripts/translate-mt.mjs            # all locales below
//        node scripts/translate-mt.mjs it nl pl   # specific locales
import { readFileSync, writeFileSync, existsSync } from "node:fs";

// app locale code -> Google translate target code. Merge mode: only keys
// missing from (or still equal to English in) an existing file get translated,
// so prior translations are preserved.
const LANGS = {
  es: "es", fr: "fr", de: "de", pt: "pt", ru: "ru", ar: "ar", zh: "zh-CN",
  tr: "tr", it: "it", nl: "nl", pl: "pl", sv: "sv", uk: "uk", el: "el",
  cs: "cs", nb: "no", da: "da", fi: "fi", ro: "ro", hu: "hu", ca: "ca",
  sr: "sr", bg: "bg", sk: "sk",
  // The rest of ACTIVE in src/i18n/locales.ts — these were missing, so every new
  // UI key silently fell back to English in half the supported languages.
  ja: "ja", ko: "ko", hi: "hi", id: "id", vi: "vi", th: "th", ms: "ms",
  tl: "tl", bn: "bn", ur: "ur", ta: "ta", te: "te", mr: "mr", pa: "pa",
  gu: "gu", yue: "zh-TW", uz: "uz", az: "az", kk: "kk",
};

const en = JSON.parse(readFileSync("messages/en.json", "utf8"));
const leaves = [];
(function walk(o, path) {
  for (const [k, v] of Object.entries(o)) {
    const p = [...path, k];
    if (v && typeof v === "object" && !Array.isArray(v)) walk(v, p);
    else leaves.push([p, String(v)]);
  }
})(en, []);

const ph = (s) => (s.match(/\{[^}]+\}/g) || []).sort().join("|");

async function translate(text, tl, tries = 4) {
  if (!/[a-zA-Z]/.test(text)) return text;
  // Mask placeholders with sentinels the engine leaves alone, translate, then
  // restore. If any sentinel is lost, fall back to the English source.
  const phs = text.match(/\{[^}]+\}/g) || [];
  let masked = text;
  phs.forEach((p, i) => {
    masked = masked.replace(p, ` xph${i}x `);
  });
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=` +
    encodeURIComponent(masked);
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      let out = j[0].map((seg) => seg[0]).join("");
      let ok = true;
      phs.forEach((p, k) => {
        const re = new RegExp(`\\s*x\\s*ph\\s*${k}\\s*x\\s*`, "i");
        if (re.test(out)) out = out.replace(re, p);
        else ok = false;
      });
      return ok && ph(out) === ph(text) ? out.trim() : text;
    } catch {
      await new Promise((res) => setTimeout(res, 500 * (i + 1)));
    }
  }
  return text;
}

function setPath(obj, path, val) {
  let o = obj;
  for (let i = 0; i < path.length - 1; i++) o = o[path[i]] ??= {};
  o[path[path.length - 1]] = val;
}

async function pool(items, size, fn) {
  const idx = [...items.keys()];
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (idx.length) await fn(items[idx.shift()]);
    }),
  );
}

const only = process.argv.slice(2);
const force = only.includes("--force");
const codes = only.filter((c) => !c.startsWith("--"));
const getAt = (obj, path) => path.reduce((o, k) => (o == null ? o : o[k]), obj);

for (const [code, tl] of Object.entries(LANGS)) {
  if (codes.length && !codes.includes(code)) continue;
  const path = `messages/${code}.json`;
  const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
  const out = structuredClone(existing);
  // Only translate keys that are missing or still identical to English.
  const todo = leaves.filter(([p, v]) => {
    if (force) return true;
    const e = getAt(existing, p);
    return e === undefined || e === v;
  });
  await pool(todo, 6, async ([p, v]) => {
    setPath(out, p, await translate(v, tl));
  });
  JSON.parse(JSON.stringify(out));
  writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
  console.log(`${code}: translated ${todo.length}/${leaves.length}`);
}
console.log("done");
