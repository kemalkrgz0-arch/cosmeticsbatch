/**
 * Which hint a failed check should show — not the words it shows.
 *
 * The words used to live here, in a hardcoded `{ en, tr }` object. That put the
 * strings a person reads at the exact moment the tool failed them outside the
 * translation loop, so seventeen locales read them in English while the rest of
 * the site spoke their language. Every translation pass missed them for the same
 * reason: nothing in `messages/` referred to them.
 *
 * They now live in the `resultFailure` namespace and are rendered by
 * [[result-card]]. What stays here is the part that is logic rather than copy:
 * deciding which lookalike a code matches, which is testable without a locale.
 */

/**
 * Paris postcodes (75001–75020, plus 75116) printed in the address block that
 * cosmetics packaging carries for its EU responsible person.
 *
 * People type them into the checker as batch codes: "75008" arrived for two
 * different brands and "75116" for a third, from three different countries, so
 * this is a pattern rather than a one-off. None of them can ever decode — there
 * is no 500th day of a year — so recognising the shape here cannot mask a real
 * read; it just stops the user hunting for a code they have already walked past.
 */
const PARIS_POSTCODE = /^75(0(0[1-9]|1\d|20)|116)$/;

/**
 * French packager registration, printed as "EMB 60350" in the address block.
 *
 * It sits directly beside the batch code on French-made cosmetics — both YSL
 * cartons photographed on 2026-07-20 show the two within a centimetre of each
 * other — and it is the more official-looking of the pair, so it gets typed.
 * "EMB60350" also happens to satisfy the L'Oréal letter-then-month shape, which
 * is how it reached a decoder at all.
 */
const EMB_REGISTRATION = /^EMB\d{3,6}$/;

/** Key into `resultFailure.hint`, or null when no lookalike matches. */
export type FailureHintKey = "address" | "emb" | "printsDate";

/**
 * Nudge for brands that print a readable date instead of encoding one.
 *
 * `printsDate` is already recorded per brand and shown on the brand page, but it
 * was not reaching the person who had just been told their code was unreadable.
 * That was the whole of the failure for two brands: Skin1004 and Beauty of
 * Joseon returned no date on 23 of 23 logged checks, and 41 of the 46 K-beauty
 * brands carry the same flag. There is no decoder to write here — the date is
 * on the pack in plain text, and saying so is the correct answer rather than a
 * consolation for not having one.
 */
export function printsDateHintKey(printsDate: boolean | undefined): FailureHintKey | null {
  return printsDate ? "printsDate" : null;
}

/** Which address-block lookalike the entered code matches, if any. */
export function addressLookalikeKey(code: string): FailureHintKey | null {
  const value = code.trim();
  if (EMB_REGISTRATION.test(value.toUpperCase().replace(/[\s-]+/g, ""))) return "emb";
  return PARIS_POSTCODE.test(value) ? "address" : null;
}
