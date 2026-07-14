import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
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

const HOME_FAQ_KEYS = Array.from({ length: 10 }, (_, i) => i + 1);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta({
    // Homepage title targets the top head term ("batch code checker"), not just
    // the brand name.
    title: site.tagline,
    description: site.description,
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
  const t = await getTranslations("homeFaq");
  const homeFaq = HOME_FAQ_KEYS.map((i) => ({
    q: t(`q${i}`),
    a: t(`a${i}`),
  }));
  const th = await getTranslations("home");

  return (
    <>
      <AdsenseLoader />
      <JsonLd data={[faqSchema(homeFaq), howToSchema()]} />
      <Hero />
      <FeatureGrid />
      <PopularBrands />
      <HowItWorks />
      <WhereIsCode />
      {/* One placement after the substantial publisher content. Keeping the
          tool and explanations ad-free makes content the clear page focus. */}
      <AdSlot placement="home" className="my-8" height={250} />
      <Faq items={homeFaq} subtitle={th("faqSubtitle")} />
    </>
  );
}
