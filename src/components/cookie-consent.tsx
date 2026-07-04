"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

const KEY = "cb:consent";

type Gtag = (
  command: "consent",
  action: "update",
  params: Record<string, "granted" | "denied">,
) => void;

/**
 * Lightweight cookie-consent banner wired to Google Consent Mode v2. Consent
 * defaults to denied (set in the layout bootstrap before any loader runs); this
 * banner grants or keeps-denied the analytics/ads storage signals and persists
 * the choice so it isn't asked again. No third-party CMP.
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- decide on mount only
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage blocked — don't nag */
    }
  }, []);

  function decide(granted: boolean) {
    const value = granted ? "granted" : "denied";
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    gtag?.("consent", "update", {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
    });
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-[76px] z-50 mx-auto max-w-xl px-4 md:bottom-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <p className="text-sm leading-relaxed text-fg-muted">
          We use cookies for analytics and ads to keep this tool free. You can
          accept or reject non-essential cookies.{" "}
          <Link href="/privacy" className="font-medium text-fg underline">
            Learn more
          </Link>
          .
        </p>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => decide(false)}
            className="rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="rounded-full bg-cta px-4 py-2 text-sm font-semibold text-cta-fg transition-colors hover:bg-cta-hover"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
