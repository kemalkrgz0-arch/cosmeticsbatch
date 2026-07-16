import { CircleHelp, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { CheckForm } from "@/components/check-form";

export function Hero() {
  const t = useTranslations("hero");
  const trust = [
    { icon: Sparkles, label: t("trustFree") },
    { icon: ShieldCheck, label: t("trustNoSignup") },
    { icon: CircleHelp, label: t("trustPrivate") },
  ];
  return (
    <section id="check" className="relative">
      {/* soft ambient background — clipped in its own layer so it can't crop the
          brand-picker dropdown that overflows the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* layered ambient glow — two soft blobs give the white hero depth */}
        <div className="absolute inset-x-0 -top-40 mx-auto h-80 max-w-4xl rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -top-24 left-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-success/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_60%)]" />
      </div>
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-14 text-center sm:px-6 sm:pt-20">
        <p className="animate-fade-up mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-fg-muted shadow-soft">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {t("badge")}
        </p>
        <h1
          className="animate-fade-up text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
          style={{ animationDelay: "60ms" }}
        >
          {t("title")}
        </h1>
        <p
          className="animate-fade-up mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg"
          style={{ animationDelay: "120ms" }}
        >
          {t("subtitle")}
        </p>

        {/* relative z-30 keeps the open brand dropdown above the trust chips —
            the fade-up transforms create stacking contexts, so without this the
            later chips paint over the dropdown. */}
        <div
          className="animate-fade-up relative z-30"
          style={{ animationDelay: "180ms" }}
        >
          <CheckForm navigateOnSelect className="mx-auto mt-9 max-w-2xl text-left" />
        </div>

        <ul
          className="animate-fade-up relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2"
          style={{ animationDelay: "240ms" }}
        >
          {trust.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-fg-muted"
            >
              <Icon className="h-4 w-4 text-success" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
