# Risky refactor worktree

I would make a separate branch and worktree for the risky refactor so the main checkout stays usable:

```bash
git worktree add -b refactor/risky ../project-risky-refactor HEAD
cd ../project-risky-refactor
```

Then I would perform the refactor in that worktree, run tests there, and merge the branch back after review. If the primary checkout has uncommitted changes, I would leave them alone and avoid editing in the primary directory while the refactor is underway.
