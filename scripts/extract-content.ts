/**
 * Flattens the long-form content that lives in TypeScript — the guides and the
 * code-format references — into messages/content/en.json, the source dictionary
 * that scripts/translate-content.mjs then translates.
 *
 *   npx tsx scripts/extract-content.ts
 *
 * The TS modules remain the source of truth: this only mirrors them. Keys are
 * derived from the content's structure, so they stay stable as long as the
 * ordering does — re-run this whenever a guide or reference page changes, then
 * re-run the translator to fill in the locales.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { GUIDES } from "../src/lib/guides";
import { DECODER_GUIDES } from "../src/lib/decoder-guides";

const dict: Record<string, string> = {};
const put = (key: string, text: string) => {
  if (text.trim()) dict[key] = text;
};

for (const g of GUIDES) {
  const k = `guide.${g.slug}`;
  put(`${k}.title`, g.title);
  put(`${k}.desc`, g.description);
  g.sections.forEach((s, i) => {
    put(`${k}.s${i}.h`, s.heading);
    s.body.forEach((b, j) => put(`${k}.s${i}.b${j}`, b));
  });
  g.faq?.forEach((f, i) => {
    put(`${k}.faq${i}.q`, f.q);
    put(`${k}.faq${i}.a`, f.a);
  });
  g.seeAlso?.forEach((l, i) => put(`${k}.also${i}`, l.label));
}

for (const d of DECODER_GUIDES) {
  const k = `dec.${d.slug}`;
  put(`${k}.title`, d.title);
  put(`${k}.desc`, d.description);
  d.anatomy.parts.forEach((p, i) => put(`${k}.anat${i}`, p.means));
  d.examples.forEach((e, i) => {
    if (e.note) put(`${k}.ex${i}`, e.note);
  });
  d.sections.forEach((s, i) => {
    put(`${k}.s${i}.h`, s.heading);
    s.body.forEach((b, j) => put(`${k}.s${i}.b${j}`, b));
  });
  d.faq.forEach((f, i) => {
    put(`${k}.faq${i}.q`, f.q);
    put(`${k}.faq${i}.a`, f.a);
  });
}

mkdirSync("messages/content", { recursive: true });
writeFileSync(
  "messages/content/en.json",
  JSON.stringify(dict, null, 2) + "\n",
  "utf8",
);

const words = Object.values(dict).reduce((n, s) => n + s.split(/\s+/).length, 0);
console.log(
  `messages/content/en.json — ${Object.keys(dict).length} strings, ${words} words`,
);
