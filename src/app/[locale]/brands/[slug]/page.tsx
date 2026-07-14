import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CalendarClock, Info, MapPin, Timer } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  BRANDS,
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
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  pageMeta,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CheckForm } from "@/components/check-form";
import { Faq } from "@/components/faq";
import { AdSlot } from "@/components/ui/ad-slot";
import { AdsenseLoader } from "@/components/ui/adsense-loader";
import { BrandLogo } from "@/components/ui/brand-logo";
import { JsonLd } from "@/components/json-ld";
import { CodePhotoSubmission } from "@/components/code-photo-submission";

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
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
  const meta = pageMeta({
    title: t("metaTitle", { name: brand.name }),
    description: t("metaDescription", { name: brand.name }),
    path: `/brands/${brand.slug}`,
    type: "article",
    locale,
  });
  // Only brands carrying their own editorial material are indexable. The rest
  // are generated from one template per decoder family — a few hundred
  // near-identical pages, which is the definition of scaled, low-value content.
  // They stay live and crawlable (they are the tool), they just don't enter the
  // index; `follow` keeps their link equity flowing to the pages that should.
  if (!isIndexedBrand(brand)) meta.robots = { index: false, follow: true };
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

  // Editorial, brand-specific material: a real code run through this brand's own
  // decoder, where the code sits on its packaging, and the questions people
  // actually search for it. Only brands that have this are indexable.
  const detail = brandDetail(brand.slug);
  const monetizable = isMonetizableBrand(brand);
  const sample = detail
    ? DECODERS[brand.decoderId ?? ""]?.decode(detail.sampleCode, {
        now: new Date(),
      })
    : null;
  const has = (key: string) => t.has(`brandDetail.${brand.slug}.${key}`);
  const whereLines = detail
    ? Array.from({ length: MAX_WHERE_LINES }, (_, i) => `where${i + 1}`)
        .filter(has)
        .map((k) => t(`brandDetail.${brand.slug}.${k}`))
    : [];
  const detailFaq = detail
    ? Array.from({ length: MAX_FAQ_ITEMS }, (_, i) => i + 1)
        .filter((i) => has(`faq${i}q`))
        .map((i) => ({
          q: t(`brandDetail.${brand.slug}.faq${i}q`),
          a: t(`brandDetail.${brand.slug}.faq${i}a`),
        }))
    : [];
  const printGuide = brand.printsDate
    ? GUIDES.find((g) => g.slug === "brands-that-print-the-date")
    : undefined;

  const category = t(`categoryNoun.${brand.category}`);
  const months = (n: number) => tb("months", { n });

  // Honest per-brand decoder label: a dedicated manufacturer scheme where we
  // have one, generic auto-detection otherwise (was hardcoded to "auto" for
  // every brand, which understated brands that do have a real decoder).
  const hasRealDecoder = Boolean(brand.decoderId && DECODERS[brand.decoderId]);
  const decoderValue = hasRealDecoder
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {monetizable && <AdsenseLoader />}
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          ...(detail ? [
            faqSchema([...detailFaq, ...brandFaq]),
            articleSchema({
            title: tb("checkerTitle", { name: brand.name }),
            description: tb("blurb", { name: brand.name, category }),
            path,
            updated: BRAND_DETAILS_UPDATED,
            }),
          ] : []),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <header className="flex items-center gap-4">
        <BrandLogo name={brand.name} slug={brand.slug} className="h-14 w-14 text-base" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {tb("checkerTitle", { name: brand.name })}
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            {tb("by", { group: brand.group })}
          </p>
        </div>
      </header>

      <p className="mt-5 text-pretty leading-relaxed text-fg-muted">
        {tb("intro", { name: brand.name })}
      </p>

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

      <CheckForm initialBrand={brand} className="mt-6" autoFocusCode />

      {/* Inline decode result (client-rendered from ?code= so the page stays SSG) */}
      <Suspense fallback={null}>
        <InlineResult brand={brand} />
      </Suspense>

      <CodePhotoSubmission brand={brand} />

      {/* Quick facts */}
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-3.5">
            <dt className="flex items-center gap-1.5 text-xs text-fg-muted">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </dt>
            <dd className="mt-1 text-sm font-medium leading-tight">{value}</dd>
          </div>
        ))}
      </dl>

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
        {codeGuide && (
          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <p className="text-sm leading-relaxed text-fg-muted">
              {brand.name} codes are stamped by {brand.group}, and every brand
              from the same plants reads the same way. The full format —
              character by character, with worked examples — is documented here:
            </p>
            <Link
              href={`/decoders/${codeGuide.slug}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover"
            >
              {codeGuide.title} <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        )}
      </section>

      {/* Where-to-find + storage — visible, category-specific body content
          (promoted from the FAQ) that reveals nothing about the cipher. */}
      {introSections.map((s, i) => (
        <section key={s.heading} className="mt-10">
          <h2 className="text-xl font-semibold">{s.heading}</h2>
          <p className="mt-3 leading-relaxed text-fg-muted">{s.body}</p>
          {/* Real product photos sit right under the "where is the code?"
              explanation (the first section) so the text and the visual are
              together. */}
          {i === 0 && brand.codeImages && brand.codeImages.length > 0 && (
            <figure className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {brand.codeImages.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.src}
                  src={img.src}
                  alt={`Where to find the batch code on ${brand.name} packaging`}
                  width={img.width}
                  height={img.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full rounded-xl border border-border bg-card"
                />
              ))}
            </figure>
          )}
        </section>
      ))}

      {/* Brand-specific material. A worked example run through this brand's own
          decoder — decoded here by the live engine, not transcribed — plus where
          the code sits on its packaging. */}
      {detail && sample?.manufactureDate && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">
            {tb("exampleHeading", { name: brand.name })}
          </h2>
          <div className="mt-4 rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <code className="rounded-lg bg-bg-subtle px-2 py-1 font-mono text-sm font-semibold">
                {detail.sampleCode}
              </code>
              <ArrowRight className="h-4 w-4 shrink-0 text-fg-muted" />
              <span className="font-medium">
                {sample.manufactureDate.toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {sample.method}
            </p>
          </div>
        </section>
      )}

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

      {/* Related brands */}
      <section className="mt-4">
        <h2 className="mb-4 text-lg font-semibold">{tb("relatedBrands")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {related.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3 transition-colors hover:border-border-strong"
            >
              <BrandLogo name={b.name} slug={b.slug} className="h-8 w-8 text-[11px]" />
              <span className="truncate text-sm font-medium">{b.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Guide links */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">{tb("helpfulGuides")}</h2>
        <ul className="space-y-2">
          {GUIDES.slice(0, 4).map((g) => (
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
  );
}
