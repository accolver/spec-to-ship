# STS Slash Commands

Canonical source prompts for Spec-to-Ship slash commands. The build script renders these into harness-specific command and prompt-file layouts.

Primary command:

- `/sts` — full-lifecycle mode: frontload blocking requirements/questions, then drive the active feature through spec, planning, implementation/TDD, debug when needed, review, dependency governance when needed, release, and finish until shipped or blocked by a required human decision.

Namespaced commands where the harness supports namespace paths:

- `/sts:spec` — Run STS requirements discovery and write or update the feature spec
- `/sts:code` — Run STS coding plan/implementation coordination for an approved spec
- `/sts:worktree` — Set up STS isolated worktrees and file ownership for parallel work
- `/sts:tdd` — Run STS red-green-refactor implementation discipline
- `/sts:debug` — Run STS root-cause debugging with reproduction and evidence
- `/sts:review` — Run STS pre-merge spec compliance and quality review
- `/sts:deps` — Run STS dependency governance for adds, upgrades, removals, or risk
- `/sts:release` — Run STS release readiness, CI, changelog, and publish checks
- `/sts:finish` — Run STS merge/PR decision and safe worktree cleanup
- `/sts:ui` — Run STS UI/UX gate and external Impeccable routing

For harnesses without namespaced command support, STS also renders dash aliases such as `/sts-spec` or harness-specific prompt names such as `/prompts:sts-spec`.

Step commands are single-step mode: run only the named lifecycle step, write that step's artifact, and stop with the next recommended route. Use `/sts` when you want the agent to continue through the whole lifecycle.
