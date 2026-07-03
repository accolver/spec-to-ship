import fs from "node:fs";
import path from "node:path";
import { isRecord, repoRoot } from "./lib";

const root = repoRoot();
const packageRoot = path.join(root, "packages", "pi-sts-workflow");
const packageJsonPath = path.join(packageRoot, "package.json");
const extensionPath = path.join(packageRoot, "extensions", "sts-workflow.ts");
const readmePath = path.join(packageRoot, "README.md");

const errors: string[] = [];

function readRequired(file: string): string {
  if (!fs.existsSync(file)) {
    errors.push(`Missing file: ${path.relative(root, file)}`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

const packageJsonText = readRequired(packageJsonPath);
const extensionText = readRequired(extensionPath);
const readmeText = readRequired(readmePath);

if (packageJsonText) {
  try {
    const parsed: unknown = JSON.parse(packageJsonText);
    if (!isRecord(parsed)) {
      errors.push("packages/pi-sts-workflow/package.json must be a JSON object");
    } else {
      if (parsed.name !== "spec-to-ship-pi-workflow") errors.push("Pi workflow package name must be spec-to-ship-pi-workflow");
      if (parsed.private !== true) errors.push("Pi workflow package should remain private until an explicit publish decision");
      const keywords = Array.isArray(parsed.keywords) ? parsed.keywords : [];
      if (!keywords.includes("pi-package")) errors.push("Pi workflow package keywords must include pi-package");
      const pi = parsed.pi;
      if (!isRecord(pi)) {
        errors.push("Pi workflow package must declare a pi manifest");
      } else {
        const extensions = Array.isArray(pi.extensions) ? pi.extensions : [];
        if (!extensions.includes("extensions/sts-workflow.ts")) {
          errors.push("Pi workflow package must expose extensions/sts-workflow.ts");
        }
      }
    }
  } catch (error) {
    errors.push(`Invalid package JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const extensionExpectations = [
  "registerCommand(COMMAND_NAME",
  "ctx.ui.editor",
  "workflowToolActive",
  "pi.sendUserMessage",
  "export const meta =",
  "agent('",
  "parallel([",
  "pipeline(",
  "proof-of-success",
  "SPEC-TO-SHIP.md",
  ".spec-to-ship/features/<feature-id>",
  "approved-to-implement",
  "stop-after-spec",
];

for (const expected of extensionExpectations) {
  if (!extensionText.includes(expected)) errors.push(`sts-workflow extension must include ${expected}`);
}

const readmeExpectations = [
  "pi install npm:@quintinshaw/pi-dynamic-workflows",
  "pi install ./packages/pi-sts-workflow",
  "/sts-workflow",
  "proof of success",
  "`SPEC-TO-SHIP.md` remains canonical",
];

for (const expected of readmeExpectations) {
  if (!readmeText.includes(expected)) errors.push(`Pi workflow README must include ${expected}`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log("Validated optional Pi workflow package.");
