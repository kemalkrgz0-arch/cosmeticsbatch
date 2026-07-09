import { NextRequest, NextResponse } from "next/server";
import { getBrand } from "@/lib/brands";
import { checkBatchCode } from "@/lib/decoder";
import { logCheck, toCheckLog } from "@/lib/dataset";
import { isRealApiUser } from "@/lib/bot-filter";

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

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")?.trim();
  const code = req.nextUrl.searchParams.get("code")?.trim();
  if (!slug || !code) {
    return NextResponse.json({ error: "missing slug or code" }, { status: 400 });
  }
  const brand = getBrand(slug);
  if (!brand) {
    return NextResponse.json({ error: "unknown brand" }, { status: 404 });
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
  const referer = req.headers.get("referer");
  if (
    isRealApiUser({
      ua: req.headers.get("user-agent"),
      secFetchSite: req.headers.get("sec-fetch-site"),
      referer,
      host: req.headers.get("host"),
    })
  ) {
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
  }

  // Never expose how the code was read.
  const { method: _method, notes: _notes, ...safe } = result;
  void _method;
  void _notes;

  return NextResponse.json(
    { result: safe },
    { headers: { "Cache-Control": "no-store" } },
  );
}
