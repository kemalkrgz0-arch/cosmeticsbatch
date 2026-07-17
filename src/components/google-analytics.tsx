"use client";

import { useEffect } from "react";
import { CONSENT_GRANTED_EVENT, ga } from "@/lib/analytics";

let started = false;

function load(id: string) {
  if (started || typeof window === "undefined") return;
  started = true;
  const source = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  const script = document.createElement("script");
  script.async = true;
  script.src = source;
  document.head.appendChild(script);

  const gtag = (window as unknown as {
    gtag?: (...args: unknown[]) => void;
  }).gtag;
  gtag?.("js", new Date());
  gtag?.("config", id);
}

/** Load GA only after explicit consent; denied PSI/first visits avoid 179 KB. */
export function GoogleAnalytics() {
  useEffect(() => {
    const id = ga.id;
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
