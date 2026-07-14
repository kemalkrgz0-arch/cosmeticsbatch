export const LOREAL_GROUP_NAME = "L'Oréal Group";

export const LOREAL_OFFICIAL_PORTFOLIO_URL =
  "https://www.loreal.com/en/our-global-brands-portfolio/";

/** Owner-approved, demand-led L'Oréal locale set. */
export const LOREAL_PRIORITY_LOCALES = [
  "en",
  "ru",
  "es",
  "ja",
  "it",
  "tr",
  "de",
  "id",
  "vi",
  "sv",
] as const;

export function isLorealGroupBrand(brand: { group: string }): boolean {
  return brand.group === LOREAL_GROUP_NAME;
}

export function isLorealPriorityLocale(locale: string): boolean {
  return (LOREAL_PRIORITY_LOCALES as readonly string[]).includes(locale);
}
