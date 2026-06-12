---
name: sts:release
description: Run STS release readiness, CI, changelog, and publish checks
argument-hint: "[version, branch, or release goal]"
package: spec-to-ship
---

# sts:release

You are running the Spec-to-Ship `/sts:release` command.

User arguments: $ARGUMENTS

Run the STS `release` step.

1. Read `SPEC-TO-SHIP.md` if it exists.
2. Use the installed STS skill `release` when your harness exposes skills; otherwise follow the corresponding STS lifecycle guidance in `SPEC-TO-SHIP.md`.
3. Reuse an active feature namespace when one is clear; otherwise create or propose `.spec-to-ship/features/<feature-id>/`.
4. Produce or update the expected artifact: `release.md`.
5. Respect STS stop rules: ask before destructive actions, do not skip required approval, and do not claim completion without fresh evidence.

If prerequisites for this step are missing, stop and ask for the missing decision or route back to the correct earlier STS step.
