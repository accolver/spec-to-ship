---
name: ui-ux-gate
description: Routes UI/UX work through external Impeccable and requires design requirements, critique, audit, and polish evidence without vendoring Impeccable. Use when requests involve UI, UX, frontend flows, forms, components, dashboards, screens, visual design, accessibility, or product experience.
license: MIT
metadata:
  package: spec-to-ship
  version: "0.1.0"
---

# UI UX Gate

## Overview

Route UI/UX work through external Impeccable during spec, planning, review, and polish without vendoring Impeccable.

## When to use

- A feature touches UI, UX, frontend routes, components, forms, dashboards, onboarding, visual design, accessibility, responsive behavior, copy, or product experience.

## Do not use when

- Do not duplicate Impeccable design laws.
- Do not continue UI spec work when Impeccable is missing without documenting the install blocker.
- Do not treat design as final polish only.

## Process

1. Detect UI/UX involvement as early as the `spec` phase.
2. Check whether an `impeccable` skill is available in installed skill locations.
3. If missing, point to `npx impeccable skills install` and `/impeccable init`.
4. During spec/planning, use Impeccable shape/init guidance to define design requirements.
5. During review/release, require Impeccable-informed critique, audit, or polish evidence.
6. Record the Impeccable touchpoints in the feature namespace.

## Outputs

- `.spec-to-ship/features/<feature-id>/spec.md`
- `.spec-to-ship/features/<feature-id>/review.md`

## References

- [references/impeccable-routing.md](references/impeccable-routing.md)
- [references/external-impeccable-install.md](references/external-impeccable-install.md)

## Common rationalizations to reject

- "This is small enough to skip the artifact." If the task triggered this skill, record the lightweight artifact.
- "The agent can remember the context." Use the feature namespace so teammates and subagents can work safely.
- "The tests probably pass." Claims require fresh evidence.

## Red flags

- Writing to a shared root spec or task file during active work.
- Proceeding after discovering unapproved product, security, dependency, or cleanup risk.
- Claiming done without evidence in the current turn or feature artifacts.

## Verification checklist

- [ ] Impeccable install state is known
- [ ] Design requirements are in the spec
- [ ] Review includes design QA evidence
