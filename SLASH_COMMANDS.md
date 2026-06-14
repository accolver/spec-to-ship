# Spec-to-Ship Slash Commands

STS ships reusable command/prompt files for harnesses that support custom slash commands or prompt templates.

## Primary command

Use this when you want STS to own the work from goal to shipped outcome:

```text
/sts [goal or feature]
```

`/sts` is full-lifecycle mode. It reads the STS workflow, inspects current feature artifacts when available, frontloads blocking requirements/questions, then continues through spec, planning, implementation/TDD, debug when needed, review, dependency governance when needed, release, and finish until the work is shipped or blocked by a required human decision.

## Step commands

Where namespaced commands are supported:

```text
/sts:spec      # requirements/spec
/sts:code      # approved-spec planning and implementation coordination
/sts:worktree  # isolated worktrees and file ownership
/sts:tdd       # red-green-refactor implementation evidence
/sts:debug     # root-cause diagnosis
/sts:review    # spec compliance and quality review
/sts:deps      # dependency governance
/sts:release   # CI/release readiness
/sts:finish    # merge/PR decision and cleanup
/sts:ui        # UI/UX gate and Impeccable routing
```

Harnesses without command namespaces get dash aliases such as `/sts-spec` and `/sts-code`.

Step commands are single-step mode. They run only the named lifecycle step, write that step's artifact, and stop with the next recommended route. Use `/sts` instead of a step command when you want the full lifecycle to continue automatically.

## Harness support matrix

| Harness | Installed command location | Expected invocation |
|---|---|---|
| Gemini CLI | `.gemini/commands/sts.toml`, `.gemini/commands/sts/spec.toml` | `/sts`, `/sts:spec`, `/sts:code`, etc. |
| Claude Code | `.claude/commands/sts.md`, `.claude/commands/sts/spec.md` | Namespaced project/user command, commonly `/project:sts:spec` or `/user:sts:spec`; some clients also surface `/sts:spec`. |
| Cursor | `.cursor/commands/sts.md`, `.cursor/commands/sts/spec.md` | Namespaced command where supported; dash aliases may vary by Cursor version. |
| OpenCode | `.opencode/commands/sts.md`, `.opencode/commands/sts-spec.md` | `/sts`, `/sts-spec`, `/sts-code`, etc. |
| Pi | `.pi/prompts/sts.md`, `.pi/prompts/sts-spec.md` | `/sts`, `/sts-spec`, `/sts-code`, etc. |
| GitHub Copilot / VS Code | `.github/prompts/sts.prompt.md`, `.github/prompts/sts-spec.prompt.md` | Prompt-file slash entries such as `/sts` or `/sts-spec` depending client version. |
| Codex | Global `~/.codex/prompts/sts.md`, `~/.codex/prompts/sts-spec.md` | Codex custom prompts are global/deprecated; invoke as `/prompts:sts` or `/prompts:sts-spec`. Codex skills remain the primary shared mechanism. |
| Generic Open Agent folders | `.agents/commands/sts.md`, `.agents/commands/sts-spec.md` | For harnesses that discover generic command folders: `/sts`, `/sts-spec`, etc. |

## Notes

- STS avoids colon filenames for Windows/git portability. Harnesses that support namespaces derive `:` from command subdirectories.
- Commands are lightweight routers. They do not replace skills; `/sts` drives the full lifecycle while step commands tell the agent which single STS skill/lifecycle step to use.
- The installer adds command files alongside skills for the selected harnesses.
