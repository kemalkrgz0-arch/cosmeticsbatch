"use client";

import { useTranslations } from "next-intl";
import { BookOpen, Home, Info, Search, Sparkles } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const t = useTranslations("nav");
  const items = [
    { label: t("home"), href: "/", icon: Home },
    { label: t("search"), href: "/#check", icon: Search },
    { label: t("brands"), href: "/brands", icon: Sparkles },
    { label: t("guides"), href: "/guides", icon: BookOpen },
    { label: t("about"), href: "/about", icon: Info },
  ];
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);
          return (
            <li key={label} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors duration-200",
                  active ? "text-fg" : "text-fg-muted",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.9} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
