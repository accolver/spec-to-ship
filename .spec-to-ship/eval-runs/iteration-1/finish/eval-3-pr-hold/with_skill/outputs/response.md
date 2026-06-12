# Finish: hold for reviewer approval

Tests pass, but the reviewer has not approved, so the safe finish option is **hold for review / keep the PR open**. I will not merge, delete the branch, or remove the worktree yet.

## Final checks

```bash
git status --short
git branch --show-current
git worktree list --porcelain
# read current test/CI evidence from release.md or the latest command output
```

## Options

1. **Hold for review** — keep branch and worktree intact, post/update PR status with passing test evidence. Recommended because approval is missing.
2. **Update PR only** — push any final notes/artifacts, but still do not merge.
3. **Abandon** — only if explicitly approved; preserve or document any unmerged work first.

## Action for this prompt

I would wrap up by recording the hold decision in `.spec-to-ship/features/<feature-id>/finish.md`:

- tests/CI evidence that passed
- reviewer approval status: not approved
- selected option: hold for review
- worktree/branch retained intentionally

No merge or cleanup should happen until reviewer approval or another explicit decision is provided.
