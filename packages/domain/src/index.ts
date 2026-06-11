export type EntityId = string;

export type FactStatus = "proposed" | "confirmed";

export type Timestamp = string;

export interface KnowledgeFact {
  id: EntityId;
  userId: EntityId;
  kind: string;
  summary: string;
  status: FactStatus;
}

export type OnboardingQuestionInput = "checkbox" | "select";

export interface OnboardingQuestionOption {
  id: string;
  label: string;
}

export interface OnboardingQuestion {
  id: string;
  label: string;
  input: OnboardingQuestionInput;
  required: boolean;
  options: OnboardingQuestionOption[];
}

export interface OnboardingForm {
  id: string;
  version: number;
  questions: OnboardingQuestion[];
}

export interface ProfileOnboardingState {
  onboardingCompletedAt: Timestamp | null;
}

export const defaultOnboardingForm: OnboardingForm = {
  id: "first-login-v1",
  version: 1,
  questions: [
    {
      id: "usage_goal",
      label: "What do you want Stories to CV to help with first?",
      input: "checkbox",
      required: true,
      options: [
        { id: "build_knowledge_base", label: "Build my career knowledge base" },
        { id: "target_specific_job", label: "Generate a CV for a specific job" },
        { id: "organize_existing_materials", label: "Organize existing resumes and notes" },
      ],
    },
    {
      id: "age_range",
      label: "Which age range should we use for product research?",
      input: "select",
      required: true,
      options: [
        { id: "under_22", label: "Under 22" },
        { id: "22_29", label: "22-29" },
        { id: "30_39", label: "30-39" },
        { id: "40_plus", label: "40+" },
      ],
    },
  ],
};

export function requiresOnboarding(profile: ProfileOnboardingState): boolean {
  return profile.onboardingCompletedAt === null;
}

export type ChatSessionStatus = "draft" | "active" | "reviewed" | "selected_for_kb";

