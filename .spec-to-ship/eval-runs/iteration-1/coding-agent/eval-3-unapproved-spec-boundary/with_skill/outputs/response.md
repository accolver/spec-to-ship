# Approval Blocker: Do Not Build Task List Yet

Approval status in the prompt: `pending-user-approval`.

I should not create an implementation task list or treat this as an approved build plan. The coding-agent boundary requires stopping when a spec is missing approval, is `draft`, or is `pending-user-approval`.

## Decision

- No implementation planning as approved.
- No file ownership assignments for implementation.
- No subagent handoff prompts for coding work.
- No worktree or TDD implementation routing yet.

## Required next action

Route back to `spec` or ask the user to approve the draft spec before planning implementation.

Suggested user-facing question:

> The spec is marked `pending-user-approval`, so I should not build the implementation task list yet. Do you approve this spec as written, or should I route back to `spec` to revise it first?

## What can be prepared safely

Only non-executing review notes are safe at this stage:

- Confirm the spec has explicit acceptance criteria.
- Confirm open product, security, data, dependency, and UI/UX questions are resolved.
- Confirm the feature namespace where artifacts should be written after approval.

Once the user approves the spec, the next routing is `coding-agent` to create `plan.md` and `tasks.md` with dependency graph, owned files, validation commands, rollback notes, stop conditions, and next STS routing.
