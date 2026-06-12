# With-skill response

I would not quarantine the flaky test blindly. Quarantine hides signal and can ship the regression, so it needs explicit approval plus a follow-up risk record.

# Debug Report

## Symptom

A test flakes randomly, and the request is to quarantine it only to make CI green.

## Environment and versions

Capture before any change:

- test name/file and failure message
- CI run IDs and commit SHAs where it failed/passed
- test seed, retry count, shard/worker count, and whether tests run in parallel
- runner OS/image, browser/runtime versions, database/cache state, and timing histogram

## Reproduction

- Run the single test repeatedly with a fixed seed.
- Then vary exactly one factor at a time: seed, parallelism, clock/timers, network/mock behavior, shared DB/cache state.
- If available, use a loop such as `for i in {1..30}; do <test-command> --seed <seed>; done` and record pass/fail frequency.

## Ranked hypotheses

| Rank | Hypothesis | Evidence for | Evidence against | Status |
|---:|---|---|---|---|
| 1 | Order or shared-state leak between tests | Random flakes often correlate with parallelism/order | Needs isolated vs full-suite comparison | Test first |
| 2 | Async timing/race condition | Flake described as random | Needs trace/timing logs | Pending |
| 3 | Uncontrolled random seed/time dependency | Randomness mentioned | Needs fixed-seed reproduction | Pending |
| 4 | External service/network dependency | Common CI-only flake cause | Needs network/mock evidence | Pending |

## Quarantine decision

I need approval before quarantining. If you still want a temporary quarantine, please confirm that you accept these conditions:

- the quarantine is documented as a risk, not a fix
- a follow-up issue/task is created with owner and deadline
- the debug evidence above is attached
- the quarantine is narrowly scoped to this test only

## Fix direction

Prefer proving and fixing the flake cause: isolate shared state, control seed/time, await the actual condition, or replace external dependencies with deterministic fakes.

## Regression coverage

The final fix should include a deterministic regression, such as a repeated-run test, fixed-seed case, or parallelism/order case that previously reproduced the flake.
