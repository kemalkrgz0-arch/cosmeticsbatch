import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { isRtl, DEFAULT_LOCALE } from "@/i18n/locales";
import { site } from "@/lib/site";
import { adsense, adsenseEnabled } from "@/lib/ads";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { JsonLd } from "@/components/json-ld";
import { TrackingBoundary } from "@/components/tracking-boundary";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "128x128" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitter,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  // Search Console ownership. Google/Bing codes come from env so they can be
  // set per environment without a code change; Yandex is already verified.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  }),
  other: {
    "yandex-verification": "00b71840cf95776d",
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    }),
    ...(adsenseEnabled && { "google-adsense-account": adsense.client }),
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  width: "device-width",
  initialScale: 1,
  // Zoom stays enabled: users squint at tiny batch codes on packaging, and
  // blocking it fails WCAG 1.4.4 (Resize Text).
  viewportFit: "cover",
};

// Prebuild only the default locale (English) so the static page count stays at
// the single-language level. Other locales are valid (dynamicParams) and render
// on first request, then get cached by the CDN — no build-time page multiplication.
export function generateStaticParams() {
  return [{ locale: DEFAULT_LOCALE }];
}

export const dynamicParams = true;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      suppressHydrationWarning
      className="h-full"
    >
      <body className="flex min-h-full flex-col antialiased">
        <NextIntlClientProvider>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-cta focus:px-4 focus:py-2 focus:text-cta-fg"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <SiteFooter />
          <BottomNav />
          <TrackingBoundary />
        </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
