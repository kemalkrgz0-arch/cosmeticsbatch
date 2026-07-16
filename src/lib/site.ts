export const site = {
  name: "Cosmetics Batch",
  tagline: "Cosmetic & Perfume Batch Code Checker",
  description:
    "Free batch code checker for cosmetics, perfume and fragrance. Estimate a product's manufacture date and age, then compare typical unopened shelf life and PAO guidance.",
  // Set NEXT_PUBLIC_SITE_URL in production for correct canonical + OG URLs.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cosmeticsbatch.com",
  locale: "en_US",
  twitter: "@cosmeticsbatch",
  // Public contact address (shown on /contact + used in ContactPoint schema).
  // Make sure this mailbox actually receives mail.
  email: "contact@cosmeticsbatch.com",
  // Last meaningful change to core page content. Used for sitemap
  // <lastmod> so we emit a stable, honest freshness signal instead of
  // `new Date()` (which tells crawlers every page changed on every crawl).
  // Bump this when brand/static page content actually changes.
  contentUpdated: "2026-07-16",
  nav: [
    { label: "Home", href: "/" },
    { label: "Brands", href: "/brands" },
    { label: "Guides", href: "/guides" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "About", href: "/about" },
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
