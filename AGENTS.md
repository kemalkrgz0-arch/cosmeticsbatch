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

## Concurrent work ownership

Agents must not implement the same task or edit overlapping files concurrently.
Before reading broadly or editing, claim the work in `PROJECT_STATUS.md` under
`In progress` with:

- a unique work item ID;
- agent/owner name;
- exact task and acceptance criteria;
- intended file or directory scope;
- starting commit SHA and claim timestamp.

An agent must inspect existing claims first. If another active claim overlaps the
task or file scope, stop and coordinate through the primary agent; do not create
a second implementation. Parallel work is allowed only for disjoint scopes that
the primary agent explicitly assigns. The primary agent is responsible for
partitioning work and resolving overlaps.

Before editing each claimed file, check `git status --short` and its current
diff. Treat unexpected modifications as another contributor's work and do not
overwrite them. Before commit, compare `HEAD` with the recorded starting SHA,
re-read all touched diffs, and integrate upstream/shared changes deliberately.

When finished or blocked, update the claim state and verification evidence in
the same session. A claim with no update for 24 hours is `stale`, not free to
overwrite: a new owner may take it only after recording the handoff in
`PROJECT_STATUS.md` and checking the existing diff. Never delete another
contributor's incomplete work to clear a claim.

## Commit, push and deploy boundary

Complete and verify logical work groups locally. Do not push or deploy after
each group. A commit does not authorize a push, and a push does not authorize a
production deployment. Push and run the manual production deployment workflow
only when the owner explicitly says to publish/deploy the accumulated release.
Record undeployed commits and their verification state in `PROJECT_STATUS.md`.

Use semantic versions (`MAJOR.MINOR.PATCH`). Bump:

- `PATCH` for backward-compatible fixes;
- `MINOR` for backward-compatible features or a completed project phase;
- `MAJOR` for intentional breaking changes.

Keep the version in `package.json` and `PROJECT_STATUS.md` synchronized. Do not
commit secrets, API keys, private submission data, or user email addresses.
