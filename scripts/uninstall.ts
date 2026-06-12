import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  approvedHarnesses,
  approvedSkills,
  assertHarnessSelection,
  assertInstallMode,
  parseArgs,
  parseFrontmatter,
  repoRoot,
  type ApprovedHarness,
  type ApprovedSkill,
  type HarnessSelection,
} from "./lib";

const args = parseArgs(process.argv.slice(2));
const help = args.help === true || args.h === true;
if (help) {
  console.log(`Usage: bun run scripts/uninstall.ts [options]\n\nOptions:\n  --mode local|global|both\n  --target <path>\n  --harness all|agents|pi|codex|claude|cursor|opencode|gemini|copilot\n  --dry-run\n  --yes\n  --restore-backups never|auto\n  --agents-mode remove-block|keep\n  --include-external-deps   Print explicit external dependency retention/removal guidance; does not delete Impeccable automatically.\n`);
  process.exit(0);
}

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
const restoreBackups = String(args["restore-backups"] ?? "never");
const agentsMode = String(args["agents-mode"] ?? "remove-block");
if (!["never", "auto"].includes(restoreBackups)) {
  console.error("Invalid --restore-backups value. Expected never or auto.");
  process.exit(1);
}
if (!["remove-block", "keep"].includes(agentsMode)) {
  console.error("Invalid --agents-mode value. Expected remove-block or keep.");
  process.exit(1);
}
if (!dryRun && !yes) {
  console.error("Refusing to uninstall without --dry-run or --yes. Run a dry-run first, then rerun with --yes after reviewing the plan.");
  process.exit(1);
}

const harnessDirs: Record<"local" | "global", Record<ApprovedHarness, string>> = {
  local: {
    agents: path.join(target, ".agents/skills"),
    pi: path.join(target, ".pi/skills"),
    codex: path.join(target, ".codex/skills"),
    claude: path.join(target, ".claude/skills"),
    cursor: path.join(target, ".cursor/skills"),
    opencode: path.join(target, ".opencode/skills"),
    gemini: path.join(target, ".gemini/skills"),
    copilot: path.join(target, ".github/skills"),
  },
  global: {
    agents: path.join(os.homedir(), ".agents/skills"),
    pi: path.join(os.homedir(), ".pi/agent/skills"),
    codex: path.join(os.homedir(), ".codex/skills"),
    claude: path.join(os.homedir(), ".claude/skills"),
    cursor: path.join(os.homedir(), ".cursor/skills"),
    opencode: path.join(os.homedir(), ".config/opencode/skills"),
    gemini: path.join(os.homedir(), ".gemini/skills"),
    copilot: path.join(os.homedir(), ".copilot/skills"),
  },
};

const commandDirs: Record<"local" | "global", Partial<Record<ApprovedHarness, string>>> = {
  local: {
    agents: path.join(target, ".agents/commands"),
    pi: path.join(target, ".pi/prompts"),
    claude: path.join(target, ".claude/commands"),
    cursor: path.join(target, ".cursor/commands"),
    opencode: path.join(target, ".opencode/commands"),
    gemini: path.join(target, ".gemini/commands"),
    copilot: path.join(target, ".github/prompts"),
  },
  global: {
    agents: path.join(os.homedir(), ".agents/commands"),
    pi: path.join(os.homedir(), ".pi/agent/prompts"),
    codex: path.join(os.homedir(), ".codex/prompts"),
    claude: path.join(os.homedir(), ".claude/commands"),
    cursor: path.join(os.homedir(), ".cursor/commands"),
    opencode: path.join(os.homedir(), ".config/opencode/commands"),
    gemini: path.join(os.homedir(), ".gemini/commands"),
    copilot: path.join(os.homedir(), ".copilot/prompts"),
  },
};

const commandSlugs = ["spec", "code", "worktree", "tdd", "debug", "review", "deps", "release", "finish", "ui"];

function commandFilesFor(harness: ApprovedHarness): string[] {
  if (harness === "gemini") return ["sts.toml", ...commandSlugs.map((slug) => path.join("sts", `${slug}.toml`))];
  if (harness === "claude" || harness === "cursor") return ["sts.md", ...commandSlugs.map((slug) => path.join("sts", `${slug}.md`))];
  if (harness === "copilot") return ["sts.prompt.md", ...commandSlugs.map((slug) => `sts-${slug}.prompt.md`)];
  return ["sts.md", ...commandSlugs.map((slug) => `sts-${slug}.md`)];
}

