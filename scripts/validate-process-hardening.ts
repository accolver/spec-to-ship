import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./lib";

const root = repoRoot();

type Expectation = {
  file: string;
  terms: string[];
};

const expectations: Expectation[] = [
  {
    file: "SPEC-TO-SHIP.md",
    terms: [
      "acceptance evidence matrix",
      "task-checkbox audit",
      "adversarial probe matrix",
      "dirty-worktree triage",
      "timed-out/unavailable required tools",
      "not run/unavailable",
      "hard-coded marker strings",
    ],
  },
  {
    file: "commands/sts.md",
    terms: [
      "adversarial pre-merge/spec-compliance review",
      "task-checkbox audit",
      "failed or unavailable required validation",
      "Do not mark upstream task checkboxes complete",
    ],
  },
  {
    file: "skills/core/review/SKILL.md",
    terms: [
      "acceptance evidence matrix",
      "adversarial probes",
      "task/checklist changes",
      "timed-out/unavailable reviewer",
      "hard-coded marker strings",
    ],
  },
  {
    file: "skills/core/release/SKILL.md",
    terms: [
      "unavailable required validation",
      "dirty unrelated worktree changes",
      "missing UI/UX evidence",
      "package/lockfile changes",
      "blocked validations",
    ],
  },
  {
    file: "skills/core/tdd/SKILL.md",
    terms: [
      "negative/boundary coverage",
      "happy-path assertions alone",
      "runtime/demo paths",
    ],
  },
  {
    file: "skills/core/ui-ux-gate/SKILL.md",
    terms: [
      "demos",
      "generated/runtime behavior",
      "hard-coded marker string",
    ],
  },
  {
    file: "skills/core/review/templates/review.md",
    terms: [
      "Acceptance evidence matrix",
      "Task/checklist audit",
      "Adversarial probe matrix",
      "Dirty-artifact triage",
      "Tool/subagent limitations",
    ],
  },
  {
    file: "skills/core/release/templates/release-checklist.md",
    terms: [
      "Required validation that failed or could not run",
      "Validation matrix",
      "Dirty-artifact triage",
      "degraded release",
    ],
  },
  {
    file: "skills/core/tdd/templates/test-report.md",
    terms: [
      "Acceptance/evidence mapping",
      "Negative and boundary evidence",
      "Happy-path-only coverage",
    ],
  },
];

const errors: string[] = [];
for (const expectation of expectations) {
  const file = path.join(root, expectation.file);
  if (!fs.existsSync(file)) {
    errors.push(`Missing process-hardening file: ${expectation.file}`);
    continue;
  }
  const content = fs.readFileSync(file, "utf8");
  for (const term of expectation.terms) {
    if (!content.includes(term)) errors.push(`${expectation.file} is missing required process-hardening term: ${term}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated process-hardening safeguards in ${expectations.length} files.`);
