import type { Metadata } from "next";
import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getBrand, POPULAR_BRANDS } from "@/lib/brands";
import { checkBatchCode } from "@/lib/decoder";
import { ResultCard } from "@/components/result-card";
import { CheckForm } from "@/components/check-form";
import { EanVsBatch } from "@/components/ean-vs-batch";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { logCheck, toCheckLog } from "@/lib/dataset";
import { isHumanUA } from "@/lib/bot-filter";
import { BrandLogo } from "@/components/ui/brand-logo";
import { pageMeta } from "@/lib/seo";

// Query permutations consolidate to the locale's base checker URL. This keeps
// the checker indexable without creating one search document per entered code.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta({
    title: "Batch Code Checker",
    description:
      "Select a cosmetic or perfume brand and enter its batch code to estimate the manufacture date and product age.",
    path: "/check",
    locale,
  });
}

export default async function CheckPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ brand?: string; code?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { brand: brandSlug, code } = await searchParams;
  const brand = brandSlug ? getBrand(brandSlug) : undefined;

  if (!brand || !code) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold">Check a batch code</h1>
        <p className="mt-2 text-fg-muted">
          Select a brand and enter its batch code to decode the manufacture date.
        </p>
        <CheckForm className="mt-8" />
        <EanVsBatch className="mt-8" />
      </div>
    );
  }

  const result = checkBatchCode({
    brandName: brand.name,
    code,
    decoderId: brand.decoderId,
    shelfLifeMonths: brand.shelfLifeMonths,
    category: brand.category,
  });

  // Record the check in our own dataset — real users only (skip crawlers by
  // User-Agent). No IP stored; country is coarse edge data.
  const hdrs = await headers();
  if (isHumanUA(hdrs.get("user-agent"))) {
    await logCheck(
      toCheckLog({
        source: "check",
        brandSlug: brand.slug,
        code,
        decoderId: brand.decoderId,
        locale,
        country: hdrs.get("cf-ipcountry") ?? undefined,
        result,
      }),
    );
  }

  const related = POPULAR_BRANDS.filter((b) => b.slug !== brand.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Brands", path: "/brands" },
          { name: brand.name, path: `/brands/${brand.slug}` },
          { name: "Result", path: `/check?brand=${brand.slug}` },
        ]}
      />

      <ResultCard result={result} brand={brand} />

      {/* Check another */}
      <div className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Check another code</h2>
        <CheckForm initialBrand={brand} />
      </div>

      {/* Related brands — internal linking for SEO */}
      <section className="mt-4">
        <h2 className="mb-4 text-lg font-semibold">Related brands</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        <Link
          href={`/brands/${brand.slug}`}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
        >
          Learn how {brand.name} batch codes work
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
