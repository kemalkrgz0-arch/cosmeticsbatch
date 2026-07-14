#!/usr/bin/env node
/**
 * Re-translates the strings whose brand names the engine translated away.
 *
 * "The Ordinary" came back as «Обычный». Head & Shoulders as «Голова и плечи».
 * Creed as «вероучение», Coach as «тренер», Simple as «einfach». Fluent, and
 * naming products that do not exist — and invisible to anyone searching for the
 * brand. Every one of the 43 locales had them.
 *
 * The translators now mask brand names (scripts/lib/brand-names.mjs), so new
 * output is safe. This repairs what was already written: it finds every string
 * where the English source names a brand and the translation doesn't, and
 * re-translates just that string with the names masked.
 *
 *   node scripts/fix-brand-names.mjs           # every locale, both dictionaries
 *   node scripts/fix-brand-names.mjs ru de
 *
 * Hand-written strings (messages/content/reviewed.json) are never touched.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { BRAND_NAMES, maskBrands } from "./lib/brand-names.mjs";

const LANGS = {
  es: "es", fr: "fr", de: "de", pt: "pt", ru: "ru", ar: "ar", zh: "zh-CN",
  tr: "tr", it: "it", nl: "nl", pl: "pl", sv: "sv", uk: "uk", el: "el",
  cs: "cs", nb: "no", da: "da", fi: "fi", ro: "ro", hu: "hu", ca: "ca",
  sr: "sr", bg: "bg", sk: "sk", ja: "ja", ko: "ko", hi: "hi", id: "id",
  vi: "vi", th: "th", ms: "ms", tl: "tl", bn: "bn", ur: "ur", ta: "ta",
  te: "te", mr: "mr", pa: "pa", gu: "gu", yue: "zh-TW", uz: "uz", az: "az",
  kk: "kk",
};

const reviewed = existsSync("messages/content/reviewed.json")
  ? JSON.parse(readFileSync("messages/content/reviewed.json", "utf8"))
  : {};

async function translate(text, tl, tries = 4) {
  const { masked, restore } = maskBrands(text);
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=` +
    encodeURIComponent(masked);
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      return restore(j[0].map((s) => s[0]).join("")).trim() || text;
    } catch {
      await new Promise((res) => setTimeout(res, 800 * (i + 1)));
    }
  }
  return text;
}

async function pool(items, size, fn) {
  const idx = [...items.keys()];
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (idx.length) await fn(items[idx.shift()]);
    }),
  );
}

/** Brands named in an English string, longest first. */
const brandsIn = (text) =>
  BRAND_NAMES.filter((n) =>
    new RegExp(`(?<![\\p{L}\\d])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\d])`, "u").test(text),
  );

/** Walk string leaves of a nested dictionary, yielding [dottedKey, value, setter]. */
function* leaves(obj, path = "") {
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? `${path}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) yield* leaves(v, p);
    else if (typeof v === "string")
      yield [p, v, (next) => { obj[k] = next; }];
  }
}

const only = process.argv.slice(2);
const enContent = JSON.parse(readFileSync("messages/content/en.json", "utf8"));
const enUi = JSON.parse(readFileSync("messages/en.json", "utf8"));

for (const [code, tl] of Object.entries(LANGS)) {
  if (only.length && !only.includes(code)) continue;
  const done = new Set(reviewed[code] ?? []);
  let fixed = 0;

  for (const [path, english] of [
    ["messages/content", enContent],
    ["messages", enUi],
  ]) {
    const file = path === "messages" ? `messages/${code}.json` : `${path}/${code}.json`;
    if (!existsSync(file)) continue;
    const dict = JSON.parse(readFileSync(file, "utf8"));

    const broken = [];
    for (const [key, value, set] of leaves(dict)) {
      if (done.has(key)) continue; // hand-written — leave it alone
      const source =
        path === "messages"
          ? key.split(".").reduce((o, k) => (o == null ? o : o[k]), english)
          : english[key];
      if (typeof source !== "string") continue;
      const names = brandsIn(source);
      if (!names.length) continue;
      if (names.every((n) => value.includes(n))) continue; // all survived
      broken.push([source, set]);
    }

    if (!broken.length) continue;
    await pool(broken, 8, async ([source, set]) => {
      set(await translate(source, tl));
    });
    writeFileSync(file, JSON.stringify(dict, null, 2) + "\n");
    fixed += broken.length;
  }

  console.log(`${code}: ${fixed} strings re-translated with brand names protected`);
}
console.log("done");
