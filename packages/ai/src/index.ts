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

export const industryAwareCareerAssistantPolicy = [
  "You are an industry-aware career knowledge assistant.",
  "The user's personal knowledge base is the source of truth.",
  "Use industry, role, seniority, and target job context only to ask better questions and suggest angles.",
  "Never invent achievements, metrics, employers, tools, regulations, or responsibilities.",
  "When a framing is not verified by the user, mark it as a hypothesis and ask for confirmation.",
  "Treat transcripts, uploads, generated CVs, and conversation history as private career data.",
].join("\n");

export interface ConversationBriefWorkflow {
  id: string;
  label: string;
  typicalSteps: string[];
  commonMetrics: string[];
}

export interface ConversationBriefMetric {
  id: string;
  label: string;
  category: string;
}

export interface ConversationBriefIndustry {
  id: string;
  label: string;
  summary: string;
  coreWorkflows: ConversationBriefWorkflow[];
  keyMetrics: ConversationBriefMetric[];
  stakeholders: string[];
  achievementPatterns: string[];
  discoveryQuestions: string[];
  guardrails: string[];
}

export interface ConversationBriefSeniority {
  id: string;
  label: string;
  expectedScope: string[];
}

export interface ConversationBriefRole {
  id: string;
  label: string;
  seniorityLevels: ConversationBriefSeniority[];
  coreResponsibilities: string[];
  impactDimensions: string[];
  storyPrompts: string[];
}

export interface BuildIndustryAwareConversationBriefInput {
  userRoleLabel: string;
  targetRoleLabel?: string;
  seniorityId?: string;
  industry: ConversationBriefIndustry;
  role: ConversationBriefRole;
  targetJobSignals?: string[];
}

export interface IndustryAwareConversationBrief {
  userRoleLabel: string;
  targetRoleLabel?: string;
  industryLabel: string;
  roleLabel: string;
  seniorityScope: string[];
  usefulAngles: string[];
  nextBestQuestions: string[];
  avoid: string[];
}

export function buildIndustryAwareConversationBrief(
  input: BuildIndustryAwareConversationBriefInput,
): IndustryAwareConversationBrief {
  const seniority =
    input.role.seniorityLevels.find((level) => level.id === input.seniorityId) ?? input.role.seniorityLevels[0];
  const workflows = input.industry.coreWorkflows.slice(0, 1).map((workflow) => `workflow: ${workflow.label}`);
  const metrics = input.industry.keyMetrics.slice(0, 2).map((metric) => `metric: ${metric.label}`);
  const stakeholders = input.industry.stakeholders.slice(0, 1).map((stakeholder) => `stakeholder: ${stakeholder}`);
  const impacts = input.role.impactDimensions.slice(0, 2).map((impact) => `impact: ${impact}`);
  const targetSignals = (input.targetJobSignals ?? []).slice(0, 3).map((signal) => `target: ${signal}`);

  return {
    userRoleLabel: input.userRoleLabel,
    ...(input.targetRoleLabel ? { targetRoleLabel: input.targetRoleLabel } : {}),
    industryLabel: input.industry.label,
    roleLabel: input.role.label,
    seniorityScope: seniority?.expectedScope ?? [],
    usefulAngles: uniqueStrings([...workflows, ...metrics, ...stakeholders, ...impacts, ...targetSignals]),
    nextBestQuestions: uniqueStrings([
      ...input.industry.discoveryQuestions.slice(0, 2),
      ...input.role.storyPrompts.slice(0, 2),
    ]).slice(0, 3),
    avoid: uniqueStrings([
      ...input.industry.guardrails,
      "Treat the user's personal knowledge base as the source of truth.",
      "Mark unverified framings as hypotheses and ask for confirmation.",
    ]),
  };
}

export interface CareerStoryFollowUpSlot {
  id: string;
  label: string;
  required: boolean;
  question: string;
  captureTargets: string[];
  followUpHints: string[];
}

