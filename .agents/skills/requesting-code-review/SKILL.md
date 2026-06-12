---
name: requesting-code-review
description: |
  Use after completing a meaningful task, before merging, before PR handoff, or whenever a fresh review could catch regressions, missing tests, privacy issues, or architectural drift.
---

# Requesting Code Review

Get a focused review of the work product, not of the conversation.

## Process

1. Identify the review range:
   - base: `origin/main` or the commit before this task
   - head: current `HEAD`
2. Prepare a short review brief:
   - what changed
   - intended behavior
   - relevant plan/spec
   - verification already run
   - areas of concern
3. Use an available review mechanism:
   - subagent, if available
   - self-review with `git diff --stat` and `git diff`
   - PR review comments when working on GitHub
4. Triage findings:
   - Critical: fix immediately
   - Important: fix before handoff unless explicitly deferred
   - Minor: fix if cheap or document follow-up
5. Re-run relevant verification after fixes.

## Review Priorities

Privacy, data isolation, missing tests, behavior regressions, schema/contract mismatches, and operational blind spots outrank style preferences.
