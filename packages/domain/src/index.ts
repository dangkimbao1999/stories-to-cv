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

export interface ConversationStorySlot {
  id: EntityId;
  label: string;
  required: boolean;
  question: string;
  captureTargets: string[];
  followUpHints: string[];
}

export interface ConversationFollowUpTrigger {
  id: EntityId;
  targetSlotId: EntityId;
  priority: number;
  whenUserMentions: string[];
  question: string;
  reason: string;
}

export interface ConversationFollowUpPlaybook {
  id: EntityId;
  label: string;
  version: number;
  active: boolean;
  goal: string;
  principles: string[];
  storySlots: ConversationStorySlot[];
  triggers: ConversationFollowUpTrigger[];
  completionCriteria: string[];
  guardrails: string[];
}

export const defaultCareerStoryExcavationPlaybook: ConversationFollowUpPlaybook = {
  id: "career-story-excavation",
  label: "Career story excavation",
  version: 1,
  active: true,
  goal: "Turn vague work memories into private, provenance-aware career stories with clear scope, contribution, impact, and evidence.",
  principles: [
    "Ask one thing at a time.",
    "Probe personal contribution before turning team outcomes into user facts.",
    "Prefer concrete before-and-after evidence, but accept proxy signals when exact metrics are unavailable.",
    "Keep the tone curious and non-judgmental so the user feels safe remembering more.",
    "Treat every unverified framing as a hypothesis that needs user confirmation.",
  ],
  storySlots: [
    {
      id: "scope",
      label: "Story scope",
      required: true,
      question: "What product, workflow, system, customer problem, or business moment did this story affect?",
      captureTargets: ["story boundary", "business or user context", "affected workflow"],
      followUpHints: [
        "Help the user name the project or situation before asking for impact.",
        "If the user is vague, offer likely workflow options from the industry context as hypotheses.",
      ],
    },
    {
      id: "personal-contribution",
      label: "Personal contribution",
      required: true,
      question: "Which part did you personally own or directly deliver?",
      captureTargets: ["owned scope", "direct actions", "decision rights", "collaboration role"],
      followUpHints: [
        "Separate the user's contribution from team or company outcomes.",
        "Ask what they decided, built, coordinated, analyzed, fixed, or influenced.",
      ],
    },
    {
      id: "workflow-context",
      label: "Workflow context",
      required: true,
      question: "Where did this fit in the workflow, and what happened before and after your part?",
      captureTargets: ["workflow step", "upstream dependency", "downstream outcome"],
      followUpHints: [
        "Use industry workflows to help the user locate the story.",
        "Ask for adjacent teams or handoffs when the story feels isolated.",
      ],
    },
    {
      id: "impact-metric",
      label: "Impact metric",
      required: true,
      question: "What before-and-after metric, observable change, or proxy signal shows the work mattered?",
      captureTargets: ["metric", "before state", "after state", "proxy evidence"],
      followUpHints: [
        "Ask for exact numbers first, then proxy signals like time saved, incidents reduced, adoption, quality, or feedback.",
        "Do not invent numeric impact when the user only remembers directionally.",
      ],
    },
    {
      id: "stakeholders",
      label: "Stakeholders",
      required: false,
      question: "Who else was involved, affected, or needed to be convinced?",
      captureTargets: ["collaborators", "decision makers", "users", "reviewers"],
      followUpHints: [
        "Ask about cross-functional collaboration, conflict, review, or alignment.",
        "Use stakeholders from industry context as examples, not assumptions.",
      ],
    },
    {
      id: "tradeoff",
      label: "Trade-off",
      required: false,
      question: "What trade-off, constraint, or hard decision made this story non-obvious?",
      captureTargets: ["constraint", "decision", "risk", "judgment"],
      followUpHints: [
        "Good stories often reveal judgment under constraints.",
        "Probe speed versus quality, user experience versus risk, short-term delivery versus maintainability.",
      ],
    },
    {
      id: "evidence",
      label: "Evidence",
      required: false,
      question: "What evidence could support this story if you wanted to verify it later?",
      captureTargets: ["source artifact", "dashboard", "ticket", "feedback", "document"],
      followUpHints: [
        "Keep evidence private unless the user explicitly chooses to use it.",
        "Ask for source categories rather than asking the user to upload sensitive data immediately.",
      ],
    },
    {
      id: "reflection",
      label: "Reflection",
      required: false,
      question: "What does this story reveal about how you work when the situation is difficult?",
      captureTargets: ["strength", "working style", "career theme", "learned lesson"],
      followUpHints: [
        "Use this slot to help the user express identity, not just output.",
        "Connect repeated patterns across stories only after the user confirms them.",
      ],
    },
  ],
  triggers: [
    {
      id: "team-outcome-claim",
      targetSlotId: "personal-contribution",
      priority: 100,
      whenUserMentions: ["we built", "we launched", "our team", "my team", "we improved", "we delivered"],
      question: "What part did you personally own or directly deliver?",
      reason: "Separate the user's contribution from a team outcome before storing facts.",
    },
    {
      id: "vague-impact",
      targetSlotId: "impact-metric",
      priority: 90,
      whenUserMentions: ["improved", "optimized", "helped", "made it faster", "better", "increased", "reduced"],
      question: "What before-and-after metric, observable change, or proxy signal shows the improvement?",
      reason: "The user described impact, but the story still needs concrete evidence or a proxy signal.",
    },
    {
      id: "vague-scope",
      targetSlotId: "scope",
      priority: 80,
      whenUserMentions: ["project", "initiative", "feature", "system", "workflow"],
      question: "What product, workflow, system, customer problem, or business moment did this story affect?",
      reason: "The user mentioned work, but the story boundary is not clear enough yet.",
    },
    {
      id: "technical-or-operational-work",
      targetSlotId: "workflow-context",
      priority: 70,
      whenUserMentions: ["api", "service", "pipeline", "dashboard", "migration", "automation", "incident"],
      question: "Where did this fit in the workflow, and what happened before and after your part?",
      reason: "Technical or operational work becomes more useful when connected to an end-to-end workflow.",
    },
    {
      id: "constraint-language",
      targetSlotId: "tradeoff",
      priority: 60,
      whenUserMentions: ["trade-off", "constraint", "deadline", "risk", "legacy", "blocked", "difficult"],
      question: "What trade-off, constraint, or hard decision made this story non-obvious?",
      reason: "Constraints reveal judgment and make the story more distinctive.",
    },
    {
      id: "source-or-proof-language",
      targetSlotId: "evidence",
      priority: 50,
      whenUserMentions: ["dashboard", "ticket", "report", "feedback", "postmortem", "review"],
      question: "What evidence could support this story if you wanted to verify it later?",
      reason: "The user hinted at source material that can preserve provenance.",
    },
  ],
  completionCriteria: [
    "Required story slots have user-stated answers.",
    "Team outcomes are separated from the user's direct contribution.",
    "Impact is either quantified, described directionally, or marked as needing confirmation.",
    "Any suggested framing is confirmed by the user before becoming a career fact.",
  ],
  guardrails: [
    "Do not invent metrics, ownership, seniority, employers, tools, regulations, or evidence.",
    "Do not pressure the user to claim business impact they cannot support.",
    "Do not turn team outcomes into individual facts without explicit confirmation.",
    "Ask for one missing slot at a time.",
    "Treat source material and conversation history as private.",
  ],
};

