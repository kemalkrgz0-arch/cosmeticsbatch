import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { POPULAR_BRANDS } from "@/lib/brands";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SectionHeading } from "@/components/ui/section-heading";

export function PopularBrands() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading title="Popular Brands" subtitle="Jump straight to a brand’s batch code decoder." />
      <div className="mt-9 flex snap-x gap-3 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible lg:grid-cols-8">
        {POPULAR_BRANDS.map((b) => (
          <Link
            key={b.slug}
            href={`/brands/${b.slug}`}
            className="group flex min-w-[120px] snap-start flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong"
          >
            <BrandLogo name={b.name} slug={b.slug} className="h-12 w-12 text-sm" />
            <span className="text-center text-sm font-medium leading-tight">
              {b.name}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/brands"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
        >
          View all brands <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
