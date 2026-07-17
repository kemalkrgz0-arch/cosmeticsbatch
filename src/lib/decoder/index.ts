import type { Confidence, DatePrecision, ProductCategory } from "./types";
import { FALLBACK_CHAIN, getDecoder } from "./decoders";
import { getDecoderProfile } from "./profiles";

export * from "./types";
export { DECODERS, getDecoder } from "./decoders";
export { DECODER_PROFILES, getDecoderProfile } from "./profiles";

export type FreshnessStatus =
  | "fresh"
  | "good"
  | "use-soon"
  | "expired"
  | "unknown";

export type DecodeFailureReason = "barcode" | "invalid-format" | "unresolved";

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
  /** Safe public reason for an unsuccessful read; null after a successful decode. */
  failureReason: DecodeFailureReason | null;
  manufactureDate: Date | null;
  expirationDate: Date | null;
  ageDays: number | null;
  ageLabel: string | null;
  shelfLifeMonths: number;
  freshness: FreshnessStatus;
  /** 0–100 percent of shelf life remaining. */
  percentRemaining: number | null;
  confidence: Confidence;
  /**
   * Precision of the decoded date, from the winning decoder's profile. Codes
   * like L'Oréal's encode only year+month — the day component of
   * `manufactureDate` is a mid-month placeholder and must not be shown.
   */
  datePrecision: DatePrecision;
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

/** UPC-A / EAN-13 / GTIN-14 checksum, used only to reject obvious barcodes. */
function hasRetailBarcodeChecksum(value: string): boolean {
  if (!/^\d{12,14}$/.test(value)) return false;
  const digits = [...value].map(Number);
  const check = digits.pop()!;
  let sum = 0;
  for (let i = digits.length - 1, position = 1; i >= 0; i--, position++) {
    sum += digits[i] * (position % 2 === 1 ? 3 : 1);
  }
  return (10 - (sum % 10)) % 10 === check;
}

export function checkBatchCode(input: CheckInput): CheckResult {
  const now = input.now ?? new Date();
  const ctx = { now };
  const notes: string[] = [];
  const trimmedCode = input.code.trim();

  // Long retail identifiers can contain a 4–6 digit substring that resembles
  // a Julian date. A checksum-valid UPC/EAN/GTIN is not a batch code.
  const compactCode = trimmedCode.replace(/[\s-]+/g, "");
  const barcodeShape = /^\d{12,14}$/.test(compactCode);
  const barcode = barcodeShape || hasRetailBarcodeChecksum(compactCode);
  const normalizedBatch = trimmedCode
    .normalize("NFKC")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  const invalidFormat = normalizedBatch.length < 2 || normalizedBatch.length > 32;

  // 1. Try dedicated decoder, then fallback chain.
  const tried = [getDecoder(input.decoderId), ...FALLBACK_CHAIN].filter(
    (d): d is NonNullable<typeof d> => Boolean(d),
  );
  let attempt = null as ReturnType<(typeof tried)[number]["decode"]> | null;
  let method = "No date could be read from this code";
  let confidence: Confidence = "none";
  let datePrecision: DatePrecision = "day";

  for (const decoder of barcode ? [] : tried) {
    const res = decoder.decode(input.code, ctx);
    if (res && res.manufactureDate) {
      attempt = res;
      method = res.method;
      confidence = res.confidence;
      datePrecision =
        res.datePrecision ??
        getDecoderProfile(decoder.id)?.datePrecision ??
        "day";
      if (res.notes) notes.push(...res.notes);
      break;
    }
  }

  const base: CheckResult = {
    brandName: input.brandName,
    code: trimmedCode,
    decoded: false,
    failureReason: null,
    manufactureDate: null,
    expirationDate: null,
    ageDays: null,
    ageLabel: null,
    shelfLifeMonths: input.shelfLifeMonths,
    freshness: "unknown",
    percentRemaining: null,
    confidence: "none",
    datePrecision: "day",
    method,
    notes,
  };

  if (!attempt || !attempt.manufactureDate) {
    base.failureReason = barcode
      ? "barcode"
      : invalidFormat
        ? "invalid-format"
        : "unresolved";
    base.notes.push(barcode
      ? "This looks like a retail barcode (UPC/EAN/GTIN), not a batch code. Look for a separate short stamp on the packaging."
      : "We couldn't automatically decode this code. Double-check it matches the code stamped on the packaging (not the barcode).",
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
    failureReason: null,
    manufactureDate: mfg,
    expirationDate: expiry,
    ageDays,
    ageLabel: humanizeAge(ageDays),
    freshness,
    percentRemaining,
    confidence,
    datePrecision,
    method,
    notes: base.notes,
  };
}
