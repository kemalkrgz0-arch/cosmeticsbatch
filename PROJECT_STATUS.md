# CosmeticsBatch project status

Last updated: 2026-07-19
Current version: **1.1.0**
Current phase: **Phase 3 in progress — primary UX, accessibility and SEO correction**

This is the shared handoff document for maintainers and agents. Read it before
work and update it after every logical change group. Detailed audit evidence and
priorities live in `AUDIT.md`.

## Current production snapshot — read before changing anything

- Production branch: `main`; deployment is triggered by GitHub Actions and
  rebuilds/restarts the VPS container over SSH.
- Current production baseline: commit `a64f2b9`; GitHub Actions deploy run
  `29663601031` completed successfully. Production package/document version is
  `1.0.1`; the local working version is `1.0.2` until the privacy-copy patch is
  committed and deployed.
- Framework: Next.js 16 App Router, React 19, TypeScript and `next-intl` with 19
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

1. P0 decoder-method disclosure (`Completed` in 1.0.1, work item `SEC-001`;
   owner: primary Codex agent; completed 2026-07-19; starting commit `ea2c81d`; scope:
   `src/components/result-card.tsx`, `scripts/quality-regression.test.ts`,
   `package.json`, `PROJECT_STATUS.md`): server-rendered results publish the
   decoder's internal method label and notes on English pages.
   `src/components/result-card.tsx:301` renders `result.method` and `notes`
   whenever `locale.startsWith("en")`. `/api/decode` deliberately strips both
   (`src/app/api/decode/route.ts:175`), so only the server-rendered path leaks.
   Confirmed live in production on 2026-07-19:
   `GET https://cosmeticsbatch.com/check?brand=vichy&code=54X602` returns, in
   the rendered DOM (scripts stripped),
   `L'Oréal factory / year-letter / month` and `L'Oréal codes give month
   precision; the day is estimated as mid-month.`; decoder notes additionally
   contain `factory digits, then the year letter, then the month` and `The year
   letter repeats every 25 years`. Scope: English locale only — the same URL
   under `/ru` was checked and is clean. The page is `index, follow` and
   `robots.txt` allows GPTBot/ClaudeBot/CCBot, so the format is also served to
   AI crawlers. This contradicts the project rule that the cipher is the gold
   source and must never be published. The public rendering block was removed.
   Residual, `needs verification` — measured on the running app at 1.0.1 for
   both a canonical code (`vichy` / `54X602`) and a non-canonical one
   (`it-cosmetics` / `MNX30W`): the visible DOM is clean and the structural
   label `L'Oréal factory / year-letter / month` is gone everywhere, which was
   the serious part. But `src/app/[locale]/check/page.tsx:101` still passes the
   unredacted `result` object to `ResultCard`, a client component, so `notes` is
   serialized into the RSC payload and `month precision` remains readable in
   page source. The fix commit did not touch that file. Severity is much reduced
   but the finding is not fully closed; redacting `method`/`notes` before the
   prop crosses into the client — the same thing `/api/decode` already does —
   would close it. Owner asked to defer this remainder.
2. P0 truthfulness: replace the homepage `expiry date` / `help check
   authenticity` meta promise with estimated manufacture-date, product-age,
   typical unopened shelf-life and PAO language.
3. P0 privacy consistency (`Completed` in 1.0.2, work item `PRIV-001`; owner: primary
   Codex agent; claimed 2026-07-19; starting commit `a64f2b9`; scope: the 19
   active `messages/*.json` catalogs, `scripts/quality-regression.test.ts`,
   `package.json`, `PROJECT_STATUS.md`): audit the served locale message files and remove
   stale claims that decoding is browser-only or that codes are never
   sent/stored. English/privacy pages already describe the current server
   dataset correctly.
   Scope corrected 2026-07-19 (was “all 44 locale message files”): 44 files
   still exist under `messages/`, but only the 19 codes in `LOCALE_CODES`
   (`en, es, fr, de, pt, ru, ar, zh, ja, ko, tr, it, id, nl, pl, vi, sv, yue,
   da`) are routed and indexable; the other 25 are in `RETIRED_LOCALE_CODES` and
   cannot be reached by a user, so a stale claim in them is not user-facing.
   `ALL_LOCALES` remains the 50-language planned registry and is not the audit
   scope. Verified by reading the exported counts, not by inspection of the file
   list alone. The retired files are still worth cleaning as technical debt, but
   they do not carry P0 urgency — see finding 13.
   Audit evidence: English is accurate, but every other one of the 19 active
   locales has stale claims in `brandFaq.a_free`, `homeFaq.a2`, `homeFaq.a10`
   and/or `features.privateBody` saying checks happen only in the browser, are
   never sent/stored, or are completely private. All 18 served non-English
   catalogs require one atomic correction plus regression coverage.
   The false claims were replaced atomically with accurate server-processing,
   no-account, IP-exclusion and limited-retention wording. To remove the P0
   immediately, the 18 non-English catalogs temporarily use reviewed English
   copy for these four fields; native-language editorial replacement remains P1.
4. P1 structured data: align Organization/HowTo descriptions with the same
   cautious language; do not describe an estimated shelf-life date as a
   manufacturer expiry date.
5. P1 locale directory: `/[locale]/brands` currently hard-codes English title,
   description, breadcrumb, H1 and ItemList labels. Its JSON-LD item URLs also
   point to prefix-free English brand URLs. Localize the visible/metadata copy
   and generate locale-aware structured-data URLs.
6. P1 count accuracy: the directory currently says listed example brands “and
   {BRANDS.length}+ more”, which overstates the total. Use one central total and
   wording such as “Browse 212 supported brands, including …”.
7. P1 content quality: Google still shows cached legacy `Expiry Date &
   Authenticity` titles for several brand pages. Current English metadata is
   safer, but recrawl should be requested only after the remaining global claims
   are fixed. Do not mass-submit thousands of URLs.
8. P1/P2 localization: live search evidence shows mixed-language and awkward
   long-tail pages (for example Italian English fallback blocks and Korean
   guide fragments). Strengthen existing high-impression URLs before creating
   new programmatic pages.
9. P2 brand uniqueness: prioritize verified examples, packaging location,
   provenance and limitations for high-impression brands. Do not manufacture
   “unique” filler or repeat one template with only a brand-name substitution.
10. P2 parameterized result indexability (`Next`): `/check?brand=&code=` renders
    `index, follow`. The canonical correctly consolidates to `/check`, so
    duplicate indexing risk is low, but crawlers still render the parameterized
    variant — which is the surface that leaks finding 1. Consider `noindex` when
    `brand`/`code` parameters are present.
11. P2 rate-limit durability (`Next`): `src/lib/rate-limit.ts:8` keeps buckets in
    a process-local `Map`. Limits reset on container restart and are not shared
    between instances. Acceptable for the current single-container deployment;
    revisit before horizontal scaling.
12. P3 activity log pollution (`Next`): `/api/activity` accepts any caller-
    supplied `path` that starts with `/`, omits `?`, is ≤180 characters and is
    not under `review`. A same-origin caller can therefore write page paths that
    do not exist into the analytics dataset. Bot-filtered and rate-limited, so
    impact is limited to dashboard noise; validating against known routes would
    close it.
13. P3 retired locale message files (`Next`): `messages/` holds 44 catalogs while
    only 19 locales are routed. The 25 retired files are unreachable, so their
    contents cannot mislead a user, but they still ship in the repository, are
    carried by translation-wide edits, and make locale counts quoted in this file
    drift out of date. Decide explicitly whether to delete them or keep them as
    an archive, and record which.

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

