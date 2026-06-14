# Spec-to-Ship

Spec-to-Ship (STS) is a portable Open Agent Skills backbone for AI coding agents. It guides an agent from requirements to spec, plan, parallel worktree implementation, TDD, debugging, review, dependency governance, release, and cleanup.

STS is intentionally small. It ships only the core coding workflow and integrates with the tools and skills you already use. UI/UX work routes through the external [Impeccable](https://github.com/pbakaus/impeccable) skill.

## Install

From the project you want to install into, run one of:

```bash
bunx github:accolver/spec-to-ship install --mode local --target . --harness all
```

```bash
npx --yes github:accolver/spec-to-ship install --mode local --target . --harness all
```

For active STS development, clone and link instead:

```bash
git clone https://github.com/accolver/spec-to-ship ~/.spec-to-ship \
  && ~/.spec-to-ship/scripts/install.sh --mode local --target . --harness all --link
```

The installer asks whether to install locally, globally, both, or dry-run when `--mode` is omitted. It adds a small managed block to your existing `AGENTS.md` instead of replacing your instructions. The installer delegates to the repository scripts, requires Bash, prefers a local `bun` executable, and falls back to `npx`/`npm` to run Bun transiently when Bun is not installed.

## What gets installed

- Core Open Agent Skills under selected harness skill directories.
- STS slash command / prompt files such as `/sts`, `/sts:spec` where namespacing is supported, and dash aliases such as `/sts-spec` elsewhere.
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

## Slash commands

The only command most users need is:

```text
/sts
```

It runs STS in full-lifecycle mode: frontload blocking requirements/questions, then continue through spec, planning, implementation/TDD, debug when needed, review, dependency governance when needed, release, and finish until the work is shipped or blocked by a required human decision. STS also ships single-step commands such as `/sts:spec`, `/sts:code`, `/sts:debug`, `/sts:review`, `/sts:release`, and `/sts:finish` for harnesses with namespaced slash command support. Harnesses without namespaces get dash aliases such as `/sts-spec`.

See `SLASH_COMMANDS.md` for the compatibility matrix.

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
bun run build:dist:check
bun run smoke
bun run eval:check
bun run install:smoke
```

Eval aggregation is deterministic for v0.1: `bun run eval` reads existing `.spec-to-ship/eval-runs/<iteration>/` grading artifacts and writes aggregate benchmark files.

## Uninstall

Dry-run first, then rerun with `--yes` after reviewing the plan:

```bash
./scripts/uninstall.sh --mode local --target /path/to/project --harness all --dry-run
./scripts/uninstall.sh --mode local --target /path/to/project --harness all --yes
```

See `UNINSTALL.md` for rollback behavior and global uninstall notes.

## Releases

Stable releases are tagged as `vX.Y.Z` and published as GitHub Releases. The npm package is intentionally private; install via `bunx`/`npx` from GitHub, by cloning the repository, or by checking out a tag.

See `RELEASE.md` for the release checklist.

## License

MIT. See `LICENSE`.
