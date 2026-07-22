import { SprayCan, Droplet, Wand2, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * "Where is the batch code?" — example product photos with the code already
 * highlighted, so users learn to spot the stamp on different pack types. Each
 * card links into the "how to find your batch code" guide (SEO + internal
 * linking + traffic). The homepage uses pre-sized AVIF derivatives so these
 * below-fold cards do not ask the live image optimizer for a 640px JPEG.
 */
const GUIDE = "/guides/how-to-find-your-batch-code";
const ITEMS = [
  { key: "perfume", icon: SprayCan, guide: "/guides/where-is-the-batch-code-on-perfume" },
  { key: "tube", icon: Droplet, guide: "/guides/where-is-the-batch-code-on-tubes-and-creams" },
  { key: "lipstick", icon: Wand2, guide: "/guides/where-is-the-batch-code-on-lipstick-and-makeup" },
] as const;

export function WhereIsCode() {
  const t = useTranslations("whereCode");
  return (
    <section className="site-frame py-16">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <div className="mt-9 flex snap-x gap-4 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-3 sm:overflow-visible">
        {ITEMS.map(({ key, icon: Icon, guide }) => (
          <Link
            key={key}
            href={guide}
            aria-label={t("cardCta", { type: t(`label.${key}`) })}
            className="group min-w-[78%] snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-border-strong sm:min-w-0"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center bg-bg-subtle p-3">
              <Image
                src={`/where/${key}.avif`}
                alt={t(`alt.${key}`)}
                fill
                unoptimized
                loading="lazy"
                className="object-contain p-3"
              />
              <span className="pointer-events-none absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-fg-muted opacity-0 shadow-soft backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <figcaption className="flex items-center gap-2 px-3.5 py-3">
              <Icon className="h-4 w-4 text-fg-muted" strokeWidth={1.9} />
              <span className="text-sm font-medium">{t(`label.${key}`)}</span>
              <ArrowRight className="ml-auto h-4 w-4 text-fg-muted transition-transform duration-200 group-hover:translate-x-0.5" />
            </figcaption>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          href={GUIDE}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
        >
          {t("viewGuide")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
