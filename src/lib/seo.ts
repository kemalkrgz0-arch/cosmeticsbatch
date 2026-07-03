import type { Metadata } from "next";
import { site, absoluteUrl } from "./site";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/locales";

/** Localized URL path. Default locale is prefix-free (/, /brands/…); others prefixed. */
export function localizedPath(locale: string, path = "/"): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** hreflang alternates map for a path across every active locale + x-default. */
export function hreflangAlternates(path = "/"): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES)
    languages[l.code] = absoluteUrl(localizedPath(l.code, path));
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
}: {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  locale?: string;
}): Metadata {
  const url = absoluteUrl(localizedPath(locale, path));
  const fullTitle =
    path === "/" ? `${site.name} — ${site.tagline}` : `${title} | ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates(path) },
    openGraph: {
      type,
      url,
      siteName: site.name,
      title: fullTitle,
      description,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
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
    description: site.description,
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
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
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
      "Decode the batch code on your cosmetics or perfume to find its manufacture date, age and expiration date.",
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
        text: "See the manufacture date, product age, freshness and estimated expiration instantly.",
      },
    ],
  };
}

export function articleSchema({
  title,
  description,
  path,
  updated,
}: {
  title: string;
  description: string;
  path: string;
  updated: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    dateModified: updated,
    datePublished: updated,
    mainEntityOfPage: absoluteUrl(path),
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };
}
