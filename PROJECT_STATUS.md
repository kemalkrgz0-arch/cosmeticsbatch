# CosmeticsBatch project status

Last updated: 2026-07-22
Current version: **1.4.1**
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
- Current production baseline: commit `6f98217`; GitHub Actions deploy run
  `29893391221` completed successfully on 2026-07-22. Production and repository
  package/document version is `1.4.1`.
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

- `ADSENSE-APPROVAL-016`; owner: **primary Codex agent from 2026-07-22**
  (explicitly reassigned by the owner with “CMP probleminden başlayarak hepsini
  çözelim”; handed over from Claude); state: `In progress`;
  claimed 2026-07-19 Europe/Istanbul; starting commit `c681ee5`; starting
  version `1.3.0`. Scope: official-Google-only AdSense acceptance research,
  repository/live readiness matrix, consent/CMP switch controls, privacy
  disclosures, monetized-inventory gating, mixed-language/low-value blockers,
  ads.txt/site connection and account-side application runbook. Intended files:
  `docs/ADSENSE_READINESS.md`, `PROJECT_STATUS.md`, `src/lib/ads.ts`,
  `src/components/tracking-boundary.tsx`, `src/components/cookie-consent.tsx`,
  `src/app/[locale]/privacy/page.tsx`, monetized page components, deployment
  Handover recorded per the concurrent-work rule: the owner reassigned this
  claim on 2026-07-20. Codex left no in-flight edits in its intended file scope —
  `git status` showed only `PROJECT_STATUS.md` modified — so nothing of theirs is
  being overwritten. Their work to date stands: the readiness matrix, the
  `NEXT_PUBLIC_GOOGLE_CMP_ENABLED` switch, the suppression of the custom banner
  when a certified CMP is live, the English-only ad-eligibility gate and the
  privacy disclosures.
  Claude's starting position: of the seven blockers, five are account-side and
  cannot be closed from this environment — certified CMP publication, consent
  revocation, site/account connection, `ads.txt` authorization in the account,
  Policy Center state and identity/payment eligibility. Two are repository work
  and are what this claim now covers: the 46 public packaging/code assets with
  unrecorded provenance, and the rendered-crawl proof that no locale leaks
  English into a localized page. A third — production UX/CWV at real device
  widths — needs hardware this environment does not have.
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
  Targeted `.next` audit (`Completed read-only`, run `29704357016`): cache is
  only 25.9 MiB; the full 52.6 GiB is under `/app/.next/server/app`. It is not
  safe to treat that as ordinary cache without identifying the generated route
  files. Added a read-only child-directory and >100 MiB file inventory; still
  no deletion, container restart or production switch.
  Final route-size audit (`Completed read-only`, run `29704550928`): the 52.7
  GiB layer is generated city route output under `.next/server/app` (24.1 GiB
  English, 28.6 GiB Turkish; the Istanbul branches alone total 7.6 GiB), not a
  database or declared Docker volume. Added an explicit owner-triggered,
  default-off Compose force-recreate input for only the stateless YerelAtlas app
  service. Compose preserves its declared volumes/environment while replacing
  the oversized writable route layer; DB and Redis services are untouched.
  Production result (`Completed`, run `29704753618`, commit `fd2e8a4`): the
  stateless YerelAtlas app service was recreated from its existing image, which
  removed the 52.7 GiB generated writable route layer while preserving declared
  Compose volumes/environment. The CosmeticsBatch image then built, its release
  candidate passed startup checks, the named-container switch and `/`,
  `/brands/dior`, `/check` smoke checks passed, and the workflow completed
  successfully. Live verification returned 200 for home, Dior, checker,
  sitemap, ads.txt, privacy and Turkish/Russian Vichy; private review returned
  the expected 302 Access redirect. English home/Dior load the publisher script;
  sampled `tr`, `ru`, `de` and `fr` brand pages load no AdSense script or units.
  No slot/unit is active. Known English fallback strings remain only inside the
  merged RSC catalog payload on the Turkish sample, not as proof of visible DOM;
  scoping client messages remains separate technical debt.
  CMP not reaching visitors, found 2026-07-21 (`In progress`, owner-side action
  required). The owner reported that the consent message is not appearing. It is
  not an account fault: the message is published and assigned. Production simply
  serves no `adsbygoogle.js` — `curl https://cosmeticsbatch.com/en` returns zero
  matches for `adsbygoogle`, while `/ads.txt` still returns 200 with the correct
  publisher line. That is exactly the ordering hazard this file recorded on
  2026-07-20 and it landed: `CLAUDE-CMP-001` deployed without
  `NEXT_PUBLIC_GOOGLE_CMP_ENABLED` being added to `.env.build` on the VPS, so
  `googleCmpEnabled` (`src/lib/ads.ts:25`) is false, `AdsenseLoader` returns null
  (`src/components/ui/adsense-loader.tsx:35`), and the script that injects the
  certified message never loads. The site has been running with no ad script and
  no Google consent UI since that deploy.
  Fix is one line on the VPS — `NEXT_PUBLIC_GOOGLE_CMP_ENABLED=true` in
  `/opt/cosmeticsbatch/.env.build` — followed by a rebuild, not a container
  restart, because `NEXT_PUBLIC_*` is inlined at build time. Setting it also
  suppresses the custom `CookieConsent` banner
  (`src/components/tracking-boundary.tsx:32`), which is the intended single-UI
  outcome. No agent can perform this: `.env.build` is untracked and lives only on
  the VPS.
  To stop the same silence recurring, `deploy.sh` now prints a warning when a
  publisher id is configured while the CMP flag is not `true`. Deliberately a
  warning and not a hard failure — an intentionally ad-free build is a valid
  reason to deploy. The local `.env.build` mirror was updated to match; it is
  gitignored and has no effect on production.
  Second failure, same day, worse than the first. After the owner's deploy the
  loader appeared: a live fetch returned the script with the correct publisher
  id. A later fetch returned nothing, and it is not intermittent — repeated
  requests to `/` and `/en` all return zero occurrences of `adsbygoogle`. The
  publisher `<meta google-adsense-account>` is gone as well, and that tag depends
  only on `adsenseEnabled` (`src/app/[locale]/layout.tsx:63`), not on the CMP
  flag. `/ads.txt` now returns empty where it previously returned the correct
  line, and neither the GA id nor the Yandex id appears in the HTML any more.
  So the current production build carries no `NEXT_PUBLIC_ADSENSE_CLIENT`, no
  `NEXT_PUBLIC_GA_ID` and no `NEXT_PUBLIC_YM_ID`. `NEXT_PUBLIC_SITE_URL` did
  survive — canonical, og:url and sitemap are all correct — which is the useful
  clue: `deploy.sh` sources one file and hard-fails on a missing site URL, so
  `.env.build` on the VPS was read, but its ad and analytics keys are now blank
  or absent. The likeliest cause is that editing the file to add the CMP flag
  replaced or truncated the rest of it.
  This is not only a CMP problem. Analytics has been collecting nothing since
  that deploy, and the ads.txt that AdSense checks for authorization is empty
  while the account is under review. Diagnosis is `cat /opt/cosmeticsbatch/.env.build`
  on the VPS, compared against `.env.build.example`; every key in the example
  belongs there. No agent can read or repair that file from here.
  The warning added to `deploy.sh` would not have caught this: it fires when a
  publisher id is set without the CMP flag, and here the publisher id itself went
  blank. A blank id silently disables the meta tag, the loader and ads.txt at
  once, so it deserves its own check.
  Account evidence, 2026-07-21, from owner screenshots — the first time this file
  can state the account side from the account rather than from inference.
  Sites: `cosmeticsbatch.com`, approval status **"Hazırlanıyor" (getting ready)**,
  so the site is not approved. Ads.txt status **"Bulunamadı" (not found)**, last
  updated 21 Jul 2026 10:39 GMT+3. Privacy & messaging: the European regulations
  message exists, is **published**, assigned to `cosmeticsbatch.com`, English plus
  31 more languages — and has **0 impressions at 0% consent rate**.
  Those three facts line up with the browser measurement and with each other.
  Google crawled `/ads.txt` at 10:39, which is inside the window when the build
  had lost its publisher id and the route was answering 204 with an empty body.
  The "not found" is therefore a recorded consequence of that config loss, not a
  routing or Cloudflare problem: `/ads.txt` now returns 200 with the correct line
  to a Googlebot user agent, verified. It should flip to authorized on the next
  crawl; nothing further is required from the repository.
  Zero impressions is the same story from the other end. The message is fine —
  Google is simply not delivering the Funding Choices bundle to a site that is
  still "getting ready", which is exactly what the browser showed: `googlefc`
  undefined, `__tcfapi` undefined, no funding-choices request at all, while
  `adsbygoogle.js` and `show_ads_impl` both loaded and ran.
  Conclusion worth keeping: the CMP was never a repository defect after the
  loader strategy was fixed. It is downstream of site approval. Do not keep
  changing code to chase it, and do not re-request review to hurry it.
  Browser measurement, same day, from Turkey with `?fc=alwaysshow&fctype=gdpr`.
  One blocker does close on this evidence regardless of geo: there is no
  competing consent UI. A DOM scan found zero consent surfaces, so the custom
  `CookieConsent` is correctly suppressed while the certified message owns the
  conversation. The geo-dependent half — TC string, refusal button, ad requests
  differing across accept and reject — still needs an EEA session; `fc=alwaysshow`
  cannot force a bundle Google never sends.
  Post-fix verification is still owner-side and still needs an EEA/UK/Swiss
  session: `__tcfapi` present and a TC string produced, the refusal button
  visible on the three-option layout, and ad requests differing between accept
  and reject. A check from Turkey cannot show any of this, which is the same
  measurement error corrected further down this file.
  Handoff/adoption (`In progress`, 2026-07-22 08:03:18 +03): primary Codex
  adopted the existing claim at starting commit `53c3be4`. Intended first scope:
  `.github/workflows/deploy.yml`, `scripts/deploy.sh`, `.env.build.example`,
  `src/lib/ads.ts`, CMP/AdSense regression tests, `docs/ADSENSE_READINESS.md` and
  this status file. Acceptance: a production build must fail closed when the
  release declares advertising/CMP enabled but any required public build value
  is blank or malformed; the same validator must be locally testable without
  secrets; the runbook must distinguish site-approval delivery from repository
  behavior; focused and repository-wide checks must pass. Existing external
  acceptance criteria remain: live EEA/UK/Swiss evidence for `__tcfapi`, TC
  string, reject/manage/reopen behavior and request differences, plus account
  evidence for Sites, ads.txt and Policy Center. Those cannot be marked complete
  from a Turkish/local session. No push, account mutation or deployment is
  authorized by this implementation request.
  CMP build-config correction (`Completed locally`, 2026-07-22): added the
  reusable `scripts/validate-build-env.sh` gate and wired it into `deploy.sh`.
  A monetized production release now fails before Docker build unless the site
  origin, 16-digit `ca-pub` id, explicit CMP=true flag, GA4 id and numeric
  Yandex id are all present and well formed. `REQUIRE_MONETIZATION_STACK=false`
  preserves a deliberate ad-free release rather than conflating it with a
  truncated environment file. `.env.build.example` now represents the
  published account-side CMP state, and the readiness matrix distinguishes
  repository readiness from Google site-review delivery. Acceptance evidence:
  `bash -n deploy.sh scripts/validate-build-env.sh` passed; valid-stack and
  fail-closed validator probes passed; scoped ESLint passed; the two focused
  CMP/loader regression tests passed. Changed files: `deploy.sh`,
  `scripts/validate-build-env.sh`, `.env.build.example`,
  `scripts/quality-regression.test.ts`, `docs/ADSENSE_READINESS.md` and this
  status file. Remaining external blocker: an EEA/UK/Swiss live session and
  account review state are still required; no local code can manufacture a TC
  string that Google has not delivered.
  Live read-only smoke (`Completed`, 2026-07-22 08:12 +03): production home
  contains `adsbygoogle.js?client=ca-pub-6300134697173168` and the matching
  `google-adsense-account` meta; `/ads.txt` returns HTTP 200 with the matching
  authorized publisher line. This closes the repository/production presence
  portion only. It does not prove Google Sites approval or regional CMP delivery.
  Publication authorization (`In progress`, 2026-07-22): the owner explicitly
  said “şimdilik bunu deploy edelim”, authorizing commit, push and the manual
  production workflow for the accumulated `1.4.1` CMP/release-regression group.
  This does not mark `FAILURE-COPY-I18N-023` complete; no translation-catalog
  edits from that claimed follow-up are present in this release. Release
  acceptance: full lint, TypeScript, 79/79 quality/operational gate, production
  build, workflow candidate/switch smoke and post-deploy live checks must pass.
  Pre-deploy gate (`Completed locally`, 2026-07-22): repository-wide ESLint and
  `tsc --noEmit` passed; `npm run test:quality` passed 79/79 plus search evidence,
  experiments, content-freshness and evidence-inventory validators; shell syntax
  and `git diff --check` passed; `NEXT_TELEMETRY_DISABLED=1
  ./node_modules/.bin/next build` compiled cleanly and generated 267/267 pages.
  The evidence validator still truthfully reports 39 assets requiring provenance
  audit; that pre-existing external/editorial blocker is not hidden by this
  technical release.
  Production deployment (`Completed`, run `29893391221`, commit `6f98217`,
  2026-07-22): `main` push included the previously local `53c3be4` failure-copy
  refactor and the verified `1.4.1` release commit. The VPS validation reported
  `build config: valid (true monetization stack)`, Docker generated 267/267
  pages, the release candidate started, route-level switch smoke passed and the
  workflow completed in 5m37s. Post-deploy live checks returned 200 for `/`,
  `/check`, `/privacy` and `/ads.txt`; ads.txt contains the expected publisher
  authorization, English home contains the matching publisher meta and
  `adsbygoogle.js`, while Turkish Vichy contains no ad loader. `/review` retains
  its application redirect boundary. Remaining production dependency:
  EEA/UK/Swiss browser evidence for the Google-delivered CMP and account-side
  Sites/Policy Center state. `FAILURE-COPY-I18N-023` remains `In progress` and
  is not falsely closed by this deployment.

