---
name: executing-plans
description: |
  Use when executing a written implementation plan in `docs/plans/` or another approved plan document, especially when the user says to continue or implement the plan.
---

# Executing Plans

Execute written plans task by task, with verification and status tracking.

## Process

1. Confirm you are in a feature worktree or create one through `git-workflow`.
2. Read the plan completely and compare it with current repo state.
3. Raise blockers or stale assumptions before editing.
4. Create/update a checklist with one active task at a time.
5. For each source change, use `tdd`: failing test, minimal implementation, refactor.
6. Run the verification listed in the plan. If missing, choose the smallest trustworthy command set.
7. Update the plan or memory if implementation changes durable repo knowledge.
8. Finish through `verification-before-completion` and `finishing-development-branch`.

## Stop Conditions

Stop and ask when the plan is impossible, ambiguous in a risky way, conflicts with privacy/security constraints, or verification repeatedly fails for an unknown reason.
