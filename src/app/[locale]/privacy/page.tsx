import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
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
  return pageMeta({
    title: "Privacy Policy",
    description: `How ${site.name} handles data, cookies and advertising. We decode batch codes in your browser and never sell your data.`,
    path: "/privacy",
    locale,
  });
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-xl font-semibold tracking-tight">{children}</h2>;
}

export default async function PrivacyPage({
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
          { name: "Privacy Policy", path: "/privacy" },
        ]}
      />
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-fg-muted">Last updated: {UPDATED}</p>

      <div className="mt-6 space-y-4 leading-relaxed text-fg-muted">
        <p>
          This Privacy Policy explains how {site.name} (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) handles information when you use {site.url}. We built{" "}
          {site.name} to be private by design: batch codes are decoded directly
          in your browser and are never sent to or stored on our servers.
        </p>

        <H2>Information we collect</H2>
        <p>
          <strong>Batch codes &amp; searches.</strong> The batch codes you enter
          are processed locally in your browser to calculate a manufacture date.
          We do not transmit, log or store them.
        </p>
        <p>
          <strong>Local storage.</strong> To improve your experience we may store
          small items in your browser&apos;s local storage — for example your
          recently selected brands and your light/dark theme preference. This
          data stays on your device and is not sent to us.
        </p>
        <p>
          <strong>Server logs.</strong> Like most websites, our hosting provider
          may automatically record standard technical information (such as IP
          address, browser type and pages requested) for security and
          reliability. These logs are not used to personally identify you.
        </p>

        <H2>Cookies &amp; advertising</H2>
        <p>
          We use third-party advertising, including Google AdSense, to keep{" "}
          {site.name} free. Third-party vendors, including Google, use cookies to
          serve ads based on your prior visits to this and other websites.
        </p>
        <ul className="ml-1 list-disc space-y-1.5 pl-5">
          <li>
            Google&apos;s use of advertising cookies enables it and its partners
            to serve ads to you based on your visits to our site and/or other
            sites on the Internet.
          </li>
          <li>
            You may opt out of personalized advertising by visiting{" "}
            <a
              className="text-accent hover:text-accent-hover"
              href="https://www.google.com/settings/ads"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google Ads Settings
            </a>
            .
          </li>
          <li>
            You can also opt out of a third-party vendor&apos;s use of cookies for
            personalized advertising at{" "}
            <a
              className="text-accent hover:text-accent-hover"
              href="https://www.aboutads.info/choices/"
              rel="noopener noreferrer"
              target="_blank"
            >
              aboutads.info/choices
            </a>
            .
          </li>
        </ul>
        <p>
          Where required by law (for example in the EEA, UK and Switzerland), ads
          are served in line with applicable consent obtained through a consent
          management platform.
        </p>

        <H2>How we use information</H2>
        <p>
          We use the limited information above to operate, secure and improve the
          website, and to display advertising. We do not sell your personal
          information.
        </p>

        <H2>Your rights</H2>
        <p>
          Depending on your location, you may have rights under the GDPR, UK GDPR
          or CCPA — including access to, correction of, or deletion of personal
          data, and objecting to certain processing. Because we do not maintain
          personal accounts or store the codes you check, most requests can be
          satisfied by clearing your browser storage. For advertising data,
          please use the opt-out links above.
        </p>

        <H2>Children&apos;s privacy</H2>
        <p>
          {site.name} is not directed to children under 13 and we do not
          knowingly collect personal information from them.
        </p>

        <H2>Third-party links</H2>
        <p>
          Our site may link to third-party websites. We are not responsible for
          the privacy practices or content of those sites.
        </p>

        <H2>Changes to this policy</H2>
        <p>
          We may update this Privacy Policy from time to time. Changes take effect
          when posted on this page, and we will update the &ldquo;Last
          updated&rdquo; date above.
        </p>

        <H2>Contact</H2>
        <p>
          Questions about this policy? Contact us at{" "}
          <a
            className="text-accent hover:text-accent-hover"
            href="mailto:privacy@cosmeticsbatch.com"
          >
            privacy@cosmeticsbatch.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
