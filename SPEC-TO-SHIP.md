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

## Invocation modes

- `/sts` is **full-lifecycle mode**. It should drive the active feature through the whole lifecycle until the work is shipped, intentionally handed off, or blocked by a required human decision. Do not stop after merely choosing or completing one step.
- Step commands such as `/sts:spec`, `/sts-spec`, `/sts:code`, or `/sts-code` are **single-step mode**. They run only the named lifecycle step, write that step's artifact, and stop with the next recommended route.
- In full-lifecycle mode, frontload requirements before starting implementation: ask one consolidated set of blocking questions about scope, approval, validation commands, destructive permissions, dependency policy, release target, merge/PR preference, and cleanup expectations. Record assumptions for non-blocking unknowns.
- Full-lifecycle mode still honors gates: stop for missing approval, destructive or irreversible actions, unsafe dependency decisions, failed validation needing user judgment, merge/PR decisions, dirty/unmerged cleanup decisions, or incomplete required review/design/dependency evidence. If a failure is diagnosable without user input, route through `debug` and then continue the lifecycle.
- Full-lifecycle mode must maintain an evidence trail as it goes. Do not advance from review to release, or release to finish, until acceptance criteria, upstream task checkboxes, demo/runtime claims, dependency changes, and blocked validations have explicit statuses in the feature artifacts.

## Skill routing

Routing collision rules:

- If an approved spec already exists and the user asks to plan, split, delegate, or build, route to `coding-agent`, not `spec`.
- If intended behavior is known and a test can be written, route to `tdd`; if the cause is unknown, symptoms are misleading, or CI/test failure is unexplained, route to `debug`.
- If CI is red, route to `debug`; if CI is green or needs final confirmation for a release candidate, route to `release`.
- If review discovers dependency risk, package or lockfile changes, license/supply-chain uncertainty, or an unreviewed dependency install command, route to `deps` before `release`.
- If UI/UX is involved, route through `ui-ux-gate` during `spec`, before implementation planning is finalized. If UI/UX involvement is discovered later, stop and backfill UI/UX evidence before review/release can pass.

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
  ui-ux-evidence.md
  remediation.md
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

Demos are UI/UX work when they render a page, route, form, graph, instructions, seeded data, or user-facing copy. Demo verifiers must prove the documented runtime path and must not rely only on hard-coded marker strings when the feature claim is about generated metadata, compiler output, or runtime behavior. When a demo claims a generated artifact is visible, the verifier must assert that the displayed value is derived from that artifact or from an equivalent runtime source.

Impeccable is optional at STS install time but required for UI/UX workflows unless the user explicitly accepts a documented degraded mode. Never vendor or restate Impeccable design laws inside STS.

## Evidence and checkbox discipline

Every non-trivial feature must keep an acceptance evidence matrix in `test-report.md`, `review.md`, or `release.md`. Each acceptance criterion and each upstream spec/task checkbox that is updated must list concrete proof: changed files, tests, commands, runtime/demo observations, review findings, or an explicit deferred/blocker status. If proof is missing, leave the checkbox unchecked and record the gap in `remediation.md` or the review findings.

Do not mark an upstream task list complete because the implementation appears close. Check off only the exact item proven by current evidence. If validation is blocked, unavailable, or only partially run, release status is `blocked` or `hold` unless the owner explicitly accepts a documented degraded release.

## Review hardening

Review is adversarial, not ceremonial. A review must include:

- a spec/acceptance evidence matrix;
- a task-checkbox audit for any changed upstream task/spec checklist;
- an adversarial probe matrix covering boundary, negative, conflict, security/auth, runtime/demo, and regression cases relevant to the change;
- dirty-worktree triage that separates feature code, generated artifacts, install/process artifacts, and unrelated changes;
- UI/UX evidence when user-facing surfaces changed;
- dependency evidence when package manifests or lockfiles changed.

Reviewer subagents, external auditors, browser tools, CI tools, and design tools that time out, fail, or are unavailable do not count as passing evidence. Treat timed-out/unavailable required tools as incomplete evidence. Either rerun, use an equivalent manual review with documented scope, or mark the review/release as degraded. Degraded review blocks release unless the owner explicitly accepts the residual risk.

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

Validation commands have three states: `passed`, `failed`, or `not run/unavailable`. Required validation that is `failed` or `not run/unavailable` blocks release unless the feature owner explicitly reclassifies it as non-required or accepts a documented degraded release. A command being unavailable is evidence of a blocker, not evidence of success.

TDD evidence must include the intended behavior, the failing-first command/output or an explicit no-test exception, the implementation summary, focused passing proof, broader relevant proof, and negative/boundary coverage for changed behavior. Happy-path assertions alone are insufficient for behavior that has compatibility, security, transport, persistence, or UI/runtime claims.

## Cleanup rule

Work is not finished until temporary worktrees and branches are either intentionally retained or safely cleaned up. Never remove dirty or unmerged work without explicit approval.
