import type { Metadata } from "next";
import { site, absoluteUrl } from "./site";
import { DEFAULT_LOCALE, ogLocale } from "@/i18n/locales";
import { INDEXABLE_LOCALES, isIndexableLocale } from "./publishing-policy";
import { DESCRIPTION_BUDGET, TITLE_BUDGET, fitSnippet } from "./snippet";

/** Localized URL path. Default locale is prefix-free (/, /brands/…); others prefixed. */
export function localizedPath(locale: string, path = "/"): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** hreflang alternates map for a path across every active locale + x-default. */
export function hreflangAlternates(
  path = "/",
  localeCodes: readonly string[] = INDEXABLE_LOCALES,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of localeCodes)
    languages[locale] = absoluteUrl(localizedPath(locale, path));
  // x-default points at the default locale (prefix-free) URL.
  languages["x-default"] = absoluteUrl(localizedPath(DEFAULT_LOCALE, path));
  return languages;
}

/** Build page metadata with SEO + OpenGraph + Twitter + hreflang defaults. */
export function pageMeta({
  title,
  description,
  path = "/",
  type = "website",
  locale = DEFAULT_LOCALE,
  availableLocales,
  indexable,
  standaloneTitle = false,
}: {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  locale?: string;
  availableLocales?: readonly string[];
  indexable?: boolean;
  /**
   * Drop the "| Cosmetics Batch" suffix the root layout appends.
   *
   * Search engines cut a title around 60 characters, and the suffix costs 18 of
   * them. On a page whose title already carries the brand name, that spends the
   * budget twice and truncates the part that earns the click. Social cards keep
   * the site name either way — only the search title is freed up.
   */
  standaloneTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(localizedPath(locale, path));
  const fullTitle =
    path === "/" ? `${site.name} — ${site.tagline}` : `${title} | ${site.name}`;
  const titleSuffix = ` | ${site.name}`;
  const searchTitle = path === "/"
    ? fitSnippet(fullTitle, TITLE_BUDGET)
    : fitSnippet(title, standaloneTitle ? TITLE_BUDGET : TITLE_BUDGET - titleSuffix.length);
  const searchDescription = fitSnippet(description, DESCRIPTION_BUDGET);
  const canIndex = indexable ?? isIndexableLocale(locale);
  return {
    title: path === "/" || standaloneTitle ? { absolute: searchTitle } : searchTitle,
    description: searchDescription,
    alternates: {
      canonical: url,
      languages: hreflangAlternates(
        path,
        availableLocales ?? (canIndex ? INDEXABLE_LOCALES : []),
      ),
    },
    robots: canIndex ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type,
      url,
      siteName: site.name,
      title: fullTitle,
      description: searchDescription,
      locale: ogLocale(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: searchDescription,
      site: site.twitter,
    },
  };
}

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/icon.png"),
    description: site.description,
    email: site.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.email,
      url: absoluteUrl("/contact"),
    },
    sameAs: [`https://x.com/${site.twitter.replace(/^@/, "")}`],
  };
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/brands?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
  locale = DEFAULT_LOCALE,
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(localizedPath(locale, it.path)),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function howToSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to check a cosmetic or perfume batch code",
    description:
      "Use a supported cosmetic or perfume batch code to estimate its manufacture date and product age, then review typical shelf-life guidance.",
    totalTime: "PT10S",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Select your brand",
        text: "Choose your brand from the list of supported cosmetic and perfume makers.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter the batch code",
        text: "Type the batch code stamped or embossed on your product's packaging.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Get the result",
        text: "See the estimated manufacture date and product age, with separate typical unopened shelf-life and PAO guidance.",
      },
    ],
  };
}

export function articleSchema({
  title,
  description,
  path,
  updated,
  locale = DEFAULT_LOCALE,
}: {
  title: string;
  description: string;
  path: string;
  updated: string;
  locale?: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    dateModified: updated,
    datePublished: updated,
    mainEntityOfPage: absoluteUrl(localizedPath(locale, path)),
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };
}
