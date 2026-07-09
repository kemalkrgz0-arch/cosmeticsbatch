import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { CheckResult } from "@/lib/decoder";

/**
 * Append-only dataset of the batch codes users check. Every decode writes one
 * JSON line to a month-rotated file under DATASET_DIR. In production this dir
 * is a bind-mounted Docker volume, so the data survives container rebuilds.
 *
 * Deliberately stores NO IP or other personal data — a batch code plus a
 * coarse country code is not personal information, so no consent gate is
 * needed. Logging is fire-and-forget: a failed write must never break a decode.
 */
const DIR = process.env.DATASET_DIR || join(process.cwd(), ".data");

export type CheckSource = "brand" | "check" | "api";

export interface CheckLog {
  ts: string; // ISO 8601
  source: CheckSource;
  brand: string; // slug
  code: string; // raw user input (trimmed)
  decoderId?: string;
  locale?: string;
  country?: string; // ISO-3166 alpha-2, from the CDN edge header
  confidence: string;
  freshness: string;
  mfg: string | null; // manufacture date, YYYY-MM-DD (null if undecodable)
}

/** Build a log row from a decode result. */
export function toCheckLog(args: {
  source: CheckSource;
  brandSlug: string;
  code: string;
  decoderId?: string;
  locale?: string;
  country?: string;
  result: CheckResult;
}): CheckLog {
  const { result } = args;
  return {
    ts: new Date().toISOString(),
    source: args.source,
    brand: args.brandSlug,
    code: args.code,
    decoderId: args.decoderId,
    locale: args.locale,
    country: args.country,
    confidence: result.confidence,
    freshness: result.freshness,
    mfg: result.manufactureDate
      ? result.manufactureDate.toISOString().slice(0, 10)
      : null,
  };
}

/** Fire-and-forget append. Never throws. */
export async function logCheck(entry: CheckLog): Promise<void> {
  try {
    await mkdir(DIR, { recursive: true });
    const file = join(DIR, `checks-${entry.ts.slice(0, 7)}.jsonl`);
    await appendFile(file, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    // Logging is best-effort; a decode must succeed even if the disk is full
    // or the volume is read-only.
  }
}
