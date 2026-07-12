import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CalendarClock, Info, MapPin, Timer } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BRANDS, getBrand, POPULAR_BRANDS } from "@/lib/brands";
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
import { BrandLogo } from "@/components/ui/brand-logo";
import { JsonLd } from "@/components/json-ld";

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
  // Brand pages are the tool, not the reference. Every brand sharing a decoder
  // gets the same generated copy — 200-odd near-identical pages, which is the
  // definition of scaled, low-value content. The cipher they all describe is
  // documented once, properly, under /decoders, and that is what we index.
  // `follow` keeps the link equity flowing to those pages and to the guides.
  meta.robots = { index: false, follow: true };
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
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          faqSchema(brandFaq),
          articleSchema({
            title: tb("checkerTitle", { name: brand.name }),
            description: tb("blurb", { name: brand.name, category }),
            path,
            updated: "2026-06-01",
          }),
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

      <AdSlot placement="brand" className="my-12" height={250} />

      <Faq items={brandFaq} title={tb("faqTitle", { name: brand.name })} />

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
