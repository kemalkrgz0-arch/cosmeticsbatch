import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DECODER_GUIDES, brandsForGuide } from "@/lib/decoder-guides";
import { contentTranslator, localizeDecoderGuide } from "@/lib/content-i18n";
import { pageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tc = await getTranslations({ locale, namespace: "contentPages" });
  const meta = pageMeta({
    title: tc("formatsTitle"),
    description: tc("formatsIntro"),
    path: "/decoders",
    locale,
  });
  return meta;
}

export default async function DecodersIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await contentTranslator(locale);
  const tc = await getTranslations("contentPages");
  const nav = await getTranslations("nav");

  const crumbs = [
    { name: nav("home"), path: "/" },
    { name: nav("codeFormats"), path: "/decoders" },
  ];

  // Biggest families first: the pages that answer the most people's question.
  const guides = [...DECODER_GUIDES]
    .sort((a, z) => brandsForGuide(z).length - brandsForGuide(a).length)
    .map((g) => localizeDecoderGuide(g, t));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={crumbs} />

      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {tc("formatsTitle")}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-fg-muted">
        {tc("formatsIntro")}
      </p>
      <p className="mt-4 leading-relaxed text-fg-muted">
        {tc("formatsIntro2")}
      </p>

      <ul className="mt-10 space-y-4">
        {guides.map((g) => {
          const count = brandsForGuide(g).length;
          return (
            <li key={g.slug}>
              <Link
                href={`/decoders/${g.slug}`}
                className="group block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-lg font-semibold group-hover:text-accent">
                    {g.title}
                  </h2>
                  <ArrowRight className="h-4 w-4 shrink-0 text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <p className="mt-2 leading-relaxed text-fg-muted">
                  {g.description}
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-muted">
                  <code className="rounded bg-bg-subtle px-1.5 py-0.5 font-mono font-semibold text-fg">
                    {g.anatomy.code}
                  </code>
                  {count > 0 && (
                    <span>
                      {count} {tc("brandCount")}
                    </span>
                  )}
                  <span>{tc("minRead", { n: g.readMinutes })}</span>
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
