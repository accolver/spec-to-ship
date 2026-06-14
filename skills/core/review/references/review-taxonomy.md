# Review Taxonomy

Findings need evidence: file/line, command output, CI check, artifact reference, or spec section.

## Block

Prevents merge. Examples: unmet acceptance criteria, missing or failing tests for changed behavior, missing negative/boundary coverage for risky behavior, security/auth/data-loss risk, unresolved dependency/license risk, unchecked upstream tasks without evidence, required validation that failed or could not run, dirty unrelated artifacts, timed-out required reviewer/tool evidence, missing migration/rollback plan, or missing Impeccable evidence for UI work.

## Should-fix

Should be fixed before merge unless explicitly deferred. Examples: confusing structure, duplicated logic, weak error handling, avoidable performance issue, incomplete docs for changed behavior.

## Follow-up

Non-blocking improvement that can be tracked later. Examples: polish, broader refactor, extra observability, additional docs not required for this change.
