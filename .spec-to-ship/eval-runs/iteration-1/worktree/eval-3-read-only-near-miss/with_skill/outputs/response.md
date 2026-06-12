# Read-only auth route investigation

Do not create a worktree for this request. The scope is explicitly read-only (`Investigate where auth routes live; no edits yet`), so branch/worktree setup would add coordination overhead without reducing writer risk.

Route this as research/context gathering instead of writer setup:

```bash
rg -n "auth|login|logout|session|callback|route" .
find . \( -iname '*auth*' -o -iname '*login*' -o -iname '*route*' \) -print
```

Then summarize:

- route file paths,
- framework/router convention observed,
- related middleware/session files,
- whether any follow-up edit is needed.

If the investigation turns into implementation, re-evaluate the scope then. Create a worktree only if there will be risky or parallel writing, and record ownership in `.spec-to-ship/features/<feature-id>/worktrees.md` before writers start.
