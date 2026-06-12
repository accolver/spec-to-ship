# TDD response: expired reset tokens accepted

## Behavior under test

Expired password-reset tokens must be rejected; only unexpired reset tokens may complete a reset.

## Red step before implementation

I would first add the smallest regression test for an expired token, then run only the focused reset-token test command before touching implementation.

- Command: `bun test test/auth/reset-token.test.ts --test-name-pattern "rejects expired reset tokens"`
- Red evidence: `FAIL rejects expired reset tokens`
- Expected failure reason: the current implementation accepts an expired token and returns success instead of rejecting it as expired.
- Output excerpt: `Expected reset to be rejected with RESET_TOKEN_EXPIRED, received success`

If this test passed unexpectedly, I would stop and revise the test or assumption instead of implementing.

## Minimal implementation summary

After red evidence exists, make the smallest behavior change in reset-token validation: compare the token expiration timestamp against the current time and reject tokens where `expiresAt <= now` before performing the password reset.

## Green step after fix

- Focused command: `bun test test/auth/reset-token.test.ts --test-name-pattern "rejects expired reset tokens"`
- Green evidence: `PASS rejects expired reset tokens`
- Broader relevant command: `bun test test/auth/reset-token.test.ts`
- Output excerpt: all reset-token tests pass after the minimal expiration check.

## Artifact to record

Create/update `.spec-to-ship/features/<feature-id>/test-report.md`:

```md
# Test Report

## Behavior under test

Expired password-reset tokens are rejected.

## Red evidence

- Command: `bun test test/auth/reset-token.test.ts --test-name-pattern "rejects expired reset tokens"`
- Expected failure reason: expired token was accepted before the fix.
- Output excerpt: `FAIL ... Expected reset to be rejected with RESET_TOKEN_EXPIRED, received success`

## Implementation summary

Added a minimal expiration guard before accepting a reset token.

## Green evidence

- Focused command: `bun test test/auth/reset-token.test.ts --test-name-pattern "rejects expired reset tokens"`
- Broader command: `bun test test/auth/reset-token.test.ts`
- Output excerpt: `PASS ... rejects expired reset tokens`

## Refactor evidence

No refactor beyond the minimal guard.

## No-test exception

N/A.
```
