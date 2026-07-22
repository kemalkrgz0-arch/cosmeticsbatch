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
  const { name, group, shelfLifeMonths: shelf, category } = brand;
  const noun = t(`categoryNoun.${category}`);
  const decoder =
    brand.decoderId && KNOWN_DECODERS.has(brand.decoderId)
      ? t("brandFaq.decoderKnown")
      : t("brandFaq.decoderAuto");
  const base = { name, group, noun, shelf, decoder };
  const f = (k: string) => t(`brandFaq.${k}`, base);

  // "Where to find" (q_where), "How to store" (q_store) and "Is it fake?"
  // (q_fake) are promoted to visible body sections on the brand page (see
  // brandIntroSections), so they are intentionally omitted here to avoid
  // duplicating the same text in both the body and the FAQ / FAQPage schema.
  return [
    { q: f("q_barcode"), a: f("a_barcode") },
    { q: f("q_unopened"), a: f("a_unopened") },
    { q: f("q_afterExpiry"), a: f("a_afterExpiry") },
    { q: f("q_accuracy"), a: f("a_accuracy") },
    { q: f("q_free"), a: f("a_free") },
  ];
}

/**
 * The two topics we surface as visible body sections instead of burying in the
 * FAQ: where the code is physically located, and how to store the product.
 * Both reuse already-localised keys (so all languages are covered) and reveal
 * nothing about how the code is decoded.
 */
export function brandIntroSections(
  brand: Brand,
  t: Translator,
): { heading: string; body: string }[] {
  const { name, group, category } = brand;
  const noun = t(`categoryNoun.${category}`);
  return [
    {
      heading: t("brandFaq.q_where", { name }),
      body: t("brandFaq.a_where", { name, noun }),
    },
    {
      heading: t("brandFaq.q_store", { name, noun }),
      body: t(`storageTip.${category}`),
    },
    // Authenticity is a top query across every market (podlinnost / Echtheit /
    // "check fake"), so surface it visibly instead of burying it in the FAQ.
    {
      heading: t("brandFaq.q_fake", { name }),
      body: t("brandFaq.a_fake", { name, group }),
    },
  ];
}
