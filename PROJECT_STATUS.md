# CosmeticsBatch project status

Last updated: 2026-07-14
Current version: **0.4.0**
Current phase: **Phase 3 in progress — primary UX and accessibility**

This is the shared handoff document for maintainers and agents. Read it before
work and update it after every logical change group. Detailed audit evidence and
priorities live in `AUDIT.md`.

## In progress / operational blockers

- Resend domain and production delivery are live-verified.
- Production recipient: `contact@cosmeticsbatch.com`.
- The active API key is supplied as an encrypted GitHub Actions secret and must
  never be committed. Rotation is still recommended because it was shared in
  chat before being stored as a secret.
- Sender and recipient are both `contact@cosmeticsbatch.com`; no nonexistent
  `submissions@` mailbox is assumed.
- Version 0.2.2 commit `658d117` was pushed and GitHub Actions run `29317859558`
  deployed successfully on 2026-07-14. Live page/sitemap/API checks passed.
- An initial controlled production photo persisted with `not_configured`; after
  secret wiring, commit `fcb8268` deployed successfully in Actions run
  `29318501863`, and a second controlled submission returned HTTP 201 with
  `notification: sent`.
- Phase 2 high-confidence technical SEO/content-integrity fixes are complete;
  manufacturer/parent-company factual claims still need primary-source review.
- Reviewed long-form locale coverage is now enforced from
  `messages/content/reviewed.json`; English and fully reviewed Russian content
  remain indexable, while unreviewed article translations remain accessible but
  are `noindex, follow` and ad-free.
- Brand/catalog/editorial/decoder-guide/review-manifest invariants are enforced
  by the default 16-test regression suite.

## Completed — 0.2.0 (Phase 1)

### Decoder correctness and provenance

- Disabled unverified generic Julian fallback for unsupported brands.
- Added valid EAN/UPC/GTIN rejection before decoding.
- Fixed leap-year day 366 and L'Oreal current-month boundary behavior.
- Added verification profiles for all 18 registered decoders, with conservative
  confidence, source type, limitations and verification fields.
- No decoder is marked `VERIFIED` without a primary source and verification date.
- Added 12 regression/invariant tests covering all registered decoders.

### Data, SEO and advertising

- Replaced public hard-coded supported-brand counts with the central calculated
  value.
- Scoped advertising inventory/loading to reviewed, eligible pages.
- Corrected stale privacy and result-language claims found during the audit.
- Added the technical audit and prioritized findings to `AUDIT.md`.

### User photo submissions

- Added same-origin checks, rate limiting, size limits, file-signature checks and
  private filesystem storage outside `public/`.
- Client re-encodes images to JPEG to remove EXIF/GPS metadata.
- Added required reply email and explicit storage/contact/public-guide consent.
- Submissions persist in `submissions.jsonl` before any mail attempt.
- Added Resend notification with the photo attached and the user address in
  `Reply-To`; mail failure cannot discard the submission.
- Notification result is appended as `sent`, `failed`, or `not_configured`.
- Updated privacy and deployment documentation.

### Verification at Phase 1 handoff

- ESLint: passed.
- TypeScript `--noEmit`: passed.
- Decoder tests: 12/12 passed.
- Next.js production build: passed.
- Static generation: 264/264 pages generated.
- Real Resend delivery: **not run — credentials/domain verification unavailable**.
- `pnpm` wrapper attempted a registry/version check and failed in the restricted
  environment; the same lint/type/test/build commands passed through the checked-in
  local binaries. This is an environment issue, not a code failure.

## Next

### Phase 2 — technical SEO and content integrity

- Resolve remaining P0/P1 findings in `AUDIT.md` in dependency order.
- Audit canonical/hreflang/sitemap reciprocity across every active locale.
- Eliminate thin or duplicate programmatic brand pages unless verified,
  brand-specific value exists.
- Reconcile rendered FAQ content with FAQ JSON-LD.
- Complete brand/slug/parent-company and decoder-reference integrity checks.

### Phase 3 — primary user flow and accessibility

- Completed: improved 200+ brand selection, keyboard navigation, form semantics
  and mobile interaction.
- Completed: clarified manufacture date, estimated unopened shelf life, PAO,
  confidence and limitations in result UX.
- Improve invalid, ambiguous and unsupported-code guidance.
- Add a review workflow/status process for photo submissions.

### Phase 4 — performance and security hardening

