import type { Metadata } from "next";
import Link from "next/link";
import { Activity, AlertTriangle, Download, Eye, Inbox, LogIn, Search, Users } from "lucide-react";
import { getBrand } from "@/lib/brands";
import { canonicalCode } from "@/lib/decoder";
import { readChecksSince, readRecentActivity, readRecentFailedCodes } from "@/lib/dataset";
import { requireReviewer } from "@/lib/review-auth";
import { REPLY_TEMPLATES } from "@/lib/reviewer-reply";
import { listSubmissions, REVIEW_STATUSES } from "@/lib/submission-store";
import {
  brandFunnel,
  countrySplit,
  dailySeries,
  decoderHealth,
  entryPages,
  localeSplit,
  manufactureYears,
  REPORT_TIME_ZONE,
  topPages,
  unattributedChecks,
  type PathStat,
} from "@/lib/review-metrics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Submission Review | Cosmetics Batch",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

/** Days of history the traffic and decoder reports cover. */
const REPORT_DAYS = 30;

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
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
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

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ view?: string; status?: string; q?: string; updated?: string; error?: string }> }) {
  const reviewer = await requireReviewer();
  const query = await searchParams;
  const requested = query.view ? (LEGACY_VIEWS[query.view] ?? query.view) : "overview";
  const view: View = VIEWS.includes(requested as View) ? (requested as View) : "overview";
  const selectedStatus = REVIEW_STATUSES.includes(query.status as never) ? query.status : "pending";
  const search = query.q?.trim().toLowerCase() ?? "";

  const now = await dashboardTimestamp();
  const since = (days: number) => new Date(now - days * 86_400_000).toISOString();
  const window7d = since(7);
  const windowReport = since(REPORT_DAYS);

  const all = await listSubmissions();
  const submissions = all.filter((item) => item.status === selectedStatus && (!search || [item.id, item.brand, item.code, item.email, item.note].some((value) => value?.toLowerCase().includes(search))));
  const open = all.filter((item) => item.status === "pending" || item.status === "in_review").length;

  // Load only what the open tab renders. The summary tiles live on Overview
  // alone, so the other tabs no longer pay to read logs they never show.
  const needsActivity = view === "overview" || view === "traffic";
  const needsChecks = view === "overview" || view === "checks" || view === "traffic" || view === "decoders";
  const needsFailed = view === "overview" || view === "decoders";
  const [activity, checks, failedCodes] = await Promise.all([
    needsActivity ? readRecentActivity(50_000, windowReport) : Promise.resolve([]),
    needsChecks ? readChecksSince(windowReport) : Promise.resolve([]),
    needsFailed ? readRecentFailedCodes(5_000) : Promise.resolve([]),
  ]);

  const visits7d = activity.filter((row) => row.type === "visit" && row.ts >= window7d).length;
  const views7d = activity.filter((row) => row.type === "page_view" && row.ts >= window7d).length;
  const checks7d = checks.filter((row) => row.ts >= window7d).length;
  const failed7d = failedCodes.filter((row) => row.ts >= window7d).length;
  const decoded7d = checks.filter((row) => row.ts >= window7d && row.mfg).length;
  const readRate = checks7d ? Math.round((decoded7d / checks7d) * 100) : null;

  const series = dailySeries(activity, checks, failedCodes.filter((row) => row.ts >= windowReport), REPORT_DAYS, now);
  const funnel = brandFunnel(activity, checks);
  const unattributed = unattributedChecks(checks);
  const health = decoderHealth(checks, failedCodes.filter((row) => row.ts >= windowReport));
  const years = manufactureYears(checks);

  const matchedChecks = checks.filter((item) => !search || [item.brand, item.code, item.locale, item.country, item.mfg].some((value) => value?.toLowerCase().includes(search)));
  const shownChecks = matchedChecks.slice(0, 500);

  const failedFiltered = failedCodes.filter((item) => !search || [item.brand, item.code, item.reason, item.locale, item.country].some((value) => value?.toLowerCase().includes(search)));
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

  const brandName = (slug: string) => getBrand(slug)?.name ?? slug;
  const maxSeries = Math.max(1, ...series.map((point) => Math.max(point.views, point.visits, point.checks)));

  // A div rather than a <main>: the root layout already supplies the page's
  // main landmark, and nesting a second one is invalid HTML.
  return (
    <div className="min-h-screen bg-bg-subtle px-4 py-8 text-fg sm:px-6">
      <div className="site-frame !px-0">
        <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">Private workspace</p>
            <h1 className="text-3xl font-bold tracking-tight">Owner dashboard</h1>
            <p className="mt-1 text-sm text-fg-muted">Signed in as {reviewer.email}</p>
          </div>
          <Link href="/cdn-cgi/access/logout" prefetch={false} className="text-sm font-medium text-fg-muted underline">Sign out</Link>
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

        {view === "overview" && (
          <>
        <section aria-label="Last 7 days" className="mb-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { label: "Visits", value: visits7d, icon: Users },
            { label: "Page views", value: views7d, icon: Eye },
            { label: "Entry pages", value: entryPages(activity.filter((row) => row.ts >= window7d)).length, icon: LogIn },
            { label: "Code checks", value: checks7d, icon: Activity },
            { label: "Read rate", value: readRate === null ? "—" : `${readRate}%`, icon: Activity },
            { label: "Failed codes", value: failed7d, icon: AlertTriangle },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-fg-muted">{label}</p>
                <Icon aria-hidden="true" className="size-5 text-accent" />
              </div>
              <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
            </div>
          ))}
        </section>
        <p className="mb-6 text-xs text-fg-muted">Last 7 days. Reports below cover {REPORT_DAYS} days, bucketed by {REPORT_TIME_ZONE} calendar day. Approximate visits are anonymous browser sessions, not verified unique people. No IP, cookie identifier, email or query string is stored — so time on page, navigation paths and traffic sources are not available here.</p>
          </>
        )}

        <nav aria-label="Dashboard sections" className="mb-5 flex flex-wrap gap-2 border-b pb-4">
          {VIEWS.map((key) => (
            <Link key={key} href={href(key, query.q ? { q: query.q } : {})} aria-current={view === key ? "page" : undefined} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === key ? "bg-cta text-cta-fg" : "bg-card"}`}>
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
              <label className="relative flex-1">
                <span className="sr-only">Search review data</span>
                <Search aria-hidden="true" className="absolute left-3 top-3 size-5 text-fg-muted" />
                <input name="q" defaultValue={query.q} placeholder={view === "submissions" ? "Search ID, brand, code, email or note" : "Search brand, code, type, locale or country"} className="min-h-11 w-full rounded-xl border bg-bg pl-10 pr-3" />
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
          <div className="grid gap-5 lg:grid-cols-2">
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
              <Panel title={`Daily traffic · ${REPORT_DAYS} days`} hint="Page views, visits and code checks, one column per day.">
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
              <BarList rows={entryPages(activity, 8)} empty="No visits recorded in this window." />
            </Panel>
            <Panel title="Most viewed pages" hint="Merged across locales.">
              <BarList rows={topPages(activity, 8)} empty="No page views recorded in this window." />
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
          <Panel title="Code checks" hint={`Every code users typed, newest first. Showing ${shownChecks.length} of ${matchedChecks.length} ${search ? "matching" : "recent"} requests${matchedChecks.length > shownChecks.length ? " — refine the search to see the rest" : ""}. IP addresses and user emails are not logged.`}>
            {shownChecks.length === 0 ? <p className="p-8 text-center text-fg-muted">No check records are available.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-left text-sm">
                  <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-fg-muted"><tr><th className="p-3">Time</th><th className="p-3">Brand</th><th className="p-3">Code</th><th className="p-3">Locale</th><th className="p-3">Country</th><th className="p-3">Result</th><th className="p-3">Manufactured</th></tr></thead>
                  <tbody>{shownChecks.map((check, index) => <tr key={`${check.ts}-${index}`} className="border-t"><td className="whitespace-nowrap p-3">{new Date(check.ts).toLocaleString("en-GB", { timeZone: REPORT_TIME_ZONE })}</td><td className="p-3 font-semibold">{brandName(check.brand)}</td><td className="p-3 font-mono">{check.code}</td><td className="p-3">{check.locale ?? "—"}</td><td className="p-3">{check.country ?? "—"}</td><td className="p-3">{check.confidence} / {check.freshness}</td><td className="p-3">{check.mfg ?? "Not decoded"}</td></tr>)}</tbody>
                </table>
              </div>
            )}
          </Panel>
        )}

        {view === "traffic" && (
          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Entry pages" hint="Every landing page in the window."><BarList rows={entryPages(activity, 25)} empty="No visits recorded." /></Panel>
            <Panel title="All pages by views"><BarList rows={topPages(activity, 25)} empty="No page views recorded." /></Panel>
            <Panel title="Locale" hint="From the page the visitor was on."><BarList rows={localeSplit(activity, 15)} empty="No activity recorded." /></Panel>
            <Panel title="Country" hint="Coarse edge data, recorded only on code checks."><BarList rows={countrySplit(checks, 15)} empty="No checks recorded." /></Panel>
          </div>
        )}

        {view === "decoders" && (
          <div className="space-y-5">
            <Panel title="Decoder health" hint={`Per brand, over ${REPORT_DAYS} days. A high no-read rate means users are being turned away.`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-fg-muted"><tr><th className="p-3">Brand</th><th className="p-3">Decoder</th><th className="p-3">Checks</th><th className="p-3">No read</th><th className="p-3">No-read rate</th><th className="p-3">Logged failures</th></tr></thead>
                  <tbody>
                    {health.filter((row) => row.checks > 0).slice(0, 40).map((row) => (
                      <tr key={row.slug} className="border-t">
                        <td className="p-3 font-semibold">{brandName(row.slug)}</td>
                        <td className="p-3 font-mono text-xs text-fg-muted">{row.decoderId ?? "none"}</td>
                        <td className="p-3 tabular-nums">{row.checks}</td>
                        <td className="p-3 tabular-nums">{row.undecoded}</td>
                        <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.failRate >= 50 ? "bg-danger-bg text-danger" : row.failRate >= 20 ? "bg-warning-bg text-warning" : "bg-success-bg text-success"}`}>{row.failRate.toFixed(0)}%</span></td>
                        <td className="p-3 tabular-nums">{row.failures}</td>
                      </tr>
                    ))}
                    {health.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-fg-muted">No checks in this window.</td></tr>}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Decoded manufacture years" hint="A gap followed by an old cluster is the signature of a cyclic year wheel resolving to the wrong turn.">
              <BarList rows={years} empty="No decoded dates in this window." />
            </Panel>

            <div className="space-y-5">
              <h2 className="text-xl font-bold">Failed-code queue ({failedCodes.length})</h2>
              {failedGroups.length === 0 ? (
                <section className="rounded-2xl border bg-card p-10 text-center shadow-sm">
                  <h3 className="text-lg font-semibold">No failed codes found</h3>
                  <p className="mt-1 text-sm text-fg-muted">New unresolved codes and retail barcodes will appear here automatically.</p>
                </section>
              ) : failedGroups.map(([brandSlug, rows]) => (
                <section key={brandSlug} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="flex items-end justify-between border-b p-5">
                    <div>
                      <h3 className="text-lg font-bold">{brandName(brandSlug)}</h3>
                      <p className="mt-1 text-sm text-fg-muted">{rows.size} distinct codes · {Array.from(rows.values()).reduce((sum, row) => sum + row.count, 0)} attempts</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-fg-muted"><tr><th className="p-3">Code</th><th className="p-3">Types</th><th className="p-3">Attempts</th><th className="p-3">Spellings tried</th><th className="p-3">Latest</th><th className="p-3">Locales</th><th className="p-3">Countries</th></tr></thead>
                      <tbody>{Array.from(rows.values()).sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest)).map((row) => <tr key={canonicalCode(row.code)} className="border-t"><td className="p-3 font-mono font-semibold">{row.code}</td><td className="p-3"><div className="flex flex-wrap gap-1">{Array.from(row.reasons).sort(([a], [b]) => a.localeCompare(b)).map(([reason, count]) => <span key={reason} className="rounded-full bg-warning-bg px-2.5 py-1 text-xs font-semibold text-warning">{reason} ({count})</span>)}</div></td><td className="p-3 font-bold tabular-nums">{row.count}</td><td className="p-3">{row.variants.size > 1 ? <span title={Array.from(row.variants).join(" · ")} className="font-mono text-xs">{row.variants.size} variants</span> : <span className="text-fg-muted">—</span>}</td><td className="whitespace-nowrap p-3">{new Date(row.latest).toLocaleString("en-GB", { timeZone: "Europe/Istanbul" })}</td><td className="p-3">{Array.from(row.locales).join(", ") || "—"}</td><td className="p-3">{Array.from(row.countries).join(", ") || "—"}</td></tr>)}</tbody>
                    </table>
                  </div>
                </section>
              ))}
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
                        <div className="grid min-h-72 gap-2 bg-black/5 p-3">
                          {(submission.files?.length ? submission.files : [submission.file]).map((_, index) => <a key={index} href={`/review/api/images/${encodeURIComponent(submission.id)}?index=${index}`} target="_blank" rel="noreferrer" className="flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`/review/api/images/${encodeURIComponent(submission.id)}?index=${index}`} alt={`Submitted batch code photo ${index + 1} for ${brand?.name ?? submission.brand}`} className="max-h-[24rem] w-full object-contain" />
                          </a>)}
                        </div>
                        <div className="p-5 sm:p-6">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div><h2 className="text-xl font-bold">{brand?.name ?? submission.brand}</h2><p className="mt-1 break-all text-xs text-fg-muted">{submission.id}</p></div>
                            <span className="rounded-full bg-bg-subtle px-3 py-1 text-xs font-semibold">{statusLabels[submission.status]}</span>
                          </div>
                          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                            <div><dt className="font-semibold text-fg-muted">Visible code</dt><dd className="mt-1 font-mono text-base">{submission.code || "Not supplied"}</dd></div>
                            <div><dt className="font-semibold text-fg-muted">Submitted</dt><dd className="mt-1">{new Date(submission.ts).toLocaleString("en-GB", { timeZone: "Europe/Istanbul" })}</dd></div>
                            <div className="sm:col-span-2"><dt className="font-semibold text-fg-muted">User note</dt><dd className="mt-1 whitespace-pre-wrap">{submission.note || "Not supplied"}</dd></div>
                            <div><dt className="font-semibold text-fg-muted">Reply email</dt><dd className="mt-1 break-all"><a className="underline" href={`mailto:${submission.email}`}>{submission.email}</a></dd></div>
                            <div><dt className="font-semibold text-fg-muted">Reply delivery</dt><dd className="mt-1">{submission.replyStatus === "sent" ? "Accepted by email provider" : submission.replyStatus === "failed" ? "Failed" : "Not sent yet"}</dd></div>
                            <div><dt className="font-semibold text-fg-muted">Reviewer notification</dt><dd className="mt-1">{submission.notificationStatus === "sent" ? "Accepted by email provider" : submission.notificationStatus === "failed" ? `Failed${submission.notificationReason ? ` (${submission.notificationReason})` : ""}` : submission.notificationStatus === "not_configured" ? "Not configured" : "No delivery record"}</dd></div>
                          </dl>

                          <form action={`/review/api/submissions/${encodeURIComponent(submission.id)}`} method="post" className="mt-6 flex flex-wrap items-end gap-3 rounded-xl bg-bg-subtle p-4">
                            <input type="hidden" name="intent" value="status" />
                            <label className="min-w-48 flex-1 text-sm font-semibold">Workflow status<select name="status" defaultValue={submission.status} className="mt-1 min-h-11 w-full rounded-lg border bg-card px-3 font-normal">{REVIEW_STATUSES.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
                            <label className="min-w-48 flex-[2] text-sm font-semibold">Internal note<input name="note" maxLength={300} defaultValue={submission.reviewNote} className="mt-1 min-h-11 w-full rounded-lg border bg-card px-3 font-normal" /></label>
                            <button className="min-h-11 rounded-lg bg-cta px-5 font-semibold text-cta-fg">Save status</button>
                          </form>

                          <details className="mt-4 rounded-xl border p-4">
                            <summary className="cursor-pointer font-semibold">Prepare an English reply</summary>
                            <p className="mt-2 text-xs text-fg-muted">The institutional signature is added automatically. Sending records the message and updates the workflow.</p>
                            <div className="mt-4 space-y-5">
                              {Object.entries(REPLY_TEMPLATES).map(([key, template]) => (
                                <form key={key} action={`/review/api/submissions/${encodeURIComponent(submission.id)}`} method="post" className="rounded-xl bg-bg-subtle p-4">
                                  <input type="hidden" name="intent" value="reply" /><input type="hidden" name="template" value={key} />
                                  <h3 className="font-semibold">{template.label}</h3>
                                  <label className="mt-3 block text-sm font-semibold">Subject<input required name="subject" maxLength={160} defaultValue={template.subject} className="mt-1 min-h-11 w-full rounded-lg border bg-card px-3 font-normal" /></label>
                                  <label className="mt-3 block text-sm font-semibold">Message<textarea required name="message" maxLength={4000} defaultValue={template.body} rows={7} className="mt-1 w-full rounded-lg border bg-card p-3 font-normal" /></label>
                                  <button className="mt-3 min-h-11 rounded-lg bg-accent px-5 font-semibold text-white">Send reply</button>
                                </form>
                              ))}
                            </div>
                          </details>
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