function selectedHarnesses(selection: HarnessSelection): ApprovedHarness[] {
  return selection === "all" ? [...approvedHarnesses] : [selection];
}

function scopes(): Array<"local" | "global"> {
  if (mode === "both") return ["local", "global"];
  return [mode];
}

function stamp(): string {
  return new Date().toISOString().replace(/[-:.]/g, "").replace("T", "-").slice(0, 16);
}

function backupRoot(scope: "local" | "global"): string {
  return scope === "local"
    ? path.join(target, ".spec-to-ship/uninstall-backups", stamp())
    : path.join(os.homedir(), ".config/spec-to-ship/uninstall-backups", stamp());
}

function copyBackup(source: string, root: string, label: string): string {
  const dest = path.join(root, label);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const stat = fs.lstatSync(source);
  if (stat.isDirectory() && !stat.isSymbolicLink()) {
    fs.cpSync(source, dest, { recursive: true, verbatimSymlinks: true });
  } else if (stat.isSymbolicLink()) {
    fs.symlinkSync(fs.readlinkSync(source), dest);
  } else {
    fs.copyFileSync(source, dest);
  }
  return dest;
}

function isStsOwnedSkill(skill: ApprovedSkill, skillPath: string): boolean {
  const stat = fs.lstatSync(skillPath, { throwIfNoEntry: false });
  if (!stat) return false;
  if (stat.isSymbolicLink()) {
    const targetPath = path.resolve(path.dirname(skillPath), fs.readlinkSync(skillPath));
    return targetPath === path.join(repoRoot(), "skills/core", skill) || targetPath.startsWith(path.join(repoRoot(), "skills/core", skill) + path.sep);
  }
  const skillFile = path.join(skillPath, "SKILL.md");
  if (!fs.existsSync(skillFile)) return false;
  const content = fs.readFileSync(skillFile, "utf8");
  const frontmatter = parseFrontmatter(content);
  return frontmatter?.data.name === skill && content.includes("package: spec-to-ship");
}

function isStsOwnedCommand(commandPath: string): boolean {
  const stat = fs.lstatSync(commandPath, { throwIfNoEntry: false });
  if (!stat || stat.isDirectory()) return false;
  if (stat.isSymbolicLink()) {
    const targetPath = path.resolve(path.dirname(commandPath), fs.readlinkSync(commandPath));
    return targetPath.startsWith(path.join(repoRoot(), "dist") + path.sep) || targetPath.startsWith(path.join(repoRoot(), "commands") + path.sep);
  }
  const content = fs.readFileSync(commandPath, "utf8");
  return content.includes("package: spec-to-ship") || content.includes("Generated by Spec-to-Ship") || content.includes("Spec-to-Ship `/sts");
}

function removeEmptyParents(filePath: string, stopAt: string): void {
  let current = path.dirname(filePath);
  const stop = path.resolve(stopAt);
  while (path.resolve(current).startsWith(stop) && path.resolve(current) !== stop) {
    try {
      fs.rmdirSync(current);
    } catch {
      break;
    }
    current = path.dirname(current);
  }
}

function siblingBackups(dest: string): string[] {
  const parent = path.dirname(dest);
  const base = path.basename(dest);
  if (!fs.existsSync(parent)) return [];
  return fs.readdirSync(parent)
    .filter((entry) => entry.startsWith(`${base}.bak-`))
    .map((entry) => path.join(parent, entry))
    .sort();
}

function restoreSingleBackup(dest: string): string | null {
  const backups = siblingBackups(dest);
  if (backups.length !== 1 || fs.existsSync(dest)) return null;
  fs.renameSync(backups[0], dest);
  return backups[0];
}

const planned: string[] = [];
const warnings: string[] = [];
const roots = new Map<"local" | "global", string>();
for (const scope of scopes()) roots.set(scope, backupRoot(scope));

