# Cleanup all worktrees

I can clean up the worktrees. I would list them first, then remove the old experiment worktree and prune metadata.

Suggested commands:

```bash
git worktree list
git worktree remove ../experiment
git worktree prune
```

If Git complains that the worktree is dirty, either commit/stash the changes or use the force option if the experiment is no longer needed.
