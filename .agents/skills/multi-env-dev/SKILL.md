---
name: multi-env-dev
description: |
  Use when running, verifying, tailing logs, or deploying across local,
  preview, staging, and production environments.
---

# Multi-Environment Development

Environment command sources live in `.codex/environments.json`.

Typical flow:

1. Configure local and remote commands from `.codex/environments.example.json`.
2. Start local services with `pnpm dev:stack`.
3. Tail logs with `pnpm ops:logs`.
4. Verify health with `pnpm ops:verify`.
5. Deploy only through `pnpm ops:deploy`.
