"use client";

const projects = [
  {
    category: "Major Initiative",
    source: "Source: Conversation Dec 12, 'Strategic Initiatives'",
    title: "Payment Flow Redesign",
    summary: "Led cross-functional team to overhaul checkout experience, reducing cart abandonment by 14% over Q3.",
    tags: ["UX Strategy", "Conversion"],
  },
  {
    category: "Strategic Shift",
    source: "Source: Conversation Jan 05, 'Market Expansion'",
    title: "Global Expansion Strategy",
    summary:
      "Developed market entry plan for EMEA region, identifying key regulatory hurdles and partnership opportunities.",
    tags: ["Go-to-Market", "EMEA"],
  },
  {
    category: "Process Improvement",
    source: "Source: Conversation Nov 20, 'Growth Metrics'",
    title: "User Onboarding Optimization",
    summary:
      "Streamlined initial sign-up flow, implementing progressive profiling that increased Day 1 retention metrics.",
    tags: ["Product Growth", "Data Analysis"],
    wide: true,
  },
];

const skills = [
  { confidence: 95, label: "Product Strategy" },
  { confidence: 90, label: "Stakeholder Management" },
  { confidence: 85, label: "Agile Methodologies" },
];

const achievements = [
  {
    source: "Source: Growth Chat Q2",
    text: "Scaled user base from 10k to 50k MAU within 6 months.",
  },
  {
    source: "Source: Budget Review",
    text: "Secured $2M budget approval for new enterprise tier development.",
  },
];

const growthOpportunities = [
  {
    badge: "High Priority",
    icon: "trending_up",
    label: "Advanced Cloud Architecture",
    text: "Recommendation to add specific certifications (AWS/Azure) to validate expertise.",
  },
  {
    badge: "Knowledge Gap",
    icon: "lightbulb",
    label: "System Design Patterns",
    text: "Supplement profile with recent project examples demonstrating scalable architecture.",
  },
  {
    badge: "Improvement",
    icon: "groups",
    label: "Team Leadership",
    text: "Highlight mentoring experience and cross-functional coordination in your next update.",
  },
];

export function KnowledgeBaseClient() {
  return (
    <div className="knowledge-screen">
      <header className="knowledge-header">
        <div>
          <h1>Your Career Intelligence</h1>
          <p>
            <span className="material-symbols-outlined" aria-hidden="true">
              check_circle
            </span>
            45 facts excavated
          </p>
        </div>
        <label className="knowledge-search">
          <span className="sr-only">Search career intelligence</span>
          <span className="material-symbols-outlined" aria-hidden="true">
            search
          </span>
          <input placeholder="Search projects, skills, achievements..." type="search" />
        </label>
      </header>

      <div className="knowledge-grid">
        <section className="knowledge-projects" aria-labelledby="excavated-projects-heading">
          <h2 id="excavated-projects-heading">Excavated Projects</h2>
          <div className="knowledge-project-grid">
            {projects.map((project) => (
              <article className={project.wide ? "knowledge-card wide" : "knowledge-card"} key={project.title}>
                <div className="knowledge-card-topline">
                  <p>{project.category}</p>
                  <span className="material-symbols-outlined" title={project.source}>
                    history_edu
                  </span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className="knowledge-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="knowledge-side-column">
          <section className="knowledge-section" aria-labelledby="verified-skills-heading">
            <div className="knowledge-section-heading">
              <h2 id="verified-skills-heading">Verified Skills</h2>
              <span>Confidence</span>
            </div>
            <ul className="skill-meter-list">
              {skills.map((skill) => (
                <li key={skill.label}>
                  <span>{skill.label}</span>
                  <div className="skill-meter">
                    <div aria-hidden="true">
                      <span style={{ width: `${skill.confidence}%` }} />
                    </div>
                    <strong>{skill.confidence}%</strong>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="knowledge-section" aria-labelledby="key-achievements-heading">
            <h2 id="key-achievements-heading">Key Achievements</h2>
            <div className="achievement-card">
              {achievements.map((achievement) => (
                <article key={achievement.text}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    hotel_class
                  </span>
                  <div>
                    <p>{achievement.text}</p>
                    <small>{achievement.source}</small>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="knowledge-section" aria-labelledby="growth-opportunities-heading">
            <h2 id="growth-opportunities-heading">Growth Opportunities</h2>
            <div className="growth-card">
              {growthOpportunities.map((opportunity) => (
                <article key={opportunity.label}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {opportunity.icon}
                  </span>
                  <div>
                    <div className="growth-title-row">
                      <h3>{opportunity.label}</h3>
                      <strong>{opportunity.badge}</strong>
                    </div>
                    <p>{opportunity.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
