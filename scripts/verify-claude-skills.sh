#!/usr/bin/env bash
#
# verify-claude-skills.sh
#
# Deterministic check that this repository is correctly structured for
# Claude Code project-level skill discovery.
#
#   bash scripts/verify-claude-skills.sh
#
# Read-only: installs nothing, writes nothing, needs no network, and depends on
# no state outside this repository. Exit 0 = pass, 1 = fail.
#
# Run this INSIDE any session that claims the skills are missing — the output
# distinguishes "the repository is wrong" from "this session is not looking at
# this repository".

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT" || exit 1

SKILLS_DIR=".claude/skills"
EXPECTED=28

pass=0; fail=0; warn=0
ok()   { printf '  [ OK ]  %s\n' "$1"; pass=$((pass+1)); }
bad()  { printf '  [FAIL]  %s\n' "$1"; fail=$((fail+1)); }
note() { printf '  [WARN]  %s\n' "$1"; warn=$((warn+1)); }

echo "Claude Code project skill verification"
echo "Repository root : $REPO_ROOT"
echo "Working dir     : $(pwd)"
echo "Branch          : $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '(not a git repo)')"
echo "Commit          : $(git rev-parse --short HEAD 2>/dev/null || echo '(none)')"
echo

# --- 1. canonical location -------------------------------------------------
echo "1. Canonical location"
if [ -d "$SKILLS_DIR" ]; then
  ok "$SKILLS_DIR exists"
else
  bad "$SKILLS_DIR does NOT exist — this session is not at the repository root,"
  echo "          or the clone predates the skills commit. Run: git log --oneline -- $SKILLS_DIR"
  echo
  echo "RESULT: FAIL"
  exit 1
fi

# --- 2/3. directory and SKILL.md counts ------------------------------------
echo
echo "2. Skill directories and SKILL.md files"
dirs=$(find "$SKILLS_DIR" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
canon=$(find "$SKILLS_DIR" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')
anydepth=$(find "$SKILLS_DIR" -name SKILL.md | wc -l | tr -d ' ')

[ "$dirs" -eq "$EXPECTED" ] && ok "$dirs skill directories (expected $EXPECTED)" \
                            || bad "$dirs skill directories (expected $EXPECTED)"
[ "$canon" -eq "$EXPECTED" ] && ok "$canon SKILL.md at canonical .claude/skills/<name>/SKILL.md" \
                             || bad "$canon SKILL.md at canonical depth (expected $EXPECTED)"
[ "$anydepth" -eq "$canon" ] && ok "no SKILL.md nested at a non-canonical depth" \
                             || bad "$((anydepth - canon)) SKILL.md file(s) nested too deep — Claude Code will not load them"

# --- 4. readability + frontmatter validity ---------------------------------
echo
echo "3. Readability and YAML frontmatter"
unreadable=0; badfm=0; badname=0; nodesc=0
for d in "$SKILLS_DIR"/*/; do
  name=$(basename "$d")
  f="$d/SKILL.md"
  [ -f "$f" ] || { bad "$name: SKILL.md missing"; continue; }
  [ -r "$f" ] || { unreadable=$((unreadable+1)); continue; }
  # opening delimiter must be the very first line
  [ "$(head -n 1 "$f")" = "---" ] || { badfm=$((badfm+1)); echo "          $name: no opening --- on line 1"; continue; }
  # closing delimiter must exist
  awk 'NR>1 && /^---[[:space:]]*$/{found=1; exit} END{exit !found}' "$f" || { badfm=$((badfm+1)); echo "          $name: no closing ---"; continue; }
  # name must be present and match the directory
  declared=$(awk 'NR>1 && /^---[[:space:]]*$/{exit} /^name:/{sub(/^name:[[:space:]]*/,""); print; exit}' "$f")
  [ "$declared" = "$name" ] || { badname=$((badname+1)); echo "          $name: frontmatter name is '$declared'"; }
  grep -q "^description:" "$f" || { nodesc=$((nodesc+1)); echo "          $name: no description field"; }
done
[ "$unreadable" -eq 0 ] && ok "all SKILL.md readable"            || bad "$unreadable SKILL.md unreadable"
[ "$badfm"      -eq 0 ] && ok "all frontmatter delimiters valid" || bad "$badfm SKILL.md with malformed frontmatter"
[ "$badname"    -eq 0 ] && ok "all frontmatter names match their directory" || bad "$badname name/directory mismatch(es)"
[ "$nodesc"     -eq 0 ] && ok "all skills declare a description" || bad "$nodesc skill(s) missing description"

# --- 5. no symlink escapes -------------------------------------------------
echo
echo "4. Symlink containment"
links=$(find "$SKILLS_DIR" -type l 2>/dev/null | wc -l | tr -d ' ')
if [ "$links" -eq 0 ]; then
  ok "no symlinks under $SKILLS_DIR (all real files)"
