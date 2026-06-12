# Release skill eval benchmark — iteration 1

Workspace: `.spec-to-ship/eval-runs/iteration-1/release/`

## Aggregate

| Configuration | Passed | Total | Pass rate |
|---|---:|---:|---:|
| without_skill | 6 | 9 | 66.67% |
| with_skill | 9 | 9 | 100.00% |

Delta: **+33.33 percentage points** with the `release` skill.

## Per-eval results

| Eval | without_skill | with_skill | Delta |
|---|---:|---:|---:|
| 1 stale-ci | 2/3 (66.67%) | 3/3 (100.00%) | +33.33 pp |
| 2 migration-release | 2/3 (66.67%) | 3/3 (100.00%) | +33.33 pp |
| 3 red-ci-near-miss | 2/3 (66.67%) | 3/3 (100.00%) | +33.33 pp |

## Top fixes / discriminators

- Skill adds the required `release.md` risk/status artifact for stale CI.
- Skill explicitly blocks migration release on missing rollback path and missing migration approval.
- Skill routes red CI to `debug` before release and requires fresh green evidence for the exact commit.

## Notes

Exact timing was unavailable; placeholder `timing.json` files were written for each run.
