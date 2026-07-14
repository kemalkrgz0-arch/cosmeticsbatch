/**
 * Every proper noun a translator must not touch.
 *
 * Brand names are the problem: a great many of them are ordinary words. Google
 * cheerfully turns "The Ordinary" into «Обычный», "Head & Shoulders" into «Голова
 * и плечи», Creed into «вероучение» and Coach into «тренер». The result reads
 * fluently and names a product that does not exist — and nobody searching for
 * that brand will ever find the page.
 *
 * So they get masked before translation and restored afterwards, exactly like an
 * interpolation placeholder. The list is read from the brand table rather than
 * hand-maintained, plus the product lines that appear in the copy.
 */
import { readFileSync } from "node:fs";

const source = readFileSync("src/lib/brands.ts", "utf8");

/** Brand names from the ROWS table: ["Name", "Group", …]. */
const fromTable = [
  ...new Set(
    [...source.matchAll(/^ {2}\["([^"]+)", "([^"]+)",/gm)].flatMap((m) => [
      m[1],
      m[2],
    ]),
  ),
];

/**
 * Product lines, short forms and other proper nouns that appear in the copy.
 * Short forms matter: the table says "Rimmel London", the prose says "Rimmel",
 * and an unmasked "Rimmel" comes back from Serbian as «Риммел».
 */
const EXTRA = [
  "Rimmel",
  "Bourjois",
  "Sally Hansen",
  "Max Factor",
  "CoverGirl",
  "Jimmy Choo",
  "Van Cleef & Arpels",
  "Karl Lagerfeld",
  "Kate Spade",
  "Acqua di Parma",
  "Maison Francis Kurkdjian",
  "Capital Soleil",
  "Mineral 89",
  "Liftactiv",
  "Anthelios",
  "Good Girl",
  "Invictus",
  "1 Million",
  "Le Male",
  "Acqua di Giò",
  "Acqua di Gio",
  "Green Irish Tweed",
  "Armani Code",
  "Legend Spirit",
  "Sauvage",
  "J'adore",
  "CK One",
  "Knot",
  "Illusione",
  "Ambre Solaire",
  "SA Cleanser",
  "Search Console",
  "Cosmetics Batch",
];

/**
 * Longest first: "Kylie Skin" must be masked before "Kylie Cosmetics" can eat the
 * "Kylie", and "The Ordinary" before "Ordinary" would ever match.
 */
export const BRAND_NAMES = [...new Set([...fromTable, ...EXTRA])]
  .filter((n) => n.length > 2)
  .sort((a, z) => z.length - a.length);

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Replace every brand name with a sentinel the translator leaves alone. Returns
 * the masked text and the restore function.
 */
export function maskBrands(text) {
  const found = [];
  let masked = text;
  for (const name of BRAND_NAMES) {
    // Word-boundary-ish: don't mask "Coty" inside a longer word.
    const re = new RegExp(`(?<![\\p{L}\\d])${escape(name)}(?![\\p{L}\\d])`, "gu");
    if (!re.test(masked)) continue;
    // The sentinel must not look like a word. A letter-based one (xbr0x) gets
    // *transliterated* into the target script — Serbian came back with «кбр0к» —
    // and then nothing matches it on the way out. Brackets and digits survive.
    const token = `[[${found.length}]]`;
    found.push(name);
    masked = masked.replace(re, token);
  }
  const restore = (translated) => {
    let out = translated;
    found.forEach((name, i) => {
      // Tolerate stray spacing the engine sometimes introduces inside the token.
      out = out.replace(new RegExp(`\\[\\s*\\[\\s*${i}\\s*\\]\\s*\\]`, "g"), name);
    });
    return out;
  };
  return { masked, restore, found };
}
