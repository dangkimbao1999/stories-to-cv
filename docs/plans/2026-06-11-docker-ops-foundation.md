# Docker Ops Foundation Implementation Plan

> For future Codex work: read related plans in `docs/plans/` before implementation. This plan captures the first Docker workflow for local and server-style environments.

**Goal:** Make the full Stories to CV stack runnable through Docker Compose with consistent commands for local development and server-style deployment.

**Architecture:** A root `Dockerfile` provides shared Node/pnpm targets for development and production web/worker images. `docker-compose.yml` runs local dev services with bind mounts. `docker-compose.server.yml` overlays production targets and removes dev mounts. `scripts/ops/docker.mjs` is the canonical wrapper.

**Tech stack:** Docker, Docker Compose, Node.js 22, pnpm, Next.js, worker process, Postgres with pgvector.

**Reference docs:**
- Prior plan: `docs/plans/2026-06-11-app-foundation-v1.md`
- Schema plan: `docs/plans/2026-06-11-db-schema-foundation.md`
- Skill: `.agents/skills/docker-ops/SKILL.md`

---

## Motivation

The project needs a repeatable way to run web, worker, and Postgres together across local machines and a server without relying on hand-written shell commands.

---

## Scope

This slice includes Dockerfile targets, Compose services, a server overlay, package scripts, environment examples, and an agent skill.

It excludes production secret management, TLS/reverse proxy setup, image publishing, and server provisioning.

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `Dockerfile` | Shared dev/build/web/worker image targets |
| `.dockerignore` | Keeps local artifacts and secrets out of build context |
| `docker-compose.server.yml` | Server-style Compose overlay |
| `scripts/ops/docker.mjs` | Canonical Docker command wrapper |
| `.agents/skills/docker-ops/SKILL.md` | Agent workflow for Docker operations |

### Modified files

| Path | Change |
|---|---|
| `docker-compose.yml` | Adds web and worker services beside Postgres |
| `package.json` | Adds Docker ops scripts |
| `.codex/environments.example.json` | Adds docker-local and docker-server environment entries |
| `AGENTS.md` | Adds docker-ops skill entry point |
| `README.md` | Adds common Docker commands |

---

## Tasks

- [x] Add local Compose services for Postgres, web, and worker.
- [x] Add server Compose overlay using production image targets.
- [x] Add a Node-based Docker wrapper with `up`, `down`, `build`, `logs`, `ps`, and `restart`.
- [x] Add a repo-local Docker skill for agents.
- [x] Validate local and server Compose config.

---

## Risks

- Server mode still needs real environment variable management before production use.
- Docker image build could not be verified in this session because Docker Desktop was not running.
- Running local and server modes at the same time requires different `WEB_PORT` and `POSTGRES_PORT` values.

---

## Verification

- `pnpm ops:docker -- ps --print`
- `pnpm ops:docker -- up --env server --build --print`
- `docker compose config`
- `docker compose -f docker-compose.yml -f docker-compose.server.yml config`
- `pnpm typecheck`
- `pnpm test`

---

## Follow-ups

- Add server secret handling guidance once the target server provider is chosen.
- Add image publishing and pull-based server deploy when registry details exist.
- Add a reverse proxy/TLS plan for production hosting.
