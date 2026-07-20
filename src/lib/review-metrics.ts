import { LOCALE_CODES } from "../i18n/locales";

/**
 * Aggregations behind the private review dashboard.
 *
 * Kept free of I/O and of React so the numbers can be tested directly. Every
 * function here reads only what `/api/activity` and the decode logs already
 * record — no session identifier, no referrer, no dwell time — so nothing in
 * this file depends on tracking the site does not currently do.
 *
 * The row types are structural rather than imported from `dataset`: the log
 * types reach into the decoder, which the quality suite's bare `tsc` cannot
 * resolve, and an aggregation has no business depending on the whole graph
 * anyway. `ActivityLog`, `CheckLog` and `FailedCodeLog` all satisfy these.
 */

export type ActivityRow = { ts: string; type: "visit" | "page_view"; path: string; locale?: string };
export type CheckRow = { ts: string; brand: string; country?: string; decoderId?: string; path?: string; confidence: string; mfg: string | null };
export type FailedRow = { ts: string; brand: string; decoderId?: string };

const localeSet = new Set<string>(LOCALE_CODES);

/**
 * One zone for every reported figure.
 *
 * The dashboard prints timestamps in Istanbul time, so bucketing days in UTC
 * dropped late-evening events into the next day's row and made the daily series
 * disagree with the tables beside it.
 */
export const REPORT_TIME_ZONE = "Europe/Istanbul";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: REPORT_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Calendar day of a timestamp in the reporting zone, as YYYY-MM-DD. */
export function reportDay(ts: string | number | Date): string {
  return dayFormatter.format(new Date(ts));
}

