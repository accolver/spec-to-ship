import { isRecord, readJson, repoRoot } from "./lib";
import path from "node:path";

const value = readJson(path.join(repoRoot(), "external-deps.json"));
const errors: string[] = [];
if (!isRecord(value) || !isRecord(value.dependencies) || !isRecord(value.dependencies.impeccable)) {
  errors.push("external-deps.json must define dependencies.impeccable");
} else {
  const impeccable = value.dependencies.impeccable;
  if (impeccable.source !== "https://github.com/pbakaus/impeccable") errors.push("impeccable.source must be canonical GitHub URL");
  if (impeccable.installCommand !== "npx impeccable skills install") errors.push("impeccable.installCommand must use documented npx command");
  if (impeccable.expectedSkillName !== "impeccable") errors.push("impeccable expectedSkillName mismatch");
}
if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}
console.log("Validated external dependencies.");
