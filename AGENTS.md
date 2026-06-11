# Stories to CV Agent Guide

## Project

This repository is a Codex-first monorepo for an AI product that helps users build a private career knowledge base and generate job-targeted CVs from it.

The repo is intentionally small, but the workflow should already be disciplined:

- TDD by default
- E2E coverage for user-facing flows
- worktree-based git workflow
- clear environment and deployment procedures
- explicit memory and decision capture
- privacy and auditability as product-level constraints

## Canonical directories

- `.codex/agents/` contains role prompts for focused Codex sub-agents
- `.agents/skills/` contains reusable workflow guides
- `.codex/rules/` contains repository rules and guardrails
- `.codex/memory/` contains durable project memory
- `.codex/worktrees/` is the default location for additional git worktrees
- `scripts/ops/` contains run, logs, deploy, verify, CI, and worktree utilities
- `tests/e2e/` contains Playwright end-to-end tests
- `docs/plans/` contains the execution history of the project and must be reviewed before starting non-trivial feature work

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
- `tests/e2e` owns browser-level end-to-end coverage.

## Mandatory engineering rules

- Follow red/green/refactor for every source change. See `.codex/rules/tdd.md`.
- Keep user-facing flows E2E testable and add Playwright coverage for major scenarios. See `.codex/rules/e2e.md`.
- Use a feature branch or worktree. Never commit directly to `main`. See `.codex/rules/git-worktrees.md`.
- For any new feature, create a new worktree first and implement the feature inside that worktree.
- Use branch names shaped like `codex/feat/<slug>`, `codex/fix/<slug>`, or `codex/chore/<slug>` unless the task truly needs another class.
- Prefer local verification before commit: lint, typecheck, focused unit tests, relevant E2E checks.
- Review your own diff before commit and before push.
- Rebase on the latest remote branch before push when upstream has moved, and re-run verification after resolving conflicts.
- Capture important architectural decisions or recurring bugs in `.codex/memory/`.
- Treat transcripts, uploads, and generated CV data as sensitive.
- New backend and worker flows should emit structured logs with stable identifiers so Codex can investigate failures quickly.

## Default stack

- Workspace: `pnpm` + `turbo`
- Frontend: `Next.js`
- Database: `Postgres` + `pgvector`
- Async jobs: `pg-boss` in `apps/worker`
- AI SDK: Vercel `ai` SDK with structured outputs
- Observability: `Sentry` + `PostHog`
- E2E: `Playwright`

## Standard workflow

1. Create or enter a worktree for the task.
2. Read the relevant rules or skills before making non-trivial changes.
3. Review related files in `docs/plans/` so new work builds on previous decisions instead of rediscovering them.
4. Write failing tests first.
5. Implement the minimum change to pass.
6. Run local verification.
7. Update memory when the task changes how the repo should be understood.
8. Add or update a plan in `docs/plans/` when the task is non-trivial.
9. Review the diff before commit.
10. Stage explicit files only.
11. Commit with a clear message after checks pass.
12. Rebase before push when the remote branch or base branch has moved.
13. Review the final diff before push.

## Useful skill entry points

- `.agents/skills/tdd/SKILL.md`
- `.agents/skills/e2e-testing/SKILL.md`
- `.agents/skills/debugging/SKILL.md`
- `.agents/skills/git-workflow/SKILL.md`
- `.agents/skills/multi-env-dev/SKILL.md`
- `.agents/skills/deploy/SKILL.md`
- `.agents/skills/ci/SKILL.md`
- `.agents/skills/memory/SKILL.md`
- `.agents/skills/start-dev/SKILL.md`
- `.agents/skills/investigation/SKILL.md`
- `.agents/skills/plan-writing/SKILL.md`

## Security expectations

- Private user data must stay isolated per user.
- Do not move private user data into shared public knowledge packs.
- Prefer explicit consent and auditability over hidden automation.
- Treat imported resumes, job descriptions, and conversation history as sensitive data.
