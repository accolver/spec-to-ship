import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import {
  createWorkflowStorage,
  installResultDelivery,
  loadWorkflowSettings,
  WorkflowManager,
} from "@quintinshaw/pi-dynamic-workflows";

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
  const questions = intake ? intake.clarifyingQuestions : ['Restate the goal, constraints, proof-of-success, and whether implementation is approved.']
  return {
    ok: false,
    status: intake ? intake.status : 'needs_clarification',
    message: 'Spec-to-Ship stopped at intake so missing requirements can be answered before unattended work begins.',
    report: 'Spec-to-Ship needs clarification before unattended work can begin.\n\nPlease rerun /sts-workflow and answer these in the intake packet:\n' + questions.map((question, index) => (index + 1) + '. ' + question).join('\n'),
    clarifyingQuestions: questions,
    intake
  }
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

const INTAKE_ASSESSMENT_SCRIPT = String.raw`export const meta = { name: 'sts_intake_assessment', description: 'Assess STS conversational intake and choose the next best question.', phases: [{ title: 'Assess' }] }

const input = args && typeof args === 'object' ? args : {};
const transcript = typeof input.transcript === 'string' ? input.transcript : '';

phase('Assess')
const assessment = await agent('You are the conversational intake brain for Spec-to-Ship. Read this Q/A transcript and decide if there is enough information to start the STS workflow unattended until the next approval/safety gate. Be practical: do not demand exhaustive requirements if the goal is clear enough to spec/plan safely. If more is needed, ask exactly ONE natural next question, the highest leverage question a human would ask next. Prefer questions like "What should be different when this is done?", "How will we know it worked?", or "How far should I take this?". Ask about dependencies, external credits, benchmarks, protected areas, or release targets only when the task specifically makes those material. Ready requires a useful goal, enough proof-of-success or an obvious way to derive it, and an approval mode.\n\nTranscript:\n' + transcript, {
  label: 'intake assess',
  tier: 'medium',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      ready: { type: 'boolean' },
      summary: { type: 'string' },
      goal: { type: 'string' },
      proofOfSuccess: { type: 'string' },
      constraints: { type: 'string' },
      approvalMode: { type: 'string', enum: ['stop-after-spec', 'plan-only', 'approved-to-implement', 'unknown'] },
      nextQuestion: { type: 'string' },
      nextQuestionKind: { type: 'string', enum: ['text', 'approval', 'none'] },
      rationale: { type: 'string' }
    },
    required: ['ready', 'summary', 'goal', 'proofOfSuccess', 'constraints', 'approvalMode', 'nextQuestion', 'nextQuestionKind', 'rationale']
  }
})

return assessment`;

type ApprovalMode = "stop-after-spec" | "plan-only" | "approved-to-implement";
type NextQuestionKind = "text" | "approval" | "none";

type IntakeAssessment = {
  ready: boolean;
  summary: string;
  goal: string;
  proofOfSuccess: string;
  constraints: string;
  approvalMode: ApprovalMode | "unknown";
  nextQuestion: string;
  nextQuestionKind: NextQuestionKind;
  rationale: string;
};

function hasUsefulText(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function modeFromChoice(choice: string | undefined): ApprovalMode | null {
  if (choice === "Ask before coding") return "stop-after-spec";
  if (choice === "Plan only") return "plan-only";
  if (choice === "Approved to implement") return "approved-to-implement";
  return null;
}

function isIntakeAssessment(value: unknown): value is IntakeAssessment {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.ready === "boolean" &&
    typeof record.summary === "string" &&
    typeof record.goal === "string" &&
    typeof record.proofOfSuccess === "string" &&
    typeof record.constraints === "string" &&
    typeof record.nextQuestion === "string" &&
    typeof record.rationale === "string" &&
    ["stop-after-spec", "plan-only", "approved-to-implement", "unknown"].includes(String(record.approvalMode)) &&
    ["text", "approval", "none"].includes(String(record.nextQuestionKind))
  );
}

function fallbackAssessment(): IntakeAssessment {
  return {
    ready: false,
    summary: "Need more information before starting STS.",
    goal: "",
    proofOfSuccess: "",
    constraints: "",
    approvalMode: "unknown",
    nextQuestion: "How will we know this worked?",
    nextQuestionKind: "text",
    rationale: "The intake assessor did not return a usable result."
  };
}

async function assessIntake(manager: WorkflowManager, transcript: string): Promise<IntakeAssessment> {
  const result = await manager.runSync(INTAKE_ASSESSMENT_SCRIPT, { transcript }, {
    concurrency: 1,
    agentRetries: 1,
    maxAgents: 1,
  });
  return isIntakeAssessment(result.result) ? result.result : fallbackAssessment();
}

