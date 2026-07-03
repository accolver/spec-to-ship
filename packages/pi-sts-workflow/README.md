# spec-to-ship-pi-workflow

Optional Pi package for running Spec-to-Ship through the Pi dynamic workflows extension.

This package does **not** replace the portable STS skills/prompts. It adds one Pi command, `/sts-workflow`, that gathers an upfront requirements packet and then asks Pi to launch a dynamic workflow using `@quintinshaw/pi-dynamic-workflows`.

## Install

Install the dynamic workflow engine first:

```bash
pi install npm:@quintinshaw/pi-dynamic-workflows
```

Then install this optional package from a checkout of Spec-to-Ship:

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
