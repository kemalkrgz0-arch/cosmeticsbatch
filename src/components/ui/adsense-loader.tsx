import Script from "next/script";
import { adsense, googleCmpEnabled } from "@/lib/ads";

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
 * for the ad code in the page itself. It renders with or without slot ids —
 * during review no ad units exist yet, and a site with no ad code anywhere
 * cannot be approved.
 *
 * It is gated on the certified CMP, not on the publisher id. Loading
 * `adsbygoogle.js` is itself the third-party advertising processing a visitor in
 * the EEA, UK or Switzerland has to be asked about first, so shipping it before
 * a TCF message exists is the defect whatever the slot ids say — production was
 * doing exactly that, loading Google's ad script on every page with no
 * `__tcfapi` present anywhere.
 *
 * Gating on the flag rather than on a client-side consent value is deliberate.
 * Google's own Privacy & messaging CMP is *delivered by this script*: putting
 * the script behind our banner's answer would mean the certified message could
 * never appear. So before the CMP is published we serve no ad script at all,
 * and after it is published the script loads server-side exactly as it used to
 * while the CMP owns the consent conversation. See finding 19.
 */
export function AdsenseLoader() {
  if (!googleCmpEnabled) return null;
  return (
    <Script
      id="adsense"
      strategy="lazyOnload"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.client}`}
      crossOrigin="anonymous"
    />
  );
}
