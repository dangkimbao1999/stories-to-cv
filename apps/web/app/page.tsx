import Link from "next/link";

export default function HomePage() {
  return (
    <main className="marketing-screen">
      <nav className="marketing-nav" aria-label="Marketing navigation">
        <Link className="brand-lockup" href="/" aria-label="Stories to CV home">
          <span className="brand-mark">S</span>
          <span>Stories to CV</span>
        </Link>
        <div className="marketing-links">
          <a href="#product">Product</a>
          <a href="#solutions">Solutions</a>
          <a href="#privacy">Privacy</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="marketing-actions">
          <Link href="/login">Login</Link>
          <Link className="primary-action compact" href="/login">
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="hero-section" id="product">
        <p className="system-label">Career Intelligence System</p>
        <h1>Tell your story once, generate the right CV for every role.</h1>
        <p>
          Transform lived experiences into a private career knowledge base. Let AI help you excavate the proof,
          positioning, and language behind every job-targeted CV.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="/login">
            Start Your Story
          </a>
          <a className="secondary-action" href="#solutions">
            How it works
          </a>
        </div>
        <div className="trust-row">
          <span aria-hidden="true">shield</span>
          Private by design, grounded in source material you control.
        </div>
      </section>

      <section className="feature-grid" id="solutions" aria-label="Product pillars">
        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">
            chat
          </span>
          <h2>Conversation-first</h2>
          <p>Do not fill forms. Tell your story to an intelligent interviewer that asks for evidence.</p>
        </article>
        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">
            data
          </span>
          <h2>Personal Knowledge Base</h2>
          <p>Your raw experiences become structured, reusable career assets with clear provenance.</p>
        </article>
        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">
            match
          </span>
          <h2>Job-Targeted Generation</h2>
          <p>Every CV version is a strategic match between the role, your proof, and missing gaps.</p>
        </article>
      </section>
    </main>
  );
}
