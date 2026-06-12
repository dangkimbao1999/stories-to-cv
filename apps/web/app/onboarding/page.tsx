import { defaultOnboardingForm } from "@stories/domain";
import { redirect } from "next/navigation";

async function finishOnboarding() {
  "use server";

  redirect("/app/knowledge-base");
}

export default function OnboardingPage() {
  return (
    <main className="onboarding-screen">
      <form action={finishOnboarding} className="onboarding-form">
        <p className="eyebrow">First-login setup</p>
        <h1>Help us shape your workspace</h1>
        {defaultOnboardingForm.questions.map((question) => (
          <fieldset key={question.id} className="question-group">
            <legend>{question.label}</legend>
            <div className="option-grid">
              {question.options.map((option) => (
                <label key={option.id} className="option-row">
                  <input
                    defaultChecked={question.options[0]?.id === option.id}
                    name={question.id}
                    type={question.input === "checkbox" ? "checkbox" : "radio"}
                    value={option.id}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button className="primary-action" type="submit">
          Finish setup
        </button>
      </form>
    </main>
  );
}
