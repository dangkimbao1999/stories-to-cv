---
name: docker-ops
description: |
  Use when building, running, verifying, or debugging the Dockerized Stories to CV stack locally or on a server.
---

# Docker Ops

Use this skill when the task involves Docker, Compose, local container runs, server container runs, or environment parity.

## Modes

- Local dev mode uses `docker-compose.yml`.
- Server mode uses `docker-compose.yml` plus `docker-compose.server.yml`.
- Always prefer the Node wrapper `pnpm ops:docker` so local and server commands stay consistent.

## Standard Commands

Local:

- Start all services: `pnpm ops:docker -- up --build`
- Show services: `pnpm ops:docker -- ps`
- Tail logs: `pnpm ops:docker -- logs --follow`
- Tail recent logs with timestamps: `pnpm ops:docker -- logs --tail 120 --timestamps`
- Tail one service: `pnpm ops:docker -- logs web --follow --tail 80 --timestamps`
- Stop services: `pnpm ops:docker -- down`

Server-style:

- Build images: `pnpm ops:docker -- build --env server`
- Start all services: `pnpm ops:docker -- up --env server --build`
- Tail logs: `pnpm ops:docker -- logs --env server --follow`
- Tail one service: `pnpm ops:docker -- logs web --env server --follow --tail 80 --timestamps`
- Stop services: `pnpm ops:docker -- down --env server`

## Verification

Before claiming Docker changes are done, run:

1. `pnpm ops:docker -- ps --print`
2. `docker compose config`
3. `docker compose -f docker-compose.yml -f docker-compose.server.yml config`
4. `pnpm typecheck`
5. `pnpm test`

When Docker is available and time allows, also run:

1. `pnpm ops:docker -- up --build`
2. `pnpm ops:verify -- docker-local`
3. `pnpm ops:docker -- logs web`

## Safety

- Do not run `down --volumes` unless the user explicitly approves deleting local database volume data.
- Treat `.env` values and server logs as sensitive.
- Keep server credentials out of committed Compose files; pass them through environment variables.
