import { BadgeCheck, Heart, LockKeyhole, ShieldCheck } from "lucide-react";

export function TrustDisclaimer({ independent, estimate, privateLabel, free }: { independent: string; estimate: string; privateLabel: string; free: string }) {
  const items = [
    { icon: ShieldCheck, text: independent },
    { icon: BadgeCheck, text: estimate },
    { icon: LockKeyhole, text: privateLabel },
    { icon: Heart, text: free },
  ];
  return <aside className="mt-8 rounded-[1.6rem] border border-[var(--brand-border)] bg-[color-mix(in_srgb,var(--brand-background)_62%,var(--card))] px-5 py-5" aria-label="Service limitations"> <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map(({ icon: Icon, text }) => <li key={text} className="flex items-start gap-3 text-sm leading-5 text-[var(--brand-muted)]"><Icon className="mt-0.5 size-5 shrink-0 text-[var(--brand-primary)]" aria-hidden="true"/><span>{text}</span></li>)}</ul></aside>;
}
