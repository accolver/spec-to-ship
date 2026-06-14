#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
BUN_CMD=()
if command -v bun >/dev/null 2>&1; then
  BUN_CMD=(bun)
elif command -v npx >/dev/null 2>&1; then
  echo "Bun was not found; falling back to npx --yes bun." >&2
  BUN_CMD=(npx --yes bun)
elif command -v npm >/dev/null 2>&1; then
  echo "Bun was not found; falling back to npm exec --yes bun --." >&2
  BUN_CMD=(npm exec --yes bun --)
else
  echo "Spec-to-Ship uninstall requires Bun, or npm/npx so it can run Bun transiently." >&2
  echo "Install Bun from https://bun.sh/docs/installation or install Node/npm and rerun with npx." >&2
  exit 1
fi
"${BUN_CMD[@]}" run scripts/uninstall.ts "$@"
