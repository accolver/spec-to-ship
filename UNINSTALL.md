# Uninstalling Spec-to-Ship

Spec-to-Ship is designed to uninstall conservatively. It removes only files that can be proven to be STS-owned and preserves external dependencies by default.

## Recommended flow

Always dry-run first:

```bash
./scripts/uninstall.sh --mode local --target /path/to/project --harness all --dry-run
```

If the plan is correct, rerun with `--yes`:

```bash
./scripts/uninstall.sh --mode local --target /path/to/project --harness all --yes
```

## Scope options

```bash
./scripts/uninstall.sh --mode local --target .
./scripts/uninstall.sh --mode global --dry-run
./scripts/uninstall.sh --mode both --target . --dry-run
./scripts/uninstall.sh --harness agents --dry-run
```

For global tests or automation, override `HOME` to a disposable directory:

```bash
HOME=/tmp/sts-home ./scripts/uninstall.sh --mode global --harness agents --dry-run
```

## What gets removed

- The STS managed block in local `AGENTS.md`.
- STS-owned core skill directories or symlinks for the selected harnesses.

A skill path is removed only when ownership can be proven by either:

- a symlink target under this repo's `skills/core/<skill>` directory, or
- `SKILL.md` frontmatter/name plus `metadata.package: spec-to-ship` content.

## Backups and rollback

Before removing anything, uninstall writes a backup under:

- local: `<target>/.spec-to-ship/uninstall-backups/<timestamp>/`
- global: `~/.config/spec-to-ship/uninstall-backups/<timestamp>/`

By default, old adjacent installer backups (`*.bak-*`) are not restored automatically. To restore a single unambiguous adjacent backup after removing STS, use:

```bash
./scripts/uninstall.sh --mode local --target . --restore-backups auto --yes
```

## External dependencies

Impeccable is retained by default because it is an external skill and may be shared by other workflows. Remove it manually only if you are sure no other project uses it.
