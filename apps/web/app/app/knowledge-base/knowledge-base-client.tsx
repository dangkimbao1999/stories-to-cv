"use client";

import Link from "next/link";
import { demoSessions, getSessionDomainLabel } from "./session-demo-data";

export function KnowledgeBaseClient() {
  return (
    <div className="section-stack">
      <header className="section-header">
        <div>
          <p className="eyebrow">Knowledge Base</p>
          <h2>Knowledge Base</h2>
          <p className="muted-copy">Your previous conversations live here as reusable career-story cards.</p>
        </div>
        <Link className="primary-action compact" href="/app/knowledge-base/new">
          New conversation
        </Link>
      </header>

      <section className="conversation-card-grid" aria-label="Previous conversations">
        {demoSessions.map((session) => {
          const domainLabel = getSessionDomainLabel(session);
          const intent = session.intent.replaceAll("_", " ");
          const label = session.selectedForKnowledgeBase
            ? `${domainLabel} ${intent} KB input`
            : `${domainLabel} ${intent}`;

          return (
            <Link
              key={session.id}
              aria-label={label}
              className="conversation-card"
              href={`/app/knowledge-base/${session.id}`}
            >
              <div className="card-heading">
                <h3>{domainLabel}</h3>
                {session.selectedForKnowledgeBase ? <span className="kb-badge">KB input</span> : null}
              </div>
              <p>{intent}</p>
              <span className="card-meta">{session.updatedAt}</span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
