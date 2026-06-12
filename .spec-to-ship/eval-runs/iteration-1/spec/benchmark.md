# Benchmark: spec iteration 1

| Configuration | Passed | Total | Pass rate |
|---|---:|---:|---:|
| without_skill | 7 | 11 | 63.6% |
| with_skill | 11 | 11 | 100.0% |

Delta: **+36.4 percentage points** with skill.

## Per-eval results

| Eval | Without skill | With skill | Delta |
|---|---:|---:|---:|
| 1 vague-ui-impeccable | 1/4 (25.0%) | 4/4 (100.0%) | +75.0 pp |
| 2 risky-migration-approval | 4/4 (100.0%) | 4/4 (100.0%) | +0.0 pp |
| 3 approved-spec-near-miss | 2/3 (66.7%) | 3/3 (100.0%) | +33.3 pp |

## Top fixes

1. Baseline UI spec missed STS namespacing, Impeccable/ui-ux-gate routing, and explicit approval status; keep these emphasized in `spec`.
2. Baseline approved-spec near miss did implementation planning directly; keep the `coding-agent` boundary prominent.
3. Tighten future risky-migration assertions because a generic baseline passed all current assertions.
