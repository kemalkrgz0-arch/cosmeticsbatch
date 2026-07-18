import { LOCALE_CODES } from "../i18n/locales";

/**
 * Which paths `/api/activity` will record.
 *
 * The endpoint used to accept any string that began with `/`, carried no query
 * and stayed under 180 characters. That let a same-origin caller write page
 * paths that do not exist into the analytics dataset, which shows up in the
 * owner dashboard as traffic to pages nobody can visit.
 *
 * Validation is structural rather than an allowlist of every URL: brand, guide
 * and decoder slugs number in the hundreds and change with the catalog, and a
 * reporting endpoint should not have to be redeployed when a brand is added.
 * Checking the section and the shape of the slug is enough to reject invented
 * paths while staying stable.
 *
 * Kept free of `@/` aliases so the quality suite's bare `tsc` can compile it.
 */

const locales = new Set<string>(LOCALE_CODES);

/** Top-level sections, and whether a single slug may follow. */
const SECTIONS: Record<string, { slug: boolean }> = {
  "": { slug: false },
  check: { slug: false },
  brands: { slug: true },
  guides: { slug: true },
  decoders: { slug: true },
  about: { slug: false },
  contact: { slug: false },
  privacy: { slug: false },
  terms: { slug: false },
};

/** Slugs are lowercase, digit- and hyphen-friendly, and bounded. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const MAX_ACTIVITY_PATH_LENGTH = 180;

/**
 * Normalize a reported path, or return null when it is not a real page.
 *
 * Returns the path with any locale prefix intact, since the dashboard reports
 * per locale and strips the prefix itself when merging.
 */
export function normalizeActivityPath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (!raw.startsWith("/") || raw.includes("?") || raw.includes("#")) return null;
  if (raw.length > MAX_ACTIVITY_PATH_LENGTH) return null;

  // Trailing slash is the same page; anything else doubled is not a real URL.
  const path = raw.length > 1 && raw.endsWith("/") ? raw.slice(0, -1) : raw;
  if (path.includes("//")) return null;

  const segments = path.split("/").slice(1);
  if (locales.has(segments[0])) segments.shift();

  // The private workspace is never reported, prefixed or not.
  if (segments.includes("review")) return null;

  const [section = "", slug, ...rest] = segments;
  if (rest.length > 0) return null;

  const rule = SECTIONS[section];
  if (!rule) return null;
  if (slug === undefined) return path;
  if (!rule.slug || !SLUG.test(slug) || slug.length > 80) return null;

  return path;
}
