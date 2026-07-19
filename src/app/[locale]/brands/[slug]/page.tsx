import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CalendarClock, Info, MapPin, Timer } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  BRANDS,
  ALL_BRANDS,
  getBrand,
  isIndexedBrand,
  isMonetizableBrand,
  POPULAR_BRANDS,
} from "@/lib/brands";
import {
  brandDetail,
  BRAND_DETAILS_UPDATED,
  MAX_FAQ_ITEMS,
  MAX_WHERE_LINES,
} from "@/lib/brand-detail";
import { InlineResult } from "@/components/inline-result";
import { buildBrandFaqs, brandIntroSections } from "@/lib/brand-faq";
import { guideForBrand } from "@/lib/decoder-guides";
import { DECODERS } from "@/lib/decoder";
import { GUIDES } from "@/lib/guides";
import { contentTranslator, localizeGuide } from "@/lib/content-i18n";
import { isEditorialLocaleReviewed } from "@/lib/content-review";
import {
  articleSchema,
  faqSchema,
  pageMeta,
} from "@/lib/seo";
import { fitTitle } from "@/lib/snippet";
import { brandSnippet } from "@/lib/brand-snippets";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CheckForm } from "@/components/check-form";
import { Faq } from "@/components/faq";
import { AdSlot } from "@/components/ui/ad-slot";
import { AdsenseLoader } from "@/components/ui/adsense-loader";
import { isAdEligibleLocale } from "@/lib/ads";
import { BrandLogo } from "@/components/ui/brand-logo";
import { JsonLd } from "@/components/json-ld";
import { CodePhotoSubmission } from "@/components/code-photo-submission";
import { BrandCodeGallery } from "@/components/brand-code-gallery";
import { BrandHero } from "@/components/brand-page/brand-hero";
import { BrandQuickFacts } from "@/components/brand-page/brand-quick-facts";
import { TrustDisclaimer } from "@/components/brand-page/trust-disclaimer";
import { brandThemeStyle, getBrandTheme } from "@/lib/brand-theme";
import {
  LOREAL_OFFICIAL_PORTFOLIO_URL,
  isLorealGroupBrand,
  isLorealPriorityLocale,
} from "@/lib/loreal";
import {
  indexableBrandLocales,
  isIndexableBrandPage,
} from "@/lib/publishing-policy";
import { hasReviewedBrandDetailKey } from "@/lib/locale-message-gaps";

export function generateStaticParams() {
  return ALL_BRANDS.filter(
    (brand) => !brand.hidden || isLorealGroupBrand(brand),
  ).map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  const t = await getTranslations({ locale, namespace: "brandPage" });
  // No `keywords` meta: Google has ignored it since 2009 and it only leaks the
  // exact terms we target to competitors.
  const snippet = brandSnippet(locale, brand.slug, {
    title: fitTitle(
      t("metaTitle", { name: brand.name }),
      t("metaTitleShort", { name: brand.name }),
    ),
    description: t("metaDescription", { name: brand.name }),
  });
  const meta = pageMeta({
    title: snippet.title,
    description: snippet.description,
    path: `/brands/${brand.slug}`,
    type: "article",
    locale,
    availableLocales: indexableBrandLocales(brand.slug),
    indexable: isIndexableBrandPage(brand.slug, locale),
    // The title already opens with the brand name; the layout's site-name suffix
    // would only push the rest past where search engines cut it off.
    standaloneTitle: true,
  });
  return meta;
}