function buildIntakePacket(transcript: string, assessment: IntakeAssessment): string {
  const approvalMode = assessment.approvalMode === "unknown" ? "stop-after-spec" : assessment.approvalMode;
  const proof = assessment.proofOfSuccess.trim() || "Infer conservative proof-of-success from the requested outcome and repository validation conventions.";
  const constraints = assessment.constraints.trim() || "No extra user constraints supplied beyond SPEC-TO-SHIP.md safety rules. Ask before destructive or irreversible operations.";
  return [
    "# Spec-to-Ship Conversational Intake",
    "",
    "The user answered one natural question at a time before this workflow started.",
    "",
    "## Intake summary",
    assessment.summary.trim(),
    "",
    "## Goal / requested outcome",
    assessment.goal.trim(),
    "",
    "## Proof of success",
    proof,
    "",
    "## Constraints, boundaries, and non-goals",
    constraints,
    "",
    "## Approval mode",
    approvalMode,
    "",
    "## Standing safety boundary",
    "Ask before deleting branches, worktrees, data, credentials, deployments, or production resources.",
    "",
    "## Full conversational transcript",
    transcript.trim()
  ].join("\n");
}

function workflowArgs(intakePacket: string, cwd: string): Record<string, unknown> {
  return {
    intakePacket,
    launchCwd: cwd,
    source: "spec-to-ship-pi-workflow/sts-workflow"
  };
}

export default function extension(pi: ExtensionAPI) {
  const cwd = process.cwd();
  const storage = createWorkflowStorage(cwd);
  const settings = loadWorkflowSettings({ cwd });
  const manager = new WorkflowManager({
    cwd,
    loadSavedWorkflow: (name) => storage.load(name)?.script,
    defaultAgentTimeoutMs: settings.defaultAgentTimeoutMs ?? null,
    concurrency: settings.defaultConcurrency,
    defaultAgentRetries: settings.defaultAgentRetries,
  });

  pi.on("session_start", (_event: unknown, ctx: ExtensionContext) => {
    manager.setMainModel(ctx.model ? `${ctx.model.provider}/${ctx.model.id}` : undefined);
    manager.setModelRegistry(ctx.modelRegistry);
    try {
      manager.setSessionId(ctx.sessionManager?.getSessionId());
    } catch {
      manager.setSessionId(undefined);
    }
    installResultDelivery(pi, manager);
  });

  pi.registerCommand(COMMAND_NAME, {
    description: "Run the optional Spec-to-Ship dynamic workflow wrapper",
    handler: async (args, ctx) => {
      if (!ctx.isIdle()) {
        ctx.ui.notify("Wait for the current agent turn to finish before starting /sts-workflow.", "warning");
        return;
      }

      const transcript: string[] = [];
      const initialGoal = await ctx.ui.editor("What are you trying to do?", args.trim());
      if (!hasUsefulText(initialGoal)) {
        ctx.ui.notify("/sts-workflow cancelled; no goal was provided.", "info");
        return;
      }
      transcript.push(`Q: What are you trying to do?\nA: ${initialGoal.trim()}`);

      let assessment: IntakeAssessment = fallbackAssessment();
      for (let turn = 0; turn < 6; turn += 1) {
        ctx.ui.setStatus("sts-workflow:intake", "Assessing STS intake…");
        try {
          assessment = await assessIntake(manager, transcript.join("\n\n"));
        } finally {
          ctx.ui.setStatus("sts-workflow:intake", undefined);
        }

        if (assessment.ready) break;

        const question = assessment.nextQuestion.trim() || "What else should STS know before it starts?";
        if (assessment.nextQuestionKind === "approval") {
          const choice = await ctx.ui.select(question, ["Ask before coding", "Plan only", "Approved to implement"]);
          const mode = modeFromChoice(choice);
          if (!mode) {
            ctx.ui.notify("/sts-workflow cancelled; no approval mode was selected.", "info");
            return;
          }
          transcript.push(`Q: ${question}\nA: ${choice} (${mode})`);
        } else {
          const answer = await ctx.ui.editor(question, "");
          if (!hasUsefulText(answer)) {
            ctx.ui.notify("/sts-workflow cancelled; no answer was provided.", "info");
            return;
          }
          transcript.push(`Q: ${question}\nA: ${answer.trim()}`);
        }
      }

      if (!assessment.ready) {
        ctx.ui.notify(`STS still needs one more detail: ${assessment.nextQuestion || "please clarify the goal or proof of success."}`, "warning");
        return;
      }

      const intake = buildIntakePacket(transcript.join("\n\n"), assessment);
      const { runId, promise } = manager.startInBackground(STS_WORKFLOW_SCRIPT, workflowArgs(intake, ctx.cwd), {
        concurrency: 4,
        agentRetries: 1,
      });

      ctx.ui.notify(`Started /sts-workflow (${runId}). The result will return to this conversation when it finishes.`, "info");
      ctx.ui.setStatus(`sts-workflow:${runId}`, `STS workflow running (${runId})`);
      void promise
        .finally(() => {
          ctx.ui.setStatus(`sts-workflow:${runId}`, undefined);
        })
        .catch(() => {
          // installResultDelivery reports background workflow failures.
        });
    }
  });
}
