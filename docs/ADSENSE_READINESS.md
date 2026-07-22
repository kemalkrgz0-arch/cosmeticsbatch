# AdSense acceptance readiness — updated 2026-07-22

State: **not ready to resubmit: repository CMP controls are ready, but Google's
live certified message is not currently observable even with the force-display
URL, and account review evidence is missing**. No person or technical checklist can
guarantee AdSense acceptance; Google reviews the entire site and the account.
This document separates repository evidence from account/production evidence.

## Current decision

Do not request review until every `BLOCKER` below is closed with dated evidence.
Google says review normally takes a few days and can take 2–4 weeks. Repeatedly
submitting an unfinished site does not replace fixing the underlying issue.

## Mandatory blockers

| Requirement | Current evidence | State | Closure evidence |
| --- | --- | --- | --- |
| Certified consent for EEA/UK/Switzerland | Two clean headless-Chrome runs on 2026-07-22 used `/?fc=alwaysshow&fctype=gdpr`; the AdSense loader and an ad request ran, but no Google CMP surface, `__tcfapi`, TC string or GDPR consent parameter was observable. Owner evidence now confirms the `cosmetics batch` message is assigned to this exact domain, published, modified 2026-07-22 and configured for 32 languages, but its dashboard still reports zero displays. | **BLOCKER: live delivery/configuration/propagation plus regional proof** | Inspect the published message's privacy URL, site selection, three choices and revocation setup; allow documented propagation if applicable; then require the forced URL and a clean EEA/UK/Swiss session to expose `__tcfapi`, a TCF v2.3 string, accept/reject/manage and request differences. |
| No competing consent UI | `NEXT_PUBLIC_GOOGLE_CMP_ENABLED=true` suppresses the custom banner. A Turkey DOM check found no competing surface. Production validation now rejects a monetized build unless this flag and the full public stack are valid. | **Repository control complete; regional smoke pending** | Confirm exactly one consent UI when Google delivers the message. |
| Consent revocation | Google’s message should add its required “Privacy and cookie settings” revocation entry. | **BLOCKER / account-side** | Reopen the message from the live footer/privacy control and change a prior decision. |
| Site/account connection | Publisher meta and AdSense loader support exist; repository cannot read the account. | **BLOCKER / account-side** | AdSense Sites shows the exact domain connected and “Ready”; no connection issue. |
| `ads.txt` authorization | `/ads.txt` is generated from the configured publisher id and returns 204 when unconfigured. | **BLOCKER / production/account-side** | Live root returns the exact AdSense-provided line and Sites shows ads.txt “Authorized”. |
| Policy Center | No account access. | **BLOCKER / account-side** | Dated screenshot showing no unresolved policy issue or restriction requiring action. |
| Identity/payment eligibility | Age, duplicate-account, identity, address, tax and payment tasks are not repository facts. | **BLOCKER / owner account** | Applicant is at least 18, controls the site/source, and all AdSense account tasks are complete. |
| Original/licensed media | The deterministic inventory has 46 active public packaging/code assets; 39 still require provenance review. | **BLOCKER** | Audit each unresolved inventory record; replace, remove or document permission and reviewer/date. |
| Mixed-language pages | A measured 30 English-only brand-detail keys were missing from every non-English catalog. UI gating now prevents those fragments from appearing inside localized detail blocks; native review is still incomplete. | **BLOCKER until rendered crawl + editorial sample passes** | Crawl all 19 locales for English fallback and review the six investment languages plus high-impression pages. |
| Production UX/CWV | Local build and accessibility controls pass, but real 390px/iOS/Android and ad-loaded CWV were not measured. | **BLOCKER before ad activation** | Mobile screenshots/device checks and field/lab LCP, CLS and INP by home/brand/guide; checker remains usable. |

## Repository controls already implemented

- Ad units render only on English inventory with explicit editorial/content
  gates. Functional tools, private review pages and non-English pages carry no
  AdSense loader or units. Google may still inspect the entire domain.
- Ads sit between publisher-content sections, never inside the checker input or
  private communication, and reserve height to limit layout shift.
- No copy asks users to click, view or refresh ads. Units use the unambiguous
  “Advertisement” accessible label.
