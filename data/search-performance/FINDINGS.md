# Search performance finding ledger

Agents must claim a unique analysis slice here before starting. States are
`Claimed`, `Completed`, `Implemented`, and `Measured`. A finding is not proof of
causation; label interpretations and confidence honestly.

## Active claims

| Finding ID | Owner | State | Source and slice | Started | Scope |
|---|---|---|---|---:|---|
| GSC-BRAND-2026-07-19-01 | primary Codex agent | Implemented locally | `GSC-2026-07-19-01`; English prefix-free brand pages; impressions ≥100 | 2026-07-19 | CTR/ranking triage without editing other locales or review operations |
| GSC-PRODUCT-2026-07-19-02 | Claude evidence audit / primary Codex implementation | Implemented locally | `GSC-2026-07-19-01`; identifiable brand + explicit product/product-category query | 2026-07-19 | Existing brand URLs only; no product URL/route/sitemap/canonical/schema |
| GSC-SURFACE-2026-07-21-01 | Claude | Completed — analysis only, no change proposed yet | `GSC-2026-07-21-01`; whole property, device and country splits plus English brand pages ≥30 impressions | 2026-07-21 | Read-only measurement. No code, copy, locale-policy or ad-eligibility change is made under this claim |

## Findings

### GSC-BRAND-2026-07-19-01 — high-impression English brand pages

- Source: `GSC-2026-07-19-01`, `Sayfa sayısı.tsv`.
- Search Console filter: Web / Last 3 months. The chart contains daily rows only
  for 2026-07-02 through 2026-07-16; whether earlier zero-data days were omitted
  by the export is `needs verification`.
- Exact analysis filter: prefix-free `/brands/{slug}` rows with at least 100
  impressions, sorted by impressions descending.
- Baseline: L'Oréal Paris — 432 impressions, 1 click, 0.23% CTR, position 9.42;
  Dior — 142, 0, 0%, 15.42; Vichy — 134, 3, 2.24%, 7.36; Kérastase — 121, 0,
  0%, 7.76; Lancôme — 119, 1, 0.84%, 10.59; Nivea — 102, 1, 0.98%, 11.50.
- Interpretation: L'Oréal Paris and Kérastase already rank on page one but
  materially trail Vichy's CTR, making them the cleanest snippet experiment.
  Dior's position indicates a ranking/content problem first. This comparison is
  directional because query mix and measured period are unavailable.
- Confidence: medium for prioritization; low for causation.
- Proposed action: test evidence-backed English titles/descriptions for L'Oréal
  Paris and Kérastase only; keep every claim within existing on-page detail.
- Implementation: `BRAND-VALUE-004` (local only); focused verification passed.
- Follow-up: compare the same page/filter over a complete post-release window;
  add impressions, clicks, CTR and position here without replacing the baseline.

### GSC-PRODUCT-2026-07-19-02 — product intent on existing brand URLs

- Evidence audit: `CLAUDE_PRODUCT_INTENT_AUDIT.md`; independently reviewed by
  the primary Codex agent before implementation.
- Source/filter: `GSC-2026-07-19-01`, Web / Last 3 months. Observed chart rows
  cover 2026-07-02–2026-07-16; query-to-page attribution and earlier omitted
  days remain `needs verification`.
- Exact filter: query contains an identifiable brand plus an explicit named
  product or product category; generic brand + batch-code rows are excluded.
- Baseline: Dior product families — 9 impressions, 0 clicks, weighted position
  33.0; MAC lipstick/foundation — 8, 0, 42.1; NIVEA product categories — 4, 0,
  29.0; L'Oréal Paris lipstick — 1, 0, 53.0; Chanel perfume — 1, 0, 31.0.
- Interpretation: only Dior has both repeated named-product vocabulary
  (Sauvage, Dior Homme/Homme Intense, Miss Dior) and meaningful page-level
  visibility (142 impressions, position 15.42). MAC already answers its query
  intent closely; all other slices are too sparse for expansion.
