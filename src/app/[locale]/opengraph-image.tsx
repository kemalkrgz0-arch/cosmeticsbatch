import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { BRANDS } from "@/lib/brands";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#0a0a0b",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="#fff">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="5" r="2.4" />
              <circle cx="12" cy="19" r="2.4" />
              <circle cx="5" cy="12" r="2.4" />
              <circle cx="19" cy="12" r="2.4" />
            </svg>
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, color: "#0a0a0a" }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#0a0a0a",
              maxWidth: 900,
            }}
          >
            Check Cosmetic &amp; Perfume Batch Codes
          </div>
          <div style={{ fontSize: 32, color: "#6b6b70", maxWidth: 820 }}>
            Manufacture date, age &amp; expiration — free, instant, private.
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 26, color: "#0a84ff" }}>
          <span>100% Free</span>
          <span style={{ color: "#dcdcde" }}>•</span>
          <span>No sign-up</span>
          <span style={{ color: "#dcdcde" }}>•</span>
          <span>{BRANDS.length}+ brands</span>
        </div>
      </div>
    ),
    size,
  );
}
