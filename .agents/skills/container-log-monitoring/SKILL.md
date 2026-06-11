---
name: container-log-monitoring
description: |
  Use when monitoring Docker container logs to debug web, worker, or database issues on localhost or server-style environments.
---

# Container Log Monitoring

Use this skill when the task involves debugging containerized services, watching Compose logs, comparing local and server behavior, or diagnosing startup/runtime failures from container output.

## Environments

- Local containers use `pnpm ops:docker -- ...` with the default `local` environment.
- Server-style containers use `pnpm ops:docker -- ... --env server`.
- Prefer the wrapper over raw `docker compose` so project names and compose files stay consistent.

## Quick Checks

Local:

- Show containers: `pnpm ops:docker -- ps`
- Recent logs: `pnpm ops:docker -- logs --tail 120 --timestamps`
- Follow all logs: `pnpm ops:docker -- logs --follow --tail 80 --timestamps`
- Follow web logs: `pnpm ops:docker -- logs web --follow --tail 80 --timestamps`
- Follow worker logs: `pnpm ops:docker -- logs worker --follow --tail 80 --timestamps`
- Follow database logs: `pnpm ops:docker -- logs postgres --follow --tail 80 --timestamps`

Server-style:

- Show containers: `pnpm ops:docker -- ps --env server`
- Recent logs: `pnpm ops:docker -- logs --env server --tail 120 --timestamps`
- Follow all logs: `pnpm ops:docker -- logs --env server --follow --tail 80 --timestamps`
- Follow web logs: `pnpm ops:docker -- logs web --env server --follow --tail 80 --timestamps`
- Follow worker logs: `pnpm ops:docker -- logs worker --env server --follow --tail 80 --timestamps`
- Follow database logs: `pnpm ops:docker -- logs postgres --env server --follow --tail 80 --timestamps`

## Debugging Loop

1. Run `ps` first to see whether containers are created, running, restarting, or exited.
2. Read recent logs with `--tail 120 --timestamps`.
3. If the failure is still active, follow only the noisy boundary: `web`, `worker`, or `postgres`.
4. Correlate timestamps with the user's action or the failed health check.
5. Separate expected startup noise from actionable errors.
6. After changing code or config, restart only the affected service when possible: `pnpm ops:docker -- restart web`.
7. Verify with `pnpm ops:verify -- docker-local` or the configured server verify command.

## Signals To Extract

- Web: Next.js compile failures, route errors, missing env vars, failed DB connections, hydration/runtime exceptions.
- Worker: job startup failures, pg-boss connection errors, retries, extraction/export exceptions.
- Postgres: failed health checks, auth failures, migration errors, connection saturation, volume permission issues.

## Safety

- Treat logs as sensitive. Do not paste secrets, tokens, full user transcripts, resumes, job descriptions, or generated CV content into summaries.
- Summarize sensitive log lines by category and stable identifiers.
- Do not run `down --volumes` unless the user explicitly approves deleting local/server database volume data.
- On server environments, do not restart all services before checking whether a narrower service restart is enough.
