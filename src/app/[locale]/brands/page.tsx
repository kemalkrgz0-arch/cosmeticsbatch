import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BRANDS } from "@/lib/brands";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { BrandsDirectory } from "@/components/brands-directory";
import { JsonLd } from "@/components/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta({
    title: "All Supported Brands",
    description: `Browse every cosmetic and perfume brand supported by Cosmetics Batch. Decode batch codes for Chanel, Dior, Estée Lauder, L'Oréal, MAC and ${BRANDS.length}+ more.`,
    path: "/brands",
    locale,
  });
}

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const groups = new Map<string, typeof BRANDS>();
  for (const b of [...BRANDS].sort((a, z) => a.name.localeCompare(z.name))) {
    const list = groups.get(b.group) ?? [];
    list.push(b);
    groups.set(b.group, list);
  }
  const sortedGroups = [...groups.entries()]
    .sort((a, z) => a[0].localeCompare(z[0]))
    .map(([group, list]) => ({
      group,
      brands: list.map((b) => ({ name: b.name, slug: b.slug })),
    }));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Supported cosmetic & perfume brands",
    numberOfItems: BRANDS.length,
    itemListElement: BRANDS.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${b.name} Batch Code Checker`,
      url: absoluteUrl(`/brands/${b.slug}`),
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd data={itemList} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Brands", path: "/brands" },
        ]}
      />
      <SectionHeading
        as="h1"
        title="All Supported Brands"
        subtitle={`Decode batch codes for ${BRANDS.length}+ cosmetic and perfume brands. Pick a brand to see how its codes work.`}
        className="!mx-0 text-left sm:!mx-auto sm:text-center"
      />

      <BrandsDirectory groups={sortedGroups} />
    </div>
  );
}
