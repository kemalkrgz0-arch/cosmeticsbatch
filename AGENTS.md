# Repository collaboration rules

Every contributor or agent must read `PROJECT_STATUS.md` before changing code.

After each logical change group, update `PROJECT_STATUS.md` in the same working
session:

- add completed work to the current version entry;
- update the affected file list and verification results;
- move planned work between `Next`, `In progress`, and `Completed`;
- record known failures or blockers without hiding them;
- mark uncertain claims as `needs verification`;
- do not overwrite or remove another contributor's notes without resolving them.

Use semantic versions (`MAJOR.MINOR.PATCH`). Bump:

- `PATCH` for backward-compatible fixes;
- `MINOR` for backward-compatible features or a completed project phase;
- `MAJOR` for intentional breaking changes.

Keep the version in `package.json` and `PROJECT_STATUS.md` synchronized. Do not
commit secrets, API keys, private submission data, or user email addresses.
