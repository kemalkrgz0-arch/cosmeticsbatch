import { Gauge, Heart, Lock, Sparkles } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Accurate & Reliable",
    body: "Manufacturer-specific algorithms for precise results.",
  },
  {
    icon: Gauge,
    title: "Fast & Easy",
    body: "Get results in just a few seconds — no sign-up.",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    body: "Codes are decoded in your browser. Your privacy comes first.",
  },
  { icon: Heart, title: "Always Free", body: "Every feature is 100% free, forever." },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="grid gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2 sm:gap-8 sm:p-10 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="font-semibold leading-tight">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
