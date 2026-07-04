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
      <ol className="mx-auto mt-10 grid max-w-md gap-3 sm:mt-12 sm:max-w-none sm:grid-cols-3 sm:gap-8">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li
            key={title}
            className="relative flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-col sm:items-center sm:border-0 sm:bg-transparent sm:p-0 sm:text-center sm:shadow-none"
          >
            <div className="relative shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-bg-subtle sm:h-14 sm:w-14 sm:bg-card sm:shadow-soft">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
              </div>
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-fg text-[11px] font-semibold text-bg sm:h-6 sm:w-6 sm:text-xs">
                {i + 1}
              </span>
            </div>
            <div className="min-w-0 sm:mt-4">
              <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted sm:mx-auto sm:mt-1.5 sm:max-w-xs">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
