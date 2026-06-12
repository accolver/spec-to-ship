# Spec-to-Ship Plan

## Purpose

Build **Spec-to-Ship (STS)** as a portable, harness-agnostic source of truth for an end-to-end AI coding workflow. STS should guide agents from requirements through specification, planning, TDD implementation in isolated git worktrees, parallel subagent execution, adversarial review, CI validation, release, and worktree cleanup.

This plan is based on `~/Downloads/deep-research-report (1).md` plus follow-up research into Superpowers, Addy Osmani’s agent-skills, GitHub Spec Kit, the Open Agent Skills standard, Impeccable, Codex, VS Code/GitHub Copilot, Cursor, OpenCode, Gemini CLI, and Claude Skills.

## Current repository state

- Target directory: `/Users/alancolver/dev/ai/ai-coding`
- Git repository: initialized on `main`.
- Current scaffold artifacts include `README.md`, tiny `AGENTS.md`, canonical `SPEC-TO-SHIP.md`, MIT `LICENSE`, schemas, external dependency config, installer/validation scripts, CI workflow, prompts, and first-pass core skills.
- License decision: MIT, already added in `LICENSE`.

## Repository name and public URL

Recommended name: **Spec-to-Ship**

Recommended short name: **STS**

Repository slug: `spec-to-ship`

Public URL: `https://github.com/accolver/spec-to-ship`

Why this name:

- It describes the complete lifecycle: specification through release.
- It is short enough for commands, docs, and artifact names.
- It is not tied to Pi, Codex, Claude, OpenCode, GPT, or any single harness.
- It leaves room for future evolution without implying this is just a prompt library.

## Resolved implementation decisions

1. **Name:** `spec-to-ship` / STS.
2. **License:** MIT.
3. **Impeccable:** external dependency, not vendored.
4. **Impeccable source:** `https://github.com/pbakaus/impeccable`.
5. **Impeccable install method:** prefer its documented command `npx impeccable skills install`, then run or instruct the user to run `/impeccable init` inside the AI coding tool.
6. **Harness output:** generate all supported harness targets from the first version, not Pi-first only.
7. **Installer mode:** ask the user whether to install locally, globally, both, or dry-run. Do not silently modify global config by default.
8. **Tool wrappers:** do not ship extra tool skills such as `gh`, `gcloud`, browser, cloud CLI, etc. STS should respect whatever tools and skills the user already has.

## Research-backed workflow influences

### Superpowers (`obra/superpowers`)

Key workflows to capture:

- **Git worktrees for isolation:** start feature work in an isolated workspace, prefer native worktree support when available, fall back to `git worktree`, and verify the worktree is safe before editing.
- **Subagent-driven development:** execute independent tasks through fresh subagents with isolated context. Use two-stage review after implementation: first spec compliance, then code quality.
- **Verification before completion:** no completion claims without fresh verification output. Evidence comes before assertions.
- **Writing and executing plans:** implementation plans should be detailed enough for an agent with little repo context, with explicit files, tests, docs, and task boundaries.
- **Finishing a branch:** verify tests, detect environment, present integration options, merge or PR intentionally, then clean up branches/worktrees.

STS adaptation:

- Keep the worktree/subagent discipline.
- Add namespaced spec artifacts so teammates and agents can work in parallel without colliding on a shared `SPEC.md` or `tasks.md`.
- Make cleanup part of the `finish` skill, not an afterthought.

### Addy Osmani `agent-skills`

Key workflows to capture:

- Lifecycle: define/spec → plan → build → verify/test → review → ship.
- Selective skill loading: do not load everything at once.
- Skill anatomy: overview, when to use, step-by-step process, common rationalizations, red flags, and verification.
- Planning: dependency graph, vertical slices, task sizing, checkpoints, and explicit acceptance criteria.
- Review: evidence-backed quality gates, security, maintainability, tests, and release readiness.
- CI/release: shipping is a separate skill with a checklist, not just “tests pass”.

STS adaptation:

- Use generic STS skill names rather than importing branded names.
- Use Addy’s skill anatomy as the default structure for our skills.
- Add `skill-maker` optimization and eval loops before considering a skill production-ready.

### GitHub Spec Kit / spec-driven development

Key workflows to capture:

