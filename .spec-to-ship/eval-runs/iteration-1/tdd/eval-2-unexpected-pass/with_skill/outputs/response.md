# TDD response: invoice rounding test unexpectedly passes

I would stop before implementation. A test that already passes in the red step is not valid failing-first evidence, so continuing would be implementation-first work disguised as TDD.

## Behavior under test

Invoice totals should use the intended rounding rule for the disputed edge case.

## Red evidence status

- Focused command: `bun test test/invoices/rounding.test.ts --test-name-pattern "rounds invoice totals at the required boundary"`
- Observed result: the new test passes before any code changes.
- TDD decision: unexpected pass detected; do not implement blindly.

## Revised assumptions / test plan

Before changing production code, revise the assumption or test so it proves the missing behavior:

1. Confirm the exact rounding contract: decimal precision, tie-breaking rule, currency minor units, tax/discount order, and negative/refund behavior.
2. Inspect whether the existing implementation already satisfies the requested behavior; if so, report no production change is needed and keep only useful coverage.
3. If there is still a gap, update the test fixture to isolate the gap and require a failing assertion for the expected reason.
4. Only after focused red evidence exists, implement the smallest code change and record green evidence in `.spec-to-ship/features/<feature-id>/test-report.md`.

## Artifact note

The `test-report.md` red section should record the unexpected pass and the revised test/assumption before any implementation work proceeds.
