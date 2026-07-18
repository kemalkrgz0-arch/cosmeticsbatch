import { NextRequest, NextResponse } from "next/server";
import { normalizeActivityPath } from "@/lib/activity-path";
import { isRealApiUser } from "@/lib/bot-filter";
import { logActivity } from "@/lib/dataset";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isRealApiUser({
    ua: request.headers.get("user-agent"),
    secFetchSite: request.headers.get("sec-fetch-site"),
    referer: request.headers.get("referer"),
    host: request.headers.get("host"),
  })) return new NextResponse(null, { status: 403 });

  const client = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(`activity:${client}`).allowed) return new NextResponse(null, { status: 429 });

  let body: unknown;
  try { body = await request.json(); } catch { return new NextResponse(null, { status: 400 }); }
  const data = body && typeof body === "object" ? body as Record<string, unknown> : {};
  // Only paths that resolve to a real page are recorded; see `activity-path`.
  const path = normalizeActivityPath(data.path);
  const locale = typeof data.locale === "string" && /^[a-z]{2,3}$/.test(data.locale) ? data.locale : undefined;
  if (!path) return new NextResponse(null, { status: 400 });

  const ts = new Date().toISOString();
  await logActivity({ ts, type: "page_view", path, locale });
  if (data.visit === true) await logActivity({ ts, type: "visit", path, locale });
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
