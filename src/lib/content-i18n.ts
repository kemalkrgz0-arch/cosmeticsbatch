import "server-only";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import type { Guide } from "./guides";
import type { DecoderGuide } from "./decoder-guides";

/**
 * Translations for the long-form content that lives in TypeScript modules —
 * the guides ([[guides]]) and the code-format references ([[decoder-guides]]).
 *
 * Those modules stay the English source of truth: they are where the content is
 * written, reviewed and versioned. This layer only *looks up* a translation for
 * a given key and falls back to the English string when there isn't one, so a
 * missing or half-finished locale degrades to English instead of breaking.
 *
 * The dictionaries are generated, not hand-maintained:
 *
 *   node scripts/extract-content.mjs     # TS modules  -> messages/content/en.json
 *   node scripts/translate-content.mjs   # en.json     -> the other locales
 *
 * Keys are derived from the content's shape (`guide.<slug>.s2.b1`), so adding a
 * paragraph shifts nothing else — and re-running the extractor is what keeps the
 * key space honest.
 */
type Dict = Record<string, string>;

const cache = new Map<string, Dict>();

async function load(locale: string): Promise<Dict> {
  const cached = cache.get(locale);
  if (cached) return cached;
  let dict: Dict = {};
  try {
    // Locale files are generated; a locale with no file yet is not an error.
    dict = (await import(`../../messages/content/${locale}.json`)).default;
  } catch {
    dict = {};
  }
  cache.set(locale, dict);
  return dict;
}

/**
 * Translator for one locale. `t(key, english)` returns the translation, or the
 * English source when the locale has no entry for that key — never a key path,
 * never an empty string.
 */
export async function contentTranslator(
  locale: string,
): Promise<(key: string, english: string) => string> {
  if (locale === DEFAULT_LOCALE) return (_key, english) => english;
  const dict = await load(locale);
  return (key, english) => dict[key] || english;
}

export type ContentT = (key: string, english: string) => string;

/**
 * Same guide, translated. The key scheme mirrors scripts/extract-content.ts — if
 * you change one, change the other, and re-run the extractor.
 */
export function localizeGuide(guide: Guide, t: ContentT): Guide {
  const k = `guide.${guide.slug}`;
  return {
    ...guide,
    title: t(`${k}.title`, guide.title),
    description: t(`${k}.desc`, guide.description),
    sections: guide.sections.map((s, i) => ({
      ...s,
      heading: t(`${k}.s${i}.h`, s.heading),
      body: s.body.map((b, j) => t(`${k}.s${i}.b${j}`, b)),
    })),
    faq: guide.faq?.map((f, i) => ({
      q: t(`${k}.faq${i}.q`, f.q),
      a: t(`${k}.faq${i}.a`, f.a),
    })),
    seeAlso: guide.seeAlso?.map((l, i) => ({
      ...l,
      label: t(`${k}.also${i}`, l.label),
    })),
  };
}

/** Same reference page, translated. Codes and anatomy characters are untouched. */
export function localizeDecoderGuide(
  guide: DecoderGuide,
  t: ContentT,
): DecoderGuide {
  const k = `dec.${guide.slug}`;
  return {
    ...guide,
    title: t(`${k}.title`, guide.title),
    description: t(`${k}.desc`, guide.description),
    anatomy: {
      ...guide.anatomy,
      parts: guide.anatomy.parts.map((p, i) => ({
        ...p,
        means: t(`${k}.anat${i}`, p.means),
      })),
    },
    examples: guide.examples.map((e, i) => ({
      ...e,
      note: e.note ? t(`${k}.ex${i}`, e.note) : e.note,
    })),
    sections: guide.sections.map((s, i) => ({
      ...s,
      heading: t(`${k}.s${i}.h`, s.heading),
      body: s.body.map((b, j) => t(`${k}.s${i}.b${j}`, b)),
    })),
    faq: guide.faq.map((f, i) => ({
      q: t(`${k}.faq${i}.q`, f.q),
      a: t(`${k}.faq${i}.a`, f.a),
    })),
  };
}
