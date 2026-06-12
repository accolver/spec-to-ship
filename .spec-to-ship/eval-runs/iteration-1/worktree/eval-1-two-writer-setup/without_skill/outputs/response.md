# Parallel worktree setup plan

I'll create two separate worktrees so the API and UI work can happen independently:

- API slice: create a branch such as `feature/api-slice` and a worktree at `../project-api-slice` for `src/api/**`.
- UI slice: create a branch such as `feature/ui-slice` and a worktree at `../project-ui-slice` for `src/ui/**`.

Suggested commands:

```bash
git status --short
git worktree add -b feature/api-slice ../project-api-slice HEAD
git worktree add -b feature/ui-slice ../project-ui-slice HEAD
```

After both slices are complete, merge one branch first, then rebase or merge the other branch and resolve any conflicts. Since both slices might update dependencies, expect the package lockfile to conflict and resolve it during integration.
