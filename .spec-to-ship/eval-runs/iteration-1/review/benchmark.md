# Review Skill Iteration 1 Benchmark

Workspace: `/Users/alancolver/dev/ai/ai-coding/.spec-to-ship/eval-runs/iteration-1/review`

## Aggregate

| Configuration | Passed | Total | Pass rate |
|---|---:|---:|---:|
| without_skill | 5 | 9 | 55.6% |
| with_skill | 9 | 9 | 100.0% |

**Delta:** +44.44 percentage points.

## Per-eval pass rates

| Eval | without_skill | with_skill | Delta |
|---|---:|---:|---:|
| 1 missing-tests | 2/3 (66.7%) | 3/3 (100.0%) | +33.3 pp |
| 2 ui-review | 1/3 (33.3%) | 3/3 (100.0%) | +66.7 pp |
| 3 debug-near-miss | 2/3 (66.7%) | 3/3 (100.0%) | +33.3 pp |

## Top fixes / observations

1. Baseline often recognizes generic missing evidence, but lacks STS severity taxonomy (`block` / `should-fix` / `follow-up`).
2. The skill adds high value for UI review by requiring `ui-ux-gate` / Impeccable evidence and treating missing accessibility/responsive evidence as blocking.
3. The skill/STS routing adds high value for CI-red prompts by routing to `debug` instead of implying review or release readiness.

## Timing

Exact timings were unavailable for inline generation; run-level `timing.json` files contain placeholders.
