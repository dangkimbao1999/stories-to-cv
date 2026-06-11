# Commit And Draft PR Writing Guide

This guide defines how Codex should describe work in commits and draft PRs so future agents and humans can trace decisions quickly.

## Commit message rules

Use conventional commit style:

- `feat: ...`
- `fix: ...`
- `chore: ...`
- `refactor: ...`
- `test: ...`
- `docs: ...`

The subject should answer:

- what changed
- at what level

Examples:

- `feat: add knowledge-base session list shell`
- `fix: separate chat session selection from KB assets`
- `chore: bootstrap codex-first repo foundation`

Avoid:

- vague messages like `update stuff`
- messages that only name files
- messages that do not reflect the actual behavior change

When the reason is not obvious from the subject alone, add a short body that explains:

- why the change was needed
- any important constraint or trade-off
- links to the related plan or spec when useful

## What a draft PR summary should contain

Every draft PR opened by Codex should make it easy to understand:

1. what changed
2. why it changed
3. how it was verified
4. what is still left or risky

Recommended structure:

### Summary

Short paragraph or bullets describing the main changes.

### Why

Short explanation of the product or technical reason.

### Spec

Link the relevant spec when one exists.

### Plan

Link the relevant plan when one exists.

### Scope

- what is included
- what is intentionally not included

### Test plan

- concise list of the intended verification areas
- can be checkbox-style if helpful

### Verification

List exact commands that were run.

Example:

```text
Verification:
- pnpm typecheck
- pnpm test
- pnpm test:e2e
- node scripts/sync-codex-context.mjs
```

### Risks / follow-ups

- known limitations
- deferred work
- anything the reviewer should look at carefully

### References

- related plan
- related spec
- related runlog if one exists

This structure is adapted from the template's existing draft PR shape:

- `Summary`
- `Why`
- `Spec`
- `Plan`
- `Test plan`
- `Verification`
- `Risks / follow-ups`
- `References`

## Codex behavior rules

When Codex writes a commit or draft PR summary:

- state behavior changes explicitly
- mention important architectural or workflow changes
- include verification commands exactly when known
- mention if something could not be run
- avoid generic summaries like `various fixes`

## Example draft PR shape

```text
Summary
- Added the initial app shell and repo operating model
- Added worktree-first git workflow guidance
- Added planning, logging, and testing guides for Codex

Why
- We need a consistent development foundation before building product features

Spec
- docs/specs/<...>.md

Plan
- docs/plans/2026-06-11-app-foundation-v1.md

Scope
- Includes repo foundation and workflow docs
- Does not yet include full auth, database schema, or CV generation

Test plan
- Context validation
- Workflow docs review
- Script sanity checks

Verification
- node scripts/sync-codex-context.mjs
- node .codex/hooks/validate-monorepo.mjs

Risks / follow-ups
- pnpm-based checks were not run yet because dependencies are not installed

References
- docs/plans/2026-06-11-app-foundation-v1.md
```
