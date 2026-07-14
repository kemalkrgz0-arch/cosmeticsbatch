import { NextRequest, NextResponse } from "next/server";
import { getBrand } from "@/lib/brands";
import { checkBatchCode } from "@/lib/decoder";
import { logCheck, toCheckLog } from "@/lib/dataset";
import { isRealApiUser } from "@/lib/bot-filter";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_CODE_LENGTH = 64;

function clientKey(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function rateHeaders(rate: ReturnType<typeof checkRateLimit>) {
  return {
    "RateLimit-Limit": String(rate.limit),
    "RateLimit-Remaining": String(rate.remaining),
    "RateLimit-Reset": String(Math.ceil(rate.resetAt / 1000)),
    "Cache-Control": "no-store",
  };
}

/** Best-effort locale from the referring page path (e.g. /de/brands/... → de). */
function localeFromReferer(referer: string | null): string | undefined {
  if (!referer) return undefined;
  try {
    const seg = new URL(referer).pathname.split("/")[1];
    return seg && seg.length >= 2 && seg.length <= 3 ? seg : "en";
  } catch {
    return undefined;
  }
}

// Decode runs server-side only so the batch-code ciphers never ship to the
// browser. The response is stripped of `method` and `notes` (which would
// describe the algorithm) — the client only receives the resulting dates.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const referer = req.headers.get("referer");
  const browser = {
    ua: req.headers.get("user-agent"),
    secFetchSite: req.headers.get("sec-fetch-site"),
    referer,
    host: req.headers.get("host"),
  };
  if (!isRealApiUser(browser)) {
    return NextResponse.json(
      { error: "same-origin browser request required" },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const rate = checkRateLimit(clientKey(req));
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "too many requests" },
      {
        status: 429,
        headers: {
          ...rateHeaders(rate),
          "Retry-After": String(Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000))),
        },
      },
    );
  }

  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json(
      { error: "content type must be application/json" },
      { status: 415, headers: rateHeaders(rate) },
    );
  }
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 1_024) {
    return NextResponse.json(
      { error: "request body too large" },
      { status: 413, headers: rateHeaders(rate) },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid JSON body" },
      { status: 400, headers: rateHeaders(rate) },
    );
  }
  const payload = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const slug = typeof payload.slug === "string" ? payload.slug.trim() : "";
  const code = typeof payload.code === "string" ? payload.code.trim() : "";
  if (!slug || !code) {
    return NextResponse.json(
      { error: "missing slug or code" },
      { status: 400, headers: rateHeaders(rate) },
    );
  }
  if (slug.length > 100 || code.length > MAX_CODE_LENGTH) {
    return NextResponse.json(
      { error: "invalid slug or code length" },
      { status: 400, headers: rateHeaders(rate) },
    );
  }
  const brand = getBrand(slug);
  if (!brand) {
    return NextResponse.json(
      { error: "unknown brand" },
      { status: 404, headers: rateHeaders(rate) },
    );
  }

  const result = checkBatchCode({
    brandName: brand.name,
    code,
    decoderId: brand.decoderId,
    shelfLifeMonths: brand.shelfLifeMonths,
    category: brand.category,
  });

  // Record the check in our own dataset — but only for real users (human UA +
  // same-origin browser request). Bots/scrapers still get a decode; they just
  // don't pollute the dataset. No IP stored; country is coarse edge data.
  await logCheck(
      toCheckLog({
        source: "api",
        brandSlug: brand.slug,
        code,
        decoderId: brand.decoderId,
        locale: localeFromReferer(referer),
        country: req.headers.get("cf-ipcountry") ?? undefined,
        result,
      }),
    );

  // Never expose how the code was read.
  const { method: _method, notes: _notes, ...safe } = result;
  void _method;
  void _notes;

  return NextResponse.json(
    { result: safe },
    { headers: rateHeaders(rate) },
  );
}
