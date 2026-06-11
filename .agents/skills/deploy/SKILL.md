---
name: deploy
description: |
  Safe deploy workflow with preflight checks and post-deploy verification.
---

# Deploy

Before deploy:

- confirm target environment
- run lint, typecheck, tests
- ensure credentials are loaded outside tracked files

Deploy flow:

1. `pnpm ops:deploy -- <env>`
2. `pnpm ops:verify -- <env>`
3. tail logs if verification is noisy