export const conversationFollowUpPlaybooks: ConversationFollowUpPlaybook[] = [defaultCareerStoryExcavationPlaybook];

export function getActiveConversationFollowUpPlaybooks(): ConversationFollowUpPlaybook[] {
  return conversationFollowUpPlaybooks.filter((playbook) => playbook.active);
}

export function getConversationFollowUpPlaybookById(id: EntityId): ConversationFollowUpPlaybook | undefined {
  return getActiveConversationFollowUpPlaybooks().find((playbook) => playbook.id === id);
}

export interface IndustryWorkflowContext {
  id: EntityId;
  label: string;
  typicalSteps: string[];
  commonMetrics: string[];
}

export interface IndustryMetricContext {
  id: EntityId;
  label: string;
  category: "business" | "product" | "risk" | "operations" | "people";
}

export interface IndustryContextPack {
  id: EntityId;
  label: string;
  version: number;
  active: boolean;
  summary: string;
  businessModels: string[];
  coreWorkflows: IndustryWorkflowContext[];
  keyMetrics: IndustryMetricContext[];
  stakeholders: string[];
  commonTools: string[];
  regulatoryConcerns: string[];
  achievementPatterns: string[];
  discoveryQuestions: string[];
  guardrails: string[];
  conversationFollowUp: ConversationFollowUpPlaybook;
}

