import type { MetadataRoute } from "next";
import { ALL_BRANDS } from "@/lib/brands";
import { DECODER_GUIDES } from "@/lib/decoder-guides";
import { GUIDES } from "@/lib/guides";
import { absoluteUrl, site } from "@/lib/site";
import { localizedPath } from "@/lib/seo";
import {
  INDEXABLE_LOCALES,
  ENGLISH_ONLY_LOCALES,
  indexableBrandLocales,
  indexableContentLocales,
} from "@/lib/publishing-policy";
import { reviewedContentLocales } from "@/lib/content-review";

/** Search exposure follows the central publishing policy. Functional routes
 * outside the approved locale/content matrix remain available but do not
 * appear here and carry page-level noindex metadata. */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(site.contentUpdated);

  const entries = (
    path: string,
    lastModified: Date,
    changeFrequency: "weekly" | "monthly",
    priority: number,
    localeCodes: readonly string[] = INDEXABLE_LOCALES,
  ): MetadataRoute.Sitemap =>
    localeCodes.map((locale) => ({
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
    ...entries("/about", updated, "monthly", 0.6, ENGLISH_ONLY_LOCALES),
    ...entries("/contact", updated, "monthly", 0.6, ENGLISH_ONLY_LOCALES),
    ...entries("/privacy", updated, "monthly", 0.3, ENGLISH_ONLY_LOCALES),
    ...entries("/terms", updated, "monthly", 0.3, ENGLISH_ONLY_LOCALES),
  ];
  const publicBrands = ALL_BRANDS.filter(
    (brand) => !brand.hidden && indexableBrandLocales(brand.slug).length > 0,
  );
  const brandEntries = publicBrands.flatMap((brand) =>
    entries(
      `/brands/${brand.slug}`,
      updated,
      "monthly",
      0.8,
      indexableBrandLocales(brand.slug),
    ),
  );
  const decoderEntries = DECODER_GUIDES.flatMap((guide) =>
    entries(
      `/decoders/${guide.slug}`,
      new Date(guide.updated),
      "monthly",
      0.9,
      indexableContentLocales(reviewedContentLocales(`dec.${guide.slug}`)),
    ),
  );
  const guideEntries = GUIDES.flatMap((guide) =>
    entries(
      `/guides/${guide.slug}`,
      new Date(guide.updated),
      "monthly",
      0.6,
      indexableContentLocales(reviewedContentLocales(`guide.${guide.slug}`)),
    ),
  );

  return [...routeEntries, ...brandEntries, ...decoderEntries, ...guideEntries];
}
