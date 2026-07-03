import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const COMMAND_NAME = "sts-workflow";

const STS_WORKFLOW_SCRIPT = String.raw`export const meta = { name: 'spec_to_ship', description: 'Guided Spec-to-Ship lifecycle wrapper with upfront requirements and proof-of-success capture.', phases: [{ title: 'Intake' }, { title: 'Context' }, { title: 'Planning' }, { title: 'Execution' }, { title: 'Verification' }, { title: 'Synthesis' }] }

const input = args && typeof args === 'object' ? args : {};
const intakePacket = typeof input.intakePacket === 'string' ? input.intakePacket : '';
const launchCwd = typeof input.launchCwd === 'string' ? input.launchCwd : cwd;

phase('Intake')
const intake = await agent('You are the Spec-to-Ship intake gate. Read SPEC-TO-SHIP.md in the repo if present. Analyze this upfront intake packet and decide whether the run can continue unattended. Require clear requirements, constraints, non-goals, proof-of-success, and approval mode before implementation. If anything material is missing, return clarifying questions immediately and do not invent answers. Intake packet:\n\n' + intakePacket, {
  label: 'intake gate',
  tier: 'medium',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      canProceed: { type: 'boolean' },
      status: { type: 'string', enum: ['ready', 'needs_clarification', 'approval_required'] },
      summary: { type: 'string' },
      featureSlug: { type: 'string' },
      requirements: { type: 'array', items: { type: 'string' } },
      constraints: { type: 'array', items: { type: 'string' } },
      nonGoals: { type: 'array', items: { type: 'string' } },
      proofOfSuccess: { type: 'array', items: { type: 'string' } },
      verificationCommands: { type: 'array', items: { type: 'string' } },
      risks: { type: 'array', items: { type: 'string' } },
      uiUxInvolved: { type: 'boolean' },
      dependenciesLikely: { type: 'boolean' },
      destructiveLikely: { type: 'boolean' },
      parallelismLikely: { type: 'boolean' },
      executionMode: { type: 'string', enum: ['stop-after-spec', 'plan-only', 'approved-to-implement'] },
      clarifyingQuestions: { type: 'array', items: { type: 'string' } }
    },
    required: ['canProceed', 'status', 'summary', 'featureSlug', 'requirements', 'constraints', 'nonGoals', 'proofOfSuccess', 'verificationCommands', 'risks', 'uiUxInvolved', 'dependenciesLikely', 'destructiveLikely', 'parallelismLikely', 'executionMode', 'clarifyingQuestions']
  }
})

if (!intake || !intake.canProceed || intake.status !== 'ready') {
  return { ok: false, status: intake ? intake.status : 'needs_clarification', message: 'Spec-to-Ship stopped at intake so missing requirements can be answered before unattended work begins.', clarifyingQuestions: intake ? intake.clarifyingQuestions : ['Restate the goal, constraints, proof-of-success, and whether implementation is approved.'], intake }
}

phase('Context')
const contextResults = await parallel([
  () => agent('Inspect the repository at ' + launchCwd + ' read-only. Read AGENTS.md and SPEC-TO-SHIP.md first. Identify current STS artifacts, package/build/test conventions, and likely files relevant to this request. Do not modify files.', { label: 'repo context', tier: 'small' }),
  () => agent('Analyze the request against Spec-to-Ship routing. Determine which STS skills/gates apply: spec, ui-ux-gate, coding-agent, worktree, tdd, debug, review, deps, release, finish. Focus on approval boundaries and artifact namespace rules. Do not modify files. Intake: ' + JSON.stringify(intake), { label: 'sts routing', tier: 'medium' }),
  () => agent('Convert proof-of-success into a concrete verification strategy. Prefer commands, observable artifacts, tests, and review evidence. Identify which checks can run before claiming completion. Do not modify files. Intake: ' + JSON.stringify(intake), { label: 'proof plan', tier: 'medium' })
])

phase('Planning')
const plan = await agent('Create the STS feature plan. Use the context below and the intake. Ensure artifacts stay under .spec-to-ship/features/<feature-id> and never root SPEC.md/tasks.md. If implementation is not already approved or is risky/destructive, set requiresHumanApproval true and stop before coding. Include suggested featureId, artifact plan, ownership, implementation slices, and verification checks.\n\nIntake:\n' + JSON.stringify(intake, null, 2) + '\n\nContext:\n' + JSON.stringify(contextResults, null, 2), {
  label: 'sts plan',
  tier: 'big',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      featureId: { type: 'string' },
      requiresHumanApproval: { type: 'boolean' },
      approvalReason: { type: 'string' },
      artifactPaths: { type: 'array', items: { type: 'string' } },
      implementationSlices: { type: 'array', items: { type: 'string' } },
      ownershipNotes: { type: 'array', items: { type: 'string' } },
      verificationChecks: { type: 'array', items: { type: 'string' } },
      stopAfterPlanning: { type: 'boolean' }
    },
    required: ['featureId', 'requiresHumanApproval', 'approvalReason', 'artifactPaths', 'implementationSlices', 'ownershipNotes', 'verificationChecks', 'stopAfterPlanning']
  }
})

if (!plan) {
  return { ok: false, status: 'planning_failed', message: 'The workflow could not produce a valid STS plan.', intake, contextResults }
}

if (intake.executionMode === 'stop-after-spec' || intake.executionMode === 'plan-only' || plan.requiresHumanApproval || plan.stopAfterPlanning) {
  return { ok: true, status: plan.requiresHumanApproval ? 'approval_required' : 'planned', message: 'Spec-to-Ship stopped before implementation. Review the plan, answer questions, and rerun with execution mode approved-to-implement when ready.', intake, plan, contextResults }
}

phase('Execution')
const execution = await agent('Implement the approved Spec-to-Ship plan. First create/update feature artifacts under the planned .spec-to-ship/features/<feature-id>/ namespace. Follow STS lifecycle, TDD where behavior is testable, and do not perform destructive cleanup without explicit approval in the intake packet. If the plan is unsafe or ownership overlaps, stop and report the blocker instead of mutating files. Plan:\n' + JSON.stringify(plan, null, 2) + '\n\nIntake:\n' + JSON.stringify(intake, null, 2), { label: 'implementation coordinator', tier: 'big' })

phase('Verification')
const verificationItems = (intake.proofOfSuccess && intake.proofOfSuccess.length > 0 ? intake.proofOfSuccess : plan.verificationChecks).slice(0, 8)
const verification = await pipeline(
  verificationItems,
  (item, original, index) => agent('Verify this proof-of-success item for the STS run. Use fresh evidence only. If a command should be run, run or inspect the most relevant command/output; if you cannot run it, state why. Item #' + (index + 1) + ': ' + item + '\n\nImplementation result:\n' + JSON.stringify(execution), { label: 'verify ' + (index + 1), tier: 'medium' }),
  (evidence, original, index) => agent('Assess whether the verification evidence satisfies the original proof item. Return concise pass/fail/unknown with reason. Proof item #' + (index + 1) + ': ' + original + '\n\nEvidence:\n' + JSON.stringify(evidence), { label: 'evidence ' + (index + 1), tier: 'medium' })
)

const review = await parallel([
  () => agent('Review the final state for STS compliance: artifact namespace, approval boundary, TDD/debug evidence, dependency gate, release gate, and cleanup obligations. Use fresh repo inspection where useful.', { label: 'sts compliance', tier: 'medium' }),
  () => agent('Act as a skeptical reviewer. Look for gaps between requested requirements, proof-of-success, and implemented result. Do not fix; report blockers and risks.', { label: 'skeptic review', tier: 'medium' })
])

phase('Synthesis')
const final = await agent('Synthesize the Spec-to-Ship workflow outcome for the user. Do not claim success unless verification evidence supports it. Include featureId, artifacts, changes made, verification evidence, unresolved questions, and next steps.\n\nIntake:\n' + JSON.stringify(intake, null, 2) + '\n\nPlan:\n' + JSON.stringify(plan, null, 2) + '\n\nExecution:\n' + JSON.stringify(execution) + '\n\nVerification:\n' + JSON.stringify(verification) + '\n\nReview:\n' + JSON.stringify(review), {
  label: 'final report',
  tier: 'big',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      ok: { type: 'boolean' },
      status: { type: 'string' },
      report: { type: 'string' },
      featureId: { type: 'string' },
      artifacts: { type: 'array', items: { type: 'string' } },
      verificationSummary: { type: 'array', items: { type: 'string' } },
      blockers: { type: 'array', items: { type: 'string' } },
      nextSteps: { type: 'array', items: { type: 'string' } }
    },
    required: ['ok', 'status', 'report', 'featureId', 'artifacts', 'verificationSummary', 'blockers', 'nextSteps']
  }
})

return final || { ok: false, status: 'synthesis_failed', report: 'Workflow finished but final synthesis failed.', intake, plan, execution, verification, review }`;

