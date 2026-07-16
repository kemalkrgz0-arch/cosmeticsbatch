import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  DECODER_GUIDES,
  brandsForGuide,
  getDecoderGuide,
} from "@/lib/decoder-guides";
import {
  contentTranslator,
  localizeDecoderGuide,
  localizeGuide,
} from "@/lib/content-i18n";
import { GUIDES } from "@/lib/guides";
import {
  articleSchema,
  pageMeta,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdSlot } from "@/components/ui/ad-slot";
import { AdsenseLoader } from "@/components/ui/adsense-loader";
import { JsonLd } from "@/components/json-ld";
import {
  isContentReviewed,
  reviewedContentLocales,
} from "@/lib/content-review";
import { indexableContentLocales } from "@/lib/publishing-policy";

export function generateStaticParams() {
  return DECODER_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const source = getDecoderGuide(slug);
  if (!source) return {};
  const guide = localizeDecoderGuide(source, await contentTranslator(locale));
  const availableLocales = indexableContentLocales(
    reviewedContentLocales(`dec.${source.slug}`),
  );
  const meta = pageMeta({
    title: guide.title,
    description: guide.description,
    path: `/decoders/${guide.slug}`,
    type: "article",
    locale,
    availableLocales,
    indexable: availableLocales.includes(locale),
  });
  return meta;
}

export default async function DecoderGuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const source = getDecoderGuide(slug);
  if (!source) notFound();

  const t = await contentTranslator(locale);
  const guide = localizeDecoderGuide(source, t);
  const reviewed = isContentReviewed(locale, `dec.${source.slug}`);
  const tc = await getTranslations("contentPages");
  const nav = await getTranslations("nav");

  const path = `/decoders/${guide.slug}`;
  const brands = brandsForGuide(guide);
  const others = DECODER_GUIDES.filter((g) => g.slug !== guide.slug)
    .slice(0, 4)
    .map((g) => localizeDecoderGuide(g, t));
  const formatSource = GUIDES.find((g) => g.slug === "how-to-find-your-batch-code");
  const formatGuide = formatSource ? localizeGuide(formatSource, t) : undefined;

  const crumbs = [
    { name: nav("home"), path: "/" },
    { name: nav("codeFormats"), path: "/decoders" },
    { name: guide.title, path },
  ];

  return (
    <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {reviewed && <AdsenseLoader />}
      <JsonLd
        data={reviewed ? [
          articleSchema({
            title: guide.title,
            description: guide.description,
            path,
            updated: guide.updated,
            locale,
          }),
        ] : []}
      />
      <Breadcrumbs items={crumbs} />

      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-fg-muted">
        {guide.description}
      </p>
      <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-fg-muted">
        <Clock className="h-3.5 w-3.5" />
        {tc("minRead", { n: guide.readMinutes })} ·{" "}
        {tc("updated", {
          date: new Date(guide.updated).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
          }),
        })}
      </p>

      {/* The step-by-step cipher (anatomy table, worked examples and the
          "reading by hand" sections) is intentionally NOT published — the
          decoding method is proprietary. The page keeps its intro, the list of
          brands it covers and the checker call-to-action; users decode by
          entering the code in the tool, which reads the date server-side. */}
      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">{tc("checkYourCodeTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          {tc("checkYourCodeBody")}
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover"
        >
          {tc("checkYourCodeCta")} <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </section>

      {reviewed && <AdSlot placement="article" className="mt-10" height={250} />}

      {brands.length > 0 && (
        <section className="mt-14 border-t border-border pt-8">
          <h2 className="mb-2 text-lg font-semibold">
            {tc("brandsUsing", { count: brands.length })}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-fg-muted">
            {tc("brandsUsingNote")}
          </p>
          <ul className="flex flex-wrap gap-x-3 gap-y-2">
            {brands.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/brands/${b.slug}`}
                  className="text-sm font-medium text-accent hover:text-accent-hover"
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14 border-t border-border pt-8">
        <h2 className="mb-4 text-lg font-semibold">{tc("otherFormats")}</h2>
        <ul className="space-y-2">
          {others.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/decoders/${g.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
              >
                {g.title} <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
        {formatGuide && (
          <p className="mt-5 text-sm leading-relaxed text-fg-muted">
            {tc("whichCode")}{" "}
            <Link
              href={`/guides/${formatGuide.slug}`}
              className="font-medium text-accent hover:text-accent-hover"
            >
              {formatGuide.title}
            </Link>
          </p>
        )}
      </section>
    </article>
  );
}
