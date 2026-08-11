#!/usr/bin/env bash
#
# setup-claude-skills.sh
#
# Restores this repository's project-level Claude Code skill stack.
# Run after cloning onto a new machine, or any time to repair/update the skills.
#
#   bash scripts/setup-claude-skills.sh
#
# Guarantees:
#   * Project-level only. Never passes -g / --global.
#   * Never touches application source code.
#   * Never installs runtime dependencies (React, Next.js, Three.js, GSAP, ...).
#   * Safe to run repeatedly — re-running simply re-verifies/refreshes each skill.
#
# Requires: node + npx, git, and network access.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT" || exit 1

SKILLS_DIR=".claude/skills"
LOCKFILE="skills-lock.json"

VERIFY_ONLY=0

# Guard: refuse to run with a global flag smuggled in via arguments.
for arg in "$@"; do
  case "$arg" in
    -g|--global)
      echo "ERROR: this script is project-scoped by design; -g/--global is not allowed." >&2
      exit 2
      ;;
    --verify|-v)
      VERIFY_ONLY=1
      ;;
    -h|--help)
      cat <<'USAGE'
Usage: bash scripts/setup-claude-skills.sh [--verify]

  (no args)   Restore any missing skills into .claude/skills/, then verify.
              Only touches skills that are absent; existing ones are left alone.
  --verify    Verify only. No installs, no network, no writes. Exit 0 if all
              expected skills are present and valid.

Never accepts -g/--global: this repository's skills are project-scoped.
USAGE
      exit 0
      ;;
  esac
done

# Network/node are only needed when we may actually install something.
if [ "$VERIFY_ONLY" -eq 0 ]; then
  command -v npx >/dev/null 2>&1 || { echo "ERROR: npx not found. Install Node.js first." >&2; exit 1; }
fi

echo "Repository : $REPO_ROOT"
echo "Target     : $SKILLS_DIR (project-level)"
echo

# ---------------------------------------------------------------------------
# Skill inventory: "<source-repo> <skill-name>"
# Keep in sync with .claude/SKILLS.md
# ---------------------------------------------------------------------------
SKILLS=(
  # --- 21st.dev (4) ---
  "21st-dev/skill 21st-ai"
  "21st-dev/skill 21st-cli-use"
  "21st-dev/skill 21st-design-sync"
  "21st-dev/skill 21st-registry"

  # --- React Three Fiber (11) ---
  "Enzed/r3f-skills r3f-fundamentals"
  "Enzed/r3f-skills r3f-geometry"
  "Enzed/r3f-skills r3f-materials"
  "Enzed/r3f-skills r3f-textures"
  "Enzed/r3f-skills r3f-lighting"
  "Enzed/r3f-skills r3f-loaders"
  "Enzed/r3f-skills r3f-animation"
  "Enzed/r3f-skills r3f-interaction"
  "Enzed/r3f-skills r3f-physics"
  "Enzed/r3f-skills r3f-shaders"
  "Enzed/r3f-skills r3f-postprocessing"

  # --- Modern web / 3D / animation / scroll (9) ---
  "freshtechbro/claudedesignskills web3d-integration-patterns"
  "freshtechbro/claudedesignskills modern-web-design"
  "freshtechbro/claudedesignskills threejs-webgl"
  "freshtechbro/claudedesignskills gsap-scrolltrigger"
  "freshtechbro/claudedesignskills motion-framer"
  "freshtechbro/claudedesignskills react-three-fiber"
  "freshtechbro/claudedesignskills locomotive-scroll"
  "freshtechbro/claudedesignskills scroll-reveal-libraries"
  "freshtechbro/claudedesignskills react-spring-physics"

  # --- Vercel (4) ---
  "vercel-labs/agent-skills vercel-react-best-practices"
  "vercel-labs/agent-skills web-design-guidelines"
  "vercel-labs/agent-skills vercel-optimize"
  "vercel-labs/agent-skills deploy-to-vercel"
)