- `Completed` — owner dashboard analytics and review-queue corrections, shipped
  in commit `164ddbc` and deployed. Scope: `src/lib/review-metrics.ts` (new pure aggregation
  layer), `src/app/[locale]/review/page.tsx` (four job-shaped tabs — Overview,
  Traffic, Decoder health, Photo submissions — replacing one tab per log file),
  `src/components/layout/site-chrome.tsx` (new; hides the public header/footer
  in the private workspace), `src/lib/dataset.ts` (`readChecksSince` for exact
  windowed reports plus `CheckLog.path`), `src/lib/decoder/decoders.ts`
  (`canonicalCode` export), `src/app/[locale]/layout.tsx`,
  `src/app/api/decode/route.ts`, `src/app/[locale]/check/page.tsx`,
  `scripts/quality-regression.test.ts`.
  Corrections included in this group, each with regression coverage where
  testable: brand-page conversion now attributes a check to the page it was made
  on rather than to its brand (previously produced conversion rates above 100%);
  windowed check reads are no longer capped at 1000 rows, which would have
  falsified 30-day totals within roughly eight days at current volume; the
  locale split counts page views only, because a session's first page is logged
  as both `visit` and `page_view`; daily buckets and printed timestamps now share
  `Europe/Istanbul`; the failed-code queue groups by normalized code so one
  user's spacing/case retries form one row while letter/digit differences stay
  distinct; per-tab conditional loading; search shown only where it filters;
  exports named for the dataset they download; the daily chart draws the third
  series its caption claimed.
  Verification actually run: TypeScript clean; ESLint clean; 48/48 regression
  tests; `git diff --check` clean; `next build` exit 0 (retains the pre-existing
  NFT tracing warning traced to `submission-store.ts`); the dashboard was
  rendered locally against a purpose-built local JWKS server and a validly
  signed Access token, exercising the real signature path without modifying
  production code — all four tabs plus legacy `view=checks`/`view=failed` and an
  invalid `view` returned 200, requests with no token and with a malformed token
  were refused, and 13 public routes returned 200.
  Live post-deploy smoke checks run against `https://cosmeticsbatch.com` on
  2026-07-19: `/brands/dior` returns a 50-character title keeping the long form,
  `/brands/giorgio-armani-beauty` returns the 40-character short form, and
  `/de/brands/loreal-paris` returns 34 characters — the German title that
  previously overflowed at 61. The dashboard tabs themselves were verified
  locally only, because production requires a real Cloudflare Access session;
  that remains `needs verification` in production.
  Residual risk / `needs verification`:
  `CheckLog.path` is derived from the `Referer` header, so checks from clients
  that suppress it fall into the unattributed bucket (surfaced as a count, not
  hidden); the public site chrome is still server-rendered into the RSC payload
  for review routes and only discarded on the client, which a route group would
  fix properly.
- `Next` — a malformed Access token raises a raw `SyntaxError` from
  `decodePart` (`src/lib/review-auth.ts:19`) instead of the intended
  `Invalid Access token`. Access is still refused and Cloudflare Access sits in
  front, so this is untidiness rather than a security gap.
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

## Completed — 0.18.2 (strict finding and verification discipline)

- Repository rules now require every discovered bug, regression, privacy or
  security risk, technical-debt item and proposed improvement to be recorded in
  this shared file with `P0`–`P3` severity, evidence, scope and workflow state.
  Actionable findings may no longer remain only in chat or private notes.
- Each logical change group must define acceptance criteria, add regression
  coverage where testable, run focused and repository-wide checks, inspect the
  final diff for unrelated/private material, and record exact results, skipped
  checks, environmental limits and residual risk. Deployment success must be
  followed by proportionate live smoke checks.
- P0 correctness, privacy, security and data-loss findings now block
  lower-priority feature work unless the owner explicitly accepts and records
  the risk. Unverified work cannot be marked complete.
- Files: `AGENTS.md`, `package.json`, `PROJECT_STATUS.md`.
- Acceptance criteria: rules are visible to every repository contributor;
  package/status versions match; the status-entry requirements distinguish
  evidence, priority, state and verification truthfully.
- Verification: the package/status version synchronization assertion passed at
  `0.18.2`; `git diff --check` passed; the three-file final diff was manually
  inspected for scope, unrelated edits, secrets and private data. No runtime
  test or build was run because this group changes repository process text and
  package metadata only.
- Deployment: commit `bea3911`; GitHub Actions run `29663127446` completed
  successfully on 2026-07-19.

## Completed — 1.1.0 (owner dashboard: code-check log and bulk export)

- The raw log of what users typed had been folded into the `Decoder health` tab
  as its third panel during the 1.0.x dashboard restructure, below the decoder
  table and the year histogram. The owner went looking for user queries and
  could not find them. It is now its own `Code checks` tab, placed second in the
  navigation directly after `Overview`, as the only panel on that view, titled
  for what it holds: "Every code users typed, newest first."
- Search and export now apply to that tab: `?view=checks&q=…` filters the table,
  and the export control is labelled `Checks` rather than a bare `CSV`. Existing
  `?view=checks` links resolve to the real tab instead of redirecting.
- New bulk export: `GET /review/api/export?kind=all` returns one JSON bundle of
  code checks, failed codes and activity events, surfaced as a
  `Download all data (JSON)` control at the top of `Overview`, for handing the
  full picture over in a single attachment.
- Photo submissions are deliberately excluded from that bundle. They carry the
  submitter's email address and free-text note, and `AGENTS.md` forbids moving
  that data around; including them would place user emails into any chat or
  ticket the file is shared through. The bundle states what it contains and what
  it omits in its own `excludes` field.
- Files: `src/app/[locale]/review/page.tsx`,
  `src/app/[locale]/review/api/export/route.ts`, `package.json`,
  `PROJECT_STATUS.md`.
- Acceptance criteria: the code-check log is reachable without scrolling past
  aggregate reports; the tab name states what it contains; one control exports
  every analytics dataset in a single file; that file contains no personal data;
  the export stays behind reviewer authentication.
- Verification actually run: TypeScript clean; ESLint clean (an interim
  `no-html-link-for-pages` error was resolved by marking the export anchor as a
  `download`, and the then-redundant disable directive was removed); 48/48
  regression tests. Rendered locally against a purpose-built local JWKS server
  and a validly signed Access token: navigation order is
  `Overview | Code checks | Traffic | Decoder health | Photo submissions`; the
  `Code checks` tab returned 200 and rendered all 10 local rows; the bundle
  returned `attachment; filename="cosmeticsbatch-all-…json"` with counts
  `{checks: 10, failedCodes: 4, activity: 9}`; a regex scan of the whole bundle
  for email addresses found none and no `submissions` key is present; the same
  URL without a token returned 403.
- `needs verification`: no production check — the dashboard requires a real
  Cloudflare Access session. Not committed and not deployed at time of writing.

## Completed — 1.0.2 (active-locale privacy truthfulness)

- Work item `PRIV-001` audited the four privacy-sensitive UI fields across all
  19 routed locales. Every served non-English catalog falsely claimed that
  codes stayed in the browser, were never sent/stored, or were completely
  private; English already described the actual server dataset correctly.
- All 72 false strings were replaced atomically with the reviewed, accurate
  server-processing and limited-retention wording. A regression now reads every
  active catalog, rejects known browser-only/no-storage claims, and requires a
  server-processing disclosure.
- Files: 18 active non-English `messages/*.json` catalogs,
  `scripts/quality-regression.test.ts`, `package.json`, `PROJECT_STATUS.md`.
- Verification: focused ESLint, TypeScript, `git diff --check`, JSON parsing,
  49/49 decoder/quality tests and the 267-page production build passed. The
  pre-existing private-photo NFT tracing warning remains.
- P1 editorial debt: the four corrected fields currently use reviewed English
  text in the 18 non-English catalogs. Replace them with native-reviewed text
  without weakening any server-processing or retention disclosure.
- Deployment: not yet committed or deployed.

## Completed — 1.0.1 (decoder-detail disclosure)

- Work item `SEC-001` removed the English-only result-card block that rendered
  internal decoder `method` and `notes` on server-generated public pages. The
  API already redacted both fields; public server and client result paths now
  follow the same boundary.
- Regression coverage reads both public paths: the API must destructure the two
  private fields and the result card must never reference `result.method` or
  `result.notes`.
- Files: `src/components/result-card.tsx`,
  `scripts/quality-regression.test.ts`, `package.json`, `PROJECT_STATUS.md`.
- Verification: focused ESLint, TypeScript, `git diff --check`, 48/48 quality and
  decoder tests, and the 267-page production build passed. The pre-existing NFT
  tracing warning remains. A local production request to the original
  `/check?brand=vichy&code=54X602` reproduction returned Vichy and the submitted
  code but none of the three previously exposed implementation strings.
- Remaining risk: production remains affected until this patch is deployed;
  live verification is required immediately afterward.
- Deployment: not yet committed or deployed.

## Completed — 1.0.0 (value-led language policy)

- Work item `LANG-001`; owner: primary Codex agent; claimed and completed
  2026-07-19;
  starting commit: `bea3911`; scope: `src/i18n/locales.ts`, `src/proxy.ts`,
  `src/lib/publishing-policy.ts`, `scripts/quality-regression.test.ts`,
  `package.json`, `PROJECT_STATUS.md`, and coordination rules in `AGENTS.md`.
  Acceptance criteria are listed below. No parallel implementation is assigned.
- P1 coordination finding — state: `Completed`. Evidence: repository rules
  previously required status updates but did not require a unique owner, file
  scope or starting SHA, so two agents could legitimately edit the same files.
  The new claim protocol forbids overlapping implementations, requires primary
  agent partitioning, pre-edit diff checks, explicit handoff and stale-claim
  handling without deleting another contributor's work.
