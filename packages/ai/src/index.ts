import type { OpenAICompatibleProvider, OpenAICompatibleProviderSettings } from "@ai-sdk/openai-compatible";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

export const llmProviderIds = ["custom", "openai", "openrouter"] as const;

export type LlmProviderId = (typeof llmProviderIds)[number];

export type LlmProviderConfig = {
  provider: LlmProviderId;
  apiKey: string;
  baseUrl: string;
  model: string;
  headers: Record<string, string>;
};

export type RedactedLlmProviderConfig = {
  provider: LlmProviderId;
  baseUrl: string;
  model: string;
  hasApiKey: boolean;
  headers: string[];
};

type LlmProviderEnv = Partial<Record<string, string | undefined>>;

export type LlmLanguageModel = ReturnType<OpenAICompatibleProvider<string, string, string, string>["chatModel"]>;

type LlmCompatibleProviderFactory<TModel = LlmLanguageModel> = (settings: OpenAICompatibleProviderSettings) => {
  chatModel: (modelId: string) => TModel;
};

const providerDefaults = {
  custom: {
    baseUrl: "http://localhost:11434/v1",
    model: "llama3.1",
  },
  openai: {
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4.1-mini",
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    model: "openai/gpt-4.1-mini",
  },
} as const satisfies Record<LlmProviderId, { baseUrl: string; model: string }>;

const providerSchema = z.enum(llmProviderIds);
const headersSchema = z.record(z.string(), z.string());

export function createLlmProviderConfig(env: LlmProviderEnv = process.env): LlmProviderConfig {
  const provider = resolveProvider(env);
  const defaults = providerDefaults[provider];

  return {
    provider,
    apiKey: readFirst(env, "LLM_API_KEY", "OPENAI_API_KEY") ?? "",
    baseUrl: readFirst(env, "LLM_BASE_URL", "OPENAI_BASE_URL") ?? defaults.baseUrl,
    model: readFirst(env, "LLM_MODEL", "OPENAI_MODEL") ?? defaults.model,
    headers: parseHeaders(env.LLM_HEADERS),
  };
}

export function redactLlmProviderConfig(config: LlmProviderConfig): RedactedLlmProviderConfig {
  return {
    provider: config.provider,
    baseUrl: config.baseUrl,
    model: config.model,
    hasApiKey: config.apiKey.length > 0,
    headers: Object.keys(config.headers).sort(),
  };
}

export function createLlmLanguageModel<TModel>(
  config: LlmProviderConfig,
  createProvider: LlmCompatibleProviderFactory<TModel>,
): TModel;
export function createLlmLanguageModel(config?: LlmProviderConfig): LlmLanguageModel;
export function createLlmLanguageModel(
  config: LlmProviderConfig = createLlmProviderConfig(),
  createProvider: LlmCompatibleProviderFactory<unknown> = createOpenAICompatible,
): unknown {
  const provider = createProvider({
    name: config.provider,
    apiKey: config.apiKey || undefined,
    baseURL: config.baseUrl,
    headers: config.headers,
  });

  return provider.chatModel(config.model);
}

function resolveProvider(env: LlmProviderEnv): LlmProviderId {
  const requestedProvider = env.LLM_PROVIDER?.trim();

  if (requestedProvider) {
    return providerSchema.parse(requestedProvider);
  }

  if (env.LLM_BASE_URL?.trim() || env.LLM_API_KEY?.trim() || env.LLM_MODEL?.trim()) {
    return "custom";
  }

  if (env.OPENAI_API_KEY?.trim() || env.OPENAI_BASE_URL?.trim() || env.OPENAI_MODEL?.trim()) {
    return "openai";
  }

  return "custom";
}

function parseHeaders(headersJson: string | undefined): Record<string, string> {
  if (!headersJson?.trim()) {
    return {};
  }

  return headersSchema.parse(JSON.parse(headersJson));
}

function readFirst(env: LlmProviderEnv, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) {
      return value;
    }
  }

  return undefined;
}
