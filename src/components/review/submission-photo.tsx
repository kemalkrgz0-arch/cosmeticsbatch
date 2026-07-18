"use client";

import { useState } from "react";

/**
 * Submitted photo with click-to-zoom.
 *
 * Reading a batch code is the whole job of this tab, and the code is usually a
 * few millimetres of low-contrast print on a bottle. Fitting the photo into a
 * 24rem box made that unreadable, and the only escape was opening the raw image
 * in another tab, which loses the submission's context. Clicking now switches
 * between fit-to-panel and full resolution inside a scrollable frame, so the
 * reviewer can pan around the code without leaving the page.
 */
export function SubmissionPhoto({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <figure className="relative">
      <button
        type="button"
        onClick={() => setZoomed((value) => !value)}
        aria-expanded={zoomed}
        className={`block w-full cursor-zoom-in rounded-lg bg-black/5 ${zoomed ? "max-h-[36rem] cursor-zoom-out overflow-auto" : ""}`}
        title={zoomed ? "Click to fit" : "Click to zoom to full resolution"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={zoomed ? "max-w-none" : "max-h-[24rem] w-full object-contain"}
        />
      </button>
      <figcaption className="mt-1 flex items-center justify-between gap-2 text-xs text-fg-muted">
        <span>Photo {index + 1} · {zoomed ? "full resolution — drag to pan" : "click to zoom"}</span>
        <a href={src} target="_blank" rel="noreferrer" className="underline">
          Open original
        </a>
      </figcaption>
    </figure>
  );
}
