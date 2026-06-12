---
name: coding-agent
description: Turns approved specs into implementation plans, vertical slices, task lists, validation commands, and agent handoffs. Use when a spec is approved and the user asks to plan, break down, sequence, parallelize, or delegate implementation work.
license: MIT
metadata:
  package: spec-to-ship
  version: "0.1.0"
---

# Coding Agent

## Overview

Convert an approved spec into vertical slices, task order, subagent handoffs, validation commands, and rollback notes.

## When to use

- A spec is approved and implementation needs to be planned.
- Work can be split, parallelized, delegated, or sequenced.
- The user asks for an implementation plan, task breakdown, or agent handoff prompt.

## Do not use when

- Do not rewrite product requirements without updating the spec.
- Do not plan tasks that require overlapping file ownership without calling out the conflict.
- Do not implement code.

## Process

1. Read the approved `spec.md` and current local preferences.
2. Build a dependency graph and identify ordering constraints.
3. Slice work vertically into independently testable increments.
4. Mark which slices can run in parallel and assign file/artifact ownership.
5. Write validation commands, rollback notes, and subagent prompts for each slice.
6. Save `plan.md` and `tasks.md` in the feature namespace.

## Outputs

- `.spec-to-ship/features/<feature-id>/plan.md`
- `.spec-to-ship/features/<feature-id>/tasks.md`

## References

- [templates/plan.md](templates/plan.md)
- [templates/task.md](templates/task.md)
- [references/vertical-slicing.md](references/vertical-slicing.md)
- [references/subagent-prompts.md](references/subagent-prompts.md)

## Common rationalizations to reject

- "This is small enough to skip the artifact." If the task triggered this skill, record the lightweight artifact.
- "The agent can remember the context." Use the feature namespace so teammates and subagents can work safely.
- "The tests probably pass." Claims require fresh evidence.

## Red flags

- Writing to a shared root spec or task file during active work.
- Proceeding after discovering unapproved product, security, dependency, or cleanup risk.
- Claiming done without evidence in the current turn or feature artifacts.

## Verification checklist

- [ ] Tasks are vertical and independently testable
- [ ] Parallel slices have ownership boundaries
- [ ] Every task names validation commands
