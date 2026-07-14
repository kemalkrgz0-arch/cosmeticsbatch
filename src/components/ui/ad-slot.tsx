"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { adsense, type AdPlacement } from "@/lib/ads";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Reserved advertising container. A fixed min-height reserves space so the ad
 * never shifts layout (CLS ≈ 0). When AdSense is configured it renders a real
 * responsive unit; otherwise a neutral placeholder. Only ever placed *between*
 * content sections — never inside the primary check flow.
 */
export function AdSlot({
  placement,
  className,
  label = "Advertisement",
  height = 280,
}: {
  /** Which configured slot id to use. */
  placement?: AdPlacement;
  className?: string;
  label?: string;
  height?: number;
}) {
  const client = adsense.client;
  const slot = placement ? adsense.slots[placement] : "";
  const enabled = Boolean(client && slot);
  const pushed = useRef(false);

  useEffect(() => {
    if (!enabled || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense not ready / blocked — placeholder height keeps layout stable */
    }
  }, [enabled]);

  // Until AdSense is configured, render nothing rather than an empty grey
  // placeholder box — a blank labelled panel reads as unfinished. Real units
  // appear automatically once the client/slot env vars are set.
  if (!enabled) return null;

  return (
    <>
      {/* Load AdSense only on pages that render approved publisher content.
          Keeping this out of the root layout excludes thin/noindex tools from
          the site's monetized inventory entirely. Duplicate ids are deduped by
          next/script when a page contains more than one reviewed placement. */}
      <Script
        id="adsense"
        strategy="lazyOnload"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />
      <aside
        aria-label={label}
        className={cn("mx-auto w-full max-w-3xl px-4", className)}
      >
        <div
          style={{ minHeight: height }}
          className="flex items-center justify-center overflow-hidden rounded-2xl"
        >
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: height }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </aside>
    </>
  );
}
