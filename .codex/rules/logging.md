# Logging Rules

- Backend and worker code should use structured logs, not ad-hoc `console.log`.
- Every important flow should log stable identifiers where available:
  - `user_id`
  - `conversation_id`
  - `job_description_id`
  - `cv_version_id`
  - `worker_job_id`
- Log at boundaries: request start/end, job start/end, provider calls, retries, failures, and important state transitions.
- Prefer logs that help investigate a failure later over verbose noise that says little.
- New features that are hard to debug without logs are incomplete.
