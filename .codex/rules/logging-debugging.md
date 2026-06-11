# Logging and Debugging Rules

- Local logs should be easy to tail and kept in `.codex/logs/`.
- Important backend flows should log stable identifiers like `user_id`, `conversation_id`, `job_description_id`, or `cv_version_id`.
- Prefer structured logs over ad-hoc console dumping.
- Debug from symptoms to boundary to root cause: UI, API, worker, database, provider.
- Capture recurring debugging knowledge in `.codex/memory/bugs.md`.
