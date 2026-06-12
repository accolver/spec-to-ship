# Spec-to-Ship (STS)

Spec-to-Ship is a compact, portable AI coding workflow. It keeps project instructions in the project, keeps STS instructions in one canonical file, and loads task-specific Open Agent Skills only when needed.

## Core lifecycle

```text
request
  -> spec
  -> human approval when scope is non-trivial
  -> coding-agent
  -> worktree when parallel or risky work begins
  -> tdd per implementation slice
  -> debug when blocked or failing
  -> review
  -> deps if dependencies changed
  -> release
  -> finish for merge/PR/worktree cleanup
```

## Skill routing

Routing collision rules:

- If an approved spec already exists and the user asks to plan, split, delegate, or build, route to `coding-agent`, not `spec`.
- If intended behavior is known and a test can be written, route to `tdd`; if the cause is unknown, symptoms are misleading, or CI/test failure is unexplained, route to `debug`.
- If CI is red, route to `debug`; if CI is green or needs final confirmation for a release candidate, route to `release`.
- If review discovers dependency risk, route to `deps` before `release`.
- If UI/UX is involved, route through `ui-ux-gate` during `spec`, before implementation planning is finalized.

| Situation | Skill |
|---|---|
| New feature, unclear requirements, risky change | `spec` |
| UI/UX, frontend, forms, dashboards, visual design, accessibility | `spec` + `ui-ux-gate` + external `impeccable` |
| Approved spec needs tasks, implementation strategy, or handoffs | `coding-agent` |
| Parallel implementation, branch isolation, risky workspace work | `worktree` |
| Non-trivial behavior change or bug fix | `tdd` |
| Failing tests, CI breakage, flake, unexplained behavior | `debug` |
| Pre-merge diff, PR, or substantial code change | `review` |
| Dependency add, upgrade, removal, license or supply-chain risk | `deps` |
| CI, release, deploy, changelog, publish | `release` |
| Work complete, merge/PR choice, cleanup | `finish` |

## Artifact namespace contract

Never create one shared root `SPEC.md`, `tasks.md`, or mutable artifact file for active work. Every feature gets a unique namespace. To create one, sanitize the slug, include date/time and owner or agent label, create the directory exclusively, and add a suffix if it already exists. Reject path traversal and ensure the resolved path stays under `.spec-to-ship/features/`.

Every feature gets a unique namespace:

```text
.spec-to-ship/features/<YYYYMMDD-HHMM>-<owner-or-agent>-<slug>/
  spec.md
  plan.md
  tasks.md
  worktrees.md
  test-report.md
  debug-report.md
  review.md
  deps.md
  release.md
  finish.md
  handoff.md
```

Rules:

- Feature IDs are stable once work begins.
- Parallel subagents write only inside their feature namespace and assigned worktree.
- Plans must name file ownership and artifact ownership for every parallel slice.
- Avoid central mutable indexes during active work; generate summaries after merge if needed.

## Parallelization policy

Use parallel subagents when slices are independently testable and file ownership does not overlap. Use isolated worktrees for writer agents. One parent or integration agent owns merge order, conflict resolution, final validation, and cleanup.

## UI/UX policy

If a task touches UI, UX, frontend routes, pages, components, forms, dashboards, onboarding, empty/loading/error states, layout, navigation, visual design, accessibility, responsive behavior, user-facing copy, or product experience, load `ui-ux-gate` and use the externally installed `impeccable` skill during the spec phase. Design requirements must shape the spec before implementation begins.

Impeccable is optional at STS install time but required for UI/UX workflows unless the user explicitly accepts a documented degraded mode. Never vendor or restate Impeccable design laws inside STS.

## Tool preference policy

STS does not ship tool-wrapper skills for `gh`, cloud CLIs, browsers, or frameworks. Discover or ask for the user’s preferred tools, then record project-local choices in `.spec-to-ship/local-preferences.md` when useful.

## Safety invariants

- Defer to the harness approval and sandbox model.
- Identify destructive or irreversible operations before running them.
- Ask before deleting branches, worktrees, data, credentials, deployments, or production resources.
- Prefer read-only inspection before mutation.
- Record material mutating commands in the feature artifact.

## Verification rule

No completion claim without fresh evidence. If the agent has not run or checked the relevant command/output in this turn or artifact trail, it must not claim the work is complete, fixed, passing, merged, or released.

## Cleanup rule

Work is not finished until temporary worktrees and branches are either intentionally retained or safely cleaned up. Never remove dirty or unmerged work without explicit approval.