- Specs are living, executable artifacts, not static documents.
- Phases: specify → plan → tasks → implement.
- The spec captures “what” and “why”; the plan captures “how”; tasks are small and independently testable.
- Human checkpoints are required between phases to catch missing intent, constraints, edge cases, and design requirements.

STS adaptation:

- Use namespaced feature folders for specs/plans/tasks.
- Keep the spec as the source of truth for agent execution and review.
- Invoke Impeccable during the spec phase whenever UI/UX is part of the feature.

### Open Agent Skills standard and harness support

Key compatibility facts:

- The Open Agent Skills standard uses a directory containing `SKILL.md`, plus optional `scripts/`, `references/`, and `assets/`.
- Required frontmatter: `name` and `description`.
- Names should be lowercase kebab-case, max 64 characters, and match the parent directory.
- Descriptions should include what the skill does and when to use it.
- Progressive disclosure is common: metadata is loaded first; the full `SKILL.md` is loaded only when relevant.

Harness findings:

- **Codex:** supports `.agents/skills`, `~/.agents/skills`, symlinked skills, progressive disclosure, explicit and implicit invocation.
- **VS Code / GitHub Copilot:** supports Agent Skills as an open standard, including `.github/skills`, `.claude/skills`, `.agents/skills`, and personal skill directories.
- **Cursor:** supports `.agents/skills`, `.cursor/skills`, user-level equivalents, Claude/Codex compatibility directories, nested skill discovery, and GitHub remote rule imports.
- **OpenCode:** supports `.opencode/skills`, `.claude/skills`, `.agents/skills`, global and project scopes, and skill permissions.
- **Gemini CLI:** supports `.gemini/skills` and `.agents/skills`, `/skills list`, `/skills reload`, `gemini skills install`, and `gemini skills link`.
- **Claude Skills / Claude Code:** supports filesystem skills with progressive disclosure and `SKILL.md`-based custom skills.
- **Pi:** supports open skill directories, including `.agents/skills`, `.pi/skills`, `~/.agents/skills`, and `~/.pi/agent/skills`.

STS adaptation:

- Author once in `skills/core/**/SKILL.md`.
- Generate or symlink into all major harness directories.
- Keep `AGENTS.md` integration tiny and DRY.

### Impeccable

Key findings:

- Canonical source: `https://github.com/pbakaus/impeccable`.
- Documented quick start: from project root, run `npx impeccable skills install`, then run `/impeccable init` inside the AI coding tool.
- Impeccable is itself multi-harness and emits `.agents`, `.claude`, `.cursor`, `.gemini`, `.github`, `.opencode`, `.pi`, and other provider outputs.

STS adaptation:

- Do not vendor Impeccable.
- Installer detects existing Impeccable first.
- If missing, installer offers to run `npx impeccable skills install` in the selected local/global scope.
- STS `spec` invokes Impeccable during requirements/planning for UI/UX work, not only during final polish.

## Design principles

1. **Small process backbone only.** STS ships the core lifecycle and no unrelated tool-wrapper skills.
2. **Open Agent Skills first.** Every STS skill is a portable `SKILL.md` package with optional references, scripts, templates, and evals.
3. **Tiny AGENTS.md integration.** STS should add a small managed block to existing `AGENTS.md`, not replace it.
4. **DRY canonical instructions.** The managed block points to one canonical STS file instead of duplicating the workflow everywhere.
5. **Non-disruptive install.** Installer asks before local/global install and backs up or preserves existing config.
6. **Namespaced artifacts.** Every feature gets an isolated namespace so multiple teammates/agents can work in parallel without merge conflicts.
7. **TDD and proof before completion.** Meaningful behavior changes require failing evidence first and passing proof after.
8. **Parallel by default when safe.** Plans should identify independent slices, worktree ownership, and subagent assignments.
9. **Cleanup is part of done.** Worktrees are cleaned up after merge/PR completion, and `git worktree prune` is run when safe.
10. **Impeccable is first-class for UI/UX.** Any UI/UX work loads Impeccable in the spec phase and again in review/polish.
11. **Use existing user tools.** STS should discover, ask, and adapt to the user’s preferred tools rather than shipping its own `gh`, `gcloud`, browser, or cloud wrappers.
12. **Skill-maker optimization.** New STS skills must be created and refined using the existing `skill-maker` process before release.

