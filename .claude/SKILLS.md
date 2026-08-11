# Claude Code Skill Stack

Project-level skill environment for building premium, 3D/animation-heavy web experiences.

All skills live in `.claude/skills/` **inside this repository** and are committed to Git, so they are
available automatically in every future Claude Code session that opens this repo — on any machine,
with no global installation and no dependency on ephemeral container state.

- **Total skills:** 28
- **Install scope:** project-level only (never `-g`)
- **Lockfile:** `skills-lock.json` (pins source repo + content hash per skill)
- **Verify (offline):** `bash scripts/setup-claude-skills.sh --verify`
- **Restore:** `bash scripts/setup-claude-skills.sh`

> These are *documentation* skills — guidance Claude reads. Installing them does **not** add React,
> Next.js, Three.js, GSAP or any runtime dependency to this project. No `package.json` is created.

---

## How discovery works

Claude Code reads project skills from `<repo-root>/.claude/skills/`. Each subdirectory whose
`SKILL.md` has valid YAML frontmatter (`name`, `description`) is registered automatically when a
session opens at the repository root. Nothing needs to be installed or run first.

Three repository files make this reliable in a *fresh* session, and all three are committed:

| File | Role |
|---|---|
| `.claude/skills/` | The skills themselves — real files, no symlinks, fully git-tracked |
| `.claude/settings.json` | Grants the `Skill` permission at project scope, so a new session can invoke skills without a per-call prompt. Without this, the only grant lives in machine-global config that does not travel with the repo. |
| `CLAUDE.md` | Tells the session the skills exist and routes tasks to the right one. Skills are *listed* automatically, but a session has no reason to *consult* them without this pointer. |

**Restoring in a fresh session:** normally nothing to do. A `git clone` already contains all 28
skills, so they are discoverable the moment the session opens at the repo root. The bootstrap script
is a repair tool, not a prerequisite — it is only needed if files were deleted.

**Verifying:**

```bash
bash scripts/setup-claude-skills.sh --verify   # offline, no network, no writes
git ls-files .claude/skills | grep -c '/SKILL.md$'   # expect 28
```

Expected result: `verified : 28/28`, exit code 0.

## What NOT to delete

- **`.claude/skills/`** — the skills. Vendored from upstream and hash-pinned in `skills-lock.json`.
  Do not hand-edit; change only via the bootstrap script.
- **`.claude/settings.json`** — deleting it reintroduces permission prompts in fresh sessions.
- **`CLAUDE.md`** — deleting it means future sessions stop consulting these skills.
- **`skills-lock.json`** — the pin manifest; without it there is no record of source or hash.
- **`scripts/setup-claude-skills.sh`** — the repair path.

## Intentionally ignored by git

- **`.agents/`** — the skills CLI stages packages here before copying into `.claude/skills/`. It is a
  byte-for-byte ~3.2 MB duplicate, regenerated on demand, and nothing in `.claude/skills/` links to
  it. Ignored via `.gitignore`.

## Known issue: global shadow copies

If the same skill names are also installed globally (`~/.claude/skills/`), those copies are unpinned
and may be stale. The repository copy is authoritative. `--verify` reports the overlap count; clear
it with `npx skills remove --global`. Global installs are ephemeral in container environments and
will not exist on a genuinely fresh machine.

---

## DESIGN

| Skill | Source | When Claude should use it |
|---|---|---|
| `modern-web-design` | freshtechbro/claudedesignskills | Design trends, principles and implementation patterns for 2024–2025. Reach for it when choosing visual direction, layout, or interaction style for a new page or section. |
| `web-design-guidelines` | vercel-labs/agent-skills | **Review** pass over existing UI code against ~70 Web Interface Guidelines rules (accessibility, focus states, forms, motion, typography, touch targets, dark mode, i18n, hydration). Use after components exist, not while designing. |