- Measure mobile Core Web Vitals and client bundle/hydration cost.
- Review CSP/security headers, third-party scripts and production rate limiting.
- Replace in-memory rate limiting if multiple replicas are introduced.
- Add retention/deletion procedures for submitted photos and reply emails.

## Shared change log protocol

For every future change, append a concise entry below with date, version, owner,
files, reason, verification and known risk. Never include secrets or personal data.

### 2026-07-14 — 0.2.1 — Codex / Phase 2 group 1

- Changed: limited About, Contact, Privacy and Terms hreflang/sitemap exposure to
  their only reviewed language (English); non-English renderings are now
  `noindex, follow` until translated and reviewed.
- Files: `src/lib/seo.ts`, `src/app/sitemap.ts`, the four static route pages.
- Why: prevent English-only content from being advertised as 44 translated
  alternates and reduce mixed-language duplicate indexing.
- Verification: ESLint and TypeScript passed; production HTML confirmed English
  indexability and Turkish `noindex, follow`, with English-only hreflang.
- Risk / needs verification: external Search Console recrawl behavior must be
  observed after deployment.

### 2026-07-14 — 0.2.1 — Codex / Phase 2 group 2

- Changed: tied guide/decoder metadata, hreflang, sitemap alternates and ad
  eligibility to complete per-article review coverage.
- Files: `src/lib/content-review.ts`, guide and decoder detail pages,
  `src/app/sitemap.ts`.
- Why: generated translation files contain all 1,040 keys, but presence alone
  does not prove human review. Only English plus content explicitly approved by
  the review manifest should be promoted/indexed/monetized.
- Verification: ESLint, TypeScript and 12/12 decoder tests passed; production
  build generated 264/264 pages. Rendered HTML confirmed English and reviewed
  Russian are indexable/reciprocal, while unreviewed Turkish is `noindex,
  follow` and excluded from article hreflang.
- Risk / needs verification: the current manifest fully approves Russian; other
  locales will regain indexability article-by-article after editorial review.

### 2026-07-14 — 0.2.2 — Codex / Phase 2 group 3

- Changed: added default quality regression coverage for brand identity/core
  fields, decoder references, indexable editorial thresholds, exact sample
  decoding, decoder-guide coverage and content-review manifest integrity.
- Removed: the verified-unused static `HOME_FAQ` copy; the live homepage keeps
  one localized array shared by visible DOM and FAQ JSON-LD.
- Files: `scripts/quality-regression.test.ts`, `src/lib/faqs.ts`, `package.json`.
- Why: prevent new thin/indexable pages, orphan references and FAQ source drift
  from entering production silently.
- Verification: ESLint and TypeScript passed; expanded quality suite passed
  16/16; production build generated 264/264 pages.
- Risk / needs verification: parent-company factual accuracy still requires
  external primary-source review; structural consistency is now automated.

### 2026-07-14 — 0.2.2 — Codex / Phase 2 group 4

- Changed: made Article and Breadcrumb JSON-LD URLs locale-aware, centralized
  one breadcrumb schema in the visible Breadcrumbs component, removed duplicate
  BreadcrumbList output, and limited English-only HowTo JSON-LD to English.
- Files: `src/lib/seo.ts`, `src/components/breadcrumbs.tsx`, home, brand, guide,
  decoder detail and decoder index pages.
- Why: localized pages were declaring English structured-data URLs and some
  pages emitted the same breadcrumb schema twice; non-English HowTo text did not
  match the localized visible steps.
- Verification: rendered Russian guide, brand and decoder pages each emitted one
  localized BreadcrumbList and localized Article URL; Russian home emitted FAQ
  but no mismatched English HowTo. The first sandboxed build attempt failed when
  Turbopack could not bind its CSS worker port; the permitted rerun passed and
  generated 264/264 pages, confirming an environment restriction rather than a
  code regression.
- Risk / needs verification: HowTo can return to reviewed locales after its
  schema strings are translated from the same source as the visible steps.

### 2026-07-14 — 0.2.3 — Codex / Resend production wiring

- Changed: passed the encrypted GitHub Actions `RESEND_API_KEY` through the SSH
  action into the container runtime; configured sender/recipient as
  `contact@cosmeticsbatch.com`; deployment now fails loudly when mail variables
  are missing instead of silently shipping a disabled notification channel.
- Files: `.github/workflows/deploy.yml`, `deploy.sh`, `package.json`.
- Why: local git-ignored environment files are not transferred to the VPS by a
  Git push. The Actions secret must cross the SSH boundary explicitly.
