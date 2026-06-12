# Spec Quality

A good STS spec separates what and why from how, includes testable acceptance criteria, records non-goals, and routes UI/UX work through Impeccable before implementation.

## Quality bar

- The feature namespace is unique and stable.
- The spec names sources inspected so future agents can verify context.
- Acceptance criteria are observable and suitable for TDD/review.
- Non-goals prevent scope creep.
- Risks identify security, data, migration, dependency, and UI/UX uncertainty.
- Approval status is explicit.

## Worked example outline

For a dashboard filter feature, the spec should capture the user outcome, filter behavior, empty/error/loading states, backend query constraints, UI/UX requirements from Impeccable, non-goals like unrelated chart redesign, acceptance criteria for filtering and accessibility, and a verification plan covering unit tests, browser checks, and design QA.
