import { Flower2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

export function SiteFooter() {
  const t = useTranslations("footer");
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
        { label: t("allGuides"), href: "/guides" },
      ],
    },
  ];
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cta text-cta-fg">
              <Flower2 className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[17px] tracking-tight">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
            {t("tagline")}
          </p>
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
        <p className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-fg-muted sm:px-6">
          {t("rights", { year: new Date().getFullYear(), name: site.name })}
        </p>
      </div>
    </footer>
  );
}
