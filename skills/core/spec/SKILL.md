---
name: spec
description: Captures requirements and writes scoped engineering specs with outcomes, constraints, non-goals, interfaces, acceptance criteria, risks, assumptions, approval status, and open questions. Use when starting a new feature, unclear or risky change, requirements gathering, scope definition, acceptance criteria, or UI/UX planning; not for already-approved implementation planning or simple edits.
license: MIT
metadata:
  package: spec-to-ship
  version: "0.1.0"
---

# Spec

## Overview

Turn unclear intent into a namespaced engineering spec that can drive planning, implementation, testing, review, and release.

## When to use

- New features, risky refactors, architecture changes, migrations, or behavior changes with unclear acceptance criteria.
- Requests that mention requirements, scope, acceptance criteria, product behavior, user outcomes, or design requirements.
- Any UI/UX work, where this skill must route through `ui-ux-gate` and external Impeccable before the spec is finalized.

## Do not use when

- Do not implement code.
- Do not create a shared root `SPEC.md`.
- Do not skip approval for non-trivial or risky work.

## Boundary rules

- If an approved `spec.md` already exists and the user asks to plan, build, split, or delegate, hand off to `coding-agent` instead of rewriting the spec.
- Reuse an existing feature namespace when the prompt, branch, or artifacts identify one.
- Use approval status values from `templates/spec.md`.

## Process

1. Create or reuse a feature namespace under `.spec-to-ship/features/<feature-id>/`.
2. Read relevant project instructions, existing docs, and code before inventing structure.
3. Clarify only blocking ambiguity; otherwise record assumptions and risks.
4. If UI/UX is involved, load `ui-ux-gate` and invoke external Impeccable so design requirements shape the spec.
5. Write `spec.md` with problem, users, outcomes, scope, non-goals, constraints, interfaces, acceptance criteria, negative/boundary verification expectations, runtime/demo proof requirements, risks, assumptions, open questions, and approval status.
6. Stop before implementation until the spec is approved when scope is non-trivial.

## Outputs

- `.spec-to-ship/features/<feature-id>/spec.md`

## References

- [templates/spec.md](templates/spec.md)
- [references/spec-quality.md](references/spec-quality.md)

## Common rationalizations to reject

- "This is small enough to skip the artifact." If the task triggered this skill, record the lightweight artifact.
- "The agent can remember the context." Use the feature namespace so teammates and subagents can work safely.
- "The tests probably pass." Claims require fresh evidence.

## Red flags

- Writing to a shared root spec or task file during active work.
- Proceeding after discovering unapproved product, security, dependency, or cleanup risk.
- Claiming done without evidence in the current turn or feature artifacts.

## Verification checklist

- [ ] Spec has explicit acceptance criteria
- [ ] Negative/boundary verification expectations are documented
- [ ] Non-goals and risks are documented
- [ ] UI/UX work includes Impeccable routing evidence
