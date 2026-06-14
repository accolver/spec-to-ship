# Release Checklist

## Status

One of: `ready`, `blocked`, `hold`, `degraded-approved`.

## Hard gates

- [ ] Review blockers resolved or explicitly deferred by owner.
- [ ] Acceptance evidence matrix has no unexplained missing required criteria.
- [ ] Changed upstream task checkboxes have proof or are reverted.
- [ ] Dependency risks resolved and package/lockfile changes have `deps.md` evidence.
- [ ] Local validation complete for exact commit.
- [ ] Required validation that failed or could not run is blocking or explicitly waived by owner.
- [ ] CI checked for exact commit or explicitly unavailable/waived.
- [ ] Worktree clean, or dirty entries categorized as feature/generated/process-install/unrelated with action.
- [ ] Unrelated dirty artifacts are absent or release is held.
- [ ] UI/demo changes have design QA and runtime/demo proof, or degraded mode is explicitly approved.
- [ ] Version/tag decision recorded.
- [ ] Changelog/release notes scoped.
- [ ] Migration notes included when needed.
- [ ] Rollback path known.
- [ ] Smoke checks and post-deploy verification planned.
- [ ] Monitoring/owner handoff recorded.
- [ ] Production deploy approval recorded when applicable.

## Validation matrix

| Command/check | Required? | Status (`passed`/`failed`/`not run`/`unavailable`) | Evidence | Blocker/waiver |
|---|---:|---|---|---|
|  |  |  |  |  |

## Dirty-artifact triage

| Path/pattern | Category | Release action |
|---|---|---|
|  |  |

## Blocked validations / degraded mode

Record owner approval before marking a degraded release ready.
