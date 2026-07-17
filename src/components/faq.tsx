"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/faqs";

export type { FaqItem } from "@/lib/faqs";

export function Faq({
  items,
  title,
  subtitle,
  /** On mobile, collapse questions past this index behind a "Show more" toggle. */
  initialCount = 6,
}: {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
  initialCount?: number;
}) {
  const t = useTranslations("faqUi");
  const [expanded, setExpanded] = useState(false);
  const hidden = Math.max(0, items.length - initialCount);
  // Every item is always in the DOM (SEO + JSON-LD intact). On mobile, the
  // overflow items are CSS-hidden until expanded; on sm+ they're always shown.
  return (
    <section className="reading-frame py-16">
      <SectionHeading title={title ?? t("title")} subtitle={subtitle} />
      <div className="mt-9 divide-y divide-border rounded-2xl border border-border bg-card">
        {items.map((item, i) => (
          <details
            key={item.q}
            className={cn(
              "group px-5 open:bg-bg-subtle/40",
              i >= initialCount && !expanded && "hidden sm:block",
            )}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium marker:hidden">
              {item.q}
              <Plus className="h-5 w-5 shrink-0 text-fg-muted transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <p className="pb-5 pr-9 text-sm leading-relaxed text-fg-muted">
              {item.a}
            </p>
          </details>
        ))}
      </div>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-3 text-sm font-medium transition-colors hover:border-border-strong sm:hidden"
        >
          {expanded ? t("showFewer") : t("showMore", { n: hidden })}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-fg-muted transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
        </button>
      )}
    </section>
  );
}