else
  escaped=0
  while IFS= read -r l; do
    target=$(readlink -f "$l" 2>/dev/null)
    case "$target" in "$REPO_ROOT"/*) ;; *) escaped=$((escaped+1)); echo "          escapes repo: $l -> $target";; esac
  done < <(find "$SKILLS_DIR" -type l)
  [ "$escaped" -eq 0 ] && note "$links symlink(s) present but contained in repo" \
                       || bad "$escaped symlink(s) point outside the repository"
fi

# --- 6. no external / ephemeral dependency ---------------------------------
echo
echo "5. External and ephemeral dependencies"
for pattern in "/root/.claude/skills" "/home/.*/.claude/skills" "~/.agents"; do
  hits=$(grep -rIl -E "$pattern" "$SKILLS_DIR" 2>/dev/null | wc -l | tr -d ' ')
  [ "$hits" -eq 0 ] && ok "no skill references $pattern" \
                    || bad "$hits skill(s) reference $pattern"
done

# /mnt/skills: a text mention is only a real dependency if the referenced file
# is not vendored inside the skill's own directory.
mnt_files=$(grep -rIl "/mnt/skills" "$SKILLS_DIR" 2>/dev/null || true)
if [ -z "$mnt_files" ]; then
  ok "no skill references /mnt/skills"
else
  hard=0
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    skilldir=$(dirname "$f")
    while IFS= read -r ref; do
      base=$(basename "$ref")
      if ! find "$skilldir" -name "$base" -print -quit 2>/dev/null | grep -q .; then
        hard=$((hard+1)); echo "          $f -> $ref (NOT vendored in repo)"
      fi
    done < <(grep -ohE "/mnt/skills[A-Za-z0-9._/-]*" "$f" | grep -E '\.[a-z]+$' | sort -u)
  done <<< "$mnt_files"
  if [ "$hard" -eq 0 ]; then
    note "/mnt/skills mentioned in $(echo "$mnt_files" | wc -l | tr -d ' ') skill(s), but every referenced file is vendored in-repo (documentation wart, not a dependency)"
  else
    bad "$hard unresolved /mnt/skills reference(s) — real external dependency"
  fi
fi

# --- 7. git tracking -------------------------------------------------------
echo
echo "6. Git tracking"
if git rev-parse --git-dir >/dev/null 2>&1; then
  tracked=$(git ls-files "$SKILLS_DIR" | grep -c '/SKILL\.md$')
  tfiles=$(git ls-files "$SKILLS_DIR" | wc -l | tr -d ' ')
  dfiles=$(find "$SKILLS_DIR" -type f | wc -l | tr -d ' ')
  [ "$tracked" -eq "$EXPECTED" ] && ok "$tracked SKILL.md tracked by git" \
                                 || bad "$tracked SKILL.md tracked by git (expected $EXPECTED)"
  [ "$tfiles" -eq "$dfiles" ] && ok "git/disk parity: $tfiles files" \
                              || bad "git tracks $tfiles files but $dfiles exist on disk"
  gl=$(git ls-files -s "$SKILLS_DIR" | awk '$1=="160000"' | wc -l | tr -d ' ')
  [ "$gl" -eq 0 ] && ok "no gitlinks/submodules under $SKILLS_DIR" \
                  || bad "$gl gitlink(s) — nested repo, contents will NOT clone"
  if git check-ignore -q "$SKILLS_DIR" 2>/dev/null; then
    bad "$SKILLS_DIR is matched by .gitignore"
  else
    ok "$SKILLS_DIR is not gitignored"
  fi
else
  note "not a git repository — skipping git checks"
fi

# --- 8. discovery support files -------------------------------------------
echo
echo "7. Discovery support files"
[ -f CLAUDE.md ]              && ok "CLAUDE.md present (tells a session the skills exist)" \
                              || note "CLAUDE.md missing — skills load but sessions have no pointer to them"
[ -f .claude/settings.json ]  && ok ".claude/settings.json present (project-scoped Skill permission)" \
                              || note ".claude/settings.json missing — sessions may prompt per skill call"
[ -f .claude/SKILLS.md ]      && ok ".claude/SKILLS.md present (skill index)" \
                              || note ".claude/SKILLS.md missing"
[ -f skills-lock.json ]       && ok "skills-lock.json present (source + hash pins)" \
                              || note "skills-lock.json missing"

# --- summary ---------------------------------------------------------------
echo
echo "------------------------------------------"
printf '  passed: %d   warnings: %d   failed: %d\n' "$pass" "$warn" "$fail"
echo "------------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "RESULT: PASS - repository is correctly structured for project-level skill discovery."
  exit 0
fi
echo "RESULT: FAIL - $fail check(s) failed." >&2
exit 1
