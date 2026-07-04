/**
 * Google Analytics 4, driven by an environment variable so no measurement ID is
 * committed. When `NEXT_PUBLIC_GA_ID` is unset (local dev), nothing is injected
 * — no gtag, no network calls, no cookies. Like [[ads]], the value is inlined at
 * build time, so it must be present as a build arg when the image is built.
 *
 *   NEXT_PUBLIC_GA_ID   e.g. G-XXXXXXXXXX
 */
export const ga = {
  id: process.env.NEXT_PUBLIC_GA_ID ?? "",
} as const;

export const gaEnabled = Boolean(ga.id);
