"use client";

import { usePathname } from "next/navigation";
import { adsenseEnabled, googleCmpEnabled } from "@/lib/ads";
import { gaEnabled, ymEnabled } from "@/lib/analytics";
import { CookieConsent } from "@/components/cookie-consent";
import { YandexMetrica } from "@/components/yandex-metrica";
import { GoogleAnalytics } from "@/components/google-analytics";

function isPrivateReviewPath(pathname: string) {
  return pathname.split("/").includes("review");
}

/** Keep all analytics/consent code out of the private review workspace. */
export function TrackingBoundary() {
  const pathname = usePathname();
  if (isPrivateReviewPath(pathname)) return null;

  return (
    <>
      {(adsenseEnabled || gaEnabled) && (
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}" +
              "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});" +
              "try{if(localStorage.getItem('cb:consent')==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}",
          }}
        />
      )}
      {ymEnabled && <YandexMetrica />}
      {!googleCmpEnabled && (adsenseEnabled || gaEnabled || ymEnabled) && <CookieConsent />}
      {gaEnabled && <GoogleAnalytics />}
    </>
  );
}
