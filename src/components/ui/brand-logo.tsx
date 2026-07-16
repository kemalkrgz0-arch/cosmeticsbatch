import { getBrandLogo, getBrandTile } from "@/lib/brand-logos";
import { cn } from "@/lib/utils";

function monogram(name: string) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

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
 * matched our domain registry. Missing records retain an honest wordmark.
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
  const tile = getBrandTile(slug);
  const logo = getBrandLogo(slug);

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
      ) : tile ? (
        <span className="h-full w-full" style={{ backgroundColor: tile.bg }}>
          <WordmarkSvg label={tile.label} fg={tile.fg ?? "#ffffff"} />
        </span>
      ) : (
        <span className="font-semibold tracking-tight text-[#0a0a0a]">
          {monogram(name)}
        </span>
      )}
    </span>
  );
}
