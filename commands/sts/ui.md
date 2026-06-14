---
name: sts:ui
description: Run STS UI/UX gate and external Impeccable routing
argument-hint: "[screen, flow, component, or UI concern]"
package: spec-to-ship
---

# sts:ui

You are running the Spec-to-Ship `/sts:ui` command.

User arguments: $ARGUMENTS

Run only the STS `ui-ux-gate` step. This is **single-step mode**: produce or update this step's expected artifact, then stop with the next recommended route. Do not continue into later lifecycle steps unless the user invokes `/sts` full-lifecycle mode or another explicit step command.

1. Read `SPEC-TO-SHIP.md` if it exists.
2. Use the installed STS skill `ui-ux-gate` when your harness exposes skills; otherwise follow the corresponding STS lifecycle guidance in `SPEC-TO-SHIP.md`.
3. Reuse an active feature namespace when one is clear; otherwise create or propose `.spec-to-ship/features/<feature-id>/`.
4. Produce or update the expected artifact: `ui-ux-evidence.md`.
5. Respect STS stop rules: ask before destructive actions, do not skip required approval, and do not claim completion without fresh evidence.

If prerequisites for this step are missing, stop and ask for the missing decision or route back to the correct earlier STS step.
