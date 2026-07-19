# Packaging evidence library policy

The existing public image inventory is not proof of ownership, permission,
privacy review or decoder relevance. Until a reviewer records those facts, every
asset remains `existing-public-audit-required` in
`data/evidence-inventory.json`.

A future private submission may become a public crop only when all are recorded:

1. explicit submission consent covering verified public-guide portions;
2. private source/submission reference kept outside the public record;
3. crop/re-encode review removing faces, addresses, receipts, email and metadata;
4. brand, product/region when known, visible code location and decoder relevance;
5. reviewer role and review date;
6. permission and publication decision.

Raw photos, emails and notes stay in private storage. Public evidence records may
hold a non-sensitive opaque source reference, but never a private path or contact
detail. Run `npm run evidence:inventory` after changing `CODE_IMAGES`, followed
by `npm run test:evidence`.
