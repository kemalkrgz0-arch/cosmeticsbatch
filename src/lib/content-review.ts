import "server-only";
import english from "../../messages/content/en.json";
import reviewed from "../../messages/content/reviewed.json";
import { DEFAULT_LOCALE, LOCALE_CODES } from "@/i18n/locales";

const sourceKeys = Object.keys(english);
const reviewedByLocale = reviewed as Record<string, string[]>;

/** True only when every source string below a content prefix was reviewed. */
export function isContentReviewed(locale: string, prefix: string): boolean {
  if (locale === DEFAULT_LOCALE) return true;
  const required = sourceKeys.filter((key) => key.startsWith(`${prefix}.`));
  if (required.length === 0) return false;
  const approved = new Set(reviewedByLocale[locale] ?? []);
  return required.every((key) => approved.has(key));
}

export function reviewedContentLocales(prefix: string): string[] {
  return LOCALE_CODES.filter((locale) => isContentReviewed(locale, prefix));
}
