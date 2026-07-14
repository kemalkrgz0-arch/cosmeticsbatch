/**
 * Cheap "is this a real human?" signals used to keep the check dataset clean —
 * we only want codes real users entered, not crawlers or scrapers.
 *
 * Two independent signals, no external service (we self-host behind Cloudflare):
 *  1. User-Agent doesn't look like a bot / HTTP client / headless browser.
 *  2. For the decode API (always called by our own on-page widget) the request
 *     must carry a same-origin browser signal — Sec-Fetch-Site or a referer on
 *     our own host. A script hitting /api/decode directly has neither.
 */

const BOT_UA = new RegExp(
  [
    "bot", "crawl", "spider", "slurp", "mediapartners", "adsbot", "apis-google",
    "facebookexternalhit", "embedly", "quora", "pinterest", "redditbot",
    "telegrambot", "whatsapp", "skypeuripreview", "discordbot", "vkshare",
    "curl", "wget", "python-requests", "python-urllib", "httpx", "aiohttp",
    "axios", "node-fetch", "got ", "undici", "go-http-client", "java/",
    "okhttp", "libwww", "lua-resty", "guzzle", "postman", "insomnia",
    "headless", "phantomjs", "puppeteer", "playwright", "lighthouse",
    "semrush", "ahrefs", "mj12", "dotbot", "petalbot", "dataforseo",
    "bytespider", "gptbot", "ccbot", "claudebot", "perplexity",
  ].join("|"),
  "i",
);

/** True when the User-Agent is present and doesn't match a known non-human. */
export function isHumanUA(ua: string | null | undefined): boolean {
  if (!ua) return false; // real browsers always send a UA
  return !BOT_UA.test(ua);
}

/** Same-origin browser signal for a fetch()/XHR to the decode API. */
export function isSameOriginBrowser(h: {
  secFetchSite?: string | null;
  referer?: string | null;
  host?: string | null;
}): boolean {
  const sfs = h.secFetchSite?.toLowerCase();
  // `same-site` can be a different, compromised subdomain. This endpoint is
  // private to this exact origin, so only the stricter browser signal passes.
  if (sfs === "same-origin") return true;
  // Fallback for browsers that don't send Sec-Fetch-Site: referer on our host.
  if (h.referer && h.host) {
    try {
      return new URL(h.referer).host === h.host;
    } catch {
      return false;
    }
  }
  return false;
}

/** Real user hitting the decode API (widget fetch): human UA + same-origin. */
export function isRealApiUser(h: {
  ua?: string | null;
  secFetchSite?: string | null;
  referer?: string | null;
  host?: string | null;
}): boolean {
  return isHumanUA(h.ua) && isSameOriginBrowser(h);
}
