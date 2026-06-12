# TDD Skill Eval Benchmark — Iteration 1

Workspace: `.spec-to-ship/eval-runs/iteration-1/tdd`

## Summary

| Configuration | Passed | Total | Pass rate |
|---|---:|---:|---:|
| without_skill | 2 | 10 | 20.0% |
| with_skill | 10 | 10 | 100.0% |
| delta |  |  | +80.0% |

## Per eval

| Eval | without_skill | with_skill | Delta |
|---|---:|---:|---:|
| 1 bug-regression | 0/4 (0.0%) | 4/4 (100.0%) | +100.0% |
| 2 unexpected-pass | 1/3 (33.3%) | 3/3 (100.0%) | +66.7% |
| 3 no-test-exception | 1/3 (33.3%) | 3/3 (100.0%) | +66.7% |

## Top fixes / observations

- Baseline does not capture red/green command evidence or write test-report.md; keep emphasizing artifacted proof.
- Unexpected-pass scenario needs an explicit stop condition and revised failing test/assumption before implementation.
- No-test exception should require alternate proof, residual risk, and follow-up debt, not just 'tests not run'.

## Timing

Timing files use placeholders because exact timings were unavailable.
