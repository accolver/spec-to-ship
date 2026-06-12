# ui-ux-gate Iteration 1 Benchmark

Workspace: `.spec-to-ship/eval-runs/iteration-1/ui-ux-gate/`

## Summary

| Configuration | Passed | Total | Pass rate |
|---|---:|---:|---:|
| without_skill | 7 | 9 | 77.78% |
| with_skill | 9 | 9 | 100.00% |

**Delta:** +22.22 percentage points (+2 passed assertions).

## Per-eval results

| Eval | without_skill | with_skill | Delta |
|---|---:|---:|---:|
| 1 missing-impeccable | 1/3 (33.33%) | 3/3 (100.00%) | +66.67 pp |
| 2 backend-near-miss | 3/3 (100.00%) | 3/3 (100.00%) | +0.00 pp |
| 3 ui-pr-missing-qa | 3/3 (100.00%) | 3/3 (100.00%) | +0.00 pp |

## Analysis

- The skill's clear improvement is eval 1: it enforces install-state checking, asks before `npx impeccable skills install`, and records the blocked/degraded UI/UX risk.
- Eval 2 is a healthy boundary check but not discriminating in this run; a generic response also avoided UI/UX gate for backend-only work.
- Eval 3 is not discriminating enough because the prompt already names the missing keyboard, responsive, and copy evidence; a generic reviewer can satisfy the current assertions.

## Top fixes

1. Strengthen eval 3 assertions to require an Impeccable-informed critique/audit/polish touchpoint and a `.spec-to-ship/features/<feature-id>/review.md` evidence record.
2. Strengthen eval 1 to require explicit pause/degraded-mode acceptance before proceeding and distinguish missing, installed-not-initialized, and blocked/no-network states.
3. Add a subtler near-miss eval where an internal API change indirectly affects a UI workflow, forcing boundary reasoning rather than obvious backend-only routing.

## Timing

All run `timing.json` files are placeholders with zero values because exact timings were unavailable.
