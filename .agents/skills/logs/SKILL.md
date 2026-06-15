---
name: logs
description: |
  Use when continuously tailing local or remote logs and extracting signal from them.
---

# Logs

Prefer the repo wrappers:

- `pnpm ops:logs -- --env local --service web --follow`
- `pnpm ops:logs -- --env local --service worker --follow`

When watching logs:

- anchor on identifiers
- summarize deltas over time
- separate expected warnings from actionable errors
- report the command, service, timestamp, and shortest useful error excerpt
