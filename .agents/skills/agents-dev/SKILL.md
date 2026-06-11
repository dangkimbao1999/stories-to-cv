---
name: agents-dev
description: |
  Use when creating or updating repo-local agents, skills, rules, hooks, or
  operating model docs for Codex in this repository.
---

# Agents Dev

When changing the agentic coding system in this repo:

1. Update the relevant file under `.codex/agents/`, `.agents/skills/`, `.codex/rules/`, or `.codex/memory/`.
2. Keep AGENTS.md aligned with the new workflow.
3. Prefer simple Node-based scripts in `scripts/ops/` over shell-specific automation.
4. Add or update verification so the repo can detect missing operating-model files.
