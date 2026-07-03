import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { DEFAULT_LOCALE } from "./locales";

type Dict = Record<string, unknown>;

/** Recursively fill any keys missing in `over` from `base` (English). */
function deepMerge(base: Dict, over: Dict): Dict {
  const out: Dict = { ...base };
  for (const [k, v] of Object.entries(over)) {
    const b = out[k];
    out[k] =
      b && v && typeof b === "object" && typeof v === "object" &&
      !Array.isArray(b) && !Array.isArray(v)
        ? deepMerge(b as Dict, v as Dict)
        : v;
  }
  return out;
}

/**
 * Per-request i18n config. Missing keys in a locale fall back to English, so a
 * partially translated language never crashes — it just shows English for the
 * untranslated strings.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : DEFAULT_LOCALE;

  const messages = (await import(`../../messages/${locale}.json`)).default;
  const fallback =
    locale === DEFAULT_LOCALE
      ? messages
      : (await import(`../../messages/${DEFAULT_LOCALE}.json`)).default;

  return {
    locale,
    messages: deepMerge(fallback as Dict, messages as Dict),
  };
});
