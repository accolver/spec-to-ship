---
name: sts:release
description: Run STS release readiness, CI, changelog, and publish checks
argument-hint: "[version, branch, or release goal]"
package: spec-to-ship
---

# sts:release

You are running the Spec-to-Ship `/sts:release` command.

User arguments: $ARGUMENTS

Run only the STS `release` step. This is **single-step mode**: produce or update this step's expected artifact, then stop with the next recommended route. Do not continue into later lifecycle steps unless the user invokes `/sts` full-lifecycle mode or another explicit step command.

1. Read `SPEC-TO-SHIP.md` if it exists.
2. Use the installed STS skill `release` when your harness exposes skills; otherwise follow the corresponding STS lifecycle guidance in `SPEC-TO-SHIP.md`.
3. Reuse an active feature namespace when one is clear; otherwise create or propose `.spec-to-ship/features/<feature-id>/`.
4. Produce or update the expected artifact: `release.md`. Status must be `ready`, `blocked`, or `hold`; required validation that failed or could not run is a blocker unless the owner explicitly reclassifies it or accepts a documented degraded release.
5. Respect STS stop rules: ask before destructive actions, do not skip required approval, block on unresolved review blockers, missing UI/UX evidence, unreviewed dependency changes, dirty unrelated artifacts, failed/unavailable required validation, and do not claim completion without fresh evidence.

If prerequisites for this step are missing, stop and ask for the missing decision or route back to the correct earlier STS step.
