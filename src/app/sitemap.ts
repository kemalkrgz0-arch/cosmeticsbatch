import type { MetadataRoute } from "next";
import { ALL_BRANDS } from "@/lib/brands";
import { DECODER_GUIDES } from "@/lib/decoder-guides";
import { GUIDES } from "@/lib/guides";
import { absoluteUrl, site } from "@/lib/site";
import { LOCALE_CODES } from "@/i18n/locales";
import { localizedPath } from "@/lib/seo";
import { isLorealGroupBrand } from "@/lib/loreal";

/**
 * Every public locale URL gets its own sitemap entry. Reciprocal hreflang stays
 * in page metadata; repeating the full 45-link set on every sitemap row would
 * create more than 500,000 XML links and exceed response/cache size limits.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(site.contentUpdated);

  const entries = (
    path: string,
    lastModified: Date,
    changeFrequency: "weekly" | "monthly",
    priority: number,
  ): MetadataRoute.Sitemap =>
    LOCALE_CODES.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      lastModified,
      changeFrequency,
      priority,
    }));

  const routeEntries = [
    ...entries("/", updated, "weekly", 1),
    ...entries("/brands", updated, "weekly", 0.8),
    ...entries("/check", updated, "weekly", 0.7),
    ...entries("/decoders", updated, "weekly", 0.8),
    ...entries("/guides", updated, "weekly", 0.8),
    ...entries("/about", updated, "monthly", 0.6),
    ...entries("/contact", updated, "monthly", 0.6),
    ...entries("/privacy", updated, "monthly", 0.3),
    ...entries("/terms", updated, "monthly", 0.3),
  ];
  const publicBrands = ALL_BRANDS.filter(
    (brand) => !brand.hidden || isLorealGroupBrand(brand),
  );
  const brandEntries = publicBrands.flatMap((brand) =>
    entries(`/brands/${brand.slug}`, updated, "monthly", 0.8),
  );
  const decoderEntries = DECODER_GUIDES.flatMap((guide) =>
    entries(`/decoders/${guide.slug}`, new Date(guide.updated), "monthly", 0.9),
  );
  const guideEntries = GUIDES.flatMap((guide) =>
    entries(`/guides/${guide.slug}`, new Date(guide.updated), "monthly", 0.6),
  );

  return [...routeEntries, ...brandEntries, ...decoderEntries, ...guideEntries];
}
