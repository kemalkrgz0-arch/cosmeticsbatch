import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  ShieldQuestion,
  Timer,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { CheckResult, FreshnessStatus } from "@/lib/decoder";
import type { Brand } from "@/lib/brands";
import { cn } from "@/lib/utils";

const fmt = (d: Date | null, locale: string) =>
  d
    ? d.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

const statusMeta: Record<
  FreshnessStatus,
  { tone: string; ring: string; icon: typeof CheckCircle2 }
> = {
  fresh: { tone: "bg-success-bg text-success", ring: "var(--success)", icon: CheckCircle2 },
  good: { tone: "bg-success-bg text-success", ring: "var(--success)", icon: CheckCircle2 },
  "use-soon": { tone: "bg-warning-bg text-warning", ring: "var(--warning)", icon: Timer },
  expired: { tone: "bg-danger-bg text-danger", ring: "var(--danger)", icon: AlertTriangle },
  unknown: { tone: "bg-bg-subtle text-fg-muted", ring: "var(--border-strong)", icon: ShieldQuestion },
};

const STATUS_KEY: Record<FreshnessStatus, string> = {
  fresh: "statusFresh",
  good: "statusGood",
  "use-soon": "statusUseSoon",
  expired: "statusExpired",
  unknown: "statusUnknown",
};

const CONF_KEY: Record<string, string> = {
  high: "confHigh",
  medium: "confMedium",
  low: "confLow",
  none: "confNone",
};

function FreshnessRing({
  percent,
  color,
  lifeLeftLabel,
}: {
  percent: number | null;
  color: string;
  lifeLeftLabel: string;
}) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = percent ?? 0;
  const dash = (pct / 100) * c;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums">
          {percent ?? "—"}
          {percent !== null && <span className="text-base">%</span>}
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
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Icon className="h-4 w-4 shrink-0 text-fg-muted" />
      <span className="text-sm text-fg-muted">{label}</span>
      <span className="ml-auto text-right text-sm font-medium">{value}</span>
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

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-sm text-fg-muted">{brand.name}</p>
          <p className="mt-1 font-mono text-2xl font-semibold tracking-wide">
            {result.code}
          </p>
          <span
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
              meta.tone,
            )}
          >
            <StatusIcon className="h-4 w-4" />
            {statusLabel}
          </span>
        </div>
        <FreshnessRing
          percent={result.percentRemaining}
          color={meta.ring}
          lifeLeftLabel={t("lifeLeft")}
        />
      </div>

      <div className="grid gap-x-8 p-6 sm:p-8 md:grid-cols-2">
        <div className="divide-y divide-border">
          <DataRow
            icon={CalendarDays}
            label={t("manufactureDate")}
            value={fmt(result.manufactureDate, locale)}
          />
          <DataRow icon={Clock} label={t("age")} value={result.ageLabel ?? "—"} />
          <DataRow
            icon={Timer}
            label={t("shelfLife")}
            value={months(result.shelfLifeMonths)}
          />
          <DataRow
            icon={CalendarDays}
            label={t("expirationDate")}
            value={fmt(result.expirationDate, locale)}
          />
        </div>
        <div className="divide-y divide-border">
          <DataRow
            icon={CheckCircle2}
            label={t("freshness")}
            value={`${statusLabel}${
              result.percentRemaining !== null
                ? ` · ${t("percentLeft", { n: result.percentRemaining })}`
                : ""
            }`}
          />
          <DataRow
            icon={Info}
            label={t("confidence")}
            value={t(CONF_KEY[result.confidence])}
          />
          <DataRow icon={Timer} label={t("pao")} value={months(brand.paoMonths)} />
        </div>
      </div>
    </div>
  );
}
