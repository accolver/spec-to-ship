# Parallel Ownership

Each writer owns explicit files and artifact paths. Overlap requires parent coordination before work starts.

## Required ownership table

| Owner | Slice | Files/globs | Artifact paths | Worktree path | Branch | Merge target | Merge order | Shared-file owner |
|---|---|---|---|---|---|---|---:|---|

## Shared-file rule

Lockfiles, schemas, migrations, snapshots, generated files, API clients, route registries, and package manifests require one named owner or a separate integration task. Do not let multiple writer agents edit them independently.
