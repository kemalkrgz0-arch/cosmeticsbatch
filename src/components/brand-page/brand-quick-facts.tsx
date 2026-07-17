import type { LucideIcon } from "lucide-react";

export function BrandQuickFacts({ facts }: { facts: { icon: LucideIcon; label: string; value: string }[] }) {
  return (
    <dl className="mt-5 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 lg:grid-cols-4">
      {facts.map(({ icon: Icon, label, value }, index) => (
        <div key={label} className={`rounded-[1.4rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 shadow-[var(--shadow-soft)] ${index === facts.length - 1 ? "min-[360px]:col-span-2 lg:col-span-1" : ""}`}>
          <dt className="flex items-center gap-3 text-xs text-[var(--brand-muted)]"><span className="flex size-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--brand-accent)_12%,transparent)] text-[var(--brand-primary)]"><Icon className="size-5" aria-hidden="true" /></span>{label}</dt>
          <dd className="mt-3 text-sm font-semibold leading-5 text-[var(--brand-text)]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
