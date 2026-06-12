# Coding-Agent Plan: Password Reset

Feature namespace: `.spec-to-ship/features/20260612-auth/`
Spec: `.spec-to-ship/features/20260612-auth/spec.md`
Spec approval status: `approved` per prompt.

> Eval note: in a live run I would save this as `.spec-to-ship/features/20260612-auth/plan.md` and create matching task artifacts. This eval response keeps artifacts under the requested eval workspace only.

## Dependency graph

```text
approved spec
  -> confirm local preferences and existing auth/email/test conventions
  -> Slice 1: reset token data model + service contract
      -> Slice 2: request-reset API + email enqueue
          -> Slice 3: reset-password API + token consumption
              -> Slice 4: UI forgot/reset password flow
                  -> Slice 5: integration validation + release handoff

Shared constraints:
  - Database migration must land before API tests that depend on token storage.
  - API route/request/response shape must be stable before generated client/types are refreshed.
  - Email template may run in parallel after Slice 2 defines link variables, but API owns the contract.
```

## Parallelization summary

| Slice | Can run in parallel? | Owned files/globs | Shared-file owner | Worktree needed? |
|---|---:|---|---|---:|
| 1. Token model/service | No, prerequisite | `**/migrations/*password*reset*`, `**/auth/**`, `**/password-reset*.{ts,tsx}` | Backend owner | No |
| 2. Request-reset API + email contract | After Slice 1 | `**/routes/**/auth*`, `**/api/**/auth*`, `**/email/**/password-reset*`, API tests | Backend owner owns generated API schema until handoff | No |
| 3. Reset-password API | After Slice 1; can overlap with email template if files do not overlap | `**/auth/**`, `**/users/**`, reset endpoint tests | Backend owner | Yes if separate backend/email writers are used |
| 4. UI forgot/reset flow | After API shape is stable; can parallelize with email template | frontend auth routes/components/tests only | Integration owner owns generated client/types | Yes for UI writer |
| 5. Integration + validation | No, final step | generated client/types, `plan.md`, `tasks.md`, test report | Integration owner | No |

## Tasks

### Task 1 — Token model and password reset service

**Goal**
Create the secure token persistence and service boundary needed by all later slices.

**Owned files/globs**
- Database migration files for password reset tokens.
- Auth/password reset service files.
- Unit tests next to the service.

**Artifact paths**
- `.spec-to-ship/features/20260612-auth/tasks.md`
- `.spec-to-ship/features/20260612-auth/test-report.md`

**Inputs**
- Spec sections: password reset token behavior, expiry, consumption, abuse/rate-limit notes.
- Prior task outputs: none.

**Steps**
1. Inspect existing auth, user, and migration conventions.
2. Add reset token storage using hashed tokens, expiration, consumed/revoked state, and user association.
3. Add service functions for create, validate, consume, and invalidate token flows.
4. Add tests for valid token, expired token, consumed token, and unknown token.

**Validation commands**
```bash
bun run typecheck
bun test --filter password-reset
bun test --filter auth
```

**Rollback note**
Revert the migration and service changes together. If the migration has been applied to a shared database, add a rollback migration rather than deleting history.

**Stop conditions**
Stop if the spec omits token expiry/security requirements, if migration ordering conflicts with existing auth work, or if token storage would expose raw tokens.

**Next STS routing**
`tdd` for implementation; `debug` if auth tests fail unexpectedly.

### Task 2 — Request-reset API and email handoff

**Goal**
Add the API entry point that accepts a reset request and triggers the email path without leaking account existence.

**Owned files/globs**
- Auth API route/controller files.
- API request/response schema files.
- Password reset request API tests.
- Email job/enqueue integration points, but not the final template copy if assigned separately.

**Artifact paths**
- `.spec-to-ship/features/20260612-auth/tasks.md`
- `.spec-to-ship/features/20260612-auth/test-report.md`

**Inputs**
- Spec sections: request reset behavior, response copy, email delivery expectation.
- Prior task outputs: token service from Task 1.

**Steps**
1. Add request-reset endpoint and validation.
2. Call token creation for existing users while returning the same user-facing response for unknown emails.
3. Enqueue or send the reset email using a documented variable contract.
4. Add tests for existing email, unknown email, rate-limit/abuse expectations if specified, and email enqueue behavior.

**Validation commands**
```bash
bun test --filter request-reset
bun run typecheck
bun run lint
```

**Rollback note**
Remove the route/schema and email enqueue integration. Keep Task 1 if downstream reset endpoint still needs it; otherwise roll Task 1 back as a unit.

**Stop conditions**
Stop if the email provider contract is unclear, user enumeration behavior is unspecified, or adding the route changes public API compatibility beyond the approved spec.

