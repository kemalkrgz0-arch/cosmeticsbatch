import { ShieldCheck, Sparkles, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function SiteFooter() {
  const t = useTranslations("footer");
  const th = useTranslations("hero");
  const columns = [
    {
      title: t("company"),
      links: [
        { label: t("aboutUs"), href: "/about" },
        { label: t("contact"), href: "/contact" },
        { label: t("howItWorks"), href: "/#how-it-works" },
        { label: t("privacy"), href: "/privacy" },
        { label: t("terms"), href: "/terms" },
      ],
    },
    {
      title: t("resources"),
      links: [
        { label: t("batchGuide"), href: "/guides/what-is-a-batch-code" },
        { label: t("shelfGuide"), href: "/guides/cosmetics-shelf-life-guide" },
        { label: t("allBrands"), href: "/brands" },
        { label: t("codeFormats"), href: "/decoders" },
        { label: t("allGuides"), href: "/guides" },
      ],
    },
  ];
  const trust = [
    { icon: Sparkles, label: th("trustFree") },
    { icon: ShieldCheck, label: th("trustNoSignup") },
    { icon: Lock, label: th("trustPrivate") },
  ];
  return (
    <footer className="mt-24 border-t border-border bg-bg-subtle/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] md:gap-x-10">
        {/* Brand block — full width on mobile, first column on desktop */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt={site.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border border-border"
            />
            <span className="text-[17px] tracking-tight">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
            {t("tagline")}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {trust.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-fg-muted"
              >
                <Icon className="h-3.5 w-3.5 text-success" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
              {col.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-fg-muted sm:flex-row sm:px-6">
          <p>{t("rights", { year: new Date().getFullYear(), name: site.name })}</p>
          <div className="flex items-center gap-4">
            <span className="font-medium tracking-tight">
              {site.url.replace(/^https?:\/\//, "")}
            </span>
            {/* Theme toggle moved here so it stays reachable on mobile, where
                the header hides it to keep the brand name fully visible. */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
