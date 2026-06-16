"use client";

import Link from "next/link";
import { useState } from "react";

const sessions = [
  {
    insights: ["STAR Method Complete", "3 Quantifiable Metrics", "+3 more"],
    meta: "2 days ago",
    role: "Senior Product Manager",
    title: "Payment Redesign Project",
  },
  {
    insights: ["Technical Architecture", "Cost Reduction Metrics", "+3 more"],
    meta: "Oct 15, 2023",
    role: "DevOps Architect",
    title: "Cloud Migration Strategy",
  },
];

export default function ExcavationHistoryPage() {
  const [openMenuTitle, setOpenMenuTitle] = useState<string | null>(null);

  return (
    <main className="excavation-shell">
      <section className="excavation-main">
        <header className="excavation-topbar">
          <div />
          <div className="excavation-topbar-actions">
            <button aria-label="Notifications" type="button">
              <span className="material-symbols-outlined" aria-hidden="true">
                notifications
              </span>
            </button>
            <button aria-label="Settings" type="button">
              <span className="material-symbols-outlined" aria-hidden="true">
                settings
              </span>
            </button>
            <img
              alt="Professional user profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjLNGJAQx4IFZr_Yh5BVn_uyYBX1JrlgXOn1W-zYGBZ5z_80mZc9_fiRWk7ZlBTKIxlLh-EOg0FKGEE0V54EKrbneyzurzfwgq_p_ucy4Y1qpK1STX9AmfGY4kIp__KpRVomC3CrEWMpb_kq6jzHHy6GFK_z2ECaotV8pR3zmUUCDa4gYeX6uviEQ_EyJxG36e93cVVA4IM0ECyLY6aT9g4Q8NYvZRNeXlzi06AqTObD779IS491IrVCrmzhHJrQV0aa_yT058R7oT"
            />
          </div>
        </header>

        <div className="excavation-canvas">
          <header className="excavation-page-header">
            <div>
              <h1>Excavation History</h1>
              <p>
                Review past AI Interviewer sessions, extract key insights, and continue drafting your professional
                narrative.
              </p>
            </div>
            <Link href="/app/knowledge-base/new">
              <span className="material-symbols-outlined" aria-hidden="true">
                mic
              </span>
              Start New Excavation
            </Link>
          </header>

          <section className="excavation-controls" aria-label="Search and filters">
            <label className="excavation-search">
              <span className="sr-only">Search sessions</span>
              <span className="material-symbols-outlined" aria-hidden="true">
                search
              </span>
              <input placeholder="Search sessions, roles, or insights..." type="search" />
            </label>
            <div className="excavation-filters">
              <button type="button">
                <span className="material-symbols-outlined" aria-hidden="true">
                  filter_list
                </span>
                All Roles
              </button>
              <button type="button">
                <span className="material-symbols-outlined" aria-hidden="true">
                  calendar_today
                </span>
                Any Date
              </button>
              <button type="button">
                <span className="material-symbols-outlined" aria-hidden="true">
                  check_circle
                </span>
                Status
              </button>
            </div>
          </section>

          <section className="excavation-session-grid" aria-label="Excavation sessions">
            {sessions.map((session) => (
              <article className="excavation-session-card" key={session.title}>
                <button
                  aria-controls={`excavation-actions-${session.title.replace(/\s+/g, "-").toLowerCase()}`}
                  aria-expanded={openMenuTitle === session.title}
                  aria-label="More actions"
                  className="excavation-more-button"
                  onClick={() => setOpenMenuTitle(openMenuTitle === session.title ? null : session.title)}
                  type="button"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    more_vert
                  </span>
                </button>
                {openMenuTitle === session.title ? (
                  <div
                    className="excavation-menu"
                    id={`excavation-actions-${session.title.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    <button type="button">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        edit
                      </span>
                      Rename
                    </button>
                    <button type="button">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        share
                      </span>
                      Share
                    </button>
                    <button className="danger" type="button">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        delete
                      </span>
                      Delete
                    </button>
                  </div>
                ) : null}
                <div className="excavation-session-heading">
                  <h2>{session.title}</h2>
                  <p>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      event
                    </span>
                    {session.meta}
                    <span aria-hidden="true">•</span>
                    {session.role}
                  </p>
                </div>
                <div className="excavation-insights">
                  <h3>Key Insights Extracted</h3>
                  <div>
                    {session.insights.map((insight) => (
                      <span className={insight.startsWith("+") ? "more" : undefined} key={insight}>
                        {insight}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}

            <article className="excavation-empty-card">
              <div>
                <span className="material-symbols-outlined" aria-hidden="true">
                  history_edu
                </span>
              </div>
              <h2>Unearth More Stories</h2>
              <p>Every project has hidden value. Let the AI Interviewer help you find it.</p>
              <Link href="/app/knowledge-base/new">
                Start Excavation
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </Link>
            </article>
          </section>

          <div className="excavation-load-more">
            <button type="button">Load Older Sessions</button>
          </div>
        </div>
      </section>
    </main>
  );
}