- `RELEASE-REGRESSION-022`; owner: primary Codex agent; severity: `P1`; state:
  `Completed`; discovered/claimed 2026-07-22 08:12 +03; starting commit
  `53c3be4`. Evidence: `npm run test:quality` ran 78 tests and failed two: the
  registered decoder/fixture inventories disagree about `jean-paul-gaultier`,
  and the L'Oréal malformed-shape assertion expects a recognized result that the
  current decoder does not return. Scope: decoder registry/fixtures and the two
  focused regression assertions, plus this status file. Acceptance: determine
  expected behavior from documented decoder contracts and evidence, correct
  implementation or stale tests without broadening a decoder, pass focused
  tests and the repository-wide quality gate. These failures block release
  completion even if unrelated to the CMP refactor.
  Newly unmasked evidence before correction: after fixing the inventory mismatch
  and stale L'Oréal expectation, the same focused suite reached the fixture loop
  and showed `interparfums` code `08J38J169` no longer returns the historical
  guessed date. The decoder contract now intentionally recognises long-form
  codes without dating them, so treating that sample as an exact-date fixture is
  stale and would pressure the test toward an unsupported decoder broadening.
  Related P1 copy finding recorded before edit: the Inter Parfums decoder
  explanation and section header still present long-form `08J38J169` as a
  verified 2019 date even though the implementation and later evidence now
  classify that whole long form as recognized-but-undated. A method explanation
  could therefore contradict the safe result. Acceptance expands to remove that
  stale claim while retaining the separately supported short `J169` form.
  Completion evidence: added the missing dated Puig-era Jean Paul Gaultier
  fixture; updated the stale L'Oréal assertion to require recognized-without-date;
  replaced the unsafe Inter Parfums long-code fixture with supported short form
  `J169`; and removed the contradictory long-form dating claim from the decoder
  explanation. No decoder was broadened. Focused decoder suite passed 25/25,
  scoped ESLint passed, TypeScript passed after the CMP test environment typing
  correction, `git diff --check` passed, and `npm run test:quality` passed 79/79
  plus all four operational validators. Changed files:
  `scripts/decoder-regression.test.ts`, `src/lib/decoder/decoders.ts`, CMP test
  typing in `scripts/quality-regression.test.ts`, and this status file.

