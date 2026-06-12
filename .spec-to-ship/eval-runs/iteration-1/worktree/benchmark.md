# Worktree Skill Iteration 1 Benchmark

Workspace: `.spec-to-ship/eval-runs/iteration-1/worktree/`

Grading: manual assertion check with evidence in each run's `grading.json`.
Timing: exact timings unavailable; placeholder `timing.json` files were written.

## Aggregate results

| Configuration | Passed | Total | Assertion-weighted pass rate |
|---|---:|---:|---:|
| With skill | 10 | 10 | 100.0% |
| Without skill | 5 | 10 | 50.0% |
| Delta | +5 | 10 | +50.0 pp |

Mean per-eval pass-rate delta: +47.2 pp.

## Per-eval results

| Eval | With skill | Without skill | Delta | Notes |
|---|---:|---:|---:|---|
| 1 - two-writer-setup | 4/4 (100.0%) | 1/4 (25.0%) | +75.0 pp | Skill adds explicit `worktrees.md` artifact and shared lockfile owner before writers start. |
| 2 - dirty-checkout | 3/3 (100.0%) | 1/3 (33.3%) | +66.7 pp | Skill adds dirty-status preflight and a blocked approval gate before setup. |
| 3 - read-only-near-miss | 3/3 (100.0%) | 3/3 (100.0%) | +0.0 pp | Non-discriminating eval: generic baseline already avoids worktree creation for read-only investigation. |

## Top fixes / observations

1. No immediate `SKILL.md` fix is indicated by this iteration because with-skill passed all assertions.
2. Eval 3 is non-discriminating; make it harder or add assertions that test STS-specific routing/artifact discipline if the goal is measuring skill lift.
3. If refining the skill, consider keeping dirty-primary stop conditions and shared-file ownership highly visible because these produced the largest baseline failures.
