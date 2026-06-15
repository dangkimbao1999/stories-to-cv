---
name: start-dev
description: |
  Use when starting local development, creating a worktree, or preparing the repo for a new task.
---

# Start Development

Preferred sequence:

1. fetch latest main with `git fetch origin main`
2. create a worktree with `pnpm ops:worktree:create -- codex/feat/<slug>`
3. enter the worktree
4. install dependencies if needed with `pnpm install`
5. start local services with `pnpm dev:stack` or `pnpm ops:run -- --env local`
6. verify with `pnpm ops:verify -- local`
7. tail logs if startup looks wrong

Reference:

- `docs/guides/start-dev.vi.md`
