"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

const VISIT_KEY = "cb:visit-counted";

export function ProductActivity() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    if (!pathname || pathname.split("/").includes("review")) return;
    let visit = false;
    try {
      visit = sessionStorage.getItem(VISIT_KEY) !== "1";
      if (visit) sessionStorage.setItem(VISIT_KEY, "1");
    } catch {
      // Page views still work when sessionStorage is unavailable.
    }
    void fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, locale, visit }),
      keepalive: true,
    });
  }, [locale, pathname]);

  return null;
}
