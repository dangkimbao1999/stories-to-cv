---
name: e2e-testing
description: |
  Use when writing, running, or debugging Playwright E2E tests for user-facing flows.
---

# E2E Testing

Guidelines:

- cover full user workflows, not component internals
- keep a smoke subset small and stable
- prefer deterministic seeded data
- use explicit waits and stable selectors
- debug failures with traces, screenshots, and logs before adding retries

Useful commands:

- `pnpm --filter @stories/e2e test`
- `pnpm --filter @stories/e2e test:headed`
- `pnpm --filter @stories/e2e test:debug`
