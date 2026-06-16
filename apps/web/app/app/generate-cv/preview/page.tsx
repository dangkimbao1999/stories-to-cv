import Link from "next/link";

import { CvLabShell } from "../cv-lab-shell";

const recommendations = [
  {
    icon: "school",
    text: 'Complete "API Product Management" on Reforge to address the explicit API design knowledge gap.',
    title: "Recommended Courses",
  },
  {
    icon: "rocket_launch",
    text: 'Publish a short case study on Medium detailing your last "0-to-1" feature launch.',
    title: "Targeted Side Projects",
  },
  {
    icon: "hub",
    text: "Stripe values high-fidelity written communication. Connect with current PMs by sharing thoughtful essays or technical blog posts.",
    title: "Networking Tips",
  },
  {
    icon: "forum",
    text: "Prepare deep-dive stories focusing on metric-driven revenue outcomes, a common hurdle in their loop.",
    title: "Interview Prep Focus",
  },
];

export default function GenerateCvPreviewPage() {
  return (
    <CvLabShell step={2}>
      <div className="cv-lab-step-two">
        <section className="cv-preview-panel">
          <header>
            <h2>
              <span className="material-symbols-outlined" aria-hidden="true">
                visibility
              </span>
              Generated CV Preview
            </h2>
            <button type="button">
              <span className="material-symbols-outlined" aria-hidden="true">
                download
              </span>
              Download PDF/Docx
            </button>
          </header>
          <div className="cv-document-stage">
            <div aria-label="Generated CV document preview" className="cv-document-skeleton" role="img">
              <div className="cv-skeleton-header">
                <span />
                <span />
              </div>
              <div className="cv-skeleton-section">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
          <Link className="cv-back-link" href="/app/generate-cv">
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_back
            </span>
            Back to Edit Source
          </Link>
        </section>

        <section className="cv-growth-panel">
          <div className="cv-preview-menu" aria-hidden="true" />
          <article className="cv-lab-panel">
            <header>
              <h2>
                <span className="material-symbols-outlined" aria-hidden="true">
                  lightbulb
                </span>
                Strategic Follow-ups &amp; Growth
              </h2>
            </header>
            <div className="cv-lab-panel-body">
              <p className="cv-growth-intro">Actionable steps to strengthen your candidacy for this role:</p>
              <div className="cv-growth-grid">
                {recommendations.map((item) => (
                  <article key={item.title}>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </article>
        </section>
      </div>
    </CvLabShell>
  );
}
