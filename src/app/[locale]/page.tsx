import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { Hero } from "@/components/home/hero";
import { FeatureGrid } from "@/components/home/feature-grid";
import { PopularBrands } from "@/components/home/popular-brands";
import { HowItWorks } from "@/components/home/how-it-works";
import { Faq } from "@/components/faq";
import { AdSlot } from "@/components/ui/ad-slot";
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
    title: site.name,
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
      <JsonLd data={[faqSchema(homeFaq), howToSchema()]} />
      <Hero />
      <FeatureGrid />
      {/* Ads between content sections — never inside the check flow (Hero). */}
      <AdSlot placement="home" className="my-8" />
      <PopularBrands />
      <AdSlot placement="home" className="my-8" height={250} />
      <HowItWorks />
      <AdSlot placement="home" className="my-8" height={250} />
      <Faq items={homeFaq} subtitle={th("faqSubtitle")} />
    </>
  );
}
