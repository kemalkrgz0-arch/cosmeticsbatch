# Private-data retention and recovery control

Status: policy decision required before deletion automation is enabled.

## Data currently retained

| Data | Runtime location | Contains | Current deletion rule |
| --- | --- | --- | --- |
| Check logs | `$DATASET_DIR/checks-YYYY-MM.jsonl` | code, brand, result, locale, time, coarse country and referring path | none |
| Failed-code logs | `$DATASET_DIR/failed-codes/*.jsonl` | code, brand, reason, locale, time and coarse country | none |
| Activity logs | `$DATASET_DIR/activity-YYYY-MM.jsonl` | path, locale, time and visit/page-view type | none |
| Photo submissions | `$SUBMISSIONS_DIR` | images, email, note, code and append-only review/reply events | none |
| Backups | `/opt/cosmeticsbatch-backups` | encrypted-at-rest status needs verification; archive of the private bind mount | none |
| Mail provider records | Resend account | submission and reply delivery records | account setting needs verification |

IP addresses and account identifiers are not written into the repository's
private JSONL datasets. Reviewer identity may be present in protected review
events for accountability. Raw private files must never be moved into `public/`.

## Decisions required from the owner/legal reviewer

Record an approved duration separately for each row below. “Forever” and a
single duration copied across every data class are not safe defaults.

| Data class | Approved active duration | Backup grace period | Legal basis/owner | Decision date |
| --- | --- | --- | --- | --- |
| Successful checks | needs verification | needs verification | needs verification | needs verification |
| Failed checks | needs verification | needs verification | needs verification | needs verification |
| Anonymous activity | needs verification | needs verification | needs verification | needs verification |
| Submission images | needs verification | needs verification | needs verification | needs verification |
| Submission email/note | needs verification | needs verification | needs verification | needs verification |
| Review/audit events | needs verification | needs verification | needs verification | needs verification |
| Backups | needs verification | needs verification | needs verification | needs verification |
| Resend records | needs verification | needs verification | needs verification | needs verification |

## Enforcement requirements

Deletion automation must remain disabled until the table is approved. The job
must run in dry-run mode first, preserve append-only audit evidence of counts
and date boundaries without copying codes/emails into logs, delete associated
photo files and ledger contact fields consistently, define backup expiry, and
have a tested rollback for accidental over-selection. A deletion request must
verify the requester without writing identity into public analytics.

The weekly backup workflow verifies archive checksum and extracts the newest
archive into an isolated temporary directory. It never restores over the live
bind mount. Production restore still requires an operator runbook exercise and
must remain `needs verification` until actually tested on the host.
