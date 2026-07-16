"use client";

import { useState } from "react";
import { CalendarPlus, Check, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DatePrecision } from "@/lib/decoder";

/**
 * Share + "add expiry to calendar" actions on a decode result. Turns the result
 * into a shareable moment (native share sheet on mobile, clipboard elsewhere)
 * and lets users drop the expiry date into Google Calendar.
 */
export function ResultActions({
  brandName,
  code,
  manufactureDate,
  expirationDate,
  percent,
  datePrecision = "day",
}: {
  brandName: string;
  code: string;
  manufactureDate: Date | null;
  expirationDate: Date | null;
  percent: number | null;
  datePrecision?: DatePrecision;
}) {
  const t = useTranslations("result");
  const [copied, setCopied] = useState(false);

  const shareDate = (d: Date) =>
    d.toLocaleDateString(undefined, {
      year: "numeric",
      ...(datePrecision === "year" ? {} : { month: "long" }),
      ...(datePrecision === "month" || datePrecision === "year"
        ? {}
        : { day: "numeric" }),
    });

  const shareText = [
    `${brandName} · ${code}`,
    manufactureDate
      ? t("shareMade", { date: shareDate(manufactureDate) })
      : null,
    percent !== null ? t("shareLifeLeft", { n: percent }) : null,
  ]
    .filter(Boolean)
    .join(" — ");

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data = { title: t("shareTitle", { name: brandName }), text: shareText, url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user dismissed the share sheet, or clipboard blocked — no-op */
    }
  }

  // All-day Google Calendar event on the expiry date.
  const calendarUrl = expirationDate
    ? (() => {
        const d = (x: Date) => x.toISOString().slice(0, 10).replace(/-/g, "");
        const end = new Date(expirationDate);
        end.setDate(end.getDate() + 1);
        const p = new URLSearchParams({
          action: "TEMPLATE",
          text: t("calendarTitle", { name: brandName }),
          dates: `${d(expirationDate)}/${d(end)}`,
          details: `${brandName} · ${code}`,
        });
        return `https://calendar.google.com/calendar/render?${p.toString()}`;
      })()
    : null;

  return (
    <div className="flex flex-wrap gap-2.5 border-t border-border p-6 sm:p-8">
      <button
        type="button"
        onClick={share}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-cta px-4 text-sm font-semibold text-cta-fg transition-colors duration-200 hover:bg-cta-hover"
      >
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {copied ? t("shareCopied") : t("share")}
      </button>
      {calendarUrl && (
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-fg transition-colors duration-200 hover:border-border-strong hover:bg-bg-subtle"
        >
          <CalendarPlus className="h-4 w-4" />
          {t("addToCalendar")}
        </a>
      )}
    </div>
  );
}
