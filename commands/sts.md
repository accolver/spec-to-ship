---
name: sts
description: Run the full Spec-to-Ship lifecycle for a goal or active feature
argument-hint: "[goal or feature]"
package: spec-to-ship
---

# STS full-lifecycle runner

You are running the Spec-to-Ship `/sts` command.

User arguments: $ARGUMENTS

`/sts` is **full-lifecycle mode**. Do not stop after selecting or completing a single step. Drive the active feature through the STS lifecycle until it is shipped, intentionally handed off, or blocked by a required human decision.

Follow this router:

1. Read `SPEC-TO-SHIP.md` if it exists. If it is not present, rely on the installed STS skills and explain that the canonical file is missing.
2. Inspect the current branch, git status, and `.spec-to-ship/features/` artifacts when available to identify the active feature and lifecycle state.
3. If the user supplied arguments, treat them as the requested feature/goal. If there is an active feature conflict, ask which feature to continue before mutating files.
4. Frontload requirements and questions before entering the lifecycle loop. Ask one consolidated set of blocking questions only when needed, covering: scope/acceptance, approval to proceed beyond spec, validation commands, dependency policy, destructive-action permissions, release/deploy target, merge or PR preference, and worktree/cleanup expectations. Record assumptions for non-blocking unknowns instead of repeatedly interrupting later.
5. Run the lifecycle in order, using installed STS skills when available and writing artifacts in `.spec-to-ship/features/<feature-id>/`:
   - `spec` → write/update `spec.md`; obtain or record approval before implementation planning when scope is non-trivial.
   - `coding-agent` → write/update `plan.md` and `tasks.md` with vertical slices, ownership, validation, rollback, and next routing.
   - `worktree` → use only when parallel/risky work or file ownership requires isolation; otherwise record why it is unnecessary.
   - `tdd` → implement each behavior slice with failing-first evidence in `test-report.md`.
   - `debug` → when tests/CI fail or behavior is unexplained; after root cause and fix evidence, return to `tdd` or the next lifecycle step.
   - `review` → perform pre-merge/spec-compliance review and write `review.md`.
   - `deps` → run if dependencies changed or dependency risk appears; write `deps.md`.
   - `release` → run final validation/release readiness and write `release.md`.
   - `finish` → handle merge/PR/worktree cleanup decisions and write `finish.md`.
6. Continue automatically from one completed step to the next appropriate step. Stop only when blocked by a required human decision, unsafe/destructive action, missing approval, unresolved failed validation, or completion of `finish`.
7. If no active feature or goal is clear, ask the user what they want to ship and offer the common choices: new feature, existing feature, bug/debug, review, release, finish, or UI/UX work.

Do not skip approval, TDD, review, release, or cleanup gates. Keep artifacts under `.spec-to-ship/features/<feature-id>/`. Step commands such as `/sts-spec` and `/sts-code` are single-step mode; only `/sts` should attempt the whole lifecycle.
