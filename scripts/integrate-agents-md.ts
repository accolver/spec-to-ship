import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs, repoRoot } from "./lib";

const args = parseArgs(process.argv.slice(2));
const target = path.resolve(String(args.target ?? process.cwd()));
const stsRoot = path.resolve(String(args["sts-root"] ?? repoRoot()));
const dryRun = args["dry-run"] === true;
const agentsPath = path.join(target, "AGENTS.md");
const start = "<!-- spec-to-ship:start -->";
const end = "<!-- spec-to-ship:end -->";
const block = `${start}\nSpec-to-Ship (STS) is installed. For non-trivial coding work, read and follow:\n\`${path.join(stsRoot, "SPEC-TO-SHIP.md")}\`\n\nKeep project-specific instructions in this AGENTS.md. Do not duplicate STS lifecycle instructions here.\n${end}`;

function backupPathForTarget(): string {
  const targetHash = crypto.createHash("sha256").update(target).digest("hex").slice(0, 12);
  const targetLabel = path.basename(target) || "target";
  const backupDir = path.join(os.homedir(), ".config", "spec-to-ship", "install-backups", `${targetLabel}-${targetHash}`);
  return path.join(backupDir, `AGENTS.md.bak-${Date.now()}`);
}

const existingStat = fs.lstatSync(agentsPath, { throwIfNoEntry: false });
if (existingStat?.isSymbolicLink()) {
  console.error(`Refusing to modify symlinked AGENTS.md: ${agentsPath}`);
  console.error("Replace the symlink with a regular file or edit the target manually, then rerun the installer.");
  process.exit(1);
}
const existed = existingStat !== undefined;
let content = existed ? fs.readFileSync(agentsPath, "utf8") : "";
const hasStart = content.includes(start);
const hasEnd = content.includes(end);
if (hasStart !== hasEnd) {
  console.error("AGENTS.md has an unbalanced spec-to-ship managed block. Refusing to edit.");
  process.exit(1);
}
let next: string;
if (hasStart && hasEnd) {
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  next = content.replace(pattern, block);
} else if (content.trim().length === 0) {
  next = `# Project Instructions\n\n${block}\n`;
} else {
  next = `${content.replace(/\s*$/, "\n\n")}${block}\n`;
}
if (next === content) {
  console.log("AGENTS.md already contains the current STS managed block.");
  process.exit(0);
}
if (dryRun) {
  console.log(`${existed ? "Would update" : "Would create"} ${agentsPath}`);
  process.exit(0);
}
fs.mkdirSync(target, { recursive: true });
if (existed) {
  const backup = backupPathForTarget();
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.copyFileSync(agentsPath, backup);
  console.log(`Backup written: ${backup}`);
}
fs.writeFileSync(agentsPath, next);
console.log(`${existed ? "Updated" : "Created"} ${agentsPath}`);