## Proposed repository structure

```text
spec-to-ship/
  README.md
  AGENTS.md                  # Tiny loader for this repo only
  SPEC-TO-SHIP.md            # Canonical STS router/workflow loaded by AGENTS.md blocks
  LICENSE
  package.json
  bun.lockb
  skills.schema.json
  contracts.schema.json
  external-deps.json

  skills/
    core/
      spec/
        SKILL.md
        contract.json
        templates/spec.md
        references/spec-quality.md
        evals/evals.json
      coding-agent/
        SKILL.md
        contract.json
        templates/plan.md
        templates/task.md
        references/vertical-slicing.md
        references/subagent-prompts.md
        evals/evals.json
      worktree/
        SKILL.md
        contract.json
        references/worktree-policy.md
        references/parallel-ownership.md
        evals/evals.json
      tdd/
        SKILL.md
        contract.json
        references/test-levels.md
        references/testing-anti-patterns.md
        evals/evals.json
      debug/
        SKILL.md
        contract.json
        templates/debug-report.md
        references/root-cause-analysis.md
        evals/evals.json
      review/
        SKILL.md
        contract.json
        templates/review.md
        references/review-taxonomy.md
        evals/evals.json
      deps/
        SKILL.md
        contract.json
        references/license-and-supply-chain.md
        evals/evals.json
      release/
        SKILL.md
        contract.json
        templates/release-checklist.md
        templates/changelog.md
        evals/evals.json
      finish/
        SKILL.md
        contract.json
        references/worktree-cleanup.md
        references/merge-or-pr-options.md
        evals/evals.json
      ui-ux-gate/
        SKILL.md
        contract.json
        references/impeccable-routing.md
        references/external-impeccable-install.md

  prompts/
    spec.md
    plan.md
    implement.md
    debug.md
    review.md
    release.md

  scripts/
    install.sh
    integrate-agents-md.ts
    install-external-deps.ts
    update-local-preferences.ts
    validate-skills.ts
    validate-contracts.ts
    validate-external-deps.ts
    detect-overlap.ts
    build-dist.ts
    smoke-eval.ts

  evals/
    smoke/
    scenarios/
    regression/

  .github/
    workflows/
      validate.yml
      release.yml

  dist/
    agents/
    pi/
    codex/
    claude/
    cursor/
    opencode/
    gemini/
    copilot/
```

Notably absent by design:

- No `gh-cli` skill.
- No `gcloud` skill.
- No browser automation skill.
- No framework overlays in v1.
- No vendored Impeccable.

## Top-level `AGENTS.md` plan

This repo’s own `AGENTS.md` should be intentionally tiny:

```md
# Spec-to-Ship Repository Instructions

For work in this repository, first read `SPEC-TO-SHIP.md` and follow the STS lifecycle. Do not duplicate the lifecycle here.
```

When installing STS into a user’s existing project, the installer should add a small managed block rather than replacing the user’s `AGENTS.md`:

```md
<!-- spec-to-ship:start -->
Spec-to-Ship (STS) is installed. For non-trivial coding work, read and follow:
`<STS_INSTALL_ROOT>/SPEC-TO-SHIP.md`

Keep project-specific instructions in this AGENTS.md. Do not duplicate STS lifecycle instructions here.
<!-- spec-to-ship:end -->
```

If the target project has no `AGENTS.md`, the installer can create one containing only the managed block plus a short comment explaining where local project instructions can be added.

If the target harness uses a different always-loaded file, the installer should create the smallest native wrapper that points back to the canonical STS file.

## Canonical `SPEC-TO-SHIP.md` plan

`SPEC-TO-SHIP.md` is the DRY always-loaded workflow body. It should include:

1. Mission and scope.
2. Core lifecycle.
3. Skill routing table.
4. Artifact namespace contract.
5. Parallelization policy.
6. Tool preference policy.
7. Impeccable UI/UX routing.
8. Approval and stop rules.
9. Verification-before-completion rule.
10. Cleanup rule.

Default lifecycle:

```text
request
  -> spec
  -> human approval when scope is non-trivial
  -> coding-agent
  -> worktree when parallel or risky work begins
  -> tdd per implementation slice
  -> debug when blocked or failing
  -> review
  -> deps if dependencies changed
  -> release
  -> finish for merge/PR/worktree cleanup
```

