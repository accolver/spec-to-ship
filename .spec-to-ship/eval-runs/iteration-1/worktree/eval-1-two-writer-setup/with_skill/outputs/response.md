# Worktree coordination plan

This should use the `worktree` workflow because there are parallel writers and a known shared-file risk. Do not start API/UI writers until ownership is explicit and the lockfile conflict is assigned.

## Preflight

Run read-only checks first:

```bash
git status --short
git branch --show-current
git worktree list
```

If the harness already provides isolated workspaces, record those instead of creating duplicate `git worktree`s. Otherwise create branch-isolated worktrees from the approved base/feature ID.

## Shared-file gate

`package-lock.json`, `bun.lock`, `pnpm-lock.yaml`, `yarn.lock`, and package manifests are shared files. Assign exactly one owner before either writer starts. Recommended: create a separate integration/lockfile owner so API and UI do not independently edit dependency manifests or lockfiles.

## Artifact to write

Write `.spec-to-ship/features/<feature-id>/worktrees.md` before launching writers:

```markdown
# Worktrees

Base branch: <base-branch>
Merge target: <merge-target>
Status: planned

| Owner | Slice | Files/globs | Artifact paths | Worktree path | Branch | Merge target | Merge order | Shared-file owner |
|---|---|---|---|---|---|---|---:|---|
| API writer | API | `src/api/**` | `.spec-to-ship/features/<feature-id>/api/` | `../<repo>-<feature-id>-api` | `<feature-id>-api` | `<merge-target>` | 1 | No; cannot edit lockfile/package manifest |
| UI writer | UI | `src/ui/**` | `.spec-to-ship/features/<feature-id>/ui/` | `../<repo>-<feature-id>-ui` | `<feature-id>-ui` | `<merge-target>` | 2 | No; cannot edit lockfile/package manifest |
| Integration owner | Shared dependency/lockfile | `package.json`, `package-lock.json`, `bun.lock`, `pnpm-lock.yaml`, `yarn.lock` as applicable | `.spec-to-ship/features/<feature-id>/integration/` | parent/integration workspace | `<feature-id>-integration` if needed | `<merge-target>` | 3 | Yes |
```

## Commands after the gate is satisfied

```bash
git worktree add -b <feature-id>-api ../<repo>-<feature-id>-api <base-branch>
git worktree add -b <feature-id>-ui ../<repo>-<feature-id>-ui <base-branch>
```

Each writer receives only its owned globs and artifact path. Merge through one integration owner in the recorded order, then hand cleanup to `finish`; do not delete dirty or unmerged worktrees.