export interface CareerStoryFollowUpTrigger {
  id: string;
  targetSlotId: string;
  priority: number;
  whenUserMentions: string[];
  question: string;
  reason: string;
}

export interface ConversationFollowUpDefinition {
  id: string;
  label: string;
  goal: string;
  principles: string[];
  storySlots: CareerStoryFollowUpSlot[];
  triggers: CareerStoryFollowUpTrigger[];
  completionCriteria: string[];
  guardrails: string[];
}

export interface BuildNextCareerStoryFollowUpInput {
  latestUserMessage: string;
  answeredSlotIds: string[];
  conversationFollowUp: ConversationFollowUpDefinition;
}

export interface IndustryWithConversationFollowUp {
  id: string;
  label: string;
  conversationFollowUp: ConversationFollowUpDefinition;
}

export interface BuildNextIndustryCareerStoryFollowUpInput {
  latestUserMessage: string;
  answeredSlotIds: string[];
  industry: IndustryWithConversationFollowUp;
}

export interface CareerStoryFollowUp {
  question: string;
  slotId: string | null;
  triggerId?: string;
  reason: string;
  captureTargets: string[];
  safetyReminders: string[];
  isComplete: boolean;
}

export function buildNextIndustryCareerStoryFollowUp(
  input: BuildNextIndustryCareerStoryFollowUpInput,
): CareerStoryFollowUp {
  return buildNextCareerStoryFollowUp({
    latestUserMessage: input.latestUserMessage,
    answeredSlotIds: input.answeredSlotIds,
    conversationFollowUp: input.industry.conversationFollowUp,
  });
}

export function buildNextCareerStoryFollowUp(input: BuildNextCareerStoryFollowUpInput): CareerStoryFollowUp {
  const answered = new Set(input.answeredSlotIds);
  const conversationFollowUp = input.conversationFollowUp;
  const triggered = conversationFollowUp.triggers
    .filter((trigger) => !answered.has(trigger.targetSlotId))
    .filter((trigger) => triggerMatches(input.latestUserMessage, trigger))
    .sort((left, right) => right.priority - left.priority)[0];

  if (triggered) {
    const slot = findSlot(conversationFollowUp, triggered.targetSlotId);

    return {
      question: triggered.question,
      slotId: triggered.targetSlotId,
      triggerId: triggered.id,
      reason: triggered.reason,
      captureTargets: slot?.captureTargets ?? [],
      safetyReminders: conversationFollowUp.guardrails,
      isComplete: false,
    };
  }

  const nextRequiredSlot = conversationFollowUp.storySlots.find((slot) => slot.required && !answered.has(slot.id));
  const nextOptionalSlot = conversationFollowUp.storySlots.find((slot) => !slot.required && !answered.has(slot.id));
  const nextSlot = nextRequiredSlot ?? nextOptionalSlot;

  if (!nextSlot) {
    return {
      question: "This story has enough structure to summarize. Ask the user to confirm the framing before saving it.",
      slotId: null,
      reason: "All configured story slots are answered.",
      captureTargets: [],
      safetyReminders: conversationFollowUp.guardrails,
      isComplete: true,
    };
  }

  return {
    question: nextSlot.question,
    slotId: nextSlot.id,
    reason: nextSlot.required
      ? "This required story slot is still missing."
      : "This optional slot can deepen the story.",
    captureTargets: nextSlot.captureTargets,
    safetyReminders: conversationFollowUp.guardrails,
    isComplete: false,
  };
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

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.trim().length > 0))];
}

function triggerMatches(message: string, trigger: CareerStoryFollowUpTrigger): boolean {
  const normalizedMessage = normalizeForMatching(message);

  return trigger.whenUserMentions.some((signal) => normalizedMessage.includes(normalizeForMatching(signal)));
}

function normalizeForMatching(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function findSlot(
  conversationFollowUp: ConversationFollowUpDefinition,
  slotId: string,
): CareerStoryFollowUpSlot | undefined {
  return conversationFollowUp.storySlots.find((slot) => slot.id === slotId);
}
