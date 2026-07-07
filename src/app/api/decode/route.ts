import { NextRequest, NextResponse } from "next/server";
import { getBrand } from "@/lib/brands";
import { checkBatchCode } from "@/lib/decoder";

// Decode runs server-side only so the batch-code ciphers never ship to the
// browser. The response is stripped of `method` and `notes` (which would
// describe the algorithm) — the client only receives the resulting dates.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
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

  // Never expose how the code was read.
  const { method: _method, notes: _notes, ...safe } = result;
  void _method;
  void _notes;

  return NextResponse.json(
    { result: safe },
    { headers: { "Cache-Control": "no-store" } },
  );
}
