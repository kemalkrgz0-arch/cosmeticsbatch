import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  DECODER_GUIDES,
  brandsForGuide,
  getDecoderGuide,
  type DecoderGuide,
} from "@/lib/decoder-guides";
import { DECODERS } from "@/lib/decoder";
import { GUIDES } from "@/lib/guides";
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
  return DECODER_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getDecoderGuide(slug);
  if (!guide) return {};
  return pageMeta({
    title: guide.title,
    description: guide.description,
    path: `/decoders/${guide.slug}`,
    type: "article",
    locale,
  });
}

const DATE_FMT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
};

/**
 * Run each example through the real decoder and show what it returns. The
 * examples are not transcribed results — if the engine's rules change, these
 * change with them, so the page cannot drift away from the tool.
 */
function WorkedExamples({ guide }: { guide: DecoderGuide }) {
  const decoder = DECODERS[guide.decoderIds[0]];
  const now = new Date();
  const rows = guide.examples.map((ex) => {
    const result = decoder?.decode(ex.code, { now }) ?? null;
    return { ...ex, result };
  });

  return (
    <div className="mt-4 space-y-3">
      {rows.map(({ code, note, result }) => (
        <div
          key={code}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <code className="rounded-lg bg-bg-subtle px-2 py-1 font-mono text-sm font-semibold">
              {code}
            </code>
            <ArrowRight className="h-4 w-4 shrink-0 text-fg-muted" />
            <span className="font-medium">
              {result?.manufactureDate
                ? result.manufactureDate.toLocaleDateString("en-US", DATE_FMT)
                : "does not decode"}
            </span>
            {result?.confidence && (
              <span className="text-xs uppercase tracking-wide text-fg-muted">
                {result.confidence} confidence
              </span>
            )}
          </div>
          {note && (
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{note}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function Body({ lines }: { lines: string[] }) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (key: string) => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={key} className="my-3 space-y-1.5 pl-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-fg-muted">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="leading-relaxed">{b.replace(/^- /, "")}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };
  lines.forEach((line, i) => {
    if (line.startsWith("- ")) bullets.push(line);
    else {
      flush(`ul-${i}`);
      blocks.push(
        <p key={i} className="leading-relaxed text-fg-muted">
          {line}
        </p>,
      );
    }
  });
  flush("ul-end");
  return <div className="space-y-3">{blocks}</div>;
}

export default async function DecoderGuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const guide = getDecoderGuide(slug);
  if (!guide) notFound();

  const path = `/decoders/${guide.slug}`;
  const brands = brandsForGuide(guide);
  const others = DECODER_GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 4);
  const formatGuide = GUIDES.find((g) => g.slug === "how-to-find-your-batch-code");

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Code formats", path: "/decoders" },
    { name: guide.title, path },
  ];

  return (
    <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema({
            title: guide.title,
            description: guide.description,
            path,
            updated: guide.updated,
          }),
          faqSchema(guide.faq),
        ]}
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
        {guide.readMinutes} min read · Updated{" "}
        {new Date(guide.updated).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </p>

      {/* Anatomy — the whole cipher in one table. */}
      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold">
          Anatomy of the code{" "}
          <code className="font-mono text-lg text-accent">
            {guide.anatomy.code}
          </code>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-fg-muted">
                <th className="py-2 pr-4 font-medium">Characters</th>
                <th className="py-2 font-medium">What they encode</th>
              </tr>
            </thead>
            <tbody>
              {guide.anatomy.parts.map((p) => (
                <tr key={p.chars} className="border-b border-border/60">
                  <td className="py-2.5 pr-4 align-top">
                    <code className="rounded bg-bg-subtle px-1.5 py-0.5 font-mono font-semibold">
                      {p.chars}
                    </code>
                  </td>
                  <td className="py-2.5 leading-relaxed text-fg-muted">
                    {p.means}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Worked examples</h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Decoded live by the same engine that powers the checker — not
          transcribed by hand.
        </p>
        <WorkedExamples guide={guide} />
      </section>

      <AdSlot placement="article" className="mt-10" height={250} />

      <div className="mt-10 space-y-10">
        {guide.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="mb-3 text-xl font-semibold">{s.heading}</h2>
            <Body lines={s.body} />
          </section>
        ))}
      </div>

      <Faq items={guide.faq} title="FAQ" />

      {brands.length > 0 && (
        <section className="mt-14 border-t border-border pt-8">
          <h2 className="mb-2 text-lg font-semibold">
            Brands that use this code ({brands.length})
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-fg-muted">
            The format belongs to the manufacturer, not the label on the bottle —
            every brand below is stamped by the same plants and reads the same
            way.
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
        <h2 className="mb-4 text-lg font-semibold">Other code formats</h2>
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
            Not sure which code on the pack is the batch code?{" "}
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
