# CosmeticsBatch project status

Last updated: 2026-07-19
Current version: **1.3.2**
Current phase: **Phase 3 in progress — primary UX, accessibility and SEO correction**

This is the shared handoff document for maintainers and agents. Read it before
work and update it after every logical change group. Detailed audit evidence and
priorities live in `AUDIT.md`.

## Binding project policies — every agent must follow

These rules remain in force until the owner explicitly changes them and the
decision is recorded here. Version notes do not override this section silently.

### Agent coordination and ownership

- `PROJECT_STATUS.md` is the shared communication channel and source of truth
  for Codex, Claude and every other contributor. Read it before inspecting or
  editing implementation files.
- Before work, create or adopt one unique work-item claim with owner, state,
  starting commit, exact file scope, acceptance criteria and timestamp.
- Do not implement the same task or edit overlapping files concurrently. If an
  active claim overlaps, stop and redirect one agent to a disjoint roadmap item.
- Before each edit, inspect `git status --short` and the target diff. Unexpected
  changes belong to another contributor; preserve them and communicate through
  this file instead of overwriting, reverting, staging or committing them.
- Each agent must leave a handoff here containing changed files, exact checks,
  failures, residual risks and a proposed next disjoint task. Agents must read
  the other agent's latest handoff before selecting new work.
- Shared edits to this file must merge existing notes. Never delete another
  agent's claim, evidence, blocker or incomplete work without an explicit
  recorded resolution.

### Completion, commit and deployment

- A task is complete only when acceptance criteria and required focused plus
  repository-wide checks pass. Record skipped checks and `needs verification`
  honestly; a successful build or deploy alone is not proof of behavior.
- Work is accumulated and verified locally. Do not commit another agent's files.
- Commit, push and production deployment are separate permissions. The owner
  currently requires a batched release: do not push or deploy until the owner
  explicitly says the accumulated release is ready.
- The accumulated local release changes production deployment to manual-only
  `workflow_dispatch`. The remote workflow still has its previous push trigger
  until this control change is published; therefore do not push meanwhile.
  After publication, never restore push-triggered deployment without an explicit
  owner decision.

### Language and search-exposure policy

- Supported routes are limited to 19 locales in three tiers: full quality
  (`en`, `de`, `es`, `it`, `ja`, `fr`), investment pilot (`nl`, `sv`, `da`,
  `ko`, `ar`, `pt`) and organic preservation (`tr`, `vi`, `id`, `pl`, `ru`,
  `zh`, `yue`). Do not reactivate a retired locale without evidence and owner
  approval.
- The 25 retired locale prefixes permanently redirect once to the equivalent
  prefix-free English path while preserving the query string.
- Sitemap, canonical, hreflang, robots and ad eligibility must use the same
  publishing-policy source. A route must not be presented as translated merely
  because a locale URL renders.
- About, Contact, Privacy and Terms are authored in English only. Only English
  versions belong in sitemap/hreflang and search indexing; other locale routes
  remain functional with `noindex, follow` until genuinely translated.

### Truthfulness, privacy and decoder boundaries

- Describe manufacture date and product age as estimates where appropriate.
  Typical unopened shelf life and PAO are separate guidance, not a manufacturer
  expiry date. A decoded code cannot prove authenticity or product safety.
- Checks are processed on the server. The private quality dataset may retain
  code, brand, result, locale, time and coarse country; it excludes IP, name,
  email and account identifiers. Never claim browser-only processing, no server
  transmission, no storage or complete privacy.
- Proprietary decoder `method` and `notes` must not cross a public API or RSC
  client boundary, appear in rendered HTML/source, schema, logs or exports.
- P0 correctness, privacy, security and data-loss findings block lower-priority
  feature work until fixed or explicitly accepted by the owner and recorded.

## Current production snapshot — read before changing anything

- Production branch: `main`; deployment is triggered by GitHub Actions and
  rebuilds/restarts the VPS container over SSH.
- Current production baseline: commit `a64f2b9`; GitHub Actions deploy run
  `29663601031` completed successfully. Production package/document version is
  `1.0.1`; repository HEAD contains the undeployed privacy patch and the current
  accumulated local working version is `1.1.0`.
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
- Verification baseline: 52 regression tests cover decoder invariants, data
  integrity, locale photo-copy completeness, logo-source safety and public
  index policy. Use local binaries if the `pnpm` wrapper tries a registry check
  in a restricted/TTY-less environment.

## Active findings / next dependency-ordered work

- `ADSENSE-APPROVAL-016`; owner: primary Codex agent; state: `In progress`;
  claimed 2026-07-19 Europe/Istanbul; starting commit `c681ee5`; starting
  version `1.3.0`. Scope: official-Google-only AdSense acceptance research,
  repository/live readiness matrix, consent/CMP switch controls, privacy
  disclosures, monetized-inventory gating, mixed-language/low-value blockers,
  ads.txt/site connection and account-side application runbook. Intended files:
  `docs/ADSENSE_READINESS.md`, `PROJECT_STATUS.md`, `src/lib/ads.ts`,
  `src/components/tracking-boundary.tsx`, `src/components/cookie-consent.tsx`,
  `src/app/[locale]/privacy/page.tsx`, monetized page components, deployment
  environment templates and focused tests. Acceptance: cite current official
  Google requirements; distinguish mandatory policy from recommendations;
  prevent a custom banner from being represented as a certified TCF CMP; keep
  ads off unreviewed/unsupported/mixed-language inventory; provide revocation
  access when Google Privacy & messaging is enabled; verify code locally and
  list every account/production/manual dependency. Google approval cannot be
  guaranteed or truthfully marked 100%; no application, account mutation,
  commit, push or deployment without the required external/account evidence.
  Research/implementation update: official Google guidance confirms that the
  whole site is reviewed; original useful publisher-content, clear navigation,
  compliant inventory/placements, privacy disclosures and valid traffic are
  required. Personalized ads in the EEA, UK and Switzerland require a
  Google-certified CMP integrated with IAB TCF; Google Privacy & messaging now
  supports TCF v2.3 and consent revocation. Repository changes separate CMP
  verification from presence of a publisher ID via
  `NEXT_PUBLIC_GOOGLE_CMP_ENABLED`; the existing custom banner identifies
  itself as non-TCF and is suppressed only after that explicit production flag.
  AdSense loader/units are now restricted to English, fully gated content while
  other locale routes stay functional without ad code. A measured 30-key
  non-English brand-detail gap manifest prevents translated questions/sections
  from silently pairing with English fallback, with parity tests across all 18
  non-English active catalogs. Privacy now discloses third-party cookies, web
  beacons, IP/identifiers and Google partner-data use, describes the CMP
  prerequisite honestly and uses the verified public contact mailbox.
  `docs/ADSENSE_READINESS.md` now contains a mandatory blocker matrix,
  repository controls, content/inventory review and exact account-side runbook
  with current official Google URLs. Focused ESLint, TypeScript, `bash -n`,
  `git diff --check`, 65/65 quality tests and all four operational validators
  passed. Remaining blockers: publish/test the account-side certified CMP and
  TC string; confirm Sites/ads.txt/Policy Center/identity/payment status; clear
  all 46 public-asset provenance reviews; native editorial/rendered fallback
  sample; real mobile/CWV with ads. State remains `In progress / blocked before
  application`; no 100% guarantee, application, commit, push or deployment.
  Production build passed 267/267 pages after these changes. The earlier
  submission-store/dataset trace sources are resolved; the warning narrowed to
  two remaining runtime path joins in `src/app/api/code-photo/route.ts`, which
  are now explicitly excluded from NFT tracing while retaining the fixed
  private bind-mount root. A final warning-free rebuild remains pending.
  Follow-up build completed warning-free at 267/267 after the final route-path
  annotations and the concurrently introduced review-dashboard import was
  reconciled. The first post-fix rendered audit reduced 64 reported metadata
  overages to 23 while all 206 sitemap URLs, canonicals/hreflang and 4,864
  discovered internal paths remained structurally valid. The 23 residuals were
  audit false positives: React encodes apostrophes as hexadecimal numeric HTML
  entities (for example `&#x27;`), but the crawler decoded only named entities,
  adding three characters per apostrophe. Numeric entity decoding has been
  added; final crawl rerun is pending and this item stays `In progress`.
  SEO crawl result (`Completed locally`): the final rendered production audit
  passed all 206 sitemap URLs and 4,864 unique internal paths. Every sitemap URL
  returned 200, stayed indexable, emitted a self-canonical, remained inside the
  60-character title and 160-character description budgets, and produced
  reciprocal sitemap-contained hreflang targets; no checked internal link
  redirected, timed out or returned an error. The crawler now has bounded
  concurrency, per-request timeout, progress output and correct named/decimal/
  hexadecimal HTML entity decoding. This is local production-output evidence,
  not proof that external crawlers have refreshed their indexes. No new public
  URL, commit, push or deployment.
  Pre-release independent review found five dashboard regressions in the
  concurrent Claude change set before deployment: the checks search dropped
  active brand/country filters; result-chip counts ignored composed filters;
  the failed-code 7/14-day comparison was capped to the newest 5,000 all-time
  rows; retry-count help relied on a hover-only `title`; and decoder trend
  aggregation rescanned the complete check set per brand. State: `In progress`;
  these findings are recorded before correction and block the release gate
  until focused tests and the full verification suite pass.
  Pre-release review correction (`Completed locally`): checks search now
  preserves brand/country/result filters, chip counts use the same non-result
  filter base as the table, failed-code trends read the complete 30-day window,
  retry counts expose assistive text, and decoder trend counters aggregate in a
  single pass. Added a focused regression guard. Scoped ESLint and
  `git diff --check` passed; repository-wide gate and rebuilt runtime smoke are
  pending before publication.
  Release gate result (`Completed locally`, 1.3.1): independent read-only
  review reported no P0/security finding and all five P2/P3 dashboard findings
  above are corrected. Repository ESLint, TypeScript, shell syntax,
  `git diff --check`, 68/68 quality tests and all four operational validators
  passed. The warning-free production build generated 267/267 pages. The
  rebuilt standalone server returned 200 for `/`, `/brands/dior`, `/check` and
  `/sitemap.xml`; `/ads.txt` correctly returned 204 in the intentionally
  credential-free local build. Production deployment and live verification are
  pending; account/CMP/editorial/provenance blockers remain unchanged.
  Deployment attempt (`Blocked safely`, run `29703281893`): the VPS build
  completed all 267 pages but failed while copying the standalone layer with
  `no space left on device`. The filesystem was 100% full before cleanup and
  97% full (2.5 GiB available) afterward; active container writable layers
  totalled 56.59 GiB. The candidate was never started or switched, so the prior
  production container remained intact. Added an early 6 GiB headroom gate and
  per-container writable-layer diagnostics to the manual workflow. No active
  container or private data is deleted automatically; the exact large owner
  must be identified before cleanup. State remains `Blocked` pending the
  diagnostic rerun and scoped disk remediation.
  Diagnostic rerun (`Blocked safely`, run `29703582141`): the headroom gate
  stopped before pulling/building. Per-container measurement identified
  `yerelatlas-app-1` at 56.3 GiB writable size; `cosmeticsbatch` is only 329 MiB.
  The blocker therefore belongs to a separate application on the shared VPS,
  not this release or its private dataset. Added a read-only directory-size
  diagnostic for oversized active containers; no unrelated container data will
  be removed until the exact cache/log target is known.
  Read-only directory audit (`Completed`, run `29703992952`): 52.5 GiB of the
  56.4 GiB YerelAtlas writable layer is `/app/.next`; `/app/node_modules` is
  208.7 MiB and `/app/public` is 88.2 MiB. Added an owner-triggered workflow
  input, disabled by default, that removes only contents of the verified
  rebuildable `yerelatlas-app-1:/app/.next/cache` directory and only when it is
  at least 10 GiB. It does not delete the container, database, volume, source or
  CosmeticsBatch data. The maintenance run and post-cleanup deploy remain
  pending.
  First maintenance attempt (`Blocked safely`, run `29704172866`): the verified
  `/app/.next/cache` target was absent or below the 10 GiB threshold, so no
  files were removed and deployment remained blocked. The large `.next` size
  belongs to a different child; the workflow now reports a targeted read-only
  two-level breakdown before any further cleanup decision.

