import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import childProcess from "node:child_process";
import { approvedHarnesses, approvedSkills, repoRoot } from "./lib";

const root = repoRoot();
const runRoot = fs.mkdtempSync(path.join(os.tmpdir(), "sts-install-smoke-"));
const install = path.join(root, "scripts/install.sh");
const packageBin = path.join(root, "bin/spec-to-ship.js");

type RunOptions = { home?: string; expectFailure?: boolean };

type RunSpec = { executable: string; args: string[]; cwd?: string };

function runProcess(label: string, spec: RunSpec, options: RunOptions = {}): childProcess.SpawnSyncReturns<string> {
  const result = childProcess.spawnSync(spec.executable, spec.args, {
    cwd: spec.cwd ?? root,
    env: { ...process.env, HOME: options.home ?? process.env.HOME ?? os.homedir() },
    encoding: "utf8",
  });
  const ok = options.expectFailure ? result.status !== 0 : result.status === 0;
  if (!ok) {
    console.error(`Install smoke failed: ${label}`);
    console.error(`command: ${spec.executable} ${spec.args.join(" ")}`);
    console.error(`status: ${result.status}`);
    console.error(result.stdout);
    console.error(result.stderr);
    process.exit(1);
  }
  return result;
}

function run(label: string, args: string[], options: RunOptions = {}): childProcess.SpawnSyncReturns<string> {
  return runProcess(label, { executable: install, args }, options);
}

function runBin(label: string, args: string[], options: RunOptions = {}): childProcess.SpawnSyncReturns<string> {
  return runProcess(label, { executable: process.execPath, args: [packageBin, ...args] }, options);
}

function localSkillDir(target: string, harness: string): string {
  const dirs: Record<string, string> = {
    agents: ".agents/skills",
    pi: ".pi/skills",
    codex: ".codex/skills",
    claude: ".claude/skills",
    cursor: ".cursor/skills",
    opencode: ".opencode/skills",
    gemini: ".gemini/skills",
    copilot: ".github/skills",
  };
  return path.join(target, dirs[harness]);
}

function localCommandDir(target: string, harness: string): string | null {
  const dirs: Record<string, string> = {
    agents: ".agents/commands",
    pi: ".pi/prompts",
    claude: ".claude/commands",
    cursor: ".cursor/commands",
    opencode: ".opencode/commands",
    gemini: ".gemini/commands",
    copilot: ".github/prompts",
  };
  return dirs[harness] ? path.join(target, dirs[harness]) : null;
}

function globalSkillDir(home: string, harness: string): string {
  const dirs: Record<string, string> = {
    agents: ".agents/skills",
    pi: ".pi/agent/skills",
    codex: ".codex/skills",
    claude: ".claude/skills",
    cursor: ".cursor/skills",
    opencode: ".config/opencode/skills",
    gemini: ".gemini/skills",
    copilot: ".copilot/skills",
  };
  return path.join(home, dirs[harness]);
}

function globalCommandDir(home: string, harness: string): string | null {
  const dirs: Record<string, string> = {
    agents: ".agents/commands",
    pi: ".pi/agent/prompts",
    codex: ".codex/prompts",
    claude: ".claude/commands",
    cursor: ".cursor/commands",
    opencode: ".config/opencode/commands",
    gemini: ".gemini/commands",
    copilot: ".copilot/prompts",
  };
  return dirs[harness] ? path.join(home, dirs[harness]) : null;
}

function assertSkillSet(dir: string): void {
  for (const skill of approvedSkills) {
    const skillFile = path.join(dir, skill, "SKILL.md");
    if (!fs.existsSync(skillFile)) {
      throw new Error(`Missing installed skill file: ${skillFile}`);
    }
  }
}

function assertCommandSet(dir: string, harness: string): void {
  const files = harness === "gemini"
    ? ["sts.toml", "sts/spec.toml", "sts/code.toml"]
    : harness === "claude" || harness === "cursor"
      ? ["sts.md", "sts/spec.md", "sts/code.md"]
      : harness === "copilot"
        ? ["sts.prompt.md", "sts-spec.prompt.md", "sts-code.prompt.md"]
        : ["sts.md", "sts-spec.md", "sts-code.md"];
  for (const file of files) {
    const commandFile = path.join(dir, file);
    if (!fs.existsSync(commandFile)) throw new Error(`Missing installed command file: ${commandFile}`);
  }
}

function countBackups(target: string): number {
  let count = 0;
  function walk(dir: string): void {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.name.includes(".bak-")) count += 1;
      if (entry.isDirectory()) walk(full);
    }
  }
  walk(target);
  return count;
}

function countInstallBackups(home: string): number {
  return countBackups(path.join(home, ".config", "spec-to-ship", "install-backups"));
}

