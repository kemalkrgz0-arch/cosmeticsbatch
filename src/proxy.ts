import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_CODES, DEFAULT_LOCALE } from "@/i18n/locales";

/**
 * Locale routing (replaces next-intl's middleware, which self-redirect-loops on
 * the unprefixed default-locale root in a Next 16 production build).
 *
 * URL scheme — default locale (English) is prefix-free, others are prefixed:
 *   /                 → renders /en   (internal rewrite, URL stays "/")
 *   /brands/dior      → renders /en/brands/dior
 *   /fr, /fr/brands…  → served as-is  ([locale]=fr)
 *   /en, /en/…        → 308 redirect to the bare path (canonical, no /en dupes)
 *
 * In this Next build a middleware rewrite RE-invokes the proxy on the rewritten
 * path, so the "/" → "/en" rewrite would otherwise trigger the "/en" → "/"
 * redirect and loop. We tag the rewritten request with a header and short-circuit
 * on the second pass to break that cycle.
 */
const NON_DEFAULT = new Set(LOCALE_CODES.filter((c) => c !== DEFAULT_LOCALE));
const REWRITE_MARK = "x-default-locale-rewrite";

export default function proxy(request: NextRequest) {
  // Second pass: this request is our own internal rewrite to /en — serve it.
  if (request.headers.get(REWRITE_MARK)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const seg = pathname.split("/")[1] ?? "";

  // Explicit default-locale prefix → redirect to the canonical bare path.
  if (seg === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  // Prefixed non-default locale → already maps to [locale], serve unchanged.
  if (NON_DEFAULT.has(seg)) return NextResponse.next();

  // Bare path → internally render under the default locale, URL unchanged.
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  const headers = new Headers(request.headers);
  headers.set(REWRITE_MARK, "1");
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Skip API, Next internals, and anything with a file extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
