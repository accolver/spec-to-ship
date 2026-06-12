---
name: worktree
description: Creates and manages isolated git worktrees for safe parallel, concurrent, experimental, or risky implementation, recording branches, ownership, and merge targets. Use when work needs parallel writers, multiple agents, branch isolation, separate checkouts, git worktree setup, or conflict-safe coordination.
license: MIT
metadata:
  package: spec-to-ship
  version: "0.1.0"
---

# Worktree

## Overview

Create and track isolated workspaces for parallel or risky implementation without conflicting writer state.

## When to use

- Multiple writers or subagents need to work concurrently.
- A task is risky enough to isolate from the primary checkout.
- The user asks for branch isolation or worktree setup.

## Do not use when

- Do not create overlapping writer assignments without escalation.
- Do not delete dirty or unmerged worktrees.
- Do not ignore harness-native isolation if it exists.

## Boundary rules

- Do not create worktrees for read-only research or a single small edit.
- Do not start parallel writers until file ownership and shared-file ownership are explicit.
- Do not remove dirty or unmerged worktrees; cleanup belongs to `finish`.

## Process

1. Detect whether the harness already provides native worktree or sandbox isolation.
2. If needed, create `git worktree` branches named with the feature ID and slice slug.
3. Record path, branch, owner, assigned files, merge target, and cleanup status in `worktrees.md`.
4. Ensure each writer receives only its owned files and artifact paths.
5. Route merge/integration through one parent or integration agent.
6. When work completes, hand off to `finish` for safe cleanup.

## Outputs

- `.spec-to-ship/features/<feature-id>/worktrees.md`

## References

- [references/worktree-policy.md](references/worktree-policy.md)
- [references/parallel-ownership.md](references/parallel-ownership.md)

## Common rationalizations to reject

- "This is small enough to skip the artifact." If the task triggered this skill, record the lightweight artifact.
- "The agent can remember the context." Use the feature namespace so teammates and subagents can work safely.
- "The tests probably pass." Claims require fresh evidence.

## Red flags

- Writing to a shared root spec or task file during active work.
- Proceeding after discovering unapproved product, security, dependency, or cleanup risk.
- Claiming done without evidence in the current turn or feature artifacts.

## Verification checklist

- [ ] Every worktree has owner and merge target
- [ ] No overlapping file ownership remains unresolved
- [ ] Cleanup is delegated to finish
