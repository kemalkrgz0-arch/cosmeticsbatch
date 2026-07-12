import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DECODER_GUIDES, brandsForGuide } from "@/lib/decoder-guides";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta({
    title: "Batch Code Formats: Every Manufacturer's Cipher, Explained",
    description:
      "A batch-code format belongs to the manufacturer, not the brand. Coty, L'Oréal, Estée Lauder, LVMH, P&G, Unilever and the rest — each cipher documented with its anatomy, worked examples and blind spots.",
    path: "/decoders",
    locale,
  });
}

export default async function DecodersIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Code formats", path: "/decoders" },
  ];

  // Biggest families first: the pages that answer the most people's question.
  const guides = [...DECODER_GUIDES].sort(
    (a, z) => brandsForGuide(z).length - brandsForGuide(a).length,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Batch code formats
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-fg-muted">
        A batch code&apos;s format belongs to whoever manufactures the product,
        not to the name on the bottle. Coty stamps the same four digits on
        Rimmel, Gucci and adidas; Inter Parfums stamps the same nine characters
        on Montblanc, Coach and Jimmy Choo. Learn the cipher once and you can
        read every brand that shares it.
      </p>
      <p className="mt-4 leading-relaxed text-fg-muted">
        Each page below documents one family: what every character encodes, real
        codes decoded by the same engine that powers the checker, where the code
        is printed on the pack, and — just as importantly — what the format
        cannot tell you.
      </p>

      <ul className="mt-10 space-y-4">
        {guides.map((g) => {
          const count = brandsForGuide(g).length;
          return (
            <li key={g.slug}>
              <Link
                href={`/decoders/${g.slug}`}
                className="group block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-lg font-semibold group-hover:text-accent">
                    {g.title}
                  </h2>
                  <ArrowRight className="h-4 w-4 shrink-0 text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <p className="mt-2 leading-relaxed text-fg-muted">
                  {g.description}
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-muted">
                  <code className="rounded bg-bg-subtle px-1.5 py-0.5 font-mono font-semibold text-fg">
                    {g.anatomy.code}
                  </code>
                  {count > 0 && (
                    <span>
                      {count} brand{count === 1 ? "" : "s"}
                    </span>
                  )}
                  <span>{g.readMinutes} min read</span>
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
