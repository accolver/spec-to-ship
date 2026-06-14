---
name: release
description: Prepares final validation, CI and deploy readiness, changelog or release notes, and publish checklists. Use when shipping, releasing, deploying, tagging, publishing, checking CI, preparing changelog, or confirming a branch is ready to go live.
license: MIT
metadata:
  package: spec-to-ship
  version: "0.1.0"
---

# Release

## Overview

Prepare final validation, CI and deploy readiness, changelog, release notes, and publish checklist.

## When to use

- Work is ready to ship, tag, deploy, publish, or release.
- The user asks for CI status, changelog, release notes, or deployment readiness.

## Do not use when

- Do not ship with unresolved blockers.
- Do not assume CI passed without checking evidence.
- Do not treat unavailable required validation as success.
- Do not run production deploy commands without explicit approval.

## Boundary rules

- Red CI routes to `debug`; `release` verifies readiness for the exact commit.
- Block release on unresolved review blockers, unresolved dependency risk, package/lockfile changes without dependency review, stale/missing CI, failed or unavailable required validation, dirty unrelated worktree changes, missing UI/UX evidence for user-facing work, unapproved degraded review/design mode, unapproved migrations, missing rollback path, or missing production approval.

## Process

1. Read spec, plan, tasks, review, test report, dependency report, UI/UX evidence, upstream task/checklist edits, and current status.
2. Confirm all review blockers are resolved or explicitly deferred by the owner, and that the acceptance evidence matrix has no unexplained `missing` items.
3. Run or verify the local validation contract. Record each command as `passed`, `failed`, or `not run/unavailable`; required `failed` or `not run/unavailable` commands block release unless explicitly waived by the owner.
4. Check CI using the user’s chosen tools or existing harness integrations.
5. Verify dependency/package/lockfile changes have `deps.md` evidence.
6. Verify UI/demo/user-facing changes have design QA evidence and runtime/demo proof.
7. Verify dirty worktree entries are either feature-owned, generated and expected, or intentionally held; unrelated dirty artifacts block release.
8. Prepare changelog/release notes when appropriate.
9. Write `release.md` with status, commands, risks, blocked validations, degraded-mode approvals, and release recommendation.

## Outputs

- `.spec-to-ship/features/<feature-id>/release.md`

## References

- [templates/release-checklist.md](templates/release-checklist.md)
- [templates/changelog.md](templates/changelog.md)

## Common rationalizations to reject

- "This is small enough to skip the artifact." If the task triggered this skill, record the lightweight artifact.
- "The agent can remember the context." Use the feature namespace so teammates and subagents can work safely.
- "The tests probably pass." Claims require fresh evidence.

## Red flags

- Writing to a shared root spec or task file during active work.
- Proceeding after discovering unapproved product, security, dependency, or cleanup risk.
- Claiming done without evidence in the current turn or feature artifacts.

## Verification checklist

- [ ] Validation and CI evidence are fresh
- [ ] Required failed/unavailable validation is blocking or explicitly waived
- [ ] Review blockers and missing evidence are resolved
- [ ] Dirty unrelated files are absent or explicitly held
- [ ] UI/demo and dependency evidence are present when applicable
- [ ] Release notes are scoped
- [ ] Deploy approvals are explicit
