# 2026-06-12 LLM Provider Foundation

## Decision

LLM orchestration must not be coupled directly to OpenAI environment variables. New AI code should use `packages/ai` and its provider-neutral config.

## Environment contract

- `LLM_PROVIDER`: `custom`, `openai`, or `openrouter`
- `LLM_BASE_URL`: OpenAI-compatible API base URL
- `LLM_API_KEY`: provider token, optional for local gateways
- `LLM_MODEL`: provider model identifier
- `LLM_HEADERS`: JSON object of additional request headers

Legacy `OPENAI_*` variables remain compatibility fallbacks only.

## Operational notes

Docker local defaults use `http://host.docker.internal:11434/v1` so a host machine LLM gateway can be used from containers. Worker bootstrap logs emit only redacted provider metadata: provider id, base URL, model, whether an API key exists, and header names.

Runtime LLM calls should use `createLlmLanguageModel()` from `@stories/ai`. It creates a Vercel AI SDK OpenAI-compatible chat model from the resolved provider config, so product code does not need to know whether the backing endpoint is local, private, OpenRouter, or OpenAI.

## Next steps

- Wire deterministic domain helpers to real `generateText` or structured-output calls through `createLlmLanguageModel()` when generation moves into `packages/ai`.
- Add provider-specific smoke tests once a stable local or hosted test gateway is chosen.
