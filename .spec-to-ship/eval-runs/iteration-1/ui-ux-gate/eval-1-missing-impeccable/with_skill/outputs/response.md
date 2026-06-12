# UI/UX Gate Result: Onboarding Screen Spec

## Trigger decision
This request touches an onboarding screen, so it is UI/UX work and must route through `spec` + `ui-ux-gate` before implementation planning.

## Impeccable install-state check
I would verify the external Impeccable skill in installed skill locations such as:

- `.agents/skills/impeccable/SKILL.md`
- `~/.agents/skills/impeccable/SKILL.md`
- `~/.claude/skills/impeccable/SKILL.md`

For this eval scenario, the prompt states Impeccable is not installed, so the install state is `missing`.

## Blocker / user decision required
I will not run `npx impeccable skills install` automatically because it is an external network/install action and requires user approval.

Recommended next step:

> Impeccable is required for STS UI/UX workflows. May I run `npx impeccable skills install`, then have you run `/impeccable init` in this project?

Until the user approves installation or explicitly accepts degraded mode, the onboarding screen spec is blocked.

## Degraded-mode risk record if user declines or install is unavailable
Record this in the feature namespace, for example `.spec-to-ship/features/<feature-id>/spec.md`:

```md
## UI/UX Gate
- Trigger: onboarding screen / user-facing product experience
- Impeccable install state: missing
- Required action: ask user before `npx impeccable skills install`; after install run `/impeccable init`
- Status: blocked unless user approves install or explicitly accepts degraded mode
- Degraded risk if proceeding: design requirements, accessibility, responsive behavior, copy, and polish are not Impeccable-informed
```

No final onboarding screen requirements should be treated as complete until Impeccable is installed/initialized or the user explicitly documents degraded acceptance.
