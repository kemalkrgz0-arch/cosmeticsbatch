import type { MetadataRoute } from "next";
import { BRANDS } from "@/lib/brands";
import { GUIDES } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site";
import { LOCALES } from "@/i18n/locales";
import { localizedPath, hreflangAlternates } from "@/lib/seo";

/**
 * One sitemap entry per (path × locale). Each entry lists hreflang alternates
 * via `alternates.languages`, so search engines index the right language and
 * understand they are translations of one another.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries = (
    path: string,
    lastModified: Date,
    changeFrequency: "weekly" | "monthly",
    priority: number,
  ): MetadataRoute.Sitemap =>
    LOCALES.map((l) => ({
      url: absoluteUrl(localizedPath(l.code, path)),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: hreflangAlternates(path) },
    }));

  const staticRoutes = ["/", "/brands", "/guides", "/about"].flatMap((path) =>
    entries(path, now, "weekly", path === "/" ? 1 : 0.8),
  );
  const legalRoutes = ["/privacy", "/terms"].flatMap((path) =>
    entries(path, now, "monthly", 0.3),
  );
  const brandRoutes = BRANDS.flatMap((b) =>
    entries(`/brands/${b.slug}`, now, "monthly", 0.7),
  );
  const guideRoutes = GUIDES.flatMap((g) =>
    entries(`/guides/${g.slug}`, new Date(g.updated), "monthly", 0.6),
  );

  return [...staticRoutes, ...legalRoutes, ...brandRoutes, ...guideRoutes];
}
