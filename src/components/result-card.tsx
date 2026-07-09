import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  Leaf,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
  Timer,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { CheckResult, FreshnessStatus } from "@/lib/decoder";
import type { Brand } from "@/lib/brands";
import { cn } from "@/lib/utils";
import { ResultActions } from "@/components/result-actions";

const fmt = (d: Date | null, locale: string) =>
  d
    ? d.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
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
    <div className="relative h-40 w-40 shrink-0">
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
          className="absolute left-1/2 top-[9px] h-3.5 w-3.5 -translate-x-1/2 rounded-full ring-4 ring-card"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-semibold tabular-nums"
          style={{ color }}
        >
          {percent ?? "—"}
          {percent !== null && <span className="text-lg">%</span>}
        </span>
        <span className="text-[11px] text-fg-muted">{lifeLeftLabel}</span>
      </div>
    </div>
  );
}

function DataRow({
  icon: Icon,
  label,
  value,
  color,
  valueClass,
  sub,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  color: string;
  valueClass?: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-4">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: tint(color, 12) }}
      >
        <Icon className="h-[18px] w-[18px]" style={{ color }} strokeWidth={1.9} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-fg-muted">{label}</p>
        <p className={cn("font-semibold leading-tight", valueClass)}>{value}</p>
        {sub && <p className="text-xs" style={{ color }}>{sub}</p>}
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
  const meta = statusMeta[result.freshness];
  const color = meta.color;
  const StatusIcon = meta.icon;
  const statusLabel = t(STATUS_KEY[result.freshness]);
  const months = (n: number) => t("months", { n });

  // Decode failed — almost always a mistyped code. We deliberately do NOT reveal
  // the brand's code format here, only how to re-check the input.
  if (!result.decoded) {
    return (
      <div className="overflow-hidden rounded-2xl border border-warning/40 bg-warning-bg shadow-card">
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center sm:px-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/15 text-warning">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">{t("invalidTitle")}</h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-fg-muted">
              {t("invalidBody", { code: result.code, brand: brand.name })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const percentLeft =
    result.percentRemaining !== null
      ? t("percentLeft", { n: result.percentRemaining })
      : undefined;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {/* Header — warm status-tinted panel with the ring + a soft product tile */}
      <div
        className="flex items-stretch gap-4 p-6 sm:p-8"
        style={{
          background: `linear-gradient(135deg, ${tint(color, 8, "var(--card)")}, var(--card) 70%)`,
        }}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
            {result.code}
          </p>
          <span
            className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
            style={{ backgroundColor: tint(color, 14), color }}
          >
            <StatusIcon className="h-4 w-4" />
            {statusLabel}
          </span>
          <div className="mt-5 flex justify-center sm:justify-start">
            <FreshnessRing
              percent={result.percentRemaining}
              color={color}
              lifeLeftLabel={t("lifeLeft")}
            />
          </div>
        </div>
        {/* Decorative product tile — soft gradient orb, no external asset. */}
        <div
          aria-hidden
          className="relative block w-2/5 shrink-0 overflow-hidden rounded-2xl sm:w-1/3"
          style={{
            background: `radial-gradient(120% 120% at 70% 20%, ${tint(color, 22, "var(--card)")}, ${tint(color, 6, "var(--card)")})`,
          }}
        >
          <Sparkles
            className="absolute right-4 top-4 h-5 w-5"
            style={{ color: tint(color, 55, "var(--fg)") }}
          />
          <div
            className="absolute bottom-[-20%] left-1/2 h-3/4 w-3/4 -translate-x-1/2 rounded-full blur-xl"
            style={{ backgroundColor: tint(color, 30) }}
          />
        </div>
      </div>

      {/* Data — two columns of icon-badge rows */}
      <div className="grid gap-x-8 border-t border-border px-6 py-2 sm:px-8 md:grid-cols-2">
        <div className="divide-y divide-border">
          <DataRow icon={CalendarDays} color={color} label={t("manufactureDate")} value={fmt(result.manufactureDate, locale)} />
          <DataRow icon={Clock} color={color} label={t("age")} value={result.ageLabel ?? "—"} />
          <DataRow icon={Timer} color={color} label={t("shelfLife")} value={months(result.shelfLifeMonths)} />
        </div>
        <div className="divide-y divide-border md:border-t-0 border-t border-border">
          <DataRow icon={CalendarDays} color={color} label={t("expirationDate")} value={fmt(result.expirationDate, locale)} />
          <DataRow
            icon={Leaf}
            color={color}
            label={t("freshness")}
            value={statusLabel}
            valueClass="!font-semibold"
            sub={percentLeft ? `· ${percentLeft}` : undefined}
          />
          <DataRow icon={ShieldCheck} color={color} label={t("confidence")} value={t(CONF_KEY[result.confidence])} />
          <DataRow icon={Info} color={color} label={t("pao")} value={months(brand.paoMonths)} />
        </div>
      </div>

      {/* "What does this mean?" — status-tinted explainer */}
      <div className="px-6 pb-6 pt-2 sm:px-8">
        <div
          className="flex items-start gap-3 rounded-2xl p-4"
          style={{
            backgroundColor: tint(color, 8, "var(--card)"),
            border: `1px solid ${tint(color, 22)}`,
          }}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: tint(color, 14) }}
          >
            <Info className="h-[18px] w-[18px]" style={{ color }} />
          </span>
          <div>
            <p className="text-sm font-semibold">{t("meaningTitle")}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-fg-muted">
              {t(MEANING_KEY[result.freshness])}
            </p>
          </div>
        </div>
      </div>

      <ResultActions
        brandName={brand.name}
        code={result.code}
        manufactureDate={result.manufactureDate}
        expirationDate={result.expirationDate}
        percent={result.percentRemaining}
      />
    </div>
  );
}