- `RELEASE-HARDENING-015`; owner: primary Codex agent; state: `In progress`;
  claimed 2026-07-19 Europe/Istanbul; starting commit `fa054ac`; starting
  version `1.2.0`. Scope: reconcile stale roadmap states, then complete the
  remaining locally actionable work in dependency order across public mobile
  UX/accessibility/RTL, CWV and build tracing, technical SEO and active-locale
  catalogs, decoder/evidence controls, assisted photo tools, security/retention
  operations and consent/AdSense readiness. Intended scope may include
  `PROJECT_STATUS.md`, `package.json`, `src/app/**`, `src/components/**`,
  `src/lib/**`, `src/i18n/**`, `messages/**`, `scripts/**`, `docs/**` and
  non-private generated control data. Acceptance: record each discovered
  finding before implementation; preserve the 19-locale and no-new-product-URL
  policies; add focused regression coverage; pass focused checks and the full
  repository gate; never expose private submissions, decoder methods or
  secrets; do not fabricate native-language, legal, license, production,
  AdSense-account or time-window verification. External/account/legal/device
  dependencies remain explicitly `Blocked` or `needs verification`. No commit,
  push or deployment without a later explicit publication instruction.
  Initial mobile/accessibility findings recorded before implementation:
  `P1` — the global skip link is hard-coded English on every locale and the
  mobile bottom navigation exposes an English-only `Primary` label; affected
  scope `src/app/[locale]/layout.tsx`, `src/components/layout/bottom-nav.tsx`
  and active message catalogs; state `In progress`. `P1` — the mobile menu
  button/dialog is labelled with the translated word for “Brands” although it
  opens the complete site navigation; affected scope
  `src/components/layout/site-header.tsx` and navigation copy; state
  `In progress`. `P2` — several directional utility classes and arrow glyphs
  assume LTR, including the brand-picker chevron alignment and recovery/guide
  affordances; affected public form/photo/navigation components; state
  `In progress`. Acceptance: controls have truthful localized accessible names,
  active RTL layout uses logical alignment/direction where behavior changes,
  no 44-locale re-expansion, and regression checks cover active catalogs.
  Mobile/accessibility group 1 result (`Completed locally`, 1.2.1): added a
  bounded accessibility-copy registry for all 19 active locales; the global
  skip link, desktop and bottom navigation, mobile menu trigger/dialog and
  close controls now expose truthful localized names. Replaced affected
  physical left/right spacing with logical start/end utilities in the global
  skip link, header and checker controls so Arabic follows document direction.
  Changed files: `src/lib/a11y-copy.ts`, `src/app/[locale]/layout.tsx`,
  `src/components/layout/site-header.tsx`,
  `src/components/layout/mobile-header-menu.tsx`,
  `src/components/layout/bottom-nav.tsx`, `src/components/check-form.tsx`,
  `package.json`, `PROJECT_STATUS.md`. Focused ESLint, repository TypeScript and
  `git diff --check` passed. Native speaker review of the concise accessibility
  strings and real VoiceOver/TalkBack behavior remain `needs verification`;
  no claim of device or native-editor approval, commit, push or deployment.
  `PHOTO-ASSIST` result (`Completed locally`, without OCR): selected photos now
  receive local previews and user-controlled 90-degree rotation, centered
  square crop, contrast enhancement and removal before upload. The chosen
  transformations are applied during the existing browser-side resize/JPEG
  re-encode, so embedded metadata still does not pass through; blob preview
  URLs are revoked on replacement, removal and unmount. All controls have
  localized accessible labels for the 19 active locales. No OCR guess is made
  or silently submitted, no decoder/API method changed and no new URL was
  added. Changed files: `src/components/code-photo-submission.tsx`,
  `src/lib/photo-assist-copy.ts`, `src/lib/photo-transform.ts`,
  `scripts/quality-regression.test.ts`, `PROJECT_STATUS.md`. Focused ESLint,
  TypeScript, `git diff --check` and the complete 61/61 quality suite plus all
  operational validators passed. Actual camera/gallery behavior on iOS Safari
  and Android Chrome remains `needs verification`; no commit, push or deploy.
  `P2` build-tracing finding — state `In progress`: Next.js 16.2.9 reported
  that the runtime submission directory caused an unintended whole-project NFT
  trace through the protected image route. The warning explicitly identified
  dynamic filesystem path construction in `submission-store.ts`; scope is
  restricted to tracing annotations around the runtime bind-mounted queue,
  lock and validated image root. Acceptance: production build emits no
  whole-project trace warning, standalone review file containment remains
  unchanged and private runtime data is not copied into build output.
  `P3` retired-catalog debt — state `In progress`: `messages/` still contains
  JSON catalogs for all 25 locale prefixes retired by the binding 19-locale
  policy. Runtime routing already redirects those prefixes to English and never
  imports the catalogs, but their presence invites accidental reactivation and
  causes agents to spend effort on unsupported languages. Affected scope is
  exactly the codes in `RETIRED_LOCALE_CODES`; acceptance: remove only those 25
  message files, retain all 19 active catalogs, validate registry/catalog parity
  and preserve permanent redirect behavior.
  Retired-catalog result (`Completed locally`): removed exactly the 25 JSON
  catalogs named by `RETIRED_LOCALE_CODES`; all 19 active catalogs remain.
  Added a regression invariant requiring filesystem catalogs to equal
  `LOCALE_CODES` and forbidding every retired catalog. Redirect implementation
  remains unchanged. `npm run test:quality` passed 62/62 with all operational
  validators, repository TypeScript and `git diff --check`. Deleted catalogs
  remain recoverable from Git history; no active language route, commit, push
  or deployment was removed or performed.
  `P1` deployment recovery finding — state `In progress`: `deploy.sh` removes
  the healthy production container before proving the replacement can boot, so
  an image/runtime regression turns a failed release into avoidable downtime.
  The workflow also treats container existence as success without HTTP smoke
  checks. `P2` backup finding — state `In progress`: private-data backups are
  manual-only and checksum-tested but never extraction-tested. Affected scope:
  `deploy.sh`, `Dockerfile`, `.github/workflows/deploy.yml` and
  `.github/workflows/backup-vps-data.yml`. Acceptance: boot/health-check a
  candidate before replacing the current named container; preserve the old
  container when candidate health fails; verify core HTTP routes after switch;
  schedule backups and test newest archive extraction without restoring over
  production data. Production execution remains pending explicit deployment.
  Operations result (`Completed locally; production verification pending`): the
  Docker image now declares a local HTTP health check. `deploy.sh` boots and
  tests a separately named candidate while the current container remains live,
  retains the previous container during the switch, checks `/`,
  `/brands/dior` and `/check`, and rolls back on a post-switch failure. The
  backup workflow now runs weekly as well as manually, verifies SHA-256 and
  extracts the archive into an isolated temporary directory. Weekly grouped
  dependency updates are configured; `pnpm audit --prod --json` reported 0
  known vulnerabilities across 138 resolved production/optional dependencies
  on 2026-07-19. `bash -n deploy.sh` and `git diff --check` passed; ShellCheck
  and actionlint are not installed, and no workflow was executed remotely.
  Retention data classes, present storage behavior and the exact owner/legal
  decisions required before deletion automation are recorded in
  `docs/RETENTION_AND_RECOVERY.md`; no duration was invented and no private data
  was deleted. Secret rotation, backup encryption-at-rest, real restore,
  production candidate/rollback and Resend retention remain `needs verification`.
  `P1` SEO crawl-control finding — state `In progress`: existing source-level
  tests protect publishing rules but there is no reusable rendered-surface gate
  that walks the generated sitemap and detects non-200 entries, wrong/self-
  canonical paths, sitemap `noindex`, over-budget titles/descriptions,
  non-reciprocal hreflang or broken internal links. Affected scope:
  `scripts/audit-seo-surface.mjs`, package scripts and generated production
  output only. Acceptance: audit the local production server without changing
  or adding public URLs, reject the listed defects, report exact failing URLs
  and record any environment-limited checks honestly.

- `LOCAL-RELEASE-GATE-014`; owner: primary Codex agent; state: `Completed with
  explicit mobile limitation`; verified 2026-07-19; version `1.2.0`. Full
  accumulated working-tree gate passed: repository ESLint, TypeScript,
  `git diff --check`, 60/60 decoder/quality tests, search evidence (2 sources/2
  claims), experiment registry (2), content freshness (26 brands), evidence
  inventory (46 assets) and 267/267 production build. The only build warning is
  the pre-existing submission-store NFT whole-project trace. Running standalone
  production returned 200 for `/`, `/brands/dior` and `/check` with expected
  security headers. Mobile screenshots were attempted but not produced because
  `node_modules/.bin/playwright` is absent in the current 1.2.0 installation;
  real-device/390px visual verification remains `needs verification`, not
  silently passed. Local servers were stopped. No commit, push or deployment.

- `ADS-READY-013`; owner: primary Codex agent; state: `Audit completed —
  application blocked`; audited 2026-07-19; scope: current AdSense integration,
  consent/CMP, ads.txt, eligible inventory, navigation/content and readiness
  documentation; no account mutation, ad activation, legal conclusion, commit,
  push or deployment. Result: reviewed-content inventory gating, reserved ad
  height, ads.txt generation, private-review exclusion, consent-mode defaults,
  navigation and original brand/editorial thresholds are implemented. Blocking
  issue: the repository explicitly uses a custom non-certified banner while
  Google currently requires a Google-certified TCF CMP for EEA/UK/Switzerland
  AdSense inventory; the AdSense loader can also be called before affirmative
  consent. Privacy copy says applicable consent is obtained “through a consent
  management platform”, which is not proven by the current implementation.
  Configure Google Privacy & messaging CMP or another certified CMP, verify TCF
  v2.3/region behavior and update/remove the competing custom ad-consent flow
  before application. Account site/ads.txt status and production CMP signals
  remain `needs verification`. Evidence and exact official sources are in
  `docs/ADSENSE_READINESS.md`.

- `EVIDENCE-LIBRARY-012`; owner: primary Codex agent; state: `Completed locally`;
  claimed 2026-07-19; starting version `1.2.0`; scope: inventory and approval
  controls for existing public packaging/code images plus private-to-public
  evidence workflow documentation and validation; no image publication,
  submission migration, route, consent expansion, commit/push/deploy.
  Acceptance: inventory every active code image and file existence; never infer
  ownership/license/provenance from repository presence; mark current unknowns
  `needs verification`; require consent, anonymization/crop, source/submission
  reference, reviewer/date and decoder relevance before any future public use;
  prohibit email/note/raw private path in public evidence records.
  Result: deterministic inventory covers 46 active public code/packaging assets
  and validates every path/dimension. Because repository presence is not proof,
  every current asset is explicitly `existing-public-audit-required` with
  source, permission, privacy review and decoder relevance marked
  `needs-verification`. The documented future workflow requires consent,
  private source reference, anonymized crop/re-encode, reviewer/date and
  publication decision while excluding contact/private paths from public
  records. Inventory generation/validation, focused lint and `git diff --check`
  passed. No image was added, exposed, moved, committed, pushed or deployed.

- `EXPERIMENT-OPS-011`; owner: primary Codex agent; state: `Completed locally`;
  claimed 2026-07-19; starting version `1.2.0`; scope: versioned experiment
  registry/schema validator, operator documentation, package quality integration
  and this status entry. Acceptance: every experiment has unique ID/owner/type,
  exact existing URLs, source/baseline, hypothesis, primary metric, guardrails,
  changed files, local/released state, release commit/date when applicable,
  14/28-day follow-ups and keep/revise/revert decision; unreleased work cannot
  pretend to have production results; reject new product URLs in current brand
  experiments; validate current snippet and Dior baselines; no private data,
  commit, push or deployment.
  Result: `data/experiments/registry.json` records the L'Oréal Paris/Kérastase
  snippet and Dior existing-URL product-intent experiments with immutable
  baselines, hypotheses, metrics, guardrails, files and pending 14/28-day
  follow-ups. `npm run test:experiments` rejects duplicate/unsafe IDs, malformed
  URLs, nested product URLs, missing release metadata, premature outcomes or
  decisions and email-like/private-data fields; it now runs inside
  `test:quality`. Focused validation/lint, 59/59 quality tests, both evidence
  validators and `git diff --check` passed. No commit, push or deployment.

- `CHECK-RECOVERY-009`; owner: primary Codex agent; state: `Completed locally`;
  claimed
  2026-07-19; starting version `1.2.0`; scope to be finalized after read-only
  inspection, limited to failed-result recovery copy/model and its focused test;
  excludes review/auth, search-data, deployment, new routes and decoder method
  changes. Acceptance: guide barcode, incomplete/misread code, unsupported
  format and eligible photo-review cases without promising authenticity/expiry/
  safety; preserve all locales or use an honest existing localized fallback;
  measure-ready action taxonomy without IP/session identity; no commit/push/
  deploy. Agent must report exact proposed files before editing and avoid shared
  `package.json`/`PROJECT_STATUS.md` while other agents work.
  Result: the existing failure UI already separated barcode, invalid-format and
  unresolved cases with retry/photo/email actions. The invalid-format guidance
  incorrectly told users to remove spaces/punctuation even though decoder
  normalization already ignores them; EN/TR now direct users to compare every
  character, brand and packaging field while stating normalization truthfully.
  Recovery links carry stable anonymous `retry-code`, `submit-photos` and
  `email-support` action/reason attributes without identity data. Focused lint,
  TypeScript, `git diff --check`, 60/60 quality tests and all three operational
  validators passed. No new route, tracking identity, commit, push or deploy.

