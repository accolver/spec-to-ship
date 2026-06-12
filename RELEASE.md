# Release Process

Spec-to-Ship v0.x releases are GitHub tags and GitHub Releases. The npm package remains private; users install by cloning the repository or checking out a tag.

## Versioning

- Tags use SemVer with a leading `v`, for example `v0.1.0`.
- `package.json.version` must match the tag without `v`.
- Patch: docs, eval artifacts, installer bug fixes, compatible skill wording.
- Minor: new installer capability, new harness support, or meaningful workflow behavior.
- Major: breaking skill names, install paths, or artifact contracts.

## Pre-tag checklist

Run locally on a clean `main` checkout:

```bash
bun run validate
bun run build:dist
bun run build:dist:check
bun run smoke
bun run eval:check
bun run install:smoke
./scripts/install.sh --mode local --target /tmp/sts-release-install --harness all --dry-run --skip-external-deps
```

For installer changes, also run a disposable real install using `/tmp` targets and a temporary `HOME`; do not use your real home directory for release tests.

## Create a release

```bash
git tag v0.1.0
git push origin v0.1.0
```

The `release` GitHub Actions workflow validates the tagged commit, checks that the tag matches `package.json.version`, builds `dist`, runs smoke/eval/install checks, uploads a release archive, and creates a GitHub Release with generated notes.

## Pinning an install

```bash
git clone https://github.com/accolver/spec-to-ship ~/.spec-to-ship
cd ~/.spec-to-ship
git checkout v0.1.0
./scripts/install.sh
```
