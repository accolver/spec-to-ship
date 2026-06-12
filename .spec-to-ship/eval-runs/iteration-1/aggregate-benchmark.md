# Spec-to-Ship Eval Aggregate

Status: **pass**

| Skill | Baseline | With skill | Delta | Status |
|---|---:|---:|---:|---|
| spec | 7/11 (63.6%) | 11/11 (100.0%) | 36.4 pp | pass |
| coding-agent | 3/10 (30.0%) | 10/10 (100.0%) | 70.0 pp | pass |
| worktree | 5/10 (50.0%) | 10/10 (100.0%) | 50.0 pp | pass |
| tdd | 2/10 (20.0%) | 10/10 (100.0%) | 80.0 pp | pass |
| debug | 4/10 (40.0%) | 9/10 (90.0%) | 50.0 pp | pass |
| review | 5/9 (55.6%) | 9/9 (100.0%) | 44.4 pp | pass |
| deps | 5/9 (55.6%) | 9/9 (100.0%) | 44.4 pp | pass |
| release | 6/9 (66.7%) | 9/9 (100.0%) | 33.3 pp | pass |
| finish | 1/9 (11.1%) | 9/9 (100.0%) | 88.9 pp | pass |
| ui-ux-gate | 7/9 (77.8%) | 9/9 (100.0%) | 22.2 pp | pass |

## Aggregate

- Baseline: 45/96 (46.9%)
- With skill: 95/96 (99.0%)
- Delta: 52.1 percentage points
- Grading files: 60

## Caveats

- v0.1 eval runner aggregates existing grading artifacts; it does not regenerate model responses.
- Timing files may be placeholders and are not used for pass/fail thresholds.
