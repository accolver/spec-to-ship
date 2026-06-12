---
name: sts
description: Continue the Spec-to-Ship workflow or choose what to work on
argument-hint: "[goal or feature]"
package: spec-to-ship
---

# STS workflow router

You are running the Spec-to-Ship `/sts` command.

User arguments: $ARGUMENTS

Follow this router:

1. Read `SPEC-TO-SHIP.md` if it exists. If it is not present, rely on the installed STS skills and explain that the canonical file is missing.
2. Inspect the current branch, git status, and `.spec-to-ship/features/` artifacts when available to identify the active feature and current lifecycle state.
3. If the user supplied arguments, treat them as the requested feature/goal and choose the next STS step from the lifecycle.
4. Continue the next appropriate STS step using the installed skill when available.
5. If no active feature or goal is clear, ask the user what they want to work on and offer the common choices: spec, code, worktree, tdd, debug, review, deps, release, finish, or ui.

Do not skip approval, TDD, review, release, or cleanup gates. Keep artifacts under `.spec-to-ship/features/<feature-id>/`.
