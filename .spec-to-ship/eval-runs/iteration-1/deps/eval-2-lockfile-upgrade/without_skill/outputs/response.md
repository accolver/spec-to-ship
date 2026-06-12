# Response

I would upgrade the affected image library and refresh the lockfile.

Plan:
1. Identify which package pulls in the vulnerable transitive image library.
2. Update the direct dependency that controls that transitive version, or use the package manager's override/resolution feature if there is no upstream release yet.
3. Regenerate the lockfile with the repository's package manager.
4. Run tests that cover image processing plus the normal install/test checks.
5. Open a PR describing the CVE and the before/after package versions.
