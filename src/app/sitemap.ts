import type { MetadataRoute } from "next";
import { INDEXED_BRANDS } from "@/lib/brands";
import { DECODER_GUIDES } from "@/lib/decoder-guides";
import { GUIDES } from "@/lib/guides";
import { absoluteUrl, site } from "@/lib/site";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { localizedPath, hreflangAlternates } from "@/lib/seo";
import { reviewedContentLocales } from "@/lib/content-review";

/**
 * One entry per path (at the default-locale URL), each declaring all language
 * versions via hreflang `alternates.languages`. Search engines discover and
 * index the other locales through the alternates, so we don't repeat every path
 * once per locale — keeping the sitemap ~8× smaller (one <loc> per page, not
 * one per page × language).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Stable content date, not `new Date()` — a real <lastmod> signal that only
  // moves when page content actually changes (see site.contentUpdated).
  const updated = new Date(site.contentUpdated);

  const entry = (
    path: string,
    lastModified: Date,
    changeFrequency: "weekly" | "monthly",
    priority: number,
    localeCodes?: readonly string[],
  ) => ({
    url: absoluteUrl(localizedPath(DEFAULT_LOCALE, path)),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: hreflangAlternates(path, localeCodes) },
  });

  const staticRoutes = [
    "/",
    "/brands",
    "/decoders",
    "/guides",
  ].map((path) => entry(path, updated, "weekly", path === "/" ? 1 : 0.8));
  // These routes currently have reviewed English copy only. Advertising them
  // as 44 translated alternates creates mixed-language duplicate pages.
  const englishOnlyRoutes = ["/about", "/contact", "/privacy", "/terms"].map((path) =>
    entry(path, updated, "monthly", path === "/about" || path === "/contact" ? 0.6 : 0.3, [DEFAULT_LOCALE]),
  );
  // Only the brands carrying their own editorial material (see brand-detail.ts).
  // The other ~180 are generated from one template per decoder family, are marked
  // noindex, and listing a noindex URL here would just spend crawl budget
  // contradicting ourselves. They stay reachable and crawlable via /brands.
  const brandRoutes = INDEXED_BRANDS.map((b) =>
    entry(`/brands/${b.slug}`, updated, "monthly", 0.8),
  );
  const decoderRoutes = DECODER_GUIDES.map((g) =>
    entry(`/decoders/${g.slug}`, new Date(g.updated), "monthly", 0.9, reviewedContentLocales(`dec.${g.slug}`)),
  );
  const guideRoutes = GUIDES.map((g) =>
    entry(`/guides/${g.slug}`, new Date(g.updated), "monthly", 0.6, reviewedContentLocales(`guide.${g.slug}`)),
  );

  return [
    ...staticRoutes,
    ...englishOnlyRoutes,
    ...brandRoutes,
    ...decoderRoutes,
    ...guideRoutes,
  ];
}
