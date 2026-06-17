import { z } from "zod";

const entityIdSchema = z.string().min(1);

export const jdInputSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  content: z.string().min(1),
});

export type JdInput = z.infer<typeof jdInputSchema>;

export const onboardingAnswerValueSchema = z.union([
  z.string().min(1),
  z.array(z.string().min(1)).min(1),
  z.boolean(),
  z.number(),
]);

export const onboardingResponseSchema = z.object({
  formId: entityIdSchema,
  formVersion: z.number().int().positive(),
  answers: z
    .array(
      z.object({
        questionId: entityIdSchema,
        value: onboardingAnswerValueSchema,
      }),
    )
    .min(1),
});

export type OnboardingResponseInput = z.infer<typeof onboardingResponseSchema>;

export const createChatSessionSchema = z.object({
  domainId: entityIdSchema,
  skillIds: z.array(entityIdSchema).min(1),
  intent: z.string().min(1),
});

export type CreateChatSessionInput = z.infer<typeof createChatSessionSchema>;

export const updateSessionKnowledgeBaseSelectionSchema = z.object({
  sessionId: entityIdSchema,
  selectedForKnowledgeBase: z.boolean(),
});

export type UpdateSessionKnowledgeBaseSelectionInput = z.infer<typeof updateSessionKnowledgeBaseSelectionSchema>;

export const sessionSourceInputSchema = z.object({
  sessionId: entityIdSchema,
  name: z.string().min(1),
  mimeType: z.string().min(1),
  extractedText: z.string().min(1),
});

export type SessionSourceInput = z.infer<typeof sessionSourceInputSchema>;

export const saveSessionToKnowledgeBaseSchema = z.object({
  sessionId: entityIdSchema,
  selectedForKnowledgeBase: z.literal(true),
});

export type SaveSessionToKnowledgeBaseInput = z.infer<typeof saveSessionToKnowledgeBaseSchema>;

export const cvGenerationRequestSchema = z
  .object({
    jdText: z.string().optional(),
    jdUrl: z.string().url().optional(),
    refinementNotes: z.string().optional(),
    templateId: entityIdSchema.default("simple-v1"),
  })
  .refine((input) => Boolean(input.jdText?.trim() || input.jdUrl?.trim()), {
    message: "Provide JD text or a JD URL.",
    path: ["jdText"],
  });

export type CvGenerationRequestInput = z.infer<typeof cvGenerationRequestSchema>;

const nonEmptyStringArraySchema = z.array(z.string().min(1)).min(1);

export const industryMetricCategorySchema = z.enum(["business", "product", "risk", "operations", "people"]);

export const industryWorkflowContextSchema = z.object({
  id: entityIdSchema,
  label: z.string().min(1),
  typicalSteps: nonEmptyStringArraySchema,
  commonMetrics: nonEmptyStringArraySchema,
});

export const industryMetricContextSchema = z.object({
  id: entityIdSchema,
  label: z.string().min(1),
  category: industryMetricCategorySchema,
});

export const conversationStorySlotSchema = z.object({
  id: entityIdSchema,
  label: z.string().min(1),
  required: z.boolean(),
  question: z.string().min(1),
  captureTargets: nonEmptyStringArraySchema,
  followUpHints: nonEmptyStringArraySchema,
});

export const conversationFollowUpTriggerSchema = z.object({
  id: entityIdSchema,
  targetSlotId: entityIdSchema,
  priority: z.number().int().nonnegative(),
  whenUserMentions: nonEmptyStringArraySchema,
  question: z.string().min(1),
  reason: z.string().min(1),
});

export const conversationFollowUpSchema = z.object({
  id: entityIdSchema,
  label: z.string().min(1),
  version: z.number().int().positive(),
  active: z.boolean(),
  goal: z.string().min(1),
  principles: nonEmptyStringArraySchema,
  storySlots: z.array(conversationStorySlotSchema).min(1),
  triggers: z.array(conversationFollowUpTriggerSchema).min(1),
  completionCriteria: nonEmptyStringArraySchema,
  guardrails: nonEmptyStringArraySchema,
});

export type ConversationFollowUpInput = z.infer<typeof conversationFollowUpSchema>;

export const industryContextPackSchema = z.object({
  id: entityIdSchema,
  label: z.string().min(1),
  version: z.number().int().positive(),
  active: z.boolean(),
  summary: z.string().min(1),
  businessModels: nonEmptyStringArraySchema,
  coreWorkflows: z.array(industryWorkflowContextSchema).min(1),
  keyMetrics: z.array(industryMetricContextSchema).min(1),
  stakeholders: nonEmptyStringArraySchema,
  commonTools: nonEmptyStringArraySchema,
  regulatoryConcerns: nonEmptyStringArraySchema,
  achievementPatterns: nonEmptyStringArraySchema,
  discoveryQuestions: nonEmptyStringArraySchema,
  guardrails: nonEmptyStringArraySchema,
  conversationFollowUp: conversationFollowUpSchema,
});

export type IndustryContextPackInput = z.infer<typeof industryContextPackSchema>;

export const roleSeniorityContextSchema = z.object({
  id: entityIdSchema,
  label: z.string().min(1),
  expectedScope: nonEmptyStringArraySchema,
});

export const roleContextPackSchema = z.object({
  id: entityIdSchema,
  label: z.string().min(1),
  version: z.number().int().positive(),
  active: z.boolean(),
  seniorityLevels: z.array(roleSeniorityContextSchema).min(1),
  coreResponsibilities: nonEmptyStringArraySchema,
  impactDimensions: nonEmptyStringArraySchema,
  storyPrompts: nonEmptyStringArraySchema,
});

export type RoleContextPackInput = z.infer<typeof roleContextPackSchema>;

export const careerFactSchema = z.object({
  id: entityIdSchema,
  userId: entityIdSchema,
  type: z.enum(["achievement", "responsibility", "skill", "context"]),
  userClaim: z.string().min(1),
  context: z.object({
    industryId: entityIdSchema,
    roleId: entityIdSchema,
    workflowId: entityIdSchema.optional(),
  }),
  evidenceStatus: z.enum(["user_stated", "source_supported", "needs_confirmation"]),
  sensitivity: z.enum(["private", "shareable"]),
  cvRelevance: nonEmptyStringArraySchema,
  createdAt: z.string().datetime(),
});

export type CareerFactInput = z.infer<typeof careerFactSchema>;
