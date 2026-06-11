import { describe, expect, it } from "vitest";
import {
  createChatSessionSchema,
  cvGenerationRequestSchema,
  onboardingResponseSchema,
  saveSessionToKnowledgeBaseSchema,
  sessionSourceInputSchema,
  updateSessionKnowledgeBaseSelectionSchema,
} from "./index";

describe("onboardingResponseSchema", () => {
  it("accepts schema-driven answers without hard-coding survey fields into the transport", () => {
    const response = onboardingResponseSchema.parse({
      formId: "first-login-v1",
      formVersion: 1,
      answers: [
        { questionId: "usage_goal", value: ["build_knowledge_base", "target_specific_job"] },
        { questionId: "age_range", value: "30_39" },
      ],
    });

    expect(response.answers).toHaveLength(2);
  });
});

describe("createChatSessionSchema", () => {
  it("requires domain, skill, and intent metadata when starting a session", () => {
    expect(
      createChatSessionSchema.parse({
        domainId: "ai-engineering",
        skillIds: ["llm-apps"],
        intent: "capture_experience",
      }),
    ).toEqual({
      domainId: "ai-engineering",
      skillIds: ["llm-apps"],
      intent: "capture_experience",
    });
  });
});

describe("updateSessionKnowledgeBaseSelectionSchema", () => {
  it("represents KB inclusion as an explicit user-controlled choice", () => {
    expect(
      updateSessionKnowledgeBaseSelectionSchema.parse({
        sessionId: "session-1",
        selectedForKnowledgeBase: true,
      }),
    ).toEqual({
      sessionId: "session-1",
      selectedForKnowledgeBase: true,
    });
  });
});

describe("sessionSourceInputSchema", () => {
  it("accepts text extracted from uploaded source material", () => {
    expect(
      sessionSourceInputSchema.parse({
        sessionId: "session-1",
        name: "resume.pdf",
        mimeType: "application/pdf",
        extractedText: "Led AI automation project.",
      }),
    ).toEqual({
      sessionId: "session-1",
      name: "resume.pdf",
      mimeType: "application/pdf",
      extractedText: "Led AI automation project.",
    });
  });
});

describe("saveSessionToKnowledgeBaseSchema", () => {
  it("requires an explicit selected session for save-to-KB", () => {
    expect(
      saveSessionToKnowledgeBaseSchema.parse({
        sessionId: "session-1",
        selectedForKnowledgeBase: true,
      }),
    ).toEqual({
      sessionId: "session-1",
      selectedForKnowledgeBase: true,
    });
  });
});

describe("cvGenerationRequestSchema", () => {
  it("accepts JD text or URL plus refinement notes", () => {
    expect(
      cvGenerationRequestSchema.parse({
        jdText: "AI Engineer role",
        jdUrl: "https://example.com/jobs/ai-engineer",
        refinementNotes: "Emphasize RAG systems.",
        templateId: "simple-v1",
      }),
    ).toEqual({
      jdText: "AI Engineer role",
      jdUrl: "https://example.com/jobs/ai-engineer",
      refinementNotes: "Emphasize RAG systems.",
      templateId: "simple-v1",
    });
  });
});
