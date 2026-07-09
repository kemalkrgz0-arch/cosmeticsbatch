#!/usr/bin/env node
/**
 * Machine-translation pipeline for message dictionaries.
 *
 * Reads messages/en.json (the source of truth) and, for every target locale,
 * fills in any missing/again-changed keys by machine-translating them, writing
 * messages/<code>.json. English keys already present in a target file are kept
 * (so human edits survive); pass --force to retranslate everything.
 *
 * Usage:
 *   AI_GATEWAY_API_KEY=…  node scripts/translate.mjs                 # all planned locales
 *   node scripts/translate.mjs es fr de                             # specific locales
 *   node scripts/translate.mjs --all                                # every code in the registry
 *   node scripts/translate.mjs --force es                           # retranslate es from scratch
 *
 * Provider: Vercel AI Gateway (https://vercel.com/docs/ai-gateway). Set
 * AI_GATEWAY_API_KEY. Override the model with TRANSLATE_MODEL (default
 * "anthropic/claude-haiku-4-5"). Swap `translateBatch` if you prefer DeepL/etc.
 *
 * ICU placeholders like {name}, {group}, {shelf} and literal product/brand
 * names MUST be preserved verbatim — this is enforced in the prompt and
 * validated after each response.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MSG_DIR = join(ROOT, "messages");

// Keep this list in sync with src/i18n/locales.ts (ALL_LOCALES).
const LANGS = {
  es: "Spanish", fr: "French", de: "German", pt: "Portuguese", ru: "Russian",
  ar: "Arabic", zh: "Mandarin Chinese", ja: "Japanese", hi: "Hindi", ko: "Korean",
  tr: "Turkish", it: "Italian", id: "Indonesian", nl: "Dutch", pl: "Polish",
  fa: "Persian (Farsi)", vi: "Vietnamese", sv: "Swedish", uk: "Ukrainian",
  yue: "Cantonese", th: "Thai", tl: "Tagalog", el: "Greek", cs: "Czech",
  he: "Hebrew", nb: "Norwegian Bokmål", da: "Danish", fi: "Finnish",
  bn: "Bengali", ur: "Urdu", sw: "Swahili", ro: "Romanian", hu: "Hungarian",
  ca: "Catalan", ms: "Malay", pa: "Punjabi", ta: "Tamil", te: "Telugu",
  mr: "Marathi", gu: "Gujarati", uz: "Uzbek", az: "Azerbaijani", kk: "Kazakh",
  am: "Amharic", ha: "Hausa", yo: "Yoruba", sr: "Serbian", bg: "Bulgarian",
  sk: "Slovak",
};

const MODEL = process.env.TRANSLATE_MODEL || "anthropic/claude-haiku-4-5";
const API_KEY = process.env.AI_GATEWAY_API_KEY;

const args = process.argv.slice(2);
const force = args.includes("--force");
const all = args.includes("--all");
// Optional --keys=a.b,c.d limits translation to specific dotted keys (leaves
// every other still-English key untouched — useful when adding a few strings).
const keysArg = args.find((a) => a.startsWith("--keys="));
const onlyKeys = keysArg ? new Set(keysArg.slice("--keys=".length).split(",")) : null;
const picked = args.filter((a) => !a.startsWith("--"));
const targets = all ? Object.keys(LANGS) : picked.length ? picked : Object.keys(LANGS);

const en = JSON.parse(readFileSync(join(MSG_DIR, "en.json"), "utf8"));

/** Flatten nested dict to dotted keys. */
function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}
function setDeep(obj, dotted, value) {
  const parts = dotted.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]] ??= {};
  cur[parts[parts.length - 1]] = value;
}

async function translateBatch(entries, langName) {
  // entries: [{key, text}] -> returns { key: translated }
  if (!API_KEY) throw new Error("Set AI_GATEWAY_API_KEY to run translation.");
  const payload = Object.fromEntries(entries.map((e) => [e.key, e.text]));
  const prompt = [
    `Translate the JSON string VALUES below from English into ${langName}.`,
    `Rules:`,
    `- Return ONLY a JSON object with the same keys and translated values.`,
    `- Preserve every ICU placeholder token EXACTLY, e.g. {name}, {group}, {shelf}, {pao}, {code}, {date}, {noun}, {n}, {year}, {category}, {decoder}. Do not translate, reorder characters inside, or remove them.`,
    `- Keep brand names, "PAO", "M" month markers, "EAN/UPC", example codes (like 4135, 22U401, 24M) and numbers unchanged.`,
    `- Use natural, fluent marketing/help-centre tone. Keep it concise.`,
    ``,
    JSON.stringify(payload, null, 2),
  ].join("\n");

  const res = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });
  if (!res.ok) throw new Error(`Gateway ${res.status}: ${await res.text()}`);
  const data = await res.json();
  // Some gateway models reject response_format:json_object, and others wrap the
  // JSON in ```json fences — extract the first {...} block defensively.
  const raw = data.choices[0].message.content;
  const match = raw.match(/\{[\s\S]*\}/);
  const out = JSON.parse(match ? match[0] : raw);

  // Validate placeholders survived.
  for (const { key, text } of entries) {
    const want = [...text.matchAll(/\{[^}]+\}/g)].map((m) => m[0]).sort();
    const got = [...String(out[key] ?? "").matchAll(/\{[^}]+\}/g)].map((m) => m[0]).sort();
    if (want.join() !== got.join())
      console.warn(`  ⚠ placeholder mismatch on "${key}" — keeping English`);
    if (want.join() !== got.join()) out[key] = text;
  }
  return out;
}

const chunk = (arr, n) => arr.reduce((a, _, i) => (i % n ? a : [...a, arr.slice(i, i + n)]), []);

for (const code of targets) {
  if (code === "en") continue;
  const langName = LANGS[code];
  if (!langName) { console.warn(`skip unknown locale ${code}`); continue; }

  const path = join(MSG_DIR, `${code}.json`);
  const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
  const flatEn = flatten(en);
  const flatEx = flatten(existing);

  const todo = Object.entries(flatEn)
    .filter(([k]) => !onlyKeys || onlyKeys.has(k))
    .filter(([k, v]) => force || flatEx[k] === undefined || flatEx[k] === v)
    .map(([key, text]) => ({ key, text }));

  if (!todo.length) { console.log(`${code}: up to date`); continue; }
  console.log(`${code} (${langName}): translating ${todo.length} keys…`);

  const result = force ? {} : structuredClone(existing);
  for (const batch of chunk(todo, 40)) {
    const translated = await translateBatch(batch, langName);
    for (const { key } of batch) setDeep(result, key, translated[key] ?? flatEn[key]);
  }
  writeFileSync(path, JSON.stringify(result, null, 2) + "\n");
  console.log(`  ✓ wrote messages/${code}.json`);
}

console.log("Done. Activate a locale by adding its code to ACTIVE in src/i18n/locales.ts.");
