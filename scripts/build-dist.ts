import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { approvedSkills, parseArgs, repoRoot } from "./lib";

const root = repoRoot();
const args = parseArgs(process.argv.slice(2));
const check = args.check === true;
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "sts-dist-"));
const out = path.join(temp, "dist");

const layouts: Record<string, string> = {
  agents: ".agents/skills",
  pi: ".pi/skills",
  codex: ".codex/skills",
  claude: ".claude/skills",
  cursor: ".cursor/skills",
  opencode: ".opencode/skills",
  gemini: ".gemini/skills",
  copilot: ".github/skills"
};

for (const [target, skillRoot] of Object.entries(layouts)) {
  for (const skill of approvedSkills) {
    const source = path.join(root, "skills", "core", skill);
    const dest = path.join(out, target, skillRoot, skill);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.cpSync(source, dest, { recursive: true });
  }
}

function listFiles(dir: string, base: string = dir): string[] {
  if (!fs.existsSync(dir)) return [];
  const result: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...listFiles(full, base));
    else result.push(path.relative(base, full));
  }
  return result.sort();
}

function sameTree(a: string, b: string): boolean {
  const filesA = listFiles(a).sort();
  const filesB = listFiles(b).sort();
  if (filesA.join("\n") !== filesB.join("\n")) return false;
  for (const file of filesA) {
    if (fs.readFileSync(path.join(a, file), "utf8") !== fs.readFileSync(path.join(b, file), "utf8")) return false;
  }
  return true;
}

const dist = path.join(root, "dist");
if (check) {
  if (!sameTree(out, dist)) {
    console.error("dist is out of date. Run bun run build:dist.");
    process.exit(1);
  }
  console.log("dist is current.");
} else {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.cpSync(out, dist, { recursive: true });
  console.log("Generated dist targets.");
}
fs.rmSync(temp, { recursive: true, force: true });
