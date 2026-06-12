# Debug Skill Benchmark — Iteration 1

Workspace: `.spec-to-ship/eval-runs/iteration-1/debug/`

| Configuration | Passed | Total | Pass rate |
|---|---:|---:|---:|
| without_skill | 4 | 10 | 40% |
| with_skill | 9 | 10 | 90% |

Delta: **+50%** with_skill vs without_skill.

## Per-eval

| Eval | Without skill | With skill | Delta |
|---|---:|---:|---:|
| 1 misleading-ci | 2/4 (50%) | 3/4 (75%) | 1/4 |
| 2 flaky-test | 0/3 (0%) | 3/3 (100%) | 3/3 |
| 3 known-cause-near-miss | 2/3 (66.7%) | 3/3 (100%) | 1/3 |

## Observations

- The debug skill strongly improves flaky-test handling by preventing blind quarantine and requiring approval plus evidence.
- The known-cause parser prompt correctly routes away from debug and toward TDD with regression coverage.
- The misleading-CI eval exposes an artifact gap: no code/logs are provided, so the with-skill response appropriately refuses to fabricate root-cause proof.

## Top fixes

- Add concrete CI log/code fixtures for eval 1 so root-cause evidence can be objectively proven instead of planned.
- Clarify in the debug skill how to respond when the prompt lacks enough artifacts: produce evidence thresholds and mark root cause unproven.
- Consider adding a lightweight debug-report response skeleton for no-file troubleshooting prompts.
