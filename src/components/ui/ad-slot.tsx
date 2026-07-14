"use client";

import { useEffect, useRef } from "react";
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
  // The unit needs a slot id. The loader script does not, and lives in
  // [[adsense-loader]] — a server component, so it reaches the HTML the reviewer
  // reads. Until slot ids exist, the loader is on the page and no box is drawn.
  const hasUnit = Boolean(client && slot);
  const pushed = useRef(false);

  useEffect(() => {
    if (!hasUnit || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense not ready / blocked — reserved height keeps layout stable */
    }
  }, [hasUnit]);

  // No slot id yet: nothing to fill a box with, and a blank labelled panel reads
  // as an unfinished site.
  if (!hasUnit) return null;

  return (
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
  );
}
