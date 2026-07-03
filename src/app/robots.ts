import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Result permutations are noindex; keep them out of crawl budget too.
        // Locale-prefixed now (/en/check, /fr/check…), so match across locales.
        disallow: ["/check", "/*/check"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
