# Superpowers Operating Model Adaptation Plan

> For future Codex work: read related plans in `docs/plans/` before implementation. Reference earlier plans when this plan continues, refines, or replaces earlier work.

**Goal:** Bring the useful parts of `obra/superpowers` into this repository as local, discoverable, validated agent workflows.

**Architecture:** Adapt Superpowers concepts into `.agents/skills/` instead of vendoring the full plugin. Keep repo rules in `AGENTS.md` and `.codex/rules`, attribution in `docs/third-party/`, and validation in `scripts/sync-codex-context.mjs`.

**Tech stack:** Markdown skills, Codex repo conventions, Node validation script, git worktrees.

**Reference docs:**
- Prior plan: `docs/plans/2026-06-11-app-foundation-v1.md`
- Upstream: `https://github.com/obra/superpowers`
- Attribution: `docs/third-party/superpowers.md`

---

## Motivation

Superpowers provides a useful agentic development methodology: skill selection, brainstorming, plan execution, subagent coordination, code review, verification, and branch finishing. Stories to CV already has many pieces of this model, but several workflows were missing or implicit.

---

## Scope

Included:

- Add repo-local skills for the missing Superpowers-inspired workflows.
- Keep existing `tdd`, `git-workflow`, `plan-writing`, and `debugging` skills as the canonical repo-specific versions.
- Add MIT attribution for upstream workflow ideas.
- Validate required skills through `scripts/sync-codex-context.mjs`.
- Update `AGENTS.md`, README, memory, and plan index.

Excluded:

- Installing the upstream Superpowers plugin globally.
- Adding harness-specific SessionStart hooks before confirming support in this repo's Codex runtime.
- Copying upstream skills verbatim.

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `.agents/skills/using-stories-to-cv-skills/SKILL.md` | Entry skill for selecting relevant repo-local workflows. |
| `.agents/skills/brainstorming-specs/SKILL.md` | Collaborative design/spec workflow before ambiguous product work. |
| `.agents/skills/executing-plans/SKILL.md` | Task-by-task execution of approved implementation plans. |
| `.agents/skills/subagent-driven-development/SKILL.md` | Coordination workflow for independent plan tasks with subagents. |
| `.agents/skills/dispatching-parallel-agents/SKILL.md` | Parallel investigation/delegation guidance. |
| `.agents/skills/requesting-code-review/SKILL.md` | Review request workflow. |
| `.agents/skills/receiving-code-review/SKILL.md` | Review feedback triage workflow. |
| `.agents/skills/verification-before-completion/SKILL.md` | Evidence gate before completion claims. |
| `.agents/skills/finishing-development-branch/SKILL.md` | Branch completion workflow. |
| `.agents/skills/skill-authoring/SKILL.md` | Repo-local skill creation and import workflow. |
| `docs/third-party/superpowers.md` | MIT attribution and adaptation note. |

### Modified files

| Path | Change |
|---|---|
| `AGENTS.md` | Add skill-selection workflow and new skill entry points. |
| `README.md` | Document the local agentic workflow. |
| `.codex/README.md` | Link local skills and attribution docs. |
| `.codex/memory/decisions.md` | Capture the operating-model decision. |
| `scripts/sync-codex-context.mjs` | Validate required skills and frontmatter. |
| `docs/plans/INDEX.md` | Add this plan. |

---

## Verification

- `node scripts/sync-codex-context.mjs`
- `pnpm lint`
- `git diff --check`

---

## Follow-ups

- Consider a `.codex-plugin/plugin.json` only if this operating model should be shared across repositories.
- Consider a SessionStart hook after confirming Codex App hook support and schema.