- Strategy: retain 19 languages in three explicit tiers. Full-quality locales:
  English, German, Spanish, Italian, Japanese and French. Investment pilots:
  Dutch, Swedish, Danish, Korean, Arabic and Portuguese. Organic-preservation
  locales: Turkish, Vietnamese, Indonesian, Polish, Russian, Mandarin Chinese
  and Cantonese. The remaining 25 currently active locales will be retired.
- P1 finding — state: `Completed`. Evidence: `src/proxy.ts` recognized only
  active non-default locale prefixes; merely deleting a locale from `ACTIVE`
  would make a legacy URL such as `/hi/brands/dior` enter the bare-path English
  rewrite and likely resolve as a nonexistent `/en/hi/brands/dior` route.
  Scope: retired locale URLs, crawl continuity and user navigation.
- Fix: defined retained/retired locale policy in the locale registry, kept the
  19-language route/switcher/indexing lists synchronized, and issued a
  permanent redirect from retired locale paths to the equivalent prefix-free
  English path while preserving query strings.
- Acceptance criteria: exactly 19 live locale routes; policy tiers are disjoint
  and exhaustive; sitemap/hreflang expose those same 19 locales; retired locale
  prefixes redirect once to the equivalent English URL; unknown first segments
  remain ordinary English paths; regression tests cover all invariants.
- Files: `AGENTS.md`, `src/i18n/locales.ts`, `src/proxy.ts`,
  `src/lib/publishing-policy.ts`, `scripts/quality-regression.test.ts`,
  `package.json`, `PROJECT_STATUS.md`.
- Verification: focused ESLint, repository ESLint, TypeScript and
  `git diff --check` passed; 48/48 decoder/quality regressions passed; the
  267-page production build passed with the pre-existing private-photo NFT
  tracing warning. Local standalone smoke checks returned 308 from
  `/hi/brands/dior` to `/brands/dior`, preserved `?brand=dior` while redirecting
  `/uk/check`, returned 200 for retained `/ko/brands/dior`, and kept unknown
  `/not-a-locale` at 404. Sitemap inspection showed only the 18 retained
  non-English prefixes plus prefix-free English. The first quality run failed
  because the standalone compiler cannot resolve the app `@/` alias; the import
  was corrected. The second run exposed two obsolete assertions about ordering
  and exact translation-file equality; both were corrected to test policy set
  equality and active-locale copy coverage, after which the full suite passed.
- Remaining risk: search engines may take time to consolidate retired URLs into
  English; monitor crawl, 404 and index coverage after deployment. Retired
  message files remain inactive, recoverable source material and are not routed
  or shown in the language switcher.
- Deployment: not yet committed or deployed.

## Completed — 0.18.1 (search snippets and failed-code grouping)

- Brand-page search titles now select a localized short form when the long form
  exceeds the 60-character budget. All 44 locale catalogs contain the short
  form, and indexed-brand descriptions are held to a 160-character budget.
  These are character-based safeguards; search engines ultimately render by
  pixel width and may still rewrite snippets.
- The private failed-code queue groups spacing/case variants by normalized code
  regardless of failure classification. `TCR 15` and `TCR15` share one row,
  while meaningful letter/digit differences such as `TCR1S` remain separate.
  Each row preserves per-reason attempt counts and raw spelling variants.
- Brand-page conversion reporting now stores only the same-origin referrer's
  pathname (never its origin or query string) and attributes a check only to the
  exact localized brand page it came from. Generic checker/API attempts and
  legacy pathless rows no longer inflate brand-page conversion.
- Thirty-day dashboard totals now use an explicit unbounded time-window reader;
  the 1,000-row cap remains only on recent-table and export previews, so growing
  traffic cannot silently falsify read-rate and decoder-health reports.
- Locale distribution counts page-view rows only; the paired visit event on a
  session's entry page no longer gives that first locale double weight.
- The private owner workspace now separates overview, traffic, decoder health
  and photo submissions; hides public site chrome; loads log datasets only for
  tabs that render them; labels raw exports explicitly; and charts visits,
  views and checks on Europe/Istanbul calendar days. Traffic search was omitted
  because those panels are aggregate reports rather than searchable rows.
- Files: all 44 `messages/*.json`, `src/lib/snippet.ts`, brand metadata route,
  review dashboard and metrics, site-chrome/layout boundary, decode/check
  attribution, review export, decoder normalization export, dataset readers,
  regression tests, `package.json` and `PROJECT_STATUS.md`.
- Verification: repository ESLint and TypeScript passed; 48/48 quality and
  decoder regressions, `git diff --check` and the 267-page production build
  passed. The build retains the pre-existing NFT tracing warning for private
  photo storage. The first sandboxed build attempt could not bind Turbopack's
  CSS worker port; the permitted production-equivalent rerun passed, confirming
  an environment restriction rather than a code regression.
- Deployment: commit `164ddbc` was pushed to `main`; GitHub Actions deploy run
  `29662822927` completed successfully in 7m44s. Live smoke checks confirmed an
  HTTP 200 response on the home page and the deployed English Dior brand-page
  content. The local runner then encountered transient DNS resolution failures,
  so localized-brand, sitemap and private-review route smoke checks still need
  verification; no application-level failure was observed.

## Completed — 0.18.0 (Chanel month wheel)

- Chanel codes users actually enter mostly failed to decode: `1802`, `2601`,
  `2721`, `2501` all returned nothing, and the ones that did read came out
  years off. The old reader treated the code as a year digit plus a day of the
  year, which needs an arbitrary day number to land and rarely did.
- The leading pair is a running month counter on a 96-month (8-year) wheel,
  anchored at 72 = January 2022; the trailing pair carries no date. Derived
  from observed code -> date pairs, not from a Chanel publication — Chanel
  publishes no scheme. It reproduces every pair we have (72xx = Jan 2022
  through 27xx = Apr 2026) and dates every Chanel code in the user dataset.
- Counters above 95 are rejected rather than dated: the wheel only prints
  00-95, so this keeps the reader from putting a date on any 4-digit string.
  A reading ahead of today falls back one whole wheel.
- Kept at low confidence with month precision. The 8-year repeat is real —
  an older product reads the same as a recent one — and the scheme is not
  manufacturer-published. This is not hedging; it is the reader being right
  about its own uncertainty, and it matches how Dior/Kenzo cycle codes behave.
- `brandDetail.chanel.sampleCode` was `3245` — the same placeholder Guerlain
  uses, and it reads eight years back on the wheel. Replaced with `2721`, a
  code real users entered, which reads April 2026.
- Files: `src/lib/decoder/decoders.ts`, `src/lib/brand-detail.ts`,
  `scripts/decoder-regression.test.ts`.
- Verification: ESLint 0, TypeScript clean, 43/43 regressions, all decoder
  examples decode, production build passed. The old fixture asserting
  `3245 -> 2023-09-02` was updated to `2018-09-15`; that assertion was locking
  in the previous reading and correctly failed first.
- Risk / needs verification: **the wheel is unverified against a product of
  independently known date.** Matching the readings the batch-code community
  publishes proves we reproduce their algorithm, not that it is correct — if
  it is wrong, we are now wrong identically. The check to run: collect Chanel
  code + "when did you buy this new" through the existing photo/submission
  flow. A product bought new was made within roughly the preceding year, which
  is enough to separate this reading from the old one (they disagree by 3+
  years on the same codes). Until then the read stays low confidence.

## Completed — 0.17.0 (search snippets and the untranslated checker)

- Root cause found in the 2026-07-17 Yandex export, which carries a `demand`
  column (total searches per query) alongside our impressions. Reading capture
  rate rather than impressions exposed the gap: `/ru/brands/loreal-paris` was
  capturing 75% of its demand at position 6.8, while `/ru/check` captured
  **1 impression out of 498 demand** for "проверить батч код" — 24% of all
  Yandex demand, and zero impressions on 13 of 14 days.
- The cause was a bug, not ranking difficulty: `/check` was hard-coded English
  in every locale. It took `locale` and never used it — meta title, H1, intro,
  breadcrumbs, "Related brands" and the brand link were all literal English, so
  Yandex was offered an English page for a Russian query. A page cannot rank in
  a language it is not written in.
- Added a `checkPage` namespace and wired the route to it. Three head queries
  (498 + 114 + 23 = 635 demand, 31% of the Yandex total) resolve to this page.
- Rewrote the brand-page snippet around what people actually search. The old
  line led with caveats ("estimated manufacture date… see the decoder limits") —
  nobody clicks to read limits. The dominant intent across both engines is
  "срок годности" / "herstellungsdatum": *is my product still good?*
  Accuracy improved rather than dropped: the manufacture date is **decoded**,
  not estimated — the shelf life is the estimate, and the copy now says so.
