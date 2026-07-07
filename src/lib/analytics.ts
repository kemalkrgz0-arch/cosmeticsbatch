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

/**
 * Yandex Metrica (counter id). Loaded only after cookie consent is granted —
 * it includes Webvisor session replay + clickmaps, so it must not run before
 * the visitor opts in.
 *
 *   NEXT_PUBLIC_YM_ID   e.g. 110450605
 */
export const ym = {
  id: process.env.NEXT_PUBLIC_YM_ID ?? "",
} as const;

export const ymEnabled = Boolean(ym.id);

/** Fired by the consent banner on "Accept" so gated trackers can start. */
export const CONSENT_GRANTED_EVENT = "cb-consent-granted";
