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
- Do not run production deploy commands without explicit approval.

## Process

1. Read spec, plan, review, test report, dependency report, and current status.
2. Run or verify the local validation contract.
3. Check CI using the user’s chosen tools or existing harness integrations.
4. Prepare changelog/release notes when appropriate.
5. For UI changes, include design QA evidence.
6. Write `release.md` with status, commands, risks, and release recommendation.

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
- [ ] Release notes are scoped
- [ ] Deploy approvals are explicit
