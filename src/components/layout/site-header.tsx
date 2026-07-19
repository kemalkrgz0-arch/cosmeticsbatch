import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { MobileHeaderMenu } from "@/components/layout/mobile-header-menu";

export function SiteHeader({ accessibility }: { accessibility: { primaryNavigation: string; openMenu: string; closeMenu: string } }) {
  const t = useTranslations("nav");
  const nav = [
    { href: "/", label: t("home") },
    { href: "/brands", label: t("brands") },
    { href: "/decoders", label: t("codeFormats") },
    { href: "/guides", label: t("guides") },
    { href: "/#how-it-works", label: t("howItWorks") },
    { href: "/about", label: t("about") },
  ];
  return (
    <header className="sticky top-0 z-40 bg-transparent px-2 pt-2 sm:px-4 sm:pt-3">
      <div className="site-frame flex h-[4.5rem] items-center gap-3 rounded-[1.35rem] border border-border/80 bg-bg/88 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:gap-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold">
          <Image
            src="/logo.png"
            alt={site.name}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full border border-border"
          />
          {/* Truncates rather than overflowing: with `whitespace-nowrap` alone
              the wordmark spilled out of its box and rendered over the nav. */}
          <span className="truncate text-[16px] tracking-[.01em] sm:text-[17px]">{site.name}</span>
        </Link>

        {/* Desktop nav starts at `lg`, not `md`. Between 768px and 1024px the
            row cannot hold the wordmark, six links and the actions at once —
            the links wrapped to three lines and the wordmark overlapped them.
            The hamburger covers that band instead, where there is room. */}
        <nav aria-label={accessibility.primaryNavigation} className="ms-4 hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1.5">
          <LanguageSwitcher />
          {/* Theme toggle lives in the footer on mobile so the brand name
              always fits in the header; keep it here on larger screens. */}
          <span className="hidden sm:inline-flex">
            <ThemeToggle />
          </span>
          <Link
            href="/#check"
            className="hidden h-10 shrink-0 items-center whitespace-nowrap rounded-full bg-cta px-5 text-sm font-semibold text-cta-fg transition-colors duration-200 hover:bg-cta-hover sm:inline-flex"
          >
            {t("checkNow")}
          </Link>
          <MobileHeaderMenu items={nav} label={accessibility.primaryNavigation} openLabel={accessibility.openMenu} closeLabel={accessibility.closeMenu} />
        </div>
      </div>
    </header>
  );
}
