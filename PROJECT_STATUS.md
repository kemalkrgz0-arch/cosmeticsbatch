# CosmeticsBatch project status

Last updated: 2026-07-14
Current version: **0.2.5**
Current phase: **Phase 2 in progress — production email active**

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
- Phase 2 technical SEO/content integrity audit and fixes are in progress.
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

- Improve 200+ brand selection, keyboard navigation and mobile interaction.
- Clarify manufactured date, estimated unopened shelf life, PAO, confidence and
  limitations in result UX.
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

<!-- Example:
### 2026-07-15 — 0.2.1 — agent/name
- Changed: ...
- Files: ...
- Why: ...
- Verified: lint, typecheck, test, build
- Risk / needs verification: ...
-->
