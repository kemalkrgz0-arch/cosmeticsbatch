# Repository collaboration rules

Every contributor or agent must read `PROJECT_STATUS.md` before changing code.

Before implementation, record every newly discovered bug, regression, security
or privacy risk, technical debt item, and proposed improvement in
`PROJECT_STATUS.md`. Give it a severity (`P0`–`P3`), evidence, affected scope,
and an explicit state (`Next`, `In progress`, `Blocked`, or `Completed`). Do not
leave actionable findings only in chat, a review comment, or personal notes.

After each logical change group, update `PROJECT_STATUS.md` in the same working
session:

- add completed work to the current version entry;
- update the affected file list and verification results;
- move planned work between `Next`, `In progress`, and `Completed`;
- record known failures or blockers without hiding them;
- mark uncertain claims as `needs verification`;
- do not overwrite or remove another contributor's notes without resolving them.

Apply strict verification to every logical change group:

- define acceptance criteria before editing;
- add or update regression tests for changed behavior whenever testable;
- run the narrowest relevant checks first, then the repository-wide required
  checks before declaring completion;
- record exact commands/results, skipped checks, environment limitations and
  remaining risks in `PROJECT_STATUS.md`;
- never describe a check as passed unless it actually ran and passed;
- keep an item `In progress`, `Blocked`, or `needs verification` until its
  acceptance criteria and required checks are satisfied;
- inspect the final diff for unrelated changes, secrets and private data;
- after deployment, run and record proportionate live smoke checks; a successful
  deploy job alone does not prove the feature works.

P0 correctness, privacy, security, or data-loss findings stop lower-priority
feature work until resolved or explicitly accepted by the owner and documented.

Use semantic versions (`MAJOR.MINOR.PATCH`). Bump:

- `PATCH` for backward-compatible fixes;
- `MINOR` for backward-compatible features or a completed project phase;
- `MAJOR` for intentional breaking changes.

Keep the version in `package.json` and `PROJECT_STATUS.md` synchronized. Do not
commit secrets, API keys, private submission data, or user email addresses.
