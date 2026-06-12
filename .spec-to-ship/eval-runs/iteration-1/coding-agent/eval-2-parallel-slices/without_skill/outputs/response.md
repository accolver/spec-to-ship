# Implementation Plan: API, Email Template, and UI Reset Flow

## Scope
Build the password reset API, reset email template, and UI reset flow. Backend and UI work can proceed mostly in parallel, but generated types should be refreshed before final integration.

## Tasks
1. API
   - Add request-reset endpoint.
   - Add reset-password endpoint.
   - Add token persistence and expiration handling.
   - Add API tests for successful and invalid token cases.

2. Email template
   - Add the reset-password email template.
   - Include reset link, expiration time, and support copy.
   - Add a snapshot or rendering test if available.

3. UI reset flow
   - Add forgot-password page/form.
   - Add reset-password page/form.
   - Handle loading, success, expired token, invalid token, and password validation errors.
   - Add component or route tests.

4. Shared generated types
   - After API contracts are ready, regenerate types.
   - Update the UI to use the generated request/response types.

## Coordination
Backend and UI can start independently if they agree on the initial API shape. Once the API is implemented, regenerate types and do a final integration pass to ensure the UI compiles and works against the actual API.

## Validation
```bash
bun test
bun run typecheck
bun run lint
```
