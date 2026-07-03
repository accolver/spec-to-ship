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

The command asks one question at a time instead of showing a large intake form. It starts with:

```text
What are you trying to do?
```

You can answer with as little or as much detail as you want. If the answer is too vague or is missing proof-of-success, constraints, or approval intent, the command asks short follow-up questions such as:

- What should be different when this is done?
- How will you know it worked?
- Any constraints or things to avoid?
- How far should STS go?

The workflow stops early with clarifying questions only when the conversational intake is still not sufficient for unattended work. It also stops before implementation unless approval mode and the generated STS plan allow continuing.

## Relationship to STS

`SPEC-TO-SHIP.md` remains canonical. The workflow wrapper is a Pi-specific orchestration layer around the same lifecycle and artifact rules:

```text
.spec-to-ship/features/<feature-id>/
```

It must not create shared root `SPEC.md`, `tasks.md`, or mutable lifecycle artifacts.
