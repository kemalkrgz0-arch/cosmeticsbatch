export type BrandSnippet = {
  title: string;
  description: string;
};

/**
 * Evidence-led overrides for brand pages whose English search impressions are
 * already strong but whose generic snippet earns unusually few clicks.
 *
 * Keep this list deliberately small: an override needs page-level Search
 * Console evidence and must only promise facts supported by the page itself.
 */
const ENGLISH_BRAND_SNIPPETS: Readonly<Record<string, BrandSnippet>> = {
  "loreal-paris": {
    title: "L'Oréal Paris Batch Code Checker & Manufacture Date",
    description:
      "Check a L'Oréal Paris batch code to estimate its manufacture date and product age. Find the code on jar bases, tube crimps, bottles or labels.",
  },
  kerastase: {
    title: "Kérastase Batch Code Checker & Manufacture Date",
    description:
      "Check a Kérastase batch code to estimate its manufacture date and product age. Find the code near a bottle base, under a jar or on a tube crimp.",
  },
};

export function brandSnippet(
  locale: string,
  slug: string,
  fallback: BrandSnippet,
): BrandSnippet {
  return locale === "en" ? ENGLISH_BRAND_SNIPPETS[slug] ?? fallback : fallback;
}