- No product URL expansion was introduced. Navigation, About, Contact, Privacy
  and Terms are reachable without interacting with an ad.
- Privacy disclosure now states that third parties may use cookies, web beacons,
  IP addresses or identifiers due to ad serving and links to Google’s partner-
  data explanation. It no longer points at an unverified `privacy@` mailbox.
- A build-time CMP flag is separate from the publisher id, preventing “AdSense
  configured” from being mistaken for “certified CMP verified”.
- `scripts/validate-build-env.sh` makes production fail closed when the release
  requires monetization but the publisher id, CMP flag, GA or Yandex id is blank
  or malformed. An explicitly ad-free build remains available through
  `REQUIRE_MONETIZATION_STACK=false`.
- Search/experiment systems prohibit fabricated production results; current RPM
  and revenue remain unavailable rather than recorded as zero.

## Content and inventory review

Google requires original, useful publisher-content, clear navigation and more
publisher-content than advertising. For this site that means a generic checker
template is not enough. Before review:

1. Keep ads limited to the strongest English home, verified-decoder brand and
   reviewed long-form guide/decoder pages.
2. Manually sample every monetized URL for a working checker, meaningful unique
   explanation, limitations, navigation and no unsupported authenticity,
   safety, manufacturer-expiry or certainty claim.
3. Resolve the remaining 39 records in the 46-asset provenance inventory.
   Repository presence is not copyright permission.
4. Finish the rendered SEO crawl: 206 sitemap URLs previously had no broken
   canonical/hreflang/link failure, but 64 title/description budget violations
   were found and are being corrected by the shared snippet boundary.
5. Keep ad count below publisher-content and away from buttons, photo selection,
   menus and other high-touch mobile controls.

## Account-side runbook

1. In AdSense **Privacy & messaging**, create a European regulations message
   for `cosmeticsbatch.com`, use three choices (do not consent, consent, manage
   options), confirm the privacy-policy URL, select/disclose ad partners, enable
   Consent Mode integration if appropriate, publish, and retain evidence.
2. Test `/?fc=alwaysshow&fctype=gdpr` in a clean browser. If it still shows no
   message, do not request review: reopen the exact domain's published message,
   confirm the site assignment and republish it. Then verify accept, reject,
   manage vendors/purposes and later revocation; confirm TCF v2.3 signals and
   that refusal does not break navigation or the checker.
3. Only then set `NEXT_PUBLIC_GOOGLE_CMP_ENABLED=true`, rebuild and verify the
   custom banner no longer competes with Google’s certified message.
4. In **Sites**, connect the exact apex domain, verify the publisher code is on
   a regularly viewed English page and publish the exact Google-provided
   `ads.txt` line at the root.
5. Complete identity, address, phone, tax and payment tasks that the account
   requests; confirm there is no duplicate AdSense account.
6. Inspect Policy Center. Resolve every issue before requesting review.
7. Do not click live ads, ask anyone to click, buy traffic, use click exchanges,
   auto-refresh pages, or run automated tools that interact with ad links.
8. Request review once. Record request date, Sites status and every later Google
   message without overwriting the baseline.

## Official Google evidence

- Eligibility, original content and age: https://support.google.com/adsense/answer/9724
- Site readiness, unique content and navigation: https://support.google.com/adsense/answer/7299563
- Connect a site and review timing: https://support.google.com/adsense/answer/7584263
- Publisher policies, inventory value and privacy disclosures: https://support.google.com/adsense/answer/10502938
- AdSense program/ad-placement behavior: https://support.google.com/adsense/answer/48182
- Supported content languages: https://support.google.com/adsense/answer/9727
- Certified CMP requirement: https://support.google.com/adsense/answer/13554116
- TCF integration and v2.3: https://support.google.com/adsense/answer/9804260
- Google European regulations messages: https://support.google.com/adsense/answer/10961068
- Consent revocation: https://support.google.com/adsense/answer/10959060
- Site and ads.txt status: https://support.google.com/adsense/answer/12170222
- Invalid traffic: https://support.google.com/adsense/answer/16737

## Approval statement

The highest honest target is “all known repository blockers closed and every
account/production check evidenced.” Approval remains Google’s decision. Do not
write “100% guaranteed”, “Google approved” or “ready” until the account itself
shows the corresponding state.
