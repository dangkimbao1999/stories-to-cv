"use client";

import {
  createKnowledgeAssetFromSession,
  markSessionKnowledgeBaseSelection,
  type SessionSummaryMessage,
  type SessionSummarySource,
  summarizeSessionForKnowledgeBase,
} from "@stories/domain";
import { useEffect, useRef, useState } from "react";
import { demoNow, getDemoSession, getDemoSessionMessages, getSessionDomainLabel } from "../session-demo-data";

export function ChatSessionClient({ sessionId }: { sessionId: string }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [session, setSession] = useState(() => getDemoSession(sessionId));
  const [messages, setMessages] = useState<SessionSummaryMessage[]>(() => getDemoSessionMessages(session));
  const [sources, setSources] = useState<SessionSummarySource[]>([]);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [sourceText, setSourceText] = useState("");
  const [saveNotice, setSaveNotice] = useState("");
  const draftMessageRef = useRef<HTMLTextAreaElement>(null);
  const sourceTextRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  function sendMessage() {
    const userMessage = draftMessageRef.current?.value.trim() ?? "";

    if (userMessage.length === 0) {
      return;
    }

    if (draftMessageRef.current) {
      draftMessageRef.current.value = "";
    }

    setMessages((current) => [
      ...current,
      { role: "user", content: userMessage },
      {
        role: "assistant",
        content: "Got it. What measurable result, scope, or stakeholder detail should we attach to that story?",
      },
    ]);
  }

  function attachSource() {
    const extractedText = (sourceTextRef.current?.value ?? sourceText).trim();

    if (extractedText.length === 0) {
      return;
    }

    setSources((current) => [...current, { name: "attached-source.txt", extractedText }]);
    setSourceText("");
    setIsAttachOpen(false);

    if (sourceTextRef.current) {
      sourceTextRef.current.value = "";
    }
  }

  function saveToKnowledgeBase() {
    const selectedSession = session.selectedForKnowledgeBase
      ? session
      : markSessionKnowledgeBaseSelection(session, true);
    const conclusion = summarizeSessionForKnowledgeBase({ messages, sources });
    const asset = createKnowledgeAssetFromSession({
      id: "asset-current-session",
      session: selectedSession,
      summary: conclusion.summary,
      facts: conclusion.facts,
      now: demoNow,
    });

    setSession(selectedSession);
    setSaveNotice(`Saved ${asset.facts.length} facts to your knowledge base.`);
  }

  return (
    <div className="interviewer-layout">
      <section className="workspace-panel chat-panel">
        <header className="chat-title">
          <div>
            <h1>The Biographer</h1>
            <p>Active Session</p>
          </div>
          <span className="status-pill">Live excavation</span>
        </header>

        <section className="chat-conversation" aria-label="Chat conversation">
          <div className="conversation-log">
            {messages.map((message) => (
              <div key={`${message.role}-${message.content}`} className={`message-row ${message.role}`}>
                <strong>{message.role === "assistant" ? "AI" : "You"}</strong>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="chat-composer" aria-label="Chat composer">
          {isAttachOpen ? (
            <div className="inline-attachment">
              <textarea
                aria-label="Extracted source text"
                onChange={(event) => setSourceText(event.target.value)}
                placeholder="Paste text extracted from a PDF, DOCX, Markdown, or plain text file"
                ref={sourceTextRef}
                value={sourceText}
              />
              <button type="button" disabled={!isHydrated} onClick={attachSource}>
                Use source
              </button>
            </div>
          ) : null}

          {sources.length > 0 ? (
            <p className="composer-status">{sources.length} source attached to this session.</p>
          ) : null}
          {saveNotice ? <p className="composer-status">{saveNotice}</p> : null}

          <textarea aria-label="Session message" ref={draftMessageRef} placeholder="Message Stories to CV" />
          <div className="composer-toolbar">
            <button type="button" disabled={!isHydrated} onClick={() => setIsAttachOpen((current) => !current)}>
              Attach file
            </button>
            <button type="button" disabled={!isHydrated} onClick={saveToKnowledgeBase}>
              Save to my knowledge base
            </button>
            <button className="primary-action compact" type="button" disabled={!isHydrated} onClick={sendMessage}>
              Send
            </button>
          </div>
        </section>
      </section>

      <aside className="workspace-panel extraction-panel">
        <div>
          <h2>Knowledge Extracted</h2>
          <p>Real-time analysis of your responses.</p>
        </div>
        <div className="fact-list">
          <article>
            <p className="system-label">Context</p>
            <p>{getSessionDomainLabel(session)}.</p>
          </article>
          <article>
            <p className="system-label">Project</p>
            <p>{session.intent.replaceAll("_", " ")}.</p>
          </article>
          <article>
            <p className="system-label">Collaboration</p>
            <p>Navigating stakeholders while preserving the measurable business result.</p>
          </article>
          <article className="highlight-fact">
            <p className="system-label">Strategic asset</p>
            <p>Five years building RAG and LLM support automation systems.</p>
            <button type="button">Add to Knowledge Base</button>
          </article>
        </div>
        <div className="growth-box">
          <h3>Growth suggestions</h3>
          <p>Add conversion, response-time, or budget details to make this story CV-ready.</p>
        </div>
      </aside>
    </div>
  );
}
