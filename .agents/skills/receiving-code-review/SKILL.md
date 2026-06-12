---
name: receiving-code-review
description: |
  Use when handling review feedback from the user, a reviewer, CI, a subagent, or PR comments; verify feedback against the codebase before implementing it.
---

# Receiving Code Review

Treat review as technical evidence to evaluate, not as a script to obey blindly.

## Process

1. Read all feedback before editing.
2. Restate unclear items or ask for clarification.
3. Verify each point against current code and tests.
4. Decide per item:
   - implement
   - push back with technical reasoning
   - defer with an explicit follow-up
5. Make changes one item at a time when possible.
6. Run focused verification after each meaningful fix, then final relevant checks.

## Guardrails

- Do not implement unclear feedback by guessing.
- Do not praise feedback performatively; respond with technical action.
- Do not mix unrelated refactors into review fixes.
- Preserve user data privacy and auditability even when reviewers focus on other concerns.
