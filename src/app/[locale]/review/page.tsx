import type { Metadata } from "next";
import Link from "next/link";
import { getBrand } from "@/lib/brands";
import { readRecentChecks } from "@/lib/dataset";
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

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ view?: string; status?: string; updated?: string; error?: string }> }) {
  const reviewer = await requireReviewer();
  const query = await searchParams;
  const selectedStatus = REVIEW_STATUSES.includes(query.status as never) ? query.status : "pending";
  const view = query.view === "checks" ? "checks" : "submissions";
  const all = await listSubmissions();
  const submissions = all.filter((item) => item.status === selectedStatus);
  const checks = view === "checks" ? await readRecentChecks(500) : [];

  return (
    <main className="min-h-screen bg-bg-subtle px-4 py-8 text-fg sm:px-6">
      <div className="mx-auto max-w-6xl">
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

        <nav aria-label="Review workspace" className="mb-5 flex gap-2 border-b pb-4">
          <Link href="/review" aria-current={view === "submissions" ? "page" : undefined} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "submissions" ? "bg-cta text-cta-fg" : "bg-card"}`}>Photo submissions</Link>
          <Link href="/review?view=checks" aria-current={view === "checks" ? "page" : undefined} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "checks" ? "bg-cta text-cta-fg" : "bg-card"}`}>Batch-code checks</Link>
        </nav>

        {view === "submissions" && <nav aria-label="Submission status" className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {REVIEW_STATUSES.map((status) => {
            const count = all.filter((item) => item.status === status).length;
            const active = status === selectedStatus;
            return <Link key={status} href={`/review?status=${status}`} aria-current={active ? "page" : undefined} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${active ? "border-accent bg-accent text-white" : "bg-card"}`}>{statusLabels[status]} ({count})</Link>;
          })}
        </nav>}

        {view === "checks" ? (
          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b p-5"><h2 className="text-xl font-bold">Recent batch-code checks</h2><p className="mt-1 text-sm text-fg-muted">Newest {checks.length} successful human requests. IP addresses and user emails are not logged.</p></div>
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
                    <a href={`/review/api/images/${encodeURIComponent(submission.id)}`} target="_blank" rel="noreferrer" className="flex min-h-72 items-center justify-center bg-black/5 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/review/api/images/${encodeURIComponent(submission.id)}`} alt={`Submitted batch code for ${brand?.name ?? submission.brand}`} className="max-h-[32rem] w-full object-contain" />
                    </a>
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div><h2 className="text-xl font-bold">{brand?.name ?? submission.brand}</h2><p className="mt-1 break-all text-xs text-fg-muted">{submission.id}</p></div>
                        <span className="rounded-full bg-bg-subtle px-3 py-1 text-xs font-semibold">{statusLabels[submission.status]}</span>
                      </div>
                      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                        <div><dt className="font-semibold text-fg-muted">Visible code</dt><dd className="mt-1 font-mono text-base">{submission.code || "Not supplied"}</dd></div>
                        <div><dt className="font-semibold text-fg-muted">Submitted</dt><dd className="mt-1">{new Date(submission.ts).toLocaleString("en-GB", { timeZone: "Europe/Istanbul" })}</dd></div>
                        <div className="sm:col-span-2"><dt className="font-semibold text-fg-muted">User note</dt><dd className="mt-1 whitespace-pre-wrap">{submission.note || "Not supplied"}</dd></div>
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
