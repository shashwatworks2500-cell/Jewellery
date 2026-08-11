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
bash scripts/setup-claude-skills.sh --verify   # offline check, no network, no writes
```

Expected: `28/28`. If skills are missing, run without `--verify` to restore them.

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