## Skill routing table

| Situation | STS skill |
|---|---|
| New feature, unclear requirements, risky change | `spec` |
| UI/UX, frontend, product flow, form, dashboard, component, design system | `spec` + `ui-ux-gate` + external `impeccable` |
| Approved spec needs tasks, implementation strategy, or subagent prompts | `coding-agent` |
| Parallel implementation, isolated workspace, risky branch work | `worktree` |
| Non-trivial implementation or bug fix | `tdd` |
| Failing tests, regression, flake, incident, unexplained behavior | `debug` |
| Pre-merge diff or substantial change | `review` |
| Dependency add, upgrade, removal, license or supply-chain concern | `deps` |
| CI, release, deploy, changelog, publish | `release` |
| Work complete, PR/merge decision, cleanup | `finish` |

## Namespaced artifact contract

Avoid one shared `SPEC.md`, one shared `tasks.md`, or one shared artifact directory. Those create merge conflicts and block parallel teammates.

Each feature gets its own namespace:

```text
.spec-to-ship/
  features/
    <YYYYMMDD-HHMM>-<owner-or-agent>-<slug>/
      spec.md
      plan.md
      tasks.md
      worktrees.md
      test-report.md
      review.md
      deps.md
      release.md
      finish.md
      handoff.md
```

Rules:

- Feature IDs must be unique and stable once work begins.
- Parallel subagents must write only inside their assigned feature namespace or assigned worktree.
- Avoid central mutable indexes during active work. If an index is needed, generate it after merge.
- Plans must name file ownership and artifact ownership for every parallel slice.
- Worktree paths should include the feature ID to reduce collisions.

Example:

```text
.spec-to-ship/features/20260612-1430-alan-agent-auth-refresh/spec.md
../spec-to-ship-worktrees/20260612-1430-alan-agent-auth-refresh-api/
../spec-to-ship-worktrees/20260612-1430-alan-agent-auth-refresh-ui/
```

## Core skills to build

### 1. `spec`

Owns requirements clarification and scoped engineering specs.

Required behavior:

- Capture problem, user outcome, scope, non-goals, constraints, interfaces, acceptance criteria, risks, assumptions, and open questions.
- Treat the spec as the source of truth.
- Ask the minimum questions needed to remove ambiguity.
- Read relevant repo docs/code before proposing structure.
- Stop before implementation when approval is needed.
- If UI/UX is involved, load `ui-ux-gate`, invoke external `impeccable`, and include design requirements in the spec before finalizing.

Required output:

- Namespaced `spec.md`.
- Optional ADR/decision log inside the same feature namespace.
- Explicit acceptance criteria suitable for TDD and review.

### 2. `coding-agent`

Owns turning an approved spec into executable vertical slices and agent handoffs.

Required behavior:

- Build a dependency graph.
- Slice vertically, not by generic technical layers where possible.
- Identify parallelizable tasks.
- Assign file ownership and artifact ownership.
- Create implementation prompts for subagents.
- Include validation commands and rollback notes per task.
- Update local tool preferences when the user chooses a preferred workflow.

Required output:

- `plan.md`
- `tasks.md`
- optional subagent prompts in the feature namespace

### 3. `worktree`

Owns isolated workspaces and safe parallelization.

Required behavior:

- Detect whether the harness already provides native worktree/isolation.
- Prefer harness-native worktree features when available.
- Fall back to `git worktree` when needed.
- Create one worktree per independent writer slice.
- Record worktree path, branch name, owner, assigned files, and merge target in `worktrees.md`.
- Prevent overlapping file ownership unless explicitly coordinated.
- Require merge/integration through a single parent/integration agent.

### 4. `tdd`

Owns red-green-refactor implementation discipline.

Required behavior:

- State behavior under test.
- Add or update a failing test first unless impossible and documented.
- Capture failing output.
- Implement the smallest code change.
- Capture passing output.
- Refactor only while tests remain green.
- Record exact commands and outputs in `test-report.md`.

### 5. `debug`

Owns failures, regressions, flakes, and root-cause analysis.

Required behavior:

- Reproduce first.
- Generate ranked hypotheses.
- Test hypotheses one at a time.
- Prove root cause with file/line or command evidence.
- Add regression coverage before claiming fixed.
- Escalate when the issue is environmental, permission-related, or ambiguous.

