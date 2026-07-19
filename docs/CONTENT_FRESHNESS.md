# Content freshness operations

The generated `data/content-freshness.json` covers every brand currently passing
the editorial/sample gate. It does not certify decoder provenance or native
language quality: unknown verification dates stay `needs-verification`, and the
current matrix records only EN/RU exposure.

Use `npm run content:freshness` after updating the quality matrix, then run
`npm run test:content-freshness`. Stale content enters an editorial review queue;
it is not silently rewritten, deindexed or removed. A future review must record
the responsible role, evidence inspected, locales actually reviewed and the
next review date. Never infer native review from machine translation or route
availability.
