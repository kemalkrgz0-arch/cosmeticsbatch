import { Gauge, Heart, Lock, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeatureGrid() {
  const t = useTranslations("features");
  const features = [
    { icon: Sparkles, title: t("accurateTitle"), body: t("accurateBody") },
    { icon: Gauge, title: t("fastTitle"), body: t("fastBody") },
    { icon: Lock, title: t("privateTitle"), body: t("privateBody") },
    { icon: Heart, title: t("freeTitle"), body: t("freeBody") },
  ];
  return (
    <section className="site-frame pb-4">
      <div className="grid gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2 sm:gap-8 sm:p-10 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="font-semibold leading-tight">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
