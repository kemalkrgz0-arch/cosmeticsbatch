import { defineRouting } from "next-intl/routing";
import { LOCALE_CODES, DEFAULT_LOCALE } from "./locales";

export const routing = defineRouting({
  locales: LOCALE_CODES,
  defaultLocale: DEFAULT_LOCALE,
  // Default locale (en) served at "/" with no prefix; others at "/fr", "/ar"…
  localePrefix: "as-needed",
});
