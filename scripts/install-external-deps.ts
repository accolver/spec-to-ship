import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import childProcess from "node:child_process";
import readline from "node:readline/promises";
import { isRecord, parseArgs, readJson, repoRoot } from "./lib";

const args = parseArgs(process.argv.slice(2));
const mode = String(args.mode ?? "local");
const target = path.resolve(String(args.target ?? process.cwd()));
const dryRun = args["dry-run"] === true;
const yes = args.yes === true;
const config = readJson(path.join(repoRoot(), "external-deps.json"));

function expand(location: string): string {
  if (location.startsWith("~/")) return path.join(os.homedir(), location.slice(2));
  return path.join(target, location);
}

if (!isRecord(config) || !isRecord(config.dependencies) || !isRecord(config.dependencies.impeccable)) {
  console.error("Missing external dependency config for Impeccable.");
  process.exit(1);
}
const impeccable = config.dependencies.impeccable;
const localLocations = Array.isArray(impeccable.expectedLocalLocations) ? impeccable.expectedLocalLocations.filter((item): item is string => typeof item === "string") : [];
const globalLocations = Array.isArray(impeccable.expectedGlobalLocations) ? impeccable.expectedGlobalLocations.filter((item): item is string => typeof item === "string") : [];
const selected = mode === "global" ? globalLocations : mode === "both" ? [...localLocations, ...globalLocations] : localLocations;
const found = selected.map(expand).filter((location) => fs.existsSync(path.join(location, "SKILL.md")) || fs.existsSync(location));
if (found.length > 0) {
  console.log(`Impeccable already detected:\n${found.map((item) => `- ${item}`).join("\n")}`);
  console.log("Reminder: run /impeccable init inside your AI coding tool if this project has not been initialized.");
  process.exit(0);
}
const installCommand = String(impeccable.installCommand ?? "npx impeccable skills install");
console.log("Impeccable is not installed in the selected STS scope.");
console.log(`Canonical source: ${String(impeccable.source ?? "https://github.com/pbakaus/impeccable")}`);
console.log(`Install command: ${installCommand}`);
if (dryRun) {
  console.log("Dry run: would ask before running the Impeccable installer.");
  process.exit(0);
}
let approved = yes;
if (!approved && process.stdin.isTTY) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question("Run Impeccable installer now? [y/N] ");
  rl.close();
  approved = answer.trim().toLowerCase() === "y" || answer.trim().toLowerCase() === "yes";
}
if (!approved) {
  console.log("Skipped Impeccable install. Manual command:");
  console.log(installCommand);
  console.log("After install, run /impeccable init inside your AI coding tool.");
  process.exit(0);
}
const result = childProcess.spawnSync(installCommand, { cwd: target, shell: true, stdio: "inherit" });
if (result.status !== 0) {
  console.error("Impeccable install failed. Run manually:");
  console.error(installCommand);
  process.exit(result.status ?? 1);
}
console.log("Impeccable installer completed. Run /impeccable init inside your AI coding tool.");
