# Search performance finding ledger

Agents must claim a unique analysis slice here before starting. States are
`Claimed`, `Completed`, `Implemented`, and `Measured`. A finding is not proof of
causation; label interpretations and confidence honestly.

## Active claims

| Finding ID | Owner | State | Source and slice | Started | Scope |
|---|---|---|---|---:|---|
| GSC-BRAND-2026-07-19-01 | primary Codex agent | Implemented locally | `GSC-2026-07-19-01`; English prefix-free brand pages; impressions ≥100 | 2026-07-19 | CTR/ranking triage without editing other locales or review operations |
| GSC-PRODUCT-2026-07-19-02 | Claude evidence audit / primary Codex implementation | Implemented locally | `GSC-2026-07-19-01`; identifiable brand + explicit product/product-category query | 2026-07-19 | Existing brand URLs only; no product URL/route/sitemap/canonical/schema |

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
