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

#### GSC-SURFACE-2026-07-21-01, language and vocabulary extension

- Script split of the 713 query rows, weighted by impressions: Latin 1,248
  impressions and 0 attributed clicks; Cyrillic 139 and 4; CJK 34 and 1; Thai 6
  and 1. Every attributed query click in the export is non-Latin.
- Caveat that limits how hard this can be read: query rows account for 1,474 of
  4,822 impressions and 6 of 102 clicks, so 96 clicks are unattributed and may
  well be Latin. The country table is the safer instrument and says the same
  thing more moderately — United States 0.86% over 813 impressions, United
  Kingdom 0.75%, Netherlands 0.00% over 278, Canada 0.00% over 220, against
  Spain 8.82%, Japan 6.78%, Ukraine 5.76%, Italy 5.36%, Russia 5.06%.
- Locale investment does not match where the clicks are. Ukraine returns 8 clicks
  at 5.76% and `uk` is a retired locale. Bulgaria still earns clicks on retired
  `bg` URLs. Netherlands is an investment-pilot locale and returned 0 clicks on
  278 impressions; Canada returned 0 on 220.
- The sharper version of the same problem, from the query rows: the site already
  ranks top-ten for native batch-code vocabulary in languages it does not serve.
  `batchkode` position 4.6, `fecha de fabricación` 4.8, `dior batch kodu
  sorgulama` 6.6, `batchkod parfym` 7.7, `batch kod` 8.0, `provera batch koda
  parfema` 8.0, `kosmetiikan valmistuspäivä` 8.0, `zara perfume expiry date` 5.3.
  Finnish, Serbian and Norwegian are retired locales; a searcher in those
  languages reaches an English page and an English snippet. Zero clicks at
  position 8 is the expected outcome of that, not a mystery.
- Vocabulary: weighted by impressions the user's words are `batch` 526, `code`
  418, `check` 274, `date` 255, `perfume` 139, `expiry` 138, `expiration` 116,
  `how` 100, `long` 78, `last` 67, `expire` 47. Combined, the expiry family is
  301 — comparable to `check`. The live English home page uses `manufacture`
  seven times, `shelf life` five, `expir*` four and `how old` none, and the brand
  snippets lead on manufacture date and shelf life.
- Interpretation, and the constraint that makes it interesting: the mismatch is
  deliberate. This project refuses to present a manufacturer expiry date it
  cannot read, and that refusal is correct and should not be traded for CTR. The
  available move is bridging vocabulary rather than false vocabulary — meeting
  the searcher's word and immediately saying what the site can and cannot tell
  them. Any such change belongs in its own claim with a snippet experiment.
- Confidence: high on the vocabulary counts and the ranking positions, medium on
  the locale-coverage reading, low on any claim that language alone explains the
  English CTR.

### WEBMASTER-2026-07-21-02 — Yandex was never empty

- Correction first, because it invalidates two earlier statements in this
  repository and two reports made to the owner. `SOURCES.md` recorded the
  2026-07-19 and 2026-07-21 Yandex exports as "zero observations", and that was
  read as a broken export. It was our own importer. Yandex writes a
  `<dimension>` of `A1:A1` on sheets that carry hundreds of rows; openpyxl in
  read-only mode believes it and yields the header alone. The three exports hold
  589, 735 and 775 query rows. `scripts/import-search-performance.py` now calls
  `reset_dimensions()` before iterating, and all three have been re-imported.
- Source/filter: `WEBMASTER-2026-07-21-02`, period stated in every row as
  2026-06-19–2026-07-19. 775 query rows.
- Baseline: 1,109 impressions, 99 clicks, CTR 8.93%, impression-weighted average
  position 7.48. Cyrillic 680 queries / 982 impressions / 89 clicks / 9.06%;
  Latin 95 / 127 / 10 / 7.87%.
- The comparison that matters. Over a comparable month Google returned 102 clicks
  from 4,822 impressions at 2.12%, and Yandex returned 99 clicks from 1,109 at
  8.93%. Yandex delivers the same click volume from less than a quarter of the
  impressions, at an average position twenty-eight places better. This channel
  has been invisible in every prior analysis, including the language and
  vocabulary extension above, which should be re-read with that in mind.
- Data caveat: individual rows can show CTR above 100% because Yandex attributes
  clicks across position bands. Trust the totals and the ordering, not a single
  row's percentage.
- Demand signal against brand visibility, matching query tokens to slugs:
  loreal 120 impressions / 13 clicks, vichy 73/6, estee-lauder 61/4, dior 42/5,
  garnier 38/5, kerastase 32/4, creed 30/4, tom-ford-beauty 25/3,
  gucci-beauty 20/0, roberto-cavalli 11/2, bottega-veneta 8/2, aesop 3/2. One
  brand in the list is staged out: `color-wow`, 12 impressions and 3 clicks while
  hidden from the picker for want of a verified decoder. Demand exists for a
  brand the site deliberately does not serve; that is a decoder-verification
  priority, not a reason to unhide it.
- Interpretation: Russian-language batch-code intent converts several times
  better than the English market the site is currently optimised and monetised
  for, at positions the site already holds. `ru` is presently an
  organic-preservation locale and ad inventory is English-only.
- Confidence: high on the totals and the importer defect; medium on the brand
  token matching, which is string matching over transliterations and will both
  miss and over-collect.