- Titles were being truncated. The layout appends "| Cosmetics Batch" (18 of the
  ~60-character budget), so the differentiating tail never rendered. `pageMeta`
  gained `standaloneTitle` for pages whose title already carries the brand.
- All 44 locales hand-written, no machine translation. Each language uses the
  term its own users type — DE `Chargennummer`/`Herstellungsdatum` (query at
  position 18.6), RU `батч-код`/`срок годности`, TR `batch kodu sorgulama`.
  Fixed two pre-existing MT defects found on the way: Serbian `form.batchCode`
  was "Батцх Цоде" (a letter-by-letter transliteration of "Batch Code", not a
  word), and Hungarian was left untranslated as "Batch Code".
- Also landed: Paris postcodes (75001–75020, 75116) entered as batch codes now
  get an explicit hint. Users type the manufacturer's address block — `75008`
  arrived for two brands and `75116` for a third, from three countries. Guarded
  by a test proving the hint cannot mask a real read.
- Files: all 44 `messages/*.json`, `src/app/[locale]/check/page.tsx`,
  `src/app/[locale]/brands/[slug]/page.tsx`, `src/lib/seo.ts`,
  `src/lib/result-failure-copy.ts`, `src/components/result-card.tsx`,
  `scripts/decoder-regression.test.ts`.
- Verification: ESLint 0, TypeScript clean, 39/39 regressions, production build
  passed. Rendered and checked the real HTML rather than trusting the code:
  `/ru/check` → `<title>Проверить батч код косметики и парфюма — дата выпуска</title>`,
  `<h1>Проверить батч код</h1>`; `/ja`, `/zh`, `/pl`, `/uk`, `/ar` all in their
  own language; `/brands` still keeps the site-name suffix.
- Risk / needs verification: ranking does not follow from translation alone —
  indexing and competition still apply. The claim proven here is narrower: an
  English page could not rank for a Russian query, and now it can compete.
  Measure over 28 days, not on the single 2026-07-15 impression. Of the 44
  locales, only EN and TR have a speaker who can vouch for them; DE has a
  reviewer available. The other 41 are unverified and should be treated as such.

## Completed — 0.16.0 (Lancôme and Nivea heroes)

- Added owner-supplied, brand-isolated Lancôme and Nivea hero compositions to
  the shared data-driven brand template. Both 1774×887 PNG sources were encoded
  locally as 282 KB and 324 KB JPEGs without upscaling.
- Registered responsive focal positions in the typed hero manifest and added
  restrained Lancôme plum/rose and Nivea blue brand palettes. They inherit the
  0.15.1 Next Image responsive delivery, AVIF/WebP negotiation and immutable
  cache policy without route/component duplication.
- Included the owner-approved 44-locale brand-content cleanup already present in
  the workspace: detailed manual decoder recipes/code-position disclosures were
  replaced with cautious checker-led guidance while preserving shelf-life,
  authenticity limitations and visible packaging-location help.
- Files: two local hero assets, hero manifest, brand theme data, 44 locale
  message catalogs and package/status versions.
- Verification: hero inventory reports 8/212; repository ESLint and TypeScript
  passed; 37/37 regressions, `git diff --check` and the 267-page production build
  passed. Chrome renders at 1440×1200 and 390×1200 verified both brand pages,
  focal positions, readable overlays, floating forms and palette-specific CTAs.
  The build retains the pre-existing NFT tracing warning for private photo
  storage.
- Deployment: content commit `2531395` and hero release commit `5153376`;
  GitHub Actions run `29578273924` completed successfully in 5m15s. Both live
  brand pages and source assets returned HTTP 200; 640px negotiated WebP hero
  responses were 14.8 KB (Lancôme) and 16.7 KB (Nivea), and immutable one-year
  cache headers were present.

## Completed — 0.15.1 (PageSpeed image and consent performance)

- Audited both owner-supplied PageSpeed HTML exports. They contain the same
  2026-07-17 mobile/desktop Lighthouse session: mobile performance 85 with FCP
  1.1s, LCP 4.4s, TBT 30ms, CLS 0 and Speed Index 2.6s; desktop performance 95
  with FCP 0.3s, LCP 1.2s, TBT 10ms and CLS 0.
- Marked the homepage LCP image explicitly high priority and retained responsive
  Next Image delivery. Replaced the three oversized below-fold homepage example
  images and repeated header/footer logo with responsive optimized images.
- Added one-year immutable cache headers for version-controlled homepage,
  evidence, hero and logo assets plus a one-year Next Image minimum cache TTL.
- Changed Google Analytics from unconditional denied-mode loading to explicit
  consent-gated loading, avoiding roughly 179 KB and 116ms main-thread work for
  first-time/rejected visitors. The Google Consent Mode bootstrap and AdSense
  loader remain intact; advertising behavior was not removed.
- Files: homepage hero/location components, header/footer image rendering,
  consent-gated Google Analytics component and tracking boundary, Next image/
  cache configuration, package/status versions.
