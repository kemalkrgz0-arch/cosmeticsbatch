import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BRANDS } from "@/lib/brands";
import { localizedPath, pageMeta } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { brandsDirectoryCopy } from "@/lib/brands-directory-copy";
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
  const copy = brandsDirectoryCopy(locale);
  return pageMeta({
    title: copy.title,
    description: copy.description(BRANDS.length),
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
  const copy = brandsDirectoryCopy(locale);
  const nav = await getTranslations("nav");
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
    name: copy.listName,
    numberOfItems: BRANDS.length,
    itemListElement: BRANDS.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      url: absoluteUrl(localizedPath(locale, `/brands/${b.slug}`)),
    })),
  };

  return (
    <div className="site-frame py-10">
      <JsonLd data={itemList} />
      <Breadcrumbs
        items={[
          { name: nav("home"), path: "/" },
          { name: nav("brands"), path: "/brands" },
        ]}
      />
      <SectionHeading
        as="h1"
        title={copy.title}
        subtitle={copy.subtitle(BRANDS.length)}
        className="!mx-0 text-left sm:!mx-auto sm:text-center"
      />

      <BrandsDirectory groups={sortedGroups} />
    </div>
  );
}
