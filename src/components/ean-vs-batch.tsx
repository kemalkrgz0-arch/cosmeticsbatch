import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * Explains the single most common user mistake: typing the product barcode
 * (EAN) instead of the batch code. Pairs a plain-language paragraph with a
 * side-by-side visual — a barcode marked "not this" vs a short date stamp
 * marked "this one" — so it lands whether the user reads or just scans.
 *
 * Pure/presentational: safe in both Server Components and the client form.
 */
export function EanVsBatch({ className }: { className?: string }) {
  const t = useTranslations("form");

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-4 sm:p-5",
        className,
      )}
    >
      <h3 className="text-sm font-semibold">{t("eanTitle")}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
        {t("eanBody")}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Wrong: the barcode / EAN */}
        <figure className="relative rounded-xl border border-danger/40 bg-bg p-4">
          <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white">
            <X className="h-4 w-4" strokeWidth={3} />
          </span>
          <BarcodeGlyph />
          <figcaption className="mt-3">
            <span className="block text-sm font-medium">
              {t("eanWrongLabel")}
            </span>
            <span className="block text-xs text-fg-muted">
              {t("eanWrongSub")}
            </span>
          </figcaption>
        </figure>

        {/* Right: the batch code stamp */}
        <figure className="relative rounded-xl border border-success/40 bg-bg p-4">
          <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <BatchStampGlyph />
          <figcaption className="mt-3">
            <span className="block text-sm font-medium">
              {t("eanRightLabel")}
            </span>
            <span className="block text-xs text-fg-muted">
              {t("eanRightSub")}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/** A stylised EAN-13 barcode: uneven bars over a 13-digit number. */
function BarcodeGlyph() {
  // Deterministic bar widths so it reads as a real barcode without randomness.
  const bars = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 1, 1, 3, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 3, 1, 2, 1];
  let x = 4;
  return (
    <div aria-hidden className="text-fg">
      <svg
        viewBox="0 0 160 56"
        className="h-14 w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {bars.map((w, i) => {
          const rect =
            i % 2 === 0 ? (
              <rect key={i} x={x} y={4} width={w} height={36} fill="currentColor" />
            ) : null;
          x += w + 1;
          return rect;
        })}
        <text
          x={80}
          y={52}
          textAnchor="middle"
          fontSize={11}
          letterSpacing={1.5}
          fill="currentColor"
          fontFamily="ui-monospace, monospace"
        >
          8 691234 567890
        </text>
      </svg>
    </div>
  );
}

/** A stylised ink-jet batch stamp on a bottle base. */
function BatchStampGlyph() {
  return (
    <div aria-hidden className="text-fg">
      <svg
        viewBox="0 0 160 56"
        className="h-14 w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* faint pack-base outline */}
        <rect
          x={16}
          y={6}
          width={128}
          height={44}
          rx={8}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeDasharray="4 3"
        />
        {/* dot-matrix ink-jet code */}
        <text
          x={80}
          y={36}
          textAnchor="middle"
          fontSize={20}
          letterSpacing={2}
          fill="currentColor"
          fontFamily="ui-monospace, monospace"
          fontWeight={700}
        >
          L3 2140
        </text>
      </svg>
    </div>
  );
}
