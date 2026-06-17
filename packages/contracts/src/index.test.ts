import { describe, expect, it } from "vitest";
import {
  careerFactSchema,
  conversationFollowUpPlaybookSchema,
  createChatSessionSchema,
  cvGenerationRequestSchema,
  industryContextPackSchema,
  onboardingResponseSchema,
  roleContextPackSchema,
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

describe("industryContextPackSchema", () => {
  it("requires the fields the chatbot needs to ask context-aware questions safely", () => {
    const pack = industryContextPackSchema.parse({
      id: "fintech",
      label: "Fintech",
      version: 1,
      active: true,
      summary: "Financial products delivered through software.",
      businessModels: ["Payments", "Lending"],
      coreWorkflows: [
        {
          id: "user-onboarding",
          label: "User onboarding",
          typicalSteps: ["KYC", "Risk scoring", "Account activation"],
          commonMetrics: ["conversion rate", "KYC pass rate"],
        },
      ],
      keyMetrics: [
        { id: "fraud-rate", label: "Fraud rate", category: "risk" },
        { id: "activation", label: "Activation", category: "product" },
      ],
      stakeholders: ["risk team", "compliance", "engineering"],
      commonTools: ["KYC providers", "payment gateways"],
      regulatoryConcerns: ["KYC/AML", "data privacy"],
      achievementPatterns: ["Reduced onboarding drop-off by X%"],
      discoveryQuestions: ["Did you influence conversion, approval rate, fraud, or compliance?"],
      guardrails: ["Do not invent metrics or regulated responsibilities."],
      conversationFollowUp: {
        id: "fintech-career-story-excavation",
        label: "Fintech career story excavation",
        version: 1,
        active: true,
        goal: "Help users tell accurate fintech career stories.",
        principles: ["Ask one thing at a time."],
        storySlots: [
          {
            id: "personal-contribution",
            label: "Personal contribution",
            required: true,
            question: "Which part did you personally own?",
            captureTargets: ["owned scope"],
            followUpHints: ["Separate user contribution from team outcome."],
          },
        ],
        triggers: [
          {
            id: "risk-claim",
            targetSlotId: "personal-contribution",
            priority: 100,
            whenUserMentions: ["risk"],
            question: "Which risk-related part did you personally own?",
            reason: "Avoid assuming regulated responsibility.",
          },
        ],
        completionCriteria: ["Required story slots have user-stated answers."],
        guardrails: ["Do not invent regulated responsibilities."],
      },
    });

    expect(pack.coreWorkflows[0]?.commonMetrics).toContain("conversion rate");
    expect(pack.conversationFollowUp.triggers[0]?.id).toBe("risk-claim");
    expect(pack.guardrails).toContain("Do not invent metrics or regulated responsibilities.");
  });

  it("rejects packs without discovery questions or guardrails", () => {
    expect(() =>
      industryContextPackSchema.parse({
        id: "thin-pack",
        label: "Thin pack",
        version: 1,
        active: true,
        summary: "Too sparse.",
        businessModels: ["Services"],
        coreWorkflows: [],
        keyMetrics: [],
        stakeholders: [],
        commonTools: [],
        regulatoryConcerns: [],
        achievementPatterns: [],
        discoveryQuestions: [],
        guardrails: [],
      }),
    ).toThrow();
  });
});

describe("roleContextPackSchema", () => {
  it("captures responsibilities, seniority scope, impact dimensions, and story prompts", () => {
    const pack = roleContextPackSchema.parse({
      id: "product-manager",
      label: "Product Manager",
      version: 1,
      active: true,
      seniorityLevels: [
        {
          id: "senior",
          label: "Senior",
          expectedScope: ["strategy", "cross-functional leadership", "roadmap ownership"],
        },
      ],
      coreResponsibilities: ["problem discovery", "prioritization"],
      impactDimensions: ["activation", "retention"],
      storyPrompts: ["Have you changed a roadmap based on data?"],
    });

    expect(pack.seniorityLevels[0]?.expectedScope).toContain("strategy");
  });
});

describe("careerFactSchema", () => {
  it("keeps user claims private and provenance-aware by default", () => {
    const fact = careerFactSchema.parse({
      id: "fact-1",
      userId: "user-1",
      type: "achievement",
      userClaim: "Reduced onboarding drop-off from 42% to 28%.",
      context: {
        industryId: "fintech",
        roleId: "product-manager",
        workflowId: "user-onboarding",
      },
      evidenceStatus: "user_stated",
      sensitivity: "private",
      cvRelevance: ["conversion optimization"],
      createdAt: "2026-06-16T09:00:00.000Z",
    });

    expect(fact.evidenceStatus).toBe("user_stated");
    expect(fact.sensitivity).toBe("private");
  });
});

describe("conversationFollowUpPlaybookSchema", () => {
  it("requires slots, triggers, and safety rules for multi-turn career story excavation", () => {
    const playbook = conversationFollowUpPlaybookSchema.parse({
      id: "career-story-excavation",
      label: "Career story excavation",
      version: 1,
      active: true,
      goal: "Turn vague work memories into private, provenance-aware career stories.",
      principles: ["Ask one thing at a time.", "Do not turn team outcomes into personal facts without confirmation."],
      storySlots: [
        {
          id: "personal-contribution",
          label: "Personal contribution",
          required: true,
          question: "Which part did you personally own?",
          captureTargets: ["owned scope", "implementation detail"],
          followUpHints: ["Separate team outcome from user contribution."],
        },
        {
          id: "impact-metric",
          label: "Impact metric",
          required: true,
          question: "What before-and-after metric changed?",
          captureTargets: ["metric", "before state", "after state"],
          followUpHints: ["Ask for proxy evidence if exact numbers are unavailable."],
        },
      ],
      triggers: [
        {
          id: "team-outcome-claim",
          targetSlotId: "personal-contribution",
          priority: 100,
          whenUserMentions: ["we built", "my team"],
          question: "What part did you personally handle?",
          reason: "Separate personal contribution from team outcome.",
        },
      ],
      completionCriteria: ["Required slots have user-stated answers."],
      guardrails: ["Ask for confirmation before storing a career fact."],
    });

    expect(playbook.storySlots).toHaveLength(2);
    expect(playbook.triggers[0]?.targetSlotId).toBe("personal-contribution");
  });

  it("rejects playbooks with no story slots or no guardrails", () => {
    expect(() =>
      conversationFollowUpPlaybookSchema.parse({
        id: "unsafe",
        label: "Unsafe",
        version: 1,
        active: true,
        goal: "Ask anything.",
        principles: ["Ask questions."],
        storySlots: [],
        triggers: [],
        completionCriteria: [],
        guardrails: [],
      }),
    ).toThrow();
  });
});