export interface RoleSeniorityContext {
  id: EntityId;
  label: string;
  expectedScope: string[];
}

export interface RoleContextPack {
  id: EntityId;
  label: string;
  version: number;
  active: boolean;
  seniorityLevels: RoleSeniorityContext[];
  coreResponsibilities: string[];
  impactDimensions: string[];
  storyPrompts: string[];
}

export type CareerFactType = "achievement" | "responsibility" | "skill" | "context";
export type CareerFactEvidenceStatus = "user_stated" | "source_supported" | "needs_confirmation";
export type CareerFactSensitivity = "private" | "shareable";

export interface CareerFact {
  id: EntityId;
  userId: EntityId;
  type: CareerFactType;
  userClaim: string;
  context: {
    industryId: EntityId;
    roleId: EntityId;
    workflowId?: EntityId;
  };
  evidenceStatus: CareerFactEvidenceStatus;
  sensitivity: CareerFactSensitivity;
  cvRelevance: string[];
  createdAt: Timestamp;
}

export interface ToCareerFactFromUserClaimInput {
  id: EntityId;
  userId: EntityId;
  claim: string;
  industryId: EntityId;
  roleId: EntityId;
  workflowId?: EntityId;
  now: Timestamp;
}

export const industryContextPacks: IndustryContextPack[] = [
  {
    id: "fintech",
    label: "Fintech",
    version: 1,
    active: true,
    summary: "Financial products delivered through software, data, and regulated operational workflows.",
    businessModels: ["Payments", "Lending", "Wealth management", "B2B financial infrastructure"],
    coreWorkflows: [
      {
        id: "user-onboarding",
        label: "User onboarding",
        typicalSteps: ["KYC", "Risk scoring", "Account activation"],
        commonMetrics: ["conversion rate", "KYC pass rate", "time to activation"],
      },
      {
        id: "transaction-monitoring",
        label: "Transaction monitoring",
        typicalSteps: ["Transaction event capture", "Rule or model scoring", "Review and escalation"],
        commonMetrics: ["fraud rate", "false positive rate", "chargeback rate"],
      },
    ],
    keyMetrics: [
      { id: "revenue", label: "Revenue", category: "business" },
      { id: "transaction-volume", label: "Transaction volume", category: "business" },
      { id: "activation", label: "Activation", category: "product" },
      { id: "retention", label: "Retention", category: "product" },
      { id: "fraud-rate", label: "Fraud rate", category: "risk" },
      { id: "compliance-incidents", label: "Compliance incidents", category: "risk" },
    ],
    stakeholders: ["customers", "risk team", "compliance", "engineering", "operations", "banking partners"],
    commonTools: ["KYC providers", "payment gateways", "risk engines", "analytics dashboards"],
    regulatoryConcerns: ["data privacy", "KYC/AML", "auditability", "consumer protection"],
    achievementPatterns: [
      "Reduced onboarding drop-off by X%",
      "Improved fraud detection while preserving approval rate",
      "Launched a compliant payment flow across markets",
    ],
    discoveryQuestions: [
      "Did you influence conversion, approval rate, fraud, or compliance?",
      "Which risk, compliance, operations, or banking stakeholders were involved?",
      "What before-and-after metric proves the workflow improved?",
    ],
    guardrails: [
      "Do not invent metrics, employers, tools, regulations, or regulated responsibilities.",
      "Use fintech context only to ask better questions and propose user-confirmed framings.",
    ],
    conversationFollowUp: {
      ...defaultCareerStoryExcavationPlaybook,
      id: "fintech-career-story-excavation",
      label: "Fintech career story excavation",
      storySlots: [
        ...defaultCareerStoryExcavationPlaybook.storySlots,
        {
          id: "regulated-workflow-context",
          label: "Regulated workflow context",
          required: true,
          question: "Which regulated workflow, risk decision, or compliance constraint shaped this work?",
          captureTargets: ["regulated workflow", "risk constraint", "compliance context"],
          followUpHints: [
            "Ask what the user actually did before framing compliance responsibility.",
            "Separate product, operations, risk, and compliance ownership.",
          ],
        },
      ],
      triggers: [
        {
          id: "compliance-or-risk-claim",
          targetSlotId: "regulated-workflow-context",
          priority: 110,
          whenUserMentions: ["compliance", "risk", "kyc", "aml", "fraud", "approval rate"],
          question: "Which regulated workflow, risk decision, or compliance constraint shaped this work?",
          reason: "Fintech stories need careful context before claiming regulated responsibility.",
        },
        ...defaultCareerStoryExcavationPlaybook.triggers,
      ],
      guardrails: [
        "Do not invent metrics, employers, tools, regulations, or regulated responsibilities.",
        "Do not imply the user owned compliance or risk unless they explicitly state it.",
        ...defaultCareerStoryExcavationPlaybook.guardrails,
      ],
    },
  },
];

