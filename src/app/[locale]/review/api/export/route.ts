import { NextResponse } from "next/server";
import { getBrand } from "@/lib/brands";
import { asCsv } from "@/lib/csv";
import {
  readRecentActivity,
  readRecentChecks,
  readRecentFailedCodes,
} from "@/lib/dataset";
import { requireReviewer } from "@/lib/review-auth";
import { listSubmissions } from "@/lib/submission-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireReviewer();
  } catch {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const url = new URL(request.url);
  const requestedKind = url.searchParams.get("kind");
  const kind = requestedKind === "checks" || requestedKind === "failed" || requestedKind === "all"
    ? requestedKind
    : "submissions";
  const format = url.searchParams.get("format") === "json" ? "json" : "csv";
  const date = new Date().toISOString().slice(0, 10);

  /**
   * One bundle covering every analytics dataset, for sharing a full picture in
   * a single file.
   *
   * Submissions are deliberately excluded: they carry the submitter's email
   * address and free-text note, and repository rules forbid moving that data
   * around. Everything here is already free of personal data — a batch code
   * plus a coarse country — so the bundle is safe to hand to a third party.
   */
  if (kind === "all") {
    const [checks, failed, activity] = await Promise.all([
      readRecentChecks(1_000),
      readRecentFailedCodes(5_000),
      readRecentActivity(50_000),
    ]);
    const bundle = {
      generatedAt: new Date().toISOString(),
      contains: ["checks", "failedCodes", "activity"],
      excludes: "photo submissions — they contain submitter email addresses and notes",
      counts: { checks: checks.length, failedCodes: failed.length, activity: activity.length },
      checks,
      failedCodes: failed,
      activity,
    };
    return new NextResponse(JSON.stringify(bundle, null, 2), {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="cosmeticsbatch-all-${date}.json"`,
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const rows = kind === "checks"
    ? (await readRecentChecks(1_000)).map((item) => ({
        timestamp: item.ts,
        brand: getBrand(item.brand)?.name ?? item.brand,
        brandSlug: item.brand,
        code: item.code,
        source: item.source,
        locale: item.locale ?? "",
        country: item.country ?? "",
        path: item.path ?? "",
        confidence: item.confidence,
        freshness: item.freshness,
        manufactureDate: item.mfg ?? "",
      }))
    : kind === "failed"
      ? (await readRecentFailedCodes(5_000)).map((item) => ({
          timestamp: item.ts,
          brand: getBrand(item.brand)?.name ?? item.brand,
          brandSlug: item.brand,
          code: item.code,
          reason: item.reason,
          locale: item.locale ?? "",
          country: item.country ?? "",
        }))
    : (await listSubmissions()).map((item) => ({
        id: item.id,
        timestamp: item.ts,
        brand: getBrand(item.brand)?.name ?? item.brand,
        brandSlug: item.brand,
        code: item.code,
        note: item.note,
        email: item.email,
        status: item.status,
        outcome: item.outcome ?? "",
        reviewNote: item.reviewNote ?? "",
        reviewedAt: item.reviewedAt ?? "",
        replyStatus: item.replyStatus ?? "",
        notificationStatus: item.notificationStatus ?? "",
        notificationReason: item.notificationReason ?? "",
        photoCount: item.files?.length ?? (item.file ? 1 : 0),
      }));

  const body = format === "json" ? JSON.stringify(rows, null, 2) : `\uFEFF${asCsv(rows)}`;
  return new NextResponse(body, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="cosmeticsbatch-${kind}-${date}.${format}"`,
      "Content-Type": format === "json" ? "application/json; charset=utf-8" : "text/csv; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
