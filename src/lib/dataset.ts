import { appendFile, mkdir, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CheckResult, DecodeFailureReason } from "@/lib/decoder";

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
const FAILED_DIR = join(DIR, "failed-codes");

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

export interface FailedCodeLog {
  ts: string;
  brand: string;
  code: string;
  reason: DecodeFailureReason;
  decoderId?: string;
  locale?: string;
  country?: string;
}

export interface ActivityLog {
  ts: string;
  type: "visit" | "page_view";
  path: string;
  locale?: string;
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

/**
 * Warn once per process when the dataset can't be written. Swallowing the error
 * is correct — a decode must succeed even if the disk is full or the mount is
 * read-only — but swallowing it *silently* meant a root-owned bind mount went
 * unnoticed for days, with an empty directory as the only symptom. One line in
 * the container log is enough to catch that on the next look.
 */
let warned = false;

/** Fire-and-forget append. Never throws. */
export async function logCheck(entry: CheckLog): Promise<void> {
  try {
    await mkdir(DIR, { recursive: true });
    const file = join(DIR, `checks-${entry.ts.slice(0, 7)}.jsonl`);
    await appendFile(file, JSON.stringify(entry) + "\n", "utf8");
  } catch (err) {
    if (!warned) {
      warned = true;
      console.warn(
        `[dataset] cannot write to ${DIR} — user checks are not being logged. ` +
          `In Docker the bind mount must be owned by the container's uid (1001). ` +
          `Cause: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}

/** Store every failed human decode in a separate append-only file per brand. */
export async function logFailedCode(entry: FailedCodeLog): Promise<void> {
  try {
    await mkdir(FAILED_DIR, { recursive: true });
    const brandFile = entry.brand.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
    await appendFile(
      join(FAILED_DIR, `${brandFile}.jsonl`),
      `${JSON.stringify(entry)}\n`,
      { encoding: "utf8", mode: 0o600 },
    );
  } catch (err) {
    if (!warned) {
      warned = true;
      console.warn(`[dataset] cannot write failed-code queue: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

/** Privacy-minimal product analytics: no IP, cookie id, email or query string. */
export async function logActivity(entry: ActivityLog): Promise<void> {
  try {
    await mkdir(DIR, { recursive: true });
    const file = join(DIR, `activity-${entry.ts.slice(0, 7)}.jsonl`);
    await appendFile(file, `${JSON.stringify(entry)}\n`, "utf8");
  } catch (err) {
    if (!warned) {
      warned = true;
      console.warn(`[dataset] cannot write activity log: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

/** Read newest successful human check events for the private owner dashboard. */
export async function readRecentChecks(limit = 250): Promise<CheckLog[]> {
  const safeLimit = Math.max(1, Math.min(limit, 1_000));
  let files: string[];
  try {
    files = (await readdir(DIR))
      .filter((name) => /^checks-\d{4}-\d{2}\.jsonl$/.test(name))
      .sort()
      .reverse();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const rows: CheckLog[] = [];
  for (const file of files) {
    const lines = (await readFile(join(DIR, file), "utf8")).split("\n").reverse();
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const entry = JSON.parse(line) as CheckLog;
        if (entry.ts && entry.brand && typeof entry.code === "string") rows.push(entry);
      } catch {
        // A process interruption can truncate one append. The dashboard skips
        // that row; writes remain append-only and decode behavior is unaffected.
      }
      if (rows.length >= safeLimit) return rows;
    }
  }
  return rows;
}

export async function readRecentFailedCodes(limit = 1_000): Promise<FailedCodeLog[]> {
  const safeLimit = Math.max(1, Math.min(limit, 5_000));
  let files: string[];
  try {
    files = (await readdir(FAILED_DIR)).filter((name) => name.endsWith(".jsonl")).sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const rows: FailedCodeLog[] = [];
  for (const file of files) {
    for (const line of (await readFile(join(FAILED_DIR, file), "utf8")).split("\n")) {
      if (!line.trim()) continue;
      try {
        const entry = JSON.parse(line) as FailedCodeLog;
        if (entry.ts && entry.brand && entry.code && entry.reason) rows.push(entry);
      } catch {
        // Ignore an interrupted final append; other brand files remain readable.
      }
    }
  }
  return rows.sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, safeLimit);
}

export async function readRecentActivity(limit = 10_000): Promise<ActivityLog[]> {
  const safeLimit = Math.max(1, Math.min(limit, 50_000));
  let files: string[];
  try {
    files = (await readdir(DIR))
      .filter((name) => /^activity-\d{4}-\d{2}\.jsonl$/.test(name))
      .sort()
      .reverse();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const rows: ActivityLog[] = [];
  for (const file of files) {
    const lines = (await readFile(join(DIR, file), "utf8")).split("\n").reverse();
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const entry = JSON.parse(line) as ActivityLog;
        if (entry.ts && entry.path && (entry.type === "visit" || entry.type === "page_view")) rows.push(entry);
      } catch {
        // Ignore a truncated append.
      }
      if (rows.length >= safeLimit) return rows;
    }
  }
  return rows;
}