const localTarget = path.join(runRoot, "local-all");
fs.mkdirSync(localTarget, { recursive: true });
fs.writeFileSync(path.join(localTarget, "AGENTS.md"), "# Existing instructions\n\nKeep me.\n");
const localHome = path.join(runRoot, "home-local");
run("local all copy", ["--mode", "local", "--target", localTarget, "--harness", "all", "--copy", "--skip-external-deps"], { home: localHome });
for (const harness of approvedHarnesses) assertSkillSet(localSkillDir(localTarget, harness));
for (const harness of approvedHarnesses) {
  const commandDir = localCommandDir(localTarget, harness);
  if (commandDir) assertCommandSet(commandDir, harness);
}
const agentsContent = fs.readFileSync(path.join(localTarget, "AGENTS.md"), "utf8");
if (!agentsContent.includes("Keep me.") || (agentsContent.match(/spec-to-ship:start/g) ?? []).length !== 1) {
  throw new Error("AGENTS.md managed block was not inserted idempotently while preserving existing content.");
}
const targetBackupsAfterFirst = countBackups(localTarget);
const installBackupsAfterFirst = countInstallBackups(localHome);
if (targetBackupsAfterFirst !== 0) {
  throw new Error(`Install polluted target with adjacent backups: found ${targetBackupsAfterFirst}`);
}
if (installBackupsAfterFirst < 1) {
  throw new Error("Install did not preserve an external AGENTS.md backup.");
}
run("local all copy second run", ["--mode", "local", "--target", localTarget, "--harness", "all", "--copy", "--skip-external-deps"], { home: localHome });
const targetBackupsAfterSecond = countBackups(localTarget);
const installBackupsAfterSecond = countInstallBackups(localHome);
if (targetBackupsAfterSecond !== targetBackupsAfterFirst) {
  throw new Error(`Idempotency failed: target backups changed from ${targetBackupsAfterFirst} to ${targetBackupsAfterSecond}`);
}
if (installBackupsAfterSecond !== installBackupsAfterFirst) {
  throw new Error(`Idempotency failed: install backups changed from ${installBackupsAfterFirst} to ${installBackupsAfterSecond}`);
}

const focusedTarget = path.join(runRoot, "focused-agents");
const focusedHome = path.join(runRoot, "home-focused");
run("harness agents focused", ["--mode", "local", "--target", focusedTarget, "--harness", "agents", "--copy", "--skip-external-deps"], { home: focusedHome });
assertSkillSet(localSkillDir(focusedTarget, "agents"));
const focusedCommands = localCommandDir(focusedTarget, "agents");
if (!focusedCommands) throw new Error("Missing agents command directory mapping");
assertCommandSet(focusedCommands, "agents");
if (fs.existsSync(localSkillDir(focusedTarget, "pi"))) throw new Error("Focused harness install created pi skills unexpectedly.");
if (localCommandDir(focusedTarget, "pi") && fs.existsSync(localCommandDir(focusedTarget, "pi")!)) throw new Error("Focused harness install created pi commands unexpectedly.");

const binHelp = runBin("package bin help", ["--help"]);
if (!binHelp.stdout.includes("Spec-to-Ship installer") || !binHelp.stdout.includes("bunx github:accolver/spec-to-ship")) {
  throw new Error("Package bin help did not describe npx/bunx installer usage.");
}
const binTarget = path.join(runRoot, "bin-wrapper-agents");
const binHome = path.join(runRoot, "home-bin-wrapper");
runBin("package bin install subcommand", ["install", "--mode", "local", "--target", binTarget, "--harness", "agents", "--copy", "--skip-external-deps"], { home: binHome });
assertSkillSet(localSkillDir(binTarget, "agents"));
assertCommandSet(localCommandDir(binTarget, "agents")!, "agents");

const bothTarget = path.join(runRoot, "both-agents");
const bothHome = path.join(runRoot, "home-both");
run("mode both temp HOME", ["--mode", "both", "--target", bothTarget, "--harness", "agents", "--copy", "--skip-external-deps", "--yes"], { home: bothHome });
assertSkillSet(localSkillDir(bothTarget, "agents"));
assertSkillSet(globalSkillDir(bothHome, "agents"));
assertCommandSet(localCommandDir(bothTarget, "agents")!, "agents");
assertCommandSet(globalCommandDir(bothHome, "agents")!, "agents");

const invalidTarget = path.join(runRoot, "invalid");
run("invalid mode fails", ["--mode", "gloabl", "--target", invalidTarget, "--harness", "agents", "--skip-external-deps"], { home: path.join(runRoot, "home-invalid"), expectFailure: true });
run("invalid harness fails", ["--mode", "local", "--target", invalidTarget, "--harness", "agnets", "--skip-external-deps"], { home: path.join(runRoot, "home-invalid-harness"), expectFailure: true });

const symlinkTarget = path.join(runRoot, "symlink-agents");
fs.mkdirSync(symlinkTarget, { recursive: true });
const sharedAgents = path.join(runRoot, "shared-AGENTS.md");
fs.writeFileSync(sharedAgents, "shared\n");
fs.symlinkSync(sharedAgents, path.join(symlinkTarget, "AGENTS.md"));
run("symlink AGENTS refused", ["--mode", "local", "--target", symlinkTarget, "--harness", "agents", "--copy", "--skip-external-deps"], { home: path.join(runRoot, "home-symlink"), expectFailure: true });
if (fs.readFileSync(sharedAgents, "utf8") !== "shared\n") throw new Error("Symlinked AGENTS.md target was modified.");

console.log(`Install smoke passed in ${runRoot}`);
