/**
 * The brands whose pages are indexable, and the sample code decoded on each.
 *
 * Every brand page is generated from one template per decoder family. This
 * registry identifies the subset with additional brand-specific evidence and
 * remains the quality/monetization threshold even while public index coverage
 * is broader:
 *
 *   - a real, format-valid sample code, decoded on the page by the live engine
 *     (guarded by scripts/verify-decoder-examples.ts, so it can't silently rot);
 *   - where the code sits on this brand's own packaging;
 *   - answers to the questions people demonstrably ask about this brand.
 *
 * The list is demand-driven, not taste-driven: every entry earned its place in
 * Search Console. Most of the demand is Russian ("проверить срок годности",
 * "проверить оригинальность"), which is why the prose lives in messages/ and is
 * translated — an English answer on a Russian page serves nobody. Only the code
 * itself stays here, because a machine translator would happily mangle 22U401.
 *
 * The cipher is NOT restated here. It belongs to the manufacturer and is
 * documented once under /decoders.
 *
 * To add a brand: add its sample code here and its prose under `brandDetail.
 * <slug>` in messages/en.json, then run `node scripts/translate-mt.mjs`. Don't
 * add a brand you have nothing brand-specific to say about — an entry that just
 * paraphrases the decoder page is the scaled content this structure exists to
 * avoid.
 */
export interface BrandDetail {
  /** Format-valid example, decoded live on the page by the brand's own decoder. */
  sampleCode: string;
}

/** Last manual editorial/decoder review of the monetizable brand collection. */
export const BRAND_DETAILS_UPDATED = "2026-07-14";

/** How many where/FAQ entries a page will probe for in messages. */
export const MAX_WHERE_LINES = 4;
export const MAX_FAQ_ITEMS = 4;

export const BRAND_DETAILS: Record<string, BrandDetail> = {
  // ---- L'Oréal group: the largest cluster of real search demand ------------
  vichy: { sampleCode: "22U401" },
  "loreal-paris": { sampleCode: "22U401" },
  loreal: { sampleCode: "40X200" },
  garnier: { sampleCode: "31YO500" },
  cerave: { sampleCode: "40X200" },
  kerastase: { sampleCode: "22U401" },
  "la-roche-posay": { sampleCode: "31YO500" },
  redken: { sampleCode: "40X200" },
  kiehls: { sampleCode: "22U401" },
  maybelline: { sampleCode: "40X200" },
  lancome: { sampleCode: "31YO500" },
  "ysl-beauty": { sampleCode: "22U401" },
  "giorgio-armani-beauty": { sampleCode: "40X200" },

  // ---- Estée Lauder group -------------------------------------------------
  "estee-lauder": { sampleCode: "A56" },
  "mac-cosmetics": { sampleCode: "B23" },
  clinique: { sampleCode: "A56" },
  "tom-ford-beauty": { sampleCode: "EA4" },
  "too-faced": { sampleCode: "B23" },

  // ---- LVMH + Chanel ------------------------------------------------------
  dior: { sampleCode: "3245" },
  chanel: { sampleCode: "3245" },
  "kenzo-parfums": { sampleCode: "24045" },
  guerlain: { sampleCode: "3245" },
  "fenty-beauty": { sampleCode: "231122" },

  // ---- Coty ---------------------------------------------------------------
  "hugo-boss": { sampleCode: "4135" },
  "calvin-klein": { sampleCode: "4135" },
  "roberto-cavalli": { sampleCode: "4135" },

  // ---- Puig ---------------------------------------------------------------
  "paco-rabanne": { sampleCode: "4135" },
  "jean-paul-gaultier": { sampleCode: "24045" },
  "carolina-herrera": { sampleCode: "231122" },
  zara: { sampleCode: "4135" },

  // ---- Inter Parfums ------------------------------------------------------
  montblanc: { sampleCode: "08J38J169" },
  dunhill: { sampleCode: "08J38J169" },

  // ---- Independents -------------------------------------------------------
  creed: { sampleCode: "Q5501" },
  nivea: { sampleCode: "8153554" },
};

export function brandDetail(slug: string): BrandDetail | undefined {
  return BRAND_DETAILS[slug];
}
