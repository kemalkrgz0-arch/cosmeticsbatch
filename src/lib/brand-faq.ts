import type { Brand } from "./brands";
import { DECODERS } from "./decoder";

/** Root translator (no bound namespace) — call with dotted keys. */
export type Translator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

const KNOWN_DECODERS = new Set(Object.keys(DECODERS));

/**
 * Build the brand's FAQ set from translation templates, so the whole block is
 * localised while brand names, groups and numbers stay literal. Powers both the
 * on-page accordion and the FAQPage JSON-LD.
 *
 * Note: we intentionally do NOT publish how a brand's code is decoded (the
 * cipher) — only where to find the code and how to use the result — so the
 * decoding method isn't handed to scrapers or counterfeiters.
 */
export function buildBrandFaqs(
  brand: Brand,
  t: Translator,
): { q: string; a: string }[] {
  const { name, group, shelfLifeMonths: shelf, paoMonths: pao, category } = brand;
  const noun = t(`categoryNoun.${category}`);
  const decoder =
    brand.decoderId && KNOWN_DECODERS.has(brand.decoderId)
      ? t("brandFaq.decoderKnown")
      : t("brandFaq.decoderAuto");
  const base = { name, group, noun, shelf, pao, decoder };
  const f = (k: string) => t(`brandFaq.${k}`, base);

  return [
    { q: f("q_where"), a: f("a_where") },
    { q: f("q_barcode"), a: f("a_barcode") },
    { q: f("q_expired"), a: f("a_expired") },
    { q: f("q_unopened"), a: f("a_unopened") },
    { q: f("q_pao"), a: f("a_pao") },
    { q: f("q_paoSymbol"), a: f("a_paoSymbol") },
    { q: f("q_afterExpiry"), a: f("a_afterExpiry") },
    { q: f("q_store"), a: t(`storageTip.${category}`) },
    { q: f("q_fake"), a: f("a_fake") },
    { q: f("q_accuracy"), a: f("a_accuracy") },
    { q: f("q_free"), a: f("a_free") },
  ];
}
