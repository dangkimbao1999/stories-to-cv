# E2E Rules

- Every important user workflow should eventually have Playwright coverage.
- Browser tests should verify behavior, not implementation details.
- Prefer stable selectors and deterministic setup data.
- No arbitrary sleeps when explicit waiting is possible.
- Keep a small smoke suite fast enough for CI on every push.
