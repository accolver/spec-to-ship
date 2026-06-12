# With-skill response: release / migration without rollback

Status: **release blocked / escalation required**.

Tests passing is not enough for a database migration release. The release skill blocks on **unapproved migrations** and a **missing rollback path**. This migration needs explicit migration approval and an operational rollback or recovery plan before it can be recommended for release.

## Required before shipping

- Document the migration owner/approver and obtain explicit approval.
- Add rollback path, roll-forward recovery path, or a written owner-approved statement that rollback is impossible and why.
- Include backup/restore requirements and post-deploy verification.
- Confirm fresh validation and CI for the exact release commit.
- Record the blocked state and risks in `release.md`.

## `release.md` entry to record

```markdown
# Release readiness

Status: BLOCKED
Recommendation: Do not ship yet.

## Evidence
- Tests are passing, but no rollback plan is documented.
- Migration approval has not been recorded.

## Risks
- A failed migration could leave production data or schema in an unrecoverable state.
- Missing approval means ownership for the migration risk is unclear.

## Required next action
- Get explicit migration approval from the accountable owner.
- Add a rollback, roll-forward, restore, and verification plan before release.
```
