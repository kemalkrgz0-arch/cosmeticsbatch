import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";

const UPDATED = "July 3, 2026";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = pageMeta({
    title: "Terms of Service",
    description: `The terms for using ${site.name}. Batch-code results are informational estimates, not a guarantee of product safety.`,
    path: "/terms",
    locale,
  });
  return meta;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-xl font-semibold tracking-tight">{children}</h2>;
}

export default async function TermsPage({
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
          { name: "Terms of Service", path: "/terms" },
        ]}
      />
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-fg-muted">Last updated: {UPDATED}</p>

      <div className="mt-6 space-y-4 leading-relaxed text-fg-muted">
        <p>
          By accessing or using {site.name} ({site.url}), you agree to these
          Terms of Service. If you do not agree, please do not use the site.
        </p>

        <H2>The service</H2>
        <p>
          {site.name} is a free tool that decodes the batch codes printed on
          cosmetics and perfumes to estimate a manufacture date, product age and
          approximate expiration date. It is provided for informational and
          educational purposes only.
        </p>

        <H2>No warranty &amp; not safety advice</H2>
        <p>
          Batch-code formats vary by manufacturer and change over time. Results,
          shelf-life figures and freshness estimates are <strong>approximate</strong>{" "}
          and are <strong>not a guarantee</strong> of a product&apos;s safety,
          authenticity or condition. Always use your own judgement — inspect the
          product and stop using anything that has changed in smell, colour or
          texture. {site.name} is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; without warranties of any kind.
        </p>

        <H2>Limitation of liability</H2>
        <p>
          To the fullest extent permitted by law, {site.name} and its operators
          are not liable for any direct, indirect, incidental or consequential
          damages arising from your use of, or reliance on, the site or its
          results.
        </p>

        <H2>Acceptable use</H2>
        <p>
          You agree not to misuse the site, including attempting to disrupt it,
          scrape it at scale, circumvent security, or use it for any unlawful
          purpose.
        </p>

        <H2>Intellectual property</H2>
        <p>
          The site&apos;s design, text and software are owned by {site.name} or
          its licensors. Brand names and trademarks belong to their respective
          owners and are referenced for identification only; {site.name} is not
          affiliated with, endorsed by, or sponsored by any brand listed.
        </p>

        <H2>Advertising</H2>
        <p>
          The site is supported by third-party advertising. Your interaction with
          any advertiser is solely between you and that advertiser. See our{" "}
          <Link className="text-accent hover:text-accent-hover" href="/privacy">
            Privacy Policy
          </Link>{" "}
          for how advertising cookies are used.
        </p>

        <H2>Changes</H2>
        <p>
          We may update these Terms from time to time. Continued use of the site
          after changes are posted constitutes acceptance of the updated Terms.
        </p>

        <H2>Contact</H2>
        <p>
          Questions about these Terms? Contact us at{" "}
          <a
            className="text-accent hover:text-accent-hover"
            href="mailto:hello@cosmeticsbatch.com"
          >
            hello@cosmeticsbatch.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
