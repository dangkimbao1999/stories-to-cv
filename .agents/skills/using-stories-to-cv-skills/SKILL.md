---
name: using-stories-to-cv-skills
description: |
  Use at the start of repository work and before clarifying questions, planning, implementation, debugging, review, verification, or branch completion to select the relevant repo-local skills and follow them deliberately.
---

# Using Stories to CV Skills

This repository has a local operating model. Before acting, scan the available skill names and choose the ones that apply.

## Rule

If a skill plausibly applies, use it before doing the work. If a skill turns out not to fit, say so briefly and continue with the better match.

## Selection Guide

- New idea or unclear product change: `brainstorming-specs`
- Non-trivial implementation plan: `plan-writing`
- Execute an existing plan: `executing-plans`
- Independent plan tasks with subagent support: `subagent-driven-development`
- Multiple independent investigations or fixes: `dispatching-parallel-agents`
- Source behavior change: `tdd`
- User-facing behavior: `e2e-testing`
- Bug triage or logs: `debugging`, `investigation`, `logs`
- Branch/worktree operations: `git-workflow`
- Before claiming completion: `verification-before-completion`
- Before merge/PR handoff: `finishing-development-branch`
- Requesting or handling review: `requesting-code-review`, `receiving-code-review`
- Creating or changing skills/agents/rules: `agents-dev`, `skill-authoring`

## Process

1. Identify the task type and current repo state.
2. Announce the selected skill or skills in one short line.
3. Load only the selected skill bodies and directly referenced files.
4. Follow repo rules in `AGENTS.md` when skills conflict with generic habits.
5. Keep skill use practical: the point is better work, not ceremony.
