import fs from "node:fs";
import path from "node:path";
import { approvedSkills, parseFrontmatter, repoRoot, walkFiles } from "./lib";

const root = repoRoot();
const skillsRoot = path.join(root, "skills", "core");
const approved = new Set<string>(approvedSkills);
const errors: string[] = [];

for (const entry of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  if (!approved.has(entry.name)) errors.push(`Unexpected core skill directory: ${entry.name}`);
}

for (const skill of approvedSkills) {
  const dir = path.join(skillsRoot, skill);
  const file = path.join(dir, "SKILL.md");
  if (!fs.existsSync(file)) {
    errors.push(`Missing ${path.relative(root, file)}`);
    continue;
  }
  const content = fs.readFileSync(file, "utf8");
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    errors.push(`${skill}: missing YAML frontmatter`);
    continue;
  }
  const name = parsed.data.name;
  const description = parsed.data.description;
  if (name !== skill) errors.push(`${skill}: frontmatter name must match directory`);
  if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) errors.push(`${skill}: invalid name`);
  if (!description) errors.push(`${skill}: missing description`);
  if (description && description.length > 1024) errors.push(`${skill}: description exceeds 1024 chars`);
  if (description && !description.includes("Use when")) errors.push(`${skill}: description must include "Use when"`);
  const frontmatterBlock = content.slice(0, content.indexOf("\n---", 4));
  if (/description:\s*$/.test(frontmatterBlock)) errors.push(`${skill}: multiline description is not allowed`);

  const linkPattern = /\[[^\]]+\]\((?!https?:)([^)#]+)(?:#[^)]+)?\)/g;
  for (const match of parsed.body.matchAll(linkPattern)) {
    const relativeTarget = match[1];
    if (relativeTarget.startsWith("mailto:")) continue;
    const target = path.resolve(dir, relativeTarget);
    if (!target.startsWith(dir)) errors.push(`${skill}: link escapes skill directory: ${relativeTarget}`);
    if (!fs.existsSync(target)) errors.push(`${skill}: broken link ${relativeTarget}`);
    const relParts = path.relative(dir, target).split(path.sep);
    if (relParts.length > 2) errors.push(`${skill}: deep reference chain target ${relativeTarget}`);
  }
}

const forbidden = ["gh-cli", "gcloud", "gcloud-cli", "browser-automation", "playwright", "impeccable"];
const skillDirs = walkFiles(skillsRoot, (file) => path.basename(file) === "SKILL.md");
for (const file of skillDirs) {
  const rel = path.relative(skillsRoot, path.dirname(file));
  if (forbidden.includes(path.basename(rel)) && path.basename(rel) !== "ui-ux-gate") {
    errors.push(`Forbidden non-core or vendored skill: ${rel}`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}
console.log(`Validated ${approvedSkills.length} STS skills.`);
