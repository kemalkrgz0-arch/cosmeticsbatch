import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Self-host build: emit a minimal standalone server (.next/standalone/server.js)
  // so the Docker image ships only the files it needs — for Coolify / VPS.
  output: "standalone",
  // Don't advertise the framework (drops the X-Powered-By: Next.js header).
  poweredByHeader: false,
  // This project's directory is the workspace root (a stray lockfile exists in $HOME).
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Origin-Agent-Cluster", value: "?1" },
          // Force HTTPS for 2 years (incl. subdomains); eligible for preload list.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Lock down sensitive browser features we never use. Ad-related
          // permissions (browsing-topics, attribution-reporting…) are left at
          // their defaults so AdSense keeps working.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
