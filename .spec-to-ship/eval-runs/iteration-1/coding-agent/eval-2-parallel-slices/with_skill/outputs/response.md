# Coding-Agent Parallelization Plan: API, Email Template, and UI Reset Flow

Spec approval status: not shown in the prompt. I would not authorize implementation or write feature artifacts until the approved spec/feature namespace is confirmed. If this is already approved, use the execution plan below.

## Approval blocker

- Blocker: approval status and feature namespace are missing from the prompt.
- Required action before execution: confirm the spec is `approved` or route back to `spec` for approval.
- The plan below is a non-executing handoff draft to expose ownership and parallelization decisions.

## Dependency graph

```text
approved spec + feature namespace
  -> API contract owner defines reset request/response schemas
      -> generated/shared types owner refreshes generated files once contract stabilizes
          -> UI owner consumes generated types
  -> Email template owner can work in parallel once API owner defines template variables
  -> Backend API owner and UI owner can use separate worktrees after file ownership is explicit
  -> Integration owner merges generated types, runs validation, and routes to review
```

## Parallelization summary

| Slice | Can run in parallel? | Owned files/globs | Shared-file owner | Worktree needed? |
|---|---:|---|---|---:|
| API reset endpoints and schemas | Yes, starts first | `**/api/**/auth*`, `**/routes/**/auth*`, backend auth tests | API owner owns API schema until generated type handoff | Yes if UI/email writers are also active |
| Email template | Yes, after template variables are named | `**/emails/**/password-reset*`, email render tests/snapshots | API owner owns variable contract; email owner owns template files | Yes if separate writer |
| UI reset flow | Yes, after provisional API shape; final pass after generated types | frontend auth reset routes/components/tests | Integration owner owns generated API/client types | Yes if backend writer is active |
| Generated/shared types integration | No, serialize this step | generated clients/types/schema snapshots/route registries | Integration owner only | No; one owner to avoid conflicts |
| Final validation/handoff | No | `.spec-to-ship/features/<feature-id>/test-report.md`, `handoff.md` | Integration owner | No |

## Shared-file ownership rule

One named integration owner owns all shared generated files, including generated API clients, schema snapshots, route registries, lockfiles if regeneration changes them, and cross-slice test snapshots. Backend and UI writers must not both regenerate or edit those files. They should stop and hand off when generated files are required.

## Tasks

### Task A — API reset endpoints and contract

**Goal**
Define and implement the backend reset API contract that the email and UI slices consume.

**Owned files/globs**
- Auth/reset API route/controller files.
- API schema/request/response definitions.
- Backend tests for reset request and token submission.
- Do not edit generated client/types after the contract handoff point.

**Artifact paths**
- `.spec-to-ship/features/<feature-id>/tasks.md`
- `.spec-to-ship/features/<feature-id>/test-report.md`

**Inputs**
- Approved spec sections for API behavior, token semantics, and user-facing response rules.

**Steps**
1. Define request-reset and reset-password request/response shapes.
2. Implement endpoint behavior and backend tests.
3. Document email template variables and UI consumption expectations.
4. Hand off schema changes to the integration owner for generated type refresh.

**Validation commands**
```bash
bun test --filter reset
bun run typecheck
```

**Rollback note**
Revert backend route/schema changes and backend tests together. If shared schema files were already regenerated, coordinate rollback with the integration owner.

**Stop conditions**
Stop if product approval, token policy, user enumeration behavior, or ownership of shared schema files is unclear.

**Next STS routing**
`worktree` for parallel writer isolation, then `tdd`; `debug` if backend tests fail unexpectedly.

### Task B — Email template

**Goal**
Create the password reset email using the API-owned variable contract.

**Owned files/globs**
- Password reset email template files.
- Email preview/render tests and snapshots.
- Do not edit API schema, generated client/types, or UI route files.

**Artifact paths**
- `.spec-to-ship/features/<feature-id>/tasks.md`
- `.spec-to-ship/features/<feature-id>/test-report.md`

**Inputs**
- Approved spec email copy and reset link expectations.
- API owner output: template variables such as reset URL and expiry text.

