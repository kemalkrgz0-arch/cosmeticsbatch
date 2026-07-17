import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import type { Brand } from "@/lib/brands";
import type { BrandTheme } from "@/lib/brand-theme";
import { BrandLogo } from "@/components/ui/brand-logo";

export function BrandHero({
  brand,
  theme,
  title,
  byline,
  intro,
  disclaimer,
}: {
  brand: Brand;
  theme: BrandTheme;
  title: string;
  byline: string;
  intro: string;
  disclaimer: string;
}) {
  const image = theme.heroImage;
  return (
    <section className="brand-hero relative isolate overflow-hidden border-y border-[var(--brand-border)] bg-[var(--brand-background)] sm:rounded-[2rem] sm:border">
      {image && (
        <picture>
          {theme.mobileHeroImage && <source media="(max-width: 639px)" srcSet={theme.mobileHeroImage} />}
          <Image src={image} alt="" fill priority sizes="(max-width: 640px) 100vw, 1440px" className="object-cover [object-position:var(--brand-mobile-focal)] sm:[object-position:var(--brand-focal)]" />
        </picture>
      )}
      <div className="absolute inset-0 bg-[image:var(--brand-overlay)]" />
      {!image && <div aria-hidden="true" className="brand-hero-fallback absolute inset-0" />}
      <div className="relative z-10 flex min-h-[31rem] items-center px-5 pb-32 pt-14 sm:min-h-[34rem] sm:px-10 sm:pb-36 lg:px-16">
        <div className="max-w-[38rem] animate-fade-up">
          <BrandLogo name={brand.name} slug={brand.slug} className="mb-7 h-14 w-14 rounded-2xl text-sm shadow-sm" />
          <h1 className="brand-display max-w-[13ch] text-balance text-[clamp(2.7rem,6vw,4.5rem)] font-semibold leading-[.96] tracking-[-.045em] text-[var(--brand-text)]">{title}</h1>
          <p className="mt-5 text-lg font-semibold text-[var(--brand-primary)]">{byline}</p>
          <p className="mt-5 max-w-[35rem] text-pretty text-base leading-7 text-[var(--brand-muted)] sm:text-lg">{intro}</p>
          <p className="mt-5 flex max-w-[34rem] items-start gap-2.5 text-sm leading-6 text-[var(--brand-muted)]"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--brand-primary)]" aria-hidden="true" />{disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
