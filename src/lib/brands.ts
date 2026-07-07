import type { ProductCategory } from "./decoder/types";

export interface Brand {
  slug: string;
  name: string;
  /** Parent manufacturing group — used for grouping + decode explanation. */
  group: string;
  /** Dedicated decoder id from the engine, if any. */
  decoderId?: string;
  category: ProductCategory;
  /** Estimated unopened shelf life from manufacture, in months. */
  shelfLifeMonths: number;
  /** Period-after-opening in months (the jar symbol), for guidance. */
  paoMonths: number;
  popular?: boolean;
  /**
   * Staged out of the public picker/search until we have a *verified* decode
   * format for it (real code→date samples). Its page still resolves by URL so
   * existing links don't 404. Un-hide by removing the slug from HIDDEN_SLUGS
   * once a tested decoder covers it.
   */
  hidden?: boolean;
  blurb: string;
}

/** Compact source table -> expanded Brand[]. */
type Row = [
  name: string,
  group: string,
  decoderId: string | undefined,
  category: ProductCategory,
  shelfLifeMonths: number,
  paoMonths: number,
  popular?: boolean,
];

const ROWS: Row[] = [
  // ---- Estée Lauder Companies (dedicated decoder) ----
  ["Estée Lauder", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12, true],
  ["Clinique", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12],
  ["MAC Cosmetics", "Estée Lauder Companies", "estee-lauder", "makeup", 36, 24],
  ["Bobbi Brown", "Estée Lauder Companies", "estee-lauder", "makeup", 36, 24],
  ["Aveda", "Estée Lauder Companies", "estee-lauder", "haircare", 36, 12],
  ["La Mer", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12],
  ["Jo Malone London", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Tom Ford Beauty", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Origins", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12],
  ["Smashbox", "Estée Lauder Companies", "estee-lauder", "makeup", 36, 24],
  ["Too Faced", "Estée Lauder Companies", "estee-lauder", "makeup", 36, 24],
  ["Dr.Jart+", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12],
  ["Lab Series", "Estée Lauder Companies", "estee-lauder", "skincare", 36, 12],
  ["Le Labo", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Kilian Paris", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Frédéric Malle", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Bumble and bumble", "Estée Lauder Companies", "estee-lauder", "haircare", 36, 12],

  // ---- Coty (4-digit YDDD code) ----
  // Umbrella entry — pick "Coty" if a sub-brand isn't listed.
  ["Coty", "Coty", "coty", "perfume", 60, 36],
  // Consumer Beauty — colour cosmetics
  ["Rimmel London", "Coty", "coty", "makeup", 36, 24],
  ["Bourjois", "Coty", "coty", "makeup", 36, 24],
  ["Sally Hansen", "Coty", "coty", "makeup", 36, 24],
  ["Max Factor", "Coty", "coty", "makeup", 36, 24],
  ["CoverGirl", "Coty", "coty", "makeup", 36, 24],
  ["Manhattan", "Coty", "coty", "makeup", 36, 24],
  ["Miss Sporty", "Coty", "coty", "makeup", 36, 24],
  ["Kylie Cosmetics", "Coty", "coty", "makeup", 36, 24],
  ["Kylie Skin", "Coty", "coty", "skincare", 36, 12],
  ["Younique", "Coty", "coty", "makeup", 36, 24],
  ["Lancaster", "Coty", "coty", "skincare", 36, 12],
  // Consumer Beauty — mass fragrance
  ["adidas", "Coty", "coty", "perfume", 60, 36],
  ["David Beckham", "Coty", "coty", "perfume", 60, 36],
  ["Bruno Banani", "Coty", "coty", "perfume", 60, 36],
  ["Jovan", "Coty", "coty", "perfume", 60, 36],
  ["Mexx", "Coty", "coty", "perfume", 60, 36],
  ["Nautica", "Coty", "coty", "perfume", 60, 36],
  ["Enrique Iglesias", "Coty", "coty", "perfume", 60, 36],
  ["Beyoncé", "Coty", "coty", "perfume", 60, 36],
  ["Katy Perry", "Coty", "coty", "perfume", 60, 36],
  // Luxury / prestige fragrance licences
  ["Calvin Klein", "Coty", "coty", "perfume", 60, 36],
  ["Hugo Boss", "Coty", "coty", "perfume", 60, 36],
  ["Gucci Beauty", "Coty", "coty", "perfume", 60, 36],
  ["Burberry Beauty", "Coty", "coty", "perfume", 60, 36],
  ["Marc Jacobs Fragrances", "Coty", "coty", "perfume", 60, 36],
  ["Chloé", "Coty", "coty", "perfume", 60, 36],
  ["Davidoff", "Coty", "coty", "perfume", 60, 36],
  ["Tiffany & Co.", "Coty", "coty", "perfume", 60, 36],
  ["Vera Wang", "Coty", "coty", "perfume", 60, 36],
  ["Roberto Cavalli", "Coty", "coty", "perfume", 60, 36],
  ["Jil Sander", "Coty", "coty", "perfume", 60, 36],
  ["Joop!", "Coty", "coty", "perfume", 60, 36],
  ["Lacoste", "Coty", "coty", "perfume", 60, 36],
  ["Escada", "Coty", "coty", "perfume", 60, 36],
  ["Chopard", "Coty", "coty", "perfume", 60, 36],
  ["Cerruti", "Coty", "coty", "perfume", 60, 36],
  ["Nikos", "Coty", "coty", "perfume", 60, 36],
  ["Bottega Veneta", "Coty", "coty", "perfume", 60, 36],
  ["SJP", "Coty", "coty", "perfume", 60, 36],

  // ---- L'Oréal Group (shared 6-char year-letter code) ----
  // Umbrella entry — the note says: if a sub-brand fails, pick "L'Oréal".
  ["L'Oréal", "L'Oréal Group", "loreal", "makeup", 36, 12, true],
  // Consumer Products
  ["L'Oréal Paris", "L'Oréal Group", "loreal", "makeup", 30, 12, true],
  ["Maybelline", "L'Oréal Group", "loreal", "makeup", 30, 12, true],
  ["Garnier", "L'Oréal Group", "loreal", "skincare", 30, 12],
  ["NYX Professional Makeup", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Essie", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Mixa", "L'Oréal Group", "loreal", "skincare", 30, 12],
  ["3CE", "L'Oréal Group", "loreal", "makeup", 36, 24],
  // Dermatological Beauty
  ["La Roche-Posay", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["CeraVe", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["Vichy", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["SkinCeuticals", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["Skinbetter Science", "L'Oréal Group", "loreal", "skincare", 36, 12],
  // Luxe
  ["Lancôme", "L'Oréal Group", "loreal", "skincare", 36, 12, true],
  ["Kiehl's", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["YSL Beauty", "L'Oréal Group", "loreal", "makeup", 36, 24, true],
  ["Giorgio Armani Beauty", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Prada Beauty", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Valentino Beauty", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Biotherm", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["Urban Decay", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Mugler", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Azzaro", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Viktor & Rolf", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Ralph Lauren Fragrances", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Cacharel", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Diesel", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Helena Rubinstein", "L'Oréal Group", "loreal", "skincare", 36, 12],
  ["IT Cosmetics", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Shu Uemura", "L'Oréal Group", "loreal", "makeup", 36, 24],
  ["Aesop", "L'Oréal Group", "loreal", "skincare", 36, 12],
  // Professional Products
  ["L'Oréal Professionnel", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Kérastase", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Redken", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Matrix", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Pureology", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Mizani", "L'Oréal Group", "loreal", "haircare", 36, 12],
  ["Color Wow", "L'Oréal Group", "loreal", "haircare", 36, 12],

  // ---- LVMH (Dior + sister houses share a production-date code) ----
  ["Dior", "LVMH", "dior", "perfume", 60, 36, true],
  ["Guerlain", "LVMH", "dior", "perfume", 60, 36],
  ["Givenchy Beauty", "LVMH", "dior", "makeup", 36, 24],
  ["Kenzo Parfums", "LVMH", "dior", "perfume", 60, 36],
  ["Loewe Perfumes", "LVMH", "dior", "perfume", 60, 36],
  ["Acqua di Parma", "LVMH", "dior", "perfume", 60, 36],
  ["Maison Francis Kurkdjian", "LVMH", "dior", "perfume", 60, 36],
  ["Fresh", "LVMH", "dior", "skincare", 36, 12],
  ["Benefit Cosmetics", "LVMH", "dior", "makeup", 36, 24],
  ["Make Up For Ever", "LVMH", "dior", "makeup", 36, 24],
  ["Fenty Beauty", "LVMH", "dior", "makeup", 36, 24],
  ["Fenty Skin", "LVMH", "dior", "skincare", 36, 12],

  // ---- Independent / other groups ----
  ["Chanel", "Chanel", "chanel", "perfume", 60, 36, true],
  ["Chanel Beauty", "Chanel", "chanel", "makeup", 36, 24],
  // Fragrance houses on verified decoders
  ["Michael Kors", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Tommy Hilfiger", "Estée Lauder Companies", "estee-lauder", "perfume", 60, 36],
  ["Maison Margiela", "L'Oréal Group", "loreal", "perfume", 60, 36],
  ["Creed", "Creed", "creed", "perfume", 60, 36, true],
  // Puig — fragrances print the production date in the code (year digit +
  // Julian day), read by the generic embedded-date decoder.
  ["Zara", "Puig", "embedded", "perfume", 48, 36],
  ["Jean Paul Gaultier", "Puig", "embedded", "perfume", 60, 36, true],
  ["Paco Rabanne", "Puig", "embedded", "perfume", 60, 36, true],
  ["Rabanne", "Puig", "embedded", "perfume", 60, 36],
  ["Carolina Herrera", "Puig", "embedded", "perfume", 60, 36, true],
  ["Nina Ricci", "Puig", "embedded", "perfume", 60, 36],
  // Inter Parfums — first letter = year (J=2019 … R=2026), last 3 digits =
  // day of year. Verified: 08J38J169 = 18 Jun 2019, 03M16M091 = 1 Apr 2022.
  ["Montblanc", "Inter Parfums", "interparfums", "perfume", 60, 36, true],
  ["Jimmy Choo", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Coach", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Boucheron", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Van Cleef & Arpels", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Karl Lagerfeld", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Kate Spade", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Salvatore Ferragamo", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Moncler", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["GUESS", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Abercrombie & Fitch", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Dunhill", "Inter Parfums", "interparfums", "perfume", 60, 36],
  ["Nivea", "Beiersdorf", undefined, "skincare", 30, 12, true],
  ["Eucerin", "Beiersdorf", undefined, "skincare", 36, 12],
  ["The Ordinary", "Deciem", undefined, "skincare", 24, 12, true],
  ["NIOD", "Deciem", undefined, "skincare", 24, 12],
  ["NARS", "Shiseido", undefined, "makeup", 36, 24],
  ["Shiseido", "Shiseido", undefined, "skincare", 36, 12],
  ["SK-II", "P&G", undefined, "skincare", 36, 12],
  ["Charlotte Tilbury", "Charlotte Tilbury", undefined, "makeup", 36, 24],
  ["Drunk Elephant", "Shiseido", undefined, "skincare", 24, 12],
  ["Paula's Choice", "Unilever", undefined, "skincare", 24, 12],
  ["Clarins", "Clarins", undefined, "skincare", 36, 12],
  ["Sephora Collection", "Sephora", undefined, "makeup", 30, 12],
];

const categoryBlurb: Record<ProductCategory, string> = {
  skincare: "skincare",
  makeup: "makeup",
  perfume: "fragrance",
  haircare: "haircare",
  suncare: "sun care",
  generic: "beauty",
};

function toSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics: é -> e
    .toLowerCase()
    .replace(/['".]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Fold a string to a punctuation/diacritic-free search key so "loreal"
 * matches "L'Oréal" and "lancome" matches "Lancôme".
 */
function normalizeSearch(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * Brands staged out of the public list until we verify a real decode format
 * (see [[Brand.hidden]]). These currently rely on an unverified fallback that
 * would produce wrong dates, or use a proprietary cipher we haven't reversed
 * yet — so we hide them rather than mislead. Remove a slug here the moment a
 * tested decoder covers it.
 */
const HIDDEN_SLUGS = new Set<string>([
  // Coty makeup/skin — the 4-digit YDDD fragrance format does NOT apply here.
  "rimmel-london",
  "bourjois",
  "sally-hansen",
  "max-factor",
  "covergirl",
  "manhattan",
  "miss-sporty",
  "kylie-cosmetics",
  "kylie-skin",
  "younique",
  "lancaster",
  // No verified decoder yet (undefined → unreliable fallback).
  "nivea",
  "eucerin",
  "the-ordinary",
  "niod",
  "nars",
  "shiseido",
  "sk-ii",
  "charlotte-tilbury",
  "drunk-elephant",
  "paulas-choice",
  "clarins",
  "sephora-collection",
]);

/** Every brand, including hidden ones — used for URL resolution. */
export const ALL_BRANDS: Brand[] = ROWS.map(
  ([name, group, decoderId, category, shelfLifeMonths, paoMonths, popular]) => {
    const slug = toSlug(name);
    return {
      slug,
      name,
      group,
      decoderId,
      category,
      shelfLifeMonths,
      paoMonths,
      popular,
      hidden: HIDDEN_SLUGS.has(slug),
      blurb: `Decode ${name} batch codes to find the manufacture date, age and expiration date of your ${categoryBlurb[category]} products. Free, instant and private.`,
    };
  },
);

/** Public, verified-decode brands shown in the picker, search and listings. */
export const BRANDS: Brand[] = ALL_BRANDS.filter((b) => !b.hidden);

export const POPULAR_BRANDS = BRANDS.filter((b) => b.popular);

const bySlug = new Map(ALL_BRANDS.map((b) => [b.slug, b]));
export function getBrand(slug: string): Brand | undefined {
  return bySlug.get(slug);
}

/** Group a list of brands by their parent group, largest group first. */
export function groupBrands(
  list: Brand[],
): { group: string; brands: Brand[] }[] {
  const map = new Map<string, Brand[]>();
  for (const b of list) {
    const arr = map.get(b.group);
    if (arr) arr.push(b);
    else map.set(b.group, [b]);
  }
  return [...map.entries()]
    .map(([group, brands]) => ({
      group,
      brands: brands.sort((a, z) => a.name.localeCompare(z.name)),
    }))
    .sort(
      (a, z) =>
        z.brands.length - a.brands.length || a.group.localeCompare(z.group),
    );
}

export function searchBrands(query: string, limit = 8): Brand[] {
  const q = normalizeSearch(query);
  if (!q) return POPULAR_BRANDS.slice(0, limit);
  const starts: Brand[] = [];
  const contains: Brand[] = [];
  for (const b of BRANDS) {
    const n = normalizeSearch(b.name);
    if (n.startsWith(q)) starts.push(b);
    else if (n.includes(q) || normalizeSearch(b.group).includes(q))
      contains.push(b);
  }
  return [...starts, ...contains].slice(0, limit);
}