- Verification: repository ESLint and TypeScript passed; 37/37 regressions,
  `git diff --check` and the 267-page production build passed. Local standalone
  HTML/network checks confirmed `fetchPriority=high`, no pre-consent GA request,
  one-year public-asset caching and a 384px WebP example response of 15.4 KB
  (down from the report's 145.4 KB source transfer). The build retains the
  pre-existing NFT tracing warning for private photo storage.
- Deployment: performance commit `c91554e`; GitHub Actions run `29576107901`
  completed successfully. Production verification is recorded separately from
  the pending 0.16.0 content/hero release.

## Completed — 0.15.0 (premium homepage hero)

- Replaced the abstract homepage backdrop with the owner-supplied multi-brand
  composition, optimized locally from PNG to a 337 KB, 1774×887 JPEG.
- Rebuilt the existing homepage hero presentation around a wide responsive
  image stage, warm readability gradient, premium serif headline and floating
  checker card. The existing localized copy, checker behavior, brand navigation
  and trust labels remain connected to their original components.
- Added a demand-led hero production queue for the remaining Priority-50 brands
  to the owner's iCloud handoff folder, including dimensions, text-safe area,
  brand-isolation requirements and the distinction between banner artwork and
  batch-code evidence photos.
- Files: homepage hero component and local homepage hero asset; package/status
  versions. The handoff list is external to the repository and contains no
  private submission data.
- Verification: repository/scoped ESLint and TypeScript passed; 37/37
  regressions, `git diff --check`, 6/212 hero inventory and the 267-page
  production build passed. Headless Chrome renders covered 320, 390 and 1440 px;
  DOM measurements confirmed document width equals viewport width at each size.
  Mobile headline min-sizing/readability overlay was corrected after visual
  review. The build retains the pre-existing NFT tracing warning for private
  photo storage.
- Deployment: commit `76112af`; GitHub Actions run `29572804477` completed
  successfully in 6m04s. Production homepage, five brand routes and all five new
  image assets returned HTTP 200 after restart.

## Completed — 0.14.0 (Estée Lauder, L'Oréal, Kérastase and Dior heroes)

- Added four owner-supplied, brand-isolated product compositions as optimized
  local hero assets: Estée Lauder, L'Oréal (shared intentionally by L'Oréal and
  L'Oréal Paris), Kérastase and Dior. The original 1.6–1.8 MB PNG files were
  converted to 276–321 KB JPEGs without upscaling.
- Registered desktop and mobile focal positions in the typed hero manifest and
  added restrained brand palettes: burgundy for L'Oréal, coral-red for
  Kérastase, black/rose for Dior, and navy/gold for Estée Lauder. No route or
  component fork was added.
- Updated hero inventory to count manifest aliases correctly, so one physical
  L'Oréal asset can cover two verified brand pages without duplication.
- Files: four hero assets, hero manifest, brand palette data, inventory script,
  package/status versions.
- Verification: repository ESLint and TypeScript passed; 37/37 regressions,
  6/212 hero inventory, `git diff --check`, four desktop Chrome renders and the
  267-page production build passed. The build retains the pre-existing NFT
  tracing warning for private photo storage.
- Deployment: commit `76112af`; GitHub Actions run `29572804477` completed
  successfully in 6m04s. Production homepage, five brand routes and all five new
  image assets returned HTTP 200 after restart.

## Completed — 0.13.1 (brand picker page-transition fix)

- Fixed the brand-detail checker retaining the previous brand's hero/content
  after another brand was selected. Brand-page picker changes now navigate to
  the selected brand's canonical route, refreshing the complete server-rendered
  brand experience while preserving homepage picker and decode behavior.
- Files: checker component, shared brand route, regression test,
  `package.json`, `PROJECT_STATUS.md`.
- Verification: scoped ESLint and TypeScript passed; 37/37 regressions,
  `git diff --check` and the 267-page production build passed. The build retains
  the pre-existing NFT tracing warning for private photo storage.
- Deployment: local only; not committed or deployed.

## Completed — 0.13.0 (brand hero rapid-onboarding foundation)

- Split owner-approved hero artwork/crop configuration into one typed manifest
  while continuing to merge it into the existing `Brand.theme` model. Adding a
  new delivery no longer requires editing the route or shared components.
- Established deterministic desktop/mobile filenames, dimensions, text-safe
  areas, compression targets, legal/brand-isolation rules and fallback behavior
  in `docs/BRAND_HERO_ASSET_GUIDE.md`.
- Added `npm run hero:inventory`, which reports public-brand coverage, missing
  slugs and hero files above the 700 KB review threshold. Current preparation
  baseline is 1/212 public brands with approved hero artwork (Vichy); every
  missing brand already renders the premium category fallback without a broken
  request or borrowed product image.
- Files: hero asset manifest, brand catalog merge, inventory script, handoff
  guide, package scripts/version and `PROJECT_STATUS.md`.
- Verification: repository ESLint and TypeScript passed; 36/36 regressions,
  hero inventory, `git diff --check` and the 267-page production build passed.
  The build retains the pre-existing NFT tracing warning for private photo
  storage.
- Deployment: local only; not committed or deployed.

## Completed — 0.12.0 (premium data-driven brand page)

- Reworked the shared brand-detail template around a premium, responsive hero,
  overlapping checker, evidence help, quick facts, location gallery, decoder
  explanation, FAQ, related brands and visible service limitations without
  changing route URLs, decoder/API behavior, SEO metadata or structured data.
- Extended the existing `Brand` model with optional visual theme tokens and
  local desktop/mobile hero asset slots. Vichy supplies mineral cream/green
  tokens; every other brand resolves through category-aware safe fallbacks.
  Missing hero artwork renders a controlled abstract gradient and never borrows
  another brand's product imagery or invents a logo.
- Added reusable server components for the brand hero, quick facts and trust
  notice. The existing checker gained a presentation variant while preserving
  its accessible combobox, localized labels, URL-based submit and API flow.
- The global header now uses a light floating surface. Mobile navigation has an
  accessible menu with Escape handling, keyboard focus containment and body
  scroll locking. Batch-location evidence becomes a native scroll-snap rail on
  small screens and retains the equal desktop grid.
- Files: brand route/model/theme resolver, brand-page components, checker,
  header/mobile menu, photo-help/gallery presentation, global tokens/styles,
  regression tests, `package.json`, `PROJECT_STATUS.md`.
- The owner-supplied Vichy-only product composition is stored locally as an
  optimized 1920×822 JPEG (304 KB) and connected through the brand theme. Its
  wide source keeps text clear on desktop; brand-specific mobile focal position
  preserves the product group on narrow screens. Vichy's full accent/CTA system
  now uses a controlled red palette over the warm mineral surface.
- Verification: repository ESLint and TypeScript passed; 36/36 decoder and
  quality regressions passed; `git diff --check` passed; the final 267-page
  production build passed. Chrome DevTools device emulation measured exact
  320, 360, 390, 430, 768, 1024, 1280, 1440 and 1920px viewports with no page
  horizontal overflow. Final 1440px Chrome render verified hero, form, help CTA,
  quick facts and three-image evidence layout. The build retains the pre-existing
  NFT tracing warning for private photo storage.
- Deployment: local only; not committed or deployed.

## Completed — 0.11.0 (failed-code intelligence and private analytics)

- Decode failures now have explicit `barcode`, `invalid-format` and
  `unresolved` classifications. Every failed human attempt, including EAN,
  UPC and GTIN-like input, is retained in a private append-only file for its
  selected brand with the classification, time, locale and coarse country.
- The result UI explains retail barcodes separately from unsupported batch-code
  formats, avoids implying that a product is invalid, and invites packaging
  evidence where it can help. The photo form opens automatically and prefills
  the entered code for unresolved/barcode results; users can also contact the
  public mailbox directly.
- Added privacy-minimal first-party product analytics: anonymous page path,
  locale, time, page-view event and one approximate visit event per browser tab
  session. IPs, cookie/browser identifiers, emails and URL query strings are not
  written to the activity dataset. The privacy policy documents this behavior.
- The protected review workspace now includes seven-day visit, page-view,
  decode-check and failed-code totals, plus all-time photo form totals. A new
  failed-code queue groups repeated codes under each brand and shows type,
  frequency, latest occurrence, locales and countries. Raw failed records can
  be exported as CSV or JSON.
- Files: decoder result model, decode/activity APIs, dataset store, result and
  photo-submission UI, product-activity client, review dashboard/export,
  privacy policy, regression tests, `package.json`, `PROJECT_STATUS.md`.
- Verification: scoped and repository ESLint passed; TypeScript passed; 30/30
  decoder and quality regressions passed; the 267-page production build passed.
  The build retains the pre-existing NFT tracing warning for private photo
  storage. Final authenticated review-dashboard visual review remains needs
  verification because local Cloudflare Access credentials are unavailable.
- Debug follow-up: real Chrome testing caught and fixed an automatic-focus
  scroll jump that hid the failure warning by moving directly to the opened
  evidence form. The form now opens and prefills without stealing the result
  position; focused controls use `preventScroll`. A rebuilt production preview
  confirmed the warning, open form and prefilled code remain visible together.
- Deployment: local only; not committed or deployed.

## Completed — 0.10.7 (responsive wide-screen layout frames)

- Introduced shared responsive `site-frame`, `page-frame` and `reading-frame`
  primitives and applied them across public navigation, footer, home sections,
  directories, brand/check pages, guides, decoders, legal/company pages and the
  private review workspace.
- Wide screens now use a 96rem site canvas and 72rem product/tool canvas instead
  of leaving primary pages trapped at 42–48rem. Long-form copy remains capped at
  56rem for readable line lengths; mobile and tablet retain 1rem/1.5rem gutters.
- The 24rem difference between the broad site frame and central page frame
  deliberately reserves two 12rem side rails for future advertising. Content
  does not stretch edge-to-edge on 2560px displays, so ad integration can be
  added later without another disruptive page-width migration.
- Files: global layout CSS; header/footer; home, public route and review page
  shells; `package.json`; `PROJECT_STATUS.md`.
- Verification: ESLint, TypeScript, 27/27 regressions and the 267-page
  production build passed. Representative 390px, 1440px and 2560×1600 renders
  were captured; final horizontal-overflow measurement remains needs
  verification before deployment.
- Deployment: local preview only; not committed or deployed.

## Completed — 0.10.6 (scalable brand visual-guide layout)

- Added a reusable brand visual-guide component and moved packaging evidence to
  a stable, prominent position directly after the checker facts instead of
  appending raw images deep in the article copy. This establishes one consistent
  page slot as image coverage expands across the catalog.
- Differing source aspect ratios no longer create uneven card heights or leave a
  third image stranded on its own row. Three-image galleries use three equal
  desktop columns, two-image galleries use two, and a single image keeps a
  bounded width.
- Every gallery card now has a consistent 4:3 frame. Images use `object-contain`
  with internal spacing, preserving the full annotated batch-code evidence
  without cropping; mobile remains a one-column stack.
- Files: reusable brand-code gallery component, brand detail route,
  `package.json`, `PROJECT_STATUS.md`.
- Verification: scoped ESLint and TypeScript passed; the existing 27/27
  regressions remained green; the 267-page production build passed. Refreshed
  Vichy desktop and 390px mobile renders confirmed the stable section placement,
  equal desktop cards, one-column mobile flow, preserved image content and no
  broken assets. The build retains the pre-existing NFT tracing warning for
  private photo storage.
- Deployment: local preview only; not committed or deployed.

## Completed — 0.10.5 (Vichy, L'Oréal Paris and Dior image preview)

- Added six owner-supplied, annotated batch-location images to the local brand
  galleries: three for Vichy, two for Dior and one for L'Oréal Paris. The Vichy
  pair previously shown was replaced by the newly annotated set and expanded to
  the existing three-image maximum.
- Converted the HEIC sources through macOS Quick Look because direct `sips`
  conversion produced black output, then encoded the verified previews as
  optimized JPEGs. Catalog dimensions match the generated assets.
- Excluded one unrelated Dior-folder screenshot because it was not a product
  image and contained private personal information. It was neither copied into
  the repository nor exposed by the catalog.
- Files: six local assets under `public/brands/examples/`, `src/lib/brands.ts`,
  `package.json`, `PROJECT_STATUS.md`.
- Verification: scoped ESLint, TypeScript, 27/27 regressions and the 267-page
  production build passed. Desktop renders of the local Vichy, L'Oréal Paris
  and Dior pages showed the expected 3/1/2-image galleries with correct aspect
  ratios and no broken assets. The build retains the pre-existing NFT tracing
  warning for private photo storage.
- Deployment: local preview only; not committed or deployed.

## Completed — 0.12.0 (decoder correctness from real user traffic)

- Reviewed the 310-record production check export (207 unique brand+code pairs,
  83 unresolved). The finding that mattered was not the unresolved 40% but the
  codes answered *confidently and wrongly*: `cerave C34` → high-confidence March
  2003 for a brand founded in 2005, `vichy 14YN` → high on a truncated code,
  `prada-beauty 4z8k` → high on junk. All reproduced locally before any change.
- Root cause: the L'Oréal reader scans for any year letter followed by a valid
  month character and reports the first hit as high confidence, with no length
  floor and no check that the letter is where the documented format puts it.
- Fixes in `src/lib/decoder/decoders.ts`:
  - `clean()` now maps Cyrillic/Greek homoglyphs to their Latin twin and NFKD-
    strips combining marks, so a code typed on a Russian or Vietnamese keyboard
    stops silently losing characters (`clinique "А25"` went none → medium).
  - The L'Oréal reader requires a 5-character minimum (canonical is 6), demotes
    a read to low when the 25-year letter cycle resolves decades back, and only
    reports high confidence for the documented `digits + year letter + month`
    shape. Letter-led codes such as `MNX30W` — readable as both 2013-11 and
    2023-03 — keep their date but lose the false certainty.
- Measured against the full export before/after: **12 of 207 changed, 195
  untouched**; high-confidence reads 82 → 71. No real code lost its date; the
  three killed reads were all false positives.
- Not done, deliberately: no decoder was invented for the unresolved clusters
  (Jean Paul Gaultier `TCR15X`/`BPI75116`, and the Korean brands SKIN1004 /
  Beauty of Joseon / Anua / Missha). JPG's own 5-digit format decodes correctly;
  those 17 entries are users typing non-batch-code text, including the Paris
  postcode (`75008`, `75116`) off the address block. Photo evidence first.
- Files: `src/lib/decoder/decoders.ts`, `src/lib/decoder/index.ts` (the barcode
  fix below), `scripts/decoder-regression.test.ts`, `.gitignore`.
- Verification: ESLint 0, TypeScript clean, 36/36 regressions (5 new decoder
  guards), `verify-decoder-examples` all green, production build passed.
- Risk / needs verification: the `LOREAL_PLAUSIBLE_AGE_YEARS = 15` floor is a
  judgement call, not a sourced constant — the oldest plausible read in real
  traffic is ~14 years, so nothing legitimate is demoted today, but a genuine
  old-stock check would be shown as low confidence.

## Completed — 0.12.0 (retail barcodes with separators)

- Prod logged `dior "3 348900 838185"` — an EAN-13 with spaces — as a
  medium-confidence December 2023 date. The old guard only rejected 12–14 digit
  strings whose checksum validated, so a mistyped or truncated barcode fell
  through to the decoders and a substring was read as a Julian date.
- `src/lib/decoder/index.ts` now treats any 12–14 digit compact string as a
  retail identifier regardless of checksum, and classifies the failure as
  `barcode` so the UI shows the "look for a separate short stamp" message.
- Verified: `3 348900 838185` and `800523 733088` now return `reason=barcode`.

## Completed — 0.10.4 (decode result render crash hotfix)

- Reproduced the reported production failure through an instrumented real
  Chrome form submission. The result route and `/api/decode` both returned HTTP
  200, then `ResultCard` threw `TypeError: Cannot read properties of undefined
  (reading 'length')`, activating Next.js's “This page couldn't load” boundary.
- Root cause: the public API intentionally strips decoder `method` and `notes`
  to avoid exposing implementation details, while the successful English result
  branch still assumed `notes` was always present. The card now normalizes a
  redacted/missing notes collection before rendering.
- Added a regression that locks the API redaction and prevents result cards from
  directly reading `result.notes.length` again.
- Files: `src/components/result-card.tsx`, quality regression tests,
  `package.json`, `PROJECT_STATUS.md`.
- Verification: scoped ESLint, TypeScript, 27/27 regressions and the 267-page
  production build passed. An instrumented iPhone-Safari-identified Chrome flow
  submitted Dior code `1K01`; the decode API returned HTTP 200 and the complete
  result card rendered without an exception. The build retains the pre-existing
  NFT tracing warning for private photo storage.
- Deployment: commit `2651b5d`, Actions run `29527024075`, completed
  successfully. The same instrumented iPhone Safari flow passed against live
  production: `/api/decode` returned HTTP 200 and the complete result card
  rendered without activating the error boundary.

## Completed — 0.10.3 (mobile result navigation reliability)

- Fixed the batch-check form so submitting a code uses locale-aware in-app
  navigation instead of replacing the entire document. A transient mobile
  network failure can therefore no longer replace CosmeticsBatch with the
  browser's terminal “page couldn't load” screen before the inline result and
  its retry state can render.
- Production diagnosis: the English Dior result document and same-origin decode
  API both returned HTTP 200; the API produced a valid decoded result. Repeated
  English page checks completed in about 0.46 seconds and the Turkish sample in
  about 1.12 seconds. The reported failure is therefore consistent with an
  intermittent full-navigation failure rather than a decoder outage.
- Files: `src/components/check-form.tsx`, `package.json`, `PROJECT_STATUS.md`.
- Verification: scoped ESLint, TypeScript, 26/26 regression tests and the
  267-page production build passed. The build retains the pre-existing NFT
  tracing warning for private photo storage; no new warning was introduced.
- Deployment: not yet deployed. Real iOS Chrome/Safari verification remains
  required after deployment.

## Completed — 0.10.2 (Chanel Beauty image quarantine)

- Visual review found that the three active Chanel Beauty gallery assets were
  not defensible as original site evidence: they contain third-party retail
  imagery and visible watermarks. Removed the brand-to-gallery references so
  the public brand page no longer presents them as CosmeticsBatch evidence.
- The underlying files remain in the local repository pending a deliberate
  provenance/licensing decision; they were not destructively deleted during a
  dirty multi-contributor session. They must not be reactivated without owner
  authorship, explicit permission or a documented compatible license.
- Corrected the priority-50 matrix: an image count means an active local asset,
  not proof of rights or originality. Chanel Beauty now requires replacement
  owner-created/licensed photos as well as a verified sample/editorial record.
- Files: `src/lib/brands.ts`, `docs/BRAND_QUALITY_MATRIX.md`, `package.json`,
  `PROJECT_STATUS.md`.
- Added an owner-facing 39-brand completion checklist to the external iCloud
  `Cosmetics batch` folder. It records current/required image counts, a three-shot
  capture plan and originality, privacy and watermark restrictions. The copied
  TXT and its `/tmp` source have identical SHA-256 hashes.
- Verification: TypeScript compilation and 26/26 regressions passed; the
  compiled catalog reports zero active Chanel Beauty images; diff check passed.
  Included in commit `43cd660` and production deploy run `29495776323`.

## Completed — 0.10.1 (priority-brand evidence matrix)

- Audited all 50 brands in the controlled publishing queue against the live
  catalog, assigned decoder, sample/editorial registry, local image inventory
  and current index policy. Added the operational matrix at
  `docs/BRAND_QUALITY_MATRIX.md`.
- Findings: 26/50 pass the current sample/editorial gate and expose English plus
  Russian; 24/50 remain noindex. Ten passing brands have local batch images and
  sixteen passing brands still have none. Four blocked brands already have
  images but lack sufficient sample/editorial or brand-applicability evidence.
- Evidence warning: none of the decoder profiles currently stores a primary or
  reference URL. Fixture tests support conservative runtime behavior but do not
  justify calling the full set “50 proven brands.” The matrix records this
  limitation and forbids unlocking pages solely from parent-company ownership.
- Prioritized work: strengthen already exposed pages first, then review Chanel
  Beauty and Shiseido as the clearest evidence-backed candidates; treat Aesop
  and Anua cautiously because images do not prove decoder applicability.
- Files: `docs/BRAND_QUALITY_MATRIX.md`, `package.json`, `PROJECT_STATUS.md`.
- Verification: matrix rows were generated from the compiled catalog and policy;
  all 50 slugs resolve, counts reconcile to 26 passing / 24 blocked, and package
  plus status versions are synchronized. No index policy or deployment changed.

## Completed — 0.10.0 (controlled 50-brand / 15-locale publishing policy)

- Added one central search-publishing policy containing the audit-approved 15
  locales and 50 demand-led brands. The 50-brand list is a quality work queue,
  not automatic permission to index 750 locale-brand template combinations.
- Reduced general sitemap and default hreflang exposure from all 44 active
  locales to English, Russian, Spanish, Italian, Japanese, Turkish, Vietnamese,
  German, Indonesian, French, Dutch, Polish, Portuguese, Swedish and Chinese.
  Other locale routes remain functional but now emit `noindex, follow`, no
  locale alternates and no sitemap entry.
- Brand pages require all three gates: inclusion in the priority-50 list, an
  existing sample-code/brand-specific editorial record, and an approved locale.
  Initial brand exposure is English and Russian only. Priority brands without
  current evidence (for example Dove) remain useful tools but stay noindex.
- Long-form guide and decoder entries now require their locale-specific content
  review record as well as membership in the 15-locale maximum. Their metadata,
  hreflang and sitemap eligibility use the same review source.
- Result: the local production sitemap dropped from 11,352 to 242 URLs. The
  homepage emits 15 locale alternates plus x-default; an approved brand page
  emits English/Russian plus x-default. Local samples confirmed Arabic Dior and
  English Dove as `noindex, follow`, and Russian Dior as `index, follow`.
- Files: `src/lib/publishing-policy.ts`, `src/lib/seo.ts`, `src/app/sitemap.ts`,
  brand/guide/decoder metadata routes, `src/lib/site.ts`, quality regressions,
  `package.json` and this log.
- Verification: scoped ESLint, TypeScript and 26/26 regression tests passed;
  production build completed all 267 static pages; rendered localhost metadata,
  sitemap membership and alternate counts passed. The existing private photo
  route NFT tracing warning remains non-fatal.
- Deployment: commit `43cd660` deployed successfully in GitHub Actions run
  `29495776323` (5m34s). Live verification returned HTTP 200 for home, sitemap
  and robots; sitemap contains 242 URLs; home emits 15 locales plus x-default;
  Arabic Dior and English Dove emit `noindex, follow`; Russian Dior emits
  `index, follow`; English Dior exposes EN/RU plus x-default. The corrected home
  copy is live and sampled legacy authenticity/private/precision promises have
  zero matches. Existing search URLs will remain known to Google after sitemap
  removal until crawlers revisit and process their noindex tags.

## Completed — 0.9.2 (homepage truthfulness and export hardening)

- Corrected the English homepage metadata, hero, trust indicators, feature
  claims, How It Works copy and HowTo structured data. The homepage now
  distinguishes an estimated manufacture date and age from typical unopened
  shelf-life and PAO guidance; it no longer promises a manufacturer expiry
  date, authenticity checking, browser-only/private processing or universally
  precise manufacturer algorithms.
- Hardened authenticated review CSV downloads against spreadsheet-formula
  injection in user-controlled fields while retaining quoted UTF-8 CSV output.
  Added regression coverage for all common formula prefixes and quote escaping.
- Forced the vulnerable transitive PostCSS 8.4.31 dependency to the patched
  8.5.16 release. The production dependency audit now reports zero known
  vulnerabilities at every severity.
- Files: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`,
  `messages/en.json`, `src/lib/site.ts`, `src/lib/seo.ts`,
  `src/components/home/hero.tsx`, `src/lib/csv.ts`, review export route,
  quality regressions and this log.
- Verification: scoped ESLint and TypeScript passed; decoder/quality regressions
  passed 25/25; `pnpm audit --prod` reports 0 vulnerabilities; production build
  completed all 267 static pages. The known private photo-route NFT tracing
  warning remains non-fatal.
- Remaining: equivalent truth/privacy wording still requires a controlled audit
  across the other active locales. Mobile overflow from the audit screenshot is
  still `needs verification` under real device emulation before changing global
  layout CSS. No deployment was performed; owner requested local review first.

## Completed — 0.9.1 (source and private-data backup)

- Created a local `backups/2026-07-16-system-backup` directory containing a
  compressed working-tree snapshot (including uncommitted project work), a
  complete Git bundle and the supplied GSC/Yandex XLSX exports. Reproducible
  build output, dependency caches, Codex artifacts and secret environment files
  are intentionally excluded.
- Generated SHA-256 checksums; archive listing, bundle verification and all
  checksum validations passed. The verified local backup occupies 30 MB and is
  excluded from Git.
- Added a manual GitHub Actions workflow that creates a mode-0600 SHA-256
  verified archive of `/opt/cosmeticsbatch-data` under the root-only VPS folder
  `/opt/cosmeticsbatch-backups`. Private submissions and email addresses never
  enter the public repository or GitHub artifacts.
- Files: `.github/workflows/backup-vps-data.yml`, `.gitignore`, `package.json`,
  `PROJECT_STATUS.md`; local ignored `backups/2026-07-16-system-backup/*`.
- Verification: GitHub Actions backup run `29492761231` completed successfully
  and created `cosmeticsbatch-data-20260716T105914Z.tar.gz`; the server-side
  SHA-256 verification returned `OK`.

## Completed — 0.9.0 (review operations workspace and mail routing)

- New photo-submission notifications now go to the configured notification
  mailbox and every authorized address in `REVIEWER_EMAILS`, with normalized
  duplicate removal. This fixes the prior behavior where notifications only
  targeted the hard-coded `contact@cosmeticsbatch.com` mailbox.
- Expanded the private review dashboard with queue KPI cards, status-aware
  search, direct user-email access, reviewer-notification state and reply
  provider-acceptance state.
- Added authenticated CSV and JSON downloads for submissions and the newest
  1,000 batch-code checks. Submission exports include operational metadata but
  exclude private photo paths and image contents; check exports retain the
  existing no-IP/no-user-email data model.
- Files: `package.json`, `PROJECT_STATUS.md`, `src/lib/submission-email.ts`,
  `src/lib/submission-store.ts`, `src/app/[locale]/review/page.tsx`,
  `src/app/[locale]/review/api/export/route.ts`.
- Verification: TypeScript, scoped ESLint, diff check, 24/24 decoder/quality
  regressions and the production build (267 static pages) passed. The known
  private photo-route NFT tracing warning remains non-fatal. Production
  notification delivery remains pending local owner review and deployment.

## Completed — 0.8.1 (VPS disk recovery and deploy hardening)

- Deployment run `29484411100` for commit `c2577d5` stopped before build/restart
  because the VPS filesystem returned `No space left on device` during
  `git pull`; production was not assumed updated.
- Added pre-pull disk diagnostics and `docker system prune -af` to the deploy
  workflow. This removes stopped containers plus unused images, networks and
  build cache while preserving Docker volumes and the running production
  container.
- Recovery run `29484542233` found the 72 GB root filesystem at 100%. Docker
  build cache was the primary cause: 256 cache objects occupied 41.68 GB, with
  37.51 GB reported reclaimable. Cleanup reclaimed 38.56 GB and reduced root
  usage to 37 GB / 51% (36 GB available).
- Future deploys run the cleanup only when root usage reaches 85%, retaining
  reusable build cache under normal conditions while preventing another
  pre-pull disk exhaustion.
- Files: `.github/workflows/deploy.yml`, `package.json`, `PROJECT_STATUS.md`.
- Verification: recovery run completed successfully, rebuilt 267 static pages,
  restarted the `cosmeticsbatch` container and reported it running. Live home,
  Turkish brand directory and local Dior logo requests returned HTTP 200; the
  home HTML contains the ten deployed local brand wordmarks.

## Completed — 0.8.0 (How It Works visual redesign)

- Replaced the sparse icon-only How It Works cards with three code-native mini
  illustrations: a brand picker using verified local Chanel/Dior/Lancôme logos,
  a product-and-batch-code scanning scene, and a manufacture-year/freshness
  result panel.
- Tightened card hierarchy with contained visual stages, numbered dividers,
  integrated connector arrows, subtle ambient color and hover elevation. The
  illustrations are decorative and reuse the existing localized titles/body
  copy, so no untranslated visible strings were introduced.
- Used HTML/CSS and the existing Lucide/logo asset system instead of additional
  raster downloads, preserving sharp rendering, dark-mode compatibility and
  low transfer cost.
- Files: `package.json`, `PROJECT_STATUS.md`,
  `src/components/home/how-it-works.tsx`.
- Verification: local `tsc --noEmit`, targeted ESLint, `git diff --check` and
  the complete compiled decoder/quality suite passed (24/24). A 1440 px-wide
  local Chrome screenshot visually confirmed the desktop layout. The Next.js
  production build completed all 267 static pages; the known photo-route NFT
  whole-project tracing warning remains and did not fail the build.
- Production publication remains pending local owner review; no commit, push or
  deployment was performed.

## Completed — 0.7.1 (review analytics exclusion)

- Confirmed the review page itself had no analytics code, but the shared locale
  layout injected Google consent/GA4 and Yandex Metrica on review routes.
- Moved consent, GA4 and Metrica rendering into one pathname-aware client
  boundary. It returns no tracking or consent markup for both `/review/*` and
  `/{locale}/review/*`, while preserving the existing consent-gated behavior on
  public pages.
- Files: `package.json`, `PROJECT_STATUS.md`, `src/app/[locale]/layout.tsx`,
  `src/components/tracking-boundary.tsx`, `scripts/quality-regression.test.ts`.
- Production publication remains pending local owner review; no commit, push or
  deployment was performed.
- Verification: `tsc --noEmit`, targeted ESLint and the complete local compiled
  decoder/quality suite passed (24/24). The regression asserts that the shared
  layout contains no direct tracker injection and that the boundary returns
  `null` for any pathname segment named `review`.

## Completed — 0.7.0 (Wikidata brand-logo migration, local preview)

- Removed runtime brand-favicon loading from the shared `BrandLogo` component
  used by the directory, picker, check page, brand headers and related cards.
- Added a reproducible Wikidata importer. It accepts only `P154` records whose
  entity `P856` official website host matches the existing official-domain
  registry, then stores the Wikimedia Commons file locally.
- Strict generation produced 71 domain-verified logos across the complete
  331-entry catalog. Wikidata had no domain-verifiable `P154` for the other 260;
  these retain controlled wordmark/monogram fallbacks instead of receiving an
  unrelated image mislabeled as a real logo.
- The manifest records local path, Wikidata QID, Commons filename and domain
  verification. `public/brand-logos/missing.json` records every unresolved entry
  and reason.
- Added regression coverage for the verified baseline, local assets, QIDs,
  domain verification, safe SVG content and removal of favicon/external loading.
- Files: `package.json`, `PROJECT_STATUS.md`, `src/components/ui/brand-logo.tsx`,
  `src/lib/brand-logos.ts`, `src/lib/wikidata-brand-logos.json`,
  `scripts/fetch-wikidata-brand-logos.mjs`, `scripts/quality-regression.test.ts`,
  `public/brand-logos/*`.
- Production publication remains pending local owner review; no commit, push or
  deployment was performed.
- Verification: `tsc --noEmit`, targeted ESLint and the complete local compiled
  decoder/quality suite passed (23/23). The Turkish `/brands` local render
  contained 25 `/brand-logos/` asset instances in its initial HTML; its only
  `favicon.ico` reference is the site's own document icon from the root layout,
  not a brand image request. `git diff --check` passed after the change.

## Completed — 0.6.1 (decoder correctness vs real product photos)

Audited the decode engine against 84 owner-supplied product photos and
user-supplied manufacturer specs. Found and fixed real errors; confirmed others.

- **Creed — rewrote.** The old rule ("first letter = production year, A = 2010")
  was invented and returned dates up to ~9 years wrong (it read the modern lot
  code F001704 as 2015). Real systems: classic 2013–2022 codes carry the year in
  the two digits after a 3-char product id (A4221N01 → 2021); the 2023+ F-series
  encodes only "2023 or later", reported at low confidence. Sample code, decoder
  guide, brand FAQ and fixtures updated.
- **Dior — rewrote.** Modern Dior codes are year-digit + month-letter (A = Jan …
  M = Dec, skipping I) + day/batch: 5H03 → August 2025, 9K44 → October 2019. The
  previous decoder implemented none of this and returned nothing for every real
  modern Dior code. Vintage all-digit and sibling LVMH/Chanel codes still read
  through the embedded-date reader (kenzo 24045, guerlain 3245, fenty 231122).
- **L'Oréal group — precision fix.** Codes encode only year + month (54YN00 →
  November 2024, confirmed against the pack's printed 11-2027 expiry). The UI was
  formatting a mid-month placeholder day as if real. Added a `datePrecision`
  field to the decode result (from the decoder profile, with a per-read
  override) and taught the result card, brand page and share text to hide the day
  for month/year-precision codes. Now covers L'Oréal, Estée Lauder and Creed.
- **Confirmed correct:** Estée Lauder / MAC / Tom Ford 3-char code
  (batch-month-year: A54 → May 2024, BC5 → December 2025) and Coty/Escada YDDD.
- **Known gaps (safe — return "couldn't read", never a wrong date):** Acqua di
  Parma (real codes like 2480Y) and Aesop (29N0624) do not match their assigned
  parent-group decoders; both currently show that parent's format explanation on
  their brand page, which is misleading and should be revisited. Chanel's soap
  code 8401 does not decode (no ground-truth Chanel spec yet).
- **Still pending:** a real audit of the user check dataset (which live searches
  failed or mis-decoded) needs the production `.jsonl` exported off the VPS — it
  is a private bind mount with no local copy.
- Files: `src/lib/decoder/{decoders,index,types}.ts`, `src/lib/decoder-guides.ts`,
  `src/lib/brand-detail.ts`, `src/components/{result-card,result-actions}.tsx`,
  `src/app/[locale]/brands/[slug]/page.tsx`, `messages/en.json` +
  `messages/{ru,de,es,tr,uk,pl,ro,ja,it}.json` (Creed/Dior/Escada prose),
  `scripts/decoder-regression.test.ts`, `package.json`.
- Verification: `tsc --noEmit`, decoder-example guard (all examples decode),
  23/23 combined regression + quality suite. Not committed or deployed pending
  owner review.

## Completed — 0.6.0 (homepage wordmark marquee, local preview)

- Replaced the homepage's favicon-based popular-brand cards with a continuous,
  edge-faded wordmark rail modeled on the owner-supplied mobile reference.
- Curated ten locally served SVG wordmarks linking to the matching brand pages:
  Estée Lauder, Maybelline, Lancôme, YSL Beauty, Dior, Chanel, Creed, Jean Paul
  Gaultier, Paco Rabanne and Carolina Herrera. The homepage no longer makes
  runtime favicon requests for this section.
- The marquee pauses on hover and keyboard focus. It becomes a manually
  scrollable single row with no duplicated content when the user requests
  reduced motion.
- Added source URLs and trademark/non-affiliation notes in
  `public/brand-wordmarks/README.md`. Current brand presentation and production
  reuse rights remain **needs verification** before publication.
- Added a regression that requires every curated asset to exist, verifies it is
  SVG, rejects scripts/event handlers/external embedded images, and prevents the
  homepage component from returning to `BrandLogo`/favicon loading.
- Files: `package.json`, `PROJECT_STATUS.md`, `src/app/globals.css`,
  `src/components/home/popular-brands.tsx`, `scripts/quality-regression.test.ts`,
  `public/brand-wordmarks/*`.
- Local preview: a 390 px-wide Turkish homepage screenshot rendered the new
  borderless grey wordmark rail. Production publication is intentionally
  pending owner review; no commit, push or deployment was performed.
- Verification: local `tsc --noEmit` passed; targeted ESLint passed; the local
  compiled decoder/quality suite passed 23/23, including the new wordmark asset
  safety regression; `git diff --check` passed after the change.

## Completed — 0.5.3 (brand packaging photo examples)

- Added 43 owner-supplied packaging examples to 15 matching brand pages. Images
  are center-cropped out of the supplied phone captures, converted to JPEG and
  resized to 900 px for web delivery.
- Reused the existing brand `codeImages` presentation directly below each
  localized code-location explanation; no new unlocalized visible copy was
  introduced.
- Enforced the requested maximum of three images per brand in the registry and
  in a regression test. Galleries contain one to three examples depending on
  which source files were available for that brand.
- Six representative outputs were visually spot-checked for brand/context and
  code-location usefulness. Full editorial review of all 43 images and the
  right to publish/reuse every supplied source remain **needs verification**;
  the pages do not claim that the photos prove product authenticity.
- Files: `package.json`, `PROJECT_STATUS.md`, `src/lib/brands.ts`,
  `src/app/[locale]/brands/[slug]/page.tsx`,
  `scripts/quality-regression.test.ts`, `public/brands/examples/*.jpg`.
- Verification: local `tsc --noEmit` passed; targeted ESLint passed; local
  compiled quality/decoder suite passed 22/22; `git diff --check` passed before
  this status update. The `pnpm test:quality` wrapper itself failed before tests
  because it attempted a registry metadata fetch and then refused a non-TTY
  modules purge; the equivalent repository-local binaries passed.
- Local preview: the Turkish Chanel route rendered all three registered image
  paths at `http://127.0.0.1:3100/tr/brands/chanel`. Production publication is
  intentionally pending owner review of the local preview; no commit, push or
  deployment was performed in this change group.

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
