---
name: debugging
description: |
  Use when triaging app failures, reading logs, checking background jobs,
  or investigating issues across local and deployed environments.
---

# Debugging

Approach:

1. Identify the failing boundary: UI, API, worker, DB, or provider.
2. Identify the environment: local, preview, staging, prod.
3. Inspect the closest source of truth first: browser trace, route response, worker log, DB record.
4. Reproduce locally if possible.
5. Turn the fix into a regression test.

Useful commands:

- `pnpm ops:logs -- --env local --service web --follow`
- `pnpm ops:logs -- --env staging --follow`
- `pnpm ops:verify -- staging`
