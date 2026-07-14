"use client";

import { useEffect } from "react";
import { ym, CONSENT_GRANTED_EVENT } from "@/lib/analytics";

let started = false;

/** Inject the Yandex Metrica tag exactly once (mirrors the official snippet). */
function load(id: string) {
  if (started || typeof window === "undefined") return;
  started = true;
  const w = window as unknown as Record<string, unknown> & {
    ym?: (...args: unknown[]) => void;
  };
  const src = `https://mc.yandex.ru/metrika/tag.js?id=${id}`;
  type QueuedYm = ((...args: unknown[]) => void) & {
    a?: unknown[][];
    l?: number;
  };
  w.ym =
    w.ym ||
    function (...args: unknown[]) {
      const queued = w.ym as QueuedYm;
      (queued.a ??= []).push(args);
    };
  (w.ym as QueuedYm).l = Date.now();
  for (const s of Array.from(document.scripts)) {
    if (s.src === src) return;
  }
  const el = document.createElement("script");
  el.async = true;
  el.src = src;
  document.getElementsByTagName("script")[0]?.parentNode?.insertBefore(
    el,
    document.getElementsByTagName("script")[0],
  );
  w.ym?.(Number(id), "init", {
    ssr: true,
    webvisor: true,
    clickmap: true,
    accurateTrackBounce: true,
    trackLinks: true,
  });
}

/**
 * Loads Yandex Metrica only after the visitor accepts cookies — on mount if a
 * prior "granted" choice is stored, otherwise when the consent banner fires
 * [[CONSENT_GRANTED_EVENT]]. Renders nothing.
 */
export function YandexMetrica() {
  useEffect(() => {
    const id = ym.id;
    if (!id) return;
    try {
      if (localStorage.getItem("cb:consent") === "granted") load(id);
    } catch {
      /* storage blocked */
    }
    const onGrant = () => load(id);
    window.addEventListener(CONSENT_GRANTED_EVENT, onGrant);
    return () => window.removeEventListener(CONSENT_GRANTED_EVENT, onGrant);
  }, []);

  return null;
}
