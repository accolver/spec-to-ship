import fs from "node:fs";
import path from "node:path";
import { approvedSkills, isRecord, parseArgs, readJson } from "./lib";

type ConfigName = "with_skill" | "without_skill";
type Counts = { passed: number; failed: number; total: number; pass_rate: number };
type NormalizedRun = Counts & {
  skill: string;
  eval_id: number;
  eval_name: string;
  configuration: ConfigName;
  grading_path: string;
  response_path?: string;
};
type SkillAggregate = {
  skill: string;
  status: "pass" | "fail";
  without_skill: Counts;
  with_skill: Counts;
  delta: { pass_rate: number; percentage_points: number };
  evals: Array<{ eval_id: number; eval_name: string; without_skill: Counts; with_skill: Counts }>;
};

type Thresholds = {
  min_with_skill_pass_rate?: number;
  min_skill_with_skill_pass_rate?: number;
  min_delta?: number;
  min_skill_delta?: number;
};

const args = parseArgs(process.argv.slice(2));
if (args.help === true || args.h === true) {
  console.log(`Usage: bun run scripts/eval-skills.ts [options]\n\nOptions:\n  --input <dir>                       Eval iteration directory.\n  --output <file>                     JSON output path.\n  --markdown <file>                   Markdown output path.\n  --skills <csv>                      Limit to skills.\n  --check                             Check thresholds and do not write outputs.\n  --json-only                         Print JSON to stdout.\n  --min-with-skill-pass-rate <n>\n  --min-skill-with-skill-pass-rate <n>\n  --min-delta <n>\n  --min-skill-delta <n>\n  --no-require-all-skills             Do not fail when an approved skill has no artifacts.\n`);
  process.exit(0);
}

const inputDir = path.resolve(String(args.input ?? ".spec-to-ship/eval-runs/iteration-1"));
const outputPath = path.resolve(String(args.output ?? path.join(inputDir, "aggregate-benchmark.json")));
const markdownPath = path.resolve(String(args.markdown ?? path.join(inputDir, "aggregate-benchmark.md")));
const checkOnly = args.check === true;
const jsonOnly = args["json-only"] === true;
const requireAllSkills = args["no-require-all-skills"] !== true;
const selectedSkills = String(args.skills ?? approvedSkills.join(",")).split(",").map((skill) => skill.trim()).filter(Boolean);

function numericArg(name: string): number | undefined {
  const value = args[name];
  if (value === undefined || value === false || value === true) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    console.error(`Invalid --${name}; expected number between 0 and 1.`);
    process.exit(1);
  }
  return parsed;
}

const thresholds: Thresholds = {
  min_with_skill_pass_rate: numericArg("min-with-skill-pass-rate"),
  min_skill_with_skill_pass_rate: numericArg("min-skill-with-skill-pass-rate"),
  min_delta: numericArg("min-delta"),
  min_skill_delta: numericArg("min-skill-delta"),
};

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function countResults(value: unknown): { passed?: number; total?: number } {
  if (!Array.isArray(value)) return {};
  let passed = 0;
  let total = 0;
  for (const item of value) {
    if (!isRecord(item)) continue;
    total += 1;
    if (item.passed === true || item.status === "PASS" || item.status === "pass") passed += 1;
  }
  return total > 0 ? { passed, total } : {};
}

function normalizeGrading(skill: string, file: string): NormalizedRun {
  const raw = readJson(file);
  if (!isRecord(raw)) throw new Error(`Invalid grading JSON object: ${file}`);
  const summary = isRecord(raw.summary) ? raw.summary : {};
  const resultCounts = countResults(raw.results);
  const assertionCount = Array.isArray(raw.assertions) ? raw.assertions.length : undefined;
  const total = asNumber(raw.total_assertions) ?? asNumber(raw.total) ?? asNumber(summary.total) ?? assertionCount ?? resultCounts.total;
  const passed = asNumber(raw.passed_assertions) ?? asNumber(raw.passed) ?? asNumber(summary.passed) ?? resultCounts.passed;
  if (total === undefined || passed === undefined) {
    throw new Error(`Could not derive passed/total from ${file}`);
  }
  const failed = asNumber(raw.failed_assertions) ?? asNumber(raw.failed) ?? asNumber(summary.failed) ?? Math.max(0, total - passed);
  const passRate = asNumber(raw.pass_rate) ?? asNumber(summary.pass_rate) ?? (total === 0 ? 0 : passed / total);
  const configuration = raw.configuration;
  if (configuration !== "with_skill" && configuration !== "without_skill") {
    throw new Error(`Invalid configuration in ${file}`);
  }
  const responsePath = [raw.response_path, raw.output_path, raw.output_file, raw.response_file].find((item): item is string => typeof item === "string");
  return {
    skill,
    eval_id: asNumber(raw.eval_id) ?? 0,
    eval_name: typeof raw.eval_name === "string" ? raw.eval_name : path.basename(path.dirname(path.dirname(file))),
    configuration,
    passed,
    failed,
    total,
    pass_rate: passRate,
    grading_path: file,
    response_path: responsePath,
  };
}

function findGradingFiles(skill: string): string[] {
  const skillDir = path.join(inputDir, skill);
  if (!fs.existsSync(skillDir)) return [];
  const files: string[] = [];
  for (const evalEntry of fs.readdirSync(skillDir, { withFileTypes: true })) {
    if (!evalEntry.isDirectory() || !evalEntry.name.startsWith("eval-")) continue;
    for (const config of ["with_skill", "without_skill"] as const) {
      const grading = path.join(skillDir, evalEntry.name, config, "grading.json");
      if (fs.existsSync(grading)) files.push(grading);
    }
  }
  return files.sort();
}

