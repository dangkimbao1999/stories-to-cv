import { describe, expect, it } from "vitest";
import {
  buildIndustryAwareConversationBrief,
  createLlmLanguageModel,
  createLlmProviderConfig,
  industryAwareCareerAssistantPolicy,
  redactLlmProviderConfig,
} from "./index";

describe("LLM provider config", () => {
  it("defaults to a custom OpenAI-compatible endpoint instead of binding product code to OpenAI", () => {
    const config = createLlmProviderConfig({
      LLM_API_KEY: "local-key",
      LLM_BASE_URL: "https://llm.internal.example/v1",
      LLM_MODEL: "career-writer-v1",
    });

    expect(config).toEqual({
      provider: "custom",
      apiKey: "local-key",
      baseUrl: "https://llm.internal.example/v1",
      model: "career-writer-v1",
      headers: {},
    });
  });

  it("supports named hosted providers when selected explicitly", () => {
    const config = createLlmProviderConfig({
      LLM_PROVIDER: "openrouter",
      LLM_API_KEY: "router-key",
      LLM_MODEL: "anthropic/claude-3.5-sonnet",
    });

    expect(config.provider).toBe("openrouter");
    expect(config.baseUrl).toBe("https://openrouter.ai/api/v1");
    expect(config.model).toBe("anthropic/claude-3.5-sonnet");
  });

  it("keeps legacy OPENAI_API_KEY as a compatibility fallback only", () => {
    const config = createLlmProviderConfig({
      OPENAI_API_KEY: "legacy-key",
      OPENAI_MODEL: "gpt-4.1-mini",
    });

    expect(config.provider).toBe("openai");
    expect(config.apiKey).toBe("legacy-key");
    expect(config.model).toBe("gpt-4.1-mini");
  });

  it("redacts secrets before provider details are logged", () => {
    const config = createLlmProviderConfig({
      LLM_API_KEY: "secret-key",
      LLM_BASE_URL: "https://llm.internal.example/v1",
      LLM_MODEL: "career-writer-v1",
      LLM_HEADERS: '{"X-Workspace":"stories-to-cv"}',
    });

    expect(redactLlmProviderConfig(config)).toEqual({
      provider: "custom",
      baseUrl: "https://llm.internal.example/v1",
      model: "career-writer-v1",
      hasApiKey: true,
      headers: ["X-Workspace"],
    });
  });

  it("creates an OpenAI-compatible language model from custom provider settings", () => {
    const calls: unknown[] = [];
    const model = { provider: "test-provider", modelId: "career-writer-v1" };

    const result = createLlmLanguageModel(
      {
        provider: "custom",
        apiKey: "secret-key",
        baseUrl: "https://llm.internal.example/v1",
        model: "career-writer-v1",
        headers: {
          "X-Workspace": "stories-to-cv",
        },
      },
      (settings) => {
        calls.push(settings);

        return {
          chatModel: (modelId) => {
            calls.push({ modelId });
            return model;
          },
        };
      },
    );

    expect(result).toBe(model);
    expect(calls).toEqual([
      {
        name: "custom",
        apiKey: "secret-key",
        baseURL: "https://llm.internal.example/v1",
        headers: {
          "X-Workspace": "stories-to-cv",
        },
      },
      {
        modelId: "career-writer-v1",
      },
    ]);
  });
});

describe("industry-aware conversation framework", () => {
  it("builds a compact brief from industry, role, seniority, and target job context", () => {
    const brief = buildIndustryAwareConversationBrief({
      userRoleLabel: "Senior Product Manager",
      targetRoleLabel: "Product Lead",
      seniorityId: "senior",
      industry: {
        id: "fintech",
        label: "Fintech",
        summary: "Financial products delivered through software.",
        coreWorkflows: [
          {
            id: "user-onboarding",
            label: "User onboarding",
            typicalSteps: ["KYC", "Risk scoring", "Account activation"],
            commonMetrics: ["conversion rate", "KYC pass rate", "time to activation"],
          },
        ],
        keyMetrics: [
          { id: "activation", label: "Activation", category: "product" },
          { id: "fraud-rate", label: "Fraud rate", category: "risk" },
        ],
        stakeholders: ["risk team", "compliance", "engineering"],
        achievementPatterns: ["Reduced onboarding drop-off by X%"],
        discoveryQuestions: ["Did you influence conversion, approval rate, fraud, or compliance?"],
        guardrails: ["Do not invent metrics or regulated responsibilities."],
      },
      role: {
        id: "product-manager",
        label: "Product Manager",
        seniorityLevels: [
          {
            id: "senior",
            label: "Senior",
            expectedScope: ["strategy", "cross-functional leadership", "roadmap ownership"],
          },
        ],
        coreResponsibilities: ["problem discovery", "prioritization", "stakeholder alignment"],
        impactDimensions: ["revenue", "activation", "retention", "risk reduction"],
        storyPrompts: ["Have you had to trade off user experience against risk constraints?"],
      },
      targetJobSignals: ["regulated onboarding", "conversion optimization"],
    });

    expect(brief).toEqual({
      userRoleLabel: "Senior Product Manager",
      targetRoleLabel: "Product Lead",
      industryLabel: "Fintech",
      roleLabel: "Product Manager",
      seniorityScope: ["strategy", "cross-functional leadership", "roadmap ownership"],
      usefulAngles: [
        "workflow: User onboarding",
        "metric: Activation",
        "metric: Fraud rate",
        "stakeholder: risk team",
        "impact: revenue",
        "impact: activation",
        "target: regulated onboarding",
        "target: conversion optimization",
      ],
      nextBestQuestions: [
        "Did you influence conversion, approval rate, fraud, or compliance?",
        "Have you had to trade off user experience against risk constraints?",
      ],
      avoid: [
        "Do not invent metrics or regulated responsibilities.",
        "Treat the user's personal knowledge base as the source of truth.",
        "Mark unverified framings as hypotheses and ask for confirmation.",
      ],
    });
  });

  it("defines a reusable policy that prevents the chatbot from inventing career facts", () => {
    expect(industryAwareCareerAssistantPolicy).toContain("source of truth");
    expect(industryAwareCareerAssistantPolicy).toContain("Never invent achievements");
    expect(industryAwareCareerAssistantPolicy).toContain("hypothesis");
  });
});
