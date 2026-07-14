# Private submission review panel

The owner workspace is available at `https://cosmeticsbatch.com/review` and is
not a public application route. Cloudflare Access must authenticate the reviewer
before the request reaches the origin. The origin then validates the signed JWT
again; `noindex` is defense-in-depth for search engines, not the access control.

## Required production secrets

- `CF_ACCESS_AUD`: Application Audience tag from the Access application.
- `CF_ACCESS_TEAM_DOMAIN`: full HTTPS team URL, without a trailing slash. This
  tenant identifier is public and is currently pinned in the deploy workflow.
- `REVIEWER_EMAILS`: comma-separated, lower/upper case-insensitive allowlist.
- Existing `RESEND_API_KEY` and `SUBMISSION_FROM_EMAIL` for user replies.

These values belong in GitHub Actions secrets. Never commit real values to an
environment example, issue, log or screenshot.

## Workflow

1. New submissions enter `pending` and remain in the append-only JSONL ledger.
2. A reviewer can set `in_review`, `awaiting_user`, `completed` or `discarded`.
3. Replies use one of the approved English templates and always append the
   institutional signature.
4. A clearer-photo reply moves the item to `awaiting_user`; identified and
   unverifiable replies move it to `completed` with the matching outcome.
5. Failed provider requests are recorded as failed and never shown as sent.

The existing `pnpm review:submissions` CLI remains the emergency fallback on the
VPS. Both interfaces write compatible append-only review events.

The **Batch-code checks** tab reads the existing month-rotated dataset and shows
the latest 500 human checks, including brand, code, coarse country, locale and
decode outcome. It does not collect or display IP addresses, cookies, account
identifiers or user emails.

## Security and operations

- Keep the Access destination scoped to `cosmeticsbatch.com/review/*`.
- Keep the policy restricted to named reviewer email addresses.
- Do not create a Cloudflare Bypass policy for the route.
- Private images are streamed only after JWT validation with `private, no-store`.
- Review events contain reviewer email for accountability; do not place secrets
  or unrelated personal information in internal notes.
- Rotate a reviewer out of both Cloudflare policy and `REVIEWER_EMAILS`.
