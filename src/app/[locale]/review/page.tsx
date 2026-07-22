import type { Metadata } from "next";
import Link from "next/link";
import { Activity, AlertTriangle, Download, Eye, Inbox, LogIn, Search, Users } from "lucide-react";
import { getBrand } from "@/lib/brands";
import { canonicalCode, checkBatchCode } from "@/lib/decoder";
import { ReplyComposer } from "@/components/review/reply-composer";
import { SubmissionPhoto } from "@/components/review/submission-photo";
import { readChecksSince, readFailedCodesSince, readRecentActivity } from "@/lib/dataset";
import { requireReviewer } from "@/lib/review-auth";
import { REPLY_TEMPLATES } from "@/lib/reviewer-reply";
import { listSubmissions, REVIEW_STATUSES } from "@/lib/submission-store";
import {
  brandFunnel,
  countrySplit,
  dailySeries,
  decoderHealth,
  decoderHealthTrend,
  DEFAULT_REPORT_PERIOD,
  entryPages,
  isDecoderFailure,
  isReportPeriod,
  localeSplit,
  manufactureYears,
  REPORT_PERIODS,
  REPORT_TIME_ZONE,
  reportWindow,
  topPages,
  trend,
  unattributedChecks,
  withinWindow,
  type PathStat,
  type Trend,
} from "@/lib/review-metrics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Submission Review | Cosmetics Batch",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

// Order is prominence: the raw check log sits second because it is the thing
// looked at most often, not last behind the aggregate reports.
const VIEWS = ["overview", "checks", "traffic", "decoders", "submissions"] as const;
type View = (typeof VIEWS)[number];

/** Older links pointed the failed-code queue at its own tab; keep them working. */
const LEGACY_VIEWS: Record<string, View> = { failed: "decoders" };

const viewLabels: Record<View, string> = {
  overview: "Overview",
  // The raw log of what people typed. It briefly lived third inside "Decoder
  // health", where nobody looking for their users' queries would open it.
  checks: "Code checks",
  traffic: "Traffic",
  decoders: "Decoder health",
  submissions: "Photo submissions",
};

const statusLabels: Record<string, string> = {
  pending: "New",
  in_review: "In review",
  awaiting_user: "Awaiting user",
  completed: "Completed",
  discarded: "Archived",
};

type FailedRow = {
  code: string;
  count: number;
  latest: string;
  /** Every raw spelling that collapsed to this code, e.g. "TCR 15" and "tcr15". */
  variants: Set<string>;
  reasons: Map<string, number>;
  locales: Set<string>;
  countries: Set<string>;
};

async function dashboardTimestamp() {
  return Date.now();
}

function href(view: View, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ ...(view === "overview" ? {} : { view }), ...extra });
  const query = params.toString();
  return query ? `/review/dashboard?${query}` : "/review/dashboard";
}

