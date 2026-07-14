# CosmeticsBatch project status

Last updated: 2026-07-14
Current version: **0.5.2**
Current phase: **Phase 3 in progress — primary UX, accessibility and SEO correction**

This is the shared handoff document for maintainers and agents. Read it before
work and update it after every logical change group. Detailed audit evidence and
priorities live in `AUDIT.md`.

## Current production snapshot — read before changing anything

- Production branch: `main`; deployment is triggered by GitHub Actions and
  rebuilds/restarts the VPS container over SSH.
- Current production baseline: commit `a771f0c`; GitHub Actions deploy run
  `29330602612` completed successfully. Package/document version is `0.5.2`.
- Framework: Next.js 16 App Router, React 19, TypeScript and `next-intl` with 44
  active locale routes. English is prefix-free; other locales use `/{locale}`.
- Public indexing policy: the owner explicitly chose indexability for all public
  locale pages while AdSense reapplication is paused. Do not silently restore a
  broad `noindex` policy. Content-review flags still control structured data and
  ad eligibility where implemented.
- Decoder policy: never invent or silently broaden a brand algorithm. Unknown or
  weakly sourced formats must remain conservative; manufacture date, typical
  unopened shelf life and PAO are separate concepts. A decoded code cannot prove
  authenticity.
- Query data: real-user checks can be sent to the server and appended to the
  private dataset with code, brand, result, locale, time and coarse country. IP,
  name and account identifiers are not written to this dataset. Any UI or SEO
  copy claiming “browser-only”, “never sent” or “nothing stored” is incorrect.
- Photo data: users can select 1–3 camera/gallery images. The browser resizes and
  re-encodes them, then the server validates and stores them outside `public/` in
  the private bind-mounted submission store. Email and explicit consent are
  required. Records and reply events are append-only.
- Review operations: `/review/*` is protected by Cloudflare Access and origin JWT
  verification. The panel shows private submissions and recent query records,
  streams protected images and sends professional English replies through
  Resend. Never weaken the Access check or publish uploaded images directly.
- Mail: Resend is live using `contact@cosmeticsbatch.com` for sender/recipient.
  Runtime secrets live only in encrypted GitHub Actions/VPS configuration. The
  key exposed earlier in chat should eventually be rotated; never copy it into
  code, documentation, commits or logs.
- Logo behavior: official-domain favicon sources are mapped for 206/212 public
  brands. Version 0.5.2 removed DuckDuckGo/Google favicon proxies because their
  HTTP-200 grey arrow placeholders were displayed as brand logos. Missing or
  blocked official favicons must fall back to controlled tiles/monograms.
- Verification baseline: 21 regression tests cover decoder invariants, data
  integrity, locale photo-copy completeness, logo-source safety and public
  index policy. Use local binaries if the `pnpm` wrapper tries a registry check
  in a restricted/TTY-less environment.

## Active findings / next dependency-ordered work

1. P0 truthfulness: replace the homepage `expiry date` / `help check
   authenticity` meta promise with estimated manufacture-date, product-age,
   typical unopened shelf-life and PAO language.
2. P0 privacy consistency: audit all 44 locale message files and remove stale
   claims that decoding is browser-only or that codes are never sent/stored.
   English/privacy pages already describe the current server dataset correctly.
3. P1 structured data: align Organization/HowTo descriptions with the same
   cautious language; do not describe an estimated shelf-life date as a
   manufacturer expiry date.
4. P1 locale directory: `/[locale]/brands` currently hard-codes English title,
   description, breadcrumb, H1 and ItemList labels. Its JSON-LD item URLs also
   point to prefix-free English brand URLs. Localize the visible/metadata copy
   and generate locale-aware structured-data URLs.
5. P1 count accuracy: the directory currently says listed example brands “and
   {BRANDS.length}+ more”, which overstates the total. Use one central total and
   wording such as “Browse 212 supported brands, including …”.
6. P1 content quality: Google still shows cached legacy `Expiry Date &
   Authenticity` titles for several brand pages. Current English metadata is
   safer, but recrawl should be requested only after the remaining global claims
   are fixed. Do not mass-submit thousands of URLs.
7. P1/P2 localization: live search evidence shows mixed-language and awkward
   long-tail pages (for example Italian English fallback blocks and Korean
   guide fragments). Strengthen existing high-impression URLs before creating
   new programmatic pages.
8. P2 brand uniqueness: prioritize verified examples, packaging location,
   provenance and limitations for high-impression brands. Do not manufacture
   “unique” filler or repeat one template with only a brand-name substitution.

