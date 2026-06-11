# DB Schema Foundation Implementation Plan

> For future Codex work: read related plans in `docs/plans/` before implementation. This plan extends the app foundation plan with the first persistence-ready schema slice.

**Goal:** Establish the initial Postgres schema foundation for Phase 1 and the later CV generation flow, with the core product rule that raw chat sessions are not the same thing as curated knowledge-base assets.

**Architecture:** `packages/db` owns the Drizzle schema and generated SQL migrations. Web and worker code should depend on domain/contracts for behavior and validation, then persist through repositories built on these tables.

**Tech stack:** TypeScript, Drizzle ORM, Drizzle Kit, Postgres, pgvector-compatible Postgres image from local Docker Compose.

**Reference docs:**
- Prior plan: `docs/plans/2026-06-11-app-foundation-v1.md`
- Architecture: `docs/solution-architecture.vi.md`
- TDD rule: `.codex/rules/tdd.md`

---

## Motivation

Phase 1 needs a durable model before real Google auth, onboarding persistence, chat persistence, file ingestion, and save-to-KB flows are connected. The schema needs to make privacy and source trace explicit from the start.

---

## Scope

This slice includes Drizzle table definitions, enum definitions, relations, schema tests, and the first generated SQL migration.

It intentionally excludes repository methods, live database integration tests, real OAuth/session persistence, file extraction workers, vector embeddings, and production migration execution.

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `packages/db/tsconfig.json` | Package-local TypeScript checking |
| `packages/db/drizzle.config.ts` | Drizzle Kit migration generation config |
| `packages/db/src/index.test.ts` | Schema invariant tests |
| `packages/db/migrations/` | Generated SQL migration and Drizzle metadata |

### Modified files

| Path | Change |
|---|---|
| `packages/db/src/index.ts` | Drizzle schema for users, auth, onboarding, sessions, KB, domains, documents, CV sessions, CV templates, and CV versions |
| `packages/db/package.json` | DB package scripts and dependencies |
| `docs/plans/INDEX.md` | Adds this plan to the plan index |

---

## Tasks

## Task 1: Schema Tables

**Files:**
- Modify: `packages/db/src/index.ts`
- Test: `packages/db/src/index.test.ts`

- [x] Add auth identity tables separate from profiles.
- [x] Add schema-driven onboarding forms and responses.
- [x] Add chat sessions with explicit KB selection state.
- [x] Add knowledge assets and facts sourced from sessions/documents.
- [x] Add domain pack, skill cluster, and question set tables.
- [x] Add CV generation sessions, templates, and versions.

**Verification:**
- `pnpm --filter @stories/db test`
- `pnpm --filter @stories/db typecheck`

## Task 2: Migration Generation

**Files:**
- Create: `packages/db/drizzle.config.ts`
- Create: `packages/db/migrations/`

- [x] Add Drizzle Kit config.
- [x] Generate the first SQL migration from the schema.
- [x] Inspect migration for `selected_for_knowledge_base`, `source_session_id`, and auth identity uniqueness.

**Verification:**
- `pnpm --filter @stories/db db:generate`

---

## Risks

- The first migration will likely change while repository methods and real auth/session flows are added.
- JSONB fields keep V1 flexible, but they should be tightened with contracts and repositories before production data accumulates.
- Source tracing exists structurally, but the UI and worker paths still need to populate it consistently.

---

## Verification

- `pnpm --filter @stories/db test`
- `pnpm --filter @stories/db typecheck`
- `pnpm --filter @stories/db db:generate`
- `pnpm typecheck`
- `pnpm test`

---

## Follow-ups

- Add repository methods with integration tests against local Postgres.
- Connect Google auth identities and first-login onboarding persistence.
- Add uploaded document extraction tables and worker repository methods.
- Add pgvector embedding columns once the extraction/search workflow is designed.