- Verification: workflow syntax and deploy shell passed; Actions run
  `29318501863` completed successfully; controlled production upload returned
  HTTP 201 with `notification: sent`.
- Risk / needs verification: attachment visibility, inbox placement and the
  mail client's Reply-To target still require recipient-side confirmation.

### 2026-07-14 — 0.2.4 — Codex / User response standards

- Added: professional English-only response templates for identified
  codes, requests for clearer evidence, and unverifiable formats, plus one
  standard institutional signature and reviewer safety rules.
- Files: `docs/USER_REPLY_TEMPLATES.md`, `package.json`.
- Why: replies must be consistent, traceable and helpful without overstating
  manufacture-date confidence, authenticity, expiry, or product safety.
- Verification: editorial review completed against decoder confidence/privacy
  rules; recipient-side mail-client signature/snippet setup remains operational.
- Decision: all user-review replies use one English standard; no localized reply
  templates are maintained.

### 2026-07-14 — 0.2.4 — Codex / Release gate review

- Verified: no tracked Resend key, no repository secret match, clean diff
  whitespace, valid workflow YAML and deployment shell, ESLint, TypeScript,
  16/16 regression tests and a 264/264-page production build.
- Live verified: home, brands, reviewed brand, robots, sitemap and ads routes;
  non-English legal noindex; reviewed Russian Article URL; photo endpoint method
  protection; prior controlled mail submission accepted as `sent`.
- Corrected: stale project-status statements that still described completed
  regression and mail deployment work as pending.
- Known non-code verification: confirm the received Resend message contains the
  attachment and that Reply opens the submitting user's address.
- Environment note: the first build attempt hit the known sandbox-only
  Turbopack worker-port restriction; the permitted production-equivalent rerun
  passed. This is not a repository regression.

### 2026-07-14 — 0.2.5 — Codex / Brand locale quality gate

- Changed: indexable brand-page hreflang, robots and advertising now require a
  completely reviewed editorial locale; currently English and Russian qualify.
- Fixed: helpful guide titles on brand pages now use localized long-form content
  instead of raw English titles.
- Changed: the English-only photo form is rendered only on English brand pages,
  preventing mixed-language indexed pages until the form itself is translated.
- Changed: the English-only Guides index is indexable only in English; the
  localized Decoders index follows the complete editorial review allowlist.
- Changed: unreviewed/noindex brand, guide and decoder pages no longer publish
  Article or FAQ structured data for fallback or unreviewed copy.
- Files: `src/lib/content-review.ts`, brand detail route, sitemap, quality tests.
- Why: a translated file's presence is not proof of review, and English widgets
  on localized URLs weaken content quality and international SEO consistency.
- Verification: ESLint, TypeScript, 16/16 tests and 264/264 production build
  passed. Rendered English/Russian/Turkish brand, guide and decoder samples
  confirmed the expected robots/hreflang gates; unreviewed samples emitted no
  Article or FAQ schema and the English photo form did not leak into them.
- Risk / needs verification: new locales should be promoted only after their
  complete editorial corpus and brand-page UI are reviewed.
- Deployment: commit `944027d`, Actions run `29319717782`, completed
  successfully. Live English/Russian/Turkish samples matched the tested robots,
  hreflang, schema and photo-form visibility rules.

### 2026-07-14 — 0.2.5 — Codex / Data-first SEO decision hold

- Decision: paused the proposed brand-promotion automation before commit, push
  or deployment because changing index coverage without query/page evidence may
  remove valuable organic opportunities.
- Next input: Google Search Console and Yandex Webmaster exports/screenshots.
- Required analysis: page/query/country/device performance, indexed/excluded
  coverage, crawl and sitemap issues, cannibalization, locale demand and pages
  currently receiving impressions despite thin-content risk.
- Rule: no further broad robots, sitemap, canonical or hreflang changes until the
  webmaster evidence is reviewed together.

### 2026-07-14 — 0.2.5 — Codex / GSC evidence review (preliminary)

- Evidence: GSC query, page and country exports show meaningful demand outside
  English and Russian. Spain, Japan, Italy, Ukraine and Turkey generated the
  most non-English clicks; several localized brand URLs already earned clicks
  or top-10 positions, including Russian Escada, Spanish Nivea, Thai/Turkish
  Dior, Japanese Maybelline/Dove/Nivea and Vietnamese Neutrogena.
- Live verification: slash variants such as `/es/`, `/it/`, `/fi/`, `/ro/` and
  `/sv/` correctly return 308 to their slashless canonical URL; the duplicate
  rows in GSC are therefore historical consolidation signals, not two current
  200/indexable URLs.
