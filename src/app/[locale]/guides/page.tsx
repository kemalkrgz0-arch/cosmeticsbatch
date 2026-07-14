import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GUIDES } from "@/lib/guides";
import { pageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { DEFAULT_LOCALE } from "@/i18n/locales";

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
    availableLocales: [DEFAULT_LOCALE],
  });
  if (locale !== DEFAULT_LOCALE) meta.robots = { index: false, follow: true };
  return meta;
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ]}
      />
      <SectionHeading
        as="h1"
        title="Guides"
        subtitle="Everything about batch codes, shelf life, storage and authenticity — written to actually be useful."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
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
                {g.readMinutes} min read
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
