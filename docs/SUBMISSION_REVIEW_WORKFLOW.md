# Photo submission review workflow

The first reviewer workflow is intentionally server-local. It does not expose
private photos or email addresses through a web/admin route. User replies stay
in the authenticated `contact@cosmeticsbatch.com` mailbox and in the original
notification thread so Reply-To continues to target the submitting user.

## Commands

Run these on the production host/container with `SUBMISSIONS_DIR` pointing to
the mounted private queue:

```bash
pnpm review:submissions list --status pending
pnpm review:submissions show SUBMISSION_ID
pnpm review:submissions status SUBMISSION_ID in_review
pnpm review:submissions status SUBMISSION_ID awaiting_user --note "Requested a clearer base photo"
pnpm review:submissions status SUBMISSION_ID completed --outcome identified
pnpm review:submissions status SUBMISSION_ID completed --outcome unverifiable
pnpm review:submissions status SUBMISSION_ID discarded --note "Unrelated image"
```

The status command appends an immutable `review` event to `submissions.jsonl`.
It never rewrites the original submission or notification events. A lock file
prevents two CLI updates from writing at the same time on the current single
host.

Allowed lifecycle:

```text
pending -> in_review -> awaiting_user -> in_review
                     -> completed
                     -> discarded
pending -> discarded
```

A completed review requires an `identified` or `unverifiable` outcome. Notes
must remain short and should not duplicate personal information.

## Reply process

1. List pending records and mark one `in_review`.
2. Search the contact mailbox for the submission id; inspect the attached image.
3. Reply in the same thread using `docs/USER_REPLY_TEMPLATES.md`.
4. If more evidence is needed, mark `awaiting_user`.
5. When resolved, mark `completed` with the appropriate outcome.

## Security boundaries

- Never expose `$SUBMISSIONS_DIR` through `public/`, a static file route or a
  secret-but-guessable URL.
- The list command omits email, note and file path. `show` displays private data
  only after the operator explicitly selects one id.
- This JSONL/lock design assumes one host and one writer. Move workflow metadata
  to a transactional database before adding replicas or a web reviewer UI.
- A future web UI requires external identity enforcement or a secure session,
  CSRF protection, authenticated image streaming and strict path validation.
- No automatic deletion is active. Retention duration, mailbox deletion and
  backup treatment require owner/legal approval before a pruning job is added.
