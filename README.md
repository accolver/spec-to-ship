# Spec-to-Ship

Spec-to-Ship (STS) is a portable Open Agent Skills backbone for AI coding agents. It guides an agent from requirements to spec, plan, parallel worktree implementation, TDD, debugging, review, dependency governance, release, and cleanup.

STS is intentionally small. It ships only the core coding workflow and integrates with the tools and skills you already use. UI/UX work routes through the external [Impeccable](https://github.com/pbakaus/impeccable) skill.

## Install

Paste this into your AI coding agent:

```bash
git clone https://github.com/accolver/spec-to-ship ~/.spec-to-ship   && ~/.spec-to-ship/scripts/install.sh
```

The installer asks whether to install locally, globally, both, or dry-run. It adds a small managed block to your existing `AGENTS.md` instead of replacing your instructions.

## What gets installed

- Core Open Agent Skills under selected harness skill directories.
- A tiny `AGENTS.md` managed block pointing to `SPEC-TO-SHIP.md`.
- Optional external Impeccable setup via `npx impeccable skills install`.

## Core skills

- `spec` — requirements and scoped specs
- `coding-agent` — vertical slices, task plans, subagent handoffs
- `worktree` — isolated git worktrees and parallel ownership
- `tdd` — red-green-refactor proof
- `debug` — root-cause analysis
- `review` — pre-merge quality gate
- `deps` — dependency governance
- `release` — CI, changelog, deploy readiness
- `finish` — merge/PR decisions and worktree cleanup
- `ui-ux-gate` — external Impeccable routing

## Supported harness targets

STS generates install layouts for common Open Agent Skills-compatible locations:

- `.agents/skills` and `~/.agents/skills`
- `.pi/skills` and `~/.pi/agent/skills`
- `.claude/skills` and `~/.claude/skills`
- `.codex/skills` and `~/.codex/skills`
- `.cursor/skills` and `~/.cursor/skills`
- `.opencode/skills` and `~/.config/opencode/skills`
- `.gemini/skills` and `~/.gemini/skills`
- `.github/skills` and `~/.copilot/skills`

## Development

```bash
bun run validate
bun run build:dist
bun run smoke
```

## License

MIT. See `LICENSE`.