**Next STS routing**
`tdd`; `deps` if a new email or crypto dependency is proposed.

### Task 3 — Reset-password API and token consumption

**Goal**
Allow a user with a valid reset token to set a new password exactly once.

**Owned files/globs**
- Reset-password API route/controller files.
- Password validation and auth service files.
- Reset endpoint tests.

**Artifact paths**
- `.spec-to-ship/features/20260612-auth/tasks.md`
- `.spec-to-ship/features/20260612-auth/test-report.md`

**Inputs**
- Spec sections: password policy, invalid/expired token behavior, session behavior after reset.
- Prior task outputs: token service from Task 1.

**Steps**
1. Add reset endpoint request validation.
2. Validate token, enforce password policy, update password, and consume token atomically.
3. Invalidate sessions or refresh auth state if required by the spec.
4. Add tests for success, expired token, consumed token, weak password, and token reuse.

**Validation commands**
```bash
bun test --filter reset-password
bun test --filter auth
bun run typecheck
```

**Rollback note**
Revert the endpoint and related password reset service calls. If password policy behavior changes unexpectedly, isolate that rollback from token storage.

**Stop conditions**
Stop on unclear password policy, session invalidation ambiguity, or inability to consume tokens atomically.

**Next STS routing**
`tdd`; `debug` for unexpected auth/session failures.

### Task 4 — UI forgot/reset password flow

**Goal**
Add user-facing screens for requesting a reset link and setting a new password.

**Owned files/globs**
- Frontend auth routes/pages/components for forgot password and reset password.
- Frontend form validation and UI tests.
- Do not edit backend API files or generated clients unless assigned as integration owner.

**Artifact paths**
- `.spec-to-ship/features/20260612-auth/tasks.md`
- `.spec-to-ship/features/20260612-auth/test-report.md`

**Inputs**
- Spec sections: user-facing copy, form fields, success/error states.
- Prior task outputs: stable API request/response contract from Tasks 2 and 3.

**Steps**
1. Build forgot-password form with neutral success state.
2. Build reset-password form that reads token from the approved URL shape.
3. Handle loading, success, expired/invalid token, weak password, and network errors.
4. Add route/component tests and basic accessibility checks.

**Validation commands**
```bash
bun test --filter password-reset
bun run typecheck
bun run lint
```

**Rollback note**
Remove only the new UI routes/components and references. Do not roll back backend slices unless integration proves the API contract is wrong.

**Stop conditions**
Stop if approved copy, route paths, or accessibility expectations are missing; route to `ui-ux-gate` for unresolved UX decisions.

**Next STS routing**
`ui-ux-gate` if UI requirements are incomplete; otherwise `tdd` then `review`.

### Task 5 — Integration, generated types, and release handoff

**Goal**
Verify the complete password reset flow and prepare review/release artifacts.

**Owned files/globs**
- Generated API client/types.
- `.spec-to-ship/features/20260612-auth/plan.md`
- `.spec-to-ship/features/20260612-auth/tasks.md`
- `.spec-to-ship/features/20260612-auth/test-report.md`
- `.spec-to-ship/features/20260612-auth/review.md`

**Artifact paths**
- `.spec-to-ship/features/20260612-auth/test-report.md`
- `.spec-to-ship/features/20260612-auth/handoff.md`

**Inputs**
- Prior task outputs: Tasks 1-4.

**Steps**
1. Regenerate shared API/client types after backend route shapes are final.
2. Run backend, frontend, and integration checks.
3. Record exact commands and evidence in `test-report.md`.
4. Prepare handoff for `review` with changed files, known risks, and rollback notes.

**Validation commands**
```bash
bun run typecheck
bun run lint
bun test
```

**Rollback note**
Revert generated types and integration changes first. If full rollback is required, revert slices in reverse dependency order: UI, reset API, request API/email, token service/migration.

**Stop conditions**
Stop if generated files conflict with active work, if validation evidence is missing, or if any product/security requirement differs from the approved spec.

**Next STS routing**
`review`, then `release` if review and CI are green; `debug` if validation fails.

## Validation contract

Minimum fresh evidence before claiming implementation is ready:

```bash
bun run typecheck
bun run lint
bun test
```

Prefer narrower focused commands during each slice, then full validation at integration.

## Rollback notes

- Roll back in reverse dependency order: UI/integration, reset endpoint, request endpoint/email, token service/migration.
- Treat applied migrations as irreversible history in shared environments; create rollback migrations instead of deleting migration files.
- Roll back generated types with the API route shape they came from.
- Record all rollback commands and validation evidence in `.spec-to-ship/features/20260612-auth/test-report.md` or `handoff.md`.
