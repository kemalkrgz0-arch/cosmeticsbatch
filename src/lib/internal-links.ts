import { BRANDS } from "./brands";

/**
 * Automatic internal linking for guide prose. Guide content (guides.ts) is
 * plain text; at render time we turn the first mention of each supported brand
 * into a link to its batch-code page. This spreads crawl equity and link value
 * from topical guide content down to the money pages (brand decoders), and is
 * the reciprocal of the brand → guides links already on brand pages.
 */

// Brand names that are also ordinary English words. Auto-linking them inside
// prose would false-match sentences ("a fresh product", "matrix of dates"), so
// they are excluded from *inline* linking — they still appear in the curated
// "popular brands" block that every guide renders.
const INLINE_DENYLIST = new Set([
  "Fresh",
  "Origins",
  "Coach",
  "Diesel",
  "Matrix",
  "Creed",
]);

// Longest names first so "Estée Lauder" is matched before "Estée".
const LINKABLE = BRANDS.filter(
  (b) => b.name.length >= 3 && !INLINE_DENYLIST.has(b.name),
)
  .map((b) => ({ name: b.name, slug: b.slug }))
  .sort((a, b) => b.name.length - a.name.length);

const SLUG_BY_NAME = new Map(LINKABLE.map((b) => [b.name, b.slug]));

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// One alternation of every linkable name, bounded by non-letter/number so
// "Chanel" links but "channel" never does. Case-sensitive: brand names are
// capitalised in the guides, ordinary words usually are not.
const BRAND_RE =
  LINKABLE.length > 0
    ? new RegExp(
        `(?<![\\p{L}\\p{N}])(${LINKABLE.map((b) => escapeRe(b.name)).join(
          "|",
        )})(?![\\p{L}\\p{N}])`,
        "gu",
      )
    : null;

export interface TextToken {
  text: string;
  /** Brand page path when this token should render as a link. */
  href?: string;
}

/**
 * Split a paragraph into plain-text and brand-link tokens. Only the first
 * occurrence of a given brand across the whole guide is linked — pass the same
 * `used` set to every call for one guide so a brand is never linked twice.
 */
export function linkifyBrands(text: string, used: Set<string>): TextToken[] {
  if (!BRAND_RE) return [{ text }];
  BRAND_RE.lastIndex = 0;
  const tokens: TextToken[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = BRAND_RE.exec(text)) !== null) {
    const name = m[1];
    const slug = SLUG_BY_NAME.get(name);
    if (!slug || used.has(name)) continue; // already linked once — leave as text
    used.add(name);
    if (m.index > last) tokens.push({ text: text.slice(last, m.index) });
    tokens.push({ text: name, href: `/brands/${slug}` });
    last = m.index + name.length;
  }
  if (last < text.length) tokens.push({ text: text.slice(last) });
  return tokens.length ? tokens : [{ text }];
}