export interface ChatSession {
  id: EntityId;
  userId: EntityId;
  domainId: EntityId;
  skillIds: EntityId[];
  intent: string;
  status: ChatSessionStatus;
  selectedForKnowledgeBase: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateChatSessionDraftInput {
  id: EntityId;
  userId: EntityId;
  domainId: EntityId;
  skillIds: EntityId[];
  intent: string;
  now: Timestamp;
}

export function createChatSessionDraft(input: CreateChatSessionDraftInput): ChatSession {
  return {
    id: input.id,
    userId: input.userId,
    domainId: input.domainId,
    skillIds: input.skillIds,
    intent: input.intent,
    status: "draft",
    selectedForKnowledgeBase: false,
    createdAt: input.now,
    updatedAt: input.now,
  };
}

export function markSessionKnowledgeBaseSelection(session: ChatSession, selected: boolean): ChatSession {
  return {
    ...session,
    status: selected ? "selected_for_kb" : "reviewed",
    selectedForKnowledgeBase: selected,
  };
}

export interface KnowledgeAssetFact {
  id: EntityId;
  kind: string;
  summary: string;
}

export interface KnowledgeAsset {
  id: EntityId;
  userId: EntityId;
  sourceSessionId: EntityId;
  summary: string;
  facts: KnowledgeAssetFact[];
  createdAt: Timestamp;
}

export interface CreateKnowledgeAssetFromSessionInput {
  id: EntityId;
  session: ChatSession;
  summary: string;
  facts: KnowledgeAssetFact[];
  now: Timestamp;
}

export function createKnowledgeAssetFromSession(input: CreateKnowledgeAssetFromSessionInput): KnowledgeAsset {
  if (!input.session.selectedForKnowledgeBase) {
    throw new Error("A session must be selected for the knowledge base before creating a knowledge asset.");
  }

  return {
    id: input.id,
    userId: input.session.userId,
    sourceSessionId: input.session.id,
    summary: input.summary,
    facts: input.facts,
    createdAt: input.now,
  };
}

export interface SkillCluster {
  id: EntityId;
  label: string;
  active: boolean;
}

export interface StarterQuestion {
  id: EntityId;
  prompt: string;
  strategy: "experience_depth" | "project_story" | "impact_probe";
  active: boolean;
}

export interface DomainPack {
  id: EntityId;
  label: string;
  version: number;
  active: boolean;
  skillClusters: SkillCluster[];
  starterQuestions: StarterQuestion[];
}

export const domainPacks: DomainPack[] = [
  {
    id: "ai-engineering",
    label: "AI Engineer",
    version: 1,
    active: true,
    skillClusters: [
      { id: "llm-apps", label: "LLM applications", active: true },
      { id: "rag", label: "Retrieval augmented generation", active: true },
      { id: "evaluation", label: "AI evaluation", active: true },
    ],
    starterQuestions: [
      {
        id: "ai-years",
        prompt: "How many years of AI engineering experience do you have so far?",
        strategy: "experience_depth",
        active: true,
      },
      {
        id: "ai-project-impact",
        prompt: "Which AI project best shows the business impact you can create?",
        strategy: "impact_probe",
        active: true,
      },
    ],
  },
  {
    id: "product-management",
    label: "Product Manager",
    version: 1,
    active: true,
    skillClusters: [
      { id: "discovery", label: "Product discovery", active: true },
      { id: "roadmapping", label: "Roadmapping", active: true },
    ],
    starterQuestions: [
      {
        id: "pm-outcome",
        prompt: "Which product outcome are you proudest of influencing?",
        strategy: "impact_probe",
        active: true,
      },
    ],
  },
];

export function getActiveDomainPacks(): DomainPack[] {
  return domainPacks
    .filter((domain) => domain.active)
    .map((domain) => ({
      ...domain,
      skillClusters: domain.skillClusters.filter((skill) => skill.active),
      starterQuestions: domain.starterQuestions.filter((question) => question.active),
    }));
}

export interface GenerateSessionOpenerInput {
  domainId: EntityId;
  skillIds: EntityId[];
}

export function generateSessionOpener(input: GenerateSessionOpenerInput): string {
  const domain = getActiveDomainPacks().find((pack) => pack.id === input.domainId);
  const question =
    domain?.starterQuestions.find((starter) =>
      input.skillIds.some((skillId) => starter.prompt.toLowerCase().includes(skillId.replaceAll("-", " "))),
    ) ?? domain?.starterQuestions[0];

  return question?.prompt ?? "What career story should we capture first?";
}

export interface SessionSummaryMessage {
  role: "assistant" | "user" | "system";
  content: string;
}

export interface SessionSummarySource {
  name: string;
  extractedText: string;
}

export interface SessionKnowledgeSummary {
  summary: string;
  curatedConclusion: string;
  facts: KnowledgeAssetFact[];
}

export interface SummarizeSessionForKnowledgeBaseInput {
  messages: SessionSummaryMessage[];
  sources: SessionSummarySource[];
}

export function summarizeSessionForKnowledgeBase(
  input: SummarizeSessionForKnowledgeBaseInput,
): SessionKnowledgeSummary {
  const strongestUserMessage =
    input.messages
      .filter((message) => message.role === "user")
      .map((message) => message.content.trim())
      .find((content) => content.length > 0) ?? "No user story captured yet.";
  const strongestSource = input.sources.find((source) => source.extractedText.trim().length > 0);
  const sourceSummary = strongestSource ? ` Source material: ${strongestSource.name}.` : "";

  return {
    summary: `${strongestUserMessage}${sourceSummary}`,
    curatedConclusion: `${strongestUserMessage}${sourceSummary}`,
    facts: [
      {
        id: "fact-experience-1",
        kind: "experience",
        summary: strongestUserMessage,
      },
      ...(strongestSource
        ? [
            {
              id: "fact-source-1",
              kind: "source",
              summary: `Imported source: ${strongestSource.name}`,
            },
          ]
        : []),
    ],
  };
}

export interface GenerateTemplateCvVersionInput {
  id: EntityId;
  templateId: EntityId;
  jdText: string;
  refinementNotes: string;
  userFacts: string[];
  now: Timestamp;
}

export interface GeneratedCvVersion {
  id: EntityId;
  templateId: EntityId;
  companyFindings: string;
  strategy: string;
  missingInfoChecklist: string[];
  structuredContent: {
    headline: string;
    targetRole: string;
    highlights: string[];
  };
  renderedText: string;
  createdAt: Timestamp;
}

export function generateTemplateCvVersion(input: GenerateTemplateCvVersionInput): GeneratedCvVersion {
  const normalizedJd = input.jdText.trim();
  const targetRole =
    normalizedJd.match(/AI Engineer|Product Manager|Software Engineer|Data Scientist/i)?.[0] ?? "Target role";
  const highlights =
    input.userFacts.length > 0 ? input.userFacts : ["Add confirmed knowledge-base facts before final export."];
  const strategy =
    input.refinementNotes.trim() || "Prioritize the strongest verified user facts against the job description.";

  return {
    id: input.id,
    templateId: input.templateId,
    companyFindings: `The JD appears to target ${targetRole} capabilities. Emphasize evidence that maps directly to the role requirements.`,
    strategy,
    missingInfoChecklist: ["Confirm preferred email", "Confirm phone number", "Confirm latest workplace history"],
    structuredContent: {
      headline: `${targetRole} candidate`,
      targetRole,
      highlights,
    },
    renderedText: [
      `${targetRole} candidate`,
      "",
      `Target role: ${targetRole}`,
      "",
      "Profile highlights",
      ...highlights.map((highlight) => `- ${highlight}`),
      "",
      "Generation strategy",
      strategy,
    ].join("\n"),
    createdAt: input.now,
  };
}
