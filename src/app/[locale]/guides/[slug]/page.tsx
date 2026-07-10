import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GUIDES, getGuide } from "@/lib/guides";
import { POPULAR_BRANDS } from "@/lib/brands";
import { linkifyBrands, type TextToken } from "@/lib/internal-links";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  pageMeta,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Faq } from "@/components/faq";
import { AdSlot } from "@/components/ui/ad-slot";
import { JsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return pageMeta({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    type: "article",
    locale,
  });
}

/** Render tokenized text, turning brand tokens into internal links. */
function Tokens({ tokens }: { tokens: TextToken[] }) {
  return (
    <>
      {tokens.map((t, i) =>
        t.href ? (
          <Link
            key={i}
            href={t.href}
            className="font-medium text-accent hover:text-accent-hover"
          >
            {t.text}
          </Link>
        ) : (
          <span key={i}>{t.text}</span>
        ),
      )}
    </>
  );
}

/**
 * Render a body paragraph, supporting simple "- " bullet lines grouped as a
 * list. Each line is run through `linkifyBrands` (sharing `used` across the
 * whole guide) so the first mention of a brand becomes an internal link.
 */
function Body({ lines, used }: { lines: string[]; used: Set<string> }) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (key: string) => {
    if (bullets.length) {
      blocks.push(
        <ul key={key} className="my-3 space-y-1.5 pl-1">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-fg-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="leading-relaxed">
                <Tokens tokens={linkifyBrands(b.replace(/^- /, ""), used)} />
              </span>
            </li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };
  lines.forEach((line, i) => {
    if (line.startsWith("- ")) bullets.push(line);
    else {
      flush(`ul-${i}`);
      blocks.push(
        <p key={i} className="leading-relaxed text-fg-muted">
          <Tokens tokens={linkifyBrands(line, used)} />
        </p>,
      );
    }
  });
  flush("ul-end");
  return <div className="space-y-3">{blocks}</div>;
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const guide = getGuide(slug);
  if (!guide) notFound();

  const path = `/guides/${guide.slug}`;
  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);
  // Shared across every section so each brand is linked at most once per guide.
  const usedBrandLinks = new Set<string>();
  const brandChecks = POPULAR_BRANDS.slice(0, 8);

  return (
    <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path },
          ]),
          articleSchema({
            title: guide.title,
            description: guide.description,
            path,
            updated: guide.updated,
          }),
          ...(guide.faq ? [faqSchema(guide.faq)] : []),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.title, path },
        ]}
      />

      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-fg-muted">
        {guide.description}
      </p>
      <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-fg-muted">
        <Clock className="h-3.5 w-3.5" />
        {guide.readMinutes} min read · Updated{" "}
        {new Date(guide.updated).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </p>

      <div className="mt-10 space-y-10">
        {guide.sections.map((s, i) => (
          <section key={s.heading}>
            <h2 className="mb-3 text-xl font-semibold">{s.heading}</h2>
            <Body lines={s.body} used={usedBrandLinks} />
            {s.image && (
              <figure className="mt-4 overflow-hidden rounded-2xl border border-border bg-bg-subtle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image.src}
                  alt={s.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto max-h-[440px] w-auto object-contain p-3"
                />
              </figure>
            )}
            {i === 0 && (
              <AdSlot placement="article" className="mt-10" height={250} />
            )}
          </section>
        ))}
      </div>

      {guide.faq && <Faq items={guide.faq} title="FAQ" />}

      <section className="mt-14 border-t border-border pt-8">
        <h2 className="mb-4 text-lg font-semibold">Check a brand&apos;s batch code</h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {brandChecks.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/brands/${b.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
              >
                {b.name} <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 border-t border-border pt-8">
        <h2 className="mb-4 text-lg font-semibold">More guides</h2>
        <ul className="space-y-2">
          {others.map((g) => (
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
    </article>
  );
}
