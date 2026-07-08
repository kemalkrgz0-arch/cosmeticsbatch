import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Result permutations are noindex; keep them out of crawl budget too.
// Locale-prefixed (/en/check, /fr/check…), so match across locales.
const DISALLOW = ["/check", "/*/check"];

// Bots we explicitly welcome. Two groups, both allowed:
//  - Search engines → classic ranking (Googlebot, Bingbot, …).
//  - AI answer engines → Generative Engine Optimization. These cite + link
//    their sources, so being crawlable here is a referral-traffic channel
//    (ChatGPT Search, Perplexity, Google AI Overviews, Copilot, Apple).
// The decode cipher never ships in the HTML (it's server-side only), so there
// is nothing sensitive for any crawler to scrape — only public content.
const WELCOME_BOTS = [
  // Search
  "Googlebot",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  "YandexBot",
  // AI answer engines / assistants (drive cited referral traffic)
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // ChatGPT browsing on a user's behalf
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini / AI Overviews — must stay allowed
  "Applebot-Extended",
  // AI training crawlers (no direct traffic, but harmless — allowed for reach)
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Explicit allow for named search + AI crawlers, so intent is
      // unambiguous even if a future rule tightens the wildcard.
      ...WELCOME_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
      // Everyone else: same policy.
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
