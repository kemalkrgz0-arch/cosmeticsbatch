import { ArrowRight, CalendarDays, Check, ScanLine, Search, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SUPPORTED_BRAND_COUNT } from "@/lib/brands";

function BrandPickerVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[17rem]" aria-hidden="true">
      <div className="absolute -left-5 top-8 h-20 w-20 rounded-full bg-accent/10 blur-2xl" />
      <div className="relative rounded-2xl border border-border/80 bg-card/95 p-3 shadow-card backdrop-blur-sm">
        <div className="flex h-10 items-center gap-2.5 rounded-xl border border-border bg-bg px-3 text-fg-muted">
          <Search className="h-4 w-4 shrink-0" />
          <span className="h-2.5 w-24 rounded-full bg-border-strong/70" />
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <BrandLogo name="Chanel" slug="chanel" className="h-11 w-11 rounded-xl" />
          <BrandLogo name="Dior" slug="dior" className="h-11 w-11 rounded-xl" />
          <BrandLogo name="Lancôme" slug="lancome" className="h-11 w-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function BatchCodeVisual() {
  return (
    <div className="relative mx-auto flex h-32 w-full max-w-[17rem] items-end justify-center" aria-hidden="true">
      <div className="absolute inset-x-8 bottom-0 h-10 rounded-full bg-accent/10 blur-2xl" />
      <div className="relative mr-3 h-24 w-20 rounded-[1.25rem_1.25rem_0.8rem_0.8rem] border border-border-strong bg-gradient-to-b from-card to-bg-subtle shadow-card">
        <div className="absolute -top-4 left-1/2 h-5 w-10 -translate-x-1/2 rounded-t-md border border-border-strong bg-fg/85" />
        <Sparkles className="absolute left-1/2 top-7 h-5 w-5 -translate-x-1/2 text-accent" />
      </div>
      <div className="relative mb-2 h-20 w-28 rounded-xl border border-border-strong bg-card p-3 shadow-card">
        <span className="absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2 border-accent" />
        <span className="absolute right-2 top-2 h-3 w-3 border-r-2 border-t-2 border-accent" />
        <span className="absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-accent" />
        <span className="absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-accent" />
        <div className="flex h-full items-center justify-center rounded-md bg-bg-subtle font-mono text-lg font-bold tracking-[0.16em]">5H03</div>
        <ScanLine className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-accent/20" />
      </div>
    </div>
  );
}

function ResultVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[17rem]" aria-hidden="true">
      <div className="absolute -right-4 top-5 h-24 w-24 rounded-full bg-success/10 blur-2xl" />
      <div className="relative grid grid-cols-[1fr_auto] gap-3 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-card backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 text-fg-muted">
            <CalendarDays className="h-4 w-4 text-accent" />
            <span className="h-2.5 w-16 rounded-full bg-border-strong/70" />
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">2025</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-success">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success-bg">
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="h-2 w-14 rounded-full bg-success/25" />
          </div>
        </div>
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[conic-gradient(var(--success)_0_84%,var(--border)_84%_100%)]">
          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-card">
            <span className="text-lg font-semibold">84%</span>
            <span className="mt-0.5 h-1.5 w-7 rounded-full bg-success/25" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = [
    {
      visual: <BrandPickerVisual />,
      title: t("step1Title"),
      body: t("step1Body", { n: SUPPORTED_BRAND_COUNT }),
    },
    { visual: <BatchCodeVisual />, title: t("step2Title"), body: t("step2Body") },
    { visual: <ResultVisual />, title: t("step3Title"), body: t("step3Body") },
  ];
  return (
    <section id="how-it-works" className="site-frame py-14 sm:py-16">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <ol className="mx-auto mt-8 grid max-w-md gap-4 sm:mt-10 sm:max-w-none sm:grid-cols-3 sm:gap-5">
        {steps.map(({ visual, title, body }, i) => (
          <li
            key={title}
            className="group relative overflow-visible rounded-3xl border border-border bg-card p-4 shadow-soft transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-card sm:p-5"
          >
            {i < steps.length - 1 && (
              <span className="absolute -right-[22px] top-[5.5rem] z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-bg text-fg-muted shadow-soft sm:flex" aria-hidden="true">
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
            <div className="relative flex min-h-40 items-center overflow-hidden rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_50%_20%,color-mix(in_srgb,var(--accent)_9%,transparent),transparent_65%)] px-4 py-5">
              {visual}
            </div>
            <div className="px-1 pb-1 pt-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-bold tracking-[0.18em] text-accent">0{i + 1}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
