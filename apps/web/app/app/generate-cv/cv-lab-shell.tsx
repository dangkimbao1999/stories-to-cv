import type { ReactNode } from "react";

export function CvLabShell({
  children,
  showStepper = true,
  step,
  subtitle = "Comparing your raw assets against specific job requirements.",
  title = "CV Lab: Targeted Strategy for Senior PM at Stripe",
}: {
  children: ReactNode;
  showStepper?: boolean;
  step?: 1 | 2;
  subtitle?: string;
  title?: string;
}) {
  return (
    <main className="cv-lab-shell">
      <section className="cv-lab-main">
        <header className="cv-lab-topbar">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>

        {showStepper && step ? <CvLabStepper step={step} /> : null}

        <div className="cv-lab-workspace">{children}</div>
      </section>
    </main>
  );
}

function CvLabStepper({ step }: { step: 1 | 2 }) {
  return (
    <section className="cv-lab-stepper" aria-label="CV Lab progress">
      <div className={step === 1 ? "active" : "complete"}>
        <span>
          {step === 1 ? (
            "1"
          ) : (
            <span className="material-symbols-outlined" aria-hidden="true">
              check
            </span>
          )}
        </span>
        <strong>Step 1: Job Source</strong>
      </div>
      <i aria-hidden="true" />
      <div className={step === 2 ? "active" : "muted"}>
        <span>2</span>
        <strong>Step 2: Generation</strong>
      </div>
    </section>
  );
}
