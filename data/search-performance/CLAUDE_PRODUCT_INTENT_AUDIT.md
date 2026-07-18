# Existing-brand-URL product-intent audit

Work item: `CLAUDE-PRODUCT-AUDIT-002`  
Owner: Claude (read-only evidence audit for primary Codex agent)  
Constraint: **No new product URL, route, sitemap entry or canonical.** Any later
experiment must reuse the existing `/brands/{slug}` landing page.

## Evidence boundary

- Source: `GSC-2026-07-19-01`, normalized `Sorgular.tsv` and
  `Sayfa-sayısı.tsv`; provenance is registered in `SOURCES.md`.
- Search Console export filter: Web / Last 3 months.
- Period caveat: the export label says Last 3 months, but its chart contains
  observed daily rows only from 2026-07-02 through 2026-07-16. Whether earlier
  zero-data days were omitted is `needs verification`.
- Query audit filter: a query must contain an identifiable brand name and an
  explicit product/product-category term (for example fragrance name,
  `perfume`, `lipstick`, `foundation`, `cream`, `shampoo` or sunscreen). Generic
  brand-plus-`batch code` queries are excluded. Matching is case-insensitive.
- Metrics below are query-row aggregates. Average position is
  impression-weighted. The export does not map a query row to its landing page,
  locale or country, so assigning a query to a particular URL is an inference.
- The compound query `"estée lauder" +"mac cosmetics"` (7 impressions) is
  reported separately and is not added to either brand's exclusive subtotal.
  This avoids double-counting and avoids pretending its product intent is known.
- Existing coverage was inspected in `messages/en.json` under `brandDetail` and
  in the current brand-page renderer. This is repository evidence, not proof of
  what Google indexed or displayed during the measured window.

## Measured product-intent groups

| Priority | Existing brand URL | Exact grouped queries | Clicks | Impressions | CTR | Weighted position | Existing English coverage | Confidence |
|---:|---|---|---:|---:|---:|---:|---|---|
| 1 | `/brands/mac-cosmetics` | `mac lipstick expiration date` (3); `expiry date of mac foundation` (2); `mac products expiry date` (1); `mac foundation expiry date` (1); `mac lipstick expiration` (1) | 0 | 8 | 0% | 42.1 | Direct and strong: code locations for lipstick, palettes and foundation; foundation-expiry FAQ with PAO/unopened distinction; lipstick authenticity FAQ. | Medium for intent, low for causal SEO conclusions |
| 2 | `/brands/dior` | `dior sauvage batch code` (4); `dior homme intense batch code` (1); `dior homme parfum batch code` (1); `dior homme batch code` (1); `dior homme intense batch codes` (1); `miss dior batch code` (1) | 0 | 9 | 0% | 33.0 | Partial: fragrance code location, perfume authenticity and general Dior code format are covered; Sauvage, Homme and Miss Dior are not named in the inspected detail copy. | Medium for repeated product-line demand, low for effect size |
| 3 | `/brands/nivea` | `nivea shampoo codecheck` (2); `nivea sonnencreme herstellungsdatum` (1); `nivea creme expiration date` (1) | 0 | 4 | 0% | 29.0 | Strong category coverage: tubes/cream, blue Creme tin and sun-care code locations; manufacture-date and sunscreen-expiry FAQs. Shampoo is not named in inspected detail copy. | Low due to four impressions |
| 4 | `/brands/loreal-paris` | `loreal lipstick expiry date` (1) | 0 | 1 | 0% | 53.0 | Partial: general cream, tube and bottle guidance exists, but lipstick is not named in inspected detail copy. | Very low |
| 5 | `/brands/chanel` | `chanel perfume checker` (1) | 0 | 1 | 0% | 31.0 | Strong general fragrance coverage: bottle/box location and code limitations. | Very low |

Additional observed row: `estee lauder production date` has 1 impression, 0
clicks and position 29.0, but it is manufacture-date intent rather than a named
product/category and is therefore outside the strict product-intent subtotal.
The compound Estée Lauder/MAC query has 7 impressions, 0 clicks and position
28.0; its operator-like syntax and lack of a product term make its intent
ambiguous.

Across the five exclusive product-intent groups above: **23 impressions, 0
clicks**. This is too little evidence for product-page creation even if that
were allowed, and too little for broad copy expansion.

## Page-level context

The page export gives useful prioritization context but cannot be joined to the
query rows:

| Existing page | Clicks | Impressions | CTR | Position | Interpretation |
|---|---:|---:|---:|---:|---|
| `/brands/dior` | 0 | 142 | 0% | 15.42 | Meaningful page visibility, but average position suggests ranking/content relevance precedes a CTR-only diagnosis. |
| `/brands/mac-cosmetics` | 0 | 73 | 0% | 18.49 | Existing content already covers the measured lipstick/foundation intent; weak rank and query-to-page attribution prevent claiming a copy gap caused performance. |
| `/brands/nivea` | 1 | 102 | 0.98% | 11.50 | Near page one; category guidance already covers most observed intent. |
| `/brands/loreal-paris` | 1 | 432 | 0.23% | 9.42 | High visibility, but only one strict product-intent impression in this export; the existing snippet experiment should not be conflated with product demand. |
| `/brands/chanel` | 0 | 43 | 0% | 37.21 | One product-intent impression does not justify expansion. |

## Prioritized recommendations

1. **Dior: small in-page product-line vocabulary experiment on the existing
   brand URL.** If Codex implements a product-intent section, one concise block
   may explain that the same Dior checker applies to Sauvage, Dior Homme/Homme
   Intense and Miss Dior, while retaining the existing warning that a decoded
   code cannot certify authenticity. Do not create headings or claims about
   product-specific algorithms unless decoder evidence supports them. Confidence:
   medium for vocabulary relevance; low that this alone improves rank.

2. **MAC: preserve and surface existing lipstick/foundation guidance rather
   than adding filler.** The current detail already answers the measured intent
   closely. A later renderer-level experiment may group those existing facts
   into a concise “lipstick and foundation” subsection inside
   `/brands/mac-cosmetics`; it should not duplicate the FAQ or invent separate
   expiry promises. Confidence: medium that coverage is adequate; low that more
   text helps.

3. **NIVEA: no immediate expansion.** The existing page already covers Creme,
   tubes and sun care. Shampoo could be mentioned only if verified packaging
   evidence confirms that the existing bottle-location guidance applies; one
   four-impression slice is not enough by itself. Confidence: low.

4. **L'Oréal Paris and Chanel: observe, do not implement product-targeted copy
   from this export.** Each has one strict product-intent impression. Confidence:
   very low.

5. **Measurement:** after any single-brand experiment is released, compare the
   same page and query family over a complete follow-up window. Record clicks,
   impressions, CTR and position without replacing this baseline. Change one
   brand group at a time where practical; otherwise attribution will remain
   weak.

## Evidence gaps and guardrails

- Search Console did not export query-to-page pairs, so no row proves which
  locale or brand page received the impression.
- The companion `WEBMASTER-2026-07-19-01` source has zero observations and adds
  no evidence.
- Query volume is sparse and the measured-period completeness is unverified.
- No external manufacturer source was audited here. Product-specific placement,
  PAO, shelf-life or decoder claims require separate verification before use.
- No new product URL, localized product slug, product route, sitemap record,
  hreflang target, canonical or structured-data product entity is recommended.
  Existing brand URLs remain the sole landing pages.
- This audit does not authorize code or message edits. Codex must record any
  selected implementation and acceptance criteria in the shared ledgers first.
