---
name: start-dev
description: |
  Use when starting local development, creating a worktree, or preparing the repo for a new task.
---

# Start Development

Preferred sequence:

1. create a worktree with `codex/feat/...`, `codex/fix/...`, or `codex/chore/...`
2. install dependencies
3. start Postgres
4. run `pnpm dev:stack`
5. verify with `pnpm ops:verify -- local`
6. tail logs if startup looks wrong

Reference:

- `docs/guides/start-dev.vi.md`
