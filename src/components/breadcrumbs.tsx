import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { getLocale } from "next-intl/server";

export async function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const locale = await getLocale();
  return (
    <>
      <JsonLd data={breadcrumbSchema(items, locale)} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-fg-muted">
          {items.map((it, i) => {
            const last = i === items.length - 1;
            return (
              <li key={it.path} className="flex items-center gap-1">
                {last ? (
                  <span className="text-fg">{it.name}</span>
                ) : (
                  <Link
                    href={it.path}
                    className="transition-colors hover:text-fg"
                  >
                    {it.name}
                  </Link>
                )}
                {!last && <ChevronRight className="h-3.5 w-3.5" />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
