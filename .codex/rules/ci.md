# CI Rules

- CI should mirror the minimum local quality bar.
- Keep the default CI pipeline fast enough to run on every branch push.
- Split heavier E2E or deploy verification into separate jobs when needed.
- A broken CI step should correspond to a command developers can run locally.
