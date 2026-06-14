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
HOME_OVERRIDE=""
BUN_CMD=()

resolve_bun_cmd() {
  if command -v bun >/dev/null 2>&1; then
    BUN_CMD=(bun)
    return
  fi
  if command -v npx >/dev/null 2>&1; then
    echo "Bun was not found; falling back to npx --yes bun." >&2
    BUN_CMD=(npx --yes bun)
    return
  fi
  if command -v npm >/dev/null 2>&1; then
    echo "Bun was not found; falling back to npm exec --yes bun --." >&2
    BUN_CMD=(npm exec --yes bun --)
    return
  fi
  echo "Spec-to-Ship install requires Bun, or npm/npx so it can run Bun transiently." >&2
  echo "Install Bun from https://bun.sh/docs/installation or install Node/npm and rerun with npx." >&2
  exit 1
}

run_bun() {
  "${BUN_CMD[@]}" "$@"
}

run_validation_suite() {
  run_bun run scripts/validate-skills.ts
  run_bun run scripts/validate-contracts.ts
  run_bun run scripts/validate-external-deps.ts
  run_bun run scripts/validate-commands.ts
  run_bun run scripts/detect-overlap.ts
}

valid_mode() {
  case "$1" in local|global|both) return 0 ;; *) return 1 ;; esac
}

valid_harness() {
  case "$1" in all|agents|pi|codex|claude|cursor|opencode|gemini|copilot) return 0 ;; *) return 1 ;; esac
}

usage() {
  cat <<'EOF'
Usage: scripts/install.sh [options]

Options:
  --mode local|global|both       Install scope. Omit for interactive prompt.
  --target <path>                Local project target (default: current directory).
  --harness all|agents|pi|codex|claude|cursor|opencode|gemini|copilot
  --link                         Symlink skills instead of copying.
  --copy                         Copy skills (default).
  --dry-run                      Print intended changes without modifying files.
  --skip-external-deps           Do not install/check external dependencies.
  --yes                          Non-interactive approval for prompts.
  --home <path>                  Override HOME, mainly for isolated tests.
EOF
}

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
    --home) HOME_OVERRIDE="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage >&2; exit 1 ;;
  esac
done

if [[ -n "$HOME_OVERRIDE" ]]; then
  export HOME="$HOME_OVERRIDE"
fi

if ! valid_harness "$HARNESS"; then
  echo "Invalid harness: $HARNESS" >&2
  echo "Expected one of: all, agents, pi, codex, claude, cursor, opencode, gemini, copilot" >&2
  exit 1
fi

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

if ! valid_mode "$MODE"; then
  echo "Invalid mode: $MODE" >&2
  echo "Expected one of: local, global, both" >&2
  exit 1
fi

if [[ "$DRY_RUN" != "true" && "$YES" != "true" && ( "$MODE" == "global" || "$MODE" == "both" ) && ! -t 0 ]]; then
  echo "Refusing non-interactive global install without --yes. Re-run with --yes after reviewing target paths, or use --dry-run." >&2
  exit 1
fi

cd "$ROOT"
resolve_bun_cmd
run_validation_suite
run_bun run scripts/build-dist.ts

if [[ "$DRY_RUN" != "true" && ( "$MODE" == "local" || "$MODE" == "both" ) ]]; then
  # Preflight AGENTS.md before installing skills so symlink/unbalanced-marker failures do not leave a partial local install.
  run_bun run scripts/integrate-agents-md.ts --target "$TARGET" --sts-root "$ROOT" --dry-run >/dev/null
fi

unique_backup_path() {
  local dest="$1"
  local stamp
  stamp="$(date +%Y%m%d%H%M%S)-$$-${RANDOM:-0}"
  local backup="${dest}.bak-${stamp}"
  while [[ -e "$backup" || -L "$backup" ]]; do
    stamp="$(date +%Y%m%d%H%M%S)-$$-${RANDOM:-0}"
    backup="${dest}.bak-${stamp}"
  done
  printf '%s\n' "$backup"
}

