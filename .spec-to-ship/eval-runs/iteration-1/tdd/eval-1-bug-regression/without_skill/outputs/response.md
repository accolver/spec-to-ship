# Response

I would fix the expired reset token bug by adding coverage around password reset validation and then tightening the token-expiration check.

Plan:

1. Add or update a password reset test for an expired token.
2. Run the related auth/password-reset tests.
3. Update the reset-token validation so tokens with `expiresAt` before the current time are rejected.
4. Re-run the tests and confirm the regression is fixed.

Likely implementation sketch:

```ts
if (!token || token.expiresAt < new Date()) {
  throw new Error("Reset token has expired");
}
```

Then I would run the relevant test command and commit the change once the suite passes.