## Complete phase ledger and remaining roadmap

The original audit defined 20 work areas. “Phase” below is the implementation
sequence used by this repository, not permission to skip unresolved audit areas.

### Phase 1 — correctness, security baseline and submissions — COMPLETE

- Completed: repository/audit baseline, decoder registry/provenance levels,
  impossible/future-date checks, EAN rejection, decoder fixtures, calculated
  brand counts, submission validation, private image storage, consent, Resend
  notification and privacy documentation.
- Still operational, not a code blocker: rotate the Resend key exposed in chat;
  approve a retention/deletion duration for photos, emails, query logs and
  backups; document deletion-request handling.
- Acceptance already met: lint/typecheck/build and decoder regression coverage;
  production Resend delivery was live-verified.

### Phase 2 — technical SEO and content integrity — PARTIAL

- Completed: canonical/hreflang helpers, locale-aware article/breadcrumb schema,
  stable sitemap timestamps, FAQ DOM/JSON-LD source unification, editorial review
  manifest, cautious English brand metadata, L'Oréal priority-locale foundation
  and public-index regression checks.
- Owner decision retained: all public pages are indexable for now. This increased
  exposure before all translations/content passed editorial review.
- Remaining P0/P1: homepage claim correction; privacy-copy parity in all locales;
  `/[locale]/brands` localization and locale-aware ItemList URLs; accurate total
  wording; schema claim correction; canonical/hreflang live sample matrix; URL
  slash/redirect-chain audit; sitemap size/index coverage review; broken/orphan
  internal-link crawl; duplicate titles/descriptions report.
- Remaining content work: repair mixed-language/awkward translations; review
  high-impression brand pages first; eliminate unsupported “manufacturer-
  specific”, “accurate”, “expiry” and authenticity claims; add primary-source
  provenance without fabricating brand facts.
- Acceptance: priority pages render one self-canonical, reciprocal reviewed
  hreflang, locale-correct metadata/schema, no conflicting privacy claims and no
  stale hard-coded totals; regression crawl and production samples pass.

### Phase 3 — primary UX, accessibility and review operations — PARTIAL

- Completed: accessible searchable brand combobox, keyboard behavior, recent
  brand continuity, input/error semantics, mobile targets, separated result
  concepts, invalid-code guidance, 1–3 photo selection, 44-locale photo form,
  protected review panel, query list, workflow events, Resend replies and the
  compact How It Works redesign.
- Completed with limitation: official-domain logo mapping covers 206/212 public
  brands; only a favicon/controlled fallback is used, not a licensed local
  wordmark asset library. Six discontinued licensed lines have no trusted active
  official site.
- Remaining UX: test the complete checker/result/photo flow on real iOS Safari
  and Android Chrome; verify RTL layout; add safe photo thumbnails/removal before
  submit if user testing shows need; improve ambiguous/unsupported states in all
  locales; audit long translated strings, focus order, screen-reader announcements,
  color contrast, reduced motion and zoom/overflow.
- Remaining review operations: retention/deletion controls, search/filter/paging
  for large queues, explicit resend/failure recovery, audit export and backup
  restore test. Any panel expansion must preserve Cloudflare Access plus origin
  JWT enforcement.
- Acceptance: keyboard-only and screen-reader flow passes; mobile has no
  horizontal overflow/input zoom; every submission/reply state is recoverable;
  private content never appears in sitemap, public assets or search results.

### Phase 4 — decoder reliability and data integrity expansion — PARTIAL

- Completed: 18 decoder profiles are registered conservatively, every registered
  decoder has a known fixture, unsupported brands do not use a generic date
  fallback, normalization/leap/future/decade baseline tests exist, and brand/
  decoder reference integrity is tested.
- Remaining decoder audit: verify each algorithm against primary manufacturer or
  independently corroborated examples; store source reference, source type,
  decoder version, verified date, supported formats, examples and limitations;
  review overlapping regex matches, serial-number handling and decade ambiguity;
  expand malformed/too-short/too-long/case/Unicode/invisible-character fixtures.
- Remaining data audit: primary-source parent-company validation, acquisitions
  and historical packaging variants; shelf-life/category review; alias/old-name
  handling; locale slug collision report; orphaned/inactive decoder/page report.
- Rule: uncertain algorithms remain findings. Never “improve” a decode rule from
  intuition or SEO copy.
- Acceptance: every public decoder claim maps to stored evidence and tests; no
  impossible/future date or unsupported generic fallback can be returned.

