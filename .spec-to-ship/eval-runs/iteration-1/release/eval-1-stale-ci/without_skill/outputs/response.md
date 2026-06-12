# Baseline generic-agent response

I can prepare the release notes, but I would not publish immediately from a CI run that only covered yesterday's revision. The last commit must be included in the verified build.

Suggested release notes draft:

- Include the changes from the final commit.
- Note any user-facing behavior changes, fixes, and operational considerations.
- Confirm there are no unresolved known issues.

Before shipping:

1. Identify the exact commit/SHA intended for release.
2. Confirm CI has passed for that same SHA, not only an earlier commit.
3. If CI has not run on the latest commit, rerun CI or wait for it to finish.
4. Ship only after the current release commit is green.

Status: hold the release until CI passes for the exact final commit.
