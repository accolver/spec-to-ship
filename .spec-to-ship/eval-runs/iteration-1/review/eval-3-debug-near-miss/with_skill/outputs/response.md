# Review Routing Decision

## Verdict

**Do not perform release/readiness review yet. Route this to `debug`.** CI is red, so the branch is not review-ready and no completion, merge, or release readiness claim is allowed.

## Blockers

1. **Unresolved CI failure requires debug investigation** (`block`)
   - **Evidence:** The eval prompt says: "CI is red on this branch; find why."
   - **Why this blocks:** STS routing rules send red CI, unexplained failing tests, and failure diagnosis to `debug`, not `review` or `release`. The review skill also requires evidence-backed findings and rejects claims that tests probably pass.
   - **Required fix:** Use the debug workflow: inspect the failing CI job, identify the first failing command/test, reproduce or isolate the failure, determine root cause, apply the fix, then rerun the relevant checks and CI.

## Should-fix

None until the debug root cause is known.

## Follow-up

After CI is green with fresh evidence, resume review for spec compliance, correctness, tests, security, maintainability, dependencies, and any UI/UX risk.

## Evidence

- Prompt evidence: CI is red and asks to find why.
- STS routing: red CI and unexplained failures route to `debug`.
- Verification rule: do not claim ready/complete without fresh passing evidence.
