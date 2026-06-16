import { describe, expect, it } from "vitest";
import {
  createChatSessionDraft,
  createKnowledgeAssetFromSession,
  defaultOnboardingForm,
  generateSessionOpener,
  generateTemplateCvVersion,
  getActiveDomainPacks,
  getActiveIndustryContextPacks,
  getRoleContextPackById,
  markSessionKnowledgeBaseSelection,
  requiresOnboarding,
  summarizeSessionForKnowledgeBase,
  toCareerFactFromUserClaim,
} from "./index";

describe("onboarding model", () => {
  it("uses an extendable schema-driven form for first-login onboarding", () => {
    expect(defaultOnboardingForm.questions).toEqual([
      expect.objectContaining({ id: "usage_goal", input: "checkbox" }),
      expect.objectContaining({ id: "age_range", input: "select" }),
    ]);
  });

  it("requires onboarding until a profile records completion", () => {
    expect(requiresOnboarding({ onboardingCompletedAt: null })).toBe(true);
    expect(requiresOnboarding({ onboardingCompletedAt: "2026-06-11T08:00:00.000Z" })).toBe(false);
  });
});

describe("CV generation helpers", () => {
  it("creates a template-backed CV version from JD intake and refinement notes", () => {
    const version = generateTemplateCvVersion({
      id: "cv-1",
      templateId: "simple-v1",
      jdText: "Hiring an AI Engineer to build RAG systems for customer support.",
      refinementNotes: "Emphasize support automation and measurable impact.",
      userFacts: ["Five years building RAG systems", "Led AI support automation project"],
      now: "2026-06-11T10:00:00.000Z",
    });

    expect(version.companyFindings).toContain("AI Engineer");
    expect(version.missingInfoChecklist).toContain("Confirm preferred email");
    expect(version.renderedText).toContain("Target role");
    expect(version.renderedText).toContain("Five years building RAG systems");
  });
});

describe("conversation helpers", () => {
  it("generates a domain-aware opener from selected skills", () => {
    expect(
      generateSessionOpener({
        domainId: "ai-engineering",
        skillIds: ["llm-apps"],
      }),
    ).toBe("How many years of AI engineering experience do you have so far?");
  });

  it("summarizes messages and sources into a curated KB conclusion", () => {
    const conclusion = summarizeSessionForKnowledgeBase({
      messages: [
        { role: "assistant", content: "How many years of AI experience do you have?" },
        { role: "user", content: "Five years building RAG systems for support teams." },
      ],
      sources: [{ name: "resume.pdf", extractedText: "Led AI support automation project." }],
    });

    expect(conclusion.summary).toContain("Five years building RAG systems");
    expect(conclusion.facts).toEqual([
      expect.objectContaining({ kind: "experience" }),
      expect.objectContaining({ kind: "source" }),
    ]);
  });
});

describe("knowledge base session rules", () => {
  it("creates chat sessions that are private and outside the knowledge base by default", () => {
    const session = createChatSessionDraft({
      id: "session-1",
      userId: "user-1",
      domainId: "ai-engineering",
      skillIds: ["llm-apps"],
      intent: "capture_experience",
      now: "2026-06-11T08:00:00.000Z",
    });

    expect(session.status).toBe("draft");
    expect(session.selectedForKnowledgeBase).toBe(false);
  });

  it("keeps KB selection as an explicit state separate from curated assets", () => {
    const session = markSessionKnowledgeBaseSelection(
      createChatSessionDraft({
        id: "session-1",
        userId: "user-1",
        domainId: "ai-engineering",
        skillIds: ["llm-apps"],
        intent: "capture_experience",
        now: "2026-06-11T08:00:00.000Z",
      }),
      true,
    );

    expect(session.status).toBe("selected_for_kb");
    expect(session.selectedForKnowledgeBase).toBe(true);
  });

  it("creates curated knowledge assets only from selected sessions", () => {
    const selectedSession = markSessionKnowledgeBaseSelection(
      createChatSessionDraft({
        id: "session-1",
        userId: "user-1",
        domainId: "ai-engineering",
        skillIds: ["llm-apps"],
        intent: "capture_experience",
        now: "2026-06-11T08:00:00.000Z",
      }),
      true,
    );

    const asset = createKnowledgeAssetFromSession({
      id: "asset-1",
      session: selectedSession,
      summary: "Built retrieval augmented generation systems for support automation.",
      facts: [{ id: "fact-1", kind: "skill", summary: "RAG implementation experience" }],
      now: "2026-06-11T09:00:00.000Z",
    });

    expect(asset.sourceSessionId).toBe("session-1");
    expect(asset.facts).toHaveLength(1);
    expect(() =>
      createKnowledgeAssetFromSession({
        id: "asset-2",
        session: createChatSessionDraft({
          id: "session-2",
          userId: "user-1",
          domainId: "ai-engineering",
          skillIds: ["llm-apps"],
          intent: "capture_experience",
          now: "2026-06-11T08:00:00.000Z",
        }),
        summary: "Should not be created.",
        facts: [],
        now: "2026-06-11T09:00:00.000Z",
      }),
    ).toThrow("selected for the knowledge base");
  });
});

describe("domain content registry", () => {
  it("exposes active domain packs with skills and starter questions", () => {
    const domains = getActiveDomainPacks();

    expect(domains).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "ai-engineering",
          skillClusters: expect.arrayContaining([expect.objectContaining({ id: "llm-apps" })]),
          starterQuestions: expect.arrayContaining([expect.objectContaining({ id: "ai-years" })]),
        }),
      ]),
    );
  });

  it("exposes industry context packs with workflows, metrics, questions, and guardrails", () => {
    const industries = getActiveIndustryContextPacks();

    expect(industries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "fintech",
          coreWorkflows: expect.arrayContaining([
            expect.objectContaining({
              id: "user-onboarding",
              commonMetrics: expect.arrayContaining(["conversion rate", "KYC pass rate", "time to activation"]),
            }),
          ]),
          discoveryQuestions: expect.arrayContaining([
            expect.stringContaining("conversion, approval rate, fraud, or compliance"),
          ]),
          guardrails: expect.arrayContaining([expect.stringContaining("Do not invent metrics")]),
        }),
      ]),
    );
  });

  it("exposes role context packs that describe seniority, responsibilities, and impact dimensions", () => {
    const productManager = getRoleContextPackById("product-manager");

    expect(productManager).toEqual(
      expect.objectContaining({
        id: "product-manager",
        seniorityLevels: expect.arrayContaining([
          expect.objectContaining({
            id: "senior",
            expectedScope: expect.arrayContaining(["strategy", "cross-functional leadership", "roadmap ownership"]),
          }),
        ]),
        impactDimensions: expect.arrayContaining(["revenue", "activation", "retention", "risk reduction"]),
        storyPrompts: expect.arrayContaining([expect.stringContaining("trade off")]),
      }),
    );
  });

  it("converts a user-stated claim into a provenance-preserving career fact", () => {
    const fact = toCareerFactFromUserClaim({
      id: "fact-1",
      userId: "user-1",
      claim: "Reduced onboarding drop-off from 42% to 28%.",
      industryId: "fintech",
      roleId: "product-manager",
      workflowId: "user-onboarding",
      now: "2026-06-16T09:00:00.000Z",
    });

    expect(fact).toEqual({
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
      cvRelevance: ["industry_context", "role_context", "workflow_context"],
      createdAt: "2026-06-16T09:00:00.000Z",
    });
  });
});
