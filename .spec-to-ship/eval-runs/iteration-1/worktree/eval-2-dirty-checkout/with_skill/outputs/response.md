# Risky refactor worktree gate

This is a `worktree` use case because the refactor is risky, but the dirty primary checkout is a stop condition until the state is understood and approved.

## Preflight

Run read-only checks first:

```bash
git status --short
git branch --show-current
git worktree list
```

Do not create the refactor worktree yet if `git status --short` shows uncommitted changes in the primary checkout. Creating a worktree from an unclear base can strand or mask current work, and editing in the primary checkout could overwrite the user's changes.

## Stop / approval gate

Pause and ask the owner how to handle the dirty state:

1. commit the current changes,
2. stash them,
3. keep them in the primary checkout and create the worktree from a named clean base, or
4. cancel/retarget the refactor.

Do not run mutating setup commands until that decision is recorded.

## Artifact to write

Record the blocked state in `.spec-to-ship/features/<feature-id>/worktrees.md`:

```markdown
# Worktrees

Base branch: blocked pending dirty-checkout decision
Merge target: <merge-target>

| Owner | Slice | Files/globs | Artifact paths | Worktree path | Branch | Merge target | Merge order | Shared-file owner |
|---|---|---|---|---|---|---|---:|---|
| Refactor writer | Risky refactor | <TBD after approval> | `.spec-to-ship/features/<feature-id>/refactor/` | blocked | blocked | `<merge-target>` | 1 | TBD |

Status: blocked
Reason: primary checkout has uncommitted changes; owner approval required before creating branch/worktree.
Cleanup: delegated to `finish`; never remove dirty or unmerged worktrees without approval.
```

After approval, create the branch-isolated worktree from the agreed clean base and update the artifact with path, branch, owner, assigned files, merge target, and cleanup status.