### Phase 5 — performance and Core Web Vitals — NOT YET COMPLETED

- Measure production mobile LCP, CLS and INP by template: home, brand, guide,
  decoder, result and review panel. Targets are LCP <2.5s, CLS <0.1, INP <200ms,
  not guarantees.
- Analyze client/server component boundaries, hydration cost, brand dataset sent
  to the browser, third-party scripts, AdSense impact, font/image loading,
  caching/static generation, bundle composition and repeated serialization.
- Validate the new official-domain logo requests for latency/privacy; consider a
  curated locally hosted asset set only after trademark/source/licensing review.
- Fix the existing Next.js NFT warning caused by filesystem tracing around the
  photo route without breaking bind-mounted private storage.
- Acceptance: before/after lab and field evidence, no checker regression, stable
  ad/image slots and documented cache behavior.

### Phase 6 — security/privacy hardening — PARTIAL

- Completed: same-origin submission checks, signature/size limits, EXIF-removing
  client re-encode, rate limit, private paths, containment checks, Cloudflare
  Access plus origin JWT verification, no-store/noindex panel responses and
  encrypted deployment secrets.
- Remaining: CSP and full security-header audit; dependency vulnerability review;
  analytics/error/log payload inspection; durable distributed rate limiting if
  replicas increase; upload decompression/resource-exhaustion tests; retention
  jobs; backup encryption/access/restore audit; reviewer session/MFA policy;
  secret rotation and incident procedure.
- Acceptance: documented threat model, header scan, dependency report, abuse
  tests and verified deletion/restore procedures.

### Phase 7 — international editorial quality — NOT YET COMPLETED

- Ten demand-priority locales received partial focused work, but this is not a
  native-editor sign-off for every page. Long-tail locales still contain mixed
  language, literal machine phrasing and stale behavior claims.
- Build a page/key review matrix for home, brands directory, priority brand
  pages, guides, decoder pages, legal/privacy and photo flow. Record reviewer,
  date and reviewed source version; do not label machine drafts “human reviewed”.
- Keep brand names untranslated and normalize Batch code, barcode/EAN, PAO,
  manufacture date, estimated unopened shelf life and authenticity terminology.
- Acceptance: priority locale pages pass native editorial review, visible DOM and
  metadata/schema agree, and fallback English is intentional and disclosed or
  the locale URL is withheld from promotion.

### Phase 8 — AdSense readiness and content value — NOT YET COMPLETED

- Do not reapply until P0 truth/privacy issues, mixed-language pages and priority
  thin-content clusters are fixed. Indexability alone is not content quality.
- Strengthen high-impression pages with verified brand-specific code examples,
  provenance, packaging location, limitations and useful related guides. Photo
  submissions may improve evidence only after review/permission; user uploads
  are never automatically published.
- Audit ad placements for CLS, accidental-click proximity and mobile content
  interruption. Keep checker interaction and results clear of aggressive ads.
- Acceptance: manual sample audit shows substantial unique value, About/Contact/
  Privacy/Terms are accurate, navigation works, and ad slots preserve CWV/UX.

### Phase 9 — observability, maintenance and release discipline — PARTIAL

- Existing: GitHub Actions VPS deploy, append-only private datasets, review UI,
  regression tests and this shared status log.
- Remaining: automated post-deploy health/smoke checks, error monitoring without
  code/PII leakage, dataset/mail failure alerts, backup monitoring, release tags,
  rollback runbook, dependency update cadence and scheduled SEO/CWV reporting.
- Every logical group must update this file with version, owner/agent, reason,
  files, tests, deploy run and remaining risk. Never mark a phase complete only
  because code was pushed.

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
- Reviewed long-form locale coverage is tracked in
  `messages/content/reviewed.json`. The earlier `noindex` gating was later
  superseded by the owner's explicit full-public-index decision in 0.4.0;
  review state still controls schema/ad eligibility where implemented.
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

## Historical Phase 2/3 plan — superseded by the complete ledger above

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

### 2026-07-14 — 0.5.0 — Codex / Private submission review panel

- Added: a Cloudflare Access-protected `/review` workspace for private photo
  review, protected image streaming, workflow status updates, recent batch-code
  query records and professional English replies through Resend.
- Security: the origin independently validates the Access JWT signature,
  issuer, application audience, expiry and reviewer email allowlist; all panel
  responses are dynamic/no-store and the page is `noindex, nofollow`.
- Storage: the existing append-only submission ledger and private bind-mounted
  image directory remain the source of truth; images are never copied under
  `public/` and paths are containment-checked before reading.
