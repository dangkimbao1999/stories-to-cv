"use client";

import {
  type ChatSession,
  createChatSessionDraft,
  createKnowledgeAssetFromSession,
  generateSessionOpener,
  getActiveDomainPacks,
  type KnowledgeAsset,
  markSessionKnowledgeBaseSelection,
  type SessionSummaryMessage,
  type SessionSummarySource,
  summarizeSessionForKnowledgeBase,
} from "@stories/domain";
import { useMemo, useState } from "react";

const now = "2026-06-11T08:00:00.000Z";

export function KnowledgeBaseClient() {
  const domains = useMemo(() => getActiveDomainPacks(), []);
  const [selectedDomainId, setSelectedDomainId] = useState(domains[0]?.id ?? "");
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([domains[0]?.skillClusters[0]?.id ?? ""]);
  const [activeSessionId, setActiveSessionId] = useState("session-ai-impact");
  const [draftMessage, setDraftMessage] = useState("");
  const [sourceName, setSourceName] = useState("career-notes.md");
  const [sourceText, setSourceText] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([
    markSessionKnowledgeBaseSelection(
      createChatSessionDraft({
        id: "session-ai-impact",
        userId: "demo-user",
        domainId: "ai-engineering",
        skillIds: ["llm-apps", "rag"],
        intent: "capture_project_impact",
        now,
      }),
      true,
    ),
    createChatSessionDraft({
      id: "session-career-notes",
      userId: "demo-user",
      domainId: "product-management",
      skillIds: ["discovery"],
      intent: "organize_existing_materials",
      now,
    }),
  ]);
  const [messagesBySessionId, setMessagesBySessionId] = useState<Record<string, SessionSummaryMessage[]>>({
    "session-ai-impact": [
      { role: "assistant", content: "How many years of AI engineering experience do you have so far?" },
      { role: "user", content: "Five years building RAG and LLM support automation systems." },
    ],
    "session-career-notes": [{ role: "assistant", content: "Which product outcome are you proudest of influencing?" }],
  });
  const [sourcesBySessionId, setSourcesBySessionId] = useState<Record<string, SessionSummarySource[]>>({});
  const [knowledgeAssets, setKnowledgeAssets] = useState<KnowledgeAsset[]>([]);

  const selectedDomain = domains.find((domain) => domain.id === selectedDomainId) ?? domains[0];
  const starterQuestion = generateSessionOpener({ domainId: selectedDomainId, skillIds: selectedSkillIds });
  const activeSession = sessions.find((session) => session.id === activeSessionId) ?? sessions[0];
  const activeMessages = activeSession ? (messagesBySessionId[activeSession.id] ?? []) : [];
  const activeSources = activeSession ? (sourcesBySessionId[activeSession.id] ?? []) : [];

  function createSession() {
    const sessionId = `session-${sessions.length + 1}`;
    setSessions((current) => [
      createChatSessionDraft({
        id: sessionId,
        userId: "demo-user",
        domainId: selectedDomainId,
        skillIds: selectedSkillIds.filter(Boolean),
        intent: "capture_experience",
        now,
      }),
      ...current,
    ]);
    setMessagesBySessionId((current) => ({
      ...current,
      [sessionId]: [{ role: "assistant", content: starterQuestion }],
    }));
    setActiveSessionId(sessionId);
  }

  function toggleSessionSelection(sessionId: string) {
    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? markSessionKnowledgeBaseSelection(session, !session.selectedForKnowledgeBase)
          : session,
      ),
    );
  }

  function sendMessage() {
    if (!activeSession || draftMessage.trim().length === 0) {
      return;
    }

    const userMessage = draftMessage.trim();
    setDraftMessage("");
    setMessagesBySessionId((current) => ({
      ...current,
      [activeSession.id]: [
        ...(current[activeSession.id] ?? []),
        { role: "user", content: userMessage },
        {
          role: "assistant",
          content: "Got it. What measurable result, scope, or stakeholder detail should we attach to that story?",
        },
      ],
    }));
  }

  function attachSource() {
    if (!activeSession || sourceText.trim().length === 0) {
      return;
    }

    setSourcesBySessionId((current) => ({
      ...current,
      [activeSession.id]: [
        ...(current[activeSession.id] ?? []),
        {
          name: sourceName.trim() || "uploaded-source.txt",
          extractedText: sourceText.trim(),
        },
      ],
    }));
    setSourceText("");
  }

  function saveToKnowledgeBase() {
    if (!activeSession) {
      return;
    }

    const selectedSession = activeSession.selectedForKnowledgeBase
      ? activeSession
      : markSessionKnowledgeBaseSelection(activeSession, true);
    const conclusion = summarizeSessionForKnowledgeBase({
      messages: messagesBySessionId[activeSession.id] ?? [],
      sources: sourcesBySessionId[activeSession.id] ?? [],
    });
    const asset = createKnowledgeAssetFromSession({
      id: `asset-${knowledgeAssets.length + 1}`,
      session: selectedSession,
      summary: conclusion.summary,
      facts: conclusion.facts,
      now,
    });

    setSessions((current) => current.map((session) => (session.id === activeSession.id ? selectedSession : session)));
    setKnowledgeAssets((current) => [
      {
        ...asset,
        summary: conclusion.summary,
      },
      ...current,
    ]);
  }

  return (
    <div className="section-stack">
      <header className="section-header">
        <div>
          <p className="eyebrow">Knowledge Base</p>
          <h2>Conversation sessions</h2>
        </div>
        <button className="primary-action compact" type="button" onClick={createSession}>
          New session
        </button>
      </header>

      <section className="session-builder" aria-label="New session context">
        <label>
          Domain
          <select value={selectedDomainId} onChange={(event) => setSelectedDomainId(event.target.value)}>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.label}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>Skills or topics</legend>
          <div className="skill-list">
            {selectedDomain?.skillClusters.map((skill) => (
              <label key={skill.id}>
                <input
                  checked={selectedSkillIds.includes(skill.id)}
                  type="checkbox"
                  value={skill.id}
                  onChange={(event) => {
                    setSelectedSkillIds(
                      event.target.checked
                        ? [...selectedSkillIds, skill.id]
                        : selectedSkillIds.filter((id) => id !== skill.id),
                    );
                  }}
                />
                <span>{skill.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="ai-opener">{starterQuestion}</p>
      </section>

      <div className="session-list">
        {sessions.map((session) => {
          const domain = domains.find((item) => item.id === session.domainId);
          return (
            <article
              key={session.id}
              className={session.id === activeSession?.id ? "session-card active" : "session-card"}
            >
              <div>
                <div className="card-heading">
                  <h3>{domain?.label ?? session.domainId}</h3>
                  {session.selectedForKnowledgeBase ? <span className="kb-badge">KB input</span> : null}
                </div>
                <p>{session.intent.replaceAll("_", " ")}</p>
              </div>
              <div className="session-actions">
                <button type="button" onClick={() => setActiveSessionId(session.id)}>
                  Open
                </button>
                <button type="button" onClick={() => toggleSessionSelection(session.id)}>
                  {session.selectedForKnowledgeBase ? "Remove from KB" : "Select for KB"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {activeSession ? (
        <section className="workspace-panel" aria-label="Active session">
          <div className="section-header">
            <div>
              <p className="eyebrow">Active session</p>
              <h2>{domains.find((domain) => domain.id === activeSession.domainId)?.label ?? activeSession.domainId}</h2>
            </div>
            <button className="primary-action compact" type="button" onClick={saveToKnowledgeBase}>
              Save to my knowledge base
            </button>
          </div>

          <div className="conversation-log">
            {activeMessages.map((message) => (
              <div key={`${message.role}-${message.content}`} className={`message-row ${message.role}`}>
                <strong>{message.role === "assistant" ? "AI" : "You"}</strong>
                <p>{message.content}</p>
              </div>
            ))}
          </div>

          <div className="composer-row">
            <textarea
              aria-label="Session message"
              onChange={(event) => setDraftMessage(event.target.value)}
              placeholder="Add a career story, project detail, or measurable result"
              value={draftMessage}
            />
            <button className="primary-action compact" type="button" onClick={sendMessage}>
              Send
            </button>
          </div>

          <div className="source-ingest">
            <label>
              Source name
              <input onChange={(event) => setSourceName(event.target.value)} value={sourceName} />
            </label>
            <label>
              Extracted source text
              <textarea
                aria-label="Extracted source text"
                onChange={(event) => setSourceText(event.target.value)}
                placeholder="Paste text extracted from a PDF, DOCX, Markdown, or plain text file"
                value={sourceText}
              />
            </label>
            <button type="button" onClick={attachSource}>
              Attach source
            </button>
            {activeSources.length > 0 ? (
              <p className="source-count">{activeSources.length} source attached to this session.</p>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="workspace-panel" aria-label="Knowledge assets">
        <div>
          <p className="eyebrow">Curated assets</p>
          <h2>Saved knowledge</h2>
        </div>
        {knowledgeAssets.length > 0 ? (
          <div className="asset-list">
            {knowledgeAssets.map((asset) => (
              <article key={asset.id} className="asset-row">
                <h3>{asset.summary}</h3>
                <p>Source session: {asset.sourceSessionId}</p>
                <p>{asset.facts.length} facts extracted</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted-copy">Save a selected session to create a curated knowledge-base asset.</p>
        )}
      </section>
    </div>
  );
}
