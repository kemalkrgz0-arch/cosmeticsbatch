"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { adsenseEnabled } from "@/lib/ads";
import { ga, gaEnabled, ymEnabled } from "@/lib/analytics";
import { CookieConsent } from "@/components/cookie-consent";
import { YandexMetrica } from "@/components/yandex-metrica";

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
      {(adsenseEnabled || gaEnabled || ymEnabled) && <CookieConsent />}
      {gaEnabled && (
        <>
          <Script
            id="ga-loader"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga.id}`}
          />
          <Script id="ga-config" strategy="lazyOnload">
            {`gtag('js',new Date());gtag('config','${ga.id}');`}
          </Script>
        </>
      )}
    </>
  );
}
