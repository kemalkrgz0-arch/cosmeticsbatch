import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GUIDES } from "@/lib/guides";
import { contentTranslator, localizeGuide } from "@/lib/content-i18n";
import { pageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = pageMeta({
    title: "Guides — Batch Codes, Shelf Life & Storage",
    description:
      "Practical guides on reading batch codes, cosmetic and perfume shelf life, safe storage, and spotting counterfeits.",
    path: "/guides",
    locale,
  });
  return meta;
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // The index rendered raw `GUIDES`, so every card stayed English even though
  // `messages/content/*.json` already holds the translations the detail page
  // and the brand page both use. `/decoders` was already doing this correctly.
  const t = await contentTranslator(locale);
  const nav = await getTranslations("nav");
  const tc = await getTranslations("contentPages");
  const guides = GUIDES.map((guide) => localizeGuide(guide, t));
  return (
    <div className="page-frame py-10">
      <Breadcrumbs
        items={[
          { name: nav("home"), path: "/" },
          { name: nav("guides"), path: "/guides" },
        ]}
      />
      <SectionHeading
        as="h1"
        title={nav("guides")}
        subtitle="Everything about batch codes, shelf life, storage and authenticity — written to actually be useful."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong"
          >
            <h2 className="text-lg font-semibold leading-snug">{g.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
              {g.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-fg-muted">
                <Clock className="h-3.5 w-3.5" />
                {tc("minRead", { n: g.readMinutes })}
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-accent">
                Read <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
