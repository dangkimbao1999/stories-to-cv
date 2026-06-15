# Local Development Rules

- Start the local app through repo scripts: `pnpm dev:stack` or `pnpm ops:run -- --env local`.
- Prefer the log wrapper when monitoring issues: `pnpm ops:logs -- --env local --service web --follow`.
- Use `--service worker` when monitoring ingestion, extraction, research, or export jobs.
- Keep local logs in `.codex/logs/` when scripts write log files.
- When reporting an issue, include the failing command, service name, timestamp, and the smallest useful log excerpt.