**Steps**
1. Implement template using the agreed variables.
2. Add or update email preview/render tests.
3. Record rendering evidence in the test report.

**Validation commands**
```bash
bun test --filter email
bun run typecheck
```

**Rollback note**
Revert only the template and email tests unless the variable contract itself is wrong; then hand back to the API owner.

**Stop conditions**
Stop if copy, branding, localization, or template variables are missing from the approved spec.

**Next STS routing**
`worktree` when running alongside API/UI writers, then `tdd`; `ui-ux-gate` if user-facing email copy/design is unresolved.

### Task C — UI reset flow

**Goal**
Build the user-facing reset request and password reset screens against the generated API types.

**Owned files/globs**
- Frontend reset routes/pages/components/forms.
- Frontend tests for forgot/reset flow.
- Do not edit backend API files or generated clients/types.

**Artifact paths**
- `.spec-to-ship/features/<feature-id>/tasks.md`
- `.spec-to-ship/features/<feature-id>/test-report.md`

**Inputs**
- Approved spec UI behavior and copy.
- Integration owner output: refreshed generated API types.

**Steps**
1. Build forgot-password request form with neutral success state.
2. Build reset-password form using token route/query conventions from the spec.
3. Cover loading, success, invalid/expired token, weak password, and network error states.
4. Use generated types after the integration owner refreshes them.

**Validation commands**
```bash
bun test --filter reset
bun run typecheck
bun run lint
```

**Rollback note**
Revert new UI route/component/test files only. Do not roll back API or generated type files from the UI worktree.

**Stop conditions**
Stop if generated types are stale, if the approved UX copy is missing, or if UI changes need design decisions not in the spec.

**Next STS routing**
`worktree` for parallel isolation, `ui-ux-gate` for UX gaps, then `tdd`.

### Task D — Generated/shared types integration

**Goal**
Serialize all shared-file updates so backend and UI writers do not conflict.

**Owned files/globs**
- Generated API clients/types.
- Schema snapshots and route registries.
- Shared lockfiles only if generation changes them.
- Integration artifact updates.

**Artifact paths**
- `.spec-to-ship/features/<feature-id>/test-report.md`
- `.spec-to-ship/features/<feature-id>/handoff.md`

**Inputs**
- API owner contract changes.
- UI owner compile needs.
- Email owner variable contract confirmation.

**Steps**
1. Refresh generated/shared files once backend contract stabilizes.
2. Notify API and UI owners that shared files are frozen unless coordinated.
3. Run typecheck and targeted integration tests.
4. Record changed shared files and validation evidence.

**Validation commands**
```bash
bun run typecheck
bun test --filter reset
```

**Rollback note**
Revert generated/shared files together with the API schema version they correspond to. Do not partially roll back generated types independent of schema changes.

**Stop conditions**
Stop if another worktree has modified generated files, if generation changes unrelated APIs, or if lockfile changes imply dependency work.

**Next STS routing**
`deps` if dependencies changed; otherwise `review` after final validation.

## Handoff prompt shape for parallel writers

```text
Goal: <API | Email template | UI reset flow slice>
Feature namespace: .spec-to-ship/features/<feature-id>/
Owned files/globs: <slice-specific files only>
Do not edit: generated API/client types, route registries, lockfiles, and other slices' files unless you are the named integration owner
Required STS skill: tdd
Validation: <slice validation commands>
Stop if: approval, product, dependency, data, security, or ownership conflict appears
Output: update .spec-to-ship/features/<feature-id>/test-report.md with changed files and fresh evidence
```

## Validation contract

Focused checks per worktree first, then integration owner runs:

```bash
bun run typecheck
bun run lint
bun test
```

No one should claim completion until fresh command output is recorded in the feature artifact.

## Rollback notes

- Roll back per slice by ownership boundary.
- Generated/shared files roll back only through the integration owner.
- If dependency or lockfile changes appear, stop and route through `deps` before release/review completion.
- If parallel writers are needed, route through `worktree` before mutation so file ownership stays isolated.