- `CONTENT-FRESHNESS-010`; owner: primary Codex agent; state: `Completed
  locally`; claimed
  2026-07-19; starting version `1.2.0`; scope: a new content-freshness manifest,
  standalone validator and documentation only; excludes messages, review/auth,
  product routes, package/status edits and deployment. Acceptance: cover current
  high-value/indexable brands with last editorial review, decoder verification,
  evidence count/status, reviewed locales, responsible role, next-review state
  and `needs verification` where facts are absent; validator rejects unknown or
  duplicate brands and future/invalid dates; no invented native review; no
  commit/push/deploy. Agent reports a handoff for primary integration.
  Result: a deterministic manifest now covers all 26 brands passing the current
  editorial/sample gate. It records the matrix review date, EN/RU exposure,
  evidence count/status, responsible role, remaining gap and explicitly marks
  decoder verification/next review as unverified/required rather than inventing
  approval. Drift validation rebuilds from the quality matrix and rejects
  duplicates, unknown/future dates or unsupported native-review claims; it is
  integrated into `test:quality`. The first validation correctly exposed a bad
  decoder-ID-as-slug assumption; the builder now uses the catalog's real slug
  normalization. Final focused lint, TypeScript, `git diff --check`, 60/60
  quality tests and all operational validators passed. No commit/push/deploy.

- `GROWTH-METRICS-008`; owner: primary Codex agent; state: `Completed locally`;
  claimed 2026-07-19; starting commit `fa054ac`; scope: deterministic anonymous
  GSC growth-baseline generator, shared TSV parser, generated brand/Tier-1
  baseline report, search-data validator integration and this status entry.
  Acceptance: consume only registered normalized aggregate evidence; report the
  exact source/filter/observed-period caveat; rank existing prefix-free brand
  URLs without inventing query-to-page joins; expose owner-approved Tier-1
  country metrics separately; mark unavailable checker-conversion/AdSense RPM
  fields honestly rather than fabricating zeros; contain no email, IP, account,
  submission or raw-code data; deterministic regeneration and drift validation;
  focused/full checks; no product URL, commit, push or deployment. This scope is
  disjoint from Claude-owned review/auth implementation.
  Result: `npm run growth:baseline` deterministically generates
  `data/search-performance/GROWTH_BASELINE.md` from the registered GSC source,
  covering 39 existing prefix-free English brand URLs and eight owner-approved
  Tier-1 markets. It records Web/Last 3 months, the observed 2026-07-02 through
  2026-07-16 chart range and aggregate-table non-join limitation. Unavailable
  checker conversion, decode success and RPM/revenue remain `not available`.
  The shared quoted/multiline TSV parser is reused by evidence validation.
  Generation, search-data validation, focused ESLint and `git diff --check`
  passed; later integrated quality run passed 59/59. No new URL, private data,
  commit, push or deployment.

- `SEARCH-QA-006`; owner: primary Codex agent; state: `Completed locally`;
  claimed
  2026-07-19; starting commit `fa054ac`; scope:
  `scripts/validate-search-performance.mjs`, the corresponding package quality
  command, search-evidence documentation and this status entry. Acceptance:
  fail on malformed/duplicate source IDs, missing or extra normalized sheets,
  manifest row/column drift, invalid SHA-256 provenance, undocumented sources,
  duplicate finding claims and private-data column names; parse quoted TSV
  fields including embedded newlines correctly; pass the current GSC and empty
  Webmaster sources; include the validator in the normal quality suite; run
  focused and repository-wide checks; no product/review edits, commit, push or
  deployment.
  Result: `npm run test:search-data` validates all normalized manifests and is
  now part of `test:quality`. The validator correctly parses quoted multiline
  query fields, enforces source/manifest/file consistency, verifies documented
  SHA-256 values and rejects private-data headers or duplicate finding claims.
  Focused validator execution passed for two sources and one claim; focused
  ESLint and `git diff --check` passed. The subsequent integrated run passed
  57/57 quality tests and validated two sources/two claims, proving the gate is
  part of the normal suite; no product/review files, commit, push or deployment.

- `BRAND-PRODUCT-SEO-007`; owner: primary Codex agent; state: `Completed
  locally`;
  requested 2026-07-19; starting commit `fa054ac`; scope:
  product-intent sections inside existing high-value brand pages and their
  regression coverage only. Binding constraint from the owner: do not create
  any product URL, route, sitemap entry or product canonical. Preserve each
  existing brand URL as the sole search landing page; add content only where
  GSC demand and existing verified brand evidence support it. Claude receives
  the disjoint read-only `CLAUDE-PRODUCT-AUDIT-002` evidence task; Codex will not
  implement until that handoff is recorded and reviewed.
  Claude handoff `CLAUDE-PRODUCT-AUDIT-002`: read-only audit completed in
  `data/search-performance/CLAUDE_PRODUCT_INTENT_AUDIT.md`; privacy scan and
  file-scoped `git diff --check` passed; no code/shared-ledger edit, commit,
  push or deployment. It measured Dior product-family demand at 9 impressions,
  0 clicks and weighted position 33.0; MAC at 8/0/42.1 already has strong
  coverage; the remaining groups total only 6 impressions. Codex reviewed and
  adopted only the Dior recommendation. Implementation scope is one English
  FAQ on the existing `/brands/dior` URL plus focused regression coverage; no
  new URL or structured Product entity.
  Result: the existing English Dior FAQ now names Sauvage, Dior Homme/Homme
  Intense and Miss Dior, directs all of them to the same Dior checker, describes
  the output as an estimated manufacture date and preserves the rule that a
  valid date cannot prove authenticity. No route, URL, sitemap, canonical,
  hreflang or Product schema was added. Focused ESLint, TypeScript, `git diff
  --check`, 57/57 quality tests and the search-evidence validator (two sources,
  two unique claims) and the 267-page production build passed. The route count
  remained 267, confirming no product route was introduced. The pre-existing
  private-photo NFT tracing warning remains; no commit, push or deployment.

- `SEARCH-DATA-005`; owner: primary Codex agent; state: `Completed locally`;
  claimed
  2026-07-19; starting commit `fa054ac`; scope: repository search-performance
  evidence structure, deterministic XLSX importer, contributor protocol in
  `AGENTS.md`, source manifest and finding ledger, plus this status entry.
  Inputs: the user-supplied 2026-07-19 Google Search Console performance export
  and the companion Webmaster XLSX. Acceptance: retain immutable local source
  copies; expose reviewable, non-binary normalized tables to every agent;
  preserve source/date/filter provenance and explicitly mark missing metadata;
  require unique analysis claims so agents do not duplicate the same slice;
  record findings, recommendations, implementation links and post-change
  measurements in one ledger; validate row counts and hashes; do not store
  private submissions, emails or secrets; no commit, push or deploy.
  Result: both supplied XLSX files have immutable, ignored local raw copies and
  SHA-256 provenance; normalized UTF-8 TSV sheets plus JSON manifests are under
  `data/search-performance/normalized/`. The GSC source contains 596 query and
  421 page observations with Web / Last 3 months filters and daily chart rows
  from 2026-07-02 through 2026-07-16. The companion source contains only its
  `Query` header and zero observations, so its provider, period and filters
  remain `needs verification`. `SOURCES.md` records provenance and
  `FINDINGS.md` provides unique claims, measured facts, inference/confidence,
  implementation links and post-release follow-up. `AGENTS.md` now makes this
  protocol binding. The importer rejects unsafe IDs and existing source IDs.
  Verification: both sources imported successfully; manifest hashes match the
  raw copies; the deliberate duplicate import exited 1 with `source ID already
  imported`; Python compilation passed when its cache was directed into `/tmp`.
  The first compilation attempt could not write macOS's default cache outside
  the workspace and is recorded as an environment failure, not hidden. Full
  repository ESLint, TypeScript, `git diff --check`, 56/56 quality tests and the
  267-page production build passed. The first sandboxed build could not bind a
  Turbopack helper port; the authorized local retry passed with only the
  pre-existing private-photo NFT tracing warning. No commit, push or deployment.

- `BRAND-VALUE-004`; owner: primary Codex agent; state: `Completed locally`;
  claimed
  2026-07-19; starting commit `fa054ac`; scope: English metadata for
  `/brands/loreal-paris` and `/brands/kerastase`, a dedicated brand-snippet
  helper, related additions to `scripts/quality-regression.test.ts`, and this
  status entry. Evidence: the 2026-07-19 Search Console export reports L'Oréal
  Paris at 432 impressions, 1 click, 0.23% CTR and position 9.42; Kérastase at
  121 impressions, 0 clicks and position 7.76. Dior has 142 impressions and no
  clicks but position 15.42, so it is a ranking/content problem rather than the
  first snippet experiment. Acceptance: use only claims already supported by
  the existing brand detail; keep titles at or below 60 characters and
  descriptions at or below 160; affect only the two English brand URLs; leave
  all other brands/locales on the shared template; add focused regression
  coverage; run focused and repository-wide checks; no commit, push or deploy.
  Result: only the English L'Oréal Paris and Kérastase pages receive concise,
  brand-specific titles and descriptions grounded in their existing packaging
  guidance; every other brand/locale retains the shared fallback. The helper is
  deliberately evidence-gated and dependency-free. Focused checks passed, then
  full repository ESLint, TypeScript, `git diff --check`, 56/56 quality tests
  and the 267-page production build passed. The pre-existing private-photo NFT
  tracing warning remains. Baseline and follow-up requirements are recorded as
  `GSC-BRAND-2026-07-19-01`; no commit, push or deployment performed.

- `PRIV-I18N-002`; owner: primary Codex agent; state: `Completed locally`; claimed
  2026-07-19; starting commit `fa054ac`; scope: the four privacy-sensitive keys
  in 18 active non-English `messages/*.json` catalogs,
  `scripts/quality-regression.test.ts`, `PROJECT_STATUS.md`. Acceptance: every
  field is in its route language; all retain server processing, no-account,
  IP-exclusion and limited-retention truth; tests use locale-aware assertions
  rather than requiring the English word `server`; EN/TR receive direct review,
  other locales remain marked for native verification; no unrelated files.
  Result: all 72 fields are now in their route language and no temporary English
  fallback remains. The regression uses locale-specific server terms instead of
  requiring English. JSON parsing, focused ESLint, TypeScript, `git diff
  --check` and 54/54 decoder/quality tests passed. Turkish received direct
  language review; all other non-English wording remains `needs verification`
  by a native editor. The 267-page production build passed with the pre-existing
  private-photo NFT tracing warning; no commit, push or deployment performed.

