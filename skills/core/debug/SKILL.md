---
name: debug
description: Diagnoses failures with reproduction, ranked hypotheses, root-cause evidence, and regression coverage. Use when tests fail, CI breaks, bugs regress, flakes occur, behavior is unexplained, or the user asks to troubleshoot, investigate, fix an error, or find root cause.
license: MIT
metadata:
  package: spec-to-ship
  version: "0.1.0"
---

# Debug

## Overview

Find and prove root cause through reproduction, hypotheses, evidence, minimal fix, and regression coverage.

## When to use

- Tests fail, CI breaks, behavior regresses, flakiness appears, or symptoms are unclear.
- The user asks to investigate, troubleshoot, fix an error, or find root cause.

## Do not use when

- Do not patch symptoms without reproduction.
- Do not test multiple hypotheses at once.
- Do not claim fixed without regression evidence.

## Boundary rules

- Use `debug` when the cause is unknown or symptoms are misleading.
- Once root cause is proven and behavior is known, route the fix through `tdd` for regression coverage.
- Do not quarantine flaky tests or loosen assertions without approval and follow-up risk.
- If the prompt lacks logs, code, reproduction steps, or a runnable environment, produce a debug-report skeleton and mark root cause as unproven instead of inventing certainty.

## Process

1. Capture the symptom and reproduction command or steps.
2. List ranked hypotheses and choose one to test first.
3. Gather evidence with the smallest useful command or instrumentation.
4. Identify root cause with file, line, config, data, or environment evidence; if evidence is insufficient, explicitly state that root cause is unproven.
5. Add regression coverage before or with the fix.
6. Record the report in `debug-report.md` or `test-report.md`.

## Outputs

- `.spec-to-ship/features/<feature-id>/debug-report.md`

## References

- [templates/debug-report.md](templates/debug-report.md)
- [references/root-cause-analysis.md](references/root-cause-analysis.md)

## Common rationalizations to reject

- "This is small enough to skip the artifact." If the task triggered this skill, record the lightweight artifact.
- "The agent can remember the context." Use the feature namespace so teammates and subagents can work safely.
- "The tests probably pass." Claims require fresh evidence.

## Red flags

- Writing to a shared root spec or task file during active work.
- Proceeding after discovering unapproved product, security, dependency, or cleanup risk.
- Claiming done without evidence in the current turn or feature artifacts.

## Verification checklist

- [ ] Reproduction is explicit
- [ ] Root cause has evidence
- [ ] Regression coverage or exception is documented
