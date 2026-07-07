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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  w.ym =
    w.ym ||
    function (...args: unknown[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((w.ym as any).a = (w.ym as any).a || []).push(args);
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (w.ym as any).l = Number(new Date());
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
