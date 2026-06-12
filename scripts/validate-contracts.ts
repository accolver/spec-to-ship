import fs from "node:fs";
import path from "node:path";
import { approvedSkills, isRecord, readJson, repoRoot } from "./lib";

const root = repoRoot();
const errors: string[] = [];

function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string" && item.length > 0);
}

for (const skill of approvedSkills) {
  const file = path.join(root, "skills", "core", skill, "contract.json");
  if (!fs.existsSync(file)) {
    errors.push(`${skill}: missing contract.json`);
    continue;
  }
  const value = readJson(file);
  if (!isRecord(value)) {
    errors.push(`${skill}: contract must be an object`);
    continue;
  }
  if (value.name !== skill) errors.push(`${skill}: contract name mismatch`);
  for (const field of ["version", "category", "approvalPolicy", "toolPolicy"]) {
    if (typeof value[field] !== "string" || value[field].length === 0) errors.push(`${skill}: missing string ${field}`);
  }
  for (const field of ["triggers", "antiTriggers", "inputs", "outputs", "verification", "stopRules"]) {
    if (!stringArray(value[field])) errors.push(`${skill}: missing non-empty string array ${field}`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}
console.log(`Validated ${approvedSkills.length} STS contracts.`);
