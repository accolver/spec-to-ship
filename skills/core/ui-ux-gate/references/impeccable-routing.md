# Impeccable Routing

Use Impeccable in the spec phase for UI/UX requirements and in review/release for critique, audit, polish, accessibility, responsive behavior, and UX copy evidence.

## Routing order

1. Detect UI/UX involvement.
2. Load `spec`.
3. Invoke `ui-ux-gate`.
4. Verify Impeccable install/init state.
5. Use Impeccable shape/init guidance before implementation planning.
6. Require Impeccable-informed critique/audit/polish evidence before release or finish.

## Install-state matrix

| State | Meaning | Next action |
|---|---|---|
| available+initialized | Impeccable exists and project context is initialized | Continue and record evidence |
| available+not-initialized | Skill exists but project has not run init | Ask user to run `/impeccable init` or record blocker |
| missing | Skill not found | Ask before `npx impeccable skills install` |
| blocked/no-network | Install cannot run | Pause or proceed only in documented degraded mode |
| user-declines-install | User declines dependency | Record degraded UI/UX risk and ask whether to proceed |

Do not vendor or paraphrase Impeccable design laws in STS.
