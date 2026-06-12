---
name: verification-before-completion
description: |
  Use before saying work is done, fixed, passing, ready, committed, pushed, or PR-ready; requires fresh evidence from commands, tests, builds, or inspected outputs.
---

# Verification Before Completion

Make completion claims only after evidence.

## Process

1. Identify the claim you are about to make.
2. Choose the command or inspection that proves it.
3. Run the command fresh in the relevant workspace.
4. Read the exit code and important output.
5. Report the actual result:
   - pass with command names
   - fail with the blocking error
   - not run with the reason

## Typical Command Set

- Source package change: focused tests, `pnpm typecheck`
- Cross-package change: `pnpm lint`, `pnpm typecheck`, `pnpm test`
- Web/user-facing change: relevant Playwright E2E
- Build/runtime change: `pnpm build`
- Docker change: `docker compose config`, and daemon-backed commands when Docker is running
- Operating-model change: `node scripts/sync-codex-context.mjs`

## Rule

Do not use "done", "fixed", "green", "ready", or similar wording unless the evidence is current and named.
