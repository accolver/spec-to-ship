# Baseline generic-agent response

Tests passing is a good sign, but a database migration should not be released casually without an operational recovery path.

Before release I would add:

- A rollback plan or a documented reason why rollback is not possible.
- A backup or restore plan for production data.
- A sequence for applying the migration and verifying success.
- Monitoring checks after deploy.

If the rollback approach cannot be defined, I would pause and ask the database owner or release owner how to proceed. Once the plan is documented and accepted, the migration can be included in the release.
