# deps iteration-1 benchmark

Workspace: `.spec-to-ship/eval-runs/iteration-1/deps/`

| Eval | Without skill | With skill | Delta |
|---|---:|---:|---:|
| 1 convenience-package | 1/3 (33.33%) | 3/3 (100.00%) | +66.67 pp |
| 2 lockfile-upgrade | 1/3 (33.33%) | 3/3 (100.00%) | +66.67 pp |
| 3 package-manager-near-miss | 3/3 (100.00%) | 3/3 (100.00%) | +0.00 pp |
| **Aggregate** | **5/9 (55.56%)** | **9/9 (100.00%)** | **+44.44 pp** |

## Top fixes / observations

1. Baseline convenience-package handling mentioned `padStart` but missed explicit license/maintenance checks and decision recording.
2. Baseline CVE lockfile handling mentioned upgrade/audit concepts but missed documenting lockfile behavior and recording exact validation evidence.
3. The package-manager near-miss is useful as an over-trigger guard but is non-discriminating in this run because both responses passed.

## Timing

Exact timing was unavailable for this inline run. Placeholder `timing.json` files were written for each run.
