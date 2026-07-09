import { Flower2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const nav = [
    { href: "/", label: t("home") },
    { href: "/brands", label: t("brands") },
    { href: "/guides", label: t("guides") },
    { href: "/#how-it-works", label: t("howItWorks") },
    { href: "/about", label: t("about") },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cta text-cta-fg">
            <Flower2 className="h-[18px] w-[18px]" />
          </span>
          <span className="whitespace-nowrap text-[17px] tracking-tight">{site.name}</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <LanguageSwitcher />
          {/* Theme toggle lives in the footer on mobile so the brand name
              always fits in the header; keep it here on larger screens. */}
          <span className="hidden sm:inline-flex">
            <ThemeToggle />
          </span>
          <Link
            href="/#check"
            className="inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-full bg-cta px-4 text-sm font-semibold text-cta-fg transition-colors duration-200 hover:bg-cta-hover"
          >
            {t("checkNow")}
          </Link>
        </div>
      </div>
    </header>
  );
}
