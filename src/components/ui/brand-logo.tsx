import { brandTile, getBrandLogo } from "@/lib/brand-logos";
import { cn } from "@/lib/utils";

/** Auto-scaling wordmark: SVG text that fits any tile size crisply. */
function WordmarkSvg({ label, fg }: { label: string; fg: string }) {
  const len = label.length;
  const fontSize = len <= 2 ? 48 : len === 3 ? 40 : 30;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="presentation">
      <text
        x="50"
        y="53"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        fontWeight={700}
        fontSize={fontSize}
        fill={fg}
        textLength={len >= 5 ? 84 : undefined}
        lengthAdjust="spacingAndGlyphs"
      >
        {label}
      </text>
    </svg>
  );
}

/**
 * Uses a local Wikidata P154 logo only when the entity's P856 official website
 * matched our domain registry, and only for files we can show are public
 * domain — see finding 20. Everything else gets a typographic tile of our own,
 * which is a deliberate choice rather than a fallback: a brand's logo is a
 * trademark, and the freely-licensed copies circulating on Commons are largely
 * mislabelled uploads of the brand's own artwork.
 */
export function BrandLogo({
  name,
  slug,
  className,
}: {
  name: string;
  slug: string;
  className?: string;
}) {
  const logo = getBrandLogo(slug);
  const tile = brandTile(slug, name);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white",
        className,
      )}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo.src}
          alt={`${name} logo`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-[10%]"
        />
      ) : (
        <span className="h-full w-full" style={{ backgroundColor: tile.bg }}>
          <WordmarkSvg label={tile.label} fg={tile.fg ?? "#ffffff"} />
        </span>
      )}
    </span>
  );
}
