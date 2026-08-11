# Jewellery

## This repository ships its own Claude Code skills — use them

28 project-level skills live in `.claude/skills/` and are committed to Git. They are the
authoritative reference for work in this repo. **Consult the relevant skill before writing code**
in its domain rather than working from general knowledge.

Full index, sources and per-skill guidance: **`.claude/SKILLS.md`** — read that file when you need
to pick a skill.

Quick routing:

| Task | Skill to load first |
|---|---|
| Any multi-library 3D build | `web3d-integration-patterns` (architecture meta-skill — start here) |
| React Three Fiber work | the matching `r3f-*` skill (11 available: geometry, materials, shaders, physics, …) |
| Raw Three.js / WebGL | `threejs-webgl` |
| Scroll-driven animation | `gsap-scrolltrigger`, `locomotive-scroll`, `scroll-reveal-libraries` |
| React animation | `motion-framer`, `react-spring-physics` |
| Visual/design direction | `modern-web-design` |
| React / Next.js code | `vercel-react-best-practices` |
| UI review, accessibility | `web-design-guidelines` |
| Sourcing UI components | `21st-cli-use`, `21st-ai` |
| Deploying | `deploy-to-vercel` |

## Verifying the skills are present

```bash
bash scripts/verify-claude-skills.sh
```

Read-only, offline, no dependency on anything outside this repository. Exit 0 = pass. It checks the
canonical layout, frontmatter validity, symlink containment, external/ephemeral dependencies, and git
tracking.

To restore skills that are genuinely missing:

```bash
bash scripts/setup-claude-skills.sh            # restore
bash scripts/setup-claude-skills.sh --verify   # offline count check
```

### If a session reports the skills are not discoverable

Run `bash scripts/verify-claude-skills.sh` **in that session** before reinstalling anything. The
output separates the two very different causes:

- **`RESULT: PASS`** — the repository is correct and the skills are on disk at the canonical path.
  The session is not looking at this repository: check that its working directory is the repo root
  (`pwd` vs `git rev-parse --show-toplevel`), and that its clone actually contains the skills commit
  (`git log --oneline -1 -- .claude/skills`). A clone made before the skills were committed will not
  have them; fetch and check out the current branch.
- **`RESULT: FAIL`** — a real repository defect. The failing line names it. Fix that specific item;
  do not blanket-reinstall, which risks duplicating or overwriting valid vendored skills.

## Rules for this repository

- **Do not delete or hand-edit anything under `.claude/skills/`.** Those files are vendored from
  upstream sources and pinned by hash in `skills-lock.json`. Change them only via the bootstrap script.
- `.agents/` is a staging duplicate created by the skills CLI. It is gitignored on purpose. Do not commit it.
- Never commit a `21st_sk_` API key, Vercel token, or any credential.
- Two skills act outward and need explicit confirmation before use: `21st-registry` and
  `21st-design-sync` publish to a public/team library; `deploy-to-vercel` ships the site live.

## Known upstream wart

`deploy-to-vercel/SKILL.md` hardcodes `/mnt/skills/user/deploy-to-vercel/resources/deploy.sh`, which
does not exist here. The script is vendored in-repo — use the repo-relative path instead:

```
.claude/skills/deploy-to-vercel/resources/deploy.sh
```

The skill's own text (line 231) says to ignore the `/mnt/skills/` path when shell access is available.
