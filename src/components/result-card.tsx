import {
  AlertTriangle,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Hourglass,
  Info,
  Leaf,
  PackageOpen,
  ShieldCheck,
  ShieldQuestion,
  Timer,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CheckResult, DatePrecision, FreshnessStatus } from "@/lib/decoder";
import type { Brand } from "@/lib/brands";
import { ResultActions } from "@/components/result-actions";
import { photoSubmissionCopy } from "@/lib/photo-submission-copy";

// Some code families (L'Oréal, Estée Lauder) encode only year+month; the day in
// `manufactureDate` is a mid-month placeholder, so we hide it rather than imply a
// precision the code doesn't carry. "year"-precision codes (e.g. Creed) show only
// the year; "day"/"variable" keep the full date.
const fmt = (
  d: Date | null,
  locale: string,
  precision: DatePrecision = "day",
) =>
  d
    ? d.toLocaleDateString(locale, {
        year: "numeric",
        ...(precision === "year" ? {} : { month: "long" }),
        ...(precision === "month" || precision === "year"
          ? {}
          : { day: "numeric" }),
      })
    : "—";

/** Per-status CSS colour var + the icon shown in the status pill. */
const statusMeta: Record<
  FreshnessStatus,
  { color: string; icon: typeof CheckCircle2 }
> = {
  fresh: { color: "var(--success)", icon: CheckCircle2 },
  good: { color: "var(--success)", icon: CheckCircle2 },
  "use-soon": { color: "var(--warning)", icon: Timer },
  expired: { color: "var(--danger)", icon: AlertTriangle },
  unknown: { color: "var(--border-strong)", icon: ShieldQuestion },
};

const STATUS_KEY: Record<FreshnessStatus, string> = {
  fresh: "statusFresh",
  good: "statusGood",
  "use-soon": "statusUseSoon",
  expired: "statusExpired",
  unknown: "statusUnknown",
};

const MEANING_KEY: Record<FreshnessStatus, string> = {
  fresh: "meaningFresh",
  good: "meaningGood",
  "use-soon": "meaningUseSoon",
  expired: "meaningExpired",
  unknown: "meaningUnknown",
};

const CONF_KEY: Record<string, string> = {
  high: "confHigh",
  medium: "confMedium",
  low: "confLow",
  none: "confNone",
};

/** color-mix helper for status tints. */
const tint = (color: string, pct: number, base = "transparent") =>
  `color-mix(in srgb, ${color} ${pct}%, ${base})`;

function FreshnessRing({
  percent,
  color,
  lifeLeftLabel,
}: {
  percent: number | null;
  color: string;
  lifeLeftLabel: string;
}) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = percent ?? 0;
  const f = pct / 100;
  const dash = f * c;
  return (
    <div className="relative h-44 w-44 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke={tint(color, 18)} strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          className="animate-ring"
          style={
            {
              "--ring-circumference": c,
              "--ring-target": c - dash,
            } as React.CSSProperties
          }
        />
      </svg>
      {/* Dot riding the end of the arc — spun into place in sync with the draw. */}
      <div
        className="animate-ring-dot absolute inset-0"
        style={{ "--dot-turn": `${f * 360}deg` } as React.CSSProperties}
      >
        <span
          className="absolute left-1/2 top-[10px] h-3.5 w-3.5 -translate-x-1/2 rounded-full ring-4 ring-card"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums" style={{ color }}>
          {percent ?? "—"}
          {percent !== null && <span className="text-xl font-semibold">%</span>}
        </span>
        <span className="mt-0.5 text-sm text-fg-muted">{lifeLeftLabel}</span>
      </div>
    </div>
  );
}

