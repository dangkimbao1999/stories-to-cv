import { describe, expect, it } from "vitest";
import {
  buildIndustryAwareConversationBrief,
  buildNextCareerStoryFollowUp,
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

describe("career story follow-up engine", () => {
  const playbook = {
    id: "career-story-excavation",
    label: "Career story excavation",
    goal: "Turn vague work memories into private, provenance-aware career stories.",
    principles: [
      "Ask one thing at a time.",
      "Probe personal contribution before turning team outcomes into user facts.",
    ],
    storySlots: [
      {
        id: "scope",
        label: "Scope",
        required: true,
        question: "What product, workflow, or system did this work affect?",
        captureTargets: ["project scope"],
        followUpHints: ["Find the story boundary."],
      },
      {
        id: "personal-contribution",
        label: "Personal contribution",
        required: true,
        question: "Which part did you personally own or directly deliver?",
        captureTargets: ["owned responsibility", "implementation detail"],
        followUpHints: ["Separate team outcome from individual contribution."],
      },
      {
        id: "impact-metric",
        label: "Impact metric",
        required: true,
        question: "What changed before and after this work?",
        captureTargets: ["metric", "before state", "after state"],
        followUpHints: ["Ask for proxy evidence when exact numbers are missing."],
      },
      {
        id: "evidence",
        label: "Evidence",
        required: false,
        question: "What evidence could support this story?",
        captureTargets: ["source", "artifact", "feedback"],
        followUpHints: ["Keep evidence private unless the user chooses to share it."],
      },
    ],
    triggers: [
      {
        id: "team-outcome-claim",
        targetSlotId: "personal-contribution",
        priority: 100,
        whenUserMentions: ["we built", "our team", "my team"],
        question: "What part did you personally own or directly deliver?",
        reason: "Separate the user's contribution from a team outcome before storing facts.",
      },
      {
        id: "vague-impact",
        targetSlotId: "impact-metric",
        priority: 80,
        whenUserMentions: ["optimized", "improved", "helped", "faster"],
        question: "What before-and-after metric or observable change proves the improvement?",
        reason: "The user described impact without concrete evidence yet.",
      },
    ],
    completionCriteria: ["Required story slots have user-stated answers."],
    guardrails: ["Do not invent metrics, ownership, or evidence."],
  };

  it("prioritizes personal contribution when the user describes a team outcome", () => {
    const followUp = buildNextCareerStoryFollowUp({
      latestUserMessage: "Our team built a new backend service and improved checkout.",
      answeredSlotIds: ["scope"],
      playbook,
    });

    expect(followUp).toEqual({
      question: "What part did you personally own or directly deliver?",
      slotId: "personal-contribution",
      triggerId: "team-outcome-claim",
      reason: "Separate the user's contribution from a team outcome before storing facts.",
      captureTargets: ["owned responsibility", "implementation detail"],
      safetyReminders: ["Do not invent metrics, ownership, or evidence."],
      isComplete: false,
    });
  });

  it("asks for evidence of impact when the user gives vague improvement language", () => {
    const followUp = buildNextCareerStoryFollowUp({
      latestUserMessage: "I optimized the API and made it faster for customers.",
      answeredSlotIds: ["scope", "personal-contribution"],
      playbook,
    });

    expect(followUp.slotId).toBe("impact-metric");
    expect(followUp.question).toContain("before-and-after metric");
    expect(followUp.triggerId).toBe("vague-impact");
  });

  it("falls back to the next unanswered required slot and then optional evidence", () => {
    expect(
      buildNextCareerStoryFollowUp({
        latestUserMessage: "I worked on the checkout system.",
        answeredSlotIds: [],
        playbook,
      }).slotId,
    ).toBe("scope");

    expect(
      buildNextCareerStoryFollowUp({
        latestUserMessage: "We have the main story now.",
        answeredSlotIds: ["scope", "personal-contribution", "impact-metric"],
        playbook,
      }).slotId,
    ).toBe("evidence");
  });
});
