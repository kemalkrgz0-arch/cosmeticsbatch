import { ArrowRight, CircleCheck, ScanLine, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { SUPPORTED_BRAND_COUNT } from "@/lib/brands";

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = [
    {
      icon: Search,
      title: t("step1Title"),
      body: t("step1Body", { n: SUPPORTED_BRAND_COUNT }),
    },
    { icon: ScanLine, title: t("step2Title"), body: t("step2Body") },
    { icon: CircleCheck, title: t("step3Title"), body: t("step3Body") },
  ];
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <ol className="mx-auto mt-8 grid max-w-md gap-3 sm:mt-10 sm:max-w-none sm:grid-cols-3 sm:gap-5">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li
            key={title}
            className="group relative flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:min-h-64 sm:flex-col sm:items-start sm:justify-between sm:p-6 sm:text-left"
          >
            {i < steps.length - 1 && (
              <span className="absolute -right-[22px] top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg text-fg-muted shadow-soft sm:flex" aria-hidden="true">
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
            <div className="relative shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/15 bg-accent/[0.06] sm:h-14 sm:w-14">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
              </div>
            </div>
            <div className="min-w-0 sm:mt-auto">
              <p className="mb-2 hidden text-xs font-bold tracking-[0.16em] text-accent sm:block">0{i + 1}</p>
              <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted sm:mt-2 sm:max-w-xs">
                {body}
              </p>
            </div>
            <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-fg text-xs font-semibold text-bg sm:hidden">{i + 1}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
