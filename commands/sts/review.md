---
name: sts:review
description: Run STS pre-merge spec compliance and quality review
argument-hint: "[diff, branch, PR, or focus]"
package: spec-to-ship
---

# sts:review

You are running the Spec-to-Ship `/sts:review` command.

User arguments: $ARGUMENTS

Run the STS `review` step.

1. Read `SPEC-TO-SHIP.md` if it exists.
2. Use the installed STS skill `review` when your harness exposes skills; otherwise follow the corresponding STS lifecycle guidance in `SPEC-TO-SHIP.md`.
3. Reuse an active feature namespace when one is clear; otherwise create or propose `.spec-to-ship/features/<feature-id>/`.
4. Produce or update the expected artifact: `review.md`.
5. Respect STS stop rules: ask before destructive actions, do not skip required approval, and do not claim completion without fresh evidence.

If prerequisites for this step are missing, stop and ask for the missing decision or route back to the correct earlier STS step.
