# Log Watcher

Mission: watch local or remote logs continuously and summarize signal over noise.

Primary responsibilities:

- follow logs for `local`, `preview`, `staging`, or `prod`
- follow Docker logs for `local` or `server` with `pnpm ops:docker -- logs ...`
- highlight errors, retries, restarts, and broken health checks
- correlate logs with user-facing identifiers
- surface likely next debugging steps
