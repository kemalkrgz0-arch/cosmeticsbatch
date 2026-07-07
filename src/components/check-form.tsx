"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { Check, ChevronDown, ScanLine, Search, X } from "lucide-react";
import { BRANDS, searchBrands, type Brand } from "@/lib/brands";
import { BrandLogo } from "@/components/ui/brand-logo";
import { cn } from "@/lib/utils";

const RECENT_KEY = "cb:recent-brands";

function loadRecent(): Brand[] {
  if (typeof window === "undefined") return [];
  try {
    const slugs = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
    return slugs
      .map((s) => BRANDS.find((b) => b.slug === s))
      .filter((b): b is Brand => Boolean(b))
      .slice(0, 4);
  } catch {
    return [];
  }
}

function pushRecent(slug: string) {
  try {
    const prev = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
    const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function CheckForm({
  initialBrand,
  autoFocusCode = false,
  navigateOnSelect = false,
  className,
}: {
  initialBrand?: Brand;
  autoFocusCode?: boolean;
  /** Homepage mode: picking a brand routes to its page instead of decoding here. */
  navigateOnSelect?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [brand, setBrand] = useState<Brand | undefined>(initialBrand);
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<Brand[]>([]);
  const [error, setError] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate recents on mount
  useEffect(() => setRecent(loadRecent()), []);

  // Sections rendered in the dropdown: an optional "Recent" section, then a
  // single flat, alphabetically-sorted list of every brand (no parent-company
  // grouping). While searching, results are shown flat with no header.
  // `flat` is the keyboard-navigation order across all sections.
  const allSorted = useMemo(
    () => [...BRANDS].sort((a, z) => a.name.localeCompare(z.name)),
    [],
  );
  const { sections, flat } = useMemo(() => {
    const raw: { label: string; brands: Brand[] }[] = [];
    if (query.trim()) {
      raw.push({ label: "", brands: searchBrands(query, 80) });
    } else {
      if (recent.length) raw.push({ label: "Recent", brands: recent });
      raw.push({ label: "", brands: allSorted });
    }
    let start = 0;
    const secs = raw.map((s) => {
      const withStart = { ...s, start };
      start += s.brands.length;
      return withStart;
    });
    return { sections: secs, flat: raw.flatMap((s) => s.brands) };
  }, [query, recent, allSorted]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function selectBrand(b: Brand) {
    pushRecent(b.slug);
    setOpen(false);
    setQuery("");
    setError(null);
    // Homepage: don't decode here — send the user to the brand's own page
    // (indexable + ad-supported) where the decode happens.
    if (navigateOnSelect) {
      router.push(`/brands/${b.slug}`);
      return;
    }
    setBrand(b);
    setRecent(loadRecent());
    requestAnimationFrame(() => codeRef.current?.focus());
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[active]) selectBrand(flat[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!brand) {
      setError(t("form.errorNoBrand"));
      setOpen(true);
      return;
    }
    if (!code.trim()) {
      setError(t("form.errorNoCode"));
      codeRef.current?.focus();
      return;
    }
    // Decode on the brand's own page: SEO-friendly path + ad slots present.
    // Hard navigation (full page load) so a genuine new search reloads the ads.
    // No forced reload for an identical code — that would inflate impressions
    // without user value and risks AdSense invalid-traffic flags.
    const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
    window.location.assign(
      `${prefix}/brands/${brand.slug}?code=${encodeURIComponent(
        code.trim(),
      )}#result`,
    );
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "rounded-2xl border border-border bg-card p-3 shadow-card sm:p-4",
        className,
      )}
    >
      <div
        className={cn(
          "grid gap-3 sm:items-end sm:gap-3",
          !navigateOnSelect && "sm:grid-cols-[1fr_1fr_auto]",
        )}
      >
        {/* Brand picker */}
        <div ref={rootRef} className="relative">
          <label className="mb-1.5 block px-1 text-xs font-medium text-fg-muted">
            {t("form.selectBrand")}
          </label>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-border bg-bg px-3 text-left transition-colors duration-200 hover:border-border-strong focus-visible:border-accent"
          >
            {brand ? (
              <>
                <BrandLogo
                  name={brand.name}
                  slug={brand.slug}
                  className="h-7 w-7 text-[11px]"
                />
                <span className="truncate font-medium">{brand.name}</span>
              </>
            ) : (
              <span className="text-fg-muted">
                {t("form.selectBrandPlaceholder")}
              </span>
            )}
            <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-fg-muted" />
          </button>

          {open && (
            <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="flex items-center gap-2 border-b border-border px-3">
                <Search className="h-4 w-4 shrink-0 text-fg-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder={t("form.searchBrands")}
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-fg-muted"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-fg-muted hover:text-fg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <ul role="listbox" className="max-h-80 overflow-y-auto p-1.5">
                {sections.map((section) => (
                  <li key={section.label || "all"} role="presentation">
                    {section.label && (
                      <div className="sticky top-0 z-10 bg-card/95 px-2.5 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-fg-muted/70 backdrop-blur-sm">
                        {section.label === "Recent"
                          ? t("form.recent")
                          : section.label}
                        {section.label === "Recent" && (
                          <span className="ml-1.5 lowercase tracking-normal text-fg-muted/50">
                            · {t("form.lastUsed")}
                          </span>
                        )}
                      </div>
                    )}
                    <ul role="group">
                      {section.brands.map((b, bi) => {
                        const i = section.start + bi;
                        return (
                          <li
                            key={`${section.label}-${b.slug}`}
                            role="option"
                            aria-selected={i === active}
                          >
                            <button
                              type="button"
                              onMouseEnter={() => setActive(i)}
                              onClick={() => selectBrand(b)}
                              className={cn(
                                "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
                                i === active
                                  ? "bg-bg-subtle"
                                  : "hover:bg-bg-subtle",
                              )}
                            >
                              <BrandLogo
                                name={b.name}
                                slug={b.slug}
                                className="h-7 w-7 text-[11px]"
                              />
                              <span className="flex-1 truncate font-medium">
                                {b.name}
                              </span>
                              {brand?.slug === b.slug && (
                                <Check className="h-4 w-4 text-accent" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
                {sections.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-fg-muted">
                    {t("form.noMatch", { query })}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Batch code input */}
        {!navigateOnSelect && (
        <div>
          <label
            htmlFor="batch-code"
            className="mb-1.5 block px-1 text-xs font-medium text-fg-muted"
          >
            {t("form.batchCode")}
          </label>
          <div className="relative">
            <input
              id="batch-code"
              ref={codeRef}
              autoFocus={autoFocusCode}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              inputMode="text"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              placeholder={t("form.batchCodePlaceholder")}
              className="h-12 w-full rounded-xl border border-border bg-bg px-3 pr-10 font-medium tracking-wide outline-none transition-colors duration-200 hover:border-border-strong focus-visible:border-accent placeholder:font-normal placeholder:text-fg-muted"
            />
            <ScanLine className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-muted" />
          </div>
        </div>
        )}

        {/* CTA */}
        <button
          type={navigateOnSelect ? "button" : "submit"}
          onClick={navigateOnSelect ? () => setOpen(true) : undefined}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cta px-6 font-semibold text-cta-fg transition-[background-color,transform] duration-200 hover:bg-cta-hover active:scale-[0.98] sm:px-7"
        >
          {navigateOnSelect ? t("form.chooseBrand") : t("nav.checkNow")}
        </button>
      </div>

      {error && (
        <p className="px-1 pt-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
