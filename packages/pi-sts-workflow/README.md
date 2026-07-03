# spec-to-ship-pi-workflow

Optional Pi package for running Spec-to-Ship through the Pi dynamic workflows engine.

This package does **not** replace the portable STS skills/prompts. It adds one Pi command, `/sts-workflow`, that gathers an upfront requirements packet and then starts a background dynamic workflow using `@quintinshaw/pi-dynamic-workflows`.

## Install

Install the Spec-to-Ship repo as a Pi package from GitHub:

```bash
pi install git:github.com/accolver/spec-to-ship
```

The GitHub install declares `@quintinshaw/pi-dynamic-workflows` as a dependency, so the `/sts-workflow` command can start the run directly instead of dumping a generated script into the chat. If you also want QuintinShaw's standalone `/workflows` commands, install that package explicitly:

```bash
pi install npm:@quintinshaw/pi-dynamic-workflows
```

For local development from a checkout, run `npm install` or `bun install` at the repository root, then install this package directory directly:

```bash
pi install ./packages/pi-sts-workflow
```

Reload Pi after installing:

```text
/reload
```

## Usage

```text
/sts-workflow Build the thing I want
```

The command opens an intake editor before any workflow agents run. Fill in:

- goal / requested outcome
- must-have requirements
- constraints and non-goals
- proof of success
- verification commands, if known
- approval mode: `stop-after-spec`, `plan-only`, or `approved-to-implement`
- destructive-operation boundaries

The workflow stops early with clarifying questions if the packet is not sufficient for unattended work. It also stops before implementation unless approval mode and the generated STS plan allow continuing.

## Relationship to STS

`SPEC-TO-SHIP.md` remains canonical. The workflow wrapper is a Pi-specific orchestration layer around the same lifecycle and artifact rules:

```text
.spec-to-ship/features/<feature-id>/
```

It must not create shared root `SPEC.md`, `tasks.md`, or mutable lifecycle artifacts.
