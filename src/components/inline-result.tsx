"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CheckResult } from "@/lib/decoder";
import type { Brand } from "@/lib/brands";
import { ResultCard } from "@/components/result-card";

type LoadState =
  | { status: "loading"; result: null }
  | { status: "success"; result: CheckResult }
  | { status: "error"; result: null };

/**
 * Renders the decode result for the `?code=` query param. The decode itself
 * happens server-side (`/api/decode`) so the batch-code ciphers never reach the
 * browser bundle; this component only fetches and renders the resulting dates.
 */
export function InlineResult({ brand }: { brand: Brand }) {
  const code = useSearchParams().get("code")?.trim();
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState<LoadState>({ status: "loading", result: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!code) return;
    const controller = new AbortController();
    fetch("/api/decode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: brand.slug, code }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Decode failed (${response.status})`);
        return response.json();
      })
      .then((data) => {
        if (!data?.result) throw new Error("Decode response is missing a result");
        const r = data.result;
        setLoad({
          status: "success",
          result: {
            ...r,
            manufactureDate: r.manufactureDate ? new Date(r.manufactureDate) : null,
            expirationDate: r.expirationDate ? new Date(r.expirationDate) : null,
          },
        });
        if (r.failureReason === "unresolved" || r.failureReason === "barcode") {
          window.dispatchEvent(new CustomEvent("unresolved-code", { detail: { code: r.code } }));
        }
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setLoad({ status: "error", result: null });
        }
      });
    return () => controller.abort();
  }, [code, brand.slug, attempt]);

  // Scroll to the result block as soon as a code is being checked, rather than
  // waiting for the decode to resolve.
  useEffect(() => {
    if (code && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [code]);

  if (!code) return null;

  return (
    <div id="result" ref={ref} className="mt-8 scroll-mt-24">
      <ResultContent
        key={`${brand.slug}:${code}:${attempt}`}
        load={load}
        brand={brand}
        retry={() => {
          setLoad({ status: "loading", result: null });
          setAttempt((value) => value + 1);
        }}
      />
    </div>
  );
}

function ResultContent({
  load,
  brand,
  retry,
}: {
  load: LoadState;
  brand: Brand;
  retry: () => void;
}) {
  if (load.status === "success") return <ResultCard result={load.result} brand={brand} />;
  if (load.status === "loading") return <ResultSkeleton />;
  return (
    <div role="alert" className="rounded-2xl border border-danger/30 bg-danger-bg p-6 text-center">
      <p className="font-semibold">We couldn&apos;t load this result.</p>
      <p className="mt-1 text-sm text-fg-muted">Check your connection and try again.</p>
      <button type="button" onClick={retry} className="mt-4 rounded-xl bg-cta px-4 py-2 text-sm font-semibold text-cta-fg">
        Try again
      </button>
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
