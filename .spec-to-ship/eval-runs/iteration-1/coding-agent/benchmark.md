# coding-agent Iteration 1 Benchmark

Workspace: `.spec-to-ship/eval-runs/iteration-1/coding-agent/`

Timing note: exact per-response timings were unavailable, so each run includes a placeholder `timing.json`.

## Aggregate

| Configuration | Passed | Failed | Total | Pass rate |
|---|---:|---:|---:|---:|
| with_skill | 10 | 0 | 10 | 100.0% |
| without_skill | 3 | 7 | 10 | 30.0% |

Delta: **+70.0 percentage points** with skill.

## Per-eval results

| Eval | with_skill | without_skill | Delta |
|---|---:|---:|---:|
| 1 approved-spec-plan | 4/4 (100.0%) | 1/4 (25.0%) | +75.0 pp |
| 2 parallel-slices | 3/3 (100.0%) | 1/3 (33.3%) | +66.7 pp |
| 3 unapproved-spec-boundary | 3/3 (100.0%) | 1/3 (33.3%) | +66.7 pp |

## Observations

- The skill materially improved plan completeness: dependency graph, owned files/globs, validation commands, rollback notes, stop conditions, and STS routing all appeared in with-skill outputs.
- The generic baseline handled some obvious validation and parallelism language, but missed STS-specific ownership and rollback discipline.
- The biggest boundary improvement was eval 3: the skill stopped on `pending-user-approval` instead of proceeding with an implementation task list.

## Top fixes / next refinements

1. Keep the approval gate prominent so `pending-user-approval` stops implementation planning and routes to `spec` or asks the user.
2. Preserve the shared-file owner requirement for generated clients/types when backend and UI work are parallelized.
3. Ensure every implementation plan includes dependency graph, owned files/globs, validation commands, rollback notes, stop conditions, and next STS routing.