function Panel({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-bold">{title}</h2>
        {hint && <p className="mt-1 text-sm text-fg-muted">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

/** Horizontal bar list. Proportions are read at a glance; exact counts stay visible. */
function BarList({ rows, empty, format }: { rows: PathStat[]; empty: string; format?: (path: string) => string }) {
  if (rows.length === 0) return <p className="p-8 text-center text-sm text-fg-muted">{empty}</p>;
  const max = Math.max(...rows.map((row) => row.count));
  return (
    <ul className="divide-y">
      {rows.map((row) => (
        <li key={row.path} className="relative flex items-center justify-between gap-4 px-5 py-2.5">
          <div aria-hidden="true" className="absolute inset-y-0 left-0 bg-accent/10" style={{ width: `${(row.count / max) * 100}%` }} />
          <span className="relative truncate font-mono text-sm">{format ? format(row.path) : row.path}</span>
          <span className="relative shrink-0 font-semibold tabular-nums">{row.count}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Direction against the previous window of the same length.
 *
 * Colour follows meaning rather than sign: more failed codes is not good news,
 * so that tile passes `lowerIsBetter`. When the earlier window was empty there
 * is no rate to state, and saying so beats printing an invented percentage.
 */
function TrendNote({ trend, lowerIsBetter = false, label = "prev period" }: { trend: Trend; lowerIsBetter?: boolean; label?: string }) {
  if (trend.changePercent === null) {
    return (
      <p className="mt-1 text-xs text-fg-muted">
        {trend.previous === 0 && trend.current > 0 ? "no earlier baseline" : "no change to compare"}
      </p>
    );
  }
  const rounded = Math.round(trend.changePercent);
  const improved = lowerIsBetter ? rounded < 0 : rounded > 0;
  const flat = rounded === 0;
  return (
    <p className={`mt-1 text-xs font-medium ${flat ? "text-fg-muted" : improved ? "text-success" : "text-danger"}`}>
      {rounded > 0 ? "+" : ""}{rounded}% <span className="font-normal text-fg-muted">vs {label} ({trend.previous})</span>
    </p>
  );
}

/**
 * Window selector.
 *
 * Every figure on the page follows it, including the tables, so a period is a
 * statement about the whole screen rather than a filter on one panel. It is a
 * row of links rather than a form so the choice survives in the URL and can be
 * bookmarked or sent to someone.
 */
function PeriodPicker({ current, view, extra }: { current: string; view: View; extra: Record<string, string> }) {
  const { period: _drop, ...rest } = extra;
  void _drop;
  return (
    <nav aria-label="Reporting period" className="mb-5 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-fg-muted">Period</span>
      {REPORT_PERIODS.map(({ key, label }) => (
        <Link
          key={key}
          href={href(view, { ...rest, ...(key === DEFAULT_REPORT_PERIOD ? {} : { period: key }) })}
          aria-current={current === key ? "true" : undefined}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${current === key ? "bg-cta text-cta-fg" : "bg-card border"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

/** Display name for a brand slug, falling back to the slug itself. */
const brandName = (slug: string) => getBrand(slug)?.name ?? slug;

/**
 * What the decoder currently makes of a code.
 *
 * Decoding here is safe in a way the public pages are not: this route is behind
 * Access, so `method` and `notes` — the very fields the public result strips —
 * are exactly what makes a failure diagnosable.
 */
function previewDecode(slug: string, code: string) {
  const brand = getBrand(slug);
  if (!brand || !code.trim()) return null;
  return checkBatchCode({
    brandName: brand.name,
    code,
    decoderId: brand.decoderId,
    shelfLifeMonths: brand.shelfLifeMonths,
    category: brand.category,
  });
}

/**
 * Why a logged code did not decode, expanded on demand.
 *
 * The check log answers "what did people type"; without this the other half —
 * "and why did that fail" — meant leaving the dashboard and retyping the code
 * on the public site. Only rendered for rows that produced no date, so the
 * table stays quiet, and collapsed by default so a screenful of failures does
 * not become a screenful of prose.
 *
 * Decoding happens here, on the server: this route is behind Access, and
 * `method` and `notes` are the fields the public result deliberately strips.
 */
function CheckDiagnosis({ brand, code }: { brand: string; code: string }) {
  const result = previewDecode(brand, code);
  if (!result) return <>Not decoded</>;
  return (
    <details>
      <summary className="cursor-pointer">Not decoded — why?</summary>
      <div className="mt-2 max-w-xs whitespace-normal text-xs font-normal text-fg-muted">
        <p className="font-semibold">{result.failureReason ?? "unresolved"}</p>
        {result.method && <p className="mt-1">{result.method}</p>}
        {result.notes.length > 0 && (
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {result.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        )}
      </div>
    </details>
  );
}

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ view?: string; status?: string; q?: string; result?: string; brand?: string; country?: string; period?: string; updated?: string; error?: string }> }) {
  const reviewer = await requireReviewer();
  const query = await searchParams;
  const requested = query.view ? (LEGACY_VIEWS[query.view] ?? query.view) : "overview";
  const view: View = VIEWS.includes(requested as View) ? (requested as View) : "overview";
  const selectedStatus = REVIEW_STATUSES.includes(query.status as never) ? query.status : "pending";
  const search = query.q?.trim().toLowerCase() ?? "";

  const now = await dashboardTimestamp();
  // One selected window drives every number on the page. Before this, the tiles
  // were pinned to seven days and the reports to REPORT_DAYS, so the two halves
  // of the screen described different spans of time without saying so.
  const period = isReportPeriod(query.period) ? query.period : DEFAULT_REPORT_PERIOD;
  const win = reportWindow(period, now);
  const windowReport = win.previousStart; // read far enough back to compare
  const window7d = win.start;

  const all = await listSubmissions();
  const submissions = all.filter((item) => item.status === selectedStatus && (!search || [item.id, item.brand, item.productName, item.ean, item.observedPao, item.code, item.email, item.note].some((value) => value?.toLowerCase().includes(search))));
  const open = all.filter((item) => item.status === "pending" || item.status === "in_review").length;

  // Load only what the open tab renders. The summary tiles live on Overview
  // alone, so the other tabs no longer pay to read logs they never show.
  const needsActivity = view === "overview" || view === "traffic";
  const needsChecks = view === "overview" || view === "checks" || view === "traffic" || view === "decoders";
  const needsFailed = view === "overview" || view === "decoders";
  const [activity, checks, failedCodes] = await Promise.all([
    needsActivity ? readRecentActivity(50_000, windowReport) : Promise.resolve([]),
    needsChecks ? readChecksSince(windowReport) : Promise.resolve([]),
    needsFailed ? readFailedCodesSince(windowReport) : Promise.resolve([]),
  ]);

  // Each tile is measured against the window of equal length before it, so a
  // number can be read as a direction rather than a bare quantity.
  const window14d = win.previousStart;
  const visitsTrend = trend(activity, window7d, window14d, (row) => row.type === "visit", win.end, win.previousEnd);
  const viewsTrend = trend(activity, window7d, window14d, (row) => row.type === "page_view", win.end, win.previousEnd);
  const checksTrend = trend(checks, window7d, window14d, undefined, win.end, win.previousEnd);
  const failedTrend = trend(failedCodes, window7d, window14d, isDecoderFailure, win.end, win.previousEnd);
  const nonBatchTrend = trend(failedCodes, window7d, window14d, (row) => !isDecoderFailure(row), win.end, win.previousEnd);
  const visits7d = visitsTrend.current;
  const views7d = viewsTrend.current;
  const checks7d = checksTrend.current;
  const failed7d = failedTrend.current;
  const nonBatch7d = nonBatchTrend.current;

  // The reports below the tiles read the selected window only. The wider fetch
  // above exists so the comparison has something to compare against; letting it
  // reach the tables would show 60 days of rows under a "Today" heading.
  const activityWindow = withinWindow(activity, win);
  const checksWindow = withinWindow(checks, win);
  const failedWindow = withinWindow(failedCodes, win);

  const decodedInWindow = checksWindow.filter((row) => row.mfg).length;
  const decoderChecks7d = Math.max(0, checks7d - nonBatch7d);
  const readRate = decoderChecks7d ? Math.round((decodedInWindow / decoderChecks7d) * 100) : null;

  const series = dailySeries(activityWindow, checksWindow, failedWindow, win.seriesDays, now);
  const funnel = brandFunnel(activityWindow, checksWindow);
  const unattributed = unattributedChecks(checksWindow);
  const health = decoderHealth(checksWindow, failedWindow);
  // A rate says where a brand stands; the swing says whether it just broke.
  const healthTrend = decoderHealthTrend(checks, failedCodes, window7d, window14d);
  const years = manufactureYears(checksWindow);

  // Result filter, composed with the text search rather than replacing it.
  // "Unread" is the one that earns its place: those rows are the decoder gaps.
  const RESULTS = ["all", "unread", "read", "low"] as const;
  type ResultFilter = (typeof RESULTS)[number];
  const resultFilter: ResultFilter = RESULTS.includes(query.result as ResultFilter)
    ? (query.result as ResultFilter)
    : "all";
  const matchesResult = (item: (typeof checks)[number]) =>
    resultFilter === "all"
      || (resultFilter === "unread" && !item.mfg)
      || (resultFilter === "read" && Boolean(item.mfg))
      || (resultFilter === "low" && (item.confidence === "low" || item.confidence === "none"));
  // Brand and country were reachable only by typing into the free-text box,
  // which also matches codes and dates — so "vichy" and "tr" were guesses, not
  // selections. These are exact and compose with the result chips and search.
  const brandFilter = query.brand?.trim() ?? "";
  const countryFilter = query.country?.trim().toUpperCase() ?? "";
  const checkBrands = [...new Set(checksWindow.map((row) => row.brand))]
    .sort((a, b) => brandName(a).localeCompare(brandName(b)));
  const checkCountries = [...new Set(checksWindow.map((row) => row.country).filter(Boolean) as string[])].sort();
  // How many times each brand+code was tried, counted the way the decoder reads
  // it so "TCR 15" and "TCR15" are one code. The log stays chronological — it is
  // a log — but a row that is one of nine attempts should not look like one of
  // one, which is how the failed-code queue already presents the same fact.
  const attemptCounts = new Map<string, number>();
  for (const row of checksWindow) {
    const key = `${row.brand}:${canonicalCode(row.code)}`;
    attemptCounts.set(key, (attemptCounts.get(key) ?? 0) + 1);
  }
  const attemptsFor = (row: { brand: string; code: string }) =>
    attemptCounts.get(`${row.brand}:${canonicalCode(row.code)}`) ?? 1;

  /** Carry the filters a control does not itself set, so they compose. */
  const keepFilters = (except: { result?: boolean } = {}) => ({
    ...(period !== DEFAULT_REPORT_PERIOD ? { period } : {}),
    ...(query.q ? { q: query.q } : {}),
    ...(brandFilter ? { brand: brandFilter } : {}),
    ...(countryFilter ? { country: countryFilter } : {}),
    ...(!except.result && resultFilter !== "all" ? { result: resultFilter } : {}),
  });
  // `checksWindow`, not `checks`: the wider fetch above exists only so the trend
  // arrows have a previous period to compare against. Reading it here put the
  // comparison window into the visible log, so selecting "Today" listed
  // yesterday's rows underneath today's and the list never restarted at
  // midnight. See finding 47.
  const checksMatchingNonResultFilters = checksWindow
    .filter((item) => !brandFilter || item.brand === brandFilter)
    .filter((item) => !countryFilter || item.country === countryFilter)
    .filter((item) => !search || [item.brand, item.code, item.locale, item.country, item.mfg].some((value) => value?.toLowerCase().includes(search)));
  const matchedChecks = checksMatchingNonResultFilters.filter(matchesResult);
  const shownChecks = matchedChecks.slice(0, 500);
  const resultCounts: Record<ResultFilter, number> = {
    all: checksMatchingNonResultFilters.length,
    unread: checksMatchingNonResultFilters.filter((item) => !item.mfg).length,
    read: checksMatchingNonResultFilters.filter((item) => item.mfg).length,
    low: checksMatchingNonResultFilters.filter((item) => item.confidence === "low" || item.confidence === "none").length,
  };
  const resultLabels: Record<ResultFilter, string> = {
    all: "All",
    unread: "Not decoded",
    read: "Decoded",
    low: "Low confidence",
  };

  const matchesFailedSearch = (item: (typeof failedWindow)[number]) =>
    !search || [item.brand, item.code, item.reason, item.kind, item.locale, item.country]
      .some((value) => value?.toLowerCase().includes(search));
  const failedFiltered = failedWindow.filter(isDecoderFailure).filter(matchesFailedSearch);
  const nonBatchFiltered = failedWindow.filter((item) => !isDecoderFailure(item)).filter(matchesFailedSearch);
  // Group on the code as the decoder reads it, not the raw string or failure
  // classification. "TCR 15" / "TCR15" are one code; "TCR1S" stays distinct.
  const failedGroups = Array.from(failedFiltered.reduce((brands, item) => {
    const brand = brands.get(item.brand) ?? new Map<string, FailedRow>();
    const key = canonicalCode(item.code);
    const row = brand.get(key) ?? { code: item.code, count: 0, latest: item.ts, variants: new Set<string>(), reasons: new Map<string, number>(), locales: new Set<string>(), countries: new Set<string>() };
    row.count += 1;
    row.variants.add(item.code);
    row.reasons.set(item.reason, (row.reasons.get(item.reason) ?? 0) + 1);
    if (item.ts > row.latest) row.latest = item.ts;
    if (item.locale) row.locales.add(item.locale);
    if (item.country) row.countries.add(item.country);
    brand.set(key, row);
    brands.set(item.brand, brand);
    return brands;
  }, new Map<string, Map<string, FailedRow>>()).entries()).sort(([a], [b]) => (getBrand(a)?.name ?? a).localeCompare(getBrand(b)?.name ?? b));


  const maxSeries = Math.max(1, ...series.map((point) => Math.max(point.views, point.visits, point.checks)));

  // A div rather than a <main>: the root layout already supplies the page's
  // main landmark, and nesting a second one is invalid HTML.
  return (
    <div className="min-h-screen bg-bg-subtle px-4 py-8 text-fg sm:px-6">
      <div className="site-frame !px-0">
        {/* On a phone the identity block was four stacked lines before any data.
            Title stays prominent; the account line and sign-out share a row. */}
        <header className="mb-4 sm:mb-6">
          <p className="text-xs font-semibold text-accent sm:text-sm">Private workspace</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Owner dashboard</h1>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="min-w-0 truncate text-xs text-fg-muted sm:text-sm">Signed in as {reviewer.email}</p>
            <Link href="/cdn-cgi/access/logout" prefetch={false} className="shrink-0 text-xs font-medium text-fg-muted underline sm:text-sm">Sign out</Link>
          </div>
        </header>

        {query.updated && <p role="status" className="mb-4 rounded-xl bg-success-bg p-3 text-sm text-success">Submission updated successfully.</p>}
        {query.error && <p role="alert" className="mb-4 rounded-xl bg-danger-bg p-3 text-sm text-danger">The update could not be completed. No reply was recorded as sent.</p>}

        {/* Work waiting on a person comes first; passive counts sit below it. */}
        {open > 0 && (
          <Link href={href("submissions")} className="mb-6 flex items-center gap-3 rounded-2xl border border-accent bg-accent/10 p-4 font-semibold">
            <Inbox aria-hidden="true" className="size-5 text-accent" />
            {open} photo {open === 1 ? "submission needs" : "submissions need"} a reply
          </Link>
        )}

        <PeriodPicker current={period} view={view} extra={keepFilters()} />

        {view === "overview" && (
          <>
        {/* Two-up on phones. One tile per row turned six numbers into six
            screens of scrolling before the tabs and the actual reports. */}
        <section aria-label={`Summary · ${win.label}`} className="mb-2 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { label: "Visits", value: visits7d, icon: Users, trend: visitsTrend },
            { label: "Page views", value: views7d, icon: Eye, trend: viewsTrend },
            { label: "Entry pages", value: entryPages(activityWindow).length, icon: LogIn },
            { label: "Code checks", value: checks7d, icon: Activity, trend: checksTrend },
            { label: "Read rate", value: readRate === null ? "—" : `${readRate}%`, icon: Activity },
            // More failed codes is not an improvement, so this tile reads inverted.
            { label: "Failed codes", value: failed7d, icon: AlertTriangle, trend: failedTrend, lowerIsBetter: true },
            { label: "Product identifiers", value: nonBatch7d, icon: Inbox, trend: nonBatchTrend },
          ].map(({ label, value, icon: Icon, trend: tileTrend, lowerIsBetter }) => (
            <div key={label} className="rounded-xl border bg-card p-3 shadow-sm sm:rounded-2xl sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-fg-muted sm:text-sm">{label}</p>
                <Icon aria-hidden="true" className="size-4 shrink-0 text-accent sm:size-5" />
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums sm:mt-2 sm:text-3xl">{value}</p>
              {tileTrend && <TrendNote trend={tileTrend} lowerIsBetter={lowerIsBetter} label={`prev ${win.label.toLowerCase()}`} />}
            </div>
          ))}
        </section>
        <p className="mb-6 text-xs text-fg-muted">{win.label}, bucketed by {REPORT_TIME_ZONE} calendar day — tiles and reports cover the same window, compared against the {win.label.toLowerCase()} before it. Approximate visits are anonymous browser sessions, not verified unique people. No IP, cookie identifier, email or query string is stored — so time on page, navigation paths and traffic sources are not available here.</p>
          </>
        )}

        <nav aria-label="Dashboard sections" className="mb-5 flex flex-wrap gap-2 border-b pb-4">
          {VIEWS.map((key) => (
            <Link key={key} href={href(key, { ...(period !== DEFAULT_REPORT_PERIOD ? { period } : {}), ...(query.q ? { q: query.q } : {}) })} aria-current={view === key ? "page" : undefined} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === key ? "bg-cta text-cta-fg" : "bg-card"}`}>
              {viewLabels[key]}{key === "submissions" && open > 0 ? ` (${open})` : ""}
            </Link>
          ))}
        </nav>

        {/* Search only appears where it actually filters something. On Traffic
            the panels are aggregates, so a box there looked broken. Exports name
            the dataset they download rather than a generic "CSV". */}
        {(view === "checks" || view === "decoders" || view === "submissions") && (
          <section className="mb-5 flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
            <form method="get" action="/review/dashboard" className="flex flex-1 gap-2">
              <input type="hidden" name="view" value={view} />
              {view === "submissions" && <input type="hidden" name="status" value={selectedStatus} />}
              {/* Keep the active result filter when searching, or the search
                  silently widens back to every check. */}
              {view === "checks" && resultFilter !== "all" && <input type="hidden" name="result" value={resultFilter} />}
              {view === "checks" && brandFilter && <input type="hidden" name="brand" value={brandFilter} />}
              {view === "checks" && countryFilter && <input type="hidden" name="country" value={countryFilter} />}
              <label className="relative flex-1">
                <span className="sr-only">Search review data</span>
                <Search aria-hidden="true" className="absolute left-3 top-3 size-5 text-fg-muted" />
                <input name="q" defaultValue={query.q} placeholder={view === "submissions" ? "Search ID, brand, product, EAN, PAO, code or note" : "Search brand, code, type, locale or country"} className="min-h-11 w-full rounded-xl border bg-bg pl-10 pr-3" />
              </label>
              <button className="min-h-11 rounded-xl bg-cta px-5 font-semibold text-cta-fg">Search</button>
            </form>
            <div className="flex flex-wrap gap-2">
              {(view === "submissions"
                ? [["submissions", "Submissions"] as const]
                : view === "checks"
                  ? [["checks", "Checks"] as const]
                  : [["failed", "Failed codes"] as const]
              ).map(([kind, label]) => (
                <span key={kind} className="inline-flex overflow-hidden rounded-xl border bg-bg">
                  <span className="flex min-h-11 items-center gap-2 border-r px-3 text-sm font-semibold"><Download aria-hidden="true" className="size-4" />{label}</span>
                  <a href={`/review/api/export?kind=${kind}&format=csv`} className="flex min-h-11 items-center px-3 text-sm font-semibold">CSV</a>
                  <a href={`/review/api/export?kind=${kind}&format=json`} className="flex min-h-11 items-center border-l px-3 text-sm font-semibold">JSON</a>
                </span>
              ))}
            </div>
          </section>
        )}

        {view === "overview" && (
          <div className="grid gap-5 lg:grid-cols-2 [&>*]:min-w-0">
            <div className="lg:col-span-2">
              <Panel title="Download everything" hint="One JSON file with every code check, failed code and activity event, for sharing the full picture in a single attachment. Photo submissions are excluded — they contain submitter email addresses and notes.">
                <div className="flex flex-wrap items-center gap-3 p-5">
                  {/* A file download from an API route, not a page navigation:
                      `Link` would try to client-route to it. */}
                  <a href="/review/api/export?kind=all" download className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cta px-5 font-semibold text-cta-fg">
                    <Download aria-hidden="true" className="size-4" />
                    Download all data (JSON)
                  </a>
                  <span className="text-sm text-fg-muted">Checks, failed codes and activity in one bundle.</span>
                </div>
              </Panel>
            </div>
            <div className="lg:col-span-2">
              <Panel title={`Daily traffic · ${win.label}`} hint="Page views, visits and code checks, one column per day.">
                <div className="overflow-x-auto p-5">
                  <div className="flex min-w-[640px] items-end gap-1" style={{ height: "9rem" }}>
                    {series.map((point) => (
                      <div key={point.day} className="flex h-full flex-1 items-end gap-px" title={`${point.day} · ${point.views} views · ${point.visits} visits · ${point.checks} checks`}>
                        <div className="flex-1 rounded-t bg-accent" style={{ height: `${(point.views / maxSeries) * 100}%` }} />
                        <div className="flex-1 rounded-t bg-accent/40" style={{ height: `${(point.visits / maxSeries) * 100}%` }} />
                        <div className="flex-1 rounded-t bg-warning" style={{ height: `${(point.checks / maxSeries) * 100}%` }} />
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted">
                    <span>{series[0]?.day} → {series.at(-1)?.day}</span>
                    <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="inline-block size-2.5 rounded-sm bg-accent" />page views</span>
                    <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="inline-block size-2.5 rounded-sm bg-accent/40" />visits</span>
                    <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="inline-block size-2.5 rounded-sm bg-warning" />code checks</span>
                  </p>
                </div>
              </Panel>
            </div>
            <Panel title="Top entry pages" hint="Where sessions begin — the first page view of each visit.">
              <BarList rows={entryPages(activityWindow, 8)} empty="No visits recorded in this window." />
            </Panel>
            <Panel title="Most viewed pages" hint="Merged across locales.">
              <BarList rows={topPages(activityWindow, 8)} empty="No page views recorded in this window." />
            </Panel>
            <div className="lg:col-span-2">
              <Panel title="Brand pages that convert" hint={`Page views against codes checked on that page. A page can rank, be read, and still never get a code typed into it.${unattributed ? ` ${unattributed} check${unattributed === 1 ? "" : "s"} in this window carry no referring page and are excluded.` : ""}`}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-fg-muted"><tr><th className="p-3">Brand</th><th className="p-3">Views</th><th className="p-3">Checks</th><th className="p-3">Decoded</th><th className="p-3">Checks per 100 views</th></tr></thead>
                    <tbody>
                      {funnel.slice(0, 12).map((row) => (
                        <tr key={row.slug} className="border-t">
                          <td className="p-3 font-semibold">{brandName(row.slug)}</td>
                          <td className="p-3 tabular-nums">{row.views}</td>
                          <td className="p-3 tabular-nums">{row.checks}</td>
                          <td className="p-3 tabular-nums">{row.decoded}</td>
                          <td className="p-3 font-semibold tabular-nums">{row.conversion === null ? "—" : `${row.conversion.toFixed(0)}`}</td>
                        </tr>
                      ))}
                      {funnel.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-fg-muted">No brand traffic in this window.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>
          </div>
        )}

        {view === "checks" && (
          <>
          {/* Every control carries the others, so filters narrow rather than
              replace each other. */}
          <nav aria-label="Filter checks by result" className="mb-3 flex flex-wrap gap-2">
            {RESULTS.map((key) => (
              <Link
                key={key}
                href={href("checks", { ...(key === "all" ? {} : { result: key }), ...keepFilters({ result: true }) })}
                aria-current={resultFilter === key ? "true" : undefined}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${resultFilter === key ? "border-accent bg-accent text-white" : "bg-card"}`}
              >
                {resultLabels[key]} ({resultCounts[key]})
              </Link>
            ))}
          </nav>
          <form method="get" action="/review/dashboard" className="mb-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="view" value="checks" />
            {resultFilter !== "all" && <input type="hidden" name="result" value={resultFilter} />}
            {query.q && <input type="hidden" name="q" value={query.q} />}
            <label className="text-sm font-semibold">
              Brand
              <select name="brand" defaultValue={brandFilter} className="mt-1 block min-h-11 rounded-lg border bg-card px-3 font-normal">
                <option value="">All brands</option>
                {checkBrands.map((slug) => <option key={slug} value={slug}>{brandName(slug)}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Country
              <select name="country" defaultValue={countryFilter} className="mt-1 block min-h-11 rounded-lg border bg-card px-3 font-normal">
                <option value="">All countries</option>
                {checkCountries.map((code) => <option key={code} value={code}>{code}</option>)}
              </select>
            </label>
            <button className="min-h-11 rounded-lg bg-cta px-5 font-semibold text-cta-fg">Apply</button>
            {(brandFilter || countryFilter) && (
              <Link href={href("checks", { ...(resultFilter === "all" ? {} : { result: resultFilter }), ...(query.q ? { q: query.q } : {}) })} className="min-h-11 self-center text-sm underline">
                Clear
              </Link>
            )}
          </form>
          <Panel title="Code checks" hint={`Every code users typed, newest first. Showing ${shownChecks.length} of ${matchedChecks.length} ${resultFilter === "all" && !search ? "recent" : "matching"} requests${matchedChecks.length > shownChecks.length ? " — narrow the filter or search to see the rest" : ""}. IP addresses and user emails are not logged.`}>
            {shownChecks.length === 0 ? <p className="p-8 text-center text-fg-muted">No check records are available.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-left text-sm">
                  <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-fg-muted"><tr><th className="p-3">Time</th><th className="p-3">Brand</th><th className="p-3">Code</th><th className="p-3">Locale</th><th className="p-3">Country</th><th className="p-3">Result</th><th className="p-3">Manufactured</th></tr></thead>
                  <tbody>{shownChecks.map((check, index) => <tr key={`${check.ts}-${index}`} className="border-t"><td className="whitespace-nowrap p-3">{new Date(check.ts).toLocaleString("en-GB", { timeZone: REPORT_TIME_ZONE })}</td><td className="p-3 font-semibold">{brandName(check.brand)}</td><td className="p-3 font-mono">{check.code}{attemptsFor(check) > 1 && <span aria-label={`${attemptsFor(check)} attempts for this normalized code`} title="Times this code was tried, counted as the decoder reads it" className="ml-2 rounded-full bg-warning-bg px-2 py-0.5 text-xs font-semibold text-warning">×{attemptsFor(check)}</span>}</td><td className="p-3">{check.locale ?? "—"}</td><td className="p-3">{check.country ?? "—"}</td><td className="p-3">{check.confidence} / {check.freshness}</td><td className="p-3">{check.mfg ?? <CheckDiagnosis brand={check.brand} code={check.code} />}</td></tr>)}</tbody>
                </table>
              </div>
            )}
          </Panel>
          </>
        )}

        {view === "traffic" && (
          <div className="grid gap-5 lg:grid-cols-2 [&>*]:min-w-0">
            <Panel title="Entry pages" hint="Every landing page in the window."><BarList rows={entryPages(activityWindow, 25)} empty="No visits recorded." /></Panel>
            <Panel title="All pages by views"><BarList rows={topPages(activityWindow, 25)} empty="No page views recorded." /></Panel>
            <Panel title="Locale" hint="From the page the visitor was on."><BarList rows={localeSplit(activityWindow, 15)} empty="No activity recorded." /></Panel>
            <Panel title="Country" hint="Coarse edge data, recorded only on code checks."><BarList rows={countrySplit(checksWindow, 15)} empty="No checks recorded." /></Panel>
          </div>
        )}

        {view === "decoders" && (
          <div className="space-y-5">
            <Panel title="Decoder health" hint={`Per brand, over ${win.label.toLowerCase()}. A high no-read rate means users are being turned away.`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-fg-muted"><tr><th className="p-3">Brand</th><th className="p-3">Decoder</th><th className="p-3">Decoder checks</th><th className="p-3">No read</th><th className="p-3">No-read rate</th><th className="p-3">7d trend</th><th className="p-3">Failures</th><th className="p-3">Product IDs</th></tr></thead>
                  <tbody>
                    {health.filter((row) => row.checks > 0).slice(0, 40).map((row) => (
                      <tr key={row.slug} className="border-t">
                        {/* Straight to this brand's own queries: reading a fail
                            rate always leads to "which codes were those?". */}
                        <td className="p-3 font-semibold">
                          <Link href={href("checks", { q: row.slug })} className="underline decoration-dotted underline-offset-2">
                            {brandName(row.slug)}
                          </Link>
                        </td>
                        <td className="p-3 font-mono text-xs text-fg-muted">{row.decoderId ?? "none"}</td>
                        <td className="p-3 tabular-nums">{row.checks}</td>
                        <td className="p-3 tabular-nums">{row.undecoded}</td>
                        <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.failRate >= 50 ? "bg-danger-bg text-danger" : row.failRate >= 20 ? "bg-warning-bg text-warning" : "bg-success-bg text-success"}`}>{row.failRate.toFixed(0)}%</span></td>
                        <td className="p-3 text-xs tabular-nums">{(() => {
                          const swing = healthTrend.get(row.slug);
                          // Too few checks either side is not a trend, and a
                          // swing drawn from two rows would read as a signal.
                          if (swing === null || swing === undefined) return <span className="text-fg-muted">too few</span>;
                          const points = Math.round(swing);
                          if (points === 0) return <span className="text-fg-muted">flat</span>;
                          return <span className={points > 0 ? "font-semibold text-danger" : "font-semibold text-success"}>{points > 0 ? "+" : ""}{points} pts</span>;
                        })()}</td>
                        <td className="p-3 tabular-nums">{row.failures}</td>
                        <td className="p-3 tabular-nums">{row.nonBatch}</td>
                      </tr>
                    ))}
                    {health.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-fg-muted">No checks in this window.</td></tr>}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Decoded manufacture years" hint="A gap followed by an old cluster is the signature of a cyclic year wheel resolving to the wrong turn.">
              <BarList rows={years} empty="No decoded dates in this window." />
            </Panel>

            <div className="space-y-5">
              <h2 className="text-xl font-bold">Failed-code queue ({failedFiltered.length})</h2>
              {failedGroups.length === 0 ? (
                <section className="rounded-2xl border bg-card p-10 text-center shadow-sm">
                  <h3 className="text-lg font-semibold">No failed codes found</h3>
                  <p className="mt-1 text-sm text-fg-muted">New unresolved batch-code shapes will appear here automatically.</p>
                </section>
              ) : failedGroups.map(([brandSlug, rows]) => (
                <section key={brandSlug} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="flex items-end justify-between border-b p-5">
                    <div>
                      <h3 className="text-lg font-bold">
                        <Link href={href("checks", { q: brandSlug })} className="underline decoration-dotted underline-offset-2">
                          {brandName(brandSlug)}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-fg-muted">{rows.size} distinct codes · {Array.from(rows.values()).reduce((sum, row) => sum + row.count, 0)} attempts</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-fg-muted"><tr><th className="p-3">Code</th><th className="p-3">Types</th><th className="p-3">Attempts</th><th className="p-3">Spellings tried</th><th className="p-3">Latest</th><th className="p-3">Locales</th><th className="p-3">Countries</th></tr></thead>
                      <tbody>{Array.from(rows.values()).sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest)).map((row) => <tr key={canonicalCode(row.code)} className="border-t"><td className="p-3 font-mono font-semibold"><Link href={href("checks", { q: row.code })} className="underline decoration-dotted underline-offset-2">{row.code}</Link></td><td className="p-3"><div className="flex flex-wrap gap-1">{Array.from(row.reasons).sort(([a], [b]) => a.localeCompare(b)).map(([reason, count]) => <span key={reason} className="rounded-full bg-warning-bg px-2.5 py-1 text-xs font-semibold text-warning">{reason} ({count})</span>)}</div></td><td className="p-3 font-bold tabular-nums">{row.count}</td><td className="p-3">{row.variants.size > 1 ? <span title={Array.from(row.variants).join(" · ")} className="font-mono text-xs">{row.variants.size} variants</span> : <span className="text-fg-muted">—</span>}</td><td className="whitespace-nowrap p-3">{new Date(row.latest).toLocaleString("en-GB", { timeZone: "Europe/Istanbul" })}</td><td className="p-3">{Array.from(row.locales).join(", ") || "—"}</td><td className="p-3">{Array.from(row.countries).join(", ") || "—"}</td></tr>)}</tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>

            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold">Product-identification candidates ({nonBatchFiltered.length})</h2>
                <p className="mt-1 text-sm text-fg-muted">Retained EAN/UPC/GTIN and sourced product references. These do not count as decoder failures.</p>
              </div>
              {nonBatchFiltered.length === 0 ? (
                <section className="rounded-2xl border bg-card p-10 text-center shadow-sm text-fg-muted">No product identifiers in this window.</section>
              ) : (
                <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-sm">
                      <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-fg-muted"><tr><th className="p-3">Brand</th><th className="p-3">Identifier</th><th className="p-3">Kind</th><th className="p-3">Latest</th><th className="p-3">Country</th></tr></thead>
                      <tbody>{nonBatchFiltered.slice(0, 500).map((item) => <tr key={`${item.ts}:${item.brand}:${item.code}`} className="border-t"><td className="p-3 font-semibold">{brandName(item.brand)}</td><td className="p-3 font-mono"><Link href={href("checks", { q: item.code })} className="underline decoration-dotted underline-offset-2">{item.code}</Link></td><td className="p-3"><span className="rounded-full bg-bg-subtle px-2.5 py-1 text-xs font-semibold">{item.kind ?? item.reason}</span></td><td className="whitespace-nowrap p-3">{new Date(item.ts).toLocaleString("en-GB", { timeZone: "Europe/Istanbul" })}</td><td className="p-3">{item.country ?? "—"}</td></tr>)}</tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>
          </div>
        )}

        {view === "submissions" && (
          <>
            <nav aria-label="Submission status" className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {REVIEW_STATUSES.map((status) => {
                const count = all.filter((item) => item.status === status).length;
                const active = status === selectedStatus;
                return <Link key={status} href={href("submissions", { status, ...(query.q ? { q: query.q } : {}) })} aria-current={active ? "page" : undefined} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${active ? "border-accent bg-accent text-white" : "bg-card"}`}>{statusLabels[status]} ({count})</Link>;
              })}
            </nav>

            {submissions.length === 0 ? (
              <section className="rounded-2xl border bg-card p-10 text-center shadow-sm">
                <h2 className="text-lg font-semibold">No submissions here</h2>
                <p className="mt-1 text-sm text-fg-muted">Choose another status to review its queue.</p>
              </section>
            ) : (
              <div className="space-y-6">
                {submissions.map((submission) => {
                  const brand = getBrand(submission.brand);
                  return (
                    <article key={submission.id} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                      <div className="grid gap-0 lg:grid-cols-[minmax(280px,0.8fr)_1.2fr]">
                        <div className="grid min-h-72 gap-3 bg-black/5 p-3">
                          {(submission.files?.length ? submission.files : [submission.file]).map((_, index) => (
                            <SubmissionPhoto
                              key={index}
                              index={index}
                              src={`/review/api/images/${encodeURIComponent(submission.id)}?index=${index}`}
                              alt={`Submitted batch code photo ${index + 1} for ${brand?.name ?? submission.brand}`}
                            />
                          ))}
                        </div>
                        <div className="p-5 sm:p-6">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div><h2 className="text-xl font-bold">{brand?.name ?? submission.brand}</h2><p className="mt-1 break-all text-xs text-fg-muted">{submission.id}</p></div>
                            <span className="rounded-full bg-bg-subtle px-3 py-1 text-xs font-semibold">{statusLabels[submission.status]}</span>
                          </div>
                          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <dt className="font-semibold text-fg-muted">Visible code</dt>
                              <dd className="mt-1 font-mono text-base">{submission.code || "Not supplied"}</dd>
                              {(() => {
                                const preview = previewDecode(submission.brand, submission.code ?? "");
                                if (!preview) return null;
                                return (
                                  <dd className="mt-2 rounded-lg border bg-bg-subtle p-3 text-sm">
                                    <p className="font-semibold">
                                      {preview.decoded
                                        ? `Decoder reads this as ${preview.manufactureDate?.toISOString().slice(0, 10)} (${preview.confidence} confidence)`
                                        : `Decoder cannot read this code (${preview.failureReason ?? "unresolved"})`}
                                    </p>
                                    {preview.method && <p className="mt-1 text-fg-muted">{preview.method}</p>}
                                    {preview.notes.length > 0 && (
                                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-fg-muted">
                                        {preview.notes.map((note) => <li key={note}>{note}</li>)}
                                      </ul>
                                    )}
                                  </dd>
                                );
                              })()}
                            </div>
                            <div><dt className="font-semibold text-fg-muted">Submitted</dt><dd className="mt-1">{new Date(submission.ts).toLocaleString("en-GB", { timeZone: "Europe/Istanbul" })}</dd></div>
                            <div><dt className="font-semibold text-fg-muted">Product name</dt><dd className="mt-1">{submission.productName || "Not supplied"}</dd></div>
                            <div><dt className="font-semibold text-fg-muted">EAN/GTIN</dt><dd className="mt-1">{submission.ean || "Not supplied"}</dd></div>
                            <div><dt className="font-semibold text-fg-muted">Observed PAO</dt><dd className="mt-1">{submission.observedPao || "Not supplied"}</dd></div>
                            <div className="sm:col-span-2"><dt className="font-semibold text-fg-muted">User note</dt><dd className="mt-1 whitespace-pre-wrap">{submission.note || "Not supplied"}</dd></div>
                            <div><dt className="font-semibold text-fg-muted">Reply email</dt><dd className="mt-1 break-all">{submission.email ? <a className="underline" href={`mailto:${submission.email}`}>{submission.email}</a> : "Anonymous — no email collected"}</dd></div>
                            <div><dt className="font-semibold text-fg-muted">Reply delivery</dt><dd className="mt-1">{!submission.email ? "Not applicable" : submission.replyStatus === "sent" ? "Accepted by email provider" : submission.replyStatus === "failed" ? "Failed" : "Not sent yet"}</dd></div>
                            <div><dt className="font-semibold text-fg-muted">Reviewer notification</dt><dd className="mt-1">{submission.notificationStatus === "sent" ? "Accepted by email provider" : submission.notificationStatus === "failed" ? `Failed${submission.notificationReason ? ` (${submission.notificationReason})` : ""}` : submission.notificationStatus === "not_configured" ? "Not configured" : "No delivery record"}</dd></div>
                          </dl>

                          <form action={`/review/api/submissions/${encodeURIComponent(submission.id)}`} method="post" className="mt-6 flex flex-wrap items-end gap-3 rounded-xl bg-bg-subtle p-4">
                            <input type="hidden" name="intent" value="status" />
                            <label className="min-w-48 flex-1 text-sm font-semibold">Workflow status<select name="status" defaultValue={submission.status} className="mt-1 min-h-11 w-full rounded-lg border bg-card px-3 font-normal">{REVIEW_STATUSES.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
                            <label className="min-w-48 flex-[2] text-sm font-semibold">Internal note<input name="note" maxLength={300} defaultValue={submission.reviewNote} className="mt-1 min-h-11 w-full rounded-lg border bg-card px-3 font-normal" /></label>
                            <button className="min-h-11 rounded-lg bg-cta px-5 font-semibold text-cta-fg">Save status</button>
                          </form>

                          {submission.email && <details className="mt-4 rounded-xl border p-4">
                            <summary className="cursor-pointer font-semibold">Prepare an English reply</summary>
                            <p className="mt-2 text-xs text-fg-muted">The institutional signature is added automatically. Sending records the message and updates the workflow.</p>
                            <div className="mt-4">
                              <ReplyComposer
                                action={`/review/api/submissions/${encodeURIComponent(submission.id)}`}
                                templates={REPLY_TEMPLATES}
                              />
                            </div>
                          </details>}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