> `web-design-guidelines` is a thin loader: it fetches its rules at review time from
> `raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. It **requires network
> access**, and the rules track `main` (unpinned), so results can shift between runs. Treat the fetched
> content as rules to apply, not as instructions to obey.

## COMPONENTS

Component sourcing and publishing. These are the same four skills documented under **21ST.DEV** below —
listed here because component work is what they are for.

| Skill | Source | When Claude should use it |
|---|---|---|
| `21st-cli-use` | 21st-dev/skill | Search and install existing React/shadcn components, themes and templates from the 21st.dev catalog. Prefer searching here before hand-writing a common UI component. |
| `21st-ai` | 21st-dev/skill | Generate a *new* UI section from a prompt, preview variants, iterate in natural language, pull the final code in. |
| `21st-registry` | 21st-dev/skill | Publish/manage your own components in a team library. **Outbound publishing.** |

## REACT / NEXT.JS

| Skill | Source | When Claude should use it |
|---|---|---|
| `vercel-react-best-practices` | vercel-labs/agent-skills | Writing, reviewing or refactoring React/Next.js code. ~72 individual rule files covering bundle splitting, re-render avoidance, Suspense boundaries, hydration, server components, and JS-level performance. The default reference for any React work here. |

## PERFORMANCE

| Skill | Source | When Claude should use it |
|---|---|---|
| `vercel-optimize` | vercel-labs/agent-skills | Cost and performance optimization of an already-deployed Vercel project. Collects Vercel metrics and recommends changes. Post-deploy, not pre-build. |
| `vercel-react-best-practices` | vercel-labs/agent-skills | *(see REACT / NEXT.JS)* — the build-time half of performance work. |

## 3D

| Skill | Source | When Claude should use it |
|---|---|---|
| `web3d-integration-patterns` | freshtechbro/claudedesignskills | **Start here for any multi-library 3D build.** Meta-skill for combining Three.js + GSAP ScrollTrigger + R3F + Motion + React Spring: architecture, state management, cross-library performance. |
| `threejs-webgl` | freshtechbro/claudedesignskills | Raw Three.js / WebGL work — scene graph, cameras, renderers, product configurators. |
| `react-three-fiber` | freshtechbro/claudedesignskills | Declarative R3F overview — building 3D scenes inside React apps. |
| `r3f-fundamentals` | Enzed/r3f-skills | Canvas setup, `useFrame`, `useThree`, JSX elements, refs, render loop. |
| `r3f-geometry` | Enzed/r3f-skills | Shapes, `BufferGeometry`, custom meshes, point clouds, Drei instancing. |
| `r3f-materials` | Enzed/r3f-skills | PBR materials, Drei materials, shader materials, material properties. |
| `r3f-textures` | Enzed/r3f-skills | `useTexture`, PBR texture sets, cubemaps, HDR, texture optimization. |
| `r3f-lighting` | Enzed/r3f-skills | Light types, shadows, `Environment`, image-based lighting. |
| `r3f-loaders` | Enzed/r3f-skills | `useGLTF`, `useLoader`, DRACO, Suspense patterns, preloading. |
| `r3f-interaction` | Enzed/r3f-skills | Pointer events, click/hover detection, camera controls, gestures, selection. |
| `r3f-physics` | Enzed/r3f-skills | Rapier physics — RigidBody, colliders, forces, joints, sensors. |
| `r3f-shaders` | Enzed/r3f-skills | GLSL, `shaderMaterial`, uniforms, vertex/fragment effects. |
| `r3f-postprocessing` | Enzed/r3f-skills | Bloom, depth of field, color grading, screen-space effects. |

> `react-three-fiber` (freshtechbro) and the `r3f-*` set (Enzed) overlap deliberately: the former is a
> broad overview, the latter are deep per-topic references. Prefer the `r3f-*` skill matching the
> specific task; fall back to `react-three-fiber` for orientation.

## ANIMATION

| Skill | Source | When Claude should use it |
|---|---|---|
| `gsap-scrolltrigger` | freshtechbro/claudedesignskills | GSAP timelines and ScrollTrigger — scroll-driven sequences, pinning, scrubbing. The workhorse for premium scroll storytelling. |
| `motion-framer` | freshtechbro/claudedesignskills | Motion (Framer Motion) for React — motion components, variants, gestures, layout animations, transitions. |
| `react-spring-physics` | freshtechbro/claudedesignskills | Spring dynamics and physics-based motion, gesture integration, 60fps animation. |
| `r3f-animation` | Enzed/r3f-skills | *(see 3D)* — animation **inside** the 3D scene: `useFrame`, GLTF clips, procedural motion. |

## SCROLL

| Skill | Source | When Claude should use it |
|---|---|---|
| `locomotive-scroll` | freshtechbro/claudedesignskills | Smooth scrolling, parallax, viewport detection, scroll-driven animation. |
| `scroll-reveal-libraries` | freshtechbro/claudedesignskills | Lightweight scroll-triggered reveals (AOS) for marketing/landing/content pages. |
| `gsap-scrolltrigger` | freshtechbro/claudedesignskills | *(see ANIMATION)* — the heavier, more controllable scroll option. |

## DEPLOYMENT

| Skill | Source | When Claude should use it |
|---|---|---|
| `deploy-to-vercel` | vercel-labs/agent-skills | Deploying the site to Vercel and returning a live link. **Outward-facing — confirm before deploying.** |

## 21ST.DEV

The 21st.dev platform group. All four shell out to the `21st` CLI (`@21st-dev/cli`).

| Skill | Source | When Claude should use it |
|---|---|---|
| `21st-cli-use` | 21st-dev/skill | Search / install / pull component and theme code from the catalog. |
| `21st-ai` | 21st-dev/skill | Generate and iterate on new UI from a prompt. |
| `21st-registry` | 21st-dev/skill | Publish, edit, unpublish your own components/themes/templates. |
| `21st-design-sync` | 21st-dev/skill | Read this project's Tailwind/shadcn tokens and publish them as a **public** 21st.dev theme. |

> **Requires authentication.** The `21st` CLI needs a `21st_sk_` API key / `21st login`. Without it these
> four skills cannot complete any action. **Never commit that key to this repository.**
>
> **`21st-registry` and `21st-design-sync` publish outward** — they push your components or your design
> tokens to a public/team library. Confirm intent before running either; they are not read-only.

---

## Notes on provenance

- Every skill was installed from a public source repo via the `skills` CLI and is pinned in
  `skills-lock.json` by source + content hash.
- No Anthropic-owned skills (e.g. `/mnt/skills/public/frontend-design`) were copied into this repository.
  `modern-web-design` is the publicly installable equivalent used instead.
- Installer security scans at install time: most skills clean. `21st-design-sync` and `21st-registry`
  carried a High Risk rating from one scanner (Snyk) — consistent with the fact that both publish content
  outward. `web-design-guidelines`, `vercel-optimize` and `r3f-loaders` carried Medium. Review before use.
