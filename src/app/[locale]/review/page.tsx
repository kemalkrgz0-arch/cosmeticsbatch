import type { Metadata } from "next";
import Link from "next/link";
import { Activity, AlertTriangle, Clock3, Download, Eye, Inbox, Search, Users } from "lucide-react";
import { getBrand } from "@/lib/brands";
import { readRecentActivity, readRecentChecks, readRecentFailedCodes } from "@/lib/dataset";
import { requireReviewer } from "@/lib/review-auth";
import { REPLY_TEMPLATES } from "@/lib/reviewer-reply";
import { listSubmissions, REVIEW_STATUSES } from "@/lib/submission-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Submission Review | Cosmetics Batch",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

const statusLabels: Record<string, string> = {
  pending: "New",
  in_review: "In review",
  awaiting_user: "Awaiting user",
  completed: "Completed",
  discarded: "Archived",
};

async function dashboardTimestamp() {
  return Date.now();
}

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ view?: string; status?: string; q?: string; updated?: string; error?: string }> }) {
  const reviewer = await requireReviewer();
  const query = await searchParams;
  const selectedStatus = REVIEW_STATUSES.includes(query.status as never) ? query.status : "pending";
  const view = query.view === "checks" || query.view === "failed" ? query.view : "submissions";
  const search = query.q?.trim().toLowerCase() ?? "";
  const all = await listSubmissions();
  const submissions = all.filter((item) => item.status === selectedStatus && (!search || [item.id, item.brand, item.code, item.email, item.note].some((value) => value?.toLowerCase().includes(search))));
  const [recentChecks, failedCodes, activity] = await Promise.all([
    readRecentChecks(1_000),
    readRecentFailedCodes(5_000),
    readRecentActivity(50_000),
  ]);
  const allChecks = view === "checks" ? recentChecks.slice(0, 500) : [];
  const checks = allChecks.filter((item) => !search || [item.brand, item.code, item.locale, item.country, item.mfg].some((value) => value?.toLowerCase().includes(search)));
  const open = all.filter((item) => item.status === "pending" || item.status === "in_review").length;
  const now = await dashboardTimestamp();
  const since = (days: number) => now - days * 86_400_000;
  const visits7d = activity.filter((item) => item.type === "visit" && Date.parse(item.ts) >= since(7)).length;
  const views7d = activity.filter((item) => item.type === "page_view" && Date.parse(item.ts) >= since(7)).length;
  const checks7d = recentChecks.filter((item) => Date.parse(item.ts) >= since(7)).length;
  const failed7d = failedCodes.filter((item) => Date.parse(item.ts) >= since(7)).length;
  const failedFiltered = failedCodes.filter((item) => !search || [item.brand, item.code, item.reason, item.locale, item.country].some((value) => value?.toLowerCase().includes(search)));
  const failedGroups = Array.from(failedFiltered.reduce((brands, item) => {
    const brand = brands.get(item.brand) ?? new Map<string, { code: string; reason: string; count: number; latest: string; locales: Set<string>; countries: Set<string> }>();
    const key = `${item.reason}:${item.code.toUpperCase()}`;
    const row = brand.get(key) ?? { code: item.code, reason: item.reason, count: 0, latest: item.ts, locales: new Set<string>(), countries: new Set<string>() };
    row.count += 1;
    if (item.ts > row.latest) row.latest = item.ts;
    if (item.locale) row.locales.add(item.locale);
    if (item.country) row.countries.add(item.country);
    brand.set(key, row);
    brands.set(item.brand, brand);
    return brands;
  }, new Map<string, Map<string, { code: string; reason: string; count: number; latest: string; locales: Set<string>; countries: Set<string> }>>()).entries()).sort(([a], [b]) => (getBrand(a)?.name ?? a).localeCompare(getBrand(b)?.name ?? b));

  return (
    <main className="min-h-screen bg-bg-subtle px-4 py-8 text-fg sm:px-6">
      <div className="site-frame !px-0">
        <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">Private workspace</p>
            <h1 className="text-3xl font-bold tracking-tight">Photo submission review</h1>
            <p className="mt-1 text-sm text-fg-muted">Signed in as {reviewer.email}</p>
          </div>
          <Link href="/cdn-cgi/access/logout" prefetch={false} className="text-sm font-medium text-fg-muted underline">Sign out</Link>
        </header>

        {query.updated && <p role="status" className="mb-4 rounded-xl bg-success-bg p-3 text-sm text-success">Submission updated successfully.</p>}
        {query.error && <p role="alert" className="mb-4 rounded-xl bg-danger-bg p-3 text-sm text-danger">The update could not be completed. No reply was recorded as sent.</p>}

        <section aria-label="Workspace summary" className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {[
            { label: "Approx. visits · 7d", value: visits7d, icon: Users },
            { label: "Page views · 7d", value: views7d, icon: Eye },
            { label: "Code checks · 7d", value: checks7d, icon: Activity },
            { label: "Failed codes · 7d", value: failed7d, icon: AlertTriangle },
            { label: "Photo forms · all time", value: all.length, icon: Inbox },
            { label: "Open queue", value: open, icon: Clock3 },
          ].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border bg-card p-4 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-medium text-fg-muted">{label}</p><Icon aria-hidden="true" className="size-5 text-accent" /></div><p className="mt-2 text-3xl font-bold">{value}</p></div>)}
        </section>
        <p className="-mt-3 mb-6 text-xs text-fg-muted">Approximate visits are anonymous browser sessions, not verified unique people. No IP, cookie identifier, email or query string is stored.</p>

        <nav aria-label="Review workspace" className="mb-5 flex gap-2 border-b pb-4">
          <Link href="/review/dashboard" aria-current={view === "submissions" ? "page" : undefined} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "submissions" ? "bg-cta text-cta-fg" : "bg-card"}`}>Photo submissions</Link>
          <Link href="/review/dashboard?view=checks" aria-current={view === "checks" ? "page" : undefined} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "checks" ? "bg-cta text-cta-fg" : "bg-card"}`}>Batch-code checks</Link>
          <Link href="/review/dashboard?view=failed" aria-current={view === "failed" ? "page" : undefined} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "failed" ? "bg-cta text-cta-fg" : "bg-card"}`}>Failed-code queue ({failedCodes.length})</Link>
        </nav>

        <section className="mb-5 flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <form method="get" action="/review/dashboard" className="flex flex-1 gap-2">
            <input type="hidden" name="view" value={view} />
            {view === "submissions" && <input type="hidden" name="status" value={selectedStatus} />}
            <label className="relative flex-1"><span className="sr-only">Search review data</span><Search aria-hidden="true" className="absolute left-3 top-3 size-5 text-fg-muted" /><input name="q" defaultValue={query.q} placeholder={view === "submissions" ? "Search ID, brand, code, email or note" : "Search brand, code, type, locale or country"} className="min-h-11 w-full rounded-xl border bg-bg pl-10 pr-3" /></label>
            <button className="min-h-11 rounded-xl bg-cta px-5 font-semibold text-cta-fg">Search</button>
          </form>
          <div className="flex flex-wrap gap-2">
            <a href={`/review/api/export?kind=${view}&format=csv`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border bg-bg px-4 text-sm font-semibold"><Download aria-hidden="true" className="size-4" />CSV</a>
            <a href={`/review/api/export?kind=${view}&format=json`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border bg-bg px-4 text-sm font-semibold"><Download aria-hidden="true" className="size-4" />JSON</a>
          </div>
        </section>

        {view === "submissions" && <nav aria-label="Submission status" className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {REVIEW_STATUSES.map((status) => {
            const count = all.filter((item) => item.status === status).length;
            const active = status === selectedStatus;
            return <Link key={status} href={`/review/dashboard?status=${status}`} aria-current={active ? "page" : undefined} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${active ? "border-accent bg-accent text-white" : "bg-card"}`}>{statusLabels[status]} ({count})</Link>;
          })}
        </nav>}

        {view === "failed" ? (
          <div className="space-y-5">
            {failedGroups.length === 0 ? <section className="rounded-2xl border bg-card p-10 text-center shadow-sm"><h2 className="text-lg font-semibold">No failed codes found</h2><p className="mt-1 text-sm text-fg-muted">New unresolved codes and retail barcodes will appear here automatically.</p></section> : failedGroups.map(([brandSlug, rows]) => (
              <section key={brandSlug} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="flex items-end justify-between border-b p-5"><div><h2 className="text-xl font-bold">{getBrand(brandSlug)?.name ?? brandSlug}</h2><p className="mt-1 text-sm text-fg-muted">{rows.size} distinct codes · {Array.from(rows.values()).reduce((sum, row) => sum + row.count, 0)} attempts</p></div></div>
                <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-bg-subtle text-xs uppercase tracking-wide text-fg-muted"><tr><th className="p-3">Code</th><th className="p-3">Type</th><th className="p-3">Attempts</th><th className="p-3">Latest</th><th className="p-3">Locales</th><th className="p-3">Countries</th></tr></thead><tbody>{Array.from(rows.values()).sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest)).map((row) => <tr key={`${row.reason}:${row.code}`} className="border-t"><td className="p-3 font-mono font-semibold">{row.code}</td><td className="p-3"><span className="rounded-full bg-warning-bg px-2.5 py-1 text-xs font-semibold text-warning">{row.reason}</span></td><td className="p-3 font-bold tabular-nums">{row.count}</td><td className="whitespace-nowrap p-3">{new Date(row.latest).toLocaleString("en-GB", { timeZone: "Europe/Istanbul" })}</td><td className="p-3">{Array.from(row.locales).join(", ") || "—"}</td><td className="p-3">{Array.from(row.countries).join(", ") || "—"}</td></tr>)}</tbody></table></div>
              </section>
            ))}
          </div>
        ) : view === "checks" ? (
          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b p-5"><h2 className="text-xl font-bold">Recent batch-code checks</h2><p className="mt-1 text-sm text-fg-muted">Showing {checks.length} of {allChecks.length} recent successful human requests. IP addresses and user emails are not logged.</p></div>
            {checks.length === 0 ? <p className="p-8 text-center text-fg-muted">No check records are available.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-left text-sm">
                  <thead className="bg-bg-subtle text-xs uppercase tracking-wide text-fg-muted"><tr><th className="p-3">Time</th><th className="p-3">Brand</th><th className="p-3">Code</th><th className="p-3">Locale</th><th className="p-3">Country</th><th className="p-3">Result</th><th className="p-3">Manufactured</th></tr></thead>
                  <tbody>{checks.map((check, index) => <tr key={`${check.ts}-${index}`} className="border-t"><td className="whitespace-nowrap p-3">{new Date(check.ts).toLocaleString("en-GB", { timeZone: "Europe/Istanbul" })}</td><td className="p-3 font-semibold">{getBrand(check.brand)?.name ?? check.brand}</td><td className="p-3 font-mono">{check.code}</td><td className="p-3">{check.locale ?? "—"}</td><td className="p-3">{check.country ?? "—"}</td><td className="p-3">{check.confidence} / {check.freshness}</td><td className="p-3">{check.mfg ?? "Not decoded"}</td></tr>)}</tbody>
                </table>
              </div>
            )}
          </section>
        ) : submissions.length === 0 ? (
          <section className="rounded-2xl border bg-card p-10 text-center shadow-sm"><h2 className="text-lg font-semibold">No submissions here</h2><p className="mt-1 text-sm text-fg-muted">Choose another status to review its queue.</p></section>
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
      </div>
    </main>
  );
}
