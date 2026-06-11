# Decisions

# 2026-06-11 V1 foundation auth and AI behavior

- Web auth uses Auth.js/NextAuth with Google provider scaffolding. When `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are absent, the login route keeps a deterministic development/test redirect to onboarding so local and E2E flows do not require real OAuth credentials.
- Conversation summaries and CV generation use deterministic domain helpers for now. Future AI orchestration should replace the helper internals while preserving the typed inputs/outputs and tests.
