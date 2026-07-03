/**
 * Google AdSense configuration, driven entirely by environment variables so no
 * account IDs are committed. When `NEXT_PUBLIC_ADSENSE_CLIENT` is unset (local
 * dev), ad components render a reserved placeholder instead — zero layout shift
 * either way.
 *
 *   NEXT_PUBLIC_ADSENSE_CLIENT   e.g. ca-pub-1234567890123456
 *   NEXT_PUBLIC_ADSENSE_SLOT_*   numeric slot ids for each placement
 */
export const adsense = {
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  slots: {
    home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ?? "",
    result: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT ?? "",
    article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? "",
    brand: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BRAND ?? "",
  },
} as const;

export type AdPlacement = keyof typeof adsense.slots;

export const adsenseEnabled = Boolean(adsense.client);
