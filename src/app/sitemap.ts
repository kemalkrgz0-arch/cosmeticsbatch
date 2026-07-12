import type { MetadataRoute } from "next";
import { DECODER_GUIDES } from "@/lib/decoder-guides";
import { GUIDES } from "@/lib/guides";
import { absoluteUrl, site } from "@/lib/site";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { localizedPath, hreflangAlternates } from "@/lib/seo";

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
  ) => ({
    url: absoluteUrl(localizedPath(DEFAULT_LOCALE, path)),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: hreflangAlternates(path) },
  });

  const staticRoutes = [
    "/",
    "/brands",
    "/decoders",
    "/guides",
    "/about",
    "/contact",
  ].map((path) => entry(path, updated, "weekly", path === "/" ? 1 : 0.8));
  const legalRoutes = ["/privacy", "/terms"].map((path) =>
    entry(path, updated, "monthly", 0.3),
  );
  // The individual brand pages are deliberately absent: they are generated from
  // one template per decoder family, so a few hundred of them are near-identical
  // and are marked noindex (see the brand page's generateMetadata). What is
  // genuinely unique — the cipher itself — lives in /decoders, and that is what
  // we ask search engines to index. The brand pages stay crawlable via /brands.
  const decoderRoutes = DECODER_GUIDES.map((g) =>
    entry(`/decoders/${g.slug}`, new Date(g.updated), "monthly", 0.9),
  );
  const guideRoutes = GUIDES.map((g) =>
    entry(`/guides/${g.slug}`, new Date(g.updated), "monthly", 0.6),
  );

  return [...staticRoutes, ...legalRoutes, ...decoderRoutes, ...guideRoutes];
}
