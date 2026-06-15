# Stories to CV Agent Guide

## Project

This repository is a Codex-first monorepo for an AI product that helps users build a private career knowledge base and generate job-targeted CVs from it.

For the current phase, keep the agent operating model small. Use only the rules, skills, and agents needed for:

- TDD
- git branches and worktrees
- local development startup
- local log monitoring

## Canonical directories

- `.agents/skills/` contains the active repo-local workflow guides.
- `.codex/agents/` contains the active focused agent prompts.
- `.codex/rules/` contains mandatory repo rules.
- `.codex/worktrees/` is the default location for additional git worktrees.
- `scripts/ops/` contains local run, log, verify, and worktree utilities.

## Core product constraints

- User privacy is a product requirement, not a later add-on.
- The source of truth is the user's personal knowledge base, not the generated CV.
- Domain language should live in shared packages so both humans and agents operate on the same concepts.
- Start lean. Avoid microservices, distributed queues, or separate APIs unless there is a clear operational need.

## Monorepo boundaries

- `apps/web` owns UI, authenticated product flows, and synchronous user-facing requests.
- `apps/worker` owns long-running ingestion, extraction, research, and export jobs.
- `packages/domain` owns business concepts, shared workflows, and ubiquitous language.
- `packages/contracts` owns typed boundaries, zod schemas, and request-response contracts.
- `packages/db` owns schema, repositories, and data access helpers.
- `packages/ai` owns prompts, evaluators, structured output parsers, and orchestration logic.
- `packages/security` owns consent, redaction, audit, and data handling policies.
- `packages/ui` owns presentational primitives shared inside the product.

## Mandatory Engineering Rules

- Follow red/green/refactor for every source change. See `.codex/rules/tdd.md`.
- Before starting a new feature, fetch the latest `main` from origin.
- Create a new worktree from the latest `origin/main` for every new feature or fix. See `.codex/rules/git-worktrees.md`.
- Never commit directly to `main`.
- Use branch names shaped like `codex/feat/<slug>`, `codex/fix/<slug>`, or `codex/chore/<slug>`.
- Run focused tests during development and relevant checks before commit.
- Use local run and log wrappers when starting or monitoring the app. See `.codex/rules/local-development.md`.
- Before pushing a branch, fetch `origin/main` and rebase on it.
- Treat transcripts, uploads, job descriptions, generated CVs, and conversation history as sensitive data.

## Standard Workflow

1. Fetch latest main: `git fetch origin main`.
2. Create a worktree from `origin/main`: `pnpm ops:worktree:create -- codex/feat/<slug>`.
3. Enter the worktree and use TDD: write or tighten a failing test, implement the minimum change, refactor while green.
4. Start local services with `pnpm dev:stack` or `pnpm ops:run -- --env local`.
5. Monitor logs with `pnpm ops:logs -- --env local --service web --follow` or `pnpm ops:logs -- --env local --service worker --follow`.
6. Run focused tests and relevant verification before commit.
7. Review the diff, stage explicit files, and commit on the feature branch.
8. Before pushing, run `git fetch origin main` and `git rebase origin/main`.

## Active Skills

- `.agents/skills/tdd/SKILL.md`
- `.agents/skills/git-workflow/SKILL.md`
- `.agents/skills/start-dev/SKILL.md`
- `.agents/skills/logs/SKILL.md`

## Active Agents

- `.codex/agents/test-police.md`
- `.codex/agents/git-worktree-police.md`
- `.codex/agents/run-operator.md`
- `.codex/agents/log-watcher.md`
