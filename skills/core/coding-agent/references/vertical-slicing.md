# Vertical Slicing

Prefer small behavior-complete slices over broad layer-only tasks. Each slice should be independently testable and reviewable.

## Good slice

Add one API field, render it in one UI location, and test both the serializer and visible behavior.

## Weak slice

"Do all backend work" followed by "do all frontend work" with no independently useful checkpoint.

## Parallelization rule

Parallel slices require non-overlapping file ownership or one named integration owner for shared files such as schemas, lockfiles, migrations, snapshots, generated API clients, and route registries.
