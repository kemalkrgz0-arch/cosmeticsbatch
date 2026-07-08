/**
 * Language registry. `ALL_LOCALES` is the full planned set (50 languages);
 * `LOCALES` is the subset currently activated (has a translated message file +
 * live routes). To launch a new language: add a `messages/<code>.json`, then
 * move its code into `ACTIVE`.
 *
 * `dir: "rtl"` locales (Arabic, Hebrew, Persian, Urdu) flip the document
 * direction; everything else is LTR.
 */
export interface LocaleMeta {
  /** BCP-47 code used in the URL (/es, /zh …). */
  code: string;
  /** English name. */
  label: string;
  /** Endonym (name in its own language) — shown in the language switcher. */
  native: string;
  dir?: "rtl";
}

export const ALL_LOCALES: LocaleMeta[] = [
  { code: "en", label: "English", native: "English" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "zh", label: "Chinese (Mandarin)", native: "中文" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ko", label: "Korean", native: "한국어" },
  { code: "tr", label: "Turkish", native: "Türkçe" },
  { code: "it", label: "Italian", native: "Italiano" },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia" },
  { code: "nl", label: "Dutch", native: "Nederlands" },
  { code: "pl", label: "Polish", native: "Polski" },
  { code: "fa", label: "Persian", native: "فارسی", dir: "rtl" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt" },
  { code: "sv", label: "Swedish", native: "Svenska" },
  { code: "uk", label: "Ukrainian", native: "Українська" },
  { code: "yue", label: "Cantonese", native: "粵語" },
  { code: "th", label: "Thai", native: "ไทย" },
  { code: "tl", label: "Tagalog", native: "Tagalog" },
  { code: "el", label: "Greek", native: "Ελληνικά" },
  { code: "cs", label: "Czech", native: "Čeština" },
  { code: "he", label: "Hebrew", native: "עברית", dir: "rtl" },
  { code: "nb", label: "Norwegian", native: "Norsk" },
  { code: "da", label: "Danish", native: "Dansk" },
  { code: "fi", label: "Finnish", native: "Suomi" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ur", label: "Urdu", native: "اردو", dir: "rtl" },
  { code: "sw", label: "Swahili", native: "Kiswahili" },
  { code: "ro", label: "Romanian", native: "Română" },
  { code: "hu", label: "Hungarian", native: "Magyar" },
  { code: "ca", label: "Catalan", native: "Català" },
  { code: "ms", label: "Malay", native: "Bahasa Melayu" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "uz", label: "Uzbek", native: "Oʻzbek" },
  { code: "az", label: "Azerbaijani", native: "Azərbaycan" },
  { code: "kk", label: "Kazakh", native: "Қазақ" },
  { code: "am", label: "Amharic", native: "አማርኛ" },
  { code: "ha", label: "Hausa", native: "Hausa" },
  { code: "yo", label: "Yoruba", native: "Yorùbá" },
  { code: "sr", label: "Serbian / Croatian", native: "Srpski / Hrvatski" },
  { code: "bg", label: "Bulgarian", native: "Български" },
  { code: "sk", label: "Slovak", native: "Slovenčina" },
];

/** Codes that currently have a translated message file and live routes. */
const ACTIVE = [
  "en", "es", "fr", "de", "pt", "ru", "ar", "zh",
  // European languages
  "tr", "it", "nl", "pl", "sv", "uk", "el", "cs", "nb", "da", "fi", "ro",
  "hu", "ca", "sr", "bg", "sk",
  // Asian + Indic + SE-Asian languages
  "ja", "ko", "hi", "id", "vi", "th", "ms", "tl", "bn", "ur",
  "ta", "te", "mr", "pa", "gu",
] as const;

export const LOCALES: LocaleMeta[] = ALL_LOCALES.filter((l) =>
  (ACTIVE as readonly string[]).includes(l.code),
);

export const LOCALE_CODES = LOCALES.map((l) => l.code);
export const DEFAULT_LOCALE = "en";

const byCode = new Map(ALL_LOCALES.map((l) => [l.code, l]));
export function localeMeta(code: string): LocaleMeta | undefined {
  return byCode.get(code);
}

export function isRtl(code: string): boolean {
  return byCode.get(code)?.dir === "rtl";
}

/**
 * OpenGraph `og:locale` values (language_TERRITORY). The OG spec wants the
 * underscored BCP-47 form (e.g. `tr_TR`), not the bare language code we use in
 * URLs. Falls back to `<code>_<CODE>` for anything unmapped.
 */
const OG_LOCALE: Record<string, string> = {
  en: "en_US", es: "es_ES", fr: "fr_FR", de: "de_DE", pt: "pt_PT",
  ru: "ru_RU", ar: "ar_AR", zh: "zh_CN", ja: "ja_JP", hi: "hi_IN",
  ko: "ko_KR", tr: "tr_TR", it: "it_IT", id: "id_ID", nl: "nl_NL",
  pl: "pl_PL", fa: "fa_IR", vi: "vi_VN", sv: "sv_SE", uk: "uk_UA",
  yue: "zh_HK", th: "th_TH", tl: "tl_PH", el: "el_GR", cs: "cs_CZ",
  he: "he_IL", nb: "nb_NO", da: "da_DK", fi: "fi_FI", bn: "bn_BD",
  ur: "ur_PK", sw: "sw_KE", ro: "ro_RO", hu: "hu_HU", ca: "ca_ES",
  ms: "ms_MY", pa: "pa_IN", ta: "ta_IN", te: "te_IN", mr: "mr_IN",
  gu: "gu_IN", uz: "uz_UZ", az: "az_AZ", kk: "kk_KZ", am: "am_ET",
  ha: "ha_NG", yo: "yo_NG", sr: "sr_RS", bg: "bg_BG", sk: "sk_SK",
};

export function ogLocale(code: string): string {
  return OG_LOCALE[code] ?? `${code}_${code.toUpperCase()}`;
}

export function isLocale(code: string): boolean {
  return LOCALE_CODES.includes(code);
}
