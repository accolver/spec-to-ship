# With-skill response: release / red CI near miss

Status: **release blocked and routed to `debug` first**.

The release skill verifies readiness; it does not proceed while CI is red. Red CI must be investigated and fixed through the `debug` workflow before release readiness can be re-evaluated.

## Required sequence

1. Route the failing release-branch CI to `debug` for failure investigation.
2. Fix the CI failure on the intended release branch/commit.
3. Rerun the full required validation/CI pipeline.
4. Verify green CI evidence for the exact release commit/SHA.
5. Return to `release` only after that fresh green evidence exists.

## `release.md` entry to record

```markdown
# Release readiness

Status: BLOCKED
Recommendation: Do not ship.

## Evidence
- CI is currently failing on the release branch.
- No fresh green evidence exists for the exact release commit.

## Risks
- Proceeding would ship from a known failing release branch.

## Required next action
- Use `debug` to investigate and fix the failing CI, then rerun CI and update this release record with green evidence.
```
