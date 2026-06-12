import fs from "node:fs";
import path from "node:path";

export const approvedSkills = ["spec", "coding-agent", "worktree", "tdd", "debug", "review", "deps", "release", "finish", "ui-ux-gate"] as const;
export type ApprovedSkill = (typeof approvedSkills)[number];

export const approvedHarnesses = ["agents", "pi", "codex", "claude", "cursor", "opencode", "gemini", "copilot"] as const;
export type ApprovedHarness = (typeof approvedHarnesses)[number];
export type HarnessSelection = ApprovedHarness | "all";

export function isApprovedHarness(value: string): value is ApprovedHarness {
  return approvedHarnesses.includes(value as ApprovedHarness);
}

export function assertHarnessSelection(value: string): asserts value is HarnessSelection {
  if (value !== "all" && !isApprovedHarness(value)) {
    throw new Error(`Invalid harness '${value}'. Expected one of: all, ${approvedHarnesses.join(", ")}`);
  }
}

export function assertInstallMode(value: string): asserts value is "local" | "global" | "both" {
  if (!["local", "global", "both"].includes(value)) {
    throw new Error("Invalid mode '" + value + "'. Expected one of: local, global, both");
  }
}

export type CommandLayoutKind = "markdown-namespaced" | "markdown-flat" | "gemini-toml" | "copilot-prompt";

export const commandLayouts: Record<ApprovedHarness, { local?: string; global?: string; kind: CommandLayoutKind }> = {
  agents: { local: ".agents/commands", global: "~/.agents/commands", kind: "markdown-flat" },
  pi: { local: ".pi/prompts", global: "~/.pi/agent/prompts", kind: "markdown-flat" },
  codex: { global: "~/.codex/prompts", kind: "markdown-flat" },
  claude: { local: ".claude/commands", global: "~/.claude/commands", kind: "markdown-namespaced" },
  cursor: { local: ".cursor/commands", global: "~/.cursor/commands", kind: "markdown-namespaced" },
  opencode: { local: ".opencode/commands", global: "~/.config/opencode/commands", kind: "markdown-flat" },
  gemini: { local: ".gemini/commands", global: "~/.gemini/commands", kind: "gemini-toml" },
  copilot: { local: ".github/prompts", global: "~/.copilot/prompts", kind: "copilot-prompt" },
};

export function repoRoot(): string {
  return path.resolve(import.meta.dir, "..");
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseArgs(args: string[]): Record<string, string | boolean> {
  const parsed: Record<string, string | boolean> = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = args[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
}

export function parseFrontmatter(content: string): { data: Record<string, string>; body: string } | null {
  if (!content.startsWith("---\n")) return null;
  const end = content.indexOf("\n---", 4);
  if (end === -1) return null;
  const raw = content.slice(4, end).split("\n");
  const data: Record<string, string> = {};
  for (const line of raw) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) data[match[1]] = match[2].trim().replace(/^['\"]|['\"]$/g, "");
  }
  return { data, body: content.slice(end + 5) };
}

export function walkFiles(dir: string, predicate: (file: string) => boolean, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, predicate, acc);
    else if (predicate(full)) acc.push(full);
  }
  return acc.sort();
}

export function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
}

export function ensureInside(parent: string, child: string): void {
  const rel = path.relative(path.resolve(parent), path.resolve(child));
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Path escapes root: ${child}`);
  }
}