copy_or_link() {
  local src="$1"
  local dest="$2"
  local parent
  parent="$(dirname "$dest")"

  if [[ ! -e "$src" ]]; then
    echo "Missing source: $src" >&2
    exit 1
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would install $src -> $dest ($LINK_MODE)"
    return
  fi

  mkdir -p "$parent"

  if [[ "$LINK_MODE" == "link" && -L "$dest" ]]; then
    local current_target
    current_target="$(readlink "$dest")"
    if [[ "$current_target" == "$src" ]]; then
      echo "Already linked $dest"
      return
    fi
  fi

  if [[ "$LINK_MODE" == "copy" && -d "$src" && -d "$dest" && ! -L "$dest" ]]; then
    if diff -qr "$src" "$dest" >/dev/null 2>&1; then
      echo "Already installed $dest"
      return
    fi
  fi
  if [[ "$LINK_MODE" == "copy" && -f "$src" && -f "$dest" && ! -L "$dest" ]]; then
    if cmp -s "$src" "$dest"; then
      echo "Already installed $dest"
      return
    fi
  fi

  local staged=""
  if [[ "$LINK_MODE" == "link" ]]; then
    staged="$parent/.sts-link-tmp-$(basename "$dest")-$$-${RANDOM:-0}"
    while [[ -e "$staged" || -L "$staged" ]]; do
      staged="$parent/.sts-link-tmp-$(basename "$dest")-$$-${RANDOM:-0}"
    done
    ln -s "$src" "$staged"
  else
    if [[ -d "$src" ]]; then
      staged="$(mktemp -d "$parent/.sts-copy-tmp-$(basename "$dest").XXXXXX")"
      cp -R "$src/." "$staged/"
    else
      staged="$(mktemp "$parent/.sts-copy-tmp-$(basename "$dest").XXXXXX")"
      cp "$src" "$staged"
    fi
  fi

  if [[ -e "$dest" || -L "$dest" ]]; then
    local backup
    backup="$(unique_backup_path "$dest")"
    mv "$dest" "$backup"
    if mv "$staged" "$dest"; then
      echo "Backed up existing $dest to $backup"
    else
      echo "Install failed for $dest; restoring $backup" >&2
      if [[ -e "$dest" || -L "$dest" ]]; then rm -rf "$dest"; fi
      mv "$backup" "$dest"
      if [[ -e "$staged" || -L "$staged" ]]; then rm -rf "$staged"; fi
      exit 1
    fi
  else
    mv "$staged" "$dest"
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

install_command_tree() {
  local src_root="$1"
  local dest_root="$2"
  if [[ ! -d "$src_root" ]]; then
    return
  fi
  while IFS= read -r -d '' file; do
    local rel="${file#$src_root/}"
    copy_or_link "$file" "$dest_root/$rel"
  done < <(find "$src_root" -type f -print0 | sort -z)
}

install_commands_scope() {
  local scope="$1"
  local base="$2"
  local entries=()
  if [[ "$scope" == "local" ]]; then
    entries=(
      "agents|$ROOT/dist/agents/.agents/commands|$base/.agents/commands"
      "pi|$ROOT/dist/pi/.pi/prompts|$base/.pi/prompts"
      "claude|$ROOT/dist/claude/.claude/commands|$base/.claude/commands"
      "cursor|$ROOT/dist/cursor/.cursor/commands|$base/.cursor/commands"
      "opencode|$ROOT/dist/opencode/.opencode/commands|$base/.opencode/commands"
      "gemini|$ROOT/dist/gemini/.gemini/commands|$base/.gemini/commands"
      "copilot|$ROOT/dist/copilot/.github/prompts|$base/.github/prompts"
    )
  else
    entries=(
      "agents|$ROOT/dist/agents/.agents/commands|$HOME/.agents/commands"
      "pi|$ROOT/dist/pi/.pi/prompts|$HOME/.pi/agent/prompts"
      "codex|$ROOT/dist/codex/.codex/prompts|$HOME/.codex/prompts"
      "claude|$ROOT/dist/claude/.claude/commands|$HOME/.claude/commands"
      "cursor|$ROOT/dist/cursor/.cursor/commands|$HOME/.cursor/commands"
      "opencode|$ROOT/dist/opencode/.opencode/commands|$HOME/.config/opencode/commands"
      "gemini|$ROOT/dist/gemini/.gemini/commands|$HOME/.gemini/commands"
      "copilot|$ROOT/dist/copilot/.github/prompts|$HOME/.copilot/prompts"
    )
  fi
  for entry in "${entries[@]}"; do
    local key="${entry%%|*}"
    local rest="${entry#*|}"
    local src="${rest%%|*}"
    local dest="${rest#*|}"
    if [[ "$HARNESS" != "all" && "$HARNESS" != "$key" ]]; then
      continue
    fi
    install_command_tree "$src" "$dest"
  done
}

if [[ "$MODE" == "local" || "$MODE" == "both" ]]; then
  install_scope local "$TARGET"
  install_commands_scope local "$TARGET"
  integrate_args=("--target" "$TARGET" "--sts-root" "$ROOT")
  if [[ "$DRY_RUN" == "true" ]]; then integrate_args+=("--dry-run"); fi
  run_bun run scripts/integrate-agents-md.ts "${integrate_args[@]}"
fi
if [[ "$MODE" == "global" || "$MODE" == "both" ]]; then
  install_scope global "$HOME"
  install_commands_scope global "$HOME"
fi
if [[ "$SKIP_EXTERNAL" != "true" ]]; then
  external_args=("--mode" "$MODE" "--target" "$TARGET" "--harness" "$HARNESS")
  if [[ "$DRY_RUN" == "true" ]]; then external_args+=("--dry-run"); fi
  if [[ "$YES" == "true" ]]; then external_args+=("--yes"); fi
  run_bun run scripts/install-external-deps.ts "${external_args[@]}"
fi

echo "Spec-to-Ship install complete."
echo "If Impeccable was installed, run /impeccable init inside your AI coding tool."