/** A representative example code per decoder family (for unique on-page content). */
export default async function BrandPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const brand = getBrand(slug);
  if (!brand) notFound();

  const t = await getTranslations();
  const tb = await getTranslations("brandPage");
  const nav = await getTranslations("nav");
  const contentT = await contentTranslator(locale);
  const path = `/brands/${brand.slug}`;

  const related = [
    ...BRANDS.filter((b) => b.group === brand.group && b.slug !== brand.slug),
    ...POPULAR_BRANDS.filter((b) => b.slug !== brand.slug),
  ]
    .filter((b, i, arr) => arr.findIndex((x) => x.slug === b.slug) === i)
    .slice(0, 6);

  const brandFaq = buildBrandFaqs(brand, t);
  const introSections = brandIntroSections(brand, t);
  const codeGuide = guideForBrand(brand);
  const hasLocalizedDecoderGuide = t.has("brandPage.decoderGuideBody");
  const hasLorealFamilyContent =
    isLorealGroupBrand(brand) && t.has("lorealFamily.heading");

  // Editorial, brand-specific material: a real code run through this brand's own
  // decoder, where the code sits on its packaging, and the questions people
  // actually search for it. Only brands that have this are indexable.
  const detail = brandDetail(brand.slug);
  const localeReviewed = isEditorialLocaleReviewed(locale);
  const localeIndexable =
    (isIndexedBrand(brand) && localeReviewed) ||
    (isLorealGroupBrand(brand) && isLorealPriorityLocale(locale));
  const monetizable =
    isMonetizableBrand(brand) && localeIndexable && isAdEligibleLocale(locale);
  const helpfulGuides = GUIDES.slice(0, 4).map((guide) =>
    localizeGuide(guide, contentT),
  );
  const has = (key: string) => t.has(`brandDetail.${brand.slug}.${key}`);
  const whereLines = detail
    ? Array.from({ length: MAX_WHERE_LINES }, (_, i) => `where${i + 1}`)
        .filter((key) => has(key) && hasReviewedBrandDetailKey(locale, brand.slug, key))
        .map((k) => t(`brandDetail.${brand.slug}.${k}`))
    : [];
  // Never pair a translated question with a silent English fallback answer.
  const detailFaq = detail
    ? Array.from({ length: MAX_FAQ_ITEMS }, (_, i) => i + 1)
        .filter((i) =>
          has(`faq${i}q`) &&
          hasReviewedBrandDetailKey(locale, brand.slug, `faq${i}q`) &&
          hasReviewedBrandDetailKey(locale, brand.slug, `faq${i}a`),
        )
        .map((i) => ({
          q: t(`brandDetail.${brand.slug}.faq${i}q`),
          a: t(`brandDetail.${brand.slug}.faq${i}a`),
        }))
    : [];
  const printGuide = brand.printsDate
    ? GUIDES.find((g) => g.slug === "brands-that-print-the-date")
    : undefined;

  const category = t(`categoryNoun.${brand.category}`);
  const theme = getBrandTheme(brand.category, brand.theme);
  const months = (n: number) => tb("months", { n });

  // Honest per-brand decoder label: a dedicated manufacturer scheme where we
  // have one, generic auto-detection otherwise (was hardcoded to "auto" for
  // every brand, which understated brands that do have a real decoder).
  const hasRealDecoder = Boolean(brand.decoderId && DECODERS[brand.decoderId]);
  const decoderValue = hasLorealFamilyContent
    ? t("lorealFamily.decoderLabel")
    : hasRealDecoder
      ? t("brandFaq.decoderKnown")
    : t("brandFaq.decoderAuto");

  const facts = [
    { icon: MapPin, label: tb("factManufacturer"), value: brand.group },
    { icon: Timer, label: tb("factShelfLife"), value: months(brand.shelfLifeMonths) },
    { icon: CalendarClock, label: tb("factPao"), value: months(brand.paoMonths) },
    {
      icon: Info,
      label: tb("factDecoder"),
      value: decoderValue,
    },
  ];

  const crumbs = [
    { name: nav("home"), path: "/" },
    { name: nav("brands"), path: "/brands" },
    { name: brand.name, path },
  ];

  return (
    <div className="brand-page pb-8" style={brandThemeStyle(theme)}>
      {monetizable && <AdsenseLoader />}
      <JsonLd
        data={[
          ...(detail && localeReviewed ? [
            faqSchema([...detailFaq, ...brandFaq]),
            articleSchema({
            title: tb("checkerTitle", { name: brand.name }),
            description: tb("blurb", { name: brand.name, category }),
            path,
            updated: BRAND_DETAILS_UPDATED,
            locale,
            }),
          ] : []),
        ]}
      />
      <div className="site-frame pt-4 sm:pt-6">
        <div className="mb-3 px-1 text-xs opacity-70"><Breadcrumbs items={crumbs} /></div>
        <BrandHero brand={brand} theme={theme} title={tb("checkerTitle", { name: brand.name })} byline={tb("by", { group: brand.group })} intro={tb("blurb", { name: brand.name, category })} disclaimer={tb("intro", { name: brand.name })} />
      </div>

      <div className="page-frame relative z-20 -mt-24 sm:-mt-28">

      {/* Brands that print the date directly (K-beauty, JP, FR pharmacy):
          point the user at the printed date + guide instead of a coded decode. */}
      {brand.printsDate && (
        <div className="mt-5 rounded-xl border border-border bg-card p-4">
          <p className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>
              {tb("printsDateNote", { name: brand.name })}{" "}
              {printGuide && (
                <Link
                  href={`/guides/${printGuide.slug}`}
                  className="font-medium text-accent hover:text-accent-hover"
                >
                  {printGuide.title} →
                </Link>
              )}
            </span>
          </p>
        </div>
      )}

      <CheckForm initialBrand={brand} presentation="brand" navigateOnBrandChange />

      {/* Inline decode result (client-rendered from ?code= so the page stays SSG) */}
      <Suspense fallback={null}>
        <InlineResult brand={brand} />
      </Suspense>

      <CodePhotoSubmission brand={brand} locale={locale} />

      <BrandQuickFacts facts={facts} />

      {/* A stable visual-guide slot near the primary checker. Every brand uses
          this position as owner-approved packaging evidence is added. */}
      <BrandCodeGallery
        brandName={brand.name}
        heading={introSections[0].heading}
        body={introSections[0].body}
        images={brand.codeImages}
      />

      {/* Explanation */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">
          {tb("howHeading", { name: brand.name })}
        </h2>
        <p className="mt-3 leading-relaxed text-fg-muted">
          {tb("freshnessPara", {
            name: brand.name,
            shelf: brand.shelfLifeMonths,
            pao: brand.paoMonths,
            category,
          })}
        </p>

        <p className="mt-5 leading-relaxed text-fg-muted">
          {tb("aliasesPara", { name: brand.name, category })}
        </p>

        {/* The cipher itself is a property of the manufacturer, so it is
            documented once per decoder family rather than restated on every
            brand that shares it. */}
        {codeGuide && hasLocalizedDecoderGuide && (
          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <p className="text-sm leading-relaxed text-fg-muted">
              {t("brandPage.decoderGuideBody", {
                name: brand.name,
                group: brand.group,
              })}
            </p>
            <Link
              href={`/decoders/${codeGuide.slug}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover"
            >
              {t("brandPage.decoderGuideLink", { name: brand.name })}{" "}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        )}
      </section>

      {hasLorealFamilyContent && (
        <section className="mt-10" aria-labelledby="loreal-family-heading">
          <h2 id="loreal-family-heading" className="text-xl font-semibold">
            {t("lorealFamily.heading", { name: brand.name })}
          </h2>
          <div className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-fg-muted">
            <p>{t("lorealFamily.portfolio", { name: brand.name })}</p>
            <p>{t("lorealFamily.format")}</p>
            <p>{t("lorealFamily.precision")}</p>
            <p>{t("lorealFamily.authenticity")}</p>
            <a
              href={LOREAL_OFFICIAL_PORTFOLIO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-accent hover:text-accent-hover"
            >
              {t("lorealFamily.officialSource")}{" "}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </a>
          </div>
        </section>
      )}

      {/* Remaining category guidance follows the explanatory content. */}
      {introSections.slice(1).map((s) => (
        <section key={s.heading} className="mt-10">
          <h2 className="text-xl font-semibold">{s.heading}</h2>
          <p className="mt-3 leading-relaxed text-fg-muted">{s.body}</p>
        </section>
      ))}

      {/* Brand-specific material. A worked example run through this brand's own
          decoder — decoded here by the live engine, not transcribed — plus where
          the code sits on its packaging. */}

      {whereLines.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">
            {tb("whereHeading", { name: brand.name })}
          </h2>
          <ul className="mt-3 space-y-2">
            {whereLines.map((line) => (
              <li key={line} className="flex gap-2 text-fg-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {monetizable && (
        <AdSlot placement="brand" className="my-12" height={250} />
      )}

      {/* Brand-specific questions first (they are what people actually search
          for), then the shared category questions. */}
      <Faq
        items={[...detailFaq, ...brandFaq]}
        title={tb("faqTitle", { name: brand.name })}
      />

      <TrustDisclaimer independent={tb("intro", { name: brand.name })} estimate={tb("blurb", { name: brand.name, category })} privateLabel={t("hero.trustPrivate")} free={t("hero.trustFree")} />

      {/* Related brands */}
      <section className="mt-4">
        <h2 className="mb-4 text-lg font-semibold">{tb("relatedBrands")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {related.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="group flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-accent)]"
            >
              <BrandLogo name={b.name} slug={b.slug} className="h-10 w-10 rounded-xl text-[11px]" />
              <span className="min-w-0"><span className="block truncate text-sm font-semibold">{b.name}</span><span className="mt-0.5 block truncate text-xs text-fg-muted">{b.group}</span></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Guide links */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">{tb("helpfulGuides")}</h2>
        <ul className="space-y-2">
          {helpfulGuides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
              >
                {g.title} <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </div>
  );
}