### 6. `review`

Owns pre-merge quality control.

Required behavior:

- Pass 1: spec compliance, non-goals, acceptance criteria.
- Pass 2: correctness, maintainability, tests, security, observability, dependency risk.
- For UI work: run Impeccable-informed critique/audit/polish checks.
- Use multiple reviewers/subagents when the diff is large or risk is high.
- Classify findings as `block`, `should-fix`, or `follow-up`.

### 7. `deps`

Owns dependency decisions.

Required behavior:

- Justify every new dependency.
- Check license, maintenance, vulnerabilities, package size, transitive risk, and alternatives.
- Prefer standard library or existing project dependencies when reasonable.
- Respect existing project dependency-management tooling.
- Record dependency decisions in `deps.md`.

### 8. `release`

Owns final validation and release readiness.

Required behavior:

- Run local validation contract.
- Check CI status using the user’s chosen tools or existing harness integrations.
- Generate release notes/changelog when appropriate.
- Confirm deploy/publish checklist.
- Include UI/design QA evidence when UI changed.
- Produce `release.md`.

### 9. `finish`

Owns merge/PR completion and worktree cleanup.

Required behavior:

- Verify tests/CI before presenting completion options.
- Detect base branch and worktree state.
- Ask whether to merge locally, open/update PR, hold for review, or abandon.
- Never delete unmerged work without explicit approval.
- After merge or explicit abandonment, remove completed worktrees and run `git worktree prune` when safe.
- Record cleanup evidence in `finish.md`.

### 10. `ui-ux-gate`

Owns routing between STS and external Impeccable.

Required behavior:

- Detect UI/UX involvement early in `spec`.
- Ensure Impeccable is installed or provide the installer path.
- In requirements/planning, invoke Impeccable shape/init guidance so design affects the spec, not just final polish.
- In review, require Impeccable-informed critique/audit/polish checks.
- Do not copy Impeccable’s skill body into STS.

## Safe REPL decision

Open question: what is the purpose of `safe-repl`, and can STS rely on the user’s harness?

Decision for v1: **do not ship `safe-repl` as a standalone core skill.**

Rationale:

- Most harnesses already have permission systems, sandboxing, command approvals, or configurable tool policies.
- STS should not duplicate or fight the user’s chosen safety model.
- The truly universal safety rules are small enough to live in `SPEC-TO-SHIP.md` and the relevant skills.

Minimal STS safety invariants:

- Identify destructive or irreversible operations before running them.
- Ask before deleting branches, worktrees, data, credentials, deployments, or production resources.
- Prefer read-only inspection before mutation.
- Record material mutating commands in the feature artifact.
- Defer to the harness’s approval/sandbox model as the source of enforcement.

If later evals show this is not enough, add a `safety` skill in v2.

## Tool preference adaptation

STS should not include tool-wrapper skills outside the core backbone and Impeccable. Users may already have preferred skills/tools installed.

Policy:

1. Detect existing instructions and skills where possible.
2. Ask the user before choosing a tool for PRs, issue trackers, cloud, browser, docs, etc.
3. If the user chooses a tool, persist that preference locally.
4. Core STS skills should read local preferences before suggesting commands.
5. If a required capability is missing, suggest installation rather than bundling the tool skill into STS.

Proposed local preference file:

```text
.spec-to-ship/local-preferences.md
```

Example content:

```md
# Local STS Preferences

- Pull requests: use existing `gh` CLI workflow.
- Issue tracking: ask before using any external tracker.
- Browser testing: prefer existing project Playwright setup.
- Cloud/deploy commands: never run without explicit approval.
```

This file may be project-local and optionally gitignored depending on team preference.

## Impeccable external dependency plan

The installer should manage Impeccable as an external dependency.

Implementation choices:

1. Add `external-deps.json` with an `impeccable` entry:
   - source: `https://github.com/pbakaus/impeccable`
   - install command: `npx impeccable skills install`
   - post-install instruction: run `/impeccable init` inside the AI coding tool
   - expected skill name: `impeccable`
   - expected locations: `.agents/skills/impeccable`, `.pi/skills/impeccable`, `.claude/skills/impeccable`, `.cursor/skills/impeccable`, `.opencode/skills/impeccable`, `.gemini/skills/impeccable`, `.github/skills/impeccable`, and global equivalents where supported
