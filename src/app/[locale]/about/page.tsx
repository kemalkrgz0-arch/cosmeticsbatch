import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta({
    title: "About",
    description: `About ${site.name} — a free, private cosmetic and perfume batch code checker.`,
    path: "/about",
    locale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        About {site.name}
      </h1>
      <div className="mt-6 space-y-4 leading-relaxed text-fg-muted">
        <p>
          {site.name} is a free tool that decodes the batch codes printed on
          cosmetics and perfumes, revealing the manufacture date, current age
          and estimated expiration of your products.
        </p>
        <p>
          We built it because the existing batch-code tools feel dated and
          intrusive. {site.name} is fast, private, and mobile-first — codes are
          decoded instantly, with clear confidence levels so you know how much to
          trust each result.
        </p>
        <p>
          Our estimates use manufacturer-specific algorithms where available and
          honest, well-documented heuristics elsewhere. Shelf-life figures are
          typical industry values and are informational only — they are not a
          guarantee of a product&apos;s safety.
        </p>
      </div>
      <div className="mt-8">
        <Link
          href="/#check"
          className="inline-flex h-11 items-center rounded-full bg-cta px-5 font-semibold text-cta-fg transition-colors hover:bg-cta-hover"
        >
          Check a batch code
        </Link>
      </div>
    </div>
  );
}
