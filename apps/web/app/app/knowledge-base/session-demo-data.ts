import {
  type ChatSession,
  createChatSessionDraft,
  generateSessionOpener,
  getActiveDomainPacks,
  markSessionKnowledgeBaseSelection,
  type SessionSummaryMessage,
} from "@stories/domain";

export const demoNow = "2026-06-11T08:00:00.000Z";

export const demoSessions: ChatSession[] = [
  markSessionKnowledgeBaseSelection(
    createChatSessionDraft({
      id: "session-ai-impact",
      userId: "demo-user",
      domainId: "ai-engineering",
      skillIds: ["llm-apps", "rag"],
      intent: "capture_project_impact",
      now: demoNow,
    }),
    true,
  ),
  createChatSessionDraft({
    id: "session-career-notes",
    userId: "demo-user",
    domainId: "product-management",
    skillIds: ["discovery"],
    intent: "organize_existing_materials",
    now: demoNow,
  }),
];

export const demoMessagesBySessionId: Record<string, SessionSummaryMessage[]> = {
  "session-ai-impact": [
    { role: "assistant", content: "How many years of AI engineering experience do you have so far?" },
    { role: "user", content: "Five years building RAG and LLM support automation systems." },
  ],
  "session-career-notes": [{ role: "assistant", content: "Which product outcome are you proudest of influencing?" }],
};

export function getSessionDomainLabel(session: ChatSession): string {
  return getActiveDomainPacks().find((domain) => domain.id === session.domainId)?.label ?? session.domainId;
}

export function getDemoSession(sessionId: string): ChatSession {
  const existingSession = demoSessions.find((session) => session.id === sessionId);

  if (existingSession) {
    return existingSession;
  }

  const domain = getActiveDomainPacks()[0];
  const skillIds = domain?.skillClusters.slice(0, 2).map((skill) => skill.id) ?? ["llm-apps"];

  return createChatSessionDraft({
    id: "new",
    userId: "demo-user",
    domainId: domain?.id ?? "ai-engineering",
    skillIds,
    intent: "capture_experience",
    now: demoNow,
  });
}

export function getDemoSessionMessages(session: ChatSession): SessionSummaryMessage[] {
  const existingMessages = demoMessagesBySessionId[session.id];

  if (existingMessages) {
    return existingMessages;
  }

  return [
    {
      role: "assistant",
      content: generateSessionOpener({ domainId: session.domainId, skillIds: session.skillIds }),
    },
  ];
}
