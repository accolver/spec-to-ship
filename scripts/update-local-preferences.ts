import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "./lib";

const args = parseArgs(process.argv.slice(2));
const target = path.resolve(String(args.target ?? process.cwd()));
const preference = String(args.preference ?? "").trim();
const file = path.join(target, ".spec-to-ship", "local-preferences.md");
if (!preference) {
  console.error("Usage: bun run scripts/update-local-preferences.ts --preference \"Pull requests: use gh\"");
  process.exit(1);
}
fs.mkdirSync(path.dirname(file), { recursive: true });
if (!fs.existsSync(file)) fs.writeFileSync(file, "# Local STS Preferences\n\n");
fs.appendFileSync(file, `- ${preference}\n`);
console.log(`Updated ${file}`);
