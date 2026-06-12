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

## Process

1. Read the spec, plan, tasks, and current diff.
2. Pass 1: compare behavior against acceptance criteria and non-goals.
3. Pass 2: inspect correctness, simplicity, maintainability, tests, security, observability, and dependency changes.
4. For UI work, load `ui-ux-gate` and require Impeccable-informed critique or audit evidence.
5. Classify findings as `block`, `should-fix`, or `follow-up` with evidence.
6. Save `review.md`.

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
- [ ] UI changes include Impeccable-informed review
