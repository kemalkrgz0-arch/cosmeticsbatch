"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { checkBatchCode } from "@/lib/decoder";
import type { Brand } from "@/lib/brands";
import { ResultCard } from "@/components/result-card";
import { AdSlot } from "@/components/ui/ad-slot";

/**
 * Renders the decode result from the `?code=` query param on the client.
 * Keeps the brand page statically generated (fast + indexable) while still
 * showing an inline result on the same ad-supported, SEO-relevant URL.
 */
export function InlineResult({ brand }: { brand: Brand }) {
  const code = useSearchParams().get("code")?.trim();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (code && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [code]);

  if (!code) return null;

  const result = checkBatchCode({
    brandName: brand.name,
    code,
    decoderId: brand.decoderId,
    shelfLifeMonths: brand.shelfLifeMonths,
    category: brand.category,
  });

  return (
    <div id="result" ref={ref} className="mt-8 scroll-mt-24">
      {/* On search, show an ad first, then the decode result below it. */}
      <AdSlot placement="result" className="mb-6" height={250} />
      <ResultCard result={result} brand={brand} />
    </div>
  );
}
