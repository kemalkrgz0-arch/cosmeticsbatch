# Experiment and rollback ledger

`registry.json` is the operational source of truth for SEO, UX and ad
experiments. Record the baseline before implementation. A local experiment has
no production outcome; after release, add the release commit/date and comparable
14/28-day observations without changing the baseline.

Allowed decisions are `pending`, `keep`, `revise` and `revert`. A decision needs
the primary metric and every guardrail. Inconclusive and negative outcomes stay
in history.

Run:

```sh
npm run test:experiments
```

Never store query-level private data, checked codes, submissions, email, IP or
account identifiers here. Current brand-product policy permits existing brand
URLs only; it forbids product routes, nested product paths and Product schema.
