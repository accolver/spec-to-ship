import fs from "node:fs";
import path from "node:path";
import { approvedSkills, repoRoot } from "./lib";

const root = repoRoot();
const checks: string[] = [];
for (const skill of approvedSkills) {
  const evalFile = path.join(root, "skills", "core", skill, "evals", "evals.json");
  const value = JSON.parse(fs.readFileSync(evalFile, "utf8")) as { evals?: unknown[] };
  if (!Array.isArray(value.evals) || value.evals.length < 3) checks.push(`${skill}: expected at least 3 evals`);
}
const sts = fs.readFileSync(path.join(root, "SPEC-TO-SHIP.md"), "utf8");
for (const phrase of [".spec-to-ship/features", "impeccable", "No completion claim", "worktree"]) {
  if (!sts.includes(phrase)) checks.push(`SPEC-TO-SHIP.md missing ${phrase}`);
}
if (checks.length > 0) {
  console.error(checks.map((check) => `- ${check}`).join("\n"));
  process.exit(1);
}
console.log("Smoke eval checks passed.");
