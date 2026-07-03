"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES } from "@/i18n/locales";
import { cn } from "@/lib/utils";

/** Dropdown to switch the active language while staying on the same page. */
export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function pick(code: string) {
    setOpen(false);
    // Keep the current path, swap the locale prefix.
    router.replace(pathname, { locale: code });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-fg-muted transition-colors hover:text-fg"
      >
        <Globe className="h-[18px] w-[18px]" />
        <span className="hidden sm:inline uppercase">{locale}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-80 w-48 overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-card">
          <ul role="listbox">
            {LOCALES.map((l) => (
              <li key={l.code} role="option" aria-selected={l.code === locale}>
                <button
                  type="button"
                  onClick={() => pick(l.code)}
                  dir={l.dir === "rtl" ? "rtl" : "ltr"}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-bg-subtle",
                    l.code === locale && "font-medium",
                  )}
                >
                  <span className="flex-1 truncate">{l.native}</span>
                  {l.code === locale && <Check className="h-4 w-4 text-accent" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