function workflowToolActive(pi: ExtensionAPI): boolean {
  try {
    return pi.getActiveTools().includes("workflow");
  } catch {
    return false;
  }
}

function intakeTemplate(args: string): string {
  const goal = args.trim() || "Describe the feature, fix, or outcome you want STS to ship.";
  return [
    "# Spec-to-Ship Workflow Intake",
    "",
    "Fill this in once so the workflow can run unattended until it hits an approval, safety, or missing-information gate.",
    "",
    "## Goal / requested outcome",
    goal,
    "",
    "## Must-have requirements",
    "- ",
    "",
    "## Constraints / preferences",
    "- Keep SPEC-TO-SHIP.md canonical and preserve existing STS delivery unless this request explicitly says otherwise.",
    "- ",
    "",
    "## Non-goals",
    "- ",
    "",
    "## Proof of success",
    "Describe what evidence should prove the work is done. Include tests, commands, artifacts, user-visible behavior, or review criteria.",
    "- ",
    "",
    "## Verification commands, if known",
    "- ",
    "",
    "## Approval mode",
    "Choose one and delete the others:",
    "- stop-after-spec",
    "- plan-only",
    "- approved-to-implement",
    "",
    "## Known risks / destructive boundaries",
    "- Ask before deleting branches, worktrees, data, credentials, deployments, or production resources.",
    "- "
  ].join("\n");
}

