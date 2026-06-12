---
name: skill-authoring
description: |
  Use when creating, importing, adapting, or reviewing repo-local skills, agents, rules, or operating-model docs; emphasizes concise skills, validation, and attribution.
---

# Skill Authoring

Create skills that future agents can actually use.

## Process

1. Check whether an existing skill should be updated instead of creating a duplicate.
2. Keep `SKILL.md` concise and procedural.
3. Put trigger conditions in the YAML `description`, not only in the body.
4. Use references or scripts only when they reduce repeated work or context load.
5. Align `AGENTS.md`, `.codex/rules`, and docs when the workflow changes.
6. Add validation when the operating model gains required files.
7. Run `node scripts/sync-codex-context.mjs` before completion.

## Importing Third-Party Workflow Ideas

- Read the source license first.
- Prefer adaptation over large verbatim copies.
- Preserve attribution when ideas or text are derived from an external project.
- Keep names repo-specific when direct upstream names would create confusion.

## Quality Bar

A good skill tells a capable agent what to do differently in this repo. It should not restate generic software advice unless the repo depends on that behavior.
