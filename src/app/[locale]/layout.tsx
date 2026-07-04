import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { isRtl, DEFAULT_LOCALE } from "@/i18n/locales";
import { site } from "@/lib/site";
import { adsense, adsenseEnabled } from "@/lib/ads";
import { ga, gaEnabled } from "@/lib/analytics";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { JsonLd } from "@/components/json-ld";
import { CookieConsent } from "@/components/cookie-consent";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  manifest: "/manifest.webmanifest",
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
  other: {
    "yandex-verification": "00b71840cf95776d",
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
  maximumScale: 1,
  userScalable: false,
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
      className={`${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        {(adsenseEnabled || gaEnabled) && (
          // Google Consent Mode v2: default everything to denied *before* the
          // gtag/AdSense loaders run, then immediately re-grant if the visitor
          // already accepted in a previous session. The CookieConsent banner
          // flips these on "Accept".
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html:
                "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}" +
                "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});" +
                "try{if(localStorage.getItem('cb:consent')==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}",
            }}
          />
        )}
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
          {(adsenseEnabled || gaEnabled) && <CookieConsent />}
        </Providers>
        {adsenseEnabled && (
          // Plain async script — React 19 hoists it into the server-rendered
          // <head> as a literal <script async src="adsbygoogle.js">, which is
          // what the AdSense verification crawler looks for.
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.client}`}
            crossOrigin="anonymous"
          />
        )}
        {gaEnabled && (
          <>
            {/* Google Analytics 4 — the loader script plus the gtag bootstrap. */}
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${ga.id}`}
            />
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `gtag('js',new Date());gtag('config','${ga.id}');`,
              }}
            />
          </>
        )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
