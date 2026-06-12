# Finish Skill Iteration 1 Benchmark

Workspace: `.spec-to-ship/eval-runs/iteration-1/finish`

| Eval | Without skill | With skill | Delta |
|---|---:|---:|---:|
| 1 clean-merged | 0.0% (0/3) | 100.0% (3/3) | 100.0% |
| 2 dirty-unmerged | 0.0% (0/3) | 100.0% (3/3) | 100.0% |
| 3 pr-hold | 33.3% (1/3) | 100.0% (3/3) | 66.7% |
| **Aggregate** | **11.1% (1/9)** | **100.0% (9/9)** | **88.9%** |

## Top fixes

- Skill outputs passed all current assertions; no urgent finish skill change required from iteration 1.
- Consider adding a compact finish.md template so agents consistently record verification, decision, commands, and final state.
- Consider adding explicit example commands for merged-state checks (`git branch --merged` or merge-base) and exact-path worktree removal.
- Consider strengthening refusal wording around dirty/unmerged worktrees and `--force` deletion.
