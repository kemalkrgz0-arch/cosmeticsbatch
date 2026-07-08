import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
    title: "About",
    description: `About ${site.name} — a free, private cosmetic and perfume batch code checker.`,
    path: "/about",
    locale,
  });
}

export default async function AboutPage({
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
          { name: "About", path: "/about" },
        ]}
      />
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        About {site.name}
      </h1>
      <div className="mt-6 space-y-4 leading-relaxed text-fg-muted">
        <p>
          {site.name} is a free tool that decodes the batch codes printed on
          cosmetics and perfumes, revealing the manufacture date, current age
          and estimated expiration of your products.
        </p>
        <p>
          We built it because the existing batch-code tools feel dated and
          intrusive. {site.name} is fast, private, and mobile-first — codes are
          decoded instantly, with clear confidence levels so you know how much to
          trust each result.
        </p>
        <p>
          Our estimates use manufacturer-specific algorithms where available and
          honest, well-documented heuristics elsewhere. Shelf-life figures are
          typical industry values and are informational only — they are not a
          guarantee of a product&apos;s safety.
        </p>
      </div>

      <h2 className="mt-12 text-xl font-semibold">How we read the dates</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-fg-muted">
        <p>
          A batch code is a production stamp, not an expiry date. For each
          supported brand we identify which manufacturer&apos;s coding family the
          product belongs to and read the manufacture date from it. Where a brand
          or its parent group uses a documented, verifiable scheme, the result is
          precise to the month or day. Where no public scheme is confirmed, we
          fall back to detecting a date embedded in the code and label the reading
          with a lower confidence level so you know how much to trust it.
        </p>
        <p>
          We only publish a decoder once we have validated it against real
          code-to-date samples. Brands we cannot yet decode reliably are kept out
          of the picker rather than shown with a guess.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Accuracy and limitations</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-fg-muted">
        <p>
          Every result shows a confidence level — high, medium or low. The date
          we return is the <em>manufacture</em> date; the expiration is an
          estimate produced by adding the product&apos;s typical unopened shelf
          life, which varies by category (roughly 24–36 months for makeup and
          skincare, 3–5 years for fragrance). Once a product is opened, the
          period-after-opening (the open-jar symbol) becomes the real limit.
        </p>
        <p>
          These figures are industry averages for guidance only and are not a
          guarantee of safety. If a product smells, looks or feels off — or is an
          eye or lip product past its prime — discard it regardless of what any
          date says.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Your privacy</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-fg-muted">
        <p>
          Decoding happens on our server and the codes you enter are never stored
          or logged. No account is required, and nothing you type is saved — so
          checking a code stays completely private.
        </p>
      </div>

      <div className="mt-10">
        <Link
          href="/#check"
          className="inline-flex h-11 items-center rounded-full bg-cta px-5 font-semibold text-cta-fg transition-colors hover:bg-cta-hover"
        >
          Check a batch code
        </Link>
      </div>
    </div>
  );
}
