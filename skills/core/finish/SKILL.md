---
name: finish
description: Completes merge or PR decisions and safely cleans up branches and worktrees after verified work. Use when implementation is done and the user asks to finish, merge, open or update a PR, hold, abandon, clean up worktrees, prune, or wrap up.
license: MIT
metadata:
  package: spec-to-ship
  version: "0.1.0"
---

# Finish

## Overview

Complete merge or PR decisions and clean up worktrees and branches safely after verification.

## When to use

- Implementation is done and the user asks to finish, merge, open or update a PR, abandon, wrap up, prune, or clean worktrees.

## Do not use when

- Do not remove unmerged work without explicit approval.
- Do not clean dirty worktrees.
- Do not skip final status checks.

## Safety rules

- Removing a worktree, deleting a local branch, deleting a remote branch, and pruning stale metadata are separate actions with separate risk. Ask separately when risk is non-obvious.
- Prefer `git worktree remove <path>` over manual deletion. Do not use `rm -rf` for cleanup unless the user explicitly approves a documented exceptional case.
- If state is unclear, choose `hold for review` and retain the worktree.

## Process

1. Verify tests/CI or read the latest `release.md` evidence.
2. Detect base branch, current branch, worktree list, and dirty/unmerged state.
3. Present options: merge locally, open/update PR, hold for review, or abandon.
4. Execute only the approved option.
5. After merge or explicit abandonment, remove completed clean worktrees and run `git worktree prune` when safe.
6. Record decisions and cleanup evidence in `finish.md` using `templates/finish.md`.

## Outputs

- `.spec-to-ship/features/<feature-id>/finish.md`

## References

- [references/worktree-cleanup.md](references/worktree-cleanup.md)
- [references/merge-or-pr-options.md](references/merge-or-pr-options.md)
- [templates/finish.md](templates/finish.md)

## Common rationalizations to reject

- "This is small enough to skip the artifact." If the task triggered this skill, record the lightweight artifact.
- "The agent can remember the context." Use the feature namespace so teammates and subagents can work safely.
- "The tests probably pass." Claims require fresh evidence.

## Red flags

- Writing to a shared root spec or task file during active work.
- Proceeding after discovering unapproved product, security, dependency, or cleanup risk.
- Claiming done without evidence in the current turn or feature artifacts.

## Verification checklist

- [ ] Final status is checked
- [ ] Approved option is recorded
- [ ] Worktree cleanup is safe and evidenced
