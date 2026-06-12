import path from "node:path";
import { approvedSkills, isRecord, readJson, repoRoot } from "./lib";

const triggerOwners = new Map<string, string[]>();
for (const skill of approvedSkills) {
  const contract = readJson(path.join(repoRoot(), "skills", "core", skill, "contract.json"));
  if (!isRecord(contract) || !Array.isArray(contract.triggers)) continue;
  for (const trigger of contract.triggers) {
    if (typeof trigger !== "string") continue;
    const key = trigger.toLowerCase();
    const owners = triggerOwners.get(key) ?? [];
    owners.push(skill);
    triggerOwners.set(key, owners);
  }
}
const overlaps = Array.from(triggerOwners.entries()).filter(([, owners]) => owners.length > 1);
if (overlaps.length > 0) {
  console.error(overlaps.map(([trigger, owners]) => `- trigger "${trigger}" owned by ${owners.join(", ")}`).join("\n"));
  process.exit(1);
}
console.log("No exact trigger overlap detected.");
