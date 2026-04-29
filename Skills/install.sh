#!/usr/bin/env bash
# install.sh — Install VoxModTK skills for Claude Code, Codex CLI, and Cursor
# Uses symlinks (Unix) / junctions+hardlinks (Windows) so edits in Skills/ propagate.
# Usage: bash Skills/install.sh [--claude] [--codex] [--cursor] [--all]
#   --claude   Install for Claude Code only
#   --codex    Install for OpenAI Codex CLI only
#   --cursor   Install for Cursor IDE only
#   --all      Install for all three (default)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILL_NAME="voxmodtk"

IS_WINDOWS=false
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
  IS_WINDOWS=true
fi

to_win_path() {
  if command -v cygpath &>/dev/null; then
    cygpath -w "$1"
  else
    echo "$1" | sed 's|/|\\|g'
  fi
}

# Run a Windows mklink command via a temp batch file (avoids quoting issues in MSYS)
win_mklink() {
  local flag="$1"   # /H for hardlink, /J for junction
  local dst="$2"
  local src="$3"

  local tmp_bat
  tmp_bat="$(mktemp /tmp/vm_install_XXXXXX.bat)"
  echo "@echo off" > "$tmp_bat"
  echo "mklink $flag \"$(to_win_path "$dst")\" \"$(to_win_path "$src")\"" >> "$tmp_bat"
  cmd //c "$(cygpath -w "$tmp_bat")" >/dev/null 2>&1
  local rc=$?
  rm -f "$tmp_bat"
  return $rc
}

# Link a file: symlink on Unix, hardlink on Windows
link_file() {
  local src="$1"
  local dst="$2"

  rm -f "$dst" 2>/dev/null
  mkdir -p "$(dirname "$dst")"

  if $IS_WINDOWS; then
    win_mklink /H "$dst" "$src" && return 0
  fi

  ln -s "$src" "$dst" 2>/dev/null && return 0

  echo "  [warn] link failed, falling back to copy for $(basename "$dst")"
  cp "$src" "$dst"
}

install_claude() {
  local target_dir="$REPO_ROOT/.claude/commands"
  mkdir -p "$target_dir"

  link_file "$SCRIPT_DIR/SKILL.md" "$target_dir/$SKILL_NAME.md"

  echo "[claude] Linked .claude/commands/ -> Skills/"
}

install_codex() {
  local skill_dir="$REPO_ROOT/.codex/skills/$SKILL_NAME"
  mkdir -p "$skill_dir"

  link_file "$SCRIPT_DIR/SKILL.md" "$skill_dir/SKILL.md"

  if [ -d "$SCRIPT_DIR/agents" ]; then
    mkdir -p "$REPO_ROOT/.codex/agents"
    for f in "$SCRIPT_DIR/agents/"*.yaml; do
      [ -f "$f" ] && link_file "$f" "$REPO_ROOT/.codex/agents/$(basename "$f")"
    done
  fi

  echo "[codex] Linked .codex/skills/$SKILL_NAME/ -> Skills/"
}

install_cursor() {
  local rules_dir="$REPO_ROOT/.cursor/rules"
  mkdir -p "$rules_dir"

  # Cursor reads .mdc files with YAML frontmatter in .cursor/rules/
  # SKILL.md already has a compatible frontmatter (name, description),
  # so we hardlink it directly — no generation needed, stays in sync.
  link_file "$SCRIPT_DIR/SKILL.md" "$rules_dir/$SKILL_NAME.mdc"

  echo "[cursor] Linked .cursor/rules/ -> Skills/"
}

# Parse arguments
INSTALL_CLAUDE=false
INSTALL_CODEX=false
INSTALL_CURSOR=false

if [ $# -eq 0 ]; then
  INSTALL_CLAUDE=true
  INSTALL_CODEX=true
  INSTALL_CURSOR=true
fi

for arg in "$@"; do
  case "$arg" in
    --claude) INSTALL_CLAUDE=true ;;
    --codex)  INSTALL_CODEX=true ;;
    --cursor) INSTALL_CURSOR=true ;;
    --all)    INSTALL_CLAUDE=true; INSTALL_CODEX=true; INSTALL_CURSOR=true ;;
    *)        echo "Unknown option: $arg"; exit 1 ;;
  esac
done

if $INSTALL_CLAUDE; then
  install_claude
fi

if $INSTALL_CODEX; then
  install_codex
fi

if $INSTALL_CURSOR; then
  install_cursor
fi

echo "Done."
