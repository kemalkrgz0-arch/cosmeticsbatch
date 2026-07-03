import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { CheckForm } from "@/components/check-form";

export function Hero() {
  const t = useTranslations("hero");
  const trust = [
    { icon: Sparkles, label: t("trustFree") },
    { icon: ShieldCheck, label: t("trustNoSignup") },
    { icon: Lock, label: t("trustPrivate") },
  ];
  return (
    <section id="check" className="relative">
      {/* soft ambient background — clipped in its own layer so it can't crop the
          brand-picker dropdown that overflows the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-x-0 -top-40 mx-auto h-80 max-w-4xl rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-14 text-center sm:px-6 sm:pt-20">
        <p className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-fg-muted">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {t("badge")}
        </p>
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
          {t("subtitle")}
        </p>

        <CheckForm navigateOnSelect className="mx-auto mt-9 max-w-2xl text-left" />

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-fg-muted">
          {trust.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-1.5">
              <Icon className="h-4 w-4 text-success" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