export const roleContextPacks: RoleContextPack[] = [
  {
    id: "product-manager",
    label: "Product Manager",
    version: 1,
    active: true,
    seniorityLevels: [
      {
        id: "junior",
        label: "Junior",
        expectedScope: ["feature delivery", "user research support", "metrics tracking"],
      },
      {
        id: "senior",
        label: "Senior",
        expectedScope: ["strategy", "cross-functional leadership", "roadmap ownership"],
      },
      {
        id: "lead",
        label: "Lead",
        expectedScope: ["portfolio direction", "business outcomes", "team process leadership"],
      },
    ],
    coreResponsibilities: [
      "problem discovery",
      "prioritization",
      "roadmap planning",
      "stakeholder alignment",
      "delivery coordination",
      "metric ownership",
    ],
    impactDimensions: ["revenue", "activation", "retention", "efficiency", "risk reduction", "customer satisfaction"],
    storyPrompts: [
      "Have you had to trade off user experience against business or risk constraints?",
      "Have you changed a roadmap based on insight or data?",
      "Which metric did you use to decide whether the feature worked?",
    ],
  },
];

export function getActiveIndustryContextPacks(): IndustryContextPack[] {
  return industryContextPacks.filter((pack) => pack.active);
}

export function getIndustryContextPackById(id: EntityId): IndustryContextPack | undefined {
  return getActiveIndustryContextPacks().find((pack) => pack.id === id);
}

export function getActiveRoleContextPacks(): RoleContextPack[] {
  return roleContextPacks.filter((pack) => pack.active);
}

export function getRoleContextPackById(id: EntityId): RoleContextPack | undefined {
  return getActiveRoleContextPacks().find((pack) => pack.id === id);
}

export function toCareerFactFromUserClaim(input: ToCareerFactFromUserClaimInput): CareerFact {
  const context: CareerFact["context"] = {
    industryId: input.industryId,
    roleId: input.roleId,
    ...(input.workflowId ? { workflowId: input.workflowId } : {}),
  };

  return {
    id: input.id,
    userId: input.userId,
    type: "achievement",
    userClaim: input.claim.trim(),
    context,
    evidenceStatus: "user_stated",
    sensitivity: "private",
    cvRelevance: ["industry_context", "role_context", ...(input.workflowId ? ["workflow_context"] : [])],
    createdAt: input.now,
  };
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
