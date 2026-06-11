# Deploy Rules

- Treat deploy as a verified workflow, not a shell one-liner.
- Run lint, typecheck, tests, and environment verification before deploy.
- Verify the target environment explicitly after deploy.
- Prefer scripted deploy commands configured in `.codex/environments.json`.
- Keep deploy credentials out of tracked files.
