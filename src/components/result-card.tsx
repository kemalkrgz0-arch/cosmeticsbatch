import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  ShieldQuestion,
  Timer,
} from "lucide-react";
import type { CheckResult, FreshnessStatus } from "@/lib/decoder";
import type { Brand } from "@/lib/brands";
import { cn } from "@/lib/utils";

const fmt = (d: Date | null) =>
  d
    ? d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

const statusMeta: Record<
  FreshnessStatus,
  { label: string; tone: string; ring: string; icon: typeof CheckCircle2 }
> = {
  fresh: {
    label: "Fresh",
    tone: "bg-success-bg text-success",
    ring: "var(--success)",
    icon: CheckCircle2,
  },
  good: {
    label: "Still Good",
    tone: "bg-success-bg text-success",
    ring: "var(--success)",
    icon: CheckCircle2,
  },
  "use-soon": {
    label: "Use Soon",
    tone: "bg-warning-bg text-warning",
    ring: "var(--warning)",
    icon: Timer,
  },
  expired: {
    label: "Past Shelf Life",
    tone: "bg-danger-bg text-danger",
    ring: "var(--danger)",
    icon: AlertTriangle,
  },
  unknown: {
    label: "Not Decoded",
    tone: "bg-bg-subtle text-fg-muted",
    ring: "var(--border-strong)",
    icon: ShieldQuestion,
  },
};

function FreshnessRing({
  percent,
  color,
}: {
  percent: number | null;
  color: string;
}) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = percent ?? 0;
  const dash = (pct / 100) * c;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="10"
        />
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
        <span className="text-[11px] text-fg-muted">life left</span>
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

const confidenceLabel: Record<string, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
  none: "Could not decode",
};

export function ResultCard({
  result,
  brand,
}: {
  result: CheckResult;
  brand: Brand;
}) {
  const meta = statusMeta[result.freshness];
  const StatusIcon = meta.icon;

  // Decode failed — almost always a mistyped code. Show a clear, warning-styled
  // "invalid code" state (no freshness ring / pseudo-result). We deliberately do
  // NOT reveal the brand's code format here, only how to re-check the input.
  if (!result.decoded) {
    return (
      <div className="overflow-hidden rounded-2xl border border-warning/40 bg-warning-bg shadow-card">
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center sm:px-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/15 text-warning">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">
              We couldn’t read this code
            </h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-fg-muted">
              <span className="font-mono font-medium text-fg">
                “{result.code}”
              </span>{" "}
              doesn’t match {brand.name}’s batch-code format. Check that you
              typed it exactly as printed on the packaging — letters and numbers
              only, no spaces — and that it’s the batch code, not the barcode or
              a price/marketing reference.
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
            {meta.label}
          </span>
        </div>
        <FreshnessRing percent={result.percentRemaining} color={meta.ring} />
      </div>

      <div className="grid gap-x-8 p-6 sm:p-8 md:grid-cols-2">
        <div className="divide-y divide-border">
          <DataRow
            icon={CalendarDays}
            label="Manufacture date"
            value={fmt(result.manufactureDate)}
          />
          <DataRow icon={Clock} label="Age" value={result.ageLabel ?? "—"} />
          <DataRow
            icon={Timer}
            label="Shelf life"
            value={`${result.shelfLifeMonths} months`}
          />
          <DataRow
            icon={CalendarDays}
            label="Expiration date"
            value={fmt(result.expirationDate)}
          />
        </div>
        <div className="divide-y divide-border">
          <DataRow
            icon={CheckCircle2}
            label="Freshness"
            value={`${meta.label}${
              result.percentRemaining !== null
                ? ` · ${result.percentRemaining}% left`
                : ""
            }`}
          />
          <DataRow
            icon={Info}
            label="Confidence"
            value={confidenceLabel[result.confidence]}
          />
          <DataRow
            icon={Timer}
            label="After opening (PAO)"
            value={`${brand.paoMonths} months`}
          />
        </div>
      </div>
    </div>
  );
}
