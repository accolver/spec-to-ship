# Generic CI Failure Triage

CI is red, so I would not treat this branch as ready.

## Next investigation steps

1. Open the failing CI job and identify the first failing command or test, not just the final summary.
2. Reproduce the failing command locally if possible.
3. Compare the failure against recent branch changes to identify likely files or commits involved.
4. Fix the underlying issue, then rerun the relevant local check and the CI job.

## Status

No readiness or merge approval should be claimed until the CI failure has been investigated and resolved with fresh passing evidence.
