# Subagent Prompts

Subagent prompts should include goal, feature namespace, owned files, constraints, validation commands, stop rules, and output artifact path.

## Minimal prompt shape

```text
Goal: <one slice>
Feature namespace: .spec-to-ship/features/<feature-id>/
Owned files/globs: <paths>
Do not edit: <shared or forbidden paths>
Required STS skill: tdd
Validation: <commands>
Stop if: scope, product, dependency, data, security, or ownership conflict appears
Output: update <artifact path> with changed files and evidence
```