function DataCell({
  icon: Icon,
  label,
  value,
  color,
  valueColored,
  sub,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  color: string;
  valueColored?: boolean;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: tint(color, 12) }}
      >
        <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] text-fg-muted">{label}</p>
        <p
          className="font-semibold leading-tight"
          style={valueColored ? { color } : undefined}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs font-medium" style={{ color }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export function ResultCard({
  result,
  brand,
}: {
  result: CheckResult;
  brand: Brand;
}) {
  const t = useTranslations("result");
  const locale = useLocale();
  const photoCopy = photoSubmissionCopy(locale);
  const meta = statusMeta[result.freshness];
  const color = meta.color;
  const StatusIcon = meta.icon;
  const statusLabel = t(STATUS_KEY[result.freshness]);
  const months = (n: number) => t("months", { n });

  // Decode failed — almost always a mistyped code. We deliberately do NOT reveal
  // the brand's code format here, only how to re-check the input.
  if (!result.decoded) {
    const showDetailedHelp = locale.startsWith("en");
    return (
      <div className="overflow-hidden rounded-3xl border border-warning/40 bg-warning-bg shadow-card">
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center sm:px-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/15 text-warning">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">{t("invalidTitle")}</h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-fg-muted">
              {t("invalidBody", { code: result.code, brand: brand.name })}
            </p>
            <div className="mx-auto mt-5 max-w-lg rounded-2xl border border-warning/25 bg-card/70 p-4 text-left">
              {showDetailedHelp && (
                <>
                  {result.notes.length > 0 && (
                    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-fg-muted">
                      {result.notes.map((note, index) => (
                        <li key={`${index}:${note}`}>{note}</li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                    A code can be valid but still use a regional, older, or
                    contract-manufacturer format that this checker does not yet
                    support. This result does not prove that the code or product
                    is invalid.
                  </p>
                </>
              )}
              <div
                className={`flex flex-col gap-2 sm:flex-row ${showDetailedHelp ? "mt-4" : ""}`}
              >
                {showDetailedHelp && (
                  <a
                    href="#batch-checker"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold hover:border-border-strong"
                  >
                    Check the brand and code again
                  </a>
                )}
                <a
                  href="#code-photo-submission"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cta px-4 text-sm font-semibold text-cta-fg"
                >
                  {photoCopy.open}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const percentLeft =
    result.percentRemaining !== null
      ? t("percentLeft", { n: result.percentRemaining })
      : undefined;
  const pairedCells =
    "grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0";

  return (
    <div className="space-y-4">
      {/* Card 1 — status-tinted header with the ring */}
      <div
        className="overflow-hidden rounded-3xl border border-border p-6 shadow-card sm:p-8"
        style={{
          background: `linear-gradient(150deg, ${tint(color, 10, "var(--card)")}, var(--card) 75%)`,
        }}
      >
        <p className="truncate text-3xl font-bold tracking-tight">{result.code}</p>
        <span
          className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
          style={{ backgroundColor: tint(color, 14), color }}
        >
          <StatusIcon className="h-4 w-4" />
          {statusLabel}
        </span>
        <div className="mt-6 flex justify-center sm:justify-start">
          <div className="text-center sm:text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">
              {t("expirationDate")}
            </p>
            <FreshnessRing
              percent={result.percentRemaining}
              color={color}
              lifeLeftLabel={t("lifeLeft")}
            />
          </div>
        </div>
      </div>

      {/* Card 2 — keep decoded facts separate from unopened-life estimates. */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <div className="divide-y divide-border">
          <div className={pairedCells}>
            <DataCell icon={CalendarDays} color={color} label={t("manufactureDate")} value={fmt(result.manufactureDate, locale, result.datePrecision)} />
            <DataCell icon={Clock} color={color} label={t("age")} value={result.ageLabel ?? "—"} />
          </div>
          <section
            aria-label={t("expirationDate")}
            className="bg-bg-subtle/45"
          >
            <div className={pairedCells}>
              <DataCell icon={Hourglass} color={color} label={t("shelfLife")} value={months(result.shelfLifeMonths)} />
              <DataCell icon={CalendarCheck} color={color} label={t("expirationDate")} value={fmt(result.expirationDate, locale, result.datePrecision)} />
            </div>
            <div className="border-t border-border">
              <DataCell
                icon={Leaf}
                color={color}
                label={t("freshness")}
                value={statusLabel}
                valueColored
                sub={percentLeft ? `• ${percentLeft}` : undefined}
              />
            </div>
          </section>
          <section aria-label={t("pao")}>
            <DataCell icon={PackageOpen} color={color} label={t("pao")} value={`${brand.paoMonths}M · ${months(brand.paoMonths)}`} />
          </section>
          <section aria-label={t("confidence")}>
            <DataCell icon={ShieldCheck} color={color} label={t("confidence")} value={t(CONF_KEY[result.confidence])} />
            {locale.startsWith("en") && (result.method || result.notes.length > 0) && (
              <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-fg-muted">
                {result.method && <p>{result.method}</p>}
                {result.notes.length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {result.notes.map((note) => <li key={note}>{note}</li>)}
                  </ul>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Card 3 — "What does this mean?" explainer, links to the brand guide */}
      <Link
        href={`/brands/${brand.slug}`}
        className="flex items-center gap-3 rounded-3xl border p-4 transition-colors"
        style={{
          backgroundColor: tint(color, 8, "var(--card)"),
          borderColor: tint(color, 22),
        }}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: tint(color, 14) }}
        >
          <Info className="h-5 w-5" style={{ color }} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{t("meaningTitle")}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-fg-muted">
            {t(MEANING_KEY[result.freshness])}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-fg-muted" />
      </Link>

      <ResultActions
        brandName={brand.name}
        code={result.code}
        manufactureDate={result.manufactureDate}
        expirationDate={result.expirationDate}
        percent={result.percentRemaining}
        datePrecision={result.datePrecision}
      />
    </div>
  );
}
