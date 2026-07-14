import { NextResponse } from "next/server";
import { requireReviewer } from "@/lib/review-auth";
import { REPLY_TEMPLATES, sendReviewerReply } from "@/lib/reviewer-reply";
import { appendReply, appendReview, getSubmission, REVIEW_STATUSES, type ReviewStatus } from "@/lib/submission-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirect(suffix: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cosmeticsbatch.com";
  return NextResponse.redirect(new URL(`/review/dashboard?${suffix}`, siteUrl), 303);
}

function isSameOriginBrowserRequest(request: Request) {
  const expectedHost = (request.headers.get("x-forwarded-host") ?? request.headers.get("host"))?.split(",")[0]?.trim();
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  if (!expectedHost) return false;
  try {
    if (origin && new URL(origin).host !== expectedHost) return false;
    if (!origin && referer && new URL(referer).host !== expectedHost) return false;
  } catch {
    return false;
  }
  return Boolean(origin || referer) && request.headers.get("sec-fetch-site") === "same-origin";
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let reviewer: { email: string };
  try { reviewer = await requireReviewer(); } catch { return new NextResponse("Forbidden", { status: 403 }); }
  if (!isSameOriginBrowserRequest(request)) return new NextResponse("Forbidden", { status: 403 });

  const { id } = await params;
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");
  try {
    if (intent === "status") {
      const status = String(form.get("status") ?? "") as ReviewStatus;
      if (!REVIEW_STATUSES.includes(status)) throw new Error("Invalid status");
      const note = String(form.get("note") ?? "").trim().slice(0, 300);
      await appendReview(id, status, reviewer.email, note);
      return redirect(`status=${status}&updated=1`);
    }
    if (intent === "reply") {
      const template = String(form.get("template") ?? "");
      if (!(template in REPLY_TEMPLATES)) throw new Error("Invalid template");
      const subject = String(form.get("subject") ?? "").trim().slice(0, 160);
      const message = String(form.get("message") ?? "").trim().slice(0, 4000);
      if (!subject || !message) throw new Error("Reply is empty");
      const submission = await getSubmission(id);
      if (!submission) throw new Error("Submission not found");
      const result = await sendReviewerReply(submission, subject, message);
      await appendReply(id, result.status, reviewer.email, result.status === "sent" ? result.providerId : undefined, result.status === "failed" ? result.reason : undefined);
      if (result.status !== "sent") return redirect(`status=${submission.status}&error=reply`);
      const nextStatus = template === "clearer_photo" ? "awaiting_user" : "completed";
      const outcome = template === "identified" ? "identified" : template === "unverifiable" ? "unverifiable" : undefined;
      await appendReview(id, nextStatus, reviewer.email, `Reply sent: ${REPLY_TEMPLATES[template as keyof typeof REPLY_TEMPLATES].label}`, outcome);
      return redirect(`status=${nextStatus}&updated=1`);
    }
    throw new Error("Invalid action");
  } catch (error) {
    console.error("Review update failed", { id, reason: error instanceof Error ? error.message : "unknown" });
    return redirect("error=update");
  }
}
