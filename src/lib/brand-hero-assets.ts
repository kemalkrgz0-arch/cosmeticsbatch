import type { BrandTheme } from "./brand-theme";

/**
 * Owner-approved local hero artwork. Keep palette tokens in `BRAND_THEMES` and
 * artwork/crop data here so a new delivery is one small, reviewable change.
 * Paths must live under public/brands/heroes and are regression-tested.
 */
export const BRAND_HERO_ASSETS: Record<string, Pick<BrandTheme,
  "heroImage" | "mobileHeroImage" | "focalPosition" | "mobileFocalPosition"
>> = {
  vichy: {
    heroImage: "/brands/heroes/vichy-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "76% 50%",
  },
};

export function brandHeroAsset(slug: string) {
  return BRAND_HERO_ASSETS[slug];
}
