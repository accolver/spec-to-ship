# Auth route investigation

For a read-only investigation, I would first inspect the repository rather than creating a new branch for edits. I would search for likely route files and auth-related names:

```bash
rg -n "auth|login|logout|session|route" .
find . -iname '*auth*' -o -iname '*login*'
```

Then I would summarize where the auth routes live and note any framework-specific routing conventions I find. If the investigation turns into a code change, I would create a branch or worktree at that point.
