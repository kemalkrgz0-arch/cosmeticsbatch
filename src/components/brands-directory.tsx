"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/ui/brand-logo";

export interface DirectoryBrand {
  name: string;
  slug: string;
}
export interface DirectoryGroup {
  group: string;
  brands: DirectoryBrand[];
}

/** Fold accents + case so "estee" matches "Estée". */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Client-side filter over the full brand directory. Every brand link is still
 * server-rendered into the initial HTML (so crawlers see the whole list); the
 * query only toggles which tiles are visible. Matches on brand name or its
 * manufacturer group.
 */
export function BrandsDirectory({ groups }: { groups: DirectoryGroup[] }) {
  const t = useTranslations("form");
  const [query, setQuery] = useState("");
  const q = norm(query);

  const filtered = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({
        group: g.group,
        brands: g.brands.filter(
          (b) => norm(b.name).includes(q) || norm(g.group).includes(q),
        ),
      }))
      .filter((g) => g.brands.length > 0);
  }, [groups, q]);

  const empty = filtered.length === 0;

  return (
    <div className="mt-8">
      <div className="relative mx-auto max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchBrands")}
          aria-label={t("searchBrands")}
          className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-border-strong"
        />
      </div>

      {empty ? (
        <p className="mt-10 text-center text-sm text-fg-muted">
          {t("noMatch", { query })}
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {filtered.map((g) => (
            <section key={g.group}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-fg-muted">
                {g.group}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {g.brands.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/brands/${b.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong"
                  >
                    <BrandLogo
                      name={b.name}
                      slug={b.slug}
                      className="h-9 w-9 text-xs"
                    />
                    <span className="truncate text-sm font-medium">
                      {b.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
