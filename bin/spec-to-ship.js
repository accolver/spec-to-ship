#!/usr/bin/env node
import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rawArgs = process.argv.slice(2);
const args = rawArgs[0] === "--" ? rawArgs.slice(1) : rawArgs;

if (args[0] === "help" || args[0] === "--help" || args[0] === "-h") {
  usage();
  process.exit(0);
}

const command = args[0] && !args[0].startsWith("-") ? args[0] : "install";
let commandArgs = command === "install" ? (args[0] === "install" ? args.slice(1) : args) : args.slice(1);
if (commandArgs[0] === "--") commandArgs = commandArgs.slice(1);

function usage() {
  console.log(`Spec-to-Ship installer

Usage:
  spec-to-ship install [install options]
  spec-to-ship [install options]
  spec-to-ship uninstall [uninstall options]

Examples:
  bunx github:accolver/spec-to-ship install --mode local --target . --harness pi
  npx --yes github:accolver/spec-to-ship install --mode local --target . --harness pi

Notes:
  - The installer delegates to scripts/install.sh and requires bash and Bun.
  - Use --skip-external-deps to skip optional external skill installation.
`);
}

const scriptByCommand = {
  install: path.join(root, "scripts", "install.sh"),
  uninstall: path.join(root, "scripts", "uninstall.sh"),
};

const script = scriptByCommand[command];
if (!script) {
  console.error(`Unknown spec-to-ship command: ${command}`);
  usage();
  process.exit(1);
}

if (!fs.existsSync(script)) {
  console.error(`Missing STS script: ${script}`);
  process.exit(1);
}

const result = childProcess.spawnSync("bash", [script, ...commandArgs], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
