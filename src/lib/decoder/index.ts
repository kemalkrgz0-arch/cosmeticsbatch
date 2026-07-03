import type { Confidence, ProductCategory } from "./types";
import { FALLBACK_CHAIN, getDecoder } from "./decoders";

export * from "./types";
export { DECODERS, getDecoder } from "./decoders";

export type FreshnessStatus =
  | "fresh"
  | "good"
  | "use-soon"
  | "expired"
  | "unknown";

export interface CheckInput {
  brandName: string;
  code: string;
  /** Dedicated decoder id, if the brand has one. */
  decoderId?: string;
  /** Recommended shelf life from manufacture, in months. */
  shelfLifeMonths: number;
  category: ProductCategory;
  now?: Date;
}

export interface CheckResult {
  brandName: string;
  code: string;
  decoded: boolean;
  manufactureDate: Date | null;
  expirationDate: Date | null;
  ageDays: number | null;
  ageLabel: string | null;
  shelfLifeMonths: number;
  freshness: FreshnessStatus;
  /** 0–100 percent of shelf life remaining. */
  percentRemaining: number | null;
  confidence: Confidence;
  method: string;
  notes: string[];
}

function monthsBetweenAdd(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
}

function humanizeAge(days: number): string {
  if (days < 31) return `${days} day${days === 1 ? "" : "s"}`;
  const months = Math.floor(days / 30.44);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return remMonths
    ? `${years}y ${remMonths}m`
    : `${years} year${years === 1 ? "" : "s"}`;
}

export function checkBatchCode(input: CheckInput): CheckResult {
  const now = input.now ?? new Date();
  const ctx = { now };
  const notes: string[] = [];

  // 1. Try dedicated decoder, then fallback chain.
  const tried = [getDecoder(input.decoderId), ...FALLBACK_CHAIN].filter(
    (d): d is NonNullable<typeof d> => Boolean(d),
  );
  let attempt = null as ReturnType<(typeof tried)[number]["decode"]> | null;
  let method = "No date could be read from this code";
  let confidence: Confidence = "none";

  for (const decoder of tried) {
    const res = decoder.decode(input.code, ctx);
    if (res && res.manufactureDate) {
      attempt = res;
      method = res.method;
      confidence = res.confidence;
      if (res.notes) notes.push(...res.notes);
      break;
    }
  }

  const base: CheckResult = {
    brandName: input.brandName,
    code: input.code.trim(),
    decoded: false,
    manufactureDate: null,
    expirationDate: null,
    ageDays: null,
    ageLabel: null,
    shelfLifeMonths: input.shelfLifeMonths,
    freshness: "unknown",
    percentRemaining: null,
    confidence: "none",
    method,
    notes,
  };

  if (!attempt || !attempt.manufactureDate) {
    base.notes.push(
      "We couldn't automatically decode this code. Double-check it matches the code stamped on the packaging (not the barcode).",
    );
    return base;
  }

  // 2. Compute freshness from manufacture date + shelf life.
  const mfg = attempt.manufactureDate;
  const expiry = monthsBetweenAdd(mfg, input.shelfLifeMonths);
  const ageMs = now.getTime() - mfg.getTime();
  const ageDays = Math.max(0, Math.floor(ageMs / 86_400_000));
  const totalMs = expiry.getTime() - mfg.getTime();
  const remainingMs = expiry.getTime() - now.getTime();
  const percentRemaining = Math.max(
    0,
    Math.min(100, Math.round((remainingMs / totalMs) * 100)),
  );

  let freshness: FreshnessStatus;
  if (remainingMs <= 0) freshness = "expired";
  else if (percentRemaining <= 20) freshness = "use-soon";
  else if (percentRemaining <= 50) freshness = "good";
  else freshness = "fresh";

  return {
    ...base,
    decoded: true,
    manufactureDate: mfg,
    expirationDate: expiry,
    ageDays,
    ageLabel: humanizeAge(ageDays),
    freshness,
    percentRemaining,
    confidence,
    method,
    notes: base.notes,
  };
}
