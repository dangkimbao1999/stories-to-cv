---
name: ci
description: |
  Use when creating or maintaining CI pipelines, preflight checks, or local-to-CI command parity.
---

# CI

Rules:

- every CI check should have a local equivalent command
- keep default CI fast and meaningful
- separate slower E2E checks when needed
- treat flaky CI as broken engineering infrastructure

Primary local check:

- `pnpm ops:ci`