- Risk: the 0.2.5 locale-wide editorial gate currently returns `noindex,
  follow` for some localized brand URLs with demonstrated search demand. It is
  not a ranking penalty, but retaining it can remove existing organic entry
  points after Google recrawls them.
- Preliminary decision: keep locale home pages indexable; replace locale-wide
  brand gating with a reviewed locale+brand eligibility model; keep weak,
  repetitive localized guide clusters gated; do not reopen every generated URL.
- Required before implementation: confirm the GSC date range and compare it to
  the 0.2.5 deployment date, then review Yandex evidence and page-filtered query
  exports for the highest-impression English brand pages.

### 2026-07-14 — 0.2.5 — Codex / Yandex Webmaster query evidence

- Source: user-supplied Yandex Webmaster XLSX covering 2026-06-12 through
  2026-07-12; 363 query rows, 517 impressions and 42 reported clicks.
- Signal: Russian brand-specific demand is much stronger than generic demand.
  Batch-code terms account for 226 impressions/23 clicks; shelf-life or
  manufacture-date terms for 128/12; authenticity-related terms for 44/9.
- Brand clusters: L'Oréal (55 impressions), Vichy (54), Kenzo (26), Estée
  Lauder (25), Dior (24), Garnier (18) and Kérastase (16) are the clearest
  content/CTR priorities. Several top-10 L'Oréal and Vichy queries have no click.
- Safety implication: authenticity intent is material, but a valid batch code
  cannot prove authenticity. Russian snippets and result copy must capture the
  intent without claiming counterfeit detection.
- Data caveat: some exported rows report more clicks than impressions, so totals
  and tiny samples are directional rather than suitable for URL-level automated
  promotion. This workbook contains queries, not landing-page evidence.

### 2026-07-14 — 0.2.5 — Owner decision / Strengthen before indexing

- Decision: do not reopen additional localized URLs merely because they have
  early GSC/Yandex signals. Keep the current index gates while existing
  indexable pages are strengthened and verified.
- Priority: improve current English/Russian brand pages and indexable locale
  entry pages, beginning with high-impression L'Oréal, Vichy, Kérastase, Dior,
  Nivea, Lancôme, Estée Lauder, Kenzo and Garnier demand clusters.
- Quality gate: each page must accurately distinguish batch-code decoding,
  estimated manufacture/shelf-life information and authenticity; no page may
  imply that a valid code proves authenticity.
- Measurement: establish pre-change query/page baselines, deploy improvements
  in small groups, and compare CTR, impressions and average position before any
  broader index expansion is reconsidered.

### 2026-07-14 — 0.3.0 — Codex / L'Oréal group content foundation

- Changed: strengthened all 39 current L'Oréal Group catalog pages with a
  localized, evidence-aware family section in the 10 demand-priority locales:
  English, Russian, Spanish, Japanese, Italian, Turkish, German, Indonesian,
  Vietnamese and Swedish.
- Corrected: metadata and introductions no longer promise a manufacturer expiry
  date or authenticity check; the page now states month precision, midpoint-day
  estimation, printed-date precedence, regional format variation and the fact
  that a copied batch code cannot prove authenticity.
- Fixed: the decoder-guide callout no longer leaks English into the 10 priority
  locales. The L'Oréal fact label now says the format is observed rather than
  presenting the repository's `UNKNOWN` decoder profile as manufacturer-verified.
- Data integrity: updated Color Wow to L'Oréal Group after the acquisition was
  officially reported as completed in September 2025. No decoder was assigned;
  packaging evidence is still required before claiming format compatibility.
- Index decision: unchanged. No locale was added to the review manifest and no
  URL was newly indexed. English is the source copy; Russian core copy was
  corrected; the other eight localized packages remain editorial drafts pending
  native-language review.
- Files: `messages/{en,ru,es,ja,it,tr,de,id,vi,sv}.json`, L'Oréal constants,
  brand route/catalog, editorial review document and quality regression tests.
- Verification: priority JSON parsing, full ESLint, TypeScript and production
  build passed; quality/decoder regression suite expanded from 16 to 18 tests
  and passed 18/18 after correcting one initially over-broad assertion. Local
  production HTML confirmed the L'Oréal family block on all 10 sample locales,
  no legacy English callout leakage, English/Russian `index, follow`, and the
  other eight locales still `noindex, follow`.