- Confidence: medium that a concise Dior vocabulary block closes a content
  coverage gap; low that it alone will improve ranking.
- Selected action: add one English Dior FAQ inside the existing `/brands/dior`
  page, stating that the existing Dior checker accepts codes from those product
  families and retaining the existing authenticity limitation. Do not describe
  a product-specific algorithm.
- Binding constraint: no new URL, route, sitemap entry, hreflang/canonical,
  Product schema or localized product slug.
- Implementation: one English FAQ was added to the existing Dior brand detail;
  regression coverage confirms the three product families remain consolidated
  there and no corresponding product/nested-brand route exists. Local only.
- Follow-up: measure the same query family and `/brands/dior` after one complete
  post-release window; preserve this baseline.

### GSC-SURFACE-2026-07-21-01 — the site ranks, and then loses the click

- Source/filter: `GSC-2026-07-21-01`, Web / Last 28 days. Observed chart rows
  cover 2026-07-02–2026-07-19. Query-level totals (713 rows, 6 clicks, 1,474
  impressions) are far below the device totals (102 clicks, 4,822 impressions)
  because Google withholds low-volume queries; all query-level shares below are
  therefore directional, not exhaustive.
- Baseline, device split: mobile 83 clicks / 2,179 impressions / CTR 3.81% /
  position 10.53. Desktop 18 / 2,607 / 0.69% / 35.57. Tablet 1 / 36 / 2.78% /
  11.61.
- Baseline, English brand pages by impressions: loreal-paris 457 impressions,
  1 click, 0.22%, position 9.47; dior 196, 0, 0.00%, 14.09; vichy 184, 5, 2.72%,
  7.63; lancome 177, 2, 1.13%, 9.76; kerastase 158, 0, 0.00%, 7.78; nivea 130,
  1, 0.77%, 11.38; estee-lauder 129, 2, 1.55%, 9.05; mac-cosmetics 90, 0, 0.00%,
  16.51; bottega-veneta 37, 0, 0.00%, 9.00.
- Baseline, English head terms: `batch code` position 41.19 (36 impressions, 0
  clicks); `batch code checker` 41.83 (23, 0); `batch number` 81.92 (25, 0);
  `perfume batch code` 49.06 (17, 0); `batch code check` 44.73 (15, 0).
- Baseline, country CTR: Spain 8.82%, Japan 6.78%, Ukraine 5.76%, Italy 5.36%,
  Russia 5.06%, Türkiye 4.00% against United States 0.86% (813 impressions, the
  largest single market), United Kingdom 0.75%, Netherlands 0.00% (278), Canada
  0.00% (220).
- Interpretation, held separately from the numbers above. Ranking is not the
  binding constraint on brand pages: eight of them sit inside the first two
  positions-pages and still return almost nothing. Vichy is the control that
  makes this readable — same position band, 2.72%, so the template is capable of
  converting and something page-specific is suppressing the rest. The snippet is
  the first thing to inspect, not the ranking.
- Interpretation, desktop. Desktop draws more impressions than mobile and sits
  twenty-five positions worse. Whatever desktop is being shown for, the site is
  not competitive on it, and the impressions are not reachable traffic.
- Interpretation, language. Every attributed query click in the export is
  non-English, and the highest-CTR countries are all non-English while the
  largest impression markets convert near zero. This sits in tension with the
  current policy of English-only ad eligibility and en/ru-only indexable brand
  pages. Recording the tension only; the policy exists for editorial-quality
  reasons this data cannot speak to.
- Confidence: high on the measurements, medium on the snippet interpretation,
  low on any causal claim about desktop.
- Checked and deliberately not a finding: `/ca/guides`, `/sr/...` and `/bg/...`
  still draw impressions, but all six sampled URLs return 308 to their English
  equivalents. These are stale index entries for correctly retired locales, not
  a redirect defect. Do not "fix" them.
- Follow-up: no action proposed under this claim. A snippet audit of the
  zero-CTR brand pages against Vichy is the obvious next slice and needs its own
  claim.
