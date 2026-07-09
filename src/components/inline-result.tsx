"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CheckResult } from "@/lib/decoder";
import type { Brand } from "@/lib/brands";
import { ResultCard } from "@/components/result-card";
import { AdSlot } from "@/components/ui/ad-slot";

/**
 * Renders the decode result for the `?code=` query param. The decode itself
 * happens server-side (`/api/decode`) so the batch-code ciphers never reach the
 * browser bundle; this component only fetches and renders the resulting dates.
 */
export function InlineResult({ brand }: { brand: Brand }) {
  const code = useSearchParams().get("code")?.trim();
  const ref = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<CheckResult | null>(null);

  useEffect(() => {
    if (!code) {
      setResult(null);
      return;
    }
    let active = true;
    fetch(
      `/api/decode?slug=${encodeURIComponent(brand.slug)}&code=${encodeURIComponent(code)}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (!active || !data?.result) return;
        const r = data.result;
        setResult({
          ...r,
          manufactureDate: r.manufactureDate ? new Date(r.manufactureDate) : null,
          expirationDate: r.expirationDate ? new Date(r.expirationDate) : null,
        });
      })
      .catch(() => {
        if (active) setResult(null);
      });
    return () => {
      active = false;
    };
  }, [code, brand.slug]);

  // Scroll to the result block as soon as a code is being checked — not after
  // the decode resolves. The block leads with the ad (fixed height, so no
  // layout shift), so the user lands on the ad while the result loads in below.
  useEffect(() => {
    if (code && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [code]);

  if (!code) return null;

  return (
    <div id="result" ref={ref} className="mt-8 scroll-mt-24">
      {/* On search, show an ad first, then the decode result below it. */}
      <AdSlot placement="result" className="mb-6" height={250} />
      {result ? <ResultCard result={result} brand={brand} /> : <ResultSkeleton />}
    </div>
  );
}

/** Pulsing placeholder shown while the decode request is in flight. */
function ResultSkeleton() {
  return (
    <div
      aria-hidden
      className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card shadow-card"
    >
      <div className="flex flex-col gap-6 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-bg-subtle" />
          <div className="h-7 w-40 rounded bg-bg-subtle" />
          <div className="h-6 w-28 rounded-full bg-bg-subtle" />
        </div>
        <div className="h-36 w-36 shrink-0 self-center rounded-full bg-bg-subtle sm:self-auto" />
      </div>
      <div className="grid gap-x-8 gap-y-4 p-6 sm:p-8 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <div className="h-4 w-28 rounded bg-bg-subtle" />
            <div className="h-4 w-20 rounded bg-bg-subtle" />
          </div>
        ))}
      </div>
    </div>
  );
}