- Risk / needs verification: native editors must validate non-English natural
  phrasing before any locale review/index promotion. The observed L'Oréal code
  cycle still has no stored primary-source provenance and remains `UNKNOWN`.

### 2026-07-14 — 0.4.0 — Owner decision / Full public index coverage

- Decision: removed page-level `noindex` gates from all public brand, guide,
  decoder, company/legal and checker routes across every active locale. This
  intentionally supersedes the earlier reviewed-locale-only indexing policy;
  AdSense reapplication is not currently the governing constraint.
- Consistency: every public locale URL is emitted as its own sitemap entry with
  reciprocal hreflang; robots now allows `/check`; query-based checker results
  canonicalize to the locale's base `/check` page instead of creating one index
  target per user-entered code.
- Preserved safeguards: content review status still controls Article/FAQ schema
  and advertising eligibility where applicable. Indexability is not recorded as
  proof of native editorial review or decoder verification.
- Files: all metadata-gated public routes, `src/app/sitemap.ts`,
  `src/app/robots.ts`, checker metadata, quality tests and editorial records.
- Risk accepted by owner: broad indexing increases thin-content, duplicate and
  mixed-language exposure until remaining translations receive native review.
- Verification: full ESLint, TypeScript, 19/19 regression tests, diff check and
  production build passed. Rendered samples across brands, guides, decoders,
  company/legal and checker routes returned `index, follow` with self-canonical
  URLs; query checker variants canonicalized to `/check`; robots had no
  disallow. Sitemap emitted 11,352 localized URLs (about 1.99 MB), including
  Turkish Dior and Japanese Color Wow.

### 2026-07-14 — 0.4.0 — Codex team / Phase 3 parallel UX group 1

- Brand selector/form: added unique label/control relationships, complete
  combobox/listbox semantics, active-descendant keyboard behavior, Escape focus
  return, reachable no-results feedback, mobile viewport/overscroll limits,
  accessible batch-code errors and 44px touch targets.
- Result UX: separated decoded manufacture date and product age from estimated
  unopened shelf-life information; made the estimated date, PAO, confidence and
  existing English decoder limitations visually distinct; improved mobile cell
  stacking.
- Photo submission UX: added focus management, explicit missing-photo errors,
  live file/send/success announcements, clearer required email/consent text,
  iOS-safe input sizing, larger mobile targets and take-or-choose photo behavior.
  API, storage, email and privacy payload semantics were unchanged.
- Files: `src/components/check-form.tsx`, `src/components/result-card.tsx`,
  `src/components/code-photo-submission.tsx`.
- Verification: included in the full 0.4.0 ESLint, TypeScript, 19/19 tests,
  production build and rendered route checks above.
- Remaining Phase 3 work: native-language parity for the new detailed error
  guidance, retention/deletion policy approval, and a web reviewer UI only if a
  trusted external authentication boundary is introduced.

### 2026-07-14 — 0.4.0 — Codex team / Phase 3 parallel UX group 2

- Invalid/unsupported results: English result cards now expose existing decoder
  notes, explain that regional/older/contract-manufacturer formats may be valid
  but unsupported, avoid treating decode failure as proof of an invalid product,
  and link back to the checker or the private photo submission form.
- Form continuity: shared/refreshed `?code=` values hydrate back into the input;
  recent brands no longer duplicate alphabetical options; active keyboard
  options scroll into view; empty result navigation and accessible trigger names
  were tightened.
- Reviewer workflow: added a server-local, owner-only CLI that lists pending
  submissions without PII, shows a selected private record, and appends guarded
  `pending -> in_review -> awaiting_user/completed/discarded` review events.
  Replies remain in the authenticated contact mailbox; no photo/admin endpoint
  is exposed publicly.
- Files: result/check/photo components, `scripts/submission-review.mjs`,
  `docs/SUBMISSION_REVIEW_WORKFLOW.md`, package scripts.
- Verification: scoped agent lint/type checks passed. A controlled CLI fixture
  exposed and then corrected an invalid lock-cleanup call; the complete
  pending/list/show/in-review/completed flow and lock removal then passed. Full
  ESLint, TypeScript, 19/19 regression tests, CLI help smoke test, diff check and
  production build passed after the parallel changes were merged.
- Remaining decision: retention duration and deletion coverage for disk,
  mailbox and backups require owner/legal approval before adding automation.

<!-- Example:
### 2026-07-15 — 0.2.1 — agent/name
- Changed: ...
- Files: ...
- Why: ...
- Verified: lint, typecheck, test, build
- Risk / needs verification: ...
-->
