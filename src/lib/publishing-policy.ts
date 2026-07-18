import { BRAND_DETAILS } from "./brand-detail";
import {
  FULL_QUALITY_LOCALES,
  INVESTMENT_PILOT_LOCALES,
  ORGANIC_PRESERVATION_LOCALES,
} from "../i18n/locales";

/** Maximum locale set approved for public search exposure. Routes outside this
 * set remain usable, but are excluded from sitemap/hreflang and marked noindex. */
export const INDEXABLE_LOCALES = [
  ...FULL_QUALITY_LOCALES,
  ...INVESTMENT_PILOT_LOCALES,
  ...ORGANIC_PRESERVATION_LOCALES,
] as const;

/** Demand-led brand program from the 2026-07-16 content audit. Inclusion here
 * is a work queue, not enough on its own to make a page indexable. */
export const PRIORITY_BRAND_SLUGS = [
  "loreal-paris", "nivea", "dior", "kerastase", "vichy", "lancome",
  "estee-lauder", "mac-cosmetics", "maybelline", "creed", "dove",
  "bottega-veneta", "paco-rabanne", "jean-paul-gaultier", "cerave",
  "chanel-beauty", "escada", "garnier", "innisfree", "jimmy-choo",
  "dunhill", "maison-margiela", "neutrogena", "loewe-perfumes",
  "guerlain", "kenzo-parfums", "gucci-beauty", "chanel",
  "roberto-cavalli", "color-wow", "kiehls", "chloe", "boucheron",
  "montblanc", "zara", "anua", "shiseido", "giorgio-armani-beauty",
  "carolina-herrera", "ysl-beauty", "prada-beauty",
  "nyx-professional-makeup", "nina-ricci", "moncler", "coach",
  "salvatore-ferragamo", "aesop", "beauty-of-joseon", "la-mer",
  "abercrombie-fitch",
] as const;

const indexableLocaleSet = new Set<string>(INDEXABLE_LOCALES);
const priorityBrandSet = new Set<string>(PRIORITY_BRAND_SLUGS);

export function isIndexableLocale(locale: string): boolean {
  return indexableLocaleSet.has(locale);
}

export function isPriorityBrand(slug: string): boolean {
  return priorityBrandSet.has(slug);
}

/** Initial brand rollout is deliberately English/Russian only and requires the
 * existing sample-code + brand-specific editorial record. More locale-brand
 * pairs are added only after their quality matrix row passes review. */
export function indexableBrandLocales(slug: string): readonly string[] {
  if (!isPriorityBrand(slug) || !Object.hasOwn(BRAND_DETAILS, slug)) return [];
  return ["en", "ru"];
}

export function isIndexableBrandPage(slug: string, locale: string): boolean {
  return indexableBrandLocales(slug).includes(locale);
}

export function indexableContentLocales(locales: readonly string[]): string[] {
  return locales.filter(isIndexableLocale);
}