const zoneParts = new Intl.DateTimeFormat("en-US", {
  timeZone: REPORT_TIME_ZONE,
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** How far the reporting zone is from UTC at a given instant. */
function zoneOffsetMs(date: Date): number {
  const parts = Object.fromEntries(
    zoneParts.formatToParts(date).map((part) => [part.type, part.value]),
  ) as Record<string, string>;
  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return asIfUtc - date.getTime();
}

/**
 * The instant a reporting-zone calendar day began.
 *
 * "Today" and "yesterday" have to mean the calendar days the dashboard already
 * prints, not a rolling 24 hours — otherwise the "today" figure disagrees with
 * the last column of the daily chart sitting beside it. Computed from the zone's
 * offset rather than a hardcoded +03:00 so the arithmetic survives a rule change.
 */
export function startOfReportDay(ts: string | number | Date): Date {
  const date = new Date(ts);
  const offset = zoneOffsetMs(date);
  const shifted = new Date(date.getTime() + offset);
  shifted.setUTCHours(0, 0, 0, 0);
  return new Date(shifted.getTime() - offset);
}

export const REPORT_PERIODS = [
  { key: "today", label: "Today", days: 1 },
  { key: "yesterday", label: "Yesterday", days: 1 },
  { key: "7d", label: "7 days", days: 7 },
  { key: "14d", label: "14 days", days: 14 },
  { key: "30d", label: "30 days", days: 30 },
] as const;

export type ReportPeriodKey = (typeof REPORT_PERIODS)[number]["key"];

export const DEFAULT_REPORT_PERIOD: ReportPeriodKey = "7d";

export type ReportWindow = {
  key: ReportPeriodKey;
  label: string;
  /** Inclusive lower bound, ISO. */
  start: string;
  /** Exclusive upper bound, ISO. Absent means "up to now". */
  end?: string;
  /** Same-length window immediately before, for the direction arrows. */
  previousStart: string;
  previousEnd: string;
  /** Days the daily series should draw for this window. */
  seriesDays: number;
};

export function isReportPeriod(value: unknown): value is ReportPeriodKey {
  return REPORT_PERIODS.some((period) => period.key === value);
}

/**
 * Resolve a period key into the bounds every aggregation on the page shares.
 *
 * Rolling windows run back from now; the two calendar periods are pinned to
 * reporting-zone midnights, and "yesterday" is the only one that needs an upper
 * bound — without it, yesterday's tile would silently include today.
 */
export function reportWindow(key: ReportPeriodKey, now: number): ReportWindow {
  const period = REPORT_PERIODS.find((entry) => entry.key === key) ?? REPORT_PERIODS[2];
  const day = 86_400_000;
  const todayStart = startOfReportDay(now).getTime();

  if (key === "today" || key === "yesterday") {
    const start = key === "today" ? todayStart : startOfReportDay(todayStart - day).getTime();
    const end = key === "today" ? now : todayStart;
    // The comparison runs against the same clock hours of the previous day, not
    // against the equally long stretch immediately before this window. Today at
    // noon has seen half a day of traffic; measuring it against yesterday
    // afternoon-to-midnight compares a morning with an evening, and traffic has
    // a daily rhythm that makes that difference look like a trend.
    const previousStart = startOfReportDay(start - day).getTime();
    return {
      key,
      label: period.label,
      start: new Date(start).toISOString(),
      // "Today" is still running, so leaving it open-ended and letting it end at
      // `now` are the same thing; only "yesterday" has to be closed.
      end: key === "yesterday" ? new Date(end).toISOString() : undefined,
      previousStart: new Date(previousStart).toISOString(),
      previousEnd: new Date(previousStart + (end - start)).toISOString(),
      seriesDays: key === "today" ? 1 : 2,
    };
  }

  const start = now - period.days * day;
  return {
    key,
    label: period.label,
    start: new Date(start).toISOString(),
    previousStart: new Date(start - period.days * day).toISOString(),
    previousEnd: new Date(start).toISOString(),
    seriesDays: period.days,
  };
}

/** Rows falling inside a resolved window. */
export function withinWindow<T extends { ts: string }>(rows: T[], window: ReportWindow): T[] {
  return rows.filter(
    (row) => row.ts >= window.start && (window.end === undefined || row.ts < window.end),
  );
}

/**
 * Drop the locale prefix so the same page groups across languages.
 *
 * The default locale is prefix-free ("/brands/dior") while the others are not
 * ("/ru/brands/dior"), and reporting them apart would split every page's
 * traffic across 44 rows.
 */
export function stripLocale(path: string): string {
  const [, head, ...rest] = path.split("/");
  if (!head || !localeSet.has(head)) return path || "/";
  return rest.length ? `/${rest.join("/")}` : "/";
}

export type PathStat = { path: string; count: number };

function rank(counts: Map<string, number>, limit?: number): PathStat[] {
  const rows = [...counts.entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count || a.path.localeCompare(b.path));
  return limit ? rows.slice(0, limit) : rows;
}

function tally<T>(rows: T[], key: (row: T) => string | undefined): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = key(row);
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

/**
 * Landing pages, from the first page view of each session.
 *
 * `/api/activity` marks that first view with `type: "visit"`, so this is a real
 * entry-page report rather than an approximation.
 */
export function entryPages(activity: ActivityRow[], limit?: number): PathStat[] {
  return rank(
    tally(activity.filter((row) => row.type === "visit"), (row) => stripLocale(row.path)),
    limit,
  );
}

/** Most-viewed pages, locale-merged. */
export function topPages(activity: ActivityRow[], limit?: number): PathStat[] {
  return rank(
    tally(activity.filter((row) => row.type === "page_view"), (row) => stripLocale(row.path)),
    limit,
  );
}

/**
 * Locale mix, counted from page views only.
 *
 * The first page of a session is written twice — once as `visit`, once as
 * `page_view` — so counting every row double-weighted every entry page.
 */
export function localeSplit(activity: ActivityRow[], limit?: number): PathStat[] {
  return rank(
    tally(activity.filter((row) => row.type === "page_view"), (row) => row.locale),
    limit,
  );
}

export function countrySplit(checks: CheckRow[], limit?: number): PathStat[] {
  return rank(tally(checks, (row) => row.country), limit);
}

export type DailyPoint = {
  day: string;
  visits: number;
  views: number;
  checks: number;
  failed: number;
};

/** Day-by-day series, oldest first, with empty days filled in. */
export function dailySeries(
  activity: ActivityRow[],
  checks: CheckRow[],
  failed: FailedRow[],
  days: number,
  now: number,
): DailyPoint[] {
  const points = new Map<string, DailyPoint>();
  for (let index = days - 1; index >= 0; index--) {
    const day = reportDay(now - index * 86_400_000);
    points.set(day, { day, visits: 0, views: 0, checks: 0, failed: 0 });
  }
  const bump = (ts: string, field: keyof Omit<DailyPoint, "day">) => {
    const point = points.get(reportDay(ts));
    if (point) point[field] += 1;
  };
  for (const row of activity) bump(row.ts, row.type === "visit" ? "visits" : "views");
  for (const row of checks) bump(row.ts, "checks");
  for (const row of failed) bump(row.ts, "failed");
  return [...points.values()];
}

export type BrandFunnel = {
  slug: string;
  views: number;
  checks: number;
  /** Checks that produced a manufacture date. */
  decoded: number;
  /** Checks per 100 page views, or null when the page had no views. */
  conversion: number | null;
};

/**
 * Brand page views against decodes for that brand.
 *
 * The metric the rest of the dashboard cannot answer: a brand page can rank and
 * be read and still never get a code typed into it.
 */
export function brandFunnel(activity: ActivityRow[], checks: CheckRow[]): BrandFunnel[] {
  const views = new Map<string, number>();
  for (const row of activity) {
    if (row.type !== "page_view") continue;
    const match = /^\/brands\/([^/]+)$/.exec(stripLocale(row.path));
    if (!match) continue;
    views.set(match[1], (views.get(match[1]) ?? 0) + 1);
  }
  // Rows come from pages that were actually viewed. Seeding from every checked
  // brand instead added all-zero rows for brands only ever used from /check.
  return [...views.keys()]
    .map((slug) => {
      // A selected brand can also be checked from /check or another surface.
      // Only an exact brand-page referrer belongs in this page conversion.
      const brandChecks = checks.filter(
        (row) => row.brand === slug && row.path && stripLocale(row.path) === `/brands/${slug}`,
      );
      const seen = views.get(slug) ?? 0;
      return {
        slug,
        views: seen,
        checks: brandChecks.length,
        decoded: brandChecks.filter((row) => row.mfg).length,
        conversion: seen ? (brandChecks.length / seen) * 100 : null,
      };
    })
    .sort((a, b) => b.views - a.views || b.checks - a.checks);
}

/**
 * Checks that carry no referring path, so no page can be credited with them.
 *
 * Rows logged before the path was recorded fall here. Surfacing the count keeps
 * a partial dataset visible instead of letting it read as zero conversion.
 */
export function unattributedChecks(checks: CheckRow[]): number {
  return checks.filter((row) => !row.path).length;
}

export type DecoderHealth = {
  slug: string;
  decoderId?: string;
  checks: number;
  /** Checks that returned no date, from the check log itself. */
  undecoded: number;
  /** Separately logged failures, including rejected retail barcodes. */
  failures: number;
  failRate: number;
  confidence: Record<string, number>;
};

/**
 * Per-brand decode success. Surfaces the brands where users are being turned
 * away — the signal that is otherwise spread across thousands of log lines.
 */
export function decoderHealth(checks: CheckRow[], failed: FailedRow[]): DecoderHealth[] {
  const slugs = new Set([...checks.map((row) => row.brand), ...failed.map((row) => row.brand)]);
  return [...slugs]
    .map((slug) => {
      const brandChecks = checks.filter((row) => row.brand === slug);
      const undecoded = brandChecks.filter((row) => !row.mfg).length;
      const failures = failed.filter((row) => row.brand === slug).length;
      const confidence: Record<string, number> = {};
      for (const row of brandChecks) {
        confidence[row.confidence] = (confidence[row.confidence] ?? 0) + 1;
      }
      return {
        slug,
        decoderId: brandChecks.find((row) => row.decoderId)?.decoderId
          ?? failed.find((row) => row.brand === slug && row.decoderId)?.decoderId,
        checks: brandChecks.length,
        undecoded,
        failures,
        failRate: brandChecks.length ? (undecoded / brandChecks.length) * 100 : 0,
        confidence,
      };
    })
    .sort((a, b) => b.failRate - a.failRate || b.checks - a.checks);
}

/**
 * Whether a brand's no-read rate is moving, not just where it stands.
 *
 * A single rate cannot separate a decoder that just broke from a format that
 * was never supported: both show as "high". Comparing the window against the
 * one before it does, and a decoder regression is the case worth catching
 * early. Brands with too little traffic on either side return `null` rather
 * than a swing computed from one or two checks.
 */
export function decoderHealthTrend(
  checks: CheckRow[],
  currentStart: string,
  previousStart: string,
  minimumChecks = 3,
): Map<string, number | null> {
  const out = new Map<string, number | null>();
  const counts = new Map<string, { current: number; currentFailed: number; previous: number; previousFailed: number }>();
  for (const row of checks) {
    const count = counts.get(row.brand) ?? { current: 0, currentFailed: 0, previous: 0, previousFailed: 0 };
    if (row.ts >= currentStart) {
      count.current += 1;
      if (!row.mfg) count.currentFailed += 1;
    } else if (row.ts >= previousStart) {
      count.previous += 1;
      if (!row.mfg) count.previousFailed += 1;
    }
    counts.set(row.brand, count);
  }
  for (const [slug, count] of counts) {
    out.set(
      slug,
      count.current >= minimumChecks && count.previous >= minimumChecks
        ? (count.currentFailed / count.current) * 100 - (count.previousFailed / count.previous) * 100
        : null,
    );
  }
  return out;
}

export type Trend = {
  current: number;
  previous: number;
  /** Percent change, or null when the earlier window had nothing to compare to. */
  changePercent: number | null;
};

/**
 * A count against the same-length window immediately before it.
 *
 * A bare "88 visits" carries no judgement. Growth from 40 and a fall from 300
 * are different situations and the tile looked identical in both. `null` is
 * returned rather than a fabricated percentage when the earlier window is
 * empty, because "up from nothing" is not a rate.
 */
export function trend<T extends { ts: string }>(
  rows: T[],
  currentStart: string,
  previousStart: string,
  keep: (row: T) => boolean = () => true,
  /**
   * Exclusive upper bound on the current window. Only the closed periods need
   * it — without one, "yesterday" counts today's rows as well and every
   * yesterday figure reads high until midnight.
   */
  currentEnd?: string,
  /**
   * Exclusive upper bound on the comparison window. Defaults to `currentStart`,
   * which is right for the rolling periods where the two windows abut. The
   * calendar periods compare against the same clock hours a day earlier, so
   * their comparison window closes well before the current one opens.
   */
  previousEnd?: string,
): Trend {
  let current = 0;
  let previous = 0;
  const previousCutoff = previousEnd ?? currentStart;
  for (const row of rows) {
    if (!keep(row)) continue;
    if (currentEnd !== undefined && row.ts >= currentEnd) continue;
    if (row.ts >= currentStart) {
      if (currentEnd === undefined || row.ts < currentEnd) current += 1;
    } else if (row.ts >= previousStart && row.ts < previousCutoff) previous += 1;
  }
  return {
    current,
    previous,
    changePercent: previous === 0 ? null : ((current - previous) / previous) * 100,
  };
}

/** Decoded manufacture years, for spotting cyclic-wheel misreads. */
export function manufactureYears(checks: CheckRow[]): PathStat[] {
  return [...tally(checks, (row) => row.mfg?.slice(0, 4)).entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => a.path.localeCompare(b.path));
}
