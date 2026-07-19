/**
 * English-only brand-detail additions that have not received native editorial
 * review in any retained non-English catalog. Keep visible fallback behavior
 * elsewhere, but never render these inside an otherwise localized brand block.
 */
export const NON_ENGLISH_BRAND_DETAIL_GAPS = new Set([
  "carolina-herrera.faq2a", "cerave.faq1a", "cerave.faq2a", "creed.faq2a",
  "dior.faq2a", "dior.faq4q", "dior.faq4a", "dunhill.faq2a",
  "escada.where1", "escada.where3", "escada.faq2a", "escada.faq4a",
  "garnier.faq1a", "guerlain.faq1a", "kenzo-parfums.faq2a",
  "kerastase.faq1a", "kiehls.faq1a", "la-roche-posay.faq1a",
  "loreal.faq2a", "loreal-paris.faq1a", "loreal-paris.faq3a",
  "mac-cosmetics.faq1a", "maybelline.faq1a", "montblanc.faq3q",
  "montblanc.faq3a", "nivea.faq1a", "paco-rabanne.faq2a",
  "redken.faq1a", "roberto-cavalli.faq1a", "vichy.faq1a",
]);

export function hasReviewedBrandDetailKey(locale: string, slug: string, key: string) {
  return locale === "en" || !NON_ENGLISH_BRAND_DETAIL_GAPS.has(`${slug}.${key}`);
}