- Deployment: Cloudflare Access values are encrypted GitHub Actions secrets and
  are passed to the VPS container at runtime. No AUD or reviewer address is
  committed.
- Files: review routes, `src/lib/review-auth.ts`, submission store/reply modules,
  workflow/deploy configuration and review documentation.
- Verification: ESLint, TypeScript, 19/19 regression tests, deployment shell
  syntax, diff checks and the 266-page production build passed. Live Access
  challenge and authenticated panel checks remain for post-deploy verification.
- Risk: Resend sends a new message rather than preserving the original provider
  thread; the submission ID and append-only reply event provide traceability.
- Deployment note: the first `0.5.0` run stopped safely before rebuilding because
  `CF_ACCESS_TEAM_DOMAIN` arrived blank. The public tenant URL was then pinned in
  the workflow; AUD and reviewer addresses remain encrypted secrets.
- Live hardening: Cloudflare correctly challenged `/review/*`, while slashless
  `/review` reached the fail-closed origin and returned 500. The proxy now sends
  that entry point to `/review/dashboard` so users receive the Access challenge.
- Added before handoff: users may select one to three camera/gallery photos in a
  single submission. Every image is independently re-encoded client-side,
  signature/size checked server-side, stored privately and displayed together
  in the review panel. Legacy one-photo records remain readable.
- Hotfix: review form POST origin validation now compares the browser origin to
  the forwarded public host instead of the container's internal request URL.
  Cloudflare JWT validation and same-origin browser requirements remain active.
- Hotfix follow-up: review POST redirects now use the canonical public site URL
  rather than the standalone container request URL (`0.0.0.0`).
- Reply standard: high-confidence identified-code replies now lead with the
  documented format and cross-checked known examples instead of generic
  "estimate" language. Manufacturer confirmation is never claimed without a
  stored source; authenticity, condition and safety remain separate questions.

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

### 2026-07-14 — 0.5.1 — Codex / Photo discovery and visual polish

- Photo review: exposed the existing private multi-photo submission flow on
  every one of the 44 active locale brand routes, added complete locale copy,
  and linked it to the localized batch-code location guide. Unsupported result
  cards now surface the photo-review action in every locale rather than English
  only.
- Privacy/UX: retained client-side resize and JPEG re-encoding before upload,
  the three-photo limit, explicit consent, reply email and accessible live
  status/error behavior. Private submissions remain outside public indexable
  content and the Cloudflare Access boundary remains unchanged.
- Design: replaced the disconnected, overly sparse “How it works” row with
  three compact responsive cards, stronger sequence cues and reduced empty
  space while keeping the existing visual system.
- Logos: real official-domain favicon sources now take priority over synthetic
  wordmark tiles. Official-domain coverage increased from 106/212 to 206/212
  public brands; six discontinued celebrity/licensed lines intentionally keep
  neutral fallbacks because no trustworthy active official site was found.
- Reply language: strengthened the high-confidence reviewer template to explain
  that a visible code matched the documented format and known research examples,
  without falsely claiming manufacturer confirmation or product authenticity.
- Quality gates: added regressions requiring complete photo copy for every
  active locale and locking the intentionally unmapped logo list. Obvious draft
  defects in Spanish, Portuguese, Italian and Punjabi were corrected.
- Files: photo form/copy, result card, brand route, How It Works, logo source
  registry/component, reviewer reply templates, quality tests and this log.
- Risk / needs verification: long-tail translations have automated structural
  coverage and targeted editorial cleanup but still need native-speaker review;
  remote official-site favicons can change independently and therefore retain a
  deterministic tile/monogram fallback.

### 2026-07-14 — 0.5.2 — Codex / Brand-logo placeholder hotfix

- Fixed: removed DuckDuckGo and Google favicon proxies after production showed
  their generic grey arrow placeholder as if it were the real logo for Missha,
  Espoir, Etude, Primera and Sulwhasoo.
- Behavior: logo tiles now request only `/favicon.ico` from the mapped official
  brand domain with no referrer; unavailable assets fall back to the existing
  deterministic wordmark or clean brand monogram instead of a third-party icon.
- Quality gate: regression coverage now rejects third-party/placeholder-prone
  logo sources.
- Files: brand-logo registry/component, quality tests and this log.

<!-- Example:
### 2026-07-15 — 0.2.1 — agent/name
- Changed: ...
- Files: ...
- Why: ...
- Verified: lint, typecheck, test, build
- Risk / needs verification: ...
-->
