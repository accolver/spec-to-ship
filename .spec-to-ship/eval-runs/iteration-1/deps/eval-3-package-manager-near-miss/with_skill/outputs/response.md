# Response

This is a package-manager command preference question, not a full dependency-governance review, unless you plan to add/remove packages, change lockfiles, or switch package managers.

Recommended handling:
1. Inspect project conventions: `packageManager` in `package.json`, lockfiles (`bun.lock`, `bun.lockb`, `package-lock.json`), existing scripts, README/AGENTS instructions, and CI commands.
2. If the repo clearly standardizes on Bun, run tests with `bun test` or `bun run <script>`. If it standardizes on npm, use `npm test` or `npm run <script>`.
3. If mixed or ambiguous, ask/record the tool preference before running or documenting commands. A durable place is `.spec-to-ship/local-preferences.md` or the project instruction file, if the repo uses one.
4. Do not perform license, vulnerability, transitive dependency, or package-size analysis just to choose a test command.

Escalate to the deps workflow only if the answer implies a dependency/package-manager change, lockfile rewrite, package addition/removal, or supply-chain risk.
