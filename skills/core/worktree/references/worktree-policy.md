# Worktree Policy

Prefer harness-native isolation when available. Otherwise use git worktrees named with the feature ID and slice slug. Never remove dirty or unmerged worktrees without approval.

## Preflight checks

- Current branch and intended base branch.
- Dirty status in the primary checkout.
- Existing worktrees and branch/path collisions.
- Whether the harness already created an isolated workspace.
- Whether file ownership overlaps with another planned writer.

## `worktrees.md` status values

Use `planned`, `active`, `blocked`, `merged`, `retained`, or `cleaned`. Record path, branch, owner, files, merge target, and cleanup status.
