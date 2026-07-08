import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Mail } from "lucide-react";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta({
    title: "Contact",
    description: `Get in touch with ${site.name} — corrections to a batch-code result, a brand request, or any question about the tool.`,
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Contact
      </h1>
      <div className="mt-6 space-y-4 leading-relaxed text-fg-muted">
        <p>
          {site.name} is an independent, free tool. We read every message and
          especially welcome:
        </p>
        <ul className="space-y-2 pl-1">
          {[
            "Corrections — a batch code that decoded to the wrong date, or a brand whose format has changed.",
            "Brand requests — a cosmetic or perfume brand you'd like us to support.",
            "Questions about how the tool works, privacy, or a result you don't understand.",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p>
          When reporting a wrong result, include the brand and the exact code as
          printed on the packaging — it helps us fix the decoder faster.
        </p>
      </div>

      <a
        href={`mailto:${site.email}`}
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-cta px-5 font-semibold text-cta-fg transition-colors hover:bg-cta-hover"
      >
        <Mail className="h-4 w-4" />
        {site.email}
      </a>

      <p className="mt-6 text-sm text-fg-muted">
        We usually reply within a few business days. {site.name} provides
        informational estimates only and cannot guarantee the safety of any
        product.
      </p>
    </div>
  );
}
