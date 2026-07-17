import { CircleHelp, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
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
    <section id="check" className="relative pb-8 sm:pb-12">
      <div className="site-frame pt-3 sm:pt-5">
        <div className="relative min-h-[34rem] overflow-hidden rounded-[1.75rem] border border-border bg-[#ead9c2] shadow-soft sm:min-h-[38rem] sm:rounded-[2rem]">
          <Image
            src="/home/cosmetics-hero.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 100vw, 1536px"
            className="object-cover object-[64%_center] sm:object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[rgba(247,238,224,.64)] sm:bg-[linear-gradient(90deg,rgba(247,238,224,.98)_0%,rgba(247,238,224,.93)_31%,rgba(247,238,224,.48)_54%,rgba(247,238,224,.04)_78%)] dark:bg-[rgba(10,10,11,.68)] sm:dark:bg-[linear-gradient(90deg,rgba(10,10,11,.96)_0%,rgba(10,10,11,.88)_35%,rgba(10,10,11,.42)_62%,rgba(10,10,11,.12)_100%)]"
          />

          <div className="relative z-10 mx-auto flex min-h-[34rem] max-w-[90rem] items-start px-5 pb-44 pt-12 sm:min-h-[38rem] sm:items-center sm:px-10 sm:pb-48 sm:pt-10 lg:px-16">
            <div className="w-full min-w-0 max-w-xl text-left">
              <p className="animate-fade-up mb-5 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/75 px-3 py-1 text-xs font-medium text-neutral-700 shadow-soft backdrop-blur-sm dark:border-white/15 dark:bg-black/35 dark:text-neutral-200">
                <Sparkles className="h-3.5 w-3.5 text-amber-700 dark:text-amber-300" />
                {t("badge")}
              </p>
              <h1
                className="animate-fade-up brand-display max-w-full text-balance text-[2.25rem] font-semibold leading-[.98] tracking-[-0.035em] text-neutral-950 min-[390px]:text-[2.55rem] sm:text-6xl lg:text-7xl dark:text-white"
                style={{ animationDelay: "60ms" }}
              >
                {t("title")}
              </h1>
              <p
                className="animate-fade-up mt-5 max-w-lg text-pretty text-base leading-relaxed text-neutral-700 sm:text-lg dark:text-neutral-200"
                style={{ animationDelay: "120ms" }}
              >
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* relative z-30 keeps the open brand dropdown above the trust chips —
            the fade-up transforms create stacking contexts, so without this the
            later chips paint over the dropdown. */}
        <div
          className="animate-fade-up relative z-30 mx-auto -mt-36 max-w-3xl px-3 sm:-mt-32 sm:px-8"
          style={{ animationDelay: "180ms" }}
        >
          <CheckForm navigateOnSelect className="text-left shadow-card" />
        </div>

        <ul
          className="animate-fade-up relative z-10 mt-5 flex flex-wrap items-center justify-center gap-2"
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
