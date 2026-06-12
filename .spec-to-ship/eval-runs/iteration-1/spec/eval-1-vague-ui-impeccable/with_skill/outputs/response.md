# STS spec response: admin notification settings dashboard

I would create the feature spec at `.spec-to-ship/features/20260612-admin-notification-settings/spec.md` and stop before implementation. This is UI/UX work, so the spec must route through `ui-ux-gate` and external Impeccable before the spec is final.

## UI/UX gate and Impeccable state

- `ui-ux-gate`: required because the request mentions a settings dashboard and polish.
- Impeccable install state: available in installed skill locations, but project design context is not initialized. The Impeccable context loader reported `hasProduct=false` and `hasDesign=false` for this project.
- Result: UI/UX shaping is blocked until the user either initializes Impeccable context or explicitly accepts degraded mode.
- Next blocking user decision: may I run the project Impeccable setup flow (`/impeccable init` / teach context, then `/impeccable shape admin notification settings dashboard`) before finalizing the UI requirements?

## Draft `.spec-to-ship/features/20260612-admin-notification-settings/spec.md`

### Feature namespace

`.spec-to-ship/features/20260612-admin-notification-settings/`

### Sources inspected

- User request: “Add a settings dashboard where admins can manage notification preferences. We need it to feel polished but I have not decided exact fields.”
- Project lifecycle: `SPEC-TO-SHIP.md`
- STS `spec` skill and spec template
- `ui-ux-gate` skill and Impeccable routing references
- External Impeccable skill setup and shape guidance

### Problem

Admins need a polished settings surface for managing notification preferences, but the exact preference fields and information architecture are not yet defined. Building now would likely hard-code the wrong model and produce generic UI.

### Users and outcomes

- Primary user: admins configuring notification behavior for themselves, their organization, or managed users.
- Outcome: admins can understand what notifications exist, adjust allowed preferences safely, and trust that changes were saved.
- Product outcome: notification behavior becomes explicit and auditable instead of hidden in code or support workflows.

### Scope

- Create a namespaced specification for the dashboard before implementation.
- Define the first version of the admin notification preference management experience.
- Identify likely entities, states, permission boundaries, and verification needs.
- Use Impeccable shape guidance to finalize visual hierarchy, layout strategy, copy, responsive behavior, and interaction model.

### Non-goals

- No implementation in this step.
- No database migration, API route, or UI component changes before approval.
- No final field list until the product owner confirms notification channels, ownership model, and compliance/audit needs.
- No shared root `SPEC.md`.

### Constraints

- Admin-only access must be enforced in UI and API layers.
- UI must include loading, empty, validation, error, success, and permission-denied states.
- Preference labels and descriptions must be clear enough that admins understand consequences before saving.
- The design must pass the Impeccable UI/UX gate before implementation planning.

### Interfaces touched

- Admin settings route/navigation
- Notification preference frontend components
- Preference read/update API
- Notification preference persistence model
- Authorization checks for admin-only access
- Audit/logging path if preference changes are compliance-relevant
- Existing notification delivery code that consumes preferences

### UI/UX requirements

Status: blocked pending Impeccable initialization/shape confirmation.

Required before final spec approval:

- Confirm product/design context through Impeccable.
- Run Impeccable shape for this dashboard because fields and polish expectations are unresolved.
- Capture a design brief covering primary admin action, layout strategy, key states, interaction model, content requirements, responsive behavior, and accessibility.
- Avoid treating “polished” as final visual cleanup only; design requirements must shape the spec before implementation.

Initial UI requirements to carry into shaping:

- Use progressive disclosure for advanced or risky notification controls.
- Make save/cancel state, unsaved changes, and validation feedback explicit.
- Include clear copy for each preference’s effect.
- Avoid modal-first management unless shape work shows a modal is the right affordance.
- Support desktop admin workflows and a responsive fallback.

### Acceptance criteria

- [ ] A namespaced spec exists at `.spec-to-ship/features/20260612-admin-notification-settings/spec.md`.
- [ ] The spec records Impeccable install/init state and UI/UX shaping evidence.
- [ ] Admin-only access requirements are documented for both UI and API.
- [ ] Notification preference ownership is defined: global, organization, role, or individual admin.
- [ ] Notification channels and categories for v1 are explicitly listed or intentionally deferred.
- [ ] Loading, empty, error, validation, unsaved-change, success, and permission-denied states are specified.
- [ ] The spec has user-approved acceptance criteria before implementation starts.

### Verification plan

- Focused checks: route access, API authorization, validation behavior, preference persistence, and consumer integration tests once implementation begins.
- Broader checks: regression tests for existing notification delivery behavior.
- Manual/design QA: Impeccable-informed review of hierarchy, copy, responsive behavior, accessibility, and polish before release.

### Risks and assumptions

- Risk: exact fields are undecided, so premature implementation may create the wrong data model.
- Risk: notification controls can affect compliance-sensitive communications.
- Risk: unclear ownership model can produce confusing or conflicting preferences.
- Assumption: this is an admin settings dashboard, not a user self-service preferences page.
- Assumption: no implementation should begin until UI/UX shaping and approval are complete.

### Open questions

Blocking before final spec approval:

1. Are preferences global, organization-level, role-level, individual-admin, or per-user/customer?
2. Which channels and notification categories are in v1?
3. Are audit history, compliance exemptions, or required notifications in scope?

Non-blocking details can be recorded after the first Impeccable shape round.

### Approval status

`blocked` — awaiting Impeccable/project design initialization and user confirmation of the blocking product questions. No implementation should start.
