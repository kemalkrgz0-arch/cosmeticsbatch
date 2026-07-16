"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
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
  const t = useTranslations();
  const [brand, setBrand] = useState<Brand | undefined>(initialBrand);
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<Brand[]>([]);
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  const brandLabelId = `${id}-brand-label`;
  const brandValueId = `${id}-brand-value`;
  const brandListId = `${id}-brand-list`;
  const codeInputId = `${id}-batch-code`;
  const codeHintId = `${id}-batch-code-hint`;
  const errorId = `${id}-error`;

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate client-only persisted/URL state on mount
    setRecent(loadRecent());
    setCode(new URLSearchParams(window.location.search).get("code") ?? "");
  }, []);

  // Tell the mobile bottom nav to slide away while the dropdown is open, so it
  // doesn't cover the lower brand results.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("combobox-open", { detail: open }));
    return () => {
      if (open) {
        window.dispatchEvent(new CustomEvent("combobox-open", { detail: false }));
      }
    };
  }, [open]);

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
      const recentSlugs = new Set(recent.map((brand) => brand.slug));
      raw.push({
        label: "",
        brands: allSorted.filter((brand) => !recentSlugs.has(brand.slug)),
      });
    }
    let start = 0;
    const secs = raw.map((s) => {
      const withStart = { ...s, start };
      start += s.brands.length;
      return withStart;
    });
    return { sections: secs, flat: raw.flatMap((s) => s.brands) };
  }, [query, recent, allSorted]);

  // Keep the keyboard-highlighted option visible in long lists.
  useEffect(() => {
    if (!open || !flat[active]) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[id="${CSS.escape(`${id}-brand-${active}`)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, flat, id, open]);

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
      if (!flat.length) return;
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!flat.length) return;
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[active]) selectBrand(flat[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    }
  }

  function openPicker() {
    setActive(Math.max(0, brand ? flat.findIndex((b) => b.slug === brand.slug) : 0));
    setOpen(true);
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
    // Keep result navigation inside the app. A full document reload made the
    // result flow unnecessarily vulnerable to transient mobile-network errors:
    // if that navigation failed, the browser replaced the whole app with its
    // own "page couldn't load" screen and the inline retry UI never rendered.
    router.push(
      `/brands/${brand.slug}?code=${encodeURIComponent(code.trim())}#result`,
    );
  }

  return (
    <form
      id="batch-checker"
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
          <span
            id={brandLabelId}
            className="mb-1.5 block px-1 text-xs font-medium text-fg-muted"
          >
            {t("form.selectBrand")}
          </span>
          <button
            type="button"
            onClick={() => (open ? setOpen(false) : openPicker())}
            onKeyDown={(e) => {
              if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
                e.preventDefault();
                openPicker();
              }
            }}
            aria-labelledby={`${brandLabelId} ${brandValueId}`}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={brandListId}
            aria-describedby={error ? errorId : undefined}
            className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-border bg-bg px-3 text-left transition-colors duration-200 hover:border-border-strong focus-visible:border-accent"
          >
            {brand ? (
              <>
                <BrandLogo
                  name={brand.name}
                  slug={brand.slug}
                  className="h-7 w-7 text-[11px]"
                />
                <span id={brandValueId} className="truncate font-medium">{brand.name}</span>
              </>
            ) : (
              <span id={brandValueId} className="text-fg-muted">
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
                  role="combobox"
                  aria-label={t("form.searchBrands")}
                  aria-autocomplete="list"
                  aria-controls={brandListId}
                  aria-expanded="true"
                  aria-activedescendant={flat[active] ? `${id}-brand-${active}` : undefined}
                  placeholder={t("form.searchBrands")}
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-fg-muted"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActive(0);
                    }}
                    aria-label={t("form.searchBrands")}
                    className="inline-flex h-11 w-11 items-center justify-center text-fg-muted hover:text-fg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <ul
                id={brandListId}
                ref={listRef}
                role="listbox"
                aria-labelledby={brandLabelId}
                className="max-h-[min(20rem,50dvh)] overflow-y-auto overscroll-contain p-1.5"
              >
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
                            role="presentation"
                          >
                            <button
                              id={`${id}-brand-${i}`}
                              type="button"
                              role="option"
                              aria-selected={brand?.slug === b.slug}
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
                {flat.length === 0 && (
                  <li
                    role="presentation"
                    className="px-3 py-6 text-center text-sm text-fg-muted"
                  >
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
            htmlFor={codeInputId}
            className="mb-1.5 block px-1 text-xs font-medium text-fg-muted"
          >
            {t("form.batchCode")}
          </label>
          <div className="relative">
            <input
              id={codeInputId}
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
              aria-describedby={`${codeHintId}${error ? ` ${errorId}` : ""}`}
              aria-invalid={Boolean(error && brand)}
              placeholder={t("form.batchCodePlaceholder")}
              className="h-12 w-full rounded-xl border border-border bg-bg px-3 pr-10 font-medium tracking-wide outline-none transition-colors duration-200 hover:border-border-strong focus-visible:border-accent placeholder:font-normal placeholder:text-fg-muted"
            />
            <ScanLine className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-muted" />
          </div>
          {/* Steer users away from typing the product barcode (EAN). */}
          <p id={codeHintId} className="mt-1.5 px-1 text-xs leading-relaxed text-fg-muted">
            {t("form.batchCodeHint")}
          </p>
        </div>
        )}

        {/* CTA */}
        <button
          type={navigateOnSelect ? "button" : "submit"}
          onClick={navigateOnSelect ? openPicker : undefined}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cta px-6 font-semibold text-cta-fg transition-[background-color,transform] duration-200 hover:bg-cta-hover active:scale-[0.98] sm:px-7"
        >
          {navigateOnSelect ? t("form.chooseBrand") : t("nav.checkNow")}
        </button>
      </div>

      {error && (
        <p id={errorId} className="px-1 pt-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
