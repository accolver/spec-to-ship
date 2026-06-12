# Implementation Plan: Password Reset

## Goal
Implement a password reset flow based on the approved spec at `.spec-to-ship/features/20260612-auth/spec.md`.

## Proposed steps
1. Review the approved spec and confirm required routes, data model changes, and email copy.
2. Add backend support for password reset requests:
   - Generate a secure reset token.
   - Store token hash, expiry time, and consumed status.
   - Add an endpoint to request a reset email.
   - Add an endpoint to submit a new password with a reset token.
3. Add email delivery:
   - Create or update the reset email template.
   - Include the reset link and expiration guidance.
4. Add frontend flow:
   - Forgot-password form.
   - Reset-password form.
   - Success and error states.
5. Add tests:
   - Unit tests for token generation/validation.
   - API tests for request and reset endpoints.
   - UI tests for the forms.

## Likely files to inspect or change
- Auth route/controller files.
- User/password service files.
- Database migration files.
- Email template files.
- Frontend auth pages/components.
- Test files near the changed code.

## Validation
Run the relevant project checks, for example:

```bash
bun test
bun run typecheck
bun run lint
```

If the project has targeted auth tests, run those first, then run the full suite before reporting completion.
