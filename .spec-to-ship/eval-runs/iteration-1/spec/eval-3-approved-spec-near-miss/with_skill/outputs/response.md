# STS boundary response: approved auth spec already exists

This should not create or rewrite a spec. The user says an approved spec already exists at `.spec-to-ship/features/20260612-auth/spec.md` and asks to break it into tasks, so this crosses the `spec` boundary and should route to `coding-agent`.

## Handoff

- Route: `coding-agent`
- Reuse feature namespace: `.spec-to-ship/features/20260612-auth/`
- Source of truth: `.spec-to-ship/features/20260612-auth/spec.md`
- Do not create a new shared `SPEC.md`.
- Do not create a new feature namespace.
- Do not rewrite the approved `spec.md` unless `coding-agent` discovers a contradiction or missing approval and returns to the user for clarification.

## Instruction for `coding-agent`

Read `.spec-to-ship/features/20260612-auth/spec.md`, preserve that namespace, and break the approved requirements into implementation slices/tasks with dependencies and verification steps. Stop and ask only if the approved spec is missing, not actually approved, or internally inconsistent.