2. Add `scripts/install-external-deps.ts` and call it from `scripts/install.sh` unless `--skip-external-deps` is passed.
3. Detect existing Impeccable first.
4. If missing, ask before running the external installer.
5. If install fails, fail loudly with manual instructions. Do not silently skip UI/UX setup.
6. Keep STS routing in `ui-ux-gate`; keep Impeccable design logic in Impeccable.

## Installer plan

The top-level `README.md` should have a single pasteable AI instruction and then manual details underneath.

Proposed primary command block:

````md
Paste this into your AI coding agent:

Clone Spec-to-Ship to `~/.spec-to-ship`, run its installer, choose local/global scope when prompted, let it install required external dependencies such as Impeccable, then read the installed STS `AGENTS.md`/`SPEC-TO-SHIP.md` instructions for future coding work:

```bash
git clone https://github.com/accolver/spec-to-ship ~/.spec-to-ship \
  && ~/.spec-to-ship/scripts/install.sh
```
````

Installer modes:

```bash
scripts/install.sh                         # interactive: ask local/global/both/dry-run
scripts/install.sh --mode local --target .
scripts/install.sh --mode global
scripts/install.sh --mode both --target .
scripts/install.sh --mode local --target . --harness all --link
scripts/install.sh --mode global --harness all --copy
scripts/install.sh --dry-run --harness all
scripts/install.sh --skip-external-deps
```

Installer responsibilities:

- Ask local, global, both, or dry-run when mode is omitted.
- Detect installed harnesses and known config directories.
- Build all harness targets from source.
- Symlink or copy STS core skills into selected harness locations.
- Insert a small managed STS block into existing `AGENTS.md` or harness-native instruction files.
- Preserve existing user content and create backups before modification.
- Read `external-deps.json`, detect Impeccable, and offer installation when missing.
- Print verification checklist, installed paths, and external dependency status.

Initial target directories:

```text
.agents/skills/              # project Open Skills
.pi/skills/                  # project Pi
.claude/skills/              # project Claude
.codex/skills/               # project Codex
.cursor/skills/              # project Cursor
.opencode/skills/            # project OpenCode
.gemini/skills/              # project Gemini
.github/skills/              # project GitHub Copilot / VS Code

~/.agents/skills/            # global Open Skills
~/.pi/agent/skills/          # global Pi
~/.claude/skills/            # global Claude
~/.codex/skills/             # global Codex
~/.cursor/skills/            # global Cursor
~/.config/opencode/skills/   # global OpenCode
~/.gemini/skills/            # global Gemini
~/.copilot/skills/           # global Copilot, where supported
```

Because harness conventions vary, the first implementation should make detection explicit, conservative, and reversible.

## Skill-maker optimization plan

Use the existing `skill-maker` skill to create and optimize every STS core skill.

Required process for each skill:

1. Draft `SKILL.md` from the STS plan and research references.
2. Include a single-line Open Skills-compliant description with clear triggers.
3. Add `contract.json`.
4. Add 2-3 initial eval cases.
5. Validate frontmatter and directory naming.
6. Run baseline vs with-skill evals when practical.
7. Refine based on failed assertions, human feedback, and transcript evidence.
8. Optimize description for trigger accuracy.
9. Stop when evals plateau or the skill meets release criteria.

Acceptance criteria for each skill:

- Valid Open Agent Skills frontmatter.
- Description includes what the skill does and “Use when…” triggers.
- Body stays focused and under the recommended size.
- References are one level deep and linked from `SKILL.md`.
- Evals catch behavior the skill adds beyond generic agent competence.
- No missing referenced files.

## Validation and CI plan

Use Bun-based scripts by default.

Validation gates:

1. **Skill schema validation**
   - Every `SKILL.md` has valid YAML frontmatter.
   - `name` matches directory basename.
   - `description` is single-line, under 1024 chars, and includes “Use when”.

2. **Contract validation**
   - Every core skill has `contract.json`.
   - Contracts match `contracts.schema.json`.
   - Inputs, outputs, triggers, anti-triggers, tools, and approval policies are explicit.

3. **External dependency validation**
   - `external-deps.json` includes Impeccable.
   - Dry-run reports whether Impeccable is present, installable, or blocked.
   - `ui-ux-gate` references Impeccable without vendoring its body.

