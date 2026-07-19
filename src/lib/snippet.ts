/**
 * Search snippet budgets.
 *
 * Deliberately dependency-free: the quality suite compiles with a bare `tsc`
 * that does not resolve the `@/` path alias, so anything it imports has to stay
 * clear of the wider app graph. Keeping these here lets the regression test hold
 * the real function rather than a copy of the rule.
 */

/** Where search engines cut a title. A soft limit — they measure pixels, not characters. */
export const TITLE_BUDGET = 60;

/** Where search engines cut a description. Also a pixel measurement in practice. */
export const DESCRIPTION_BUDGET = 160;

export function snippetLength(value: string): number {
  return [...value].length;
}

/** Keep metadata inside a character budget without cutting through a word. */
export function fitSnippet(value: string, budget: number): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (snippetLength(clean) <= budget) return clean;
  const slice = [...clean].slice(0, Math.max(1, budget - 1)).join("");
  const wordBoundary = slice.lastIndexOf(" ");
  const shortened = wordBoundary >= Math.floor(budget * 0.65)
    ? slice.slice(0, wordBoundary)
    : slice;
  return `${shortened.replace(/[\s,;:–—-]+$/u, "")}…`;
}

/**
 * Pick the longest title that still survives the search snippet.
 *
 * Brand names vary from "Dior" to "Giorgio Armani Beauty", a 17-character
 * spread, so one template cannot fit every brand. Shortening the template until
 * the longest brand fits would spend the whole budget on the worst case and
 * strip the tail that earns the click from every short-brand page. Instead each
 * locale carries both forms and the long one is used wherever it fits.
 */
export function fitTitle(long: string, short: string): string {
  return snippetLength(long) > TITLE_BUDGET ? short : long;
}
