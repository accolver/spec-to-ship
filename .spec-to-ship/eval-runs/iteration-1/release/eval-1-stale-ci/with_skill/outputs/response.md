# With-skill response: release / stale CI

Status: **release blocked**.

The release skill requires fresh validation and CI evidence for the **exact commit** being shipped. CI passed yesterday, but the final commit was added after that run, so the current release SHA has not been verified. I will not prepare this as ready to ship until the latest commit has green CI.

## Required checks before release

- Identify the exact release commit/SHA.
- Verify local validation and CI for that exact SHA.
- Confirm the worktree is clean or intentionally documented.
- Confirm review/dependency blockers are resolved.
- Record release status, commands, risks, and recommendation in `release.md`.

## Release notes draft

```markdown
## Added

## Changed
- Include the changes from the latest commit once the exact release SHA is verified.

## Fixed

## Migration notes
- None identified from the prompt.
```

## `release.md` entry to record

```markdown
# Release readiness

Status: BLOCKED
Recommendation: Do not ship.

## Evidence
- CI evidence is stale: last known passing CI was yesterday and does not cover the latest commit.
- Exact release commit/SHA still needs a fresh green CI run.

## Risks
- Shipping from stale CI could release unvalidated changes from the final commit.

## Required next action
- Run or verify CI for the exact final release commit, then update this release record with the CI link/result before shipping.
```
