#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE=""
TARGET="$(pwd)"
HARNESS="all"
LINK_MODE="copy"
DRY_RUN="false"
SKIP_EXTERNAL="false"
YES="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode) MODE="$2"; shift 2 ;;
    --target) TARGET="$2"; shift 2 ;;
    --harness) HARNESS="$2"; shift 2 ;;
    --link) LINK_MODE="link"; shift ;;
    --copy) LINK_MODE="copy"; shift ;;
    --dry-run) DRY_RUN="true"; shift ;;
    --skip-external-deps) SKIP_EXTERNAL="true"; shift ;;
    --yes) YES="true"; shift ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$MODE" ]]; then
  echo "Install Spec-to-Ship where?"
  echo "1) local project only"
  echo "2) global user only"
  echo "3) both local and global"
  echo "4) dry-run"
  read -r -p "Choose [1-4]: " choice
  case "$choice" in
    1) MODE="local" ;;
    2) MODE="global" ;;
    3) MODE="both" ;;
    4) MODE="local"; DRY_RUN="true" ;;
    *) echo "Invalid choice" >&2; exit 1 ;;
  esac
fi

cd "$ROOT"
bun run validate
bun run build:dist

copy_or_link() {
  local src="$1"
  local dest="$2"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would install $src -> $dest ($LINK_MODE)"
    return
  fi
  mkdir -p "$(dirname "$dest")"
  if [[ -L "$dest" ]]; then
    local current_target
    current_target="$(readlink "$dest")"
    if [[ "$LINK_MODE" == "link" && "$current_target" == "$src" ]]; then
      echo "Already linked $dest"
      return
    fi
  fi
  if [[ -e "$dest" || -L "$dest" ]]; then
    local backup="$dest.bak-$(date +%s)"
    mv "$dest" "$backup"
    echo "Backed up existing $dest to $backup"
  fi
  if [[ "$LINK_MODE" == "link" ]]; then
    ln -s "$src" "$dest"
  else
    cp -R "$src" "$dest"
  fi
}

install_scope() {
  local scope="$1"
  local base="$2"
  local entries=()
  if [[ "$scope" == "local" ]]; then
    entries=(
      "agents|$base/.agents/skills"
      "pi|$base/.pi/skills"
      "codex|$base/.codex/skills"
      "claude|$base/.claude/skills"
      "cursor|$base/.cursor/skills"
      "opencode|$base/.opencode/skills"
      "gemini|$base/.gemini/skills"
      "copilot|$base/.github/skills"
    )
  else
    entries=(
      "agents|$HOME/.agents/skills"
      "pi|$HOME/.pi/agent/skills"
      "codex|$HOME/.codex/skills"
      "claude|$HOME/.claude/skills"
      "cursor|$HOME/.cursor/skills"
      "opencode|$HOME/.config/opencode/skills"
      "gemini|$HOME/.gemini/skills"
      "copilot|$HOME/.copilot/skills"
    )
  fi
  for entry in "${entries[@]}"; do
    local key="${entry%%|*}"
    local dir="${entry#*|}"
    if [[ "$HARNESS" != "all" && "$HARNESS" != "$key" ]]; then
      continue
    fi
    for skill in spec coding-agent worktree tdd debug review deps release finish ui-ux-gate; do
      copy_or_link "$ROOT/skills/core/$skill" "$dir/$skill"
    done
  done
}

if [[ "$MODE" == "local" || "$MODE" == "both" ]]; then
  install_scope local "$TARGET"
  integrate_args=("--target" "$TARGET" "--sts-root" "$ROOT")
  if [[ "$DRY_RUN" == "true" ]]; then integrate_args+=("--dry-run"); fi
  bun run scripts/integrate-agents-md.ts "${integrate_args[@]}"
fi
if [[ "$MODE" == "global" || "$MODE" == "both" ]]; then
  install_scope global "$HOME"
fi
if [[ "$SKIP_EXTERNAL" != "true" ]]; then
  external_args=("--mode" "$MODE" "--target" "$TARGET")
  if [[ "$DRY_RUN" == "true" ]]; then external_args+=("--dry-run"); fi
  if [[ "$YES" == "true" ]]; then external_args+=("--yes"); fi
  bun run scripts/install-external-deps.ts "${external_args[@]}"
fi

echo "Spec-to-Ship install complete."
echo "If Impeccable was installed, run /impeccable init inside your AI coding tool."
