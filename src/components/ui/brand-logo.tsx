"use client";

import { useState } from "react";
import { getBrandDomain, getBrandTile, logoSources } from "@/lib/brand-logos";
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
 * Brand logo tile. Loads the real favicon from the mapped official domain,
 * stepping through fallback sources, and finally shows a monogram if none load.
 * A fixed-size tile means no layout shift regardless of which source wins.
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
  const domain = getBrandDomain(slug);
  const sources = domain ? logoSources(domain) : [];
  const [idx, setIdx] = useState(0);
  const failed = idx >= sources.length;

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white",
        className,
      )}
    >
      {failed && tile ? (
        <span className="h-full w-full" style={{ backgroundColor: tile.bg }}>
          <WordmarkSvg label={tile.label} fg={tile.fg ?? "#ffffff"} />
        </span>
      ) : failed ? (
        <span className="font-semibold tracking-tight text-[#0a0a0a]">
          {monogram(name)}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sources[idx]}
          alt={`${name} logo`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setIdx((i) => i + 1)}
          className="h-full w-full object-contain p-[15%]"
        />
      )}
    </span>
  );
}
