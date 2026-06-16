"use client";

import { type GeneratedCvVersion, generateTemplateCvVersion } from "@stories/domain";
import { useState } from "react";

const seededFacts = [
  "Five years building RAG systems for support teams",
  "Led AI support automation project with measurable response-time impact",
  "Comfortable translating messy career evidence into concise CV proof points",
];

export function GenerateCvClient() {
  const [jdText, setJdText] = useState(
    "AI Engineer role focused on RAG systems, LLM evaluation, and customer support automation.",
  );
  const [jdUrl, setJdUrl] = useState("https://example.com/jobs/ai-engineer");
  const [refinementNotes, setRefinementNotes] = useState("Emphasize RAG, evaluation, and support automation outcomes.");
  const [versions, setVersions] = useState<GeneratedCvVersion[]>([]);

  const preview = generateTemplateCvVersion({
    id: "preview",
    templateId: "simple-v1",
    jdText,
    refinementNotes,
    userFacts: seededFacts,
    now: "2026-06-11T10:00:00.000Z",
  });

  function generateCv() {
    const version = generateTemplateCvVersion({
      id: `cv-version-${versions.length + 1}`,
      templateId: "simple-v1",
      jdText,
      refinementNotes,
      userFacts: seededFacts,
      now: "2026-06-11T10:00:00.000Z",
    });
    setVersions((current) => [version, ...current]);
  }

  return (
    <div className="workspace-stack">
      <header className="workspace-header">
        <div>
          <p className="system-label">CV Lab</p>
          <h1>CV Lab: Targeted Strategy</h1>
          <p>Compare your raw assets against specific job requirements before generating a version.</p>
        </div>
        <button className="primary-action compact" type="button" onClick={generateCv}>
          Generate CV
        </button>
      </header>

      <section className="cv-lab-grid">
        <div className="workspace-panel">
          <div className="panel-heading">
            <h2>Target job</h2>
            <span className="status-pill">Paste Text</span>
          </div>
          <label>
            JD link
            <input onChange={(event) => setJdUrl(event.target.value)} value={jdUrl} />
          </label>
          <label>
            JD text
            <textarea aria-label="JD text" onChange={(event) => setJdText(event.target.value)} value={jdText} />
          </label>
          <div className="button-row">
            <button type="button">Parse</button>
            <button className="primary-action compact" type="button">
              Extract Requirements
            </button>
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-heading">
            <h2>Role summary</h2>
            <span className="status-pill muted">Stripe</span>
          </div>
          <dl className="summary-list">
            <div>
              <dt>Company</dt>
              <dd>Stripe</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>Senior Product Manager</dd>
            </div>
            <div>
              <dt>Seniority</dt>
              <dd>Senior</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="workspace-panel" aria-label="Research and strategy">
        <div className="panel-heading">
          <div>
            <p className="system-label">Knowledge Base Match</p>
            <h2>Strategy preview</h2>
          </div>
          <button type="button">Refresh match</button>
        </div>
        <p>{preview.companyFindings}</p>
        <div className="strategy-grid">
          <div>
            <h3>Actionable gaps</h3>
            <div className="checklist">
              {preview.missingInfoChecklist.map((item) => (
                <label key={item}>
                  <input type="checkbox" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
          <label>
            Refinement notes
            <textarea
              aria-label="Refinement notes"
              onChange={(event) => setRefinementNotes(event.target.value)}
              value={refinementNotes}
            />
          </label>
        </div>
      </section>

      <section className="workspace-panel" aria-label="Generated CV versions">
        <div>
          <p className="system-label">Template V1</p>
          <h2>Generated CV versions</h2>
        </div>
        {versions.length > 0 ? (
          <div className="cv-version-list">
            {versions.map((version) => (
              <article key={version.id} className="cv-version">
                <div className="section-header">
                  <div>
                    <h3>{version.structuredContent.headline}</h3>
                    <p>Template: {version.templateId}</p>
                  </div>
                  <button type="button">Download</button>
                </div>
                <pre>{version.renderedText}</pre>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted-copy">Generate a CV to create the first stored template version.</p>
        )}
      </section>
    </div>
  );
}
