# Decisions

# 2026-06-11 V1 foundation auth and AI behavior

- Web auth uses Auth.js/NextAuth with Google provider scaffolding. When `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are absent, the login route keeps a deterministic development/test redirect to onboarding so local and E2E flows do not require real OAuth credentials.
- Conversation summaries and CV generation use deterministic domain helpers for now. Future AI orchestration should replace the helper internals while preserving the typed inputs/outputs and tests.

# 2026-06-12 LLM provider abstraction

- AI orchestration should read model/provider settings through `packages/ai` and `LLM_*` environment variables. `OPENAI_*` variables are compatibility fallbacks only.
- The default provider is `custom`, using an OpenAI-compatible base URL so local gateways, private hosted gateways, Ollama, vLLM, LiteLLM, OpenRouter, or future provider adapters can be swapped without changing product flows.
- Runtime LLM calls should use `createLlmLanguageModel()` from `@stories/ai`, which wraps the Vercel AI SDK OpenAI-compatible provider.

## 2026-06-12 Superpowers-inspired operating model

- The repo adapts selected workflow ideas from `obra/superpowers` as repo-local `.agents/skills` rather than installing a global plugin.
- Imported workflows are rewritten around Stories to CV conventions: worktree-first development, `docs/plans`, TDD, privacy constraints, pnpm/turbo verification, and draft PRs.
- `scripts/sync-codex-context.mjs` validates that required operating-model skills remain present.
