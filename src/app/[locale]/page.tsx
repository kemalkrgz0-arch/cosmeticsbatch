import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { FeatureGrid } from "@/components/home/feature-grid";
import { PopularBrands } from "@/components/home/popular-brands";
import { HowItWorks } from "@/components/home/how-it-works";
import { WhereIsCode } from "@/components/home/where-is-code";
import { Faq } from "@/components/faq";
import { AdSlot } from "@/components/ui/ad-slot";
import { AdsenseLoader } from "@/components/ui/adsense-loader";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, howToSchema } from "@/lib/seo";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { isAdEligibleLocale } from "@/lib/ads";

const HOME_FAQ_KEYS = Array.from({ length: 10 }, (_, i) => i + 1);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // The homepage title targets the top head term ("batch code checker"), not
  // just the brand name — and it has to do that in the reader's language.
  //
  // Every localized homepage shipped the English tagline and description
  // because both were read straight from `site`, while the body rendered
  // Dutch, Russian or German. A searcher in the Netherlands was offered an
  // English headline above a Dutch page and did not click it: 278 impressions,
  // zero clicks over 28 days. The title is also the strongest relevance signal
  // a page has, and Dutch head terms sat at positions 68 to 99.
  //
  // Brand, guide and checker pages were always localized; only the homepage was
  // not. Locales without their own strings fall back to English through the
  // catalog merge, which is exactly what they had before.
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMeta({
    title: t("homeTitle"),
    description: t("homeDescription"),
    path: "/",
    locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const monetizable = isAdEligibleLocale(locale);
  const t = await getTranslations("homeFaq");
  const homeFaq = HOME_FAQ_KEYS.map((i) => ({
    q: t(`q${i}`),
    a: t(`a${i}`),
  }));
  const th = await getTranslations("home");

  return (
    <>
      {monetizable && <AdsenseLoader />}
      <JsonLd data={[
        faqSchema(homeFaq),
        ...(locale === DEFAULT_LOCALE ? [howToSchema()] : []),
      ]} />
      <Hero />
      <FeatureGrid />
      <PopularBrands />
      <HowItWorks />
      <WhereIsCode />
      {/* One placement after the substantial publisher content. Keeping the
          tool and explanations ad-free makes content the clear page focus. */}
      {monetizable && <AdSlot placement="home" className="my-8" height={250} />}
      <Faq items={homeFaq} subtitle={th("faqSubtitle")} />
    </>
  );
}
