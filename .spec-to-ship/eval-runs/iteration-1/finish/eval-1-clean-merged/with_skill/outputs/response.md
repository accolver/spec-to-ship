# Finish: clean merged work

I will finish this only after fresh state checks and recorded cleanup evidence.

## Checks to run first

```bash
git status --short
git branch --show-current
git branch --merged
# inspect every worktree before removal
git worktree list --porcelain
```

Given the scenario states the feature branch is already merged and the worktree is clean, the approved finish option is **safe cleanup of completed work**. I would not use force deletion.

## Safe cleanup

```bash
# remove only the completed clean worktree by its exact path
git worktree remove <completed-worktree-path>

# delete the local feature branch only if Git confirms it is merged
git branch -d <feature-branch>

# prune stale metadata after safe removal
git worktree prune

# final evidence
git worktree list
git status --short
```

## Record

Create/update `.spec-to-ship/features/<feature-id>/finish.md` with:

- verification evidence from status/merged/worktree checks
- approved option: clean up merged clean worktree
- commands run and results
- final remaining worktrees/status
