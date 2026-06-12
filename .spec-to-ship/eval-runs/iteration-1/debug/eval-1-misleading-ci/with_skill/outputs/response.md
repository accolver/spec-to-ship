# With-skill response

# Debug Report

## Symptom

CI reports the login test timed out, but the failure pattern is Monday-only. That makes the timeout message a symptom, not yet a root cause.

## Environment and timing evidence to record first

Because the prompt does not include logs or repo files, I would not claim a proven root cause yet. I would capture:

- failing and passing CI run IDs, commit SHA, runner image, browser version, dependency/cache key
- exact failure timestamp in UTC and project-local timezone
- CI timezone and any `TZ` setting
- test seed, retry count, shard/parallel worker count, and login test duration histogram
- auth endpoint status/latency, browser console errors, and network trace at timeout
- Monday cron/scheduled jobs: DB reset, account cleanup, token/secret rotation, cache refresh

## Reproduction

- Command/steps: rerun the same commit with the same CI image and test seed while changing only the clock/timezone variable.
- Frequency: compare Monday UTC/local against adjacent Sunday/Tuesday runs.
- Seed/timezone/timing details: pin `TZ`, freeze the test clock where possible, and record selector wait timing plus auth request timing.

## Ranked hypotheses

| Rank | Hypothesis | Evidence for | Evidence against | Status |
|---:|---|---|---|---|
| 1 | Date/timezone weekly-boundary bug in login/session setup | Monday-only correlation; login timeout can hide session-expiry/setup failure | Not proven until the same commit fails only under Monday clock/TZ | Test first |
| 2 | Scheduled Monday data/account cleanup invalidates the test login user | Monday-only pattern; login flows commonly depend on stable seeded users | Needs CI DB/account audit trail | Pending |
| 3 | Monday dependency/cache/runner refresh changes browser or package behavior | CI-only and weekly cadence | Would usually affect more than login; compare image/cache hashes | Pending |
| 4 | External auth provider is slow on Mondays | Timeout symptom | Needs network timing; should not assume without latency evidence | Pending |

## Tests performed / disconfirmed leads

Change one variable per test:

1. Same commit, same runner image, same seed; pin clock to Monday vs Tuesday. If Monday fails and Tuesday passes, this disconfirms generic CI slowness.
2. Same Monday-pinned run; swap only the test account/data snapshot. If a fresh account passes, this supports scheduled account cleanup and disconfirms browser-version causes.
3. Same Monday-pinned run; inspect auth network timing. If requests return quickly but UI waits forever, this disconfirms external auth slowness and points to client/session state.

Do not “fix” by increasing the timeout until these leads are tested, because that patches the symptom.

## Root cause

Not proven from the prompt alone. The root cause should be recorded only with exact file/line/config/data/environment evidence, for example: the date-pinned Monday run fails on the same commit while Tuesday passes, plus logs showing the login fixture creates an expired Monday session or the Monday cleanup deletes/locks the seeded user.

## Fix

After evidence identifies the cause, make the minimal fix to the date/session/account setup logic rather than changing the test timeout.

## Regression coverage

Add a regression that pins the relevant Monday timezone/date or account-cleanup condition so the failure cannot recur silently.

## Remaining risk

Without CI logs and repo files, this is an investigation plan with evidence thresholds, not a completed root-cause proof.
