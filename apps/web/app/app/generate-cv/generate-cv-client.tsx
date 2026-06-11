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
    <div className="section-stack">
      <header className="section-header">
        <div>
          <p className="eyebrow">Generate CV</p>
          <h2>CV generation sessions</h2>
        </div>
        <button className="primary-action compact" type="button" onClick={generateCv}>
          Generate CV
        </button>
      </header>

      <section className="workspace-panel" aria-label="JD intake">
        <div>
          <p className="eyebrow">JD intake</p>
          <h2>Target job</h2>
        </div>
        <label>
          JD link
          <input onChange={(event) => setJdUrl(event.target.value)} value={jdUrl} />
        </label>
        <label>
          JD text
          <textarea aria-label="JD text" onChange={(event) => setJdText(event.target.value)} value={jdText} />
        </label>
      </section>

      <section className="workspace-panel" aria-label="Research and strategy">
        <div>
          <p className="eyebrow">Research summary</p>
          <h2>Company and role findings</h2>
        </div>
        <p>{preview.companyFindings}</p>
        <div className="checklist">
          {preview.missingInfoChecklist.map((item) => (
            <label key={item}>
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
        </div>
        <label>
          Refinement notes
          <textarea
            aria-label="Refinement notes"
            onChange={(event) => setRefinementNotes(event.target.value)}
            value={refinementNotes}
          />
        </label>
      </section>

      <section className="workspace-panel" aria-label="Generated CV versions">
        <div>
          <p className="eyebrow">Template V1</p>
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
