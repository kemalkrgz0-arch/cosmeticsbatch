#!/usr/bin/env node
/**
 * Translates the long-form content dictionary (messages/content/en.json, produced
 * by scripts/extract-content.ts) into every active locale, via Google's key-free
 * gtx endpoint — the same engine scripts/translate-mt.mjs uses for the UI strings.
 *
 *   npx tsx scripts/extract-content.ts        # refresh the English dictionary
 *   node scripts/translate-content.mjs        # translate into every locale
 *   node scripts/translate-content.mjs ru de  # or just these
 *   node scripts/translate-content.mjs --force ru
 *
 * Merge mode by default: a key already translated in a locale is left alone, so
 * hand-corrected strings survive a re-run. That matters — machine translation is
 * a starting point for these pages, not the finish line, and the whole point of
 * keying the content is that a human can improve one string without re-running
 * anything.
 *
 * Prose only. Batch codes (22U401), the anatomy tables and every example live in
 * TypeScript precisely so a translator can never touch them.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { maskBrands } from "./lib/brand-names.mjs";

// App locale -> Google target code. Every locale in src/i18n/locales.ts ACTIVE.
const LANGS = {
  es: "es", fr: "fr", de: "de", pt: "pt", ru: "ru", ar: "ar", zh: "zh-CN",
  tr: "tr", it: "it", nl: "nl", pl: "pl", sv: "sv", uk: "uk", el: "el",
  cs: "cs", nb: "no", da: "da", fi: "fi", ro: "ro", hu: "hu", ca: "ca",
  sr: "sr", bg: "bg", sk: "sk",
  ja: "ja", ko: "ko", hi: "hi", id: "id", vi: "vi", th: "th", ms: "ms",
  tl: "tl", bn: "bn", ur: "ur", ta: "ta", te: "te", mr: "mr", pa: "pa",
  gu: "gu", yue: "zh-TW", uz: "uz", az: "az", kk: "kk",
};

const SRC = "messages/content/en.json";
const en = JSON.parse(readFileSync(SRC, "utf8"));
const entries = Object.entries(en);

/**
 * Strings a human has written or corrected, as `{ "<locale>": ["<key>", …] }`.
 * The machine never touches these — not even with --force. Machine translation is
 * the floor for a locale, not the ceiling: every string that gets rewritten
 * properly is recorded here so the next translation pass cannot undo the work.
 */
const REVIEWED_PATH = "messages/content/reviewed.json";
const reviewed = existsSync(REVIEWED_PATH)
  ? JSON.parse(readFileSync(REVIEWED_PATH, "utf8"))
  : {};
const isReviewed = (code, key) => (reviewed[code] ?? []).includes(key);

async function translate(text, tl, tries = 4) {
  // Brand names are proper nouns and many of them are ordinary words — the engine
  // will happily turn "The Ordinary" into «Обычный» and Coach into «тренер».
  // Mask them, translate, put them back.
  const { masked, restore } = maskBrands(text);
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=` +
    encodeURIComponent(masked);
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      const out = restore(j[0].map((seg) => seg[0]).join(""));
      return out.trim() || text;
    } catch {
      await new Promise((res) => setTimeout(res, 800 * (i + 1)));
    }
  }
  // Four failures: keep English rather than dropping the string. The renderer
  // falls back to English anyway, so a gap is a degraded page, not a broken one.
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

const argv = process.argv.slice(2);
const force = argv.includes("--force");
const only = argv.filter((a) => !a.startsWith("--"));

mkdirSync("messages/content", { recursive: true });

for (const [code, tl] of Object.entries(LANGS)) {
  if (only.length && !only.includes(code)) continue;
  const path = `messages/content/${code}.json`;
  const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
  const out = { ...existing };

  const todo = entries.filter(
    ([k, v]) =>
      !isReviewed(code, k) && (force || !existing[k] || existing[k] === v),
  );
  const started = Date.now();
  await pool(todo, 8, async ([k, v]) => {
    out[k] = await translate(v, tl);
  });

  // Drop keys whose English source no longer exists (content was rewritten).
  for (const k of Object.keys(out)) if (!(k in en)) delete out[k];

  writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
  const secs = Math.round((Date.now() - started) / 1000);
  console.log(
    `${code}: ${todo.length} translated, ${Object.keys(out).length}/${entries.length} total (${secs}s)`,
  );
}
console.log("done");
