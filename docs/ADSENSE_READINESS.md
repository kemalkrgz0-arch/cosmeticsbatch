# AdSense readiness audit — 2026-07-19

State: **blocked before application**. This is a technical/policy readiness
audit, not legal advice and not proof of account approval.

## Passed locally

- Ad code is limited to reviewed/monetizable pages rather than every generated
  brand route; private review routes exclude tracking and advertising.
- Ad containers reserve height and sit between content sections, protecting CLS
  and the primary checker flow.
- `/ads.txt` derives the publisher ID from configured AdSense client data and
  returns no misleading entry when unconfigured.
- Navigation, privacy/contact pages, cautious claims, brand-specific editorial
  gates and existing-URL SEO controls are present.
- Experiment controls require conversion/CWV guardrails and prevent declaring
  unreleased ad/SEO work successful.

## Blocking CMP/consent issue

`CookieConsent` identifies itself as “No third-party CMP”. It sends Consent Mode
signals but does not implement or prove a Google-certified IAB TCF CMP. Google
requires publishers serving AdSense in the EEA, UK and Switzerland to use a
certified CMP integrated with TCF. Google also says that without Purpose 1
consent the ad tag should not be called; the current server-rendered loader is
not gated on affirmative consent.

Before application:

1. configure Google’s Privacy & messaging European regulations message or a
   certified third-party CMP for web;
2. verify the production TC string and TCF v2.3 behavior in EEA, UK and Swiss
   test sessions;
3. remove or narrow the competing custom advertising-consent UI so users do not
   receive two inconsistent consent systems;
4. make privacy wording describe the deployed CMP exactly;
5. verify AdSense Sites approval and ads.txt status in the account and record
   screenshots/date in Project Status;
6. verify ad requests before/after accept/reject and ensure the primary checker,
   CWV and navigation remain usable.

## Official evidence

- Google consent requirements: https://support.google.com/adsense/answer/13554020
- Google publisher CMP options: https://support.google.com/adsense/answer/13554116
- IAB TCF integration and v2.3 transition: https://support.google.com/adsense/answer/9804260
- Site approval and ads.txt states: https://support.google.com/adsense/answer/12170222
- Page/content/navigation readiness: https://support.google.com/adsense/answer/7299563

## Still needs production/account verification

- Certified CMP presence and valid TC strings.
- AdSense Sites status, Policy Center, payments/account tasks and ads.txt crawler
  authorization.
- Real RPM/revenue; these remain unavailable in the growth baseline.
- Mobile CWV and checker-conversion impact with actual ad slots.
