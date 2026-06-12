# Response

Use the package manager the repository already standardizes on. I would check for lockfiles and scripts:

- `bun.lock` or `bun.lockb` plus `packageManager: "bun@..."` means use `bun install`, `bun test`, and `bun run <script>`.
- `package-lock.json` or `packageManager: "npm@..."` means use `npm install`, `npm test`, and `npm run <script>`.
- If both are present or unclear, ask the maintainer which one is canonical before running tests.

I would record the choice in local project instructions if it is not already documented.
