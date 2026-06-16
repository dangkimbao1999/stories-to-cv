import Link from "next/link";

import { cvVersions } from "./cv-versions";

export default function ArchivePage() {
  return (
    <main className="cv-archive-shell">
      <section className="cv-archive-page">
        <div className="cv-archive-content">
          <header className="cv-archive-header">
            <h1>CV Archive</h1>
            <p>Access and manage your strategic CV versions tailored for specific roles and companies.</p>
          </header>

          <section className="cv-archive-controls" aria-label="Search and filter CV versions">
            <label className="cv-archive-search">
              <span className="material-symbols-outlined" aria-hidden="true">
                search
              </span>
              <span className="sr-only">Search CV versions</span>
              <input placeholder="Search by company or position..." type="search" />
            </label>

            <label className="cv-archive-select">
              <span className="sr-only">Optimization type</span>
              <select defaultValue="">
                <option value="">All Optimizations</option>
                <option value="ats">ATS-Optimized</option>
                <option value="recruiter">Recruiter-First</option>
                <option value="creative">Creative Format</option>
              </select>
              <span className="material-symbols-outlined" aria-hidden="true">
                expand_more
              </span>
            </label>
          </section>

          <section className="cv-archive-grid" aria-label="Saved CV versions">
            {cvVersions.map((version) => (
              <article
                className={version.featured ? "cv-archive-card featured" : "cv-archive-card"}
                key={version.company}
              >
                <div className="cv-card-header">
                  <div className="cv-card-title-row">
                    <div className="cv-company-icon">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {version.icon}
                      </span>
                    </div>
                    <div>
                      <h2>{version.company}</h2>
                      <p>{version.role}</p>
                    </div>
                  </div>
                  <div className={version.featured ? "cv-match-badge featured" : "cv-match-badge"}>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      {version.featured ? "offline_bolt" : "check_circle"}
                    </span>
                    <span>{version.match}</span>
                  </div>
                </div>

                <div className="cv-card-meta">
                  <p>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      calendar_today
                    </span>
                    {version.date}
                  </p>
                  <p>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      tune
                    </span>
                    <span className="cv-strategy-pill">{version.strategy}</span>
                  </p>
                </div>

                <div className="cv-card-actions">
                  <Link
                    aria-label={`View ${version.company} CV`}
                    className="cv-view-button"
                    href={`/app/archive/${version.slug}`}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      visibility
                    </span>
                    View
                  </Link>
                  <button aria-label={`Download ${version.company} PDF`} type="button">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      download
                    </span>
                  </button>
                  <button aria-label={`Duplicate ${version.company} CV`} type="button">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      content_copy
                    </span>
                  </button>
                </div>
              </article>
            ))}

            <a className="cv-archive-new-card" href="/app/generate-cv">
              <span aria-hidden="true">+</span>
              <h2>New CV Excavation</h2>
              <p>Start building a new tailored CV from your knowledge base.</p>
            </a>
          </section>
        </div>
      </section>
    </main>
  );
}
