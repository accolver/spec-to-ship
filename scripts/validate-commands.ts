import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter, repoRoot } from "./lib";

const root = repoRoot();
const commandsRoot = path.join(root, "commands");
const expected = [
  { file: "sts.md", name: "sts" },
  { file: "sts/spec.md", name: "sts:spec" },
  { file: "sts/code.md", name: "sts:code" },
  { file: "sts/worktree.md", name: "sts:worktree" },
  { file: "sts/tdd.md", name: "sts:tdd" },
  { file: "sts/debug.md", name: "sts:debug" },
  { file: "sts/review.md", name: "sts:review" },
  { file: "sts/deps.md", name: "sts:deps" },
  { file: "sts/release.md", name: "sts:release" },
  { file: "sts/finish.md", name: "sts:finish" },
  { file: "sts/ui.md", name: "sts:ui" },
];

const errors: string[] = [];
for (const command of expected) {
  const file = path.join(commandsRoot, command.file);
  if (!fs.existsSync(file)) {
    errors.push(`Missing command file: ${command.file}`);
    continue;
  }
  const content = fs.readFileSync(file, "utf8");
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) {
    errors.push(`${command.file} is missing YAML frontmatter`);
    continue;
  }
  if (frontmatter.data.name !== command.name) errors.push(`${command.file} name must be ${command.name}`);
  if (!frontmatter.data.description) errors.push(`${command.file} missing description`);
  if (!frontmatter.data["argument-hint"]) errors.push(`${command.file} missing argument-hint`);
  if (frontmatter.data.package !== "spec-to-ship") errors.push(`${command.file} package must be spec-to-ship`);
  if (!content.includes("SPEC-TO-SHIP.md")) errors.push(`${command.file} must reference SPEC-TO-SHIP.md`);
  if (command.name === "sts") {
    if (!content.includes("full-lifecycle mode")) errors.push("sts.md must define /sts as full-lifecycle mode");
    if (!content.includes("Frontload requirements")) errors.push("sts.md must frontload blocking requirements/questions");
  } else {
    if (!content.includes("single-step mode")) errors.push(`${command.file} must define step commands as single-step mode`);
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}
console.log(`Validated ${expected.length} STS slash commands.`);
