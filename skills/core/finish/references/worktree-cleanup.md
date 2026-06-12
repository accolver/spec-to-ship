# Worktree Cleanup

Check status, merged state, and dirty files before removal. Use explicit approval for abandon/delete paths. Run `git worktree prune` only after safe removal.

## Safe command pattern

```bash
git worktree list
git -C <worktree-path> status --short
git branch --contains <branch-name>
git worktree remove <worktree-path>
git worktree prune
```

Do not delete branches as part of worktree removal unless the user explicitly approved branch deletion. Keep dirty, unmerged, or unclear worktrees and record them as retained in `finish.md`.