- `FAILURE-COPY-I18N-023`; owner: primary Codex agent; severity: `P1`; state:
  `In progress`; discovered earlier and adopted 2026-07-22 08:20 +03; starting
  commit `53c3be4`. Evidence: `resultFailure` was moved into message catalogs in
  the latest commit, but only `en` and `tr` define the namespace; all other 17
  active locales therefore inherit English at the most important failure point.
  Scope: `messages/{ar,da,de,es,fr,id,it,ja,ko,nl,pl,pt,ru,sv,vi,yue,zh}.json`,
  translation parity regression and this status file. Acceptance: every active
  locale owns every `resultFailure` leaf with unchanged interpolation variables;
  no English catalog fallback is needed at runtime; JSON, parity, ESLint,
  TypeScript and full quality checks pass. Translation naturalness remains
  `needs verification` until native review and will not be described otherwise.

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
  - `CLAUDE-JPG-001`; owner: Claude; state: `Completed locally — not committed`;
    assigned by the owner 2026-07-20; starting commit `2342ed0`; scope:
    `src/lib/decoder/{index,decoders,profiles}.ts`, `src/lib/brands.ts`,
    `src/lib/result-failure-copy.ts`, `src/lib/decoder-guides.ts`,
    `src/components/inline-result.tsx`. Task: act on finding 26 — Jean Paul
    Gaultier's pre-2016 alphanumeric codes were being told they were unreadable.
    Owner's decision, given explicitly when asked: recognise the format, do not
    date it. The published collector scheme agreeing with five of our
    photographs was judged not enough to put a year in front of a user.
    What shipped: a dedicated `jean-paul-gaultier` decoder replacing the shared
    `embedded` reader for that brand only. It still reads the Puig-era numeric
    date exactly as before, and additionally recognises the BPI-era shape
    `/^[A-Z]{3}\d{2}[A-Z]{1,2}$/` — returning an attempt with a null date.
    `checkBatchCode` now treats a dateless attempt as a claim of recognition
    rather than ignoring it, behind a fourth `DecodeFailureReason`, `recognized`.
    No existing decoder returned a null-date attempt, so the new meaning could
    not collide with one; this was checked before the change, not assumed.
    Recognition never outranks the barcode guard, and it does not stop the
    search — a later decoder that can actually date the code still wins.
    User-facing: "We recognize this code but cannot date it yet", in English and
    Turkish, saying plainly that we would rather tell them this than guess. The
    result also now fires the photo-submission prompt, which it did not before —
    a printed date beside one of these codes is the single thing that would
    finish the format, so this is the case that most needs a photo.
    Why a separate decoder rather than a branch in `embedded`: `embedded` is
    shared with Zara, Rabanne, Paco Rabanne, Carolina Herrera and Nina Ricci, and
    `DecodeContext` carries no brand, so a BPI rule added there would have
    applied to all six. `FALLBACK_CHAIN` is empty, so a dedicated decoder is
    reachable only from its own brand.
    Verification: 7/7 BPI codes from owner photographs return `recognized`; 5/5
    Puig codes decode to the same dates as before the change; `QOEC`, a
    checksum-valid EAN and junk strings are not falsely recognised; the four
    other `embedded` brands are unaffected in both directions. TypeScript clean;
    quality suite 43/43 after adding the guide entry the suite's decoder-coverage
    guard correctly demanded. No commit, push or deployment.
    Not done, deliberately: no year is inferred. Finding 26 keeps its open
    `needs verification` — one BPI-era item carrying both a code and a printed
    date.
  - `CLAUDE-DIOR-001`; owner: Claude; state: `Completed locally — not committed`;
    assigned by the owner 2026-07-20; starting commit `2342ed0`; scope:
    `src/lib/decoder/decoders.ts` (the `dior` decoder only). Trigger: the owner
    showed two live check-log rows from today, `3J1P` and `4F03A1`, both Dior,
    both `unresolved`.
    Cause: the modern letter-month pattern was anchored as
    `^(\d)([A-Z])(\d{1,3})$`, so any code carrying a trailing plant or line
    marker was rejected outright even though its head was well-formed. This was
    not two stray codes. Of the 27 Dior codes in the 2026-07-19 export, 16 decode,
    4 are barcodes or C-references and 1 is the Paris postcode already handled —
    but 6 (`4C2X`, `4d1x`, `5M5K` among them) failed for the marker alone. With
    today's two that is 8 real codes lost to a `$`.
    Confirmation: CheckFresh, a competitor, dates `3J1P` as 2023-09 and `4F03A1`
    as 2024-06 — matching what our own year-digit and month-letter rules already
    say (3 -> 2023, J -> September; 4 -> 2024, F -> June). We are not learning a
    new format here, only removing an anchor that discarded codes we could
    already read. This is the comparison use of a competitor recorded in
    finding 32, not adoption of anyone's cipher.
    Guard against finding 31: the marker is admitted as `(?:[A-Z]\d?)?` rather
    than a free `[A-Z0-9]{1,3}`. Both read all 13 known-good Dior codes, but the
    free form also reads "1A2B3C" as January 2021. Scored on the junk benchmark
    from finding 31, the chosen shape takes 13/13 real and 0/16 junk.
    Verification: `3J1P` -> 2023-09 and `4F03A1` -> 2024-06, matching CheckFresh;
    the three previously rejected log codes now decode; five known-good codes are
    bit-for-bit unchanged (`5D01`, `5G01`, `4A01`, `1K01`, `6L02`); `1A2B3C`,
    `ZZ99`, `75008` and `ABC123` are still refused. Whole-engine permissiveness is
    unchanged at 49/320 (15%) and `dior` specifically stays at 3/16 — the fix adds
    real coverage without buying any of it with false positives. TypeScript clean;
    quality suite 43/43. No commit, push or deployment.
    Left open: `M12345` still decodes to 2012-12 through the `readEmbeddedDate`
    fallback inside this decoder. That is pre-existing and is finding 31, not this
    change; it is called out here so the next agent does not read the passing
    verification above as meaning the `dior` decoder is now strict.
  - `CLAUDE-PERMISSIVE-001`; owner: Claude; state: `Completed locally — not
    committed`; assigned by the owner 2026-07-20; starting commit `2342ed0`;
    scope: `src/lib/decoder/decoders.ts` (the `loreal` decoder only) and
    `scripts/quality-regression.test.ts`. Task: finding 31, starting with the
    worst offender.
    Cause: the `loreal` decoder slid a window across the whole string looking for
    any letter with a valid month character after it. This file's own comment
    already described the failure — "MNX30W reads as M=2013/N=Nov at the front
    and as X=2023/3=Mar further in, and nothing in the code says which is meant"
    — but the guess was still published as a date, with a prose note beside it
    admitting it was a guess.
    Change: a code that does not carry the documented shape no longer receives a
    date. It receives recognition, through the `recognized` path built earlier
    today for Jean Paul Gaultier under `CLAUDE-JPG-001`: we say it looks like a
    L'Oréal-group code and that we cannot place the year and month confidently.
    The canonical branch is untouched — the only edit inside it removes a now
    unreachable `!canonical` note and simplifies `canonical ? "high" : "medium"`
    to `"high"`, which is the same value on that path.
    Measured against the 2026-07-19 export and finding 31's junk benchmark:

        real L'Oréal decodes    164  ->  144 dated + 20 recognized
        loreal junk reads      10/16 ->  2/16
        whole-engine junk      15%   ->  13%

    Two of the 20 downgraded codes are already recorded as wrong: `E38Y801N`
    (finding 22, dated 2005 and shown as expired) and `MNX30W`. The other 18 were
    never verified against anything.
    Deliberately not done: tightening the factory prefix from `\d{1,2}` to
    `\d{2}` would also refuse the two junk strings that still pass
    (`1A2B3C`, `7X8Y9Z`), but it would refuse two real export codes with it
    (`2A100`, `4Z8K`) whose provenance nobody has checked. Two-for-two is not
    evidence worth spending, so the residue is pinned in the test instead.
    Locked in: two new suite tests. One pins whole-engine junk dating at a
    ceiling of 41 and `loreal` at 2, so a hungrier decoder fails the suite rather
    than reaching users. The other asserts that unshaped L'Oréal codes come back
    `recognized` with a null date while `26X300` still decodes at `high`.
    Verification: TypeScript clean; quality suite 45/45 (43 before, plus the two
    new). No commit, push or deployment.
    Second half, same claim, later the same day: the shared `readEmbeddedDate`
    fallback. Its digit match was unanchored — `\d{4,6}` found anywhere in the
    string — so any code carrying four digits somewhere got a date built from
    them. All four callers (`dior`, `embedded`, `jean-paul-gaultier`, `chanel`)
    reach it as their "vintage / all-digit" fallback and say so in their own
    comments, so it now requires the whole code to be four to six digits.
    The six-digit cap matters too: slicing the first six digits off an
    eight-digit code was itself a guess about where the date sat.
    This is what closes finding 29. `C03560099` and `C036400649`, Dior product
    references printed larger and more prominently than the batch code beside
    them, dated to 2020-12-21 and 2020-12-29 before the change and are declined
    after it.
    Measured: real all-digit codes are untouched (`231122`, `4135`, `24045`,
    `509811`, `401212`, `13481`), and so is Dior's letter-month path including
    the `3J1P` and `4F03A1` codes fixed under `CLAUDE-DIOR-001`. Whole-engine
    junk dating falls from 49/320 to 33/320 — 15% to 10% — and the suite ceiling
    moves with it. Across the export, 288 previously dated checks become 263;
    every loss is either a `loreal` code downgraded by the first half of this
    claim, one of the two Dior references above, an eight-digit code of unknown
    provenance (`01067285`), or an EAN that the barcode guard already refuses.
    Note for the next agent: findings 22 and 29 are both resolved by this claim
    and should be marked so rather than reworked. What remains of finding 31 is
    spread thinly across decoders whose formats are genuinely short — a
    four-character code can be read off a four-character string, so lowering
    those needs per-decoder evidence rather than another blanket rule.

  - Notes for Codex, 2026-07-20, left at the owner's request:
    a. Nine commits' worth of work is sitting uncommitted across three claims:
       `CLAUDE-JPG-001`, `CLAUDE-DIOR-001` and `CLAUDE-PERMISSIVE-001`. All three
       touch `src/lib/decoder/`, so they want committing in that order — the Dior
       and L'Oréal changes both depend on the `recognized` failure reason added
       by the JPG one, and neither compiles without it.
    b. The `recognized` reason is a new member of `DecodeFailureReason`. Anything
       that switches on that union exhaustively needs a branch; TypeScript
       catches it, and it caught two during this work. `resultFailureCopy` has
       English and Turkish only, matching the existing file — the other locales
       fall back to English exactly as they did for the other three reasons.
    c. The decoder-coverage guard in the suite is worth knowing about before
       adding a decoder: registering one in `DECODERS` without a matching
       `DECODER_GUIDES` entry fails the suite. It caught the JPG decoder here.
    d. Do not adopt the external batch-code guides. Finding 32 records why, with
       the measurements. The one legitimate use is scoring our output against a
       competitor's on the same code, which is how `CLAUDE-DIOR-001` was
       confirmed.
    e. Open and blocked on evidence, not on effort: finding 26 needs one
       Beauté Prestige International item photographed with a printed date beside
       the code; finding 30 needs the physical carton behind `130711` read again.
       Neither should be guessed at.

  - `CLAUDE-CMP-001`; owner: Claude; state: `Completed locally — not committed`;
    assigned by the owner 2026-07-20; starting commit `2342ed0`; scope:
    `src/components/ui/adsense-loader.tsx`, `src/components/ui/ad-slot.tsx`,
    `scripts/quality-regression.test.ts`. Task: step 2 of the AdSense
    rejection-avoidance sequence, the code half of finding 19 risk 1.
    Verified against production first, not against this file's labels. The live
    home page loads the AdSense script and carries a valid `ads.txt` and a
    publisher id, but has no `__tcfapi` and no Google funding-choices message —
    so `adsbygoogle.js` was being served to every visitor, including in the EEA,
    with no certified consent message anywhere. Ad units do not render because
    slot ids are unset, which is what made this easy to mistake for harmless:
    loading the ad script is itself the third-party processing that needs asking
    about, with or without a unit on the page.
    Correction to an earlier reading in this session: an initial crawl reported
    no custom cookie banner in the HTML. That was wrong — `CookieConsent` is a
    client component and cannot appear in server-rendered markup. The two real
    findings, no certified CMP and no `__tcfapi`, stand.
    Change: `AdsenseLoader` gated on `googleCmpEnabled` rather than on the
    presence of a publisher id, and `AdSlot` given the same condition so slot ids
    alone can never draw a unit.
    Why the flag and not a client-side consent value, which is what the recorded
    sequence asked for: Google's own Privacy & messaging CMP is delivered *by*
    `adsbygoogle.js`. Putting that script behind our banner's answer would mean
    the certified message could never be shown, so the instruction as written
    only fits a third-party CMP. Gating on the flag gives the same protection in
    both phases — no ad script at all before the CMP is published, and after it
    is published the script loads server-side exactly as before while the CMP
    owns the consent conversation. The loader also stays a server component, so
    a reviewer still finds the ad code in the HTML.
    Verification: TypeScript clean; quality suite 46/46 including a new test that
    pins both gates, asserts the loader no longer gates on the publisher id
    alone, and holds the privacy page's TCF description in place.
    No commit, push or deployment.
    Owner action required, and it is the actual blocker now: publish a certified
    consent message in the AdSense account (Privacy & messaging → European
    regulations), then set `NEXT_PUBLIC_GOOGLE_CMP_ENABLED=true` in `.env.build`
    on the VPS. Until that happens this change means the site serves no ad script
    — which is the correct state, but it is a deliberate step backwards in
    appearance and should not be mistaken for a regression.
    After it is set, verify before moving to step 5: `__tcfapi` present, a TC
    string produced in an EEA session, ad requests differing between accept and
    reject, and the custom `CookieConsent` banner suppressing itself as
    `TrackingBoundary` already provides for.

  - `CLAUDE-LOGO-001`; owner: Claude; state: `Completed locally — not
    committed`; assigned by the owner 2026-07-20; starting
    commit `2342ed0`; scope: `scripts/fetch-brand-logo-licences.mjs` (new),
    `src/lib/wikidata-brand-logos.json`, `src/lib/brand-logos.ts`,
    `scripts/quality-regression.test.ts`. Task: finding 20, step 3 of the AdSense
    sequence.
    Done: every logo now records its Commons licence, licence id, uploader-stated
    author and source, and Commons' own `AttributionRequired` flag, fetched from
    the Commons API rather than inferred. 65 of 71 are `Public domain`, 5 are
    `CC BY-SA 4.0`, 1 is `Copyrighted free use`. A suite test pins the list of
    non-public-domain files, so a re-fetch that swaps a public-domain logo for a
    licensed one fails the build instead of shipping.
    Found while doing it, and it changes the fix: four of the six files are the
    brand's own mark with the brand's own site as the stated source — `escada`
    credited to "ESCADA press department", `kylie-cosmetics` to
    `www.kyliecosmetics.com`, `max-factor` to `maxfactor.com`, `kerastase` to a
    direct URL on `kerastase.ru`. An uploader who is not the rights holder cannot
    place a third party's logo under CC BY-SA, so those licence tags are
    doubtful. Adding the credit line those licences ask for would assert a
    licence chain we cannot stand behind, which is worse than the omission.
    Not a legal opinion. The practical reading is that our basis for showing a
    brand's mark is referential use of a trademark to identify the actual
    product, which needs no licence, and that the 65 `PD-textlogo` files are
    genuinely unencumbered because they sit below the threshold of originality.
    Owner's decision, 2026-07-20: remove the six and give every brand a tile.
    Done. The six entries are gone from the inventory and the six files deleted
    from `public/brand-logos/`, leaving 65 logos, all `Public domain`, and
    `logosRequiringAttribution()` returning empty.
    Tiles are now generated rather than enumerated. `brandTile(slug, name)`
    returns the curated `BRAND_TILES` entry where one exists and derives one
    otherwise: a label from the brand name — kept whole when it fits, initials
    when it does not — and a background chosen from a ten-colour palette by a
    stable hash of the slug, so a brand keeps its colour between deploys. The
    palette is dark enough for white text and muted enough that a directory of
    them reads as a grid rather than a colour chart.
    That removes the bare-initials-on-white branch from `BrandLogo` entirely.
    Coverage went from 63 logos + 20 tiles + 123 brands showing nothing designed,
    to 63 logos + 149 tiles, every brand covered.
    Label derivation is Unicode-aware. An ASCII-only strip turned "Clé de Peau
    Beauté" into words with holes in them; a tile reading "BEAUT " is worse than
    no tile.
    Declined, with reasons, and the owner accepted: sourcing licensed logos for
    the remaining brands. There is no licensed logo for a commercial brand in the
    sense meant — the Commons CC BY-SA tags are the doubtful artefact found
    above, and repeating the exercise across 141 more brands would multiply the
    exposure immediately before a policy review. Our own typography is the same
    visual outcome at no risk.
    Two existing assertions moved, both deliberately and both recorded here so
    the movement is not mistaken for drift. The logo-coverage floor went from 70
    to 65, because six were withdrawn on purpose and that check exists to catch a
    fetch silently losing files. The tile-label ceiling is 9 for generated labels
    and 12 for curated ones, because the curated set includes hand-set labels
    like "MAYBELLINE" that the wordmark SVG squeezes to fit.
    Verification: TypeScript clean; quality suite 48/48, including a new test
    that every brand resolves to a label and a background, that the generator is
    deterministic, and that nothing in the inventory ships under a licence
    requiring attribution.
    Not yet done: the six removed brands have not been looked at in a browser, so
    the tiles are verified by their values rather than by their appearance.

  - `CLAUDE-PERIOD-001`; owner: Claude; state: `Completed locally — not
    committed`; assigned by the owner 2026-07-20; starting commit `2342ed0`;
    scope: `src/lib/review-metrics.ts`, `src/app/[locale]/review/page.tsx`.
    Task: today / yesterday / 7 / 14 / 30-day views on the review dashboard.
    Shape: one selected window drives the whole page. Before this the tiles were
    pinned to seven days and the reports to `REPORT_DAYS` (30), so the two halves
    of the screen described different spans of time without saying so; the tables
    now read the same window as the tiles above them.
    The two calendar periods are calendar days in `REPORT_TIME_ZONE`, not rolling
    24-hour spans, so "today" agrees with the last column of the daily chart
    beside it. `startOfReportDay` derives the zone offset through `Intl` rather
    than assuming +03:00. Verified at the boundary: a row at 23:59 Istanbul lands
    in yesterday, one at 00:01 lands in today, matching `reportDay`.
    One correctness fix found while testing rather than after shipping. "Today"
    is a partial window, and comparing it against the equally long stretch ending
    at midnight measured this morning against yesterday *evening* — traffic has a
    daily rhythm, so that difference reads as a trend when it is only the time of
    day. The calendar periods now compare against the same clock hours a day
    earlier, which needed an upper bound on the comparison window; `trend` gained
    an optional `previousEnd` that defaults to the old behaviour, so the rolling
    periods are unchanged.
    The period travels in the URL and is carried by the tab links and by
    `keepFilters`, so switching tab or filter does not silently reset it, and a
    window can be bookmarked or sent to someone.
    Verification: TypeScript clean; quality suite 47/47. Window bounds and the
    same-clock comparison checked against fixed timestamps. Not yet rendered in a
    browser — the dashboard needs the `CF_ACCESS_*` environment to serve, so a
    visual pass is still outstanding.

  - Session handoff, 2026-07-21, Claude. Read this before picking up any of the
    open items below; several of them look tempting and are deliberately blocked.

    **Committed and deployed this day**, in order: `31765b8` deploy guard,
    `0de5cb8` six brand banners, `a9f8ed6` marked photograph replacement,
    `acc848a` and `4ae4f88` CMP/account records, `3a55004` AdSense loader
    strategy. Two production deploys ran and both were verified live.

    **Committed and NOT pushed**, seven commits: `7d5e330` search-data import,
    `23a9440` experiment release date, `192c036` Yandex importer fix, `a066eae`
    homepage metadata localization, `5f1b42d` Color Wow evidence, `76e93b7` Color
    Wow code image, and this record. Local gate on all of them: TypeScript clean,
    ESLint clean, four operational validators clean, production build 263 routes
    with no warnings. The owner has not yet said to push.

    **Known failing, and not caused by this work**: the quality suite is 76 pass
    / 2 fail. `every registered decoder has one exact known fixture` and `a code
    without the documented L'Oréal shape is not read confidently` both fail on a
    clean checkout of `aa2115a` as well — verified by stashing. The Jean Paul
    Gaultier decoder has no fixture. A red suite erodes the gate that caught two
    real defects today; it deserves fixing before it becomes background noise.

    **Three defects found today that were all invisible to their own tests**, and
    the pattern is worth more than the individual fixes. Each was a case of a
    file or a library being believed instead of measured.
    1. The CMP was absent because `AdsenseLoader` used `next/script` with
       `lazyOnload`, which injects after the load event, so the server HTML held
       no script tag at all — while the component's own comment explained why it
       must be in the server HTML. Fixed to `afterInteractive`.
    2. A deploy shipped with a blank publisher id, silently removing the loader,
       the publisher meta tag and the ads.txt line. Google crawled ads.txt inside
       that window and the account now reads "not found". `deploy.sh` now fails
       on a blank public identifier rather than shipping a hollow site.
    3. Three Yandex exports were recorded as empty. They held 589, 735 and 775
       rows; openpyxl in read-only mode believed a bogus `A1:A1` dimension. The
       repository stated "zero observations" as fact for two days.

    **Open, in the order I would take them.**
    - Barcode detection in the decoder. 24 of 228 failing checks are valid
      EAN-13/UPC-A — every 13-digit failure passed the checksum. Highest
      certainty-to-effort item on this list, and the marked photographs already
      show the barcode in red for exactly this confusion.
    - Eucerin. 19 of 27 checks fail. Successes are 8–9 digits, failures are 4–5
      digits and dotted lot strings like `99999.999.AA.99`.
    - The retired claims still live in seventeen locale catalogs. English was
      corrected for truthfulness; the translations were not. Dutch currently
      promises a `vervaldatum` the site cannot read and calls itself
      "nauwkeurig en betrouwbaar". This is an AdSense content requirement, not a
      polish item, and it is live in every language but English.
    - Dutch translation package: `~/Desktop/cosmeticsbatch-NL-ceviri-2026-07-21.txt`
      is with the owner. `meta.homeTitle` and `meta.homeDescription` exist in
      `messages/en.json` only; every other locale falls back to English until
      filled.

    **Blocked — do not touch, and here is why so nobody re-derives it.**
    - CMP. Site status is "getting ready" in AdSense; Google does not deliver the
      Funding Choices bundle to an unapproved site. Browser measurement confirmed
      `googlefc` and `__tcfapi` undefined while `adsbygoogle.js` loaded and ran.
      There is no repository defect left. Do not change code to chase it and do
      not re-request review.
    - Brand snippets. `SEO-BRAND-SNIPPET-2026-07-19-01` released 2026-07-19; the
      current export covers 2026-07-02–07-19, so it is essentially unmeasured.
      Editing those titles before a clean window destroys the experiment.
    - Color Wow. Five samples, a clean letter+YDDD+letter fit, no corroborating
      printed date, and all of them pre-acquisition packaging. Stays hidden.

    **Owner-side, and nothing here can proceed without them**: AdSense site
    approval, the 39-asset provenance audit, and removing the private screenshot
    from the Dior source folder.

  - Session handoff addendum, 2026-07-21 evening, Claude. The morning handoff
    above is still accurate; this records what happened after it and what is now
    waiting on the owner.

    **Deployed since**: `a066eae` homepage metadata localization and the seo.ts
    fix that made it actually work, the four i18n commits, the Color Wow evidence
    and image, the Yandex importer fix, and the search-data records. Three
    production deploys, each verified live.

    **The i18n result in one line**: the brand-detail gap manifest went from 481
    entries to 30, and the remaining 30 are all Indonesian — the one catalog the
    owner has not returned. Every other locale shows its own language where it
    used to hide the fragment or leak English.

    **A mistake worth keeping, because it nearly shipped twice.** The homepage
    title fix was verified against the English prerender and looked correct. It
    was not: `pageMeta` built the homepage title from `site.tagline` and ignored
    the title it was passed, so all eighteen locales still read English. English
    renders identically whether that bug is present or not, which is precisely
    why checking English proved nothing. The second attempt was verified against
    a running production server on `/nl`, `/ru`, `/ja` before deploying. When a
    fix is about locale-specific output, the default locale is not evidence.

    **Owner deliverables now on the Desktop**, all annotated, all with a
    verification pass waiting on return:
      - `cosmeticsbatch-DECODER-EKSIKLERI-2026-07-21.xlsx` — three sheets. A: 22
        brands whose decoder exists and fails on real user codes, Eucerin worst
        at 19 of 27. B: the 119 hidden brands grouped by parent, because one
        verified format unlocks a whole group — Kao has 8, Unilever 7, Kosé 6.
        C: 60 suggested new brands plus blank rows, with their parent group
        marked as needing packaging confirmation rather than trusted.
      - `cosmeticsbatch-DECODER-SAYFALARI-2026-07-21.xlsx` — 913 rows, the 83
        `dec.*` content strings missing in 11 locales. Dutch decoder pages
        currently carry English titles in search results; German does not.
    Both sheets lead with the same rule, because it is the one that keeps being
    relearned: a batch code without a printed date beside it cannot verify a
    format. Color Wow fit a Julian read four times out of four and was still not
    shipped.

    **Next disjoint task I would take**, unchanged from the morning: barcode
    detection in the decoder. 24 of 228 failing checks are valid EAN-13 or UPC-A,
    every 13-digit failure passes its checksum, and the marked photographs
    already show the barcode in red for exactly this confusion.

  - Deploy handoff, 2026-07-20, Claude to Codex. Seven claims are ready in the
    working tree and none is committed: `CLAUDE-JPG-001`, `CLAUDE-DIOR-001`,
    `CLAUDE-PERMISSIVE-001`, `CLAUDE-CMP-001`, `CLAUDE-LOGO-001`,
    `CLAUDE-PERIOD-001`, plus the finding records. 23 modified files and one new
    script, `scripts/fetch-brand-logo-licences.mjs`.
    Local gate before handoff: `next build` succeeds, TypeScript clean, ESLint
    clean, quality suite 48/48.

    **Ordering hazard — read before deploying.** `CLAUDE-CMP-001` moved the
    AdSense loader from "render whenever a publisher id exists" to "render only
    when `NEXT_PUBLIC_GOOGLE_CMP_ENABLED` is true". Production currently serves
    `adsbygoogle.js`; deploying this build without that variable set removes the
    ad script from the site entirely. The variable belongs in `.env.build` on the
    VPS and has to land with this deploy, not after it.
    The owner published the certified consent message in the AdSense account on
    2026-07-20, so the account side is ready and the flag can be set.

    Commit order matters as much: `CLAUDE-JPG-001` first, because the Dior and
    L'Oréal decoder work both depend on the `recognized` failure reason it adds
    and neither compiles without it.

    Post-deploy verification, all of it still outstanding and none of it possible
    from this machine:
      - `__tcfapi` present, and a TC string produced in an EEA session. A raw
        HTML fetch cannot answer this — the CMP is injected at runtime by
        `adsbygoogle.js` — and a request from Turkey is out of scope for the
        message, so it needs a browser on an EEA connection.
      - ad requests differing between accept and reject
      - the custom `CookieConsent` banner suppressing itself, which
        `TrackingBoundary` already provides for once the flag is true
      - the review dashboard's new period selector rendered in a browser; it
        needs `CF_ACCESS_*` to serve, so it has only been verified by its values
      - the six brands whose logos were withdrawn now showing a tile:
        escada, innisfree, kerastase, kylie-cosmetics, max-factor,
        roberto-cavalli

  - Packaging-image work, paused by the owner 2026-07-20. The owner will review
    the 46 assets and supply replacement photographs they took themselves, then
    the policy becomes one or two images per brand rather than three. No agent
    should start editing `data/evidence-inventory.json` or deleting assets until
    that review lands — the owner is doing it by hand and a concurrent pass would
    collide.
    Measured before the pause, so the review has numbers to work from:

        46 assets across 17 brands
        35 on monetized brand pages (13 brands)
        11 on brands that are neither indexed nor monetized —
           acqua-di-parma, aesop, anua, shiseido

    Those 11 are the clear case: they carry the same provenance exposure as the
    rest and return neither ad revenue nor search visibility. Deleting them is
    pure subtraction of risk and needs no photography to replace.
    Selection criterion worth keeping when the owner trims the other 13 brands to
    two each: keep any frame showing a batch code *and* a printed date on the
    same face. Those are what settled findings 27 and 34 — they are simultaneously
    the most useful image for a reader and our own verification ground.
    Status against the readiness doc: "Original/licensed media" stays a listed
    blocker while this is paused. Judged proportionately rather than treated as
    fatal — a reviewer is unlikely to reverse-search 46 packaging photographs, so
    the realistic exposure is a later complaint rather than a rejection. It
    should not hold the application, and it should not be forgotten either.
    Known bad input: at least one image supplied during the 2026-07-20 session
    was an eBay listing photograph — "ebay" is visible in the frame of the YSL
    All Hours shot — so the set demonstrably mixes owner photography with
    third-party listings. That is the whole reason the inventory records
    `sourceType` at all.
    Addition on 2026-07-21, made at the owner's explicit instruction and so not a
    breach of the pause: one owner photograph of a Jimmy Choo carton, marked by
    the owner in the established colours — orange on the batch code, red on the
    barcode and printed reference. Added as `/brands/examples/jimmy-choo-1.jpg`
    (1068x1086, 259 KB), `annotated: true`, re-encoded from HEIC so no EXIF or
    GPS survives; checked, and none does. It is worth having beyond decoration:
    this is the carton `AFR42R261` was read from, the long-form Inter Parfums
    code cited at `src/lib/decoder/decoders.ts:811` that the decoder recognises
    and deliberately refuses to date. The page shows the reader the exact code
    the honest refusal is about.
    Color Wow evidence, 2026-07-21, five owner photographs. Not a decoder — read
    the last paragraph before acting on the pattern.
    Codes collected: `B4002A` and `B4249A` (bottle bases), `B5069A` (foam pump
    base), `S4226` with a second group `07144` (tube crimp) and, on an aerosol
    base, a two-line `06:0?` over `21197`.
    Shape: four of the five are a letter, four digits and an optional trailing
    letter. Read as year-digit plus day-of-year they resolve cleanly and none
    lands in the future or past day 366 — `B4002A` 2 Jan 2024, `S4226` 13 Aug
    2024, `B4249A` 5 Sep 2024, `B5069A` 10 Mar 2025. Four for four is a good fit
    for a Julian read. The aerosol does not follow it and is probably a contract
    filler's own stamp; aerosols usually are.
    Two reasons this is not enough, and both are the reasons this file exists.
    First, nothing corroborates a single date. No sample carries a printed
    manufacture or expiry date beside the code, so the whole reading rests on the
    dates looking sensible — which is precisely how the Inter Parfums and Jean
    Paul Gaultier misreads happened. A plausible date is not a verified one.
    Second, and specific to this brand: every sample is Federici-era packaging.
    The table's own comment says not to assign a decoder until post-acquisition
    samples verify the format, and L'Oréal completed the acquisition in September
    2025. These describe what L'Oréal inherited, not what it prints. `B5069A` at
    March 2025 is the newest of them and still predates the deal.
    What would settle it: a Color Wow pack that prints a date next to the code,
    or any 2026 pack. Until then Color Wow stays in `HIDDEN_SLUGS` with no
    decoder. Yandex demand — 12 impressions, 3 clicks, position 2.67 — is a
    reason to want this finished, not a reason to publish a guess.
    Marked-photograph replacement, 2026-07-21, on the owner's instruction. Five
    owner photographs arrived named `<brand> bc.heic` — the "bc" is batch code,
    which is what the earlier request meant. Each was opened and looked at before
    use. All five follow the site's convention exactly: colour only, no words
    burned into the frame, orange on the batch code, red on the barcode and any
    printed reference. No personal content in any of them.
    They replace rather than extend, at the owner's direction: acqua-di-parma,
    aesop, escada, jean-paul-gaultier and lancome each drop from three unmarked
    images of unrecorded provenance to one marked owner photograph. Ten files
    were removed with `git rm`, so they remain recoverable from history. The
    evidence inventory falls from 48 records to 38, and the provenance-audit
    backlog shrinks by the same amount — this is the 46-asset blocker being
    worked down by replacement, which is what the owner said they would do.
    Codes visible, for anyone re-checking the marking later: escada `09C5`,
    acqua-di-parma `1494Y`, aesop `21M0923A`, jean-paul-gaultier `FAK08 X`,
    lancome `CL1F`. The Gaultier one is a pre-Puig code the decoder declines to
    date, kept deliberately for the same reason as the Jimmy Choo carton.
    Hero artwork delivery, 2026-07-21: six banners supplied by the owner and
    wired — chanel, cerave, creed, maybelline, mac-cosmetics, paco-rabanne. All
    arrived at 1774x887, the same spec as the existing set, re-encoded from PNG
    to JPEG at 192–367 KB (the inventory script fails above 700 KB). Each stands
    its products in the right-hand half, so `mobileFocalPosition` follows the
    products, 72–78% depending on where the group starts; desktop stays 50% 50%
    as everywhere else. Every target slug was checked as present and not in
    `HIDDEN_SLUGS` before wiring. Hero coverage moves 8/212 to 14/212.
    These are brand-page decoration, not evidence: they carry no batch code and
    are not inventory records. Their provenance is still worth recording when the
    owner does the asset audit, since they show trademarked packaging.
    Stop-the-line finding, 2026-07-21, while looking for further photographs to
    ingest from the owner's source folders. One file in the Dior source folder
    (`IMG_0308.PNG`, iCloud `Cosmetics batch/Dior/`) is not a product photograph
    at all. It is a phone screenshot of a private messaging conversation and it
    carries a named third party, their phone number, photographs of an
    identifiable person in a hospital bed, and information about a surgical
    procedure. Details are deliberately not reproduced here; the file reference
    is enough to find it. It must never be published, and it should be moved out
    of the source folder rather than left for the next pass to rediscover.
    Nothing was ingested from it and the working copy made while reviewing was
    deleted. The consequence is a rule, not just an incident: the source folders
    are camera-roll exports and mix packaging photography with private material,
    so no bulk or pattern-based ingest may ever run over them. Every candidate is
    opened and looked at before it becomes a public asset. This is what the
    inventory's `privacyReview` field is for, and it is now the reason it exists.
    Two further candidates were reviewed and rejected on convention, not privacy:
    `Dior/IMG_0306.heic` and `L’oreal Paris/IMG_0303.PNG` are genuine marked
    packaging shots, but both have English words burned into the frame ("Batch
    code", "EAN code"). `src/components/brand-code-gallery.tsx:72` is explicit
    that the colour key stays out of the picture precisely so one photograph can
    serve nineteen languages. The L'Oréal frame is worse than untranslatable: it
    boxes the EAN in orange and the batch code in red, the exact inverse of the
    published legend, so it would teach the reader the wrong number. Both need
    re-marking with colour only before they can be used.
    Found while doing it: the evidence inventory had drifted. `nivea-1` was added
    to `CODE_IMAGES` without regenerating `data/evidence-inventory.json`, so
    `pnpm test:quality` was failing on the committed tree at
    `validate-evidence-inventory.mjs`. Regenerated; the file now holds 48 records
    and validates. Both additions land as `needs-verification`, which is correct
    — the generator cannot know provenance, and the owner's review is what
    records it.

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
4. P1 English copy replaced localized privacy text
   (`Resolved — verified 2026-07-20 by Claude, label was stale`; regression
   from commit `40c9789`). Re-measured with the same method that settled it
   originally, counting distinct values per field across the 19 active
   locales: `brandFaq.a_free`, `homeFaq.a2` and `homeFaq.a10` each now carry
   18 distinct values and no locale holds the English string. The entry
   below describes the regression as it was found; it no longer describes
   the tree. This clears step 4 of the AdSense sequence.
   Original report: making the privacy claims truthful overwrote translated
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

20. P2 brand logo licence provenance is not recorded
    (`Completed locally — not committed` under `CLAUDE-LOGO-001`; licences
    recorded, the six doubtful files withdrawn, every brand now on a logo we
    can show is public domain or a tile of our own): 71 brand logos
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

**Sequence closed 2026-07-21.** Steps 1-4 are done and deployed. The owner
published the certified consent message, assigned to cosmeticsbatch.com across
32 languages, and — after the layout was found to be the two-option variant —
switched it to the three-option one carrying an explicit refusal.
That last change mattered for a reason worth keeping: our own privacy page
claims the message offers "consent, refusal, and per-vendor and per-purpose
choices". Under the two-option layout refusal was only reachable through Manage
options, so the page was overstating what the site did — a claim a reviewer can
check in one click, and the same class of defect this file spent two days
removing from the decoder.

Correction to my own reporting while this was open: I repeatedly stated the CMP
"was not loading" on the basis that `__tcfapi` did not appear in a headless DOM
dump. `__tcfapi` is a JavaScript global and cannot appear in serialized DOM, and
the message is scoped to the EEA, UK and Switzerland while the check ran from
Turkey. The measurement could not have shown what I said it showed. The account
screenshots settled it instead: the message was published and correctly assigned
throughout.

Still owner-side and unverifiable from here, listed so it is not mistaken for
done: Sites approval status, ads.txt "Authorized" state, Policy Center being
clear, identity and payment tasks, and a real EEA session confirming the message
renders with its refusal button. `NEXT_PUBLIC_ADSENSE_SLOT_*` stays unset until
approval, which is why no ad unit renders — deliberate, and the pre-approval
posture the components describe.

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
    one (`Completed locally — not committed` under `CLAUDE-PERMISSIVE-001`:
    `E38Y801N` does not carry the documented shape, so it now returns
    `recognized` instead of a dated, expired verdict). Seen in the owner dashboard's check log on
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

24. P1 the guides index was English in every locale (`Completed locally` under
    `ADSENSE-APPROVAL-016`; not committed). Found by the rendered crawl the
    AdSense readiness matrix calls for — 108 pages, 18 locales × 6 paths, live.

    `/[locale]/guides` rendered the raw `GUIDES` array: card titles, card
    descriptions, the `h1`, the breadcrumb and "N min read" were all hardcoded
    English on every localized URL. The translations already existed — the same
    guides render correctly on `/[locale]/guides/[slug]` and on brand pages, both
    of which call `localizeGuide`, and `/decoders` was already doing it properly.
    The index was simply skipped.

    Fixed by following the `/decoders` pattern: `contentTranslator` +
    `localizeGuide` for the cards, `nav.guides` for the heading and breadcrumb,
    `contentPages.minRead` for the read time. Verified live-equivalent locally —
    `/tr/guides` now reads "Kılavuzlar" / "Batch kodu Nedir?", `/ru/guides`
    "Гиды" / "Что такое батч-код?", `/fr/guides` "Qu'est-ce qu'un code de lot ?".
    French keeps "Guides" as its heading because that is the French word, not a
    fallback. 68/68 tests, TypeScript and ESLint clean.

    Left English deliberately, and recorded rather than invented: the page
    subtitle and the `pageMeta` title/description. Localizing them needs two new
    `contentPages` keys in 19 catalogs, and only `en` and `tr` have a speaker who
    can vouch. Adding them for two locales only would leave the other 17 falling
    back to English, which is the behaviour they already have — no regression
    either way, so it waits for a translator rather than being guessed.

25. P2 `brandPage.freshnessPara` is untranslated in `fr` and `pl` (`Next`). The
    string is byte-identical to English in exactly those two catalogs, so a
    French or Polish brand page prints "Once we read the manufacture date, we
    estimate freshness using ... typical ... shelf life for ..." mid-page. Found
    by comparing every long string against its English counterpart across all 18
    non-English catalogs: this is the only key affected, so the exposure is one
    sentence on two languages' brand pages rather than a systemic gap. Needs a
    French and a Polish speaker; not guessed here.

26. P1 Jean Paul Gaultier has a second code format we do not read
    (`Completed locally — not committed` under `CLAUDE-JPG-001`;
    found while auditing the packaging-evidence inventory under
    `ADSENSE-APPROVAL-016`). JPG is the site's worst decoder by volume — 49
    checks in the 2026-07-19 export, 35 of them returning nothing, and 11 more
    rows in the failed-code queue.

    The evidence was already in the repository. `public/brands/examples/
    jean-paul-gaultier-1.jpg` is our own verified example photo, published on
    the brand page under "where to find the batch code", and the code visible on
    that bottle base is `FAK08 X`. Running it through our own decoder returns
    nothing:

        FAK08 X    -> none        (our own published example)
        FAK08X     -> none
        TCR15X     -> none        (real user, 2026-07-19)
        TCR 15 X   -> none
        52911      -> 2025-10-18  medium
        60021      -> 2026-01-02  medium

    So JPG uses at least two schemes: a numeric one the `embedded` decoder
    reads, and an alphanumeric one — three letters, two digits, a separated
    trailing letter — that it does not. The users typing `TCR15X` and
    `SJP 041 COL K01` were almost certainly holding valid codes in the second
    format; the site told them their code could not be read.

    We are pointing at a code in a photograph and then failing to read it. That
    is worth fixing ahead of most of the dashboard backlog.

    Confirmed 2026-07-20 with five owner-supplied photographs of real JPG
    packaging. Every numeric code reads; every alphanumeric one fails:

        509811     -> 2025-04-08  medium   Le Male 100ml can base, clearly stamped
        401212     -> 2024-01-12  medium   can base, Japanese-market label
        13481      -> 2021-12-14  medium   Le Male 125ml bottle side
        52911      -> 2025-10-18  medium   real user, succeeded
        DGV 19TP   -> none                 Les Éditions Originales coffret
        FAK08 X    -> none                 our own published example photo
        TCR15X     -> none                 real user, failed

    So JPG stamps at least two schemes and the `embedded` decoder implements
    only the numeric one. Three independent alphanumeric samples now — a
    coffret, a bottle base and a user's code — share the shape "letters, two
    digits, a separated trailing letter". The users typing `TCR15X` and
    `SJP 041 COL K01` were not mistyping; they were holding the format we do not
    read, and the site told them their code was unreadable.
    I wrote here on 2026-07-19 that "all five cartons are Antonio Puig, S.A.
    (Barcelona) product, so this is not an old-versus-new manufacturer split."
    That was wrong, and it was wrong because five photographs happened to be
    Puig-era. Seven more arrived on 2026-07-20 and the split is exactly a
    manufacturer split — it is legible from the company name printed on the
    packaging:

        Beauté Prestige International   HLL05 V, KUU14 X, MWH10 S, QUF03CH,
                                        QOEC, FAK08 X, DGV 19TP, TCR15X   8/8 fail
        Antonio Puig, S.A. Barcelona    509811, 401212, 130711, 13481,
                                        52911                             5/5 read

    Thirteen samples, no overlap in either direction. The `embedded` decoder
    implements the Puig numeric scheme only, so every BPI-era item is turned
    away. That is an era of the brand's output rather than an edge case, and it
    accounts for the 71% no-read rate on its own.

    Seven of the eight alphanumeric codes share one shape: three letters, two
    digits, then a separated trailing letter or pair (`HLL05 V`, `KUU14 X`,
    `MWH10 S`, `FAK08 X`, `QUF03CH`, `TCR15X`, `DGV 19TP`). `QOEC` is the
    exception and sits on a gift-set carton, so it may be a set reference rather
    than a batch code — compare finding 29, where a product reference on a Chanel
    box decoded as a date.

    `needs verification`: what the alphanumeric encodes. None of the twelve
    photographs puts a printed date beside an alphanumeric code, and the two
    digits fit a year, a week or a day equally well — the observed values are
    03, 05, 08, 10, 14, 15, 19. Guessing from shape alone is how findings 21 and
    22 happened. One BPI-era item carrying both a code and a printed date would
    settle it, the way one Vichy carton settled finding 27.

    Shippable without that answer: recognise the shape and say so. "This is an
    older Jean Paul Gaultier code and we cannot date it yet" tells the user their
    code was real, which "unreadable" does not, and gives us a place to ask for
    the photograph that would close this out.

    A candidate rule, later the same day. raidersofthelostscent.blog publishes a
    JPG dating guide claiming the first letter is the fill year, valid only while
    the packaging carries the 75116 Paris address, with G and I unused:

        D 1998  E 1999  F 2000  H 2001  J 2002  K 2003  L 2004
        M 2005  N 2006  P 2007  Q 2008  R 2009  S 2010  T 2011
        U 2012  V 2013   ("and so on" — the table stops here)

    It also dates the addresses themselves: BPI 75008 Avenue Matignon 1993-1997,
    BPI 75116 Avenue Victor Hugo 1998-2015, Antonio Puig Barcelona 2016 onwards.

    That last part makes the claim testable against our own photographs, because
    every one of them shows an address. It holds five times with no contradiction:

        FAK08 X    B.P.I. 75116 Paris             F -> 2000   in-range
        HLL05 V    B.P.I. 75116 Paris             H -> 2001   in-range
        QUF03CH    28/32 Av. Victor Hugo 75116    Q -> 2008   in-range
        QOEC       75116 + "© BPI 2007" printed   Q -> 2008   copyright 2007 <= fill 2008
        KUU14 X    18 Av. Matignon 75008          table does not apply to 75008

    The `QOEC` line is the strongest: an independently printed year on the same
    carton, one below the decoded year, which is what a copyright date should be.
    The `KUU14 X` line matters as much in the other direction — applying the table
    anyway would have returned 2003 for a carton whose address was retired in
    1997, so the rule declines exactly where it should. `FAK08 X` is our own
    published example asset, so this also closes the embarrassment of failing to
    read the code in our own instructional photograph.

    Still not enough to ship as a decoder:
      - one external source, five confirmations, all from a single owner's shelf
      - the table stops at V/2013 and BPI ran to 2015, so U/V and whatever
        follows are unverified at the boundary
      - characters after the first letter are unexplained everywhere, so this
        yields a year and nothing finer, against `medium` month precision on the
        Puig side
      - the pre-1998 75008 era stays unreadable, and the same source calls
        1993-1999 codes "erratic" and "not so reliable"

    A year-only answer is still worth shipping if it is labelled as one. It turns
    the largest no-read population on the site into "made in 2008" instead of
    "unreadable", and `low` confidence already exists for exactly this.
    `needs verification`: two or three BPI-era items from outside this collection,
    ideally with a printed date or a known purchase year, before any of it is
    wired into `src/lib/decoder`. If we ship it, credit the source.

27. Evidence: a second decoder validation, from our own asset library
    (supports finding 21). `public/brands/examples/vichy-1.jpg` is an annotated
    instructional photo showing both a batch code and a printed date:
    `54YN00 11-2027`.

        decoder manufacture : 2024-11-15   (high confidence)
        recorded shelf life : 36 months
        our predicted date  : 2027-11
        printed on the box  : 11-2027      exact match

    Paired with the Dior carton in finding 21 this stops being one anecdote and
    becomes a mechanism. The L'Oréal decoder is right, and 36 months is right
    for a skincare-classified brand. The Dior foundation carton showed the same
    decoder right and the shelf life wrong — 60 months applied to a product the
    maker dates at about 35. The difference is not the decoder, it is that
    `shelfLifeMonths` is a brand constant applied to a product category, exactly
    as finding 21 argued. Finding 21's `needs verification` — "one carton, one
    brand" — is now partly closed: two brands, opposite outcomes, same cause.

28. P3 packaging-evidence inventory has a schema but no data (`Next`). Codex's
    `data/evidence-inventory.json` holds all 46 `CODE_IMAGES` records with the
    right fields — `sourceType`, `sourceReference`, `permissionStatus`,
    `privacyReview`, `decoderRelevance`, `reviewedByRole` — every one set to
    `needs-verification`. 35 of the 46 sit on monetized brand pages, which is
    why the AdSense readiness matrix calls this a blocker.
    Source and permission are owner knowledge and cannot be derived from the
    repository. What was checked here: a sample of three images across brands
    (`chanel-1`, `vichy-1`, `jean-paul-gaultier-1`) is clean product
    photography — no faces, hands, receipts, addresses or reflections. The
    printed manufacturer contact details visible on the Vichy carton are the
    maker's own public information, not personal data. This is a sample, not a
    clearance of all 46; the remaining 43 still need looking at before
    `privacyReview` can be set.
    Also noted: `Brand["codeImages"]` carries only `src`, `width` and `height` —
    there is no field for alt text, source or licence, so provenance has nowhere
    to live in the code even once it is known. The gallery generates a single
    generic alt string for every image.

29. P1 a printed product reference decodes as a date
    (`Completed locally — not committed` under `CLAUDE-PERMISSIVE-001`: the
    anchored `readEmbeddedDate` now declines `C03560099` and `C036400649`).
    Found while
    reading our own example photo `public/brands/examples/chanel-1.jpg`, which
    shows three numbers on a Chanel carton side: the EAN barcode
    `3145891071900`, a large printed `107.190`, and a small etched `2702`.
    `107.190` is the product reference — it is the barcode's own digits
    reformatted — and `2702` is the batch code.

        3145891071900  -> rejected as `barcode`   correct
        107.190        -> 2021-03-12  low         not a batch code at all
        2702           -> 2026-04-15  low         the real code

    The barcode guard works. The product reference has no guard: the decoder
    finds six digits and reads them as a date. It is the most prominent number
    on that face of the box — larger and higher-contrast than the etched batch
    code — so a user is more likely to type it than the code we actually want,
    and gets a plausible-looking date for a number that encodes nothing.

    This is the same failure shape as finding 22: the decoder answers where it
    should decline. It differs in that the input is not a mistyped code but a
    different number entirely, printed by the manufacturer beside the right one.

    Fix direction: the barcode checksum guard already proves the pattern works.
    A reference like `107.190` is recognisable — it is the EAN's trailing digits
    with separators — so a check against the product's own barcode, or simply
    declining a dotted six-digit group for a brand whose scheme is four digits,
    would close it. Chanel's documented code is four digits; accepting six is
    the decoder being more permissive than the format warrants.
    Current exposure, measured rather than assumed: none. All 47 Chanel checks
    in the 2026-07-19 export are four digits, plus one 13-digit entry that the
    barcode guard correctly refused. Nobody has typed the product reference yet.
    This is a latent defect, not an active harm — worth fixing because the
    misreadable number is the prominent one on the box, but it does not compete
    with findings 21, 22 or 26 for priority.

30. P2 a Puig code decodes to before its own packaging (`Needs verification`).
    `130711`, read off a perfumed body lotion carton in the 2026-07-20 batch,
    returns 2013-07-11. The same carton reads `MADE IN SPAIN - ©2017`. A design
    copyright of 2017 cannot appear on a carton filled in 2013, so either the
    reading is wrong or the six-digit path mis-seats the same way finding 22
    does.
    `needs verification`: the code sits small and low-contrast in the lower
    corner of the photograph and the leading `1` could be a stray mark or a `l`
    — confirm the digits against the physical carton before calling this a
    decoder defect. If they hold it belongs with findings 22 and 29 rather than
    standing alone.

31. P0 our decoders answer when they should decline, and it is measurable
    (`Completed locally — not committed` under `CLAUDE-PERMISSIVE-001`; junk
    dating 15% -> 10%, with the residue pinned by a suite ceiling).
    Found while testing whether an existing group decoder could cover a brand we
    do not yet carry. Feeding sixteen strings that are certainly not batch codes
    ("ABC123", "HELLO1", "000000", "TEST01" …) through all twenty decoders:

        320 attempts -> 49 returned a manufacture date (15%)

        loreal          10 / 16   63%
        interparfums     4 / 16
        pg, kenvue, unilever, coty, chanel, dior,
        naos, shiseido, embedded, jean-paul-gaultier   3 / 16 each
        julian           2 / 16
        kbeauty, rohto, deciem                         1 / 16 each

    `loreal` is the worst and also the most exposed: it is assigned to roughly 45
    of our 212 brands, more than any other decoder. A user who picks the wrong
    brand from the dropdown — or types a product reference instead of a batch
    code — gets a confident date rather than "we cannot read this".

    This is the shared root of findings 22, 29 and 30. Each was reported as a
    single bad code; they are one defect seen three times. The corroborating
    evidence is sharper still: a published Bvlgari code, `A31517B3`, is read by
    *five* unrelated decoders (dior, shiseido, coty, embedded and, differently,
    loreal) and four of them agree on 2023-05. Agreement between decoders that
    share no cipher is not confirmation, it is proof that all of them are
    pattern-matching loose digits.

    Fix direction: decoders should require the code to match the manufacturer's
    documented shape before extracting anything, rather than scanning for the
    first digit run that can be bent into a date. The barcode guard in
    `checkBatchCode` already shows the house style — reject on structure first.
    A regression test built from this junk list belongs with the fix, so the
    permissive behaviour cannot come back.

32. P2 external batch-code guides are not safe to adopt, and we now know why
    (`Recorded`).
    Requested on 2026-07-20: study raidersofthelostscent.blog to verify the
    brands we carry and to prepare the ones we do not. Two guides read in full.

    Hermès. The author states plainly: "This scheme is not certified by anyone;
    it is only the work of a genuine fragrance lover." Its 2000-onwards table
    uses a single year digit, so 0 is both 2000 and 2010 and 3 is both 2003 and
    2013 — the exact ambiguity behind finding 22 — and it stops at 2013, which
    is a decade short of the current production our users actually hold.

    Bvlgari. The pre-2010 rule reads `151` as November 2005 by taking the outer
    digits as the month and the middle as the year. It is self-consistent across
    the three published examples, but an interleaved M-Y-M encoding with no
    manufacturer source behind it reads like a pattern fitted to samples, and it
    carries the same single-digit-year ambiguity.

    Neither is shippable. Adopting them would multiply finding 31 across new
    brands, which is the opposite of what a checker is for.

    What the study did produce: finding 31, and the measurement behind it. The
    guides earn their place as an adversarial test set — codes with an
    independently published date that our decoders can be scored against — not
    as a source to import. That is the use to keep.
    `needs verification`: whether any brand we lack can instead be covered by a
    group decoder we already trust (Rochas and Guy Laroche to Inter Parfums,
    Serge Lutens to Shiseido, Bvlgari to LVMH are the plausible ones). The test
    above says do not assume it: every existing decoder that "read" a Bvlgari or
    Hermès sample got the year wrong. Ownership is a lead, not a format.

33. P3 a zero sitting where a L'Oréal month letter belongs (`Hypothesis — not
    implemented`). Raised by the owner asking for a YSL decoder. YSL Beauty is a
    L'Oréal house and already runs on the shared decoder; of its seven codes in
    the export, five decode and one, `38y01y9`, does not.
    The observation: a L'Oréal month is 1-9 or O/N/D, so a `0` in that position is
    never valid. Across the 123 distinct L'Oréal codes in the export, nine
    non-canonical codes hold a `0` exactly there — `40X02R1`, `23X00YE`,
    `40Z001`, `38Y01Y9`, `54X000`, `44Y001`, `2A001`, `26A001`, `26A026` — and
    reading it as the letter O (October) makes all nine canonical.
    Why it is recorded and not built: this is the second time this question has
    been opened. A related claim, that O/0 confusion was a homoglyph bug, was
    made and then retracted earlier in this project precisely because `O` already
    means October, so a blanket 0-to-O mapping in `canonicalCode` would corrupt
    real digits. A position-specific reading is a different proposal and is not
    refuted by that retraction, but nine codes with no verified date behind any of
    them is a pattern, not evidence.
    `needs verification`: two or three of those nine products photographed with a
    printed date, or with a purchase year the owner can vouch for. If October
    holds, this is a real decode. If it does not, we have re-run a retracted claim
    on a larger sample and should stop asking.
    Until then these nine come back `recognized` under `CLAUDE-PERMISSIVE-001`,
    which is the correct answer for a code whose shape we can see and whose date
    we cannot justify.

34. P1 finding 21 is now proven, with the brand's own printed dates
    (`Needs a fix — evidence complete`). The owner photographed four Yves Saint
    Laurent items on 2026-07-20, three of which carry the batch code and a
    printed expiry on the same face:

        (L)40NN00   we read 2014-11   EXP 11/18   48 months   B20 Ivory
        (L)40W100   we read 2022-01   EXP 01/25   36 months   All Hours BD40
        (L)40X710   we read 2023-07   EXP 07/25   24 months   All Hours DN5
        (L)40XN01   we read 2023-11   EXP 11/25   24 months   All Hours DW6
         40U803     we read 2021-08   no EXP visible          All Hours MN4
         38WN01A    we read 2022-11   no EXP visible          Libre Le Parfum

    A fourth item arrived after the first three and changed the reading. The
    spread does not track the product, it tracks the production year:

        2014 -> 48 months     2022 -> 36 months     2023 -> 24 months

    BD40, DN5 and DW6 are all All Hours foundation. BD40 is a 2022 fill and
    carries 36 months; DN5 and DW6 are 2023 fills and both carry 24. Same
    product line, different year, different labelled life — so this is not a
    per-product figure we are missing, it is a figure that changed.

    Two conclusions, and the second is the one that matters.

    The L'Oréal year-letter table is confirmed, twice over. Every gap to the
    printed expiry is an exact multiple of twelve months, which a decoder reading
    the wrong letter would not produce — misread letters give gaps like 29 or 41.
    Stronger still, `40X710` and `40XN01` share the year letter X but not the
    month, July against November, and both land on exactly 24 months. Two codes
    with the same letter agreeing to the month is internal consistency the
    decoder could not fake. This is the independent validation finding 27 asked
    for, on the decoder that carries more brands than any other.

    Shelf life is not a brand constant, we are wrong in the dangerous direction,
    and we are wrong on exactly the stock most people are holding.
    `ysl-beauty` carries `shelfLifeMonths: 36` for everything it sells. Current
    YSL production prints 24. For DN5 we would tell a user the foundation is good
    until 2026-07 when YSL printed 2025-07 on the bottle — a product called fine a
    year after its own manufacturer declared it finished, and the same for DW6.
    The 2014 item errs the other way and only costs a year of usable life.
    That the error falls on the newest fills is what makes this P1 rather than a
    tidy-up: a checker that is most wrong about the freshest stock is wrong about
    the majority of what it is asked.

    This closes the evidence question in finding 21 — that entry proposed the
    same cause from a single Dior carton and could not rule out a decoder fault.
    It can now: the decoder is right and the shelf-life constant is wrong.

    Fix direction: `shelfLifeMonths` has to stop being a brand-level number.
    The honest intermediate step, and the cheap one, is to stop presenting a
    computed expiry as fact when we have no product-level figure — say the
    typical range for the category and point the user at the printed date on
    their own pack, which these photographs show is usually right there beside
    the code. A per-product table is the real fix and needs a data source we do
    not yet have.
    `needs verification`: nothing for the finding itself — four printed dates
    against four decoded ones settle it. What is not settled is the shape of the
    fix. Three production years with 1, 1 and 2 samples is enough to prove the
    brand constant wrong and not enough to replace it with a year-indexed table.
    The 2023 figure is the sound one, holding across two items; 2014 and 2022 are
    single points. Before shipping any default, check whether the same decline
    appears on a second L'Oréal brand — Lancôme or Vichy — which would separate a
    YSL labelling change from a group-wide one.

35. P3 YSL has a third era, and its packaging references sit next to the code
    (`Partly completed locally — not committed` under `CLAUDE-PERMISSIVE-001`).
    The same 2026-07-20 photograph set includes vintage Yves Saint Laurent
    Parfums stock — the Neuilly Cedex and "Parfums Corp, Paris / New York"
    branding that predates the L'Oréal-era packaging. Those carry codes we do not
    read: `7CAA` (`unresolved`) and `Z5 178` (`recognized`, correctly, since it
    satisfies the L'Oréal shape without being placeable). So YSL splits by era
    the way Jean Paul Gaultier does in finding 26, and the modern half is the
    half we handle.
    Not worth a decoder on this evidence: two codes, no printed dates, and the
    audience for vintage YSL is collectors rather than the people checking
    whether their foundation is still good.
    What did need fixing: those cartons print `EMB 60350`, a French packager
    registration, in the address block within a centimetre of the batch code. It
    is the more official-looking of the two, and `EMB60350` happens to satisfy
    the L'Oréal letter-then-month shape, so before `CLAUDE-PERMISSIVE-001` it
    decoded to a date — the same failure shape as finding 29. After that change
    it came back `recognized`, which is better but still told the user it looked
    like a L'Oréal code when it is an address line.
    Now handled by `addressLookalikeHint`, alongside the Paris postcode rule that
    was already there for the same reason: an `EMB` followed by digits gets told
    what it actually is and where to look instead. Verified on `EMB 60350`,
    `EMB60350` and lowercase input; `40W100`, a bare `EMB` and a bare `60350` are
    untouched. The other references on these cartons (`05015`, `50158`, `60350`)
    already returned no date, and the EAN is caught by the barcode guard.

36. P2 the guides section earns impressions and no clicks at all
    (`Next`). From the Search Console export the owner supplied on 2026-07-20,
    covering the site's whole indexed surface: 464 URLs, 4,801 impressions, 96
    clicks.

        section          impressions  clicks     CTR
        brands  active          2448      55   2.25%
        brands  retired          178      10   5.62%
        guides  active           282       0   0.00%
        guides  retired          519       0   0.00%
        other   active          1076      30   2.79%
        other   retired          298       1   0.34%

    Guides take 801 impressions across 90 URLs and convert none of them, at an
    impression-weighted average position of 62.7. The first read — that this was
    an artefact of retired locales — is wrong: the active-locale guides return
    zero clicks on their own 282 impressions. Nothing is broken; they simply rank
    far enough down that nobody sees them. Position, not title or snippet, is the
    thing to fix, and it is an SEO problem rather than a defect.

    Not a defect either, but worth knowing: 995 of the 4,801 impressions — 21% —
    point at retired-locale URLs (`/ca/`, `/sr/`, `/ro/`, `/ms/`, `/az/`, `/cs/`,
    `/tl/`, `/bg/`). Every one of them was checked live and returns 308, so the
    redirects are correct and Google is simply slow to drop them. The practical
    consequence is that our real reach is about 79% of what the export shows, and
    any rate computed from the raw total is optimistic.

    The category's own head terms are where we are weakest:

        batch code           34 impressions   position 42
        batch code checker   22               43
        batch code check     14               44
        perfume batch code   14               48
        batch number         23               81

    These name the product and we sit on results page four to six for them, while
    brand pages do well — `/brands/vichy` at 7.4, `/bg/brands/vichy` at 5.9,
    `/sr/brands/dove` at 3.8. The site ranks for brands and not for what it is.

    One asymmetry worth investigating separately: mobile sits at position 10.7
    with 3.84% CTR on 1,977 impressions, desktop at 35.6 with 0.74% on 2,437.
    Desktop draws more impressions and ranks far worse, which most likely means
    the two surfaces are being shown for different queries — desktop for the head
    terms above, mobile for brand long-tail — rather than that anything is wrong
    with the desktop page.

    Reading for AdSense, since that is the current goal: none of this blocks it.
    The 35 monetized brand pages are both the best-ranking and the best-converting
    part of the site. The weak section carries no ad code at all.
    The second file supplied alongside this one turned out to be a Yandex
    Webmaster export and is analysed in finding 37.

37. P2 Yandex is where the site actually ranks, and it converts badly anyway
    (`Next`). The owner supplied a Yandex Webmaster query export alongside the
    Search Console one on 2026-07-20 — 714 query/URL rows with per-day shows,
    position, demand, CTR and clicks over fourteen days. It was initially
    unreadable because the file uses inline strings rather than a shared-string
    table; the earlier note in finding 36 that it could not be interpreted is
    superseded.

        Yandex    1,012 shows     91 clicks    ~9.0% CTR
        Google    4,801 shows     96 clicks     ~2.0% CTR

    A quarter of the impressions produce the same number of clicks. The reason is
    position: on Yandex the site sits inside the top ten for its own commercial
    terms — `проверить батч код` at 5.5 against a demand of 51, `проверка по
    батч коду` at 6.5, `проверить по батч коду косметику` at 6.0 — while Google
    has the English equivalents at 42 to 62 (finding 36).

    The problem on Yandex is therefore the opposite one, and it is the more
    tractable of the two. Several queries rank well and convert nothing:

        colour wow пробить срок                 position 2.6   0 clicks
        проверка по батч коду                   position 6.5   0 clicks
        проверить по батч коду косметику        position 6.0   0 clicks
        лореаль париж трайпл актив ...          position 6.6   0 clicks
        anua проверить подлинность              position 5.5   0 clicks

    Ranking third and getting no clicks is not a ranking defect. It points at the
    title and description the searcher actually reads, in Russian, on pages that
    are already winning the position. That is a snippet problem on a surface
    where we have already done the hard part.

    Russian brand pages carry the traffic — `/ru/brands/loreal-paris` 68 shows,
    `/ru/brands/vichy` 58, `/ru/brands/estee-lauder` 58, `/ru/brands/loreal` 45,
    `/ru/brands/garnier` 44 — so the affected snippets are a short, identifiable
    list rather than a site-wide rewrite.

    `needs verification`: whether the Russian titles and descriptions on those
    pages are genuinely weak or whether Yandex simply reports clicks
    conservatively at this volume. Fourteen days and single-digit click counts is
    thin evidence for a rewrite, and the same numbers would look different across
    a month. Measure before editing — the snippet budgets and `brandSnippet` are
    already in place, so a change here is cheap to make and hard to attribute.

    Worth noting for prioritisation: this is the same conclusion finding 36
    reached from the other direction. The site ranks for brands, in Russian, and
    does not rank for what it is, in English. Both exports agree on that.

38. P1 brands that print a readable date were failing silently
    (`Completed locally — not committed` under `CLAUDE-PRINTSDATE-001`). Found by
    re-running every logged check through the post-deploy engine to see where
    decoding is still weakest:

        overall            443 checks   179 no-read   40.4%
        skin1004            18          18           100%
        beauty-of-joseon     5           5           100%
        tom-ford-beauty      7           7           100%
        jean-paul-gaultier  60          46            77%
        eucerin              9           6            67%
        dove                 8           5            63%

    Two of the three brands at 100% are not decoder gaps at all. `skin1004` and
    `beauty-of-joseon` already carry `printsDate: true`, as do 41 of the 46
    brands on the K-beauty decoder: they print the manufacture and expiry date in
    plain text rather than encoding one. The brand page says so. The failure
    result did not, so a user who typed the batch code was told it was unreadable
    and left with nothing, while the answer was printed on the carton in front of
    them.
    Nothing to decode here, and that is the point — the honest response was
    already in our data and simply never reached the moment of failure.
    Fix: `printsDateHint` renders above the address hint on the failure card, in
    English and Turkish, describing what to look for and that Korean and Japanese
    packs often carry two dates side by side.
    Measured against the logged history: 29 of 203 no-reads (14%) now receive a
    usable answer instead of a dead end, across skin1004, beauty-of-joseon,
    numbuzin, missha and anua.
    Verification: quality suite 49/49, including a test that the flagged brands
    produce the hint in both locales, that date-encoding brands do not, and that
    the card renders it ahead of the address hint.
    Still open and genuinely decoder-shaped: `tom-ford-beauty` at 7/7,
    `jean-paul-gaultier` at 77% (the BPI half is recognised but undated),
    `eucerin` at 67%, `dove` at 63% — the last of which shows `24WNOO` and
    `24WN00` from the same user, the O-versus-zero confusion recorded in finding
    33 appearing on a second decoder.
    A live check arrived during this work that belongs with them: OXY `V08Q88S`,
    twice from Germany. OXY runs the `rohto` decoder and is *not* flagged
    `printsDate`, while its sibling Rohto brands `hada-labo` and `melano-cc` are.
    Whether that flag is missing or correctly absent needs a photograph, not a

39. P2 our unread codes are unread everywhere, and Eucerin's format is not what
    we think (`Hypothesis — deliberately not implemented`). The owner checked the
    thirty codes we cannot read against CheckFresh, by hand, on 2026-07-20.
    CheckFresh reads none of them either — not `F16C27`, not `FB024`, not
    `SJP 041 COL K01`, not `V08Q88S`. One exception: Eucerin `63944`, which it
    dates to 2016-09-21 with the note that batch codes repeat every ten years.

    The reassuring half: these are genuinely undocumented formats rather than a
    weakness particular to us. An established competitor with far more history
    fails on the same inputs.

    The Eucerin case, and why it is not being acted on. Our own Beiersdorf rule
    would read `63944` the same way — first digit the year, next two the week, so
    6 -> 2016 and week 39 -> late September, which matches. It fails only because
    the decoder requires six digits and this is five.
    Loosening to five was measured rather than assumed: it gains two real checks
    and admits two junk strings (`12345`, `M12345`) that currently produce
    nothing. Two-for-two, which is the same trade declined for the L'Oréal
    factory prefix under `CLAUDE-PERMISSIVE-001`, and here it is worse — there
    the two real codes came from users, while here there is no evidence at all
    that 2016-09 is the right answer. CheckFresh agreeing is a second guess, not
    a verification; finding 31 measured exactly this, where five unrelated
    decoders agreed on the same wrong date for one Bvlgari code.

    The finding worth keeping is the one underneath it. Of eleven Eucerin codes
    users have brought us, only one matches the eight-digit shape we document:

        4 digits   5 checks   0003, 0516
        5 digits   2          63944
        8 digits   1          44736976
        9 digits   3          139602005

    Either users are typing something other than the batch code, or Beiersdorf
    prints more than one format and our explanation covers a single case. That is
    the question to answer, and widening a length guard would paper over it.
    `needs verification`: two or three Eucerin or NIVEA packs photographed with
    the batch code and any printed date. Beiersdorf is a large group — the same
    decoder carries NIVEA and Labello — so getting this right is worth more than
    the eleven checks suggest.

    Answered from the live log the same afternoon, and it exposed a defect my own
    finding 31 work had missed. A session from Bulgaria on 2026-07-20 worked
    through eight strings off one Eucerin pack over fourteen minutes:

        MEGA               refused
        D-20245 / D20245   refused
        87997              refused
        AE.04              refused
        87997.000.AE.04    refused
        87997000AE04       refused
        139602005          decoded 2021-09-24, EXPIRED

    The first seven are the product name and article references — dotted groups
    like `87997.000.AE.04` are how Beiersdorf writes an article number — which is
    what someone types when they cannot find the batch code. Refusing them is
    right. The eighth is nine digits against a documented six-to-eight, and the
    decoder's unanchored `\d{6,}` took it anyway, reading the first digit as a
    year and the next two as a week. We told a real person their product expired
    five years ago on a string that is almost certainly not a batch code.

    Same defect class as findings 22 and 29, and my own miss: `readEmbeddedDate`
    was anchored under `CLAUDE-PERMISSIVE-001` and `loreal` was tightened, but
    `beiersdorf` used the identical loose scan and was not touched. Anchored now
    to `^(\d{6,8})(?:[A-Z]{2})?$`.
    Measured before changing: anchoring costs exactly one historic read across
    the whole log, and that read is `139602005` — the wrong answer above. Junk
    dating is unaffected at zero for this decoder. A regression test pins the
    eight strings from this session.
    The wider question was answered by photograph the same afternoon, and the
    answer is that the decoder is right. A Eucerin 30 ml carton (EAN
    4005800241901) carries `51826188` above `EXP: 05/2028`. Our Beiersdorf rule
    reads it as 2025, week 18 — 2025-04-30 — which is exactly 36 months before
    the printed expiry. That is the first printed-date verification this decoder
    has ever had, and it passes.
    So the eleven-codes-one-shape observation was a user-input problem, not a
    format problem: people were typing article references, and the anchored match
    now refuses them. `printsDate` is not needed for Eucerin.

40. P1 shelf life is not a brand constant on Beiersdorf either, and the decoder
    is verified (`Needs a fix — evidence complete`).
    Correction first, because I got the brand wrong. An earlier revision of this
    entry attributed five photographed cartons to CeraVe, reasoning from the UPC
    prefix `072140`. That prefix belongs to Beiersdorf's US operation, not
    CeraVe, and the owner confirmed every carton is Eucerin. The CeraVe
    two-format argument built on that mistake is withdrawn in full; nothing in it
    survives.

    Read correctly, all five are Eucerin and all five decode:

        43844057   we read 2024-09   printed EXP 2026-08   23 months
        51341357   we read 2025-03   printed EXP 2027-03   24 months
        51826188   we read 2025-04   printed EXP 2028-05   37 months
        53346476   we read 2025-08   no expiry visible
        44657957   we read 2024-11   no expiry visible

    Two conclusions, and both matter.

    The Beiersdorf decoder is verified. Three printed expiries, three clean
    reads, and the year-digit-plus-week rule places every one of them sensibly.
    This decoder carries NIVEA and Labello as well as Eucerin, and it had no
    printed-date verification at all before today.

    Shelf life varies within the brand, and we overstate it. `eucerin` carries
    `shelfLifeMonths: 36`. These three real products are 23, 24 and 37 months, so
    for two of them we tell a user the product is good roughly a year after
    Beiersdorf printed otherwise.

    That is the confirmation finding 34 asked for. It wanted the 24/36/48 spread
    checked against a second brand before any category default shipped; here it
    is, on a different manufacturing group entirely. The conclusion generalises:
    a single `shelfLifeMonths` per brand cannot be right, and the error falls in
    the dangerous direction on the shorter-lived products.
    `needs verification`: none for the finding. What is still unsettled is the
    shape of the fix, which finding 34 already records — a per-product figure
    needs a data source we do not have, and the honest interim is to stop
    presenting a computed expiry as fact when the pack carries a printed one.

41. P1 the L'Oréal decoder is now evidenced across brands, and CeraVe does not
    fit it (`Profile promoted; CeraVe open`). The owner photographed Garnier,
    Kiehl's and CeraVe packs on 2026-07-20 and asked that they be treated as
    confirmed L'Oréal at high confidence. Measured rather than assumed:

        garnier  28ZN14   -> 2025-11  high        canonical shape
        kiehls   18WD00   -> 2022-12  high        canonical shape
        kiehls   18X400   -> 2023-04  high        canonical shape
        cerave   SDX80W   -> recognized, no date
        cerave   482309   -> unresolved
        cerave   2022202  -> unresolved

    Garnier and Kiehl's earn it. Both carry the documented factory-digits,
    year-letter, month-character shape, both read at `high`, and both land on
    plausible recent dates — a wrong year table shows up as 2005 or a future
    date, which is how finding 22 was caught.

    A distinction worth keeping, because the record would otherwise overstate
    itself: none of these three cartons carries a printed expiry, so they verify
    that the shape reads across brands, not that the year arithmetic is right.
    The arithmetic was verified separately by finding 34, where four YSL cartons
    each carried a code beside a printed expiry and every gap came out an exact
    multiple of twelve months across four different year letters. Dates from YSL,
    coverage from Garnier and Kiehl's. Together they are the strongest evidence
    any decoder here has.
    `loreal` accordingly moves from UNKNOWN to HIGH_CONFIDENCE, with the owner as
    the reviewing party the profile header requires. Not VERIFIED: the
    photographs live in a chat session rather than in this repository, so a later
    reader still cannot check the claim.

    CeraVe is the exception and it is a real one this time — not the brand
    mis-attribution withdrawn in finding 40. Three photographed CeraVe codes
    fail: `SDX80W` leads with letters, `482309` and `2022202` carry none at all.
    Yet `44Z302` and `54X9BV` appear six times in the log and decode correctly.
    So CeraVe has at least two coding systems in circulation and we read one.
    `needs verification`: a CeraVe carton with a non-canonical code above a
    printed expiry. Reassigning the brand is not the answer — it would trade six
    working reads for three — and `SDX80W` returning `recognized` rather than a
    guess is the correct behaviour meanwhile.
    Plausible background, not evidence: CeraVe belonged to Valeant until L'Oréal
    bought it in 2017, which would explain two systems coexisting on shelves.

42. P2 the Coty decoder now has packaging evidence, and pre-2005 stock does not
    fit it (`Profile promoted; era gap open`). Four Calvin Klein bottles
    photographed 2026-07-20:

        4186   -> 2024-07-04  medium   code identical on bottle and box
        3053   -> 2023-02-22  medium   code identical on bottle and box
        8022   -> 2018-01-22  medium   from the line "A8 0237802816 8022"
        0931   -> unresolved           code identical on bottle and box

    Three read cleanly under the documented YDDD shape and land on plausible
    dates. That the code is printed identically on bottle and box is itself
    corroboration that it is the batch code rather than a reference.
    `coty` moves from UNKNOWN to ESTIMATED. The owner, holding the bottles,
    confirmed those three dates as correct and accepted `0931` returning an
    error, so this is a check on the arithmetic and not only on the shape — the
    distinction drawn in finding 41. It stops at ESTIMATED rather than going
    higher because owner recognition is weaker evidence than a printed expiry on
    the pack, which is what took `loreal` further.
    This matters more than four bottles suggest: `coty` carries 39 brands, more
    than any decoder except `loreal`, and 37 of them had never been checked by a
    user at all.

    `0931` is the interesting failure. Day 931 does not exist, so YDDD cannot be
    right — but the code is on both bottle and box, so it is the batch code. The
    carton reads "Calvin Klein Cosmetics Co.", not Coty, and Coty did not acquire
    the CK fragrance licence until 2005. So this is pre-Coty stock carrying an
    earlier scheme, the same era split found on Jean Paul Gaultier in finding 26.
    Deliberately not guessed at, and the owner agreed an error is the right
    outcome for it. `0931` read as year 09, week 31 would give August 2009 and
    fit a CK Be bottle, and that is exactly the kind of single-sample reasoning
    findings 39 and 31 exist to prevent. No code change: `unresolved` is already
    what it returns.
    `needs verification`: two or three more pre-2005 Calvin Klein or other
    Coty-era bottles, ideally with a printed date, before the older format is
    anything but a note.

    The owner raised a second explanation on 2026-07-20: the bottle may be
    counterfeit. It is plausible — CK Be is among the most copied fragrances, and
    a copier prints the same code on bottle and box, so the bottle/box agreement
    that corroborates the other three codes proves nothing here.
    It is also indistinguishable from the first explanation. Pre-2005 stock
    legitimately carries a scheme we do not read, and nothing available to us
    separates "old genuine" from "fake". Recorded as a hypothesis with no way to
    test it.

    It must not become a user-facing claim, and this is the entry to point at
    when that is proposed again. The site already states that a code decoding
    cleanly is not proof of authenticity; the converse has to hold or the claim
    is incoherent. A failure to decode is a statement about our coverage, not
    about the product — Jean Paul Gaultier proved that today, where 46 unread
    codes turned out to be an entire genuine production era we simply did not
    support (finding 26).
    Telling a user their product may be counterfeit because our decoder is
    incomplete would bill our own gap to them, and would be a claim we could not
    stand behind if they acted on it. The existing `unresolved` copy — "this does
    not mean the product or code is invalid" — stays correct and stays.

43. P1 the brand-to-decoder map is an ownership assumption, not a verified fact
    (`Next`). Asked directly by the owner on 2026-07-20 whether the brand
    groupings are right. They are assumptions, and two of them were undermined by
    evidence the same day.

    Every brand is assigned a decoder by who owns it. Corporate ownership is not
    the same as shared manufacturing, and a code format follows the filling line,
    not the logo. Where those diverge the map is wrong and nothing currently
    detects it.

    Visible weak points, worst first:

    `kbeauty`, 46 brands across 29 unrelated companies — Amorepacific, LG H&H,
    COSRX, Beauty of Joseon, Anua, Purito and twenty-odd others. This is not a
    manufacturing group, it is a region. What those brands actually share is that
    they print a readable date, which is the absence of a cipher rather than a
    common one. Finding 38 already acts on that for the failure message; the
    grouping itself remains unexamined.

    `coty`, 39 brands, mostly licensed fragrance houses — Calvin Klein, Hugo
    Boss, Gucci, Burberry, Chloé, Davidoff. Licences move between owners, so a
    bottle's code follows whoever filled it, not the brand on the front. Finding
    42 caught this on Calvin Klein: a pre-2005 bottle carries "Calvin Klein
    Cosmetics Co." and a scheme the Coty decoder cannot read.

    `loreal`, 38 brands including CeraVe, whose photographed codes do not fit the
    L'Oréal shape at all — finding 41.

    `estee-lauder`, 19 brands, with `tom-ford-beauty` failing 7 of 7 and
    `mac-cosmetics` 5 of 6. Two brands failing that completely inside one group is
    the shape of a wrong assignment rather than bad luck.

    `kenvue` lists RoC Skincare, which was divested and is not Kenvue.

    What this is not: a reason to unpick the map now. It has been right far more
    often than wrong — `loreal` reached HIGH_CONFIDENCE across YSL, Garnier and
    Kiehl's, and `beiersdorf` across three Eucerin cartons — and guessing at
    re-assignments would repeat the mistake in the other direction.
    `needs verification`, in priority order, and all of it photographic: an
    Estée Lauder or Clinique pack to test the largest unevidenced group; a Tom
    Ford Beauty or MAC pack to test whether those two belong in it; any two
    unrelated K-beauty brands to see whether `kbeauty` describes anything at all.
    Worth adding to the decoder profiles when touched: the brand list a decoder
    covers is itself a claim, and none of the profiles records how it was
    arrived at.

44. P1 the Unilever decoder reads Dove codes about three years early
    (`Needs a fix — one printed date, wants two more`). Four Dove packs
    photographed 2026-07-20, all carrying the same nine-character shape — five
    digits, two letters, two digits:

        12174 AX 58    EXP 12-2026 printed on the can
        11165 XU 02
        02112 ET 82
        05041 JU 35

    What we do now, and why it cannot be right. The `unilever` decoder reads
    these as a year digit plus Julian day and returns 2021-08-05 for the first.
    The same can prints EXP 12-2026, which would make the shelf life 64 months.
    A deodorant is not labelled five years out. We do not need the correct rule
    to know the current one is wrong here.
    It also fails outright on `05041JU35`, so three of four get a wrong date and
    the fourth gets none.

    A reading that fits all four: the leading five digits as MMDD plus a year
    digit.

        12174 -> 2024-12-17    24 months to the printed EXP 12-2026
        11165 -> 2025-11-16
        02112 -> 2022-02-11
        05041 -> 2021-05-04

    Every one is a valid calendar date, the trailing letters and digits fall out
    as plant and line, and the single checkable case lands on exactly 24 months.

    Not implemented on this evidence. One printed date is what the third-party
    rule in finding 39 had before packaging demolished it, and MMDD is
    permissive — any four digits with a month under 13 and a day under 32 will
    satisfy it.
    `needs verification`: two more Unilever packs with a code and a printed
    expiry, ideally not Dove, since this decoder also carries Vaseline, Axe,
    Rexona, Sunsilk, TRESemmé, Simple, Pond's, St. Ives and Nexxus.
    The asymmetry is different from earlier findings and worth stating: here we
    ship a confident wrong date rather than declining, so this is finding 22's
    failure shape on a decoder covering ten brands, and it should be treated as
    more urgent than a no-read.
    Also seen: `24WN00` still returns nothing, and the same user typed `24WNOO`
    with letter O — the confusion recorded in finding 33, now on a third

45. P1 the Estée Lauder decoder is right, and I looked at the wrong number
    (`Profile promoted`). Nine Clinique foundation cartons photographed
    2026-07-20. My first reading took `7KXC-14` from the label — the most
    prominent code on the pack — and reported that the decoder could not read it
    and that the largest unevidenced group therefore looked broken.
    Wrong. The owner marked the actual batch code, stamped on the carton itself
    rather than the label, and every one decodes:

        A24 -> 2024-02      A93 -> 2023-09
        A15 -> 2025-01      A54 -> 2024-05

    Plant A throughout, one product family, dates spread across 2023-2025, which
    is what a production run should look like. `7KXC-nn` is a product reference
    and is correctly refused — the trailing number tracks the shade, and the
    barcodes differ between cartons that share it.

    `estee-lauder` moves from UNKNOWN to ESTIMATED. It covers 19 brands and had
    no packaging evidence at all before this. Not higher: no carton carries a
    printed expiry, so this evidences the shape and not the arithmetic — the
    distinction from finding 41.

    Worth keeping for its own sake: I made exactly the mistake our users make.
    The batch code is the least prominent marking on that carton, and the
    reference next to the barcode looks far more like an identifier. That is why
    `clinique` shows 4 of 5 logged checks failing, mostly on barcodes and
    references. The fix is not decoder work — it is telling people where to look,
    which is what the annotated NIVEA image now does on that brand page.
    Clinique is the strongest candidate for the same treatment, and the owner has
    already marked a photograph for it.

46. P2 an Inter Parfums bottle we cannot read, and a date we cannot check
    (`Hypothesis — not implemented`). Photographed 2026-07-21: an Inter Parfums
    Paris bottle, made in France, stamped `AFS02R303C`. Our `interparfums`
    decoder returns `unresolved` — it expects a leading year letter and a
    trailing three-digit day, and this code has three letters up front.

    The owner supplied a production date of 2021-10-23 with it. Recorded, not
    adopted, for two reasons that are worth stating plainly because they are the
    same two applied to competitors' answers all through this file.
    The bottle carries no printed date. Every date accepted as evidence so far
    either sat on the pack beside the code (Eucerin, YSL, NIVEA) or was confirmed
    by the owner holding the product against our output (Calvin Klein). Neither
    applies here.
    And the arithmetic does not land. If `303` is a day of year, 2021 day 303 is
    30 October, not 23 October — 23 October is day 296. So whatever produced
    2021-10-23, it is not the reading the digits most obviously suggest, and
    adopting the date without knowing the rule would mean encoding a result we
    cannot reproduce.

    `needs verification`: an Inter Parfums pack carrying this code shape *and* a
    printed date, or the source of the 2021-10-23 figure. The decoder covers 12
    brands — Montblanc, Jimmy Choo, Coach, Van Cleef & Arpels and others — and 11
    of them have never been checked by a user, so getting the shape right here is
    worth more than one bottle suggests.

47. P1 the review lists showed two periods at once (`Completed locally — not
    committed`). Reported by the owner on 2026-07-21: the dashboard seems to mix
    time zones, and the list does not restart after midnight.

    Not a time-zone fault. Every timestamp on the page renders in
    `REPORT_TIME_ZONE`, and `startOfReportDay` buckets correctly — that part was
    verified at the boundary when it was written. The defect is mine, introduced
    with the period picker under `CLAUDE-PERIOD-001` the day before.

    The dashboard deliberately fetches two periods deep, because the trend arrows
    need a baseline to compare against: `windowReport = win.previousStart`. I
    pointed the aggregate reports at `checksWindow` but left six places reading
    the raw `checks` and `failedCodes` arrays. Those show both periods.
    So selecting "Today" listed yesterday's checks underneath today's, and the
    log appeared never to restart at midnight — exactly what was reported.
    On the 7-day default it silently showed 14 days, which is why this went
    unnoticed: the numbers looked plausible, just wrong.

    Six leaks closed, all pointed at the window: the code-checks table, the
    failed-code list and its heading count, the brand and country filter options
    (which offered brands the window did not contain, so a pick returned nothing),
    and the attempt-count badge (which counted attempts outside the period it was
    displayed in).
    `decoderHealthTrend` still reads the raw array, correctly and deliberately —
    it is the one function whose job is to compare the two periods.
    A suite test now pins all six, and names the exception, so the next person to
    add a list to this page cannot repeat it.

48. P2 users copy the printed "LOT" label into the box, and we punished them for
    it (`Completed locally — not committed`). From the 2026-07-21 export, a
    CeraVe user typed `LOT54Z82X` and then `LOT 54Z82X`. Both returned nothing.
    `54Z82X` alone decodes to 2025-08.
    The pack prints `LOT 54Z82X`, so the user copied the line exactly as it
    appears. Six checks lost to a label.
    `clean()` now strips a leading LOT / BATCH / BN / CHARGE.
    The remainder has to contain a digit, and that condition was added after the
    first version turned "LOTUS" into "US" — stripping three letters out of a
    word that merely begins with them. Batch codes carry digits; a purely
    alphabetic tail means the guess about where the label ended was wrong.
    Junk dating is unchanged at 33/320, and `LOTUS`, `LOTION` and a bare `LOT`
    keep every character.

49. P2 the letter O typed for a zero, now measured (`Next`; extends finding 33).
    The same export shows two more codes that decode if the O is read as a zero:

        chanel  44O2  ->  4402  =  2019-09
        dior    6AO1  ->  6A01  =  2026-01

    With the earlier `24WNOO` on Dove and `17OS` on Acqua di Parma, that is four
    brands and four decoders. Four checks across the whole log, so the volume is
    small and the direction is clear.
    Still not implemented, and the reason has not changed since finding 33: `O`
    is October in the L'Oréal month position, so a blanket substitution corrupts
    real codes. What is now worth building instead is a *fallback* — try the
    substitution only after the code has already failed, and only when the
    original produced no date at all. That cannot corrupt a working read.
    `needs verification`: run that fallback against the junk benchmark before
    shipping it. The measurement above only tried the substitution on codes that
    already failed, which is the safe case, but the ceiling test is what decides
    whether it stays safe.

50. Evidence: what the 19-21 July traffic says. 278 checks over three days, 53%
    of them still unread through the current engine. The failures cluster:

        eucerin              34   69767.000.AE.11, D-20245, MEGA
        dior                 14   913M, 3348901729307, 38A101V
        chanel               12   44O2, 3145891263206
        loreal-paris          9   E38Y801N, 361427, 221301
        cerave                8   48A024, LOT54Z82X
        jean-paul-gaultier    8   FAK08 X, TCR15X

    Eucerin is the largest and confirms finding 39 rather than contradicting it:
    `69767.000.AE.11` is another dotted article reference, the same shape as
    `87997.000.AE.04`. People cannot find the batch code on that pack, so they
    type the most official-looking number instead. This is an instruction problem
    and the annotated NIVEA image is the fix — the same Beiersdorf decoder, the
    same packaging family.
    Thirteen brands were checked for the first time in this window, including
    Garnier and Kiehl's, which had been verified from packaging the day before.
    A Cyrillic М appeared in `913М` alongside the Latin `913M` from the same
    user; `canonicalCode` already folds it, so both reach the decoder identically
    and both fail for an unrelated reason. The homoglyph handling works.

51. P1 Inter Parfums bottles were being dated 2011, and our own sample with them
    (`Completed locally — not committed`). Six Jimmy Choo and related bottles
    photographed 2026-07-21, plus three codes from real user checks, give nine
    real Inter Parfums codes. Eight share one shape:

        AFR42R261   ADR20R091   AFS07S005   AER44R276
        CES07R363   AFS02R303C  08N46N257A  08L22L069B

    Two characters, a letter, two digits, that same letter again, three digits,
    sometimes a trailing letter. None of them matches the short year-letter plus
    day-of-year form this decoder documents.

    They decoded anyway, because the match was unanchored: `c.match(/[A-Z]/)`
    took the first letter found anywhere in the string and `c.slice(-3)` took the
    last three characters as a day. `AFR42R261` and `ADR20R091` came back as 2011
    — the year our table gives a leading A — on bottles whose packaging carries
    current FSC marks. `AFS07S005` and `AER44R276`, from real users, did the
    same.

    Worse, our own published example was one of them. Montblanc and Dunhill both
    ship `08J38J169` as the worked sample on their brand pages, and it was
    resolving to a 2019 date we had no basis for. That is the Jean Paul Gaultier
    situation from finding 26 repeated: the code in our own instructional
    material was being read wrongly.

    Fixed the way finding 26 was. The long form is now recognised and
    deliberately left undated; the documented short form is anchored to
    `^[A-Z]\d{3,4}$` so a letter sitting inside another shape no longer starts a
    read. Junk dating across the engine falls from 33/320 to 29/320 and the suite
    ceiling moves with it.

    Consequence worth surfacing rather than burying: Montblanc and Dunhill are
    indexed and monetized, and their pages now demonstrate recognition instead of
    a decode. Honest, but a weak result for someone arriving from search. The
    suite records them as a named exception so this cannot spread quietly.
    `needs verification`: one Inter Parfums pack with a long-form code and a
    printed date. The decoder carries 12 brands — Montblanc, Jimmy Choo, Coach,
    Van Cleef & Arpels, Boucheron, Karl Lagerfeld and others — and this is the
    single piece of evidence that would turn recognition into a read.
    This also supersedes the open question in finding 46: `AFS02R303C` is not an
    oddity, it is the normal shape, and the 2021-10-23 date offered for it
    remains unverifiable.

52. P1 three brands are on the wrong decoder, checked against the manufacturer's
    own list (`Next` — evidence complete, action deliberately withheld).
    The owner supplied Inter Parfums' published brand list from
    interparfumsinc.com on 2026-07-21. It is the authoritative answer to the
    question finding 43 raised, and our map disagrees with it in three places:

        dunhill           we assign interparfums   NOT on their list   INDEXED
        roberto-cavalli   we assign coty           on their list       INDEXED
        lacoste           we assign coty           on their list

    Eleven of our twelve Inter Parfums brands are confirmed correct. Dunhill is
    the one we invented, and it is indexed, monetized, and was added to the
    sample-code exception list under finding 51 an hour before this was found —
    so it is currently presenting a recognition result from a decoder whose
    manufacturer does not make it.

    Not reassigning any of them yet, and the reason is the era problem this file
    has now hit three times. Licences move: finding 42 found a pre-2005 Calvin
    Klein bottle that Coty's scheme cannot read because Coty did not hold the
    licence when it was filled, and finding 26 found the same split on Jean Paul
    Gaultier. A bottle's code follows whoever filled it, not whoever holds the
    name today. So a current brand list tells us where to look, not what a
    given bottle carries — and moving Roberto Cavalli to `interparfums` could
    break correct reads on older stock.
    Nor do we know who makes Dunhill fragrances now. Moving it somewhere on the
    strength of knowing it is not Inter Parfums would replace one guess with
    another.

    `needs verification`, and it is cheap: one Roberto Cavalli or Lacoste bottle
    photographed, and one Dunhill. If a Cavalli code carries the Inter Parfums
    long-form shape from finding 51, that settles it for that era in one image.
    Recorded here rather than acted on because the owner has been supplying
    exactly these photographs faster than the questions can be written down.
    decoder.

    Beauty of Joseon, and the reason not to copy a competitor's answer. Two
    third-party checkers were run against our three logged BoJ codes on
    2026-07-20. One (nanamall.com) returned all three; the implied rule was
    recovered from its own output:

        FB024   digits 0[2]4   ->  month 2, year 4  ->  2024-02
        FC121   digits 1[2]1   ->  month 2, year 1  ->  2021-02
        CK267   digits 2[6]7   ->  month 6, year 7  ->  2027-06

    Middle digit month, last digit year, and the letters ignored entirely. Three
    for three, which is what makes it worth writing down — and three failures
    at once:
      - Two of five characters play no part. `FB`, `FC` and `CK` contribute
        nothing. Something that discards the letters is extracting digits, not
        reading a code.
      - `CK267` resolves to 2027-06, eleven months from now. The tool prints
        "AGE: -11 months" and labels it VALID in green.
      - A second checker dated `FB024` to 2024-02 while the first said 2026-02.
        The single-digit year is ambiguous and the tool's own footnote says so.

    This is the defect class removed from our engine earlier the same day —
    finding 22's `E38Y801N` -> 2005 expired, finding 29's product reference, the
    permissiveness measured in finding 31. Returning `unresolved` for these codes
    is the better answer than a fabricated 2027, and Beauty of Joseon carries
    `printsDate: true`, so under finding 38 the user is now told where the real
    date is printed instead.
    Recorded as the settled answer to a question that has come up three times
    today: no competitor output is adopted without physical evidence behind it.
    Comparison remains useful for finding our own bugs — it is how
    `CLAUDE-DIOR-001` was confirmed — and useless as a source of truth.

    Settled with physical evidence the same day. The owner photographed five
    Beauty of Joseon packs, each carrying its lot code and a printed expiry on
    the same face:

        EL014    EXP 2028-12-15
        OI293    EXP 2027-09-26
        P0652    EXP 2028-02-23
        P0656    EXP 2028-08-05
        240275   EXP 2026-05-18

    Applying the third-party rule recovered above to these real codes and
    measuring the gap to the printed expiry — K-beauty runs about 36 months
    unopened — falsifies it outright:

        EL014    rule says 2024-01  ->  59 months to expiry
        OI293    rule says 2023-09  ->  48
        P0652    rule says 2022-05  ->  69
        240275   rule says 2025-07  ->  10
        P0656    rule says 2026-05  ->  27   (the only survivable one)

    Four of five are impossible. The tool is not reading these codes, and we now
    know that from packaging rather than from suspicion.

    The answer is printed on the box. One carton states `LOT/EXP ON THE PRODUCT`
    and then prints `LOT/EXP 240275` above `EXP 2026/05/18`. Beauty of Joseon
    puts the expiry in plain text beside the lot number, which is exactly what
    `printsDate: true` records and what finding 38 now surfaces at the moment a
    check fails. There is no decoder to write here, and writing one would mean
    inventing what the manufacturer already prints.
    Finding 38's fix is therefore verified against packaging, not just against
    logs: the hint sends the user to a date that demonstrably exists on the pack.
    The codes do carry structure, and the full set of ten photographs makes it
    partly legible. On the `[letter][letter][digits]` shape the second letter
    tracks the printed expiry month exactly:

        EL014   L -> 12   printed EXP 2028-12-15
        OI293   I ->  9   printed EXP 2027-09-26
        FC144   C ->  3   printed EXP 2029-03-19

    and the first letter behaves like a year — E for 2028, F for 2029, which are
    consecutive letters for consecutive years. Two things spoil it: `O` would
    have to be 2027, which breaks the sequence (the photograph is ambiguous
    between `O` and a zero), and `BQA` carries three letters and no digits, where
    Q would be a seventeenth month.
    Deliberately not implemented, for two reasons. Three samples is the same
    evidence base the competitor built its broken rule on, and being right about
    three cases is how that rule looked plausible until it met printed dates.
    More decisively, it would buy nothing: Beauty of Joseon prints the expiry in
    plain text, the user can already read it, and finding 38 now points them at
    it. A decoder here adds only a way to be wrong.
    One cross-check worth keeping: our logs contain `FC121` and the photographs
    contain `FC144`. Under this pattern both expire in March 2029 as separate
    lots. The third-party tool dated `FC121` to a 2021 manufacture — eight years
    adrift.
    `needs verification`: five or six more `[letter][letter][digits]` codes with
    printed expiries, including at least one where the first letter is neither E
    nor F, before this is anything more than a note. It is recorded so the next
    agent does not re-derive it from scratch, not because it is ready.
    guess.

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

## Image search as a traffic source — preparation note, 2026-07-21

The owner wants Google Images to become a source of visitors. This is the
measurement of where the site stands before any work starts, so a later claim of
improvement has something to compare against.

Current position, measured not assumed:

- 141 image files ship in `public/`. 39 of them are the marked packaging
  photographs and brand heroes added on 2026-07-21.
- Alt text exists but is generic and, on the most valuable images, English-only.
  `src/components/brand-code-gallery.tsx:61` renders `Where to find the batch
  code on {brandName} packaging` for every frame in the gallery, so three
  photographs of different faces of a pack share one description. The homepage
  hero passes `alt=""`, correctly, because it is decorative.
- No `ImageObject` structured data anywhere, and the sitemap carries no image
  extension. Google is given no relationship between a photograph and the page
  that explains it.
- `robots.txt` does not block Googlebot-Image, so nothing is being suppressed.
- Filenames are slug-based (`vichy-1.jpg`, `jimmy-choo-1.jpg`). Readable, but
  they describe the brand rather than what the picture shows.

Why this is worth doing at all, and the honest case against rushing it: the
marked photographs are genuinely rare content. A search for where a batch code
sits on a specific pack has almost no good answer online, and we now own colour-
marked originals for nineteen brands. That is a real asset. But image traffic
converts worse than text traffic almost everywhere, and the site's measured
problem today is that pages which already rank do not earn the click. Image work
should not jump the queue ahead of the barcode detection or the Eucerin gap.

Ordered by effect per unit of work, when it is picked up:

1. Alt text that describes the individual photograph rather than the brand, and
   that is translated. The gallery already knows which image is which — index
   and `annotated` are both available at the call site.
2. `ImageObject` on brand pages linking each photograph to its page, plus the
   caption already rendered as the colour legend.
3. Image entries in the sitemap for the marked photographs only. Hero artwork is
   decoration and should stay out.
4. Filenames that say what the photograph shows rather than only the brand.
   Cheap for new files, a redirect problem for existing ones — do it going
   forward, not retroactively.

Not recommended: generating alt text mechanically from the brand name, which is
what produced the current duplicate strings.

## Barcode detection was already built — correction, 2026-07-21

I proposed barcode detection as the highest certainty-to-effort item on the open
list, twice. It already exists and works. `src/lib/decoder/index.ts:81` carries a
UPC-A/EAN-13/GTIN-14 checksum, line 103 combines it with a 12–14 digit shape
test, and a match short-circuits every decoder and returns
`failureReason: "barcode"` with copy that names the barcode and points at the
separate stamp. Probed directly with four of the codes from the export —
`5060150182242`, `8028713822469`, `3386460119276`, `071249938010` — all four
return `barcode`.

The claim came from the check dataset, which logs `confidence` but not
`failureReason`, so a handled barcode and an unhandled decoder gap look
identical in it. They are not identical: a second stream, `logFailedCode` in
`src/lib/dataset.ts:114`, records the reason per brand, and the review export
already serves it as `failed`. That is the file to read before proposing decoder
work — not the checks export.

Corrected figures: of 653 checks, 228 returned no date. 28 of those are retail
barcodes already answered correctly. The real decoder gap is **200**, not 228.

Same shape as the other three corrections today: a conclusion drawn from data
without reading the code that produces it.

## Brands that print the date — what is actually missing, 2026-07-21

The owner asked for high-traffic Korean brands where the batch code carries no
date. They are already here: 59 brands carry `printsDate`, and
`printsDateHint` in `src/lib/result-failure-copy.ts:137` tells the reader to look
for a printed MFD/EXP instead of apologising for an unreadable code. Skin1004,
Torriden, Anua, Beauty of Joseon, COSRX, Missha and Numbuzin account for 36
logged checks and 35 non-decodes, which is the expected and correct outcome.

Two real gaps behind that, neither of them a decoder:

1. **The hint is English and Turkish only.** `printsDateHint` and the rest of
   `result-failure-copy.ts` hold eleven strings in a hardcoded two-language
   object — four failure reasons with a title and body, plus three lookalike
   hints. Seventeen locales read them in English, and these are the strings a
   person sees at the exact moment the tool failed them. They belong in
   `messages/*.json` where the translation loop can reach them; today they sit
   outside it, which is why they were missed by every pass.
2. **Sixteen `printsDate` brands are in `HIDDEN_SLUGS`** — A-Derma, Avène,
   Bifesta, Curél, d'Alba, DHC, Dr. Hauschka, Ducray, Embryolisse, FANCL,
   Institut Esthederm, Klorane, René Furterer, rom&nd, Uriage, Weleda. The
   staging rule is "hidden until a verified decoder exists", but for a brand that
   prints the date in plain text there is no decoder to verify and never will be.
   The complete answer already exists and is being withheld by a rule written for
   a different case. Worth an owner decision rather than a silent change.
