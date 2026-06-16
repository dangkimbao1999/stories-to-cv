const assets = [
  { name: "Resume_2023.pdf", detail: "Uploaded Oct 12, 2023 - 2.4 MB" },
  { name: "Project_Brief_Stripe.md", detail: "Uploaded Sep 05, 2023 - 412 KB" },
  { name: "Performance_Review.docx", detail: "Uploaded Dec 20, 2023 - 1.1 MB" },
  { name: "Portfolio_Case_Study.pdf", detail: "Uploaded Jan 15, 2024 - 8.9 MB" },
];

export default function ProfilePage() {
  return (
    <div className="workspace-stack">
      <section className="profile-hero">
        <div className="profile-avatar" aria-hidden="true">
          MT
        </div>
        <div>
          <h1>Marcus Thorne</h1>
          <p>Senior Strategic Growth Manager</p>
          <a className="text-link" href="https://linkedin.com/in/mthorne">
            linkedin.com/in/mthorne
          </a>
        </div>
      </section>

      <section className="intelligence-grid">
        <article className="workspace-panel">
          <h2>Career Sync</h2>
          <p>Your professional narrative is being excavated. 84% of raw experiences are strategic assets.</p>
          <div className="progress-track">
            <span style={{ width: "84%" }} />
          </div>
          <p className="system-label">Excavated - Ready for CV Lab</p>
        </article>

        <article className="workspace-panel">
          <h2>Strategic Snapshot</h2>
          <blockquote>
            "I turn ambiguous growth bets into measurable operating rhythms across product, sales, and finance."
          </blockquote>
          <p>Attributed to the regional restructuring project at GlobalTech.</p>
        </article>

        <section className="workspace-panel span-2">
          <div className="panel-heading">
            <h2>Career Assets Library</h2>
            <button type="button">Upload</button>
          </div>
          <div className="asset-list">
            {assets.map((asset) => (
              <article className="asset-row" key={asset.name}>
                <div>
                  <h3>{asset.name}</h3>
                  <p>{asset.detail}</p>
                </div>
                <div className="button-row">
                  <button type="button">View</button>
                  <button type="button">Extract</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
