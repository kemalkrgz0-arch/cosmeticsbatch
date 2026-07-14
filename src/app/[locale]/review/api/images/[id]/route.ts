import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { NextResponse } from "next/server";
import { requireReviewer } from "@/lib/review-auth";
import { getSubmission, submissionImagePath } from "@/lib/submission-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireReviewer();
    const { id } = await params;
    const submission = await getSubmission(id);
    if (!submission) return new NextResponse("Not found", { status: 404 });
    const files = submission.files?.length ? submission.files : [submission.file];
    const index = Number(new URL(request.url).searchParams.get("index") ?? "0");
    if (!Number.isInteger(index) || index < 0 || index >= files.length) return new NextResponse("Not found", { status: 404 });
    const path = submissionImagePath(files[index]);
    const bytes = await readFile(path);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": MIME[extname(path).toLowerCase()] ?? "application/octet-stream",
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Disposition": `inline; filename="submission-${submission.id.replace(/[^a-zA-Z0-9-]/g, "")}.jpg"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Forbidden", { status: 403, headers: { "Cache-Control": "no-store" } });
  }
}