function uninstallAgentsBlock(scope: "local" | "global"): void {
  if (scope !== "local" || agentsMode === "keep") return;
  const agentsPath = path.join(target, "AGENTS.md");
  const start = "<!-- spec-to-ship:start -->";
  const end = "<!-- spec-to-ship:end -->";
  const stat = fs.lstatSync(agentsPath, { throwIfNoEntry: false });
  if (!stat) {
    planned.push(`AGENTS.md: not present`);
    return;
  }
  if (stat.isSymbolicLink()) {
    warnings.push(`Refusing to edit symlinked AGENTS.md: ${agentsPath}`);
    return;
  }
  const content = fs.readFileSync(agentsPath, "utf8");
  const hasStart = content.includes(start);
  const hasEnd = content.includes(end);
  if (!hasStart && !hasEnd) {
    planned.push(`AGENTS.md: no STS managed block`);
    return;
  }
  if (hasStart !== hasEnd) {
    warnings.push(`AGENTS.md has unbalanced STS markers; manual cleanup required: ${agentsPath}`);
    return;
  }
  planned.push(`Remove STS managed block from ${agentsPath}`);
  if (dryRun) return;
  const root = roots.get(scope) ?? backupRoot(scope);
  const backup = copyBackup(agentsPath, root, "AGENTS.md");
  const next = content.replace(new RegExp(`${start}[\\s\\S]*?${end}\\n?`, "m"), "").replace(/\n{3,}/g, "\n\n");
  if (next.trim() === "# Project Instructions" || next.trim() === "") {
    fs.rmSync(agentsPath);
  } else {
    fs.writeFileSync(agentsPath, next.replace(/\s*$/, "\n"));
  }
  planned.push(`Backup written: ${backup}`);
}

for (const scope of scopes()) {
  uninstallAgentsBlock(scope);
  for (const h of selectedHarnesses(harness)) {
    const base = harnessDirs[scope][h];
    for (const skill of approvedSkills) {
      const skillPath = path.join(base, skill);
      if (!fs.existsSync(skillPath) && !fs.lstatSync(skillPath, { throwIfNoEntry: false })) continue;
      if (!isStsOwnedSkill(skill, skillPath)) {
        warnings.push(`Skipped non-STS or unproven skill path: ${skillPath}`);
        continue;
      }
      planned.push(`Remove STS skill ${skillPath}`);
      if (dryRun) continue;
      const root = roots.get(scope) ?? backupRoot(scope);
      const backup = copyBackup(skillPath, root, path.join("skills", scope, h, skill));
      fs.rmSync(skillPath, { recursive: true, force: true });
      planned.push(`Backup written: ${backup}`);
      if (restoreBackups === "auto") {
        const restored = restoreSingleBackup(skillPath);
        if (restored) planned.push(`Restored previous backup ${restored} -> ${skillPath}`);
      }
    }
    const commandBase = commandDirs[scope][h];
    if (commandBase) {
      for (const commandFile of commandFilesFor(h)) {
        const commandPath = path.join(commandBase, commandFile);
        if (!fs.existsSync(commandPath) && !fs.lstatSync(commandPath, { throwIfNoEntry: false })) continue;
        if (!isStsOwnedCommand(commandPath)) {
          warnings.push(`Skipped non-STS or unproven command path: ${commandPath}`);
          continue;
        }
        planned.push(`Remove STS command ${commandPath}`);
        if (dryRun) continue;
        const root = roots.get(scope) ?? backupRoot(scope);
        const backup = copyBackup(commandPath, root, path.join("commands", scope, h, commandFile));
        fs.rmSync(commandPath, { force: true });
        removeEmptyParents(commandPath, commandBase);
        planned.push(`Backup written: ${backup}`);
        if (restoreBackups === "auto") {
          const restored = restoreSingleBackup(commandPath);
          if (restored) planned.push(`Restored previous backup ${restored} -> ${commandPath}`);
        }
      }
    }
  }
}

if (args["include-external-deps"] === true) {
  warnings.push("External Impeccable uninstall is intentionally manual. STS did not remove Impeccable because it may be shared by other workflows.");
} else {
  planned.push("External dependency Impeccable retained (default). Use --include-external-deps for manual guidance only.");
}

console.log(dryRun ? "Spec-to-Ship uninstall dry-run plan:" : "Spec-to-Ship uninstall actions:");
for (const item of planned) console.log(`- ${item}`);
if (warnings.length > 0) {
  console.log("Warnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

process.exit(warnings.length > 0 ? 1 : 0);
