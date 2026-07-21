import type { BrandTheme } from "./brand-theme";

/**
 * Owner-approved local hero artwork. Keep palette tokens in `BRAND_THEMES` and
 * artwork/crop data here so a new delivery is one small, reviewable change.
 * Paths must live under public/brands/heroes and are regression-tested.
 */
export const BRAND_HERO_ASSETS: Record<string, Pick<BrandTheme,
  "heroImage" | "mobileHeroImage" | "focalPosition" | "mobileFocalPosition"
>> = {
  "estee-lauder": {
    heroImage: "/brands/heroes/estee-lauder-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "76% 50%",
  },
  vichy: {
    heroImage: "/brands/heroes/vichy-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "76% 50%",
  },
  loreal: {
    heroImage: "/brands/heroes/loreal-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "78% 50%",
  },
  "loreal-paris": {
    heroImage: "/brands/heroes/loreal-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "78% 50%",
  },
  kerastase: {
    heroImage: "/brands/heroes/kerastase-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "78% 50%",
  },
  dior: {
    heroImage: "/brands/heroes/dior-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "76% 50%",
  },
  lancome: {
    heroImage: "/brands/heroes/lancome-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "76% 50%",
  },
  nivea: {
    heroImage: "/brands/heroes/nivea-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "76% 50%",
  },
  // Delivered 2026-07-21, one batch, all 1774x887 like the earlier set. Each
  // stands its products in the right-hand half against empty travertine, so the
  // mobile focal point follows the products rather than the wall. The values
  // differ per image because the group starts at a different point in each.
  chanel: {
    heroImage: "/brands/heroes/chanel-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "78% 50%",
  },
  cerave: {
    heroImage: "/brands/heroes/cerave-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "78% 50%",
  },
  creed: {
    heroImage: "/brands/heroes/creed-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "76% 50%",
  },
  maybelline: {
    heroImage: "/brands/heroes/maybelline-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "76% 50%",
  },
  "mac-cosmetics": {
    heroImage: "/brands/heroes/mac-cosmetics-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "74% 50%",
  },
  "paco-rabanne": {
    heroImage: "/brands/heroes/paco-rabanne-hero.jpg",
    mobileHeroImage: undefined,
    focalPosition: "50% 50%",
    mobileFocalPosition: "72% 50%",
  },
};

export function brandHeroAsset(slug: string) {
  return BRAND_HERO_ASSETS[slug];
}
