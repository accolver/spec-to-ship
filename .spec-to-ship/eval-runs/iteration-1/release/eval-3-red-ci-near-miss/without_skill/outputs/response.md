# Baseline generic-agent response

Do not ship while CI is failing on the release branch.

Recommended sequence:

1. Inspect the failing CI job and logs.
2. Fix the failing tests or build issue on the release branch.
3. Rerun the full CI pipeline.
4. Confirm the release branch is green after the fix.
5. Prepare release notes and ship only after the successful run is visible.

Status: release is blocked until CI is fixed and green.
