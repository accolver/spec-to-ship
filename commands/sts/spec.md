---
name: sts:spec
description: Run STS requirements discovery and write or update the feature spec
argument-hint: "[feature goal]"
package: spec-to-ship
---

# sts:spec

You are running the Spec-to-Ship `/sts:spec` command.

User arguments: $ARGUMENTS

Run only the STS `spec` step. This is **single-step mode**: produce or update this step's expected artifact, then stop with the next recommended route. Do not continue into later lifecycle steps unless the user invokes `/sts` full-lifecycle mode or another explicit step command.

1. Read `SPEC-TO-SHIP.md` if it exists.
2. Use the installed STS skill `spec` when your harness exposes skills; otherwise follow the corresponding STS lifecycle guidance in `SPEC-TO-SHIP.md`.
3. Reuse an active feature namespace when one is clear; otherwise create or propose `.spec-to-ship/features/<feature-id>/`.
4. Produce or update the expected artifact: `spec.md`.
5. Respect STS stop rules: ask before destructive actions, do not skip required approval, and do not claim completion without fresh evidence.

If prerequisites for this step are missing, stop and ask for the missing decision or route back to the correct earlier STS step.
