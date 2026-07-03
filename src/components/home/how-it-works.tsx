import { CircleCheck, ScanLine, Search } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    icon: Search,
    title: "Select Brand",
    body: "Choose your brand from 50+ supported cosmetic and perfume makers.",
  },
  {
    icon: ScanLine,
    title: "Enter Batch Code",
    body: "Type the batch code stamped or embossed on your product.",
  },
  {
    icon: CircleCheck,
    title: "Get Results",
    body: "See the manufacture date, age, freshness and expiration instantly.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Three simple steps"
        title="How it works"
        subtitle="No account, no waiting. Decode any supported batch code in under ten seconds."
      />
      <ol className="mt-12 grid gap-8 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="relative text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-soft">
              <Icon className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <span className="mt-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-bg-subtle text-xs font-semibold text-fg-muted">
              {i + 1}
            </span>
            <h3 className="mt-3 text-lg font-semibold">{title}</h3>
            <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-fg-muted">
              {body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