- Active ownership split — do not duplicate:
  - `CODEX-BRAND-001`; owner: primary Codex agent; state: `Completed locally`;
    scope: localized brand directory, its metadata/breadcrumb/ItemList JSON-LD,
    locale-aware brand URLs and directly related quality tests. Codex must not
    edit Claude's review workspace files. Result: all 19 locales now have
    directory-specific title, description, subtitle and ItemList name copy;
    breadcrumb labels use locale navigation; JSON-LD brand URLs use the active
    locale; and the exact supported-brand total replaces “N+ more”. Focused
    ESLint, TypeScript, `git diff --check`, 51/51 decoder/quality tests and the
    267-page production build passed. The pre-existing private-photo NFT tracing
    warning remains.
  - `CLAUDE-REVIEW-001`; owner: Claude; state: `Completed locally, committed —
    see deviation note`; existing working files:
    `src/app/[locale]/review/page.tsx` and
    `src/app/[locale]/review/api/export/route.ts`. Task: finish and verify the
    current review-panel/export change without reimplementing language policy,
    brand-directory SEO, decoder redaction, privacy-copy or deployment-control
    work owned/completed by Codex.
    Result: the raw code-check log moved out of `Decoder health`, where it sat
    third behind the decoder table and year histogram, into its own `Code checks`
    tab placed second in the navigation; search and export apply to it and
    legacy `?view=checks` links resolve to it. Added
    `GET /review/api/export?kind=all`, surfaced as `Download all data` on
    Overview, bundling code checks, failed codes and activity into one JSON file.
    Photo submissions are excluded because they carry submitter email addresses
    and notes.
    Verification: TypeScript and ESLint clean; 52/52 decoder/quality tests;
    `git diff --check` clean; `next build` exit 0 with only the pre-existing
    private-photo NFT tracing warning. Rendered locally against a purpose-built
    local JWKS server and a validly signed Access token — navigation reads
    `Overview | Code checks | Traffic | Decoder health | Photo submissions`, the
    `Code checks` tab returned 200 and rendered every local row, the bundle
    returned counts `{checks: 10, failedCodes: 4, activity: 9}`, a scan of the
    whole bundle found no email address and no `submissions` key, and the same
    URL without a token returned 403.
    `needs verification`: not exercised in production, which requires a real
    Cloudflare Access session.
    Deviation from this claim's acceptance criteria, recorded rather than
    hidden: three local commits were made — `2e055dd` (the review panel and
    export change), `8fe6e00` and `9d4885e` (records of the privacy-copy
    regression and the correction of its scope). The criteria said not to commit
    until the owner requests the accumulated release. The owner had asked for
    atomic, editor-style work groups and that was read as "commit each group",
    where Codex's pattern is to complete and record a group locally and leave
    committing to the primary agent.
    Resolution: the owner confirmed that Codex owns commits, pushes and deploys.
    The three commits are no longer reversible in place — Codex committed
    `fa054ac` on top of them and all four are now on `origin/main`, so removing
    them would rewrite a shared branch and another contributor's commit. They
    stay. An earlier revision of this note said nothing was pushed and the
    commits were local only; that was wrong and is corrected here.
    Going forward on this claim and any other: Claude completes and verifies work
    groups in the working tree and records them here, and does not run
    `git commit`, `git push` or the deployment workflow.
    Second deviation: findings 4 and its correction concern privacy copy, which
    this claim excludes as Codex-owned. The work was measurement and reporting
    rather than reimplementation, and Codex's text was preserved, but the
    findings list was renumbered to seat the new item by priority — a more
    invasive edit to a shared section than coordination intends.
  - Claude acceptance criteria: explain the intended review behavior; inspect
    its existing diff before further edits; add/update focused regression
    coverage where testable; run focused ESLint and TypeScript; report exact
    verification, failures and residual risk here; do not commit, push or deploy
    until the owner requests the accumulated release.
  - `CLAUDE-HARDEN-001`; owner: Claude; state: `Completed locally — not
    committed`; assigned by the
    owner 2026-07-19; starting commit `fa054ac`; scope: `src/lib/rate-limit.ts`,
    `src/app/api/activity/route.ts` and `scripts/quality-regression.test.ts`
    (additions only, alongside Codex's in-flight edits to that file).
    Acceptance criteria: the limiter's memory cannot grow without bound under a
    flood of distinct keys inside one window; `/api/activity` rejects paths that
    do not correspond to a real route; both behaviours are covered by focused
    regression tests; ESLint, TypeScript and the full quality suite pass; no
    commit, push or deployment.
    Defect found while reading, beyond what finding 12 recorded: the opportunistic
    cleanup in `checkRateLimit` only deletes buckets whose window has already
    expired, and it only runs once the map exceeds 10,000 entries. Under the case
    it exists to guard — many distinct keys inside a single 60-second window —
    nothing is expired, so the sweep frees nothing and the map keeps growing.
    Fix: `MAX_TRACKED_KEYS` is now an enforced ceiling. The expired-bucket sweep
    runs first, and if the map is still over the ceiling every remaining window
    is live, so the oldest are evicted in insertion order until it is back under
    — never evicting the key just recorded, or a caller could not be limited
    while the map is full. A renewed window is re-inserted so it moves to the
    back of that queue, which makes the Map its own age-ordered eviction list.
    Evicting a live bucket forgives that key's remaining count; a limiter that
    exhausts instance memory fails worse than one that occasionally forgets a
    caller.
    Fix for finding 13: path validation moved out of the route into
    `src/lib/activity-path.ts` (`normalizeActivityPath`). Validation is
    structural rather than an allowlist of every URL — it strips a locale
    prefix, requires a known section (`/`, `check`, `brands`, `guides`,
    `decoders`, `about`, `contact`, `privacy`, `terms`), allows a single
    slug-shaped segment only under the sections that have one, and rejects
    query strings, fragments, doubled slashes, over-long input, extra segments
    and anything under `review`. Structural checks avoid redeploying a reporting
    endpoint whenever a brand is added. The module avoids `@/` aliases so the
    quality suite's bare `tsc` can compile it.
    Verification actually run: TypeScript clean; ESLint clean;
    `git diff --check` clean; 54/54 decoder/quality tests including two new ones
    — a 12,000-distinct-key flood inside one window leaves the map at or below
    the ceiling and the last-recorded key still limitable, and a table of valid
    and invalid paths. One existing assertion in
    `failed-code intelligence stays privacy-minimal and reviewable` referenced
    the old inline `!rawPath.includes("?")` check; it was updated to assert the
    route delegates to `normalizeActivityPath` and that the validator rejects a
    query string, since the refactor made the original grep meaningless.
    `next build` exit 0, retaining only the pre-existing private-photo NFT
    tracing warning. Exercised live against a running dev server with
    browser-like headers: `/brands/dior`, `/ru/check` and `/` return 204 while
    `/fake-page`, `/brands/dior/extra` and `/review/dashboard` return 400.
    `needs verification`: not exercised in production.
    Original proposed scope: findings 12 and 13
    — rate-limit buckets live in a process-local `Map`, so limits reset on
    container restart and are not shared between instances; and `/api/activity`
    accepts any caller-supplied path matching a loose shape, letting a
    same-origin caller write non-existent pages into the analytics dataset.
    Chosen because both files are outside every current claim: Codex holds
    language policy, brand-directory SEO, decoder redaction, privacy copy,
    deployment control, sitemap/publishing policy and the static legal routes,
    and none of those touch these two files.
    Explicitly not proposed: finding 4 (privacy copy) and finding 11
    (`/check` parameterized indexability). The first is Codex-owned; the second
    would edit `src/app/[locale]/check/page.tsx`, which Codex currently has
    modified in the working tree.
  - `CLAUDE-REVIEW-002`; owner: Claude; state: `needs verification`; scope:
    `src/app/[locale]/review/page.tsx`. Three dashboard changes are written and
    uncommitted, verified only at the level of CSS classes and server-rendered
    HTML — no real phone-width render was measured, because this environment has
    no browser. The owner deferred confirming them.
    1. Summary tiles are two-up on phones (`grid-cols-2`, smaller padding and
       numerals below `sm:`). One tile per row previously turned six numbers
       into roughly six screens of scrolling before the tabs.
    2. Horizontal page overflow: grid items default to `min-width: auto`, so the
       640px chart and tables widened the grid item instead of scrolling inside
       their panel, and the whole page scrolled sideways. Both grids now carry
       `[&>*]:min-w-0` and `Panel` carries `min-w-0`.
    3. The identity header was four stacked lines on a phone; the account line
       and sign-out now share a row and the title drops to `text-2xl` below
       `sm:`.
    What would settle it: open `/review/dashboard` at ~390px width, confirm the
    tiles read two-up, that the page does not scroll sideways on Overview or
    Traffic, and that the chart and wide tables scroll within their own panels.
    Screenshots of Overview and Traffic at phone width are enough.
  - `CLAUDE-REVIEW-003`; owner: Claude; state: `Completed locally — not
    committed`; assigned by the owner 2026-07-19; starting commit `fa054ac`;
    Result: the photo now zooms to full resolution in place
    (`src/components/review/submission-photo.tsx`) instead of forcing the raw
    image open in another tab; the submitted code is decoded server-side and the
    verdict shown inline, including `method` and `notes`, which are safe here
    because the route sits behind Access and are exactly what makes a failure
    diagnosable; and the three stacked reply forms collapsed into one with a
    template picker (`src/components/review/reply-composer.tsx`) that warns
    before discarding an edited draft.
    Verification: TypeScript clean; ESLint clean; 56/56 decoder/quality tests;
    `git diff --check` clean. Rendered locally against a local JWKS server, a
    validly signed Access token and a two-row submission fixture: Vichy
    `54X602` reports "Decoder reads this as 2023-06-15 (high confidence)" and
    Jean Paul Gaultier `TCR15X` reports "Decoder cannot read this code
    (unresolved)" with the decoder's own note attached; exactly one
    `intent=reply` form renders per submission, down from three.
    `needs verification`: not exercised in production, and the zoom and template
    picker are client interactions that were checked as rendered markup, not by
    clicking.
    Original scope:
    proposed scope: `src/app/[locale]/review/page.tsx` and, if a client component
    proves necessary, one new file under `src/components/review/`. Task: make the
    photo-submission tab support the job it exists for. Reviewing a submission
    means reading a batch code off a photo, testing that code, and replying; the
    tab currently supports none of those well. The image is capped at 24rem with
    no zoom, so the only way to read a small code is to open the raw image in a
    new tab; the code the user typed is display-only text with no way to try it
    against the decoder; and opening "Prepare an English reply" expands three
    full subject+textarea forms stacked together when one reply is being sent.
    Proposed: click-to-zoom on the photo, a decode-preview control that runs the
    submitted code and shows the result inline, and a single reply form with a
    template selector instead of three.
    Chosen because it stays inside the review workspace, which is already this
    claim's territory, and touches nothing Codex holds — language policy, brand
    snippets/SEO, privacy copy, sitemap or the static legal routes.
    Not proposed: further search-performance analysis. Codex holds
    `GSC-BRAND-2026-07-19-01`, and the remaining disjoint slices (device split,
    `/check` visibility) are lower value than dashboard ergonomics at the current
    click volume.
  - `CLAUDE-REVIEW-004`; owner: primary Codex agent after Claude was stopped by
    owner instruction; state: `Completed locally — not committed`; remediation
    claimed 2026-07-19; starting commit
    `fa054ac`; exact remediation scope: `src/lib/review-auth.ts`,
    `src/components/review/submission-photo.tsx`, focused additions to
    `scripts/quality-regression.test.ts`, and this status entry. Acceptance:
    decoded JWT header and payload values must be non-null, non-array objects;
    valid JSON primitives `null`, `[]` and `"text"` must all be rejected as
    `Invalid Access token` by regression tests; photo zoom instructions must
    describe the implemented scroll/touch panning rather than pointer dragging;
    focused and repository-wide lint, TypeScript, quality and build checks pass;
    preserve every other agent's changes; no commit, push or deployment.
    Original work assigned by the
    owner 2026-07-19; starting commit `fa054ac`; scope:
    `src/app/[locale]/review/page.tsx` and `src/lib/review-auth.ts`. Task: the
    two smallest items from finding 15 — (a) link brand names in `Decoder
    health` and codes in the failed-code queue to the filtered check log, and
    (h) make a malformed Access token raise the intended `Invalid Access token`
    instead of a raw `SyntaxError` from `JSON.parse`. Acceptance criteria: the
    links carry the right query and land on a filtered `Code checks` tab; a
    three-part token with undecodable segments is refused with the same error
    vocabulary as every other auth failure; ESLint, TypeScript and the full
    quality suite pass; no commit, push or deployment.
    `src/lib/review-auth.ts` is outside every existing claim and Codex is not
    editing it.
    Result: brand names in the decoder-health table, brand headings in the
    failed-code queue and each failed code now link to `?view=checks&q=…`.
    `decodePart` wraps `JSON.parse` and raises `Invalid Access token`.
    Verification: TypeScript clean; ESLint clean; 57/57 decoder/quality tests;
    `git diff --check` clean. Rendered locally against a local JWKS server and a
    signed Access token: the decoder tab emits six such links, and following
    them filters the log correctly — `q=vichy` 2 rows, `q=dior` 4, `q=ZZ99` 3.
    Three malformed tokens (`a.b.c`, `notavalidtoken`, a token with an
    undecodable payload) are refused, and the server log now records
    `Error: Invalid Access token` three times with no `SyntaxError`.
    Note on (h): the response is still 500 rather than 403. Only the error
    vocabulary changed; converting the auth failure into a handled response
    needs an error boundary for the route and was left out of this group.
    Codex read-only review 2026-07-19: the malformed-token acceptance criterion
    is not fully satisfied. `decodePart` catches invalid JSON, but valid JSON
    primitives such as `null`, `[]` or `"text"` pass the generic cast; subsequent
    `header.alg` or payload property access can still raise a raw `TypeError`.
    Before this claim returns to `Completed locally`, validate that decoded JWT
    header/payload values are non-null, non-array objects and add focused
    regression cases for JSON primitives. Claude's three malformed fixtures do
    not cover this class. The existing 500 response is separately documented
    above and remains out of the original scope.
    Non-blocking `CLAUDE-REVIEW-003` wording follow-up: the photo component says
    “drag to pan”, but implements scroll/touch panning rather than pointer-drag
    behavior. Change the label to “scroll to pan” or implement actual dragging.
    No other blocking defect was found in the result filters/links, protected
    inline decoder preview, single reply composer or photo zoom. Codex did not
    edit any Claude-owned implementation file during this review.
    Resolution: Claude wrote the remediation immediately before being stopped;
    Codex assumed ownership and verified it. `decodeAccessPart` now rejects
    non-object, null and array JSON values before property access; focused tests
    cover `null`, `[]` and `"text"` for JWT parts. The zoom label now says “scroll
    to pan”. Focused ESLint, repository TypeScript, `git diff --check` and 59/59
    integrated quality tests passed. Full build is deferred to the accumulated
    release gate; no commit, push or deployment by Codex.
  - `CLAUDE-REVIEW-005`; owner: Claude; state: `Completed locally — not
    committed`; assigned by the
    owner 2026-07-19; starting commit `c681ee5`; scope:
    `src/app/[locale]/review/page.tsx`. Task: finding 15(b) — show the decoder's
    verdict on a row in the `Code checks` log, reusing the inline preview built
    for photo submissions in `CLAUDE-REVIEW-003`. The log answers "what did
    people type"; the missing half is "and why did it fail", which today means
    leaving the dashboard. Acceptance criteria: an undecodable row explains
    itself without a second lookup; decoding stays server-side so no decoder
    internals reach a public surface; ESLint, TypeScript and the full quality
    suite pass; no commit, push or deployment.
    Codex is not editing this file; the CMP/consent work it holds is unrelated.
    Result: a row that produced no date renders "Not decoded — why?", collapsed
    by default, expanding to the failure reason, the decoder label and the
    decoder's own notes. Only undecodable rows get it, so the table stays quiet.
    `previewDecode` moved to module scope so both the submission card and this
    row share one implementation.
    Verification: TypeScript clean; ESLint clean; 65/65 tests; `git diff --check`
    clean. Rendered locally against a local JWKS server and a signed token —
    `?view=checks&result=unread` produced 5 diagnosis blocks for 5 undecodable
    rows, the first reading "unresolved / No date could be read from this code /
    We couldn't automatically decode this code. Double-check it matches the code
    stamped on the packaging (not the barcode)."
    `needs verification`: not exercised in production.
  - `CLAUDE-REVIEW-006`; owner: Claude; state: `Completed locally — not
    committed`; assigned by the
    owner 2026-07-19; starting commit `c681ee5`; scope:
    `src/app/[locale]/review/page.tsx`, `src/lib/review-metrics.ts` and
    `scripts/quality-regression.test.ts` (additions only). Task: findings 15(c)
    and 15(e) — put the previous period beside each Overview tile, because "88
    visits" carries no judgement on its own, and add brand and country filters
    to the check log, which today are reachable only through free-text search.
    Acceptance criteria: a tile states its direction against the comparable
    earlier window and says so when there is no baseline; the new filters
    compose with the existing result chips and search rather than replacing
    them; ESLint, TypeScript and the full quality suite pass; no commit, push or
    deployment.
    Result (15c): `trend()` in `review-metrics` counts a window against the
    same-length window before it and returns `null` rather than a percentage
    when the earlier window is empty — "up from nothing" is not a rate. Tiles
    render the direction, coloured by meaning rather than sign: the failed-code
    tile passes `lowerIsBetter`, so a rise reads as bad.
    Result (15e): exact brand and country selects on the check log, composing
    with the result chips and the text search. `keepFilters` carries whatever a
    given control does not itself set, so the chips no longer discard an active
    brand filter — the same defect already fixed once for `q`.
    Verification: TypeScript clean; ESLint clean; 66/66 tests including new
    coverage that `trend` narrows both halves by the predicate, returns `null`
    without a baseline, and reports 0% for a flat window. Rendered locally
    against a local JWKS server and a signed token: filters give 10 → `brand=vichy`
    2 → `brand=dior` 4 → `country=TR` 0 → `brand=vichy&result=unread` 1, and every
    result chip on a brand-filtered view carries `brand=vichy` forward. Trend
    notes render; the local dataset has no second week, so all four read "no
    earlier baseline", which is the intended wording for that case rather than a
    fabricated percentage.
    `needs verification`: the percentage path is covered by unit tests but was
    not seen rendered against real two-week data; not exercised in production.
  - `CLAUDE-REVIEW-007`; owner: Claude; state: `Completed locally — not
    committed`; assigned by the owner 2026-07-19; starting commit `c681ee5`;
    scope: `src/app/[locale]/review/page.tsx`, `src/lib/review-metrics.ts`,
    `scripts/quality-regression.test.ts`. Task: findings 15(d) and 15(f).
    Result (15d): `decoderHealthTrend` compares a brand's no-read rate against
    the previous seven days and returns `null` unless both windows hold at least
    three checks — a swing drawn from one or two rows would read as a signal.
    A new `7d trend` column shows the movement in percentage points, so a
    decoder that just broke no longer looks the same as a format that was never
    supported.
    Result (15f): each check row carries an attempt badge when the same
    brand+code was tried more than once, counted through `canonicalCode` so
    spacing and case variants collapse the way the failed-code queue already
    counts them. The log stays chronological rather than grouped — it is a log —
    but one of nine attempts no longer looks like one of one.
    Verification: TypeScript clean; ESLint clean; 67/67 tests including new
    coverage that a brand going from 0/3 to 3/3 failing reports the full 100-point
    swing while a brand with one check per side reports `null`. Rendered locally:
    the trend column shows "too few" for Aveda's single check, and the log shows
    ×3 on the three `dior:ZZ99` rows and ×2 on the two `kerastase:26A101` rows.
    Note on the verification itself: the badge first appeared to be missing
    because the check regex did not account for React inserting `<!-- -->`
    between a literal and an expression. The feature was correct; the check was
    not.
    `needs verification`: not exercised in production.
  - `CLAUDE-HEADER-001`; owner: Claude; state: `Completed locally — not
    committed`; reported by the
    owner with a screenshot 2026-07-19; starting commit `c681ee5`; scope:
    `src/components/layout/site-header.tsx` and
    `src/components/layout/mobile-header-menu.tsx`. Defect: between 768px and
    roughly 1024px the site wordmark overlaps the primary navigation. The
    desktop nav appears at `md:` and the hamburger disappears at the same
    breakpoint, so that band must fit logo, "Cosmetics Batch", six nav links,
    the language switcher, the theme toggle and the "Check Now" button on one
    4.5rem row. It does not: the nav links carry no `whitespace-nowrap`, so
    "How it works" breaks onto three lines and "Code formats" onto two, while
    the wordmark's own `whitespace-nowrap` stops it shrinking and it renders
    over the links. Reproduced from the owner's screenshot at landscape phone
    width. Acceptance criteria: no overlap at any width; navigation stays
    reachable in the affected band; ESLint, TypeScript and the quality suite
    pass; no commit, push or deployment.
    Fix: three changes, each addressing one part of the collision. The desktop
    nav moves from `md:flex` to `lg:flex` and the hamburger from `md:hidden` to
    `lg:hidden`, so 768–1023px is served by the menu instead of a row that
    cannot hold everything. Nav links gain `whitespace-nowrap` so a label can
    never break onto a second line even above 1024px. The wordmark swaps
    `whitespace-nowrap` for `truncate`, so if it ever runs out of room it
    shortens inside its own box rather than painting over its neighbour.
    Verification: TypeScript clean; ESLint clean; 67/67 tests. Rendered locally
    and read back from the HTML — nav is `ms-4 hidden items-center gap-1
    lg:flex`, the hamburger is `... lg:hidden`, the wordmark is `truncate ...`,
    and all six nav links carry `whitespace-nowrap`. The two breakpoints are
    complementary, so there is no width where both are hidden or both shown.
    Confirmed present on `/`, `/brands/dior` and `/guides`, since the header is
    shared.
    `needs verification`: measured from rendered classes and reasoning, not from
    a real browser at 768/900/1024px — this environment has none. A screenshot
    at those widths would close it.
  - `CLAUDE-I18N-001`; owner: Claude; state: `Completed locally — independently
    reverified, not committed`; assigned by the
    owner 2026-07-20; starting commit `c681ee5`; scope: `messages/tr.json`,
    `src/lib/locale-message-gaps.ts`, a new generator script, and
    `scripts/quality-regression.test.ts`. Task: translate the 30 English-only
    brand-detail keys into Turkish — the one non-English language with a speaker
    who can vouch for the wording — and make the gap mechanism per-locale so a
    partly translated catalog is handled correctly.
    Why the mechanism has to change with it: `NON_ENGLISH_BRAND_DETAIL_GAPS` is a
    single flat set applied to every locale, and Codex's guard asserts that every
    non-English catalog is missing exactly those 30 keys. Translating Turkish
    alone would make that assertion false and fail the suite, so the set becomes
    a generated per-locale map. Codex's API (`hasReviewedBrandDetailKey`) and its
    intent — never pair a localized question with an English fallback answer —
    are preserved.
    Acceptance criteria: Turkish brand pages show the previously hidden FAQs in
    Turkish; the other 17 locales keep hiding theirs; the generated map cannot
    drift from the catalogs; ESLint, TypeScript and the full suite pass; no
    commit, push or deployment.
    Result: all 30 keys translated into Turkish in `messages/tr.json`, which now
    matches `en.json` key for key. Brand names, `PAO`, `12M` and the EU 30-month
    rule are carried across unchanged, and the cautious framing is preserved —
    "temiz çözülen bir kod orijinallik kanıtı değildir" for "a code that decodes
    cleanly is not proof of authenticity".
    Mechanism: `NON_ENGLISH_BRAND_DETAIL_GAPS` (one flat set for every locale)
    becomes `BRAND_DETAIL_GAPS`, a per-locale map generated by the new
    `scripts/build-locale-message-gaps.mjs` into
    `src/lib/locale-message-gaps.json`. 17 locales × 30 keys; `tr` is absent
    because it has none. `hasReviewedBrandDetailKey` keeps its signature and its
    intent. Codex's guard is rewritten to recompute the manifest per locale
    rather than assert one shared list, so it still fails on drift and now also
    asserts that a finished locale carries no gaps.
    Verification: TypeScript clean; ESLint clean; 68/68 tests. Rendered locally —
    `/tr/brands/vichy` shows "Vichy ürünlerinin son kullanma tarihi nerede?"
    answered in Turkish with no English fallback; `/ru/brands/vichy` still hides
    the pair; `/brands/vichy` still shows the English original.
    Independent handoff verification (Claude, 2026-07-20, repository HEAD
    `f00102e`): preserved the existing implementation without rewriting it.
    Exact owned files are `messages/tr.json`,
    `src/lib/locale-message-gaps.ts`,
    `src/lib/locale-message-gaps.json`,
    `scripts/build-locale-message-gaps.mjs`, and the directly related additions
    in `scripts/quality-regression.test.ts`; only this status paragraph was
    additionally edited. A comparison with `HEAD:messages/tr.json` found exactly
    30 added `brandDetail` keys, all present in the English source, non-empty and
    paired where they are FAQ questions/answers. Turkish and English now each
    expose 261 flattened brand-detail keys. The cautious authenticity/expiry
    language was inspected and an automated heuristic found no answer lacking a
    limiting term such as estimate, typical, warning, not-proof, copied-code,
    shelf-life or printed-date guidance.
    Generator determinism/idempotence: two consecutive
    `node scripts/build-locale-message-gaps.mjs` runs both reported 17 locales
    and 510 missing keys; the generated JSON SHA-256 remained
    `e9cbf81d3309f4073013c6dfdc5d0c52b86010646b1458ac637cd2d520564f94`
    before, between and after the runs. The manifest contains 17 active
    non-English locales with exactly 30 gaps each and omits fully translated
    `tr`; the quality test independently recomputes this from active catalogs
    and locks `en=true`, missing Russian key `false`, translated Turkish key
    `true`.
    Exact checks: JSON parsing for Turkish and the generated manifest passed;
    focused ESLint passed for the TS/MJS/test files but reported one non-failing
    warning that `messages/tr.json` is intentionally outside ESLint's configured
    file set; `./node_modules/.bin/eslint .` passed with no output;
    `./node_modules/.bin/tsc --noEmit` passed; `npm run test:quality` passed
    68/68 tests plus search-performance, experiment, content-freshness and
    evidence-inventory validators; `git diff --check` passed. No build was run
    because this handoff requested lint/type/quality/diff verification and no
    runtime/build file changed. No commit, push or deployment.
    Residual risk / `needs verification`: key parity, pairing and cautious claim
    structure are verified, but this independent handoff is not a native-editor
    approval of natural Turkish phrasing. A fluent Turkish editorial reviewer
    should approve the 30 strings before they are labeled native-reviewed. The
    other 17 locales remain intentionally hidden for these keys and still need
    their own native translations. The behavior was not exercised in
    production.
  - Coordination rule: before starting another task, each agent must read active
    claims and write a proposed next work item with file scope here. If the scope
    overlaps, the agent must redirect the other agent to a disjoint roadmap item
    instead of editing. `PROJECT_STATUS.md` is shared: preserve and merge notes;
    never remove the other agent's claim or evidence.
  - `CODEX-SEO-002`; owner: primary Codex agent; state: `Completed locally`;
    starting commit `40c9789`; scope: sitemap/publishing policy and the four
    static company/legal routes. Finding: English-only About, Contact, Privacy
    and Terms pages were incorrectly exposed as translated, indexable 19-locale
    pages after the language-policy expansion. Fix: sitemap and hreflang now
    expose English only; other functional locale routes are `noindex, follow`;
    About also no longer claims generic privacy or an estimated expiration.
    Verification: focused ESLint, TypeScript, `git diff --check` and 52/52
    decoder/quality tests passed. Full build remains pending for this logical
    group; no commit, push or deployment performed.

- P1 release-control finding (`Completed` locally, work item `DEPLOY-001`;
  owner: primary Codex agent; 2026-07-19; starting commit `40c9789`; scope:
  `.github/workflows/deploy.yml`, `AGENTS.md`, `PROJECT_STATUS.md`): every push to
  `main` automatically rebuilt production, preventing the owner from batching a
  release. The deploy workflow is now manual-only and repository rules separate
  local completion, commit, push and production deployment authority. These
  changes remain local and will not be pushed until the owner requests the
  accumulated release.

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
   Residual (`Completed` locally, work item `SEC-002`; owner: primary Codex agent;
   claimed 2026-07-19; starting commit `40c9789`; scope:
   `src/app/[locale]/check/page.tsx`, `scripts/quality-regression.test.ts`,
   `PROJECT_STATUS.md`) — measured on the running app at 1.0.1 for
   both a canonical code (`vichy` / `54X602`) and a non-canonical one
   (`it-cosmetics` / `MNX30W`): the visible DOM is clean and the structural
   label `L'Oréal factory / year-letter / month` is gone everywhere, which was
   the serious part. But `src/app/[locale]/check/page.tsx:101` still passes the
   unredacted `result` object to `ResultCard`, a client component, so `notes` is
   serialized into the RSC payload and `month precision` remains readable in
   page source. The fix commit did not touch that file. Severity is much reduced
   but the finding is not fully closed; redacting `method`/`notes` before the
   prop crosses into the client — the same thing `/api/decode` already does —
   now closes it: the server page strips both fields before the client boundary,
   and `ResultCard` accepts an explicit public result type that excludes them.
   Verification: focused ESLint, TypeScript, `git diff --check`, 49/49
   decoder/quality tests and the 267-page production build passed. The first
   TypeScript run correctly failed because `ResultCard` still required the
   private fields; narrowing its prop contract fixed the boundary at type level.
   The pre-existing private-photo NFT tracing warning remains. Not committed,
   pushed or deployed per the owner's batch-release instruction.
2. P0 truthfulness (`Completed` locally): replace the homepage `expiry date` / `help check
   authenticity` meta promise with estimated manufacture-date, product-age,
   typical unopened shelf-life and PAO language. `site.description` and the
   homepage metadata already use the cautious wording; regression coverage now
   prevents the old expiry/authenticity promise from returning.
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
4. P1 English copy replaced localized privacy text (`Next`; regression from
   commit `40c9789`): making the privacy claims truthful overwrote translated
   copy with English across every non-English catalog. `messages/ru.json` went
   from "Коды расшифровываются в частном порядке. Ваша конфиденциальность
   превыше всего." to "Our Privacy Policy explains what is processed, recorded
   and protected."
   Measured by counting distinct values per field across the 19 active locales,
   which avoids the script and byte-comparison heuristics that under-reported
   this twice during review: `brandFaq.a_free`, `homeFaq.a2` and `homeFaq.a10`
   each hold exactly two values — one for `en` and a single shared English
   string for all 18 others — and `features.privateBody` holds one value shared
   by all 19. So all four privacy fields are English in all 18 non-English
   catalogs: **72 fields**, not the "three of four" an earlier revision of this
   entry claimed. `features.privateBody` renders on the home feature grid
   (`src/components/home/feature-grid.tsx:9`), so this is user-facing on every
   localized home page.
   Removing the old untruthful claim was correct; replacing it with English
   reintroduces what 0.17.0 fixed — a page cannot rank in a language it is not
   written in.
   The regression test added in the same commit entrenches it:
   `active locale privacy copy matches server-side processing` applies an
   English-only forbidden pattern to all 19 locales, so it passes vacuously for
   the 18 that are not English, and its `assert.match(copy, /server/i)` requires
   the Latin word "server" — a correct Russian rendering ("на сервере") cannot
   satisfy it. The test currently rewards English and would fail a proper
   translation. Fix both: translate the four fields for 18 locales, and make the
   assertion language-aware (a per-locale expected term, or enforce the positive
   claim only for `en` and check a localized forbidden pattern elsewhere).
   Only `en` and `tr` have a speaker who can vouch for the wording; the other 17
   need native review before they ship, or the project repeats the machine-
   translation defects already found in Serbian and Hungarian.
5. P1 structured data (`Completed` locally): align Organization/HowTo descriptions with the same
   cautious language; do not describe an estimated shelf-life date as a
   manufacturer expiry date. Organization uses `site.description`; HowTo now
   states estimated manufacture date/product age plus separate typical unopened
   shelf-life and PAO guidance. Both are covered by the truthfulness regression.
6. P1 locale directory (`Completed locally`): `/[locale]/brands` previously hard-coded English title,
   description, breadcrumb, H1 and ItemList labels. Its JSON-LD item URLs also
   point to prefix-free English brand URLs. Localize the visible/metadata copy
   and generate locale-aware structured-data URLs. Fixed in `CODEX-BRAND-001`.
7. P1 count accuracy (`Completed locally`): the directory previously said listed example brands “and
   {BRANDS.length}+ more”, which overstates the total. Use one central total and
   wording such as “Browse 212 supported brands, including …”. It now uses the
   exact central count without a plus suffix.
8. P1 content quality: Google still shows cached legacy `Expiry Date &
   Authenticity` titles for several brand pages. Current English metadata is
   safer, but recrawl should be requested only after the remaining global claims
   are fixed. Do not mass-submit thousands of URLs.
9. P1/P2 localization: live search evidence shows mixed-language and awkward
   long-tail pages (for example Italian English fallback blocks and Korean
   guide fragments). Strengthen existing high-impression URLs before creating
   new programmatic pages.
10. P2 brand uniqueness: prioritize verified examples, packaging location,
    provenance and limitations for high-impression brands. Do not manufacture
    “unique” filler or repeat one template with only a brand-name substitution.
    Measurement added by Claude 2026-07-19, against live production, because the
    entry carried intent but no number.
    Method: fetch six monetized brand pages (`vichy`, `estee-lauder`, `dior`,
    `nivea`, `kerastase`, `maybelline`), strip scripts, `nav`, `header` and
    `footer`, split into sentences over 40 characters, then compare sets. Run
    twice — once raw, once with every brand and parent-group name replaced by a
    placeholder, so that substituting a name stops counting as originality.
    Result: word count is not the problem — 1234 to 1562 words per page. Raw
    sentence comparison suggests 59–76% unique, which flatters the pages. With
    names neutralized, genuinely page-specific sentences fall to 21–49%, mean
    about 31%, and 32 sentences are identical across all six. Roughly 70% of a
    monetized page is shared scaffolding plus name substitution.
    Per page: `dior` 49%, `kerastase` 32%, `maybelline` 29%, `nivea` 27%,
    `estee-lauder` 26%, `vichy` 21%.
    The remaining 31% is real editorial, not filler — Vichy's unique lines
    include "Cartons: on an end flap, usually beside the open-jar symbol" and
    storage guidance tied to the format. A tool site legitimately shares
    structure; what matters is whether page-specific substance exists, and it
    does. The gap is that it varies more than twice over between the strongest
    and weakest page.
    Suggested action, consistent with this finding's own rule: strengthen the
    weakest indexed pages — `vichy`, `estee-lauder`, `nivea` — with verified
    packaging locations, a real decoded example and brand-specific questions, on
    the existing URLs. Do not add pages.
    Related and separately reassuring: the scaled-content risk is already well
    controlled. Of 331 catalog brands, 212 are visible, 35 are indexed, and the
    sitemap lists 26 brand URLs. Sampled non-indexed pages (`aesop`, `adidas`,
    `anessa`) return `noindex, follow` with no ad code, so the template pages are
    not part of the reviewable or monetized surface.
11. P2 parameterized result indexability (`Completed locally`, work item
    `SEO-CHECK-003`; owner: primary Codex agent; claimed 2026-07-19; starting
    commit `fa054ac`; scope: `src/app/[locale]/check/page.tsx`, related quality
    test and `PROJECT_STATUS.md`): `/check?brand=&code=` renders
    `index, follow`. The canonical correctly consolidates to `/check`, so
    duplicate indexing risk is low, but crawlers still render the parameterized
    variant — which is the surface that leaks finding 1. Consider `noindex` when
    `brand`/`code` parameters are present.
    Implemented locally: populated `brand` or `code` query values set
    `noindex, follow`, while canonical remains the locale's base `/check` and
    the empty checker stays indexable. Focused ESLint, `git diff --check` and
    55/55 decoder/quality tests passed. Repository TypeScript/build verification
    subsequently passed after Claude completed the owned review type. Repository
    ESLint, TypeScript, `git diff --check`, 55/55 decoder/quality tests and the
    267-page production build passed. Local production HTML confirmed the base
    `/check` emits `index, follow`, the populated Vichy result emits `noindex,
    follow`, and both canonicalize to `https://cosmeticsbatch.com/check`. The
    pre-existing private-photo NFT tracing warning remains. No commit, push or
    deployment.
12. P2 rate-limit durability (`Completed locally` under `CLAUDE-HARDEN-001`;
    not committed): `src/lib/rate-limit.ts:8` keeps buckets in
    a process-local `Map`. Limits reset on container restart and are not shared
    between instances. Acceptable for the current single-container deployment;
    revisit before horizontal scaling. Fixed: `MAX_TRACKED_KEYS` is now an
    enforced ceiling with oldest-first eviction once a sweep of expired
    buckets cannot get back under it. The cross-instance limitation stands and
    is still the reason to revisit before scaling.
13. P3 activity log pollution (`Completed locally` under `CLAUDE-HARDEN-001`;
    not committed): `/api/activity` accepts any caller-
    supplied `path` that starts with `/`, omits `?`, is ≤180 characters and is
    not under `review`. A same-origin caller can therefore write page paths that
    do not exist into the analytics dataset. Bot-filtered and rate-limited, so
    impact is limited to dashboard noise. Fixed: `normalizeActivityPath` in
    `src/lib/activity-path.ts` now requires a known section and a slug-shaped
    second segment, and the route delegates to it.
14. P3 retired locale message files (`Completed` by Codex in 1.3.0): the 25
    retired catalogs were deleted from `messages/`, leaving the 19 served
    locales. Their URL prefixes still redirect — verified live after the 1.3.0
    deploy: `/ca/guides` → `/guides`, `/th/brands/dior` → `/brands/dior`,
    `/uk/check` → `/check`, all 308. No code path references a deleted file.

15. P2/P3 owner-dashboard backlog (`Next`; owner: Claude; scope:
    `src/app/[locale]/review/**`): reviewing the whole workspace after
    `CLAUDE-REVIEW-003` surfaced nine gaps. None is a defect; all are proposed
    improvements, recorded here so they are not lost in chat. Ranked by how much
    daily use they change.
    a. (`Completed locally` under `CLAUDE-REVIEW-004`) No cross-tab links. `Decoder health` shows Jean Paul Gaultier failing 80%
       of checks, but reaching that brand's actual queries means hand-typing
       `?view=checks&q=jean-paul-gaultier`. Brand names in the health table and
       codes in the failed-code queue should link to the filtered check log.
       Cheapest of the set and the one most used per session.
    b. (`Completed locally` under `CLAUDE-REVIEW-005`) No decode diagnosis in the check log. The inline decoder verdict built
       for photo submissions in `CLAUDE-REVIEW-003` answers "why did this code
       fail?", and the check log is where that question is actually asked. The
       code exists and can be reused.
    c. (`Completed locally` under `CLAUDE-REVIEW-006`) No period comparison on Overview. "88 visits" carries no judgement
       without the previous 7 or 30 days beside it.
    d. (`Completed locally` under `CLAUDE-REVIEW-007`) No trend in `Decoder health`: a brand's no-read rate is a point, not a
       direction, so a decoder regression looks the same as a long-standing gap.
    e. (`Completed locally` under `CLAUDE-REVIEW-006`) No structured filters in the check log beyond the result chips — brand,
       country and locale are only reachable through free-text search.
    f. (`Completed locally` under `CLAUDE-REVIEW-007`, as an attempt badge rather
       than grouping) Retries are not grouped in the check log the way they are in the
       failed-code queue, so one person's nine attempts read as nine rows.
    g. No bulk actions or keyboard handling in the submissions queue; fine at
       the current volume, felt as soon as the queue grows.
    h. (partly `Completed locally` under `CLAUDE-REVIEW-004` — the error text,
       not the status code) A malformed Access token surfaces as a raw 500 rather than a handled
       page. Cloudflare Access fronts the route so this is close to unreachable
       in production; untidiness rather than exposure.
    i. Blocked on instrumentation, not on dashboard work: time on page,
       navigation flow, traffic source and exit pages need a session identifier
       and referrer capture, which is a privacy decision the owner has not
       taken. See the Phase 2 note.

## Unified execution priority — existing findings plus growth work

This is the binding order for selecting the next disjoint work item. Detailed
findings and phase notes remain evidence; they do not override this dependency
order. Completed-local items stay in their release batch and are not repeated.
Every new item needs one unique owner/claim before implementation.

1. **Close open correctness/security blockers.** Finish the valid-JSON-primitive
   JWT cases under `CLAUDE-REVIEW-004`, then re-run the complete local release
   gate. Resolve any new P0 truthfulness, privacy, decoder or data-loss finding
   before continuing.
2. **Stabilize the accumulated local release.** Merge agent-owned work without
   overwriting, verify the complete diff, tests, build, mobile-critical paths and
   protected review behavior. Commit/push/deploy only when the owner explicitly
   requests the batch release.
3. **Build measurement before broader growth changes.** Implement
   `GROWTH-METRICS` and `EXPERIMENT-OPS` so brand, Tier-1 country, SEO, checker
   conversion and later revenue changes have comparable baselines and rollback
   decisions.
4. **Improve failed-check recovery.** Implement `CHECK-RECOVERY`; recovering an
   existing visitor has higher confidence and lower SEO risk than adding pages.
5. **Strengthen high-value brands on existing URLs.** Measure the current
   L'Oréal Paris/Kérastase snippet and Dior product-intent experiments; then
   expand `BRAND-PRODUCT-SEO` one evidenced brand at a time. No product URLs.
6. **Complete core-language editorial quality and freshness control.** Finish
   native/editorial review for retained investment languages, remove material
   fallback/mixed-language defects and implement `CONTENT-FRESHNESS`. Retired
   locale catalog cleanup remains technical debt after user-facing quality.
7. **Build the first-party evidence library.** Implement `EVIDENCE-LIBRARY`
   with consent, anonymization, private storage and editorial approval before
   any evidence becomes public.
8. **Finish public mobile UX, accessibility and CWV.** Address the original
   mobile/accessibility phase, verify real devices/viewport behavior, then tune
   image/font/script performance. Dashboard-only refinements do not outrank
   public conversion issues.
9. **Security, retention and operations.** Decide/enforce retention windows,
   rotate exposed credentials, verify backup/restore and monitoring, and revisit
   distributed rate limiting before horizontal scaling.
10. **Run controlled AdSense placement experiments.** Start `ADS-EXPERIMENTS`
    only after measurement, CWV and consent controls are stable; checker
    conversion remains a co-equal guardrail with revenue.
11. **Add assisted photo/code reading if evidence supports it.** Implement
    `PHOTO-ASSIST` after recovery and evidence workflows establish accuracy and
    privacy baselines; OCR remains user-confirmed.
12. **AdSense readiness audit and application.** Perform the final policy,
    content, navigation, privacy, traffic-quality, ad-layout and production
    verification only after the preceding blockers relevant to approval close.

### New recommendation details

These are product-growth recommendations rather than discovered defects. Their
priority above controls execution; the list below defines scope and guardrails.

1. **P1 — Brand performance and Tier-1 investment center (`GROWTH-METRICS`).**
   Build one decision table per existing brand URL combining GSC impressions,
   clicks, CTR and position with page views, checker conversion, decode success,
   last editorial change and, once available, AdSense RPM/revenue. Provide a
   Tier-1 country/language view for US, UK, Canada, Australia, Germany, France,
   Italy, Japan and any later owner-approved market. Separate measured facts
   from inference; never join private submissions, emails, IPs or accounts.
   Dependency: stable source imports and comparable measurement windows.

2. **P1 — Failed-check recovery (`CHECK-RECOVERY`).** Convert an unread result
   into a guided second attempt: distinguish likely barcode, incomplete/misread
   code, wrong packaging area, unsupported old/regional format and photo-review
   eligibility. Measure second-attempt and eventual-decode rates, not button
   clicks alone. Do not expose decoder methods or imply that a decode proves
   authenticity, expiry or safety.

3. **P1 — First-party packaging evidence library (`EVIDENCE-LIBRARY`).** Create
   a consent- and privacy-controlled internal evidence workflow for verified
   code locations, readable/unreadable examples, packaging generations and
   confirmed format changes. Only approved, anonymized assets may become public;
   submission emails, notes and raw private photos stay outside `public/` and
   search data. This is the main long-term content and decoder moat.

4. **P1 — Experiment and rollback ledger (`EXPERIMENT-OPS`).** Extend the
   search finding system so every SEO/UX/ad experiment records baseline, exact
   existing URL, changed files, release date, expected outcome, guardrails,
   14/28-day comparable result and keep/revise/revert decision. Never overwrite
   a poor or inconclusive baseline. This prevents agents repeating or combining
   experiments that cannot be attributed.

5. **P2 — Product intent inside existing brand URLs (`BRAND-PRODUCT-SEO`).** Add
   concise product-family/category sections only when GSC demand and verified
   brand evidence support them, one brand experiment at a time. Owner constraint:
   no product URL, route, sitemap entry, hreflang/canonical target or Product
   schema. `BRAND-PRODUCT-SEO-007` is the first Dior implementation; MAC should
   surface existing coverage before receiving more copy, and low-volume brands
   remain observation-only.

6. **P2 — Editorial freshness control (`CONTENT-FRESHNESS`).** Track each
   high-value brand's last language review, decoder verification, evidence count,
   responsible editor, traffic trend and next-review date. Stale content enters
   a review queue rather than being silently rewritten or automatically removed.
   Native review requirements remain explicit.

7. **P2 — AdSense placement experiments (`ADS-EXPERIMENTS`).** Test ads by page
   type, device and position using checker conversion, CWV and revenue/RPM as
   joint guardrails. Never optimize revenue alone or place an ad where it blocks
   the primary checker/result. Dependency: production AdSense approval and the
   experiment ledger; consent and ad-eligibility policies remain binding.

8. **P3 — Assisted photo/code reading (`PHOTO-ASSIST`).** Start with local image
   tools — zoom, rotate, crop/code-area selection and contrast — then optionally
   propose OCR text for explicit user confirmation. Never silently submit an OCR
   guess to the decoder or describe it as certain. Build only after failed-check
   recovery and the evidence library establish real need, privacy and accuracy
   baselines.

16. P3 deploy switch window (`Next`; observed by Claude, scope owned by Codex:
    `deploy.sh`): the new candidate/rename release flow is a large improvement —
    a failed candidate never replaces production, and a failed post-switch smoke
    rolls back — but the switch is not zero-downtime. Between
    `docker rename cosmeticsbatch cosmeticsbatch-previous` and
    `docker rename cosmeticsbatch-candidate cosmeticsbatch` no container answers
    to the production name. If the reverse proxy resolves the app by Docker DNS,
    requests in that gap can 502. Under a second, and far shorter than the
    previous `docker rm -f` then `docker run` sequence, but not nil; a proxy with
    its own DNS cache could stretch it. `needs verification` — the proxy config
    lives in the `yerelatlas_default` stack and was not readable from here.
    Two smaller notes on the same flow: the candidate mounts
    `/opt/cosmeticsbatch-data` and runs with `--restart unless-stopped` while
    production is still live, so two processes can append to the same JSONL
    files during the health-check window (noise, not loss); and
    `docker rm cosmeticsbatch-previous` at the end means fast rollback exists
    only until the smoke checks pass, after which recovery is via the image.

17. P1 mixed-language brand FAQs (`Completed locally` by Codex — not yet
    deployed; verified by Claude): every non-English brand page rendered a
    localized question followed by an English answer. 432 orphaned questions
    across 18 locales; confirmed live before the fix on `/tr/brands/vichy`.
    Fix (Codex): `src/lib/locale-message-gaps.ts` lists the 30 English-only
    brand-detail keys, and the brand page filters both `where` lines and FAQ
    entries through `hasReviewedBrandDetailKey`, requiring the locale to hold
    the question *and* the answer before either is rendered.
    Independent verification (Claude): the manifest was recomputed from all 19
    catalogs — 30 real gaps, 30 listed, nothing missing and nothing stale, so the
    hand-written set is exactly correct. Rendered locally: `/tr/brands/vichy`
    now shows no English answer in the visible DOM and still carries 17 Turkish
    questions, so the page was pruned rather than emptied. 65/65 tests pass, and
    Codex's guard recomputes the manifest per locale and fails on drift, which
    closes the "a new English-only key silently reintroduces this" risk that the
    original entry called for.
    Residual, and the reason this is not simply closed: the English fallback text
    is still present in the RSC payload — `"faq1a":"Often there isn't one..."`
    appears in page source even though nothing renders it, because
    `NextIntlClientProvider` ships the merged catalog to the client. A reviewer
    or crawler reading the rendered page sees only Turkish, so the AdSense and
    SEO content risk is resolved; a strict automated source-language check would
    still see English. Related measurement on `/tr/brands/vichy`: 206 KB total,
    59 KB visible DOM, 147 KB scripts, against `messages/tr.json` at 57 KB and
    `messages/en.json` at 62 KB — the whole merged catalog appears to travel with
    every page. Worth a separate look at scoping messages per route; recorded
    here rather than opened as its own finding until someone confirms the cause.

18. P3 orphaned locale registry entries (`Next`): `ALL_LOCALES` declares 50
    languages, but `fa`, `he`, `sw`, `am`, `ha` and `yo` are neither served nor
    retired — they have no `messages/*.json`, are absent from `LOCALE_CODES`,
    and are absent from `RETIRED_LOCALE_CODES`, so `src/proxy.ts` has no
    redirect rule for them either. The other 25 removed locales were handled
    properly and still redirect. These six sit in a gap: planned-but-never-built
    rather than launched-then-retired. Harmless today because nothing links to
    them; decide explicitly whether they are aspirational registry entries or
    should be dropped, and record which.

19. P1 AdSense rejection exposure (`Next`). Correction to an earlier revision
    of this entry, which said ads were already serving in production: they are
    not. The loader script is present, but `NEXT_PUBLIC_ADSENSE_SLOT_*` is
    unset, so `AdSlot` returns null and no `<ins class="adsbygoogle">` unit
    renders on any page — verified on `/`, `/brands/vichy` and
    `/brands/estee-lauder`. The site is in the deliberate pre-approval posture
    the component comments describe: ad code visible to a reviewer, no units
    until slots exist. Consent exposure is therefore smaller than first written,
    though loading `adsbygoogle.js` still contacts Google before any consent.
    The technical audit lives in `docs/ADSENSE_READINESS.md` (Codex) and is not
    repeated here; this entry records what was measured against the live site
    and the order the risks should be cleared in.

    Measured on production 2026-07-19:
    - The loader is live: the home page carries `adsbygoogle.js` and
      `ca-pub-6300134697173168`, and `/ads.txt` returns
      `google.com, pub-6300134697173168, DIRECT, f08c47fec0942fa0`. No ad unit
      renders anywhere; slot ids are unconfigured.
    - Ad surface is correctly narrow: 331 catalog brands, 35 indexed, 35
      monetized. The loader sits outside the root layout, so the ~180 template
      brand pages and the noindex tool pages carry no ad code. Thin-content
      exposure is already well managed.
    - `/privacy`, `/terms`, `/about` and `/contact` all return 200 and
      `index, follow` in English.
    - Content depth on monetized pages is well clear of thin-content territory:
      `/brands/vichy` 1562 words over 12 sections, `/brands/estee-lauder` 1278
      over 11, `/brands/dior` 1367 over 11.
    - The privacy policy is 832 words and covers Google, AdSense, cookies,
      third parties, advertising, personalization and opt-out.
    - Unknown brand slugs and unknown paths both return 404 rather than a soft
      200.
    - Ad placement is conservative: one `AdSlot` per brand page, between content
      sections, with reserved height and an `aria-label` of "Advertisement". It
      is not in the check flow and not adjacent to a control, so accidental-click
      exposure is low.
    - Claim language was checked for policy-sensitive wording and is honest.
      Matches for "prove authenticity" and "guaranteed expiry" are negations —
      "a batch code alone cannot prove authenticity", "not a guaranteed expiry"
      — not promises.

    Risk 1 — consent, and the reason the audit says "blocked before
    application". `src/components/cookie-consent.tsx:19` describes itself as
    "No third-party CMP". Consent Mode signals are sent with `ad_storage`
    denied by default, but Consent Mode is not a CMP: Google requires a
    certified CMP integrated with IAB TCF for AdSense served to the EEA, UK and
    Switzerland, and asks that the ad tag not be called without Purpose 1
    consent. `AdsenseLoader` loads whenever a publisher id exists and is not
    gated on affirmative consent. This is not hypothetical for this site — the
    Search Console export shows the Netherlands (241 impressions), Germany
    (214) and the United Kingdom (198) among the largest sources, so the
    affected region is core traffic, and ads are already running there.

    Risk 2 — mixed-language pages carry ads, which couples finding 17 directly
    to this one. Verified: `/tr/brands/vichy` and `/ru/brands/loreal-paris` each
    return the `adsbygoogle` tag *and* the English FAQ answer sitting under a
    localized question. A reviewer opening a Turkish or Russian URL sees ads
    beside content that is not in the page's declared language, which reads as
    low-value or auto-generated content. Finding 17 should be treated as an
    AdSense blocker, not only as a localization defect.

    Suggested order, because clearing them out of order wastes a review:
    1. Fix finding 17. It is the cheapest to fix, it is visible on exactly the
       monetized pages, and a rejection on content grounds is harder to appeal
       than a consent configuration gap.
    2. Configure a certified CMP — Google's own European regulations message or
       a third-party one — and gate `AdsenseLoader` on affirmative consent
       rather than rendering it whenever a publisher id exists.
    3. Remove or narrow the existing custom consent UI so users are not asked
       twice by two systems that can disagree.
    4. Make the privacy page describe the deployed CMP exactly rather than
       generically.
    5. Verify TCF v2.3 behaviour and the TC string in EEA, UK and Swiss test
       sessions, and confirm ad requests differ before and after accept/reject.
    6. Only then check Sites approval and ads.txt status in the AdSense account,
       and record the date and screenshots here.

    `needs verification`: none of the account-side state (Sites approval status,
    policy notices, prior rejections) is visible from this environment, so this
    entry describes site-side exposure only.

20. P2 brand logo licence provenance is not recorded (`Next`): 71 brand logos
    ship under `public/brand-logos/` and `src/lib/wikidata-brand-logos.json`
    records `src`, Wikidata `qid`, `commonsFile` and `domainVerified` for each.
    It does not record the licence. Wikimedia Commons logo files are a mix —
    many are `PD-textlogo` and need no attribution, but some carry CC-BY or
    CC-BY-SA, which do. Without the licence stored there is no way to show the
    site complies, and no way to notice if a re-fetch swaps a public-domain file
    for an attribution-required one. AdSense policy covers copyrighted material,
    and these logos sit on exactly the 35 monetized pages.
    Fix: extend `scripts/fetch-wikidata-brand-logos.mjs` to capture the Commons
    licence short name and author for each file, store them alongside the
    existing provenance, add a regression asserting every shipped logo has a
    recorded licence, and surface attribution for any file whose licence
    requires it. Separately from copyright, brand names and logos are
    trademarks; nominative use on a page about that brand is normal, but that is
    a judgement to record rather than assume.
    `needs verification`: whether any of the 71 files actually carries an
    attribution-required licence was not checked — it needs Commons API calls
    that were not made from here.

### AdSense rejection-avoidance sequence

One ordered path through work already recorded elsewhere in this file. It does
not restate those entries and does not replace the roadmap below — it only fixes
the order for the AdSense goal, because clearing these out of sequence spends a
review attempt. Every step names an existing item; update that item, not this
list.

1. **Finding 17 — mixed-language brand FAQs.** Content-grounds rejection is the
   hardest to appeal, and the defect sits on exactly the 35 monetized pages: a
   reviewer opening `/tr/brands/vichy` sees a Turkish question answered in
   English. 432 orphaned questions across 18 locales. Land the guard test with
   the translations so it cannot return.
2. **Finding 19, risk 1 — consent.** Configure a certified CMP and gate
   `AdsenseLoader` on affirmative consent instead of on the presence of a
   publisher id. Then remove the competing custom consent UI, and make the
   privacy page describe the CMP that is actually deployed.
3. **Finding 20 — logo licence provenance.** Record the Commons licence per
   logo and attribute the ones that require it. Lower probability than 1 and 2,
   but it is copyright, and the logos are on the monetized pages.
4. **Finding 4 — remaining localized privacy copy**, if any of it is still
   English by the time steps 1–3 are done.
5. **Only then**: configure `NEXT_PUBLIC_ADSENSE_SLOT_*`, verify TCF v2.3 and
   the TC string in EEA, UK and Swiss sessions, compare ad requests before and
   after accept/reject, and check Sites approval and ads.txt state in the
   account. This is the existing `ADSENSE-READINESS` step; do not start it
   earlier, because a rejection here is recorded against the account.

Not blocking AdSense and deliberately left out of this sequence: findings 15
(dashboard backlog), 16 (deploy switch window) and 18 (orphaned locale registry
entries).

21. P1 shelf life is a brand constant where it is a product property (`Next`;
    live in production). A user-submitted photo on 2026-07-19 supplied the first
    independent ground truth this project has had: a Dior foundation carton
    printing both the batch code `5G01` and `EXP 28/06`. Month 28 does not
    exist, so the format is `YY/MM` — June 2028.

    Good news first, and it closes a real doubt: the manufacture decode is
    corroborated. `5G01` decodes to July 2025 (`5` = 2025, `G` = July on the
    A–M-skipping-I wheel). Against a printed June 2028 expiry that implies about
    35 months of shelf life, so the year is right and the month is within one.
    This is the first time a decoder reading has been checked against a date the
    manufacturer printed rather than against what the batch-code community
    republishes.

    Independent architecture audit (`Completed read-only`, 2026-07-19): the
    defect also covers brand-wide PAO and category language. Brand defaults flow
    independently through the decoder, public API, `/check`, private diagnosis,
    result card/actions, brand facts/copy/FAQ and FAQ schema; changing only one
    surface would leave contradictory output. Minimum safe containment is a
    discriminated server-owned lifecycle state: retain manufacture date, age
    and confidence for a product-dependent brand, but return no estimated
    expiry, remaining percentage, PAO or fresh/expired verdict until a verified
    product category is selected. Never accept raw months from the client.
    Phase A should apply to Dior because direct printed evidence exists; Chanel,
    Guerlain, Armani and Tom Ford remain `needs verification`, while evidenced
    single-category fragrance brands keep current behavior. Later phases should
    unify duplicated brand-check call sites, optionally log a nonpersonal
    guidance kind without rewriting historical JSONL, and add a server allowlist
    selector only where sourced category guidance exists. Acceptance must prove
    Dior `5G01` retains July 2025 manufacture while suppressing the false 2030/
    60-month lifecycle claims in DOM, API and schema, with a known perfume brand
    unchanged. No code was changed by this audit.

    The defect: `GET /check?brand=dior&code=5G01` in production tells the user
    "Shelf life 60 months", "Estimated unopened shelf-life date July 2030",
    "Fresh · 80% left". The carton says June 2028. The site overstates the
    manufacturer's own date by **24 months** and reports four fifths of life
    remaining against a product the maker dates two years earlier.

    Cause: shelf life is stored per brand, but it is a property of the product
    category. `dior` is `category: "perfume"` with `shelfLifeMonths: 60`, which
    is defensible for fragrance and wrong for the foundation, mascara and
    skincare the same brand sells. The catalog splits 255 brands at 36 months
    and 75 at 60; of the 35 indexed brands, 16 carry 60 months while several —
    `dior`, `chanel`, `guerlain`, `giorgio-armani-beauty`, `tom-ford-beauty` —
    have large makeup and skincare lines. Every one of those checks receives the
    fragrance figure.

    Wider than the number, and this is the part that matters most: `category`
    also drives the words. `categoryNoun.perfume` resolves to "fragrance", so
    `/brands/dior` tells the owner of a foundation "we estimate freshness using
    Dior's typical 60-month shelf life for fragrance products", "how fresh your
    Dior fragrance is", and — worst — "heat and steam break down the fragrance
    oils faster than age alone, dulling the scent and shifting the colour".
    That last line is not merely the wrong label; it is storage advice about a
    product the reader does not own, on the page they came to for guidance.
    Seven sentences on that page use the fragrance framing.
    This also partly explains finding 10's low uniqueness score: much of what
    reads as brand-specific editorial is category-templated, so brands sharing a
    category share prose.

    Why it matters beyond accuracy: the project's cautious-claims policy exists
    precisely so the site does not imply a product is safe longer than its maker
    says. This inverts that, and it does so on the monetized, indexed pages.

    Fix direction, not yet chosen. Any option has to correct the copy as well as
    the number, since a foundation described as a fragrance is wrong even if the
    months are right. Candidates: ask the user which product type they are
    checking and apply the matching shelf life and nouns; infer it from the code
    format where a brand's fragrance and cosmetics lines use different schemes;
    or, for multi-category brands, drop both the derived shelf-life date and the
    category-specific prose and show the manufacture date, PAO and
    category-neutral guidance. The last is the smallest honest change and needs
    no new input from the user.

    Blast radius, measured rather than assumed — "this affects everyone" is
    true of the wording and not of the danger. Of the 35 indexed brands:
    - 11 are single-line fragrance houses (`creed`, `montblanc`, `dunhill`,
      `escada`, `paco-rabanne`, `jean-paul-gaultier`, `carolina-herrera`,
      `kenzo-parfums`, `calvin-klein`, `hugo-boss`, `roberto-cavalli`). Their
      category is correct and their copy is right. Changing them would make the
      site worse, so any fix must not sweep them up.
    - 13 are multi-category but recorded at 36 months (`estee-lauder`,
      `clinique`, `mac-cosmetics`, `loreal-paris`, `maybelline`, `garnier`,
      `la-roche-posay`, `cerave`, `vichy`, `lancome`, `kiehls`, `ysl-beauty`,
      `nivea`). For their fragrance lines this understates shelf life: still
      wrong, but it errs toward caution and toward the wrong noun rather than
      toward implying a product is usable longer than it is.
    - **5 are multi-category recorded at 60 months — `dior`, `chanel`,
      `guerlain`, `giorgio-armani-beauty`, `tom-ford-beauty`.** These are the
      only ones that overstate, and they are where the 24-month gap lives. They
      are also among the highest-traffic pages in the Search Console export.
    - 6 were not classified here and need a look: `too-faced`, `loreal`,
      `kerastase`, `redken`, `fenty-beauty`, `zara`.
    So the safety-relevant fix is five brands, the wording fix is eighteen, and
    eleven must be left alone. Sequencing the five first buys most of the
    correctness for a fraction of the churn.

    `needs verification`: one carton, one brand. Confirming the same 24-month
    gap on a second multi-category brand — a Chanel or Guerlain makeup item with
    a printed date — would establish the pattern rather than the instance. The
    11 single-line and 6 unclassified brands above are my reading of what each
    house actually sells, not a catalog fact; a second pair of eyes on that
    split would be worth having before anyone edits.

22. P1 the L'Oréal decoder prefers the first readable letter over the plausible
    one (`Next`; live in production). Seen in the owner dashboard's check log on
    2026-07-19: a real user in Indonesia checked L'Oréal Paris `E38Y801N` and
    was told **2005-03-15, expired** — a product 21 years old.

    What happens: `loreal` scans left to right for the first letter that has a
    valid month after it. In `E38Y801N` that is `E` at index 0 followed by `3`,
    so it reads E = 2005, month = March. But the same string contains `Y8`, and
    on the year wheel (`ABCDEFGHIJKLMNOPQRSTUWXYZ`, V skipped, Z = 2025) `Y` is
    2024 with `8` = August. August 2024 is a plausible reading of a code a
    shopper is holding; March 2005 is not.

    The decoder already knows it is guessing. It marks the shape non-canonical,
    drops to `low` confidence, and attaches "This code reads as 2005, which
    would make the product about 21 years old. The year letter repeats every 25
    years, so a misread letter is more likely than a batch that old." Having
    reasoned that far, it still prints the date and labels the product
    **expired**. That is the defect: the freshness verdict contradicts the note
    printed beside it, and "expired" is a stronger claim than the evidence
    supports.

    This is also the mechanism behind the 2001–2005 cluster found earlier in the
    same dataset — a distribution with nothing between 2006 and 2011 and nine
    readings in 2001–2005, which is not how a population of products people
    actually own is shaped.

    Fix direction: when a non-canonical scan yields a date older than the
    plausible-age threshold, prefer a later letter position that yields a
    plausible one before falling back; and where no plausible reading exists,
    decline rather than reporting `expired`. Telling someone a fresh product
    expired two decades ago is worse than telling them the code could not be
    read — the second is honest, the first is confidently wrong.

    Evidence source: production check log, `/review/dashboard?view=checks`. The
    same screenshot shows `361427` failing twice in a row for the same user,
    which is the retry pattern the failed-code queue is meant to surface.

23. P2 failed results do not mention that the brand prints the date (`Next`;
    owner has declined implementation for now — recorded so the measurement is
    not lost). Investigated after the owner asked for a SKIN1004 improvement.

    SKIN1004 fails every check: 14 of 14 in the 2026-07-19 export, from three or
    four people retrying, including homoglyph variants (`K04Y017`, `KO4YOI7`,
    `K04Y0I7`) and spacing variants (`F16C27C`, `F16C27`, `F16C27. C`).

    A decoder was deliberately not written. The observed codes do not share one
    shape — `H25L24F`, `M25L24F` and `F16C27C` fit `[A-Z]\d\d[A-Z]\d\d[A-Z]`,
    `K04Y017` and `F05B190` end in a digit instead, and `FD01S` and `026618` fit
    neither. Inferring a scheme from fourteen strings is the same mistake that
    produced findings 21 and 22: a confident wrong answer. Separately, the brand
    is assigned the `kbeauty` decoder, which reads numeric dates
    (`YYYYMMDD`/`YYMMDD`); SKIN1004's codes are alphanumeric, so the assignment
    is wrong even though the correct one is unknown.

    What the investigation did find: `skin1004` already carries
    `printsDate: true`, and the brand page shows a note saying the maker prints
    the date on the pack. The `/check` result page does not. A user who typed
    `H25L24F`, got "We could not decode this code yet" and left was never told
    that what they wanted is already printed on the box in their hand.
    Measured against the export: 24 of 156 failed checks (15%) are for brands
    with `printsDate: true` — `skin1004` 14, `beauty-of-joseon` 4, `anua` 4,
    `numbuzin` 1, `missha` 1. The copy exists (`brandPage.printsDateNote`) and
    is simply not used on the failure path. 59 brands carry the flag.

    Note for whoever picks this up: the failure copy itself is already good — it
    says the code may still be valid, adds it to the review queue and offers
    photo submission. It does not blame the user. The gap is only the missing
    "this brand prints the date directly" line.

    `needs verification`: SKIN1004's real format. A photo showing a SKIN1004
    code beside a printed date would settle it, the same way one Dior carton
    settled the Dior wheel in finding 21.

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
- Accumulated-release verification: repository ESLint, TypeScript,
  `git diff --check`, 52/52 decoder/quality tests and the 267-page production
  build passed on 2026-07-19. The pre-existing private-photo NFT tracing warning
  remains. Production review-panel verification still needs a real Cloudflare
  Access session. Deployment is now owner-authorized and pending.

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
