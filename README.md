# Stories to CV

Monorepo scaffold for a conversation-first career knowledge base and CV generation product.

This repo is intentionally small. The goal is to move fast with a team and with coding agents, while keeping a clean domain model, clear package boundaries, and a path to scale later.

## Recommended setup

1. Install Node.js 22+.
2. Enable Corepack: `corepack enable`
3. Activate pnpm: `corepack prepare pnpm@10.12.4 --activate`
4. Install dependencies: `pnpm install`
5. Start local Postgres: `docker compose up -d postgres`
6. Copy `.codex/environments.example.json` to `.codex/environments.json` and fill in real environment commands if needed

## Standard commands

- `pnpm dev:stack`
- `pnpm ops:docker -- up --build`
- `pnpm ops:docker -- logs --follow`
- `pnpm ops:docker -- logs web --follow --tail 80 --timestamps`
- `pnpm ops:logs -- --env local --service web --follow`
- `pnpm ops:verify -- local`
- `pnpm ops:verify -- docker-local`
- `pnpm ops:ci`
- `pnpm ops:worktree:create -- codex/feat/my-task`
- `pnpm test:e2e`

## LLM provider

The product uses `packages/ai` for provider-neutral LLM configuration. Prefer `LLM_*` variables for new work:

- `LLM_PROVIDER=custom`
- `LLM_BASE_URL=http://localhost:11434/v1`
- `LLM_API_KEY=`
- `LLM_MODEL=llama3.1`
- `LLM_HEADERS=`

`OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL` remain as compatibility fallbacks only. Docker defaults point `LLM_BASE_URL` at `http://host.docker.internal:11434/v1` so a local OpenAI-compatible server such as Ollama, vLLM, LiteLLM, or a private gateway can be used without changing product code.

Runtime model creation should go through `createLlmProviderConfig()` and `createLlmLanguageModel()` from `@stories/ai`. The model factory uses the Vercel AI SDK OpenAI-compatible provider, so custom gateways only need an OpenAI-compatible `/v1` API surface.

## Agentic workflow

This repo keeps a Codex-first operating model in `.agents/skills`, `.codex/agents`, `.codex/rules`, and `scripts/ops`.

The local skill library includes Superpowers-inspired workflows adapted for Stories to CV: skill selection, brainstorming/specs, plan execution, subagent coordination, code review, verification gates, and branch finishing. Start with `.agents/skills/using-stories-to-cv-skills/SKILL.md` when deciding how Codex should approach a task.

Attribution for the upstream workflow ideas is recorded in `docs/third-party/superpowers.md`.

## Monorepo layout

```text
apps/
  web/        Next.js product app
  worker/     background jobs for ingestion, extraction, research, export
packages/
  ai/         prompts, orchestrators, evaluations
  contracts/  zod schemas and typed boundaries
  db/         schema, migrations, repositories
  domain/     business language and use cases
  security/   consent, redaction, privacy helpers
  ui/         shared UI building blocks
docs/
  *.md        product, PRD, architecture
.codex/
  hooks/      Codex-specific local repo automation
.agents/
  skills/     repo-local agent workflows
```

## Default architecture direction

- `apps/web`: Next.js App Router, dashboard, chat, knowledge base editor, CV editor
- `apps/worker`: async ingestion and generation jobs
- `packages/domain`: shared business primitives
- `packages/ai`: AI orchestration without coupling prompt logic to UI or database
- `packages/db`: Postgres + pgvector data access
- `packages/security`: privacy and consent logic shared across web and worker

See [docs/solution-architecture.vi.md](C:\Users\dangk\Documents\stories-to-cv\docs\solution-architecture.vi.md) for the full recommendation.
See [docs/agentic-development-flow.vi.md](C:\Users\dangk\Documents\stories-to-cv\docs\agentic-development-flow.vi.md) for the repo workflow.
See [docs/guides/start-dev.vi.md](C:\Users\dangk\Documents\stories-to-cv\docs\guides\start-dev.vi.md) for the day-1 developer flow.
