import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import childProcess from "node:child_process";
import readline from "node:readline/promises";
import {
  assertHarnessSelection,
  assertInstallMode,
  isRecord,
  parseArgs,
  parseFrontmatter,
  readJson,
  repoRoot,
  type HarnessSelection,
} from "./lib";

const args = parseArgs(process.argv.slice(2));
const mode = String(args.mode ?? "local");
const harness = String(args.harness ?? "all");
try {
  assertInstallMode(mode);
  assertHarnessSelection(harness);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
const target = path.resolve(String(args.target ?? process.cwd()));
const dryRun = args["dry-run"] === true;
const yes = args.yes === true;
const config = readJson(path.join(repoRoot(), "external-deps.json"));

function expand(location: string): string {
  if (location.startsWith("~/")) return path.join(os.homedir(), location.slice(2));
  return path.join(target, location);
}

function matchesHarness(location: string, selection: HarnessSelection): boolean {
  if (selection === "all") return true;
  const needles: Record<Exclude<HarnessSelection, "all">, string[]> = {
    agents: [".agents/skills/impeccable"],
    pi: [".pi/skills/impeccable", ".pi/agent/skills/impeccable"],
    codex: [".codex/skills/impeccable"],
    claude: [".claude/skills/impeccable"],
    cursor: [".cursor/skills/impeccable"],
    opencode: [".opencode/skills/impeccable", ".config/opencode/skills/impeccable"],
    gemini: [".gemini/skills/impeccable"],
    copilot: [".github/skills/impeccable", ".copilot/skills/impeccable"],
  };
  return needles[selection].some((needle) => location.includes(needle));
}

function providerFor(selection: HarnessSelection): string | null {
  if (selection === "all") return null;
  const providers: Record<Exclude<HarnessSelection, "all">, string> = {
    agents: ".agents",
    pi: ".pi",
    codex: ".codex",
    claude: ".claude",
    cursor: ".cursor",
    opencode: ".opencode",
    gemini: ".gemini",
    copilot: ".github",
  };
  return providers[selection];
}

function isValidImpeccableSkill(location: string): boolean {
  const skillFile = path.join(location, "SKILL.md");
  if (!fs.existsSync(skillFile)) return false;
  const parsed = parseFrontmatter(fs.readFileSync(skillFile, "utf8"));
  return parsed?.data.name === "impeccable";
}

if (!isRecord(config) || !isRecord(config.dependencies) || !isRecord(config.dependencies.impeccable)) {
  console.error("Missing external dependency config for Impeccable.");
  process.exit(1);
}
const impeccable = config.dependencies.impeccable;
const localLocations = Array.isArray(impeccable.expectedLocalLocations) ? impeccable.expectedLocalLocations.filter((item): item is string => typeof item === "string") : [];
const globalLocations = Array.isArray(impeccable.expectedGlobalLocations) ? impeccable.expectedGlobalLocations.filter((item): item is string => typeof item === "string") : [];
const selectedRaw = mode === "global" ? globalLocations : mode === "both" ? [...localLocations, ...globalLocations] : localLocations;
const selected = selectedRaw.filter((location) => matchesHarness(location, harness));
const expandedLocations = selected.map(expand);
const found = expandedLocations.filter(isValidImpeccableSkill);
const invalidExisting = expandedLocations.filter((location) => fs.existsSync(location) && !isValidImpeccableSkill(location));
if (found.length > 0) {
  console.log(`Impeccable already detected:\n${found.map((item) => `- ${item}`).join("\n")}`);
  console.log("Reminder: run /impeccable init inside your AI coding tool if this project has not been initialized.");
  if (invalidExisting.length > 0) {
    console.log(`Ignored ${invalidExisting.length} invalid Impeccable path(s) without a valid SKILL.md.`);
  }
  process.exit(0);
}
if (invalidExisting.length > 0) {
  console.log(`Found ${invalidExisting.length} invalid Impeccable path(s) without a valid SKILL.md; continuing as not installed.`);
}
const installCommand = String(impeccable.installCommand ?? "npx impeccable skills install");
if (installCommand !== "npx impeccable skills install") {
  console.error(`Refusing unapproved Impeccable install command: ${installCommand}`);
  process.exit(1);
}
const spawnArgs = ["impeccable", "skills", "install"];
if (yes) spawnArgs.push("--yes");
const provider = providerFor(harness);
if (provider) spawnArgs.push(`--providers=${provider}`);
console.log("Impeccable is not installed in the selected STS scope.");
console.log(`Canonical source: ${String(impeccable.source ?? "https://github.com/pbakaus/impeccable")}`);
console.log(`Install command: npx ${spawnArgs.join(" ")}`);
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
  console.log(`npx ${spawnArgs.join(" ")}`);
  console.log("After install, run /impeccable init inside your AI coding tool.");
  process.exit(0);
}
const result = childProcess.spawnSync("npx", spawnArgs, { cwd: target, shell: false, stdio: "inherit" });
if (result.status !== 0) {
  console.error("Impeccable install failed. Run manually:");
  console.error(`npx ${spawnArgs.join(" ")}`);
  process.exit(result.status ?? 1);
}
console.log("Impeccable installer completed. Run /impeccable init inside your AI coding tool.");
