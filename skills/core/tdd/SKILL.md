---
name: tdd
description: Guides red-green-refactor implementation with failing-first tests, minimal code changes, and captured proof. Use when making non-trivial behavior changes, bug fixes needing regression tests, or when the user mentions TDD, tests first, red-green, or test-report evidence.
license: MIT
metadata:
  package: spec-to-ship
  version: "0.1.0"
---

# TDD

## Overview

Require failing-first evidence, minimal implementation, passing proof, and safe refactor for behavior changes.

## When to use

- Non-trivial behavior changes, new features, and bug fixes.
- Regression coverage is needed.
- The user asks for TDD, tests first, red-green-refactor, or proof.

## Do not use when

- Do not implement first and test later unless impossible and documented.
- Do not claim green without fresh command output.
- Do not broaden scope during refactor.

## Process

1. State the behavior under test.
2. Add or update the smallest failing test or reproduction.
3. Run the focused command and capture the failing output.
4. Implement the smallest change that can pass.
5. Run focused tests, then broader relevant checks.
6. Record failing and passing evidence in `test-report.md`.

## Outputs

- `.spec-to-ship/features/<feature-id>/test-report.md`

## References

- [references/test-levels.md](references/test-levels.md)
- [references/testing-anti-patterns.md](references/testing-anti-patterns.md)

## Common rationalizations to reject

- "This is small enough to skip the artifact." If the task triggered this skill, record the lightweight artifact.
- "The agent can remember the context." Use the feature namespace so teammates and subagents can work safely.
- "The tests probably pass." Claims require fresh evidence.

## Red flags

- Writing to a shared root spec or task file during active work.
- Proceeding after discovering unapproved product, security, dependency, or cleanup risk.
- Claiming done without evidence in the current turn or feature artifacts.

## Verification checklist

- [ ] Failing evidence exists before implementation
- [ ] Passing evidence is fresh
- [ ] No-test exception is justified
