export const site = {
  name: "Cosmetics Batch",
  tagline: "Check Cosmetic & Perfume Batch Codes",
  description:
    "Decode cosmetic and perfume batch codes instantly. Find the manufacture date, age, and expiration date of your products. 100% free, no sign-up, private.",
  // Set NEXT_PUBLIC_SITE_URL in production for correct canonical + OG URLs.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cosmeticsbatch.com",
  locale: "en_US",
  twitter: "@cosmeticsbatch",
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
