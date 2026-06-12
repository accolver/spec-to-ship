# Finish cleanup

Since the feature branch has already been merged and the worktree is clean, I would wrap up by deleting the feature branch/worktree and returning to the main checkout.

Suggested commands:

```bash
git status
git checkout main
git pull
git branch -d feature-branch
git worktree prune
```

After that, I would confirm the repository is on the updated main branch and report that cleanup is complete.
