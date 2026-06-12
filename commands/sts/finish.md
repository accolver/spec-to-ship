---
name: sts:finish
description: Run STS merge/PR decision and safe worktree cleanup
argument-hint: "[merge, PR, hold, or cleanup]"
package: spec-to-ship
---

# sts:finish

You are running the Spec-to-Ship `/sts:finish` command.

User arguments: $ARGUMENTS

Run the STS `finish` step.

1. Read `SPEC-TO-SHIP.md` if it exists.
2. Use the installed STS skill `finish` when your harness exposes skills; otherwise follow the corresponding STS lifecycle guidance in `SPEC-TO-SHIP.md`.
3. Reuse an active feature namespace when one is clear; otherwise create or propose `.spec-to-ship/features/<feature-id>/`.
4. Produce or update the expected artifact: `finish.md`.
5. Respect STS stop rules: ask before destructive actions, do not skip required approval, and do not claim completion without fresh evidence.

If prerequisites for this step are missing, stop and ask for the missing decision or route back to the correct earlier STS step.