EXPECTED=${#SKILLS[@]}

# ---------------------------------------------------------------------------
# Fast path: restore straight from the lockfile when present.
# ---------------------------------------------------------------------------
if [ -f "$LOCKFILE" ] && [ "$VERIFY_ONLY" -eq 0 ]; then
  echo "Found $LOCKFILE — attempting lockfile restore..."
  if npx --yes skills experimental_install >/dev/null 2>&1; then
    installed=$(find "$SKILLS_DIR" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
    if [ "$installed" -eq "$EXPECTED" ]; then
      echo "Lockfile restore complete: $installed/$EXPECTED skills."
      echo
    else
      echo "Lockfile restore incomplete ($installed/$EXPECTED) — falling back to explicit installs."
      echo
    fi
  else
    echo "Lockfile restore unavailable — falling back to explicit installs."
    echo
  fi
fi

# ---------------------------------------------------------------------------
# Explicit installs. Idempotent: skips any skill already present.
# NOTE: the skills CLI takes ONE name per -s flag; comma-separated lists are
# not supported, so each skill is installed individually.
# ---------------------------------------------------------------------------
ok=0; skipped=0; failed=0
FAILED_NAMES=()

for entry in "${SKILLS[@]}"; do
  src="${entry%% *}"
  name="${entry##* }"

  if [ -f "$SKILLS_DIR/$name/SKILL.md" ]; then
    [ "$VERIFY_ONLY" -eq 0 ] && printf '  skip    %-30s (already present)\n' "$name"
    skipped=$((skipped + 1))
    continue
  fi

  if [ "$VERIFY_ONLY" -eq 1 ]; then
    printf '  ABSENT  %-30s (run without --verify to restore)\n' "$name"
    failed=$((failed + 1))
    FAILED_NAMES+=("$name")
    continue
  fi

  output=$(npx --yes skills add "$src" -s "$name" -a claude-code -y 2>&1)
  if [ -f "$SKILLS_DIR/$name/SKILL.md" ]; then
    printf '  ok      %-30s <- %s\n' "$name" "$src"
    ok=$((ok + 1))
  else
    printf '  FAILED  %-30s <- %s\n' "$name" "$src"
    if echo "$output" | grep -q "No matching skills"; then
      echo "          (skill name not found in $src — it may have been renamed upstream)"
    fi
    failed=$((failed + 1))
    FAILED_NAMES+=("$name")
  fi
done

# ---------------------------------------------------------------------------
# Verify: every skill needs a readable SKILL.md with YAML frontmatter.
# ---------------------------------------------------------------------------
echo
echo "Verifying..."
verified=0; broken=0
BROKEN_NAMES=()

for entry in "${SKILLS[@]}"; do
  name="${entry##* }"
  f="$SKILLS_DIR/$name/SKILL.md"
  if [ -r "$f" ] && head -n 1 "$f" | grep -q '^---$' && grep -q '^name:' "$f"; then
    verified=$((verified + 1))
  else
    broken=$((broken + 1))
    BROKEN_NAMES+=("$name")
  fi
done

total_dirs=$(find "$SKILLS_DIR" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')

# Integrity: nothing under .claude/skills/ may point outside the repository.
stray_links=$(find "$SKILLS_DIR" -type l 2>/dev/null | wc -l | tr -d ' ')
[ "$stray_links" -ne 0 ] && echo "  WARNING: $stray_links symlink(s) under $SKILLS_DIR — skills must be real files."

# Advisory: globally-installed skills of the same name can shadow the repo copies.
# The repo is the source of truth; global copies are unpinned and may be stale.
GLOBAL_ROOT="${HOME:-/root}/.claude/skills"
if [ -d "$GLOBAL_ROOT" ]; then
  shadowed=$(comm -12 \
    <(find "$GLOBAL_ROOT" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; 2>/dev/null | sort) \
    <(find "$SKILLS_DIR"  -mindepth 1 -maxdepth 1 -type d -exec basename {} \; 2>/dev/null | sort) \
    | wc -l | tr -d ' ')
  if [ "${shadowed:-0}" -gt 0 ]; then
    echo
    echo "  NOTE: $shadowed skill(s) with matching names also exist globally in"
    echo "        $GLOBAL_ROOT"
    echo "        The repository copy is authoritative and hash-pinned. The global copies are"
    echo "        unpinned and may be stale. To remove the ambiguity:"
    echo "          npx skills remove --global   # or delete the duplicate dirs by hand"
  fi
fi

echo
echo "------------------------------------------"
echo "  expected   : $EXPECTED"
echo "  installed  : $ok"
echo "  skipped    : $skipped (already present)"
echo "  failed     : $failed"
echo "  verified   : $verified/$EXPECTED"
echo "  dirs on disk: $total_dirs"
echo "------------------------------------------"

[ ${#FAILED_NAMES[@]} -gt 0 ] && echo "  failed: ${FAILED_NAMES[*]}"
[ ${#BROKEN_NAMES[@]} -gt 0 ] && echo "  broken: ${BROKEN_NAMES[*]}"

if [ "$verified" -eq "$EXPECTED" ]; then
  echo
  echo "All $EXPECTED skills present and valid."
  echo "Note: 21st.dev skills additionally require a 21st CLI login (21st_sk_ API key)"
  echo "      before they can perform any action. Never commit that key."
  exit 0
fi

echo
echo "Setup incomplete — $broken skill(s) missing or invalid." >&2
exit 1