function kickoffPrompt(intakePacket: string, cwd: string): string {
  const argsObject = {
    intakePacket,
    launchCwd: cwd,
    source: "spec-to-ship-pi-workflow/sts-workflow"
  };

  return [
    "Launch the Spec-to-Ship dynamic workflow wrapper now.",
    "",
    "You MUST call the `workflow` tool as the next action. Do not answer in prose first.",
    "Use `background: true`, `concurrency: 4`, and `agentRetries: 1`.",
    "",
    "Workflow args JSON:",
    "```json",
    JSON.stringify(argsObject, null, 2),
    "```",
    "",
    "Workflow script:",
    "```javascript",
    STS_WORKFLOW_SCRIPT,
    "```"
  ].join("\n");
}

export default function extension(pi: ExtensionAPI) {
  pi.registerCommand(COMMAND_NAME, {
    description: "Run the optional Spec-to-Ship dynamic workflow wrapper",
    handler: async (args, ctx) => {
      if (!ctx.isIdle()) {
        ctx.ui.notify("Wait for the current agent turn to finish before starting /sts-workflow.", "warning");
        return;
      }

      if (!workflowToolActive(pi)) {
        ctx.ui.notify("The `workflow` tool is not active. Install @quintinshaw/pi-dynamic-workflows, run /reload, then retry /sts-workflow.", "warning");
        return;
      }

      const intake = await ctx.ui.editor("Spec-to-Ship workflow intake", intakeTemplate(args));
      if (!intake || !intake.trim()) {
        ctx.ui.notify("/sts-workflow cancelled; no intake packet was provided.", "info");
        return;
      }

      pi.sendUserMessage(kickoffPrompt(intake, ctx.cwd));
    }
  });
}
