import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const WORDMARKS = [
  { slug: "estee-lauder", name: "Estée Lauder", src: "/brand-wordmarks/estee-lauder.svg" },
  { slug: "maybelline", name: "Maybelline", src: "/brand-wordmarks/maybelline.svg" },
  { slug: "lancome", name: "Lancôme", src: "/brand-wordmarks/lancome.svg" },
  { slug: "ysl-beauty", name: "YSL Beauty", src: "/brand-wordmarks/ysl-beauty.svg" },
  { slug: "dior", name: "Dior", src: "/brand-wordmarks/dior.svg" },
  { slug: "chanel", name: "Chanel", src: "/brand-wordmarks/chanel.svg" },
  { slug: "creed", name: "Creed", src: "/brand-wordmarks/creed.svg" },
  { slug: "jean-paul-gaultier", name: "Jean Paul Gaultier", src: "/brand-wordmarks/jean-paul-gaultier.svg" },
  { slug: "paco-rabanne", name: "Paco Rabanne", src: "/brand-wordmarks/paco-rabanne.svg" },
  { slug: "carolina-herrera", name: "Carolina Herrera", src: "/brand-wordmarks/carolina-herrera.svg" },
] as const;

function WordmarkRow({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="brand-marquee-group" aria-hidden={duplicate || undefined}>
      {WORDMARKS.map((brand) => (
        <Link
          key={brand.slug}
          href={`/brands/${brand.slug}`}
          tabIndex={duplicate ? -1 : undefined}
          className="group flex h-16 w-36 shrink-0 items-center justify-center px-4 sm:w-44"
          aria-label={duplicate ? undefined : brand.name}
        >
          {/* These curated local wordmarks replace unreliable favicons. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.src}
            alt={duplicate ? "" : `${brand.name} logo`}
            width="176"
            height="64"
            loading="lazy"
            decoding="async"
            className="max-h-10 w-full object-contain opacity-45 grayscale transition-opacity duration-200 group-hover:opacity-80 dark:invert"
          />
        </Link>
      ))}
    </div>
  );
}

export function PopularBrands() {
  const t = useTranslations("popularBrands");
  return (
    <section className="py-14 sm:py-16" aria-labelledby="popular-brands-title">
      <div className="site-frame text-center">
        <h2
          id="popular-brands-title"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-fg-muted sm:text-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t("title")}
        </h2>
        <p className="sr-only">{t("subtitle")}</p>
      </div>

      <div className="brand-marquee mt-8 overflow-hidden">
        <div className="brand-marquee-track">
          <WordmarkRow />
          <WordmarkRow duplicate />
        </div>
      </div>

      <div className="mt-7 text-center">
        <Link
          href="/brands"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
        >
          {t("viewAll")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
