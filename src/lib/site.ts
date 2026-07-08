export const site = {
  name: "Cosmetics Batch",
  tagline: "Check Cosmetic & Perfume Batch Codes",
  description:
    "Decode cosmetic and perfume batch codes instantly. Find the manufacture date, age, and expiration date of your products. 100% free, no sign-up, private.",
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
  contentUpdated: "2026-07-08",
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
