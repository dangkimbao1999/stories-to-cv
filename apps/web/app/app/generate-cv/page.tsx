import Link from "next/link";

import { CvLabShell } from "./cv-lab-shell";

export default function GenerateCvPage() {
  return (
    <CvLabShell step={1}>
      <div className="cv-lab-step-one">
        <section className="cv-lab-left-stack">
          <article className="cv-lab-panel">
            <header>
              <h2>
                <span className="material-symbols-outlined" aria-hidden="true">
                  input
                </span>
                Job Source Intake
              </h2>
            </header>
            <div className="cv-lab-panel-body">
              <div className="cv-lab-tabs" aria-label="Intake mode" role="tablist">
                <button aria-selected="true" className="active" role="tab" type="button">
                  Paste Text
                </button>
                <button aria-selected="false" role="tab" type="button">
                  Upload File
                </button>
                <button aria-selected="false" role="tab" type="button">
                  Job URL
                </button>
              </div>

              <label className="cv-lab-job-text">
                <span className="sr-only">Job description</span>
                <textarea placeholder="Paste the job description here..." />
              </label>

              <div className="cv-lab-panel-actions">
                <button type="button">Extract Requirements</button>
              </div>
            </div>
          </article>

          <article className="cv-lab-panel">
            <header>
              <h2>
                <span className="material-symbols-outlined" aria-hidden="true">
                  verified
                </span>
                Job Profile Confirmation
              </h2>
            </header>
            <div className="cv-lab-panel-body">
              <dl className="cv-lab-job-profile">
                <div>
                  <dt>COMPANY</dt>
                  <dd>Stripe</dd>
                </div>
                <div>
                  <dt>POSITION TITLE</dt>
                  <dd>Senior Product Manager</dd>
                </div>
                <div>
                  <dt>EXPERIENCE LEVEL</dt>
                  <dd>Senior</dd>
                </div>
              </dl>

              <label className="cv-lab-summary">
                <span>KEY REQUIREMENTS SUMMARY</span>
                <textarea defaultValue="Looking for a seasoned PM to lead B2B payment API initiatives. Must have strong cross-functional leadership skills, experience taking products from 0-to-1, and a track record of driving measurable revenue growth in a SaaS environment." />
              </label>

              <section className="cv-lab-strategy" aria-label="Generation optimization strategy">
                <h3>GENERATION OPTIMIZATION STRATEGY</h3>
                <div>
                  <label>
                    <input defaultChecked name="optimization-mode" type="radio" />
                    Recruiter-First
                  </label>
                  <label>
                    <input name="optimization-mode" type="radio" />
                    ATS-Optimized
                  </label>
                  <label>
                    <input name="optimization-mode" type="radio" />
                    Impact-Heavy
                  </label>
                </div>
              </section>

              <div className="cv-lab-panel-actions">
                <Link href="/app/generate-cv/preview">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    check_circle
                  </span>
                  Confirm &amp; Proceed
                </Link>
              </div>
            </div>
          </article>
        </section>

        <aside className="cv-lab-next-rail" aria-label="Next step">
          <Link href="/app/generate-cv/preview" aria-label="Next: Review & Generate">
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
          <p>Next: Review &amp; Generate</p>
        </aside>
      </div>
    </CvLabShell>
  );
}
