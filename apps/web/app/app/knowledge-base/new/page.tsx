const extractedFacts = [
  {
    action: "Add to Knowledge Base",
    icon: "group",
    kind: "SKILL DETECTED",
    title: "Stakeholder Management",
    text: "Navigating daily syncs with legal/compliance teams alongside development sprints.",
  },
  {
    action: "Add to Knowledge Base",
    accent: true,
    icon: "military_tech",
    kind: "ACHIEVEMENT DRAFT",
    title: "Payment Flow Redesign",
    text: "Successfully executed payment flow redesign under tight 3-month deadline while maintaining strict PCI compliance through parallelized auditing processes.",
  },
];

const growthSuggestions = [
  {
    icon: "trending_up",
    title: "Quantifiable Metrics",
    text: "Consider adding specific percentage increases in conversion or budget savings achieved through the Payment Flow redesign.",
  },
  {
    icon: "schema",
    title: "Technical Architecture",
    text: "Elaborate on the specific PCI DSS protocols or encryption standards implemented during the parallelized audit process.",
  },
];

export default function NewKnowledgeExcavationPage() {
  return (
    <main className="live-excavation-shell">
      <section className="live-chat-pane" aria-label="AI interviewer conversation">
        <header className="live-chat-header">
          <div className="live-agent-lockup">
            <div aria-hidden="true" className="live-agent-icon">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <div>
              <h2>The Biographer</h2>
              <p>Active Session</p>
            </div>
          </div>
          <button aria-label="Session actions" type="button">
            <span className="material-symbols-outlined" aria-hidden="true">
              more_vert
            </span>
          </button>
        </header>

        <div className="live-chat-scroll">
          <div className="live-session-pill">Interview Session Started - Payment Redesign Project</div>

          <div className="live-message-row assistant">
            <div aria-hidden="true" className="live-message-avatar">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <div className="live-message-bubble">
              <p>
                Hi! I see you worked as a Product Manager at TechFlow. In that 'Payment Redesign' project, what was the
                biggest constraint you faced, and how did it affect your decision-making?
              </p>
            </div>
          </div>

          <div className="live-message-row user">
            <div className="live-message-bubble">
              <p>
                The main constraint was a 3-month deadline while needing to maintain PCI compliance. This forced us to
                parallelize the compliance audit with development, leading to daily syncs with legal rather than waiting
                for end-of-sprint reviews.
              </p>
            </div>
          </div>

          <div className="live-message-row assistant typing">
            <div aria-hidden="true" className="live-message-avatar">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <div aria-label="The Biographer is typing" className="live-typing-bubble" role="status">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <section className="live-composer" aria-label="Chat composer">
          <label>
            <span className="sr-only">Type your response</span>
            <textarea placeholder="Type your response..." rows={1} />
          </label>
          <div className="live-composer-toolbar">
            <div>
              <button aria-label="Attach document" type="button">
                <span className="material-symbols-outlined" aria-hidden="true">
                  attach_file
                </span>
              </button>
              <button aria-label="Voice mode" type="button">
                <span className="material-symbols-outlined" aria-hidden="true">
                  mic
                </span>
              </button>
              <button aria-label="Knowledge retrieval" type="button">
                <span className="material-symbols-outlined" aria-hidden="true">
                  database
                </span>
              </button>
            </div>
            <button aria-label="Send" className="live-send-button" type="button">
              <span className="material-symbols-outlined" aria-hidden="true">
                send
              </span>
            </button>
          </div>
          <p>Press Enter to send, Shift+Enter for new line</p>
        </section>
      </section>

      <aside className="live-extraction-pane" aria-label="Knowledge extracted">
        <div className="live-extraction-content">
          <header className="live-extraction-header">
            <h2>Knowledge Extracted</h2>
            <p>Real-time analysis of your responses.</p>
          </header>

          <section className="live-progress-card" aria-labelledby="star-progress-heading">
            <div className="live-card-kicker">
              <span className="material-symbols-outlined" aria-hidden="true">
                track_changes
              </span>
              <h3 id="star-progress-heading">STAR METHOD PROGRESS</h3>
            </div>

            <div className="live-star-timeline">
              <article className="complete">
                <span aria-hidden="true" />
                <h4>Situation</h4>
                <p>TechFlow Product Manager.</p>
              </article>
              <article className="active">
                <span aria-hidden="true" />
                <h4>
                  Task <em>Excavating...</em>
                </h4>
                <p>Payment Redesign under constraints.</p>
              </article>
              <article className="muted">
                <span aria-hidden="true" />
                <h4>Action</h4>
                <p>Awaiting details...</p>
              </article>
              <article className="muted">
                <span aria-hidden="true" />
                <h4>Result</h4>
                <p>Awaiting details...</p>
              </article>
            </div>
          </section>

          {extractedFacts.map((fact) => (
            <section className={fact.accent ? "live-fact-card accent" : "live-fact-card"} key={fact.title}>
              <p className="live-fact-kind">{fact.kind}</p>
              <div className="live-fact-body">
                <span className="material-symbols-outlined" aria-hidden="true">
                  {fact.icon}
                </span>
                <div>
                  <h3>{fact.title}</h3>
                  <p>{fact.text}</p>
                </div>
              </div>
              <button type="button">
                <span aria-hidden="true">+</span>
                {fact.action}
              </button>
            </section>
          ))}

          <section className="live-growth-card" aria-label="Growth and improvements">
            <p className="live-growth-kind">GROWTH &amp; IMPROVEMENTS</p>
            <div className="live-growth-list">
              {growthSuggestions.map((suggestion) => (
                <article key={suggestion.title}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {suggestion.icon}
                  </span>
                  <div>
                    <h3>{suggestion.title}</h3>
                    <p>{suggestion.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </main>
  );
}
