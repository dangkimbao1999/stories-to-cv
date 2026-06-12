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
