# STS spec response: account integer IDs to UUIDs

I would write a draft spec at `.spec-to-ship/features/20260612-account-id-uuid-migration/spec.md` and stop before implementation. This is a risky data/API migration, so approval is required before coding.

## Draft `.spec-to-ship/features/20260612-account-id-uuid-migration/spec.md`

### Feature namespace

`.spec-to-ship/features/20260612-account-id-uuid-migration/`

### Sources inspected

- User request: “We need to change account IDs from integers to UUIDs across the API and database. Start by writing the spec.”
- Project lifecycle: `SPEC-TO-SHIP.md`
- STS `spec` skill and spec quality/template references

### Problem

Account identifiers are currently integers. The system needs UUID account identifiers across the API and database without corrupting existing relationships, breaking clients unexpectedly, or losing the ability to verify and roll back the migration.

### Users and outcomes

- API consumers receive stable UUID account identifiers where public account IDs are exposed.
- Internal engineering and operations teams can migrate safely with validation evidence.
- Product users experience no account data loss, authorization regression, or broken links.

### Scope

- Define the target public account identifier behavior.
- Inventory all database, API, job, webhook, cache, log, analytics, and documentation surfaces that expose or depend on account IDs.
- Plan a staged migration with validation checkpoints and explicit rollback/mitigation decisions.
- Specify test and verification requirements before implementation.

### Non-goals

- No schema changes, code changes, backfills, or API cutover in this step.
- No unrelated authentication, authorization, or account-model redesign.
- No removal of integer IDs until compatibility and rollback constraints are approved.
- No shared root `SPEC.md`.

### Constraints

- Existing account relationships must remain intact.
- External API compatibility requirements must be explicit before changing response/request contracts.
- Migration must be observable and auditable.
- Any dual-write/dual-read period must have a defined exit condition.
- Approval is required before implementation because this touches durable data and public interfaces.

### Interfaces touched

- Accounts table primary/public identifier columns
- All foreign keys and join tables referencing accounts
- API request path parameters, query parameters, request bodies, and response bodies containing account IDs
- SDKs, API docs, generated clients, and OpenAPI/schema files if present
- Webhooks and event payloads containing account IDs
- Background jobs, queues, scheduled tasks, and imports/exports
- Authorization checks and account lookup paths
- Caches, search indexes, analytics events, logs, audit logs, and support tooling
- Test fixtures, seed data, factories, and migration scripts

### UI/UX requirements

Not applicable unless account IDs are visible in user-facing URLs, dashboards, support tools, or error messages. If user-facing surfaces are discovered, route that portion through `ui-ux-gate` before final approval.

### Acceptance criteria

- [ ] The approved spec names every account-ID interface that must be migrated or explicitly left unchanged.
- [ ] The migration plan preserves a verified integer-to-UUID mapping for every existing account.
- [ ] API compatibility behavior is defined for old integer inputs, new UUID inputs, and error responses.
- [ ] Data migration validation includes counts, orphan checks, duplicate checks, and representative relationship checks.
- [ ] Rollback or forward-fix strategy is documented before any irreversible cutover.
- [ ] Tests cover schema migration, account lookup behavior, authorization, API serialization/deserialization, webhooks/events, and fixtures.
- [ ] Operational monitoring and cutover criteria are defined before implementation starts.

### Verification plan

- Focused checks: migration dry-run, row counts, UUID uniqueness, foreign-key/orphan validation, API contract tests, authorization regression tests, and webhook payload tests.
- Broader checks: full backend test suite, integration tests for major account flows, SDK/client generation checks if applicable, and staging smoke test with production-like data volume.
- Manual/operational checks: migration runbook review, rollback/forward-fix rehearsal, API consumer communication plan, and post-cutover monitoring checklist.

### Risks and assumptions

- Data risk: a partial backfill or incorrect mapping can corrupt account relationships.
- API risk: external clients may validate IDs as integers or store them in integer columns.
- Authorization risk: lookup changes can accidentally bypass or deny account access.
- Operational risk: caches, analytics, logs, and queued jobs may mix old and new identifiers.
- Rollback risk: once UUIDs are exposed externally, reverting the public contract may be impossible.
- Assumption: UUIDs are intended as public account identifiers; internal integer surrogate keys may remain if that lowers risk.

### Open questions

1. Are UUIDs replacing integer primary keys, or becoming stable public IDs while internal integer keys remain?
2. Must API consumers continue to send integer IDs during a compatibility window?
3. Which external clients, SDKs, webhooks, and data exports depend on numeric account IDs?
4. What production data volume and downtime constraints apply to the migration?

### Approval status

`pending-user-approval` — the migration is non-trivial and risky. Do not implement until the spec, compatibility policy, runbook, and verification plan are approved.
