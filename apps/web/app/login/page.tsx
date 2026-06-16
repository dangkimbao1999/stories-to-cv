import { redirect } from "next/navigation";
import { FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "../../auth";

async function continueWithGoogle() {
  "use server";

  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    await signIn("google", { redirectTo: "/onboarding" });
  }

  redirect("/onboarding");
}

export default function LoginPage() {
  return (
    <main className="login-screen">
      <section className="login-shell" aria-label="Stories to CV login">
        <aside className="login-brand-panel" aria-labelledby="login-product-title">
          <div className="login-brand-copy">
            <div className="login-brand-lockup">
              <span className="material-symbols-outlined" aria-hidden="true">
                auto_stories
              </span>
              <h1 id="login-product-title">Stories to CV</h1>
            </div>
            <p>Precision Career Intelligence</p>
          </div>

          <div className="login-story-copy">
            <h2>Your experience is more than a list of tasks.</h2>
            <p>
              We help you excavate the strategic impact hidden in your professional journey through intelligent
              storytelling.
            </p>
          </div>

          <div className="login-visual-placeholder" aria-label="Career narrative placeholder" role="img">
            <div className="login-placeholder-surface">
              <span className="login-node one" aria-hidden="true" />
              <span className="login-node two" aria-hidden="true" />
              <span className="login-node three" aria-hidden="true" />
              <span className="login-node four" aria-hidden="true" />
              <span className="login-path one" aria-hidden="true" />
              <span className="login-path two" aria-hidden="true" />
              <span className="login-path three" aria-hidden="true" />
              <div className="login-placeholder-card one" aria-hidden="true" />
              <div className="login-placeholder-card two" aria-hidden="true" />
              <div className="login-placeholder-card three" aria-hidden="true" />
            </div>
          </div>
        </aside>

        <section className="login-form-panel" aria-labelledby="login-title">
          <div className="login-mobile-brand">
            <span className="material-symbols-outlined" aria-hidden="true">
              auto_stories
            </span>
            <h1>Stories to CV</h1>
            <p>Career Intelligence</p>
          </div>

          <div className="login-form-card">
            <header className="login-header">
              <h2 id="login-title">Welcome Back</h2>
              <p>Sign in to continue building your career narrative.</p>
            </header>

            <fieldset className="login-social-row">
              <legend className="sr-only">Alternative sign in options</legend>
              <button type="button">
                <FcGoogle aria-hidden="true" focusable="false" />
                Google
              </button>
              <button type="button">
                <FaLinkedinIn aria-hidden="true" className="login-linkedin-icon" focusable="false" />
                LinkedIn
              </button>
            </fieldset>

            <div className="login-divider">
              <span>OR CONTINUE WITH EMAIL</span>
            </div>

            <form action={continueWithGoogle} className="login-form">
              <label htmlFor="email">Email Address</label>
              <div className="login-field">
                <input id="email" name="email" placeholder="name@company.com" type="email" />
              </div>

              <div className="login-password-row">
                <label htmlFor="password">Password</label>
                <a href="/login">Forgot password?</a>
              </div>
              <div className="login-field">
                <input id="password" name="password" placeholder="Password" type="password" />
              </div>

              <button className="login-submit" type="submit">
                Sign In
              </button>
            </form>

            <footer className="login-footer">
              <p>
                Don&apos;t have an account? <a href="/login">Sign up</a>
              </p>
            </footer>
          </div>
        </section>
      </section>
    </main>
  );
}
