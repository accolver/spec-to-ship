---
name: deps
description: Evaluates dependency additions, upgrades, removals, licenses, maintenance, vulnerabilities, package size, transitive risk, and alternatives. Use when package, library, dependency, upgrade, lockfile, license, supply-chain, npm, PyPI, cargo, or package-manager changes are involved.
license: MIT
metadata:
  package: spec-to-ship
  version: "0.1.0"
---

# Deps

## Overview

Govern dependency additions, upgrades, removals, licenses, maintenance, vulnerabilities, size, and alternatives.

## When to use

- A package, lockfile, dependency, library, upgrade, or removal is involved.
- The user asks whether a dependency is acceptable.
- Supply-chain, license, vulnerability, or package-size risk appears.

## Do not use when

- Do not add a dependency just for convenience without alternatives.
- Do not ignore transitive or license risk.
- Do not override project package-manager conventions.

## Process

1. Identify the dependency change and why it is needed.
2. Check existing dependencies and standard-library alternatives.
3. Assess license, maintenance, vulnerability, size, transitive risk, and ecosystem fit.
4. Respect the project’s package manager and lockfile policy.
5. Record the decision, commands, and residual risks in `deps.md`.
6. Escalate if license or supply-chain risk is unclear.

## Outputs

- `.spec-to-ship/features/<feature-id>/deps.md`

## References

- [references/license-and-supply-chain.md](references/license-and-supply-chain.md)
- [templates/deps.md](templates/deps.md)

## Common rationalizations to reject

- "This is small enough to skip the artifact." If the task triggered this skill, record the lightweight artifact.
- "The agent can remember the context." Use the feature namespace so teammates and subagents can work safely.
- "The tests probably pass." Claims require fresh evidence.

## Red flags

- Writing to a shared root spec or task file during active work.
- Proceeding after discovering unapproved product, security, dependency, or cleanup risk.
- Claiming done without evidence in the current turn or feature artifacts.

## Verification checklist

- [ ] Alternatives are considered
- [ ] License and maintenance are checked
- [ ] Lockfile behavior is documented
