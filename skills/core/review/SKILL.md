---
name: review
description: Performs pre-merge review against spec compliance, correctness, tests, security, maintainability, dependencies, and UI/UX risk. Use when reviewing diffs, PRs, branches, substantial changes, code quality, acceptance criteria, or readiness before merge.
license: MIT
metadata:
  package: spec-to-ship
  version: "0.1.0"
---

# Review

## Overview

Perform evidence-backed pre-merge review for spec compliance, code quality, tests, security, dependencies, and UI/UX risk.

## When to use

- A diff, branch, PR, or substantial change needs review.
- The user asks whether work is ready to merge.
- Spec compliance, security, maintainability, or UI/UX quality needs scrutiny.

## Do not use when

- Do not make product decisions that belong in `spec`.
- Do not ignore missing tests because the diff looks plausible.
- Do not treat optional polish as a blocker.
- Do not treat a timed-out/unavailable reviewer, browser, CI, or design tool as passing evidence.

## Process

1. Read the spec, plan, tasks, test report, dependency report when present, upstream specs/task checklists touched by the diff, and current diff/status.
2. Build an acceptance evidence matrix: every acceptance criterion is `met`, `partial`, `missing`, `deferred`, or `not applicable`, with file/line/command proof.
3. Audit task/checklist changes: every checked upstream task must have concrete evidence; otherwise mark it as a blocker or required correction.
4. Pass 1: compare behavior against acceptance criteria, non-goals, product constraints, and upstream specs.
5. Pass 2: inspect correctness, simplicity, maintainability, tests, security/auth, persistence/data safety, observability, dependency changes, generated artifacts, and dirty unrelated files.
6. Pass 3: adversarial probes. Try to break the change with boundary, negative, conflict, runtime/demo, permission/security, and regression cases relevant to the feature. Run focused commands when cheap; otherwise record exact manual reasoning and residual risk.
7. For UI/demo/user-facing work, load `ui-ux-gate` and require Impeccable-informed critique or documented degraded-mode acceptance. Verify demos prove generated/runtime behavior instead of only hard-coded marker strings.
8. If a required reviewer/subagent/tool times out or is unavailable, record review as incomplete/degraded and block release unless the owner explicitly accepts the risk.
9. Classify findings as `block`, `should-fix`, or `follow-up` with evidence.
10. Save `review.md`.

## Outputs

- `.spec-to-ship/features/<feature-id>/review.md`

## References

- [templates/review.md](templates/review.md)
- [references/review-taxonomy.md](references/review-taxonomy.md)

## Common rationalizations to reject

- "This is small enough to skip the artifact." If the task triggered this skill, record the lightweight artifact.
- "The agent can remember the context." Use the feature namespace so teammates and subagents can work safely.
- "The tests probably pass." Claims require fresh evidence.

## Red flags

- Writing to a shared root spec or task file during active work.
- Proceeding after discovering unapproved product, security, dependency, or cleanup risk.
- Claiming done without evidence in the current turn or feature artifacts.

## Verification checklist

- [ ] Findings have evidence
- [ ] Spec compliance is checked
- [ ] Acceptance evidence matrix is complete
- [ ] Adversarial probes are recorded
- [ ] Changed upstream checkboxes are audited
- [ ] Dirty unrelated artifacts are identified
- [ ] UI changes include Impeccable-informed review or accepted degraded mode