4. **Reference integrity**
   - No broken relative links.
   - No missing referenced templates/scripts.
   - No deep reference chains.

5. **Overlap detection**
   - Warn when STS skills own the same lifecycle boundary.
   - Ensure STS does not ship unrelated tool wrappers.

6. **Install dry-run**
   - CI runs installer in temp directories for each target harness.
   - Confirms symlinks/copies resolve.
   - Confirms `AGENTS.md` managed block insertion is idempotent.

7. **Smoke evals**
   - Scenarios for spec, Impeccable UI routing, planning, worktree parallelization, TDD, debug, review, dependency governance, release, and finish cleanup.
   - Assert expected skills and artifacts are selected.

8. **Release build**
   - Generate `dist/agents`, `dist/pi`, `dist/codex`, `dist/claude`, `dist/cursor`, `dist/opencode`, `dist/gemini`, and `dist/copilot` from one source tree.

## Milestones

### Milestone 1: Repository scaffold

Deliver:

- `README.md`
- `AGENTS.md` tiny loader
- `SPEC-TO-SHIP.md` canonical lifecycle
- `LICENSE` with MIT terms
- `skills.schema.json`
- `contracts.schema.json`
- `external-deps.json`
- `scripts/install.sh`
- `scripts/integrate-agents-md.ts`
- `scripts/install-external-deps.ts`
- `scripts/validate-skills.ts`
- `scripts/validate-contracts.ts`
- Initial `.github/workflows/validate.yml`

### Milestone 2: Core workflow skills

Deliver first-pass skills:

- `spec`
- `coding-agent`
- `worktree`
- `tdd`
- `debug`
- `review`
- `deps`
- `release`
- `finish`
- `ui-ux-gate`

Each skill gets `SKILL.md`, `contract.json`, references/templates where useful, and 2-3 initial eval prompts.

### Milestone 3: Skill-maker optimization

Deliver:

- Eval suites for each core skill.
- Trigger-description tests.
- Baseline vs with-skill comparison where practical.
- Updated skill bodies and descriptions from `skill-maker` feedback.

### Milestone 4: External Impeccable integration

Deliver:

- `external-deps.json` entry for Impeccable.
- Installer support to detect, install, link, or clearly fail on missing Impeccable.
- `ui-ux-gate` routing.
- Spec-phase Impeccable invocation for UI/UX work.
- Review/release design QA hooks.

### Milestone 5: Installer and harness generation

Deliver:

- Interactive local/global/both installer.
- All harness target generation.
- Symlink/copy modes.
- Dry-run mode.
- Managed `AGENTS.md` block integration.
- Idempotent uninstall or rollback notes.

### Milestone 6: Evaluation and release hardening

Deliver:

- Smoke scenario evals.
- Trigger collision checks.
- Install dry-run CI.
- Changelog/release workflow.
- Initial version tag.

## Acceptance criteria for the first usable release

- A user can clone `https://github.com/accolver/spec-to-ship` and run one installer command.
- Installer asks whether to install locally, globally, both, or dry-run.
- Existing `AGENTS.md` content is preserved, with only a small STS managed block added.
- Core STS skills are discoverable as Open Agent Skills in all generated harness targets.
- Impeccable is detected or installed unless explicitly skipped.
- UI/UX tasks invoke Impeccable during the spec phase and review phase.
- Non-trivial coding work produces namespaced artifacts under `.spec-to-ship/features/<feature-id>/`.
- Parallel implementation uses isolated worktrees with explicit file ownership.
- TDD evidence is captured before implementation claims.
- Review catches spec drift, missing tests, dependency risk, security/maintainability issues, and UI/UX issues when applicable.
- Finish flow verifies status, presents merge/PR options, and cleans up completed worktrees safely.
- CI validates skills, contracts, external deps, references, installer dry-runs, managed AGENTS block idempotency, harness dist generation, and smoke evals.

## Remaining open questions

None blocking for scaffold implementation.

Future decisions after scaffold:

1. Should STS eventually publish a package/plugin per harness, or remain a git-clone installer?
2. Should local STS preferences be committed by default, or gitignored unless a team opts in?
3. Should a dedicated `safety` skill be added later if evals show harness-native controls are insufficient?
