---
name: subagent-driven-development
description: |
  Use when executing an approved plan with independent tasks and subagent tools are available; coordinates fresh agents, reviews their output, and integrates only verified work.
---

# Subagent-Driven Development

Use fresh, scoped agents for independent tasks while the current session coordinates quality and integration.

## Use When

- A written plan exists.
- Tasks are independent enough to avoid shared edit conflicts.
- Subagent tooling is available in the current environment.
- The work benefits from isolated context or parallel review.

## Process

1. Split the plan into independent task packets with explicit files, goals, constraints, and verification.
2. Give each subagent only the context it needs: plan section, relevant paths, repo rules, and expected output.
3. Ask subagents to avoid unrelated refactors and to report exact files changed plus verification.
4. Review each result before integration:
   - Does it satisfy the task?
   - Did it follow TDD and repo boundaries?
   - Are there conflicts or hidden assumptions?
5. Run local verification yourself; never trust only a subagent report.
6. Commit only after the integrated diff passes the repo's checks.

## Fallback

If subagents are not available or tasks are tightly coupled, use `executing-plans` in the current session.
