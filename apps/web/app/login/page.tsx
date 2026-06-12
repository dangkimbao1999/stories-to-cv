import { redirect } from "next/navigation";
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
    <main className="auth-screen">
      <section className="auth-panel" aria-labelledby="product-title">
        <p className="eyebrow">Private career knowledge base</p>
        <h1 id="product-title">Stories to CV</h1>
        <p>Capture trusted career stories first, then generate job-targeted CVs from source material you control.</p>
        <form action={continueWithGoogle}>
          <button className="primary-action" type="submit">
            Continue with Google
          </button>
        </form>
      </section>
    </main>
  );
}