function zeroCounts(): Counts {
  return { passed: 0, failed: 0, total: 0, pass_rate: 0 };
}

function addCounts(target: Counts, run: Counts): void {
  target.passed += run.passed;
  target.failed += run.failed;
  target.total += run.total;
  target.pass_rate = target.total === 0 ? 0 : target.passed / target.total;
}

function statusFor(withSkill: Counts, delta: number): "pass" | "fail" {
  if (thresholds.min_skill_with_skill_pass_rate !== undefined && withSkill.pass_rate < thresholds.min_skill_with_skill_pass_rate) return "fail";
  if (thresholds.min_skill_delta !== undefined && delta < thresholds.min_skill_delta) return "fail";
  return "pass";
}

const missingSkills: string[] = [];
const skillAggregates: SkillAggregate[] = [];
let gradingFiles = 0;
for (const skill of selectedSkills) {
  const files = findGradingFiles(skill);
  if (files.length === 0) {
    missingSkills.push(skill);
    continue;
  }
  gradingFiles += files.length;
  const runs = files.map((file) => normalizeGrading(skill, file));
  const byEval = new Map<string, { eval_id: number; eval_name: string; with_skill: Counts; without_skill: Counts }>();
  const withSkill = zeroCounts();
  const withoutSkill = zeroCounts();
  for (const run of runs) {
    const key = `${run.eval_id}:${run.eval_name}`;
    const entry = byEval.get(key) ?? { eval_id: run.eval_id, eval_name: run.eval_name, with_skill: zeroCounts(), without_skill: zeroCounts() };
    addCounts(entry[run.configuration], run);
    byEval.set(key, entry);
    addCounts(run.configuration === "with_skill" ? withSkill : withoutSkill, run);
  }
  const delta = withSkill.pass_rate - withoutSkill.pass_rate;
  skillAggregates.push({
    skill,
    status: statusFor(withSkill, delta),
    without_skill: withoutSkill,
    with_skill: withSkill,
    delta: { pass_rate: delta, percentage_points: delta * 100 },
    evals: [...byEval.values()].sort((a, b) => a.eval_id - b.eval_id),
  });
}

if (requireAllSkills && missingSkills.length > 0) {
  console.error(`Missing eval artifacts for required skill(s): ${missingSkills.join(", ")}`);
  process.exit(3);
}

const aggregateWithout = zeroCounts();
const aggregateWith = zeroCounts();
for (const skill of skillAggregates) {
  addCounts(aggregateWithout, skill.without_skill);
  addCounts(aggregateWith, skill.with_skill);
}
const aggregateDelta = aggregateWith.pass_rate - aggregateWithout.pass_rate;
let status: "pass" | "fail" = skillAggregates.some((skill) => skill.status === "fail") ? "fail" : "pass";
if (thresholds.min_with_skill_pass_rate !== undefined && aggregateWith.pass_rate < thresholds.min_with_skill_pass_rate) status = "fail";
if (thresholds.min_delta !== undefined && aggregateDelta < thresholds.min_delta) status = "fail";

const output = {
  schema_version: "sts-eval-aggregate@1",
  generated_at: new Date().toISOString(),
  source: {
    input_dir: inputDir,
    grading_files: gradingFiles,
    benchmark_files: fs.existsSync(inputDir) ? selectedSkills.filter((skill) => fs.existsSync(path.join(inputDir, skill, "benchmark.json"))).length : 0,
    source_eval_files: selectedSkills.filter((skill) => fs.existsSync(path.join("skills/core", skill, "evals/evals.json"))).length,
  },
  thresholds,
  status,
  aggregate: {
    without_skill: aggregateWithout,
    with_skill: aggregateWith,
    delta: { pass_rate: aggregateDelta, percentage_points: aggregateDelta * 100 },
  },
  skills: skillAggregates,
  caveats: [
    "v0.1 eval runner aggregates existing grading artifacts; it does not regenerate model responses.",
    "Timing files may be placeholders and are not used for pass/fail thresholds.",
  ],
};

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

const markdown = [
  "# Spec-to-Ship Eval Aggregate",
  "",
  `Status: **${status}**`,
  "",
  "| Skill | Baseline | With skill | Delta | Status |",
  "|---|---:|---:|---:|---|",
  ...skillAggregates.map((skill) => `| ${skill.skill} | ${skill.without_skill.passed}/${skill.without_skill.total} (${pct(skill.without_skill.pass_rate)}) | ${skill.with_skill.passed}/${skill.with_skill.total} (${pct(skill.with_skill.pass_rate)}) | ${skill.delta.percentage_points.toFixed(1)} pp | ${skill.status} |`),
  "",
  "## Aggregate",
  "",
  `- Baseline: ${aggregateWithout.passed}/${aggregateWithout.total} (${pct(aggregateWithout.pass_rate)})`,
  `- With skill: ${aggregateWith.passed}/${aggregateWith.total} (${pct(aggregateWith.pass_rate)})`,
  `- Delta: ${output.aggregate.delta.percentage_points.toFixed(1)} percentage points`,
  `- Grading files: ${gradingFiles}`,
  "",
  "## Caveats",
  "",
  ...output.caveats.map((caveat) => `- ${caveat}`),
  "",
].join("\n");

if (jsonOnly) {
  console.log(JSON.stringify(output, null, 2));
} else {
  console.log(markdown);
}

if (!checkOnly) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n");
  fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
  fs.writeFileSync(markdownPath, markdown);
}

if (status === "fail") process.exit(2);
