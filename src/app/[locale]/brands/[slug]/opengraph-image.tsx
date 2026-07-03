import { ImageResponse } from "next/og";
import { getBrand, BRANDS } from "@/lib/brands";
import { site } from "@/lib/site";

export const alt = "Brand batch code checker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

function initials(name: string) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default async function BrandOG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrand(slug);
  const name = brand?.name ?? site.name;

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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "#0a0a0b",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="5" r="2.4" />
              <circle cx="12" cy="19" r="2.4" />
              <circle cx="5" cy="12" r="2.4" />
              <circle cx="19" cy="12" r="2.4" />
            </svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: "#0a0a0a" }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 28,
              background: "#f6f6f7",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
              fontWeight: 700,
            }}
          >
            {initials(name)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                fontSize: 68,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#0a0a0a",
                maxWidth: 760,
                lineHeight: 1.05,
              }}
            >
              {name}
            </div>
            <div style={{ fontSize: 34, color: "#6b6b70" }}>
              Batch Code Checker
            </div>
          </div>
        </div>

        <div style={{ fontSize: 28, color: "#0a84ff" }}>
          Manufacture date • Age • Expiration — free &amp; instant
        </div>
      </div>
    ),
    size,
  );
}
