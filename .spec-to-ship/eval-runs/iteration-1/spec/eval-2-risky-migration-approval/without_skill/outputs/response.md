# Account ID UUID Migration — Draft Spec

## Goal
Change account IDs from integer identifiers to UUIDs across the API and database while preserving existing behavior for users and integrations.

## Scope
- Database schema changes for account primary keys and foreign keys.
- API request/response payloads that expose account IDs.
- Background jobs, webhooks, and internal services that reference account IDs.
- Tests and migration tooling.

## Risks
- Data migration could break foreign-key relationships.
- External clients may rely on numeric account IDs.
- Caches, logs, analytics, or URLs may contain old IDs.
- Rollback is difficult once UUIDs become externally visible.

## Proposed approach
1. Add UUID column to accounts and backfill values.
2. Add UUID references alongside existing integer references in related tables.
3. Update application code to read/write UUIDs while keeping integer IDs available internally during transition.
4. Update API contracts and documentation.
5. Run validation scripts to compare integer-to-UUID mappings.
6. Cut over once validation passes.

## Acceptance criteria
- Every account has a stable UUID.
- All account-related API responses use UUIDs where public IDs are expected.
- Existing data relationships remain intact after migration.
- Tests cover migration, API compatibility, and rollback considerations.
- External clients receive a migration notice if the public contract changes.

## Approval gate
Do not implement until the migration plan, compatibility requirements, and rollback strategy are reviewed and approved.
