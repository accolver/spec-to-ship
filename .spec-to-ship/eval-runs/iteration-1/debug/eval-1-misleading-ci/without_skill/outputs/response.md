# Baseline response

The Monday-only timeout suggests a time-dependent or environment-dependent issue rather than a generic login problem.

I would start by checking:

1. Whether CI runs on Mondays use a different image, dependency cache, browser version, or scheduled maintenance window.
2. Whether the login flow depends on date logic, weekly resets, token expiry, or a seeded test user whose credentials/lockout state changes after the weekend.
3. Whether the test waits for a selector that is hidden behind a slow external auth call only during Monday load.
4. Whether Monday cron jobs reset the database, invalidate sessions, or rotate secrets before the test job runs.

Likely root causes to inspect first:

- Test account state is reset or locked by a Monday maintenance job.
- Date/time code calculates a weekly boundary incorrectly.
- CI cache/dependency refresh happens Monday and changes timing.
- External auth provider is slower after weekend traffic.

Next steps:

- Compare a passing CI run and a failing Monday run.
- Check timestamps around the timeout and login API response time.
- Re-run the login test with extra logging for auth request status, response body, browser console errors, and selector wait timing.
- If the failure is caused by slow auth, increase the wait or mock the auth dependency.
- If it is caused by weekly reset/date logic, add a regression test pinned to Monday and fix that logic.
