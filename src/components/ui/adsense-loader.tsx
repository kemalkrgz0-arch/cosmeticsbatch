import Script from "next/script";
import { adsense } from "@/lib/ads";

/**
 * The AdSense loader, rendered server-side on the pages that carry reviewed
 * publisher content.
 *
 * Two things it is deliberately not:
 *
 * It is not in the root layout. Keeping it out is what excludes the ~180
 * template brand pages and the noindex tool pages from the monetized inventory —
 * a thin page carrying ads is exactly what an AdSense review penalises.
 *
 * It is not inside [[ad-slot]], which is a client component: a script injected
 * at hydration is absent from the server-rendered HTML, and the reviewer looks
 * for the ad code in the page itself. It also renders whenever a publisher id
 * exists, with or without slot ids — during review no ad units exist yet, and a
 * site with no ad code anywhere cannot be approved.
 */
export function AdsenseLoader() {
  if (!adsense.client) return null;
  return (
    <Script
      id="adsense"
      strategy="lazyOnload"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.client}`}
      crossOrigin="anonymous"
    />
  );
}
