import { NextResponse } from "next/server";
import { getBrand } from "@/lib/brands";
import { asCsv } from "@/lib/csv";
import { readRecentChecks } from "@/lib/dataset";
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
  const kind = url.searchParams.get("kind") === "checks" ? "checks" : "submissions";
  const format = url.searchParams.get("format") === "json" ? "json" : "csv";
  const date = new Date().toISOString().slice(0, 10);

  const rows = kind === "checks"
    ? (await readRecentChecks(1_000)).map((item) => ({
        timestamp: item.ts,
        brand: getBrand(item.brand)?.name ?? item.brand,
        brandSlug: item.brand,
        code: item.code,
        source: item.source,
        locale: item.locale ?? "",
        country: item.country ?? "",
        confidence: item.confidence,
        freshness: item.freshness,
        manufactureDate: item.mfg ?? "",
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
