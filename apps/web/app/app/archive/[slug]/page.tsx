import Link from "next/link";
import { notFound } from "next/navigation";

import { CvLabShell } from "../../generate-cv/cv-lab-shell";
import { cvVersions } from "../cv-versions";

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

export function generateStaticParams() {
  return cvVersions.map((version) => ({ slug: version.slug }));
}

export default async function ArchivedCvDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const version = cvVersions.find((item) => item.slug === slug);

  if (!version) {
    notFound();
  }

  return (
    <CvLabShell
      showStepper={false}
      subtitle={`${version.date} · ${version.match} · ${version.strategy}`}
      title={`${version.company} CV - ${version.role}`}
    >
      <div className="cv-lab-step-two cv-archive-detail-layout">
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
            <div aria-label={`${version.company} generated CV preview`} className="cv-document-skeleton" role="img">
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

          <Link className="cv-back-link" href="/app/archive">
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_back
            </span>
            Back to CV Archive
          </Link>
        </section>

        <aside className="cv-archive-detail-panel" aria-label="Archived CV information">
          <article aria-label="CV Information" className="cv-lab-panel">
            <header>
              <h2>
                <span className="material-symbols-outlined" aria-hidden="true">
                  description
                </span>
                CV Information
              </h2>
            </header>
            <div className="cv-lab-panel-body">
              <dl className="cv-detail-list">
                <div>
                  <dt>Company</dt>
                  <dd>{version.company}</dd>
                </div>
                <div>
                  <dt>Position</dt>
                  <dd>{version.role}</dd>
                </div>
                <div>
                  <dt>Match score</dt>
                  <dd>{version.match}</dd>
                </div>
                <div>
                  <dt>Generated</dt>
                  <dd>{version.date.replace("Generated ", "")}</dd>
                </div>
                <div>
                  <dt>Optimization</dt>
                  <dd>{version.strategy}</dd>
                </div>
              </dl>

              <button aria-label="Download archived CV" className="cv-detail-download" type="button">
                <span className="material-symbols-outlined" aria-hidden="true">
                  download
                </span>
                Download PDF/Docx
              </button>
            </div>
          </article>

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
        </aside>
      </div>
    </CvLabShell>
  );
}
