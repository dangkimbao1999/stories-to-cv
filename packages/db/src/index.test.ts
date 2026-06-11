import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import {
  auditLogs,
  authIdentities,
  chatMessages,
  chatSessions,
  companyResearchSnapshots,
  consents,
  cvGenerationSessions,
  cvTemplates,
  cvVersions,
  documentExtractions,
  domainPacks,
  domainQuestionSets,
  domainSkillClusters,
  jobDescriptionSources,
  jobDescriptions,
  knowledgeAssets,
  knowledgeFactSources,
  knowledgeFacts,
  onboardingForms,
  onboardingResponses,
  profiles,
  sessionSources,
  sessionTags,
  users,
} from "./index";

describe("schema foundation", () => {
  it("names the core Phase 1 and future CV tables explicitly", () => {
    expect(
      [
        users,
        authIdentities,
        profiles,
        onboardingForms,
        onboardingResponses,
        chatSessions,
        chatMessages,
        sessionTags,
        sessionSources,
        documentExtractions,
        knowledgeAssets,
        knowledgeFacts,
        knowledgeFactSources,
        domainPacks,
        domainSkillClusters,
        domainQuestionSets,
        jobDescriptions,
        jobDescriptionSources,
        companyResearchSnapshots,
        cvGenerationSessions,
        cvVersions,
        cvTemplates,
        consents,
        auditLogs,
      ].map((table) => getTableName(table)),
    ).toEqual([
      "users",
      "auth_identities",
      "profiles",
      "onboarding_forms",
      "onboarding_responses",
      "chat_sessions",
      "chat_messages",
      "session_tags",
      "session_sources",
      "document_extractions",
      "knowledge_assets",
      "knowledge_facts",
      "knowledge_fact_sources",
      "domain_packs",
      "domain_skill_clusters",
      "domain_question_sets",
      "job_descriptions",
      "job_description_sources",
      "company_research_snapshots",
      "cv_generation_sessions",
      "cv_versions",
      "cv_templates",
      "consents",
      "audit_logs",
    ]);
  });

  it("keeps raw chat sessions separate from curated knowledge assets", () => {
    expect(chatSessions.selectedForKnowledgeBase).toBeDefined();
    expect(chatSessions.status).toBeDefined();
    expect(knowledgeAssets.sourceSessionId).toBeDefined();
    expect(knowledgeAssets.curatedConclusion).toBeDefined();
  });

  it("models auth identity and onboarding separately from profile data", () => {
    expect(authIdentities.provider).toBeDefined();
    expect(authIdentities.providerAccountId).toBeDefined();
    expect(profiles.onboardingCompletedAt).toBeDefined();
    expect(onboardingResponses.answers).toBeDefined();
  });

  it("models consent and audit events as first-class privacy controls", () => {
    expect(consents.userId).toBeDefined();
    expect(consents.grantedAt).toBeDefined();
    expect(auditLogs.actorUserId).toBeDefined();
    expect(auditLogs.action).toBeDefined();
  });
});
