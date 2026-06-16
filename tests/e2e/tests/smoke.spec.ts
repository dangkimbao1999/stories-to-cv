import { expect, test } from "@playwright/test";

test("Stitch-inspired career workspace flow is reachable", async ({ page }) => {
  test.setTimeout(120_000);

  async function expectCommonWorkspaceNav(activeLabel: "Career Excavation" | "CV Lab" | "Knowledge Base" | "Profile") {
    const sidebar = page.locator(".workspace-sidebar");
    const nav = page.getByRole("navigation", { name: "Main navigation" });

    await expect(sidebar).toHaveCount(1);
    await expect(
      page.locator(".excavation-sidebar, .live-excavation-sidebar, .cv-archive-sidebar, .cv-lab-sidebar"),
    ).toHaveCount(0);
    await expect(nav.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/app/profile");
    await expect(nav.getByRole("link", { name: "Career Excavation" })).toHaveAttribute(
      "href",
      "/app/excavation-history",
    );
    await expect(nav.getByRole("link", { name: "Knowledge Base" })).toHaveAttribute("href", "/app/knowledge-base");
    await expect(nav.getByRole("link", { name: "CV Lab" })).toHaveAttribute("href", "/app/archive");
    await expect(nav.getByRole("link")).toHaveCount(4);
    await expect(nav.getByRole("link", { name: activeLabel })).toHaveAttribute("aria-current", "page");
    await expect(sidebar.getByRole("link", { name: "Logout" })).toHaveAttribute("href", "/login");
    await expect(sidebar.getByRole("link", { name: "New Excavation" })).toHaveCount(0);
  }

  async function expectCvArchiveScale() {
    const scale = await page.locator(".cv-archive-page").evaluate((archivePage) => {
      const readPx = (selector: string, property: string) => {
        const element = archivePage.querySelector(selector);

        if (!element) {
          return 0;
        }

        return Number.parseFloat(getComputedStyle(element).getPropertyValue(property));
      };

      return {
        cardGap: readPx(".cv-archive-grid", "gap"),
        cardTitleFont: readPx(".cv-card-title-row h2", "font-size"),
        headerGap: readPx(".cv-archive-header", "margin-bottom"),
        heroFont: readPx(".cv-archive-header h1", "font-size"),
        newCardIconSize: readPx(".cv-archive-new-card > span", "width"),
        summaryFont: readPx(".cv-archive-header p", "font-size"),
      };
    });

    expect(scale.heroFont).toBeLessThanOrEqual(42);
    expect(scale.summaryFont).toBeLessThanOrEqual(18);
    expect(scale.headerGap).toBeLessThanOrEqual(36);
    expect(scale.cardGap).toBeLessThanOrEqual(22);
    expect(scale.cardTitleFont).toBeLessThanOrEqual(24);
    expect(scale.newCardIconSize).toBeLessThanOrEqual(56);
  }

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Tell your story once, generate the right CV for every role." }),
  ).toBeVisible();
  await expect(page.getByText("Conversation-first")).toBeVisible();
  await page.getByRole("link", { name: "Start Your Story" }).click();

  await expect(page).toHaveURL("/login");
  await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();
  await expect(page.getByText("Precision Career Intelligence")).toBeVisible();
  const googleLoginButton = page.getByRole("button", { exact: true, name: "Google" });
  const linkedInLoginButton = page.getByRole("button", { exact: true, name: "LinkedIn" });
  await expect(googleLoginButton).toBeVisible();
  await expect(linkedInLoginButton).toBeVisible();
  await expect(googleLoginButton.locator("svg")).toHaveCount(1);
  await expect(linkedInLoginButton.locator("svg")).toHaveCount(1);
  await expect(page.getByText("OR CONTINUE WITH EMAIL")).toBeVisible();
  await expect(page.getByLabel("Email Address")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.locator(".login-visual-placeholder")).toBeVisible();
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL("/onboarding");
  await expect(page.getByRole("heading", { name: "Help us shape your workspace" })).toBeVisible();
  await expect(page.getByText("What do you want Stories to CV to help with first?")).toBeVisible();
  await page.getByRole("button", { name: "Finish setup" }).click();

  await expect(page).toHaveURL("/app/knowledge-base");
  await expect(page.getByRole("heading", { name: "Your Career Intelligence" })).toBeVisible();
  await expect(page.getByText("45 facts excavated")).toBeVisible();
  await expect(page.getByPlaceholder("Search projects, skills, achievements...")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Excavated Projects" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Payment Flow Redesign" })).toBeVisible();
  await expect(page.getByText("reducing cart abandonment by 14% over Q3.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Global Expansion Strategy" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "User Onboarding Optimization" })).toBeVisible();
  await expect(page.getByText("Product Strategy")).toBeVisible();
  await expect(page.getByText("95%")).toBeVisible();
  await expect(page.getByText("Secured $2M budget approval for new enterprise tier development.")).toBeVisible();
  await expect(page.getByText("Growth Opportunities")).toBeVisible();
  await expect(page.getByText("Advanced Cloud Architecture")).toBeVisible();
  await expect(page.getByRole("region", { name: "Active session" })).toHaveCount(0);

  await page.goto("/app/excavation-history");
  await expect(page.getByRole("heading", { name: "Excavation History" })).toBeVisible();
  await expect(page.getByText("Review past AI Interviewer sessions")).toBeVisible();
  await expect(page.getByPlaceholder("Search sessions, roles, or insights...")).toBeVisible();
  await expect(page.getByRole("link", { name: "Start New Excavation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Payment Redesign Project" })).toBeVisible();
  await expect(page.getByText("STAR Method Complete")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cloud Migration Strategy" })).toBeVisible();
  const cloudMigrationCard = page
    .locator(".excavation-session-card")
    .filter({ has: page.getByRole("heading", { name: "Cloud Migration Strategy" }) });
  await expect(cloudMigrationCard.getByRole("button", { name: "Rename" })).toHaveCount(0);
  await expect(cloudMigrationCard.getByRole("button", { name: "Share" })).toHaveCount(0);
  await expect(cloudMigrationCard.getByRole("button", { name: "Delete" })).toHaveCount(0);
  await cloudMigrationCard.getByRole("button", { name: "More actions" }).click();
  await expect(cloudMigrationCard.getByRole("button", { name: "Rename" })).toBeVisible();
  await expect(cloudMigrationCard.getByRole("button", { name: "Share" })).toBeVisible();
  await expect(cloudMigrationCard.getByRole("button", { name: "Delete" })).toBeVisible();
  const actionMenuPosition = await cloudMigrationCard.evaluate((card) => {
    const button = card.querySelector(".excavation-more-button");
    const menu = card.querySelector(".excavation-menu");

    if (!button || !menu) {
      return null;
    }

    const buttonRect = button.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const menuStyle = getComputedStyle(menu);

    return {
      animationName: menuStyle.animationName,
      verticalGap: menuRect.top - buttonRect.bottom,
    };
  });
  expect(actionMenuPosition).not.toBeNull();
  expect(actionMenuPosition?.verticalGap).toBeLessThanOrEqual(8);
  expect(actionMenuPosition?.animationName).toBe("excavation-menu-enter");
  await expect(page.getByRole("heading", { name: "Unearth More Stories" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Load Older Sessions" })).toBeVisible();
  await expectCommonWorkspaceNav("Career Excavation");
  await page.locator(".excavation-empty-card").getByRole("link", { exact: true, name: "Start Excavation" }).click();

  await expect(page).toHaveURL("/app/knowledge-base/new");
  await expect(page.getByRole("heading", { name: "The Biographer" })).toBeVisible();
  await expect(page.getByText("Interview Session Started - Payment Redesign Project")).toBeVisible();
  await expect(page.getByText("The main constraint was a 3-month deadline")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Knowledge Extracted" })).toBeVisible();
  await expect(page.getByText("STAR METHOD PROGRESS")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Stakeholder Management" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Payment Flow Redesign" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Quantifiable Metrics" })).toBeVisible();
  await expect(page.getByPlaceholder("Type your response...")).toBeVisible();
  await expectCommonWorkspaceNav("Career Excavation");

  await page.goto("/app/knowledge-base/session-ai-impact");
  await expect(page).toHaveURL("/app/knowledge-base/session-ai-impact");
  await expect(page.getByRole("heading", { name: "The Biographer" })).toBeVisible();
  await expect(page.getByText("Knowledge Extracted")).toBeVisible();
  await expect(page.getByRole("region", { name: "Chat conversation" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Chat composer" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Session sources" })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Knowledge assets" })).toHaveCount(0);
  await page.getByLabel("Session message").fill("Built a RAG workflow that reduced support response time.");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("measurable result, scope, or stakeholder detail")).toBeVisible();

  await page.getByRole("button", { name: "Attach file" }).click();
  await page.getByLabel("Extracted source text").fill("Resume source: led support automation with LLM evaluation.");
  await page.getByRole("button", { name: "Use source" }).click();
  await expect(page.getByText("1 source attached to this session.")).toBeVisible();
  await page.getByRole("button", { name: "Save to my knowledge base" }).click();
  await expect(page.getByText("Saved 2 facts to your knowledge base.")).toBeVisible();

  await expect(page.getByRole("link", { name: "Career Excavation" })).toHaveAttribute(
    "href",
    "/app/excavation-history",
  );
  await expect(page.getByRole("link", { name: "CV Lab" })).toHaveAttribute("href", "/app/archive");
  await expect(page.getByRole("link", { name: "Interview Prep" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Settings" })).toHaveCount(0);

  await page.goto("/app/archive");
  await expect(page).toHaveURL("/app/archive");
  await expect(page.getByRole("heading", { name: "CV Archive" })).toBeVisible();
  await expect(page.getByText("Access and manage your strategic CV versions tailored")).toBeVisible();
  await expect(page.getByPlaceholder("Search by company or position...")).toBeVisible();
  await expect(page.getByRole("combobox")).toHaveValue("");
  await expect(page.getByRole("combobox")).toContainText("All Optimizations");
  const savedCvVersions = page.getByRole("region", { name: "Saved CV versions" });
  await expect(savedCvVersions.getByRole("heading", { name: "Stripe" })).toBeVisible();
  await expect(savedCvVersions.getByText("Senior PM, Payments")).toBeVisible();
  await expect(savedCvVersions.getByText("94% Match")).toBeVisible();
  await expect(savedCvVersions.getByText("Generated Oct 24, 2023")).toBeVisible();
  await expect(savedCvVersions.getByText("ATS-Optimized")).toBeVisible();
  await expect(savedCvVersions.getByRole("heading", { name: "Meta" })).toBeVisible();
  await expect(savedCvVersions.getByText("88% Match")).toBeVisible();
  await expect(savedCvVersions.getByRole("heading", { name: "Airbnb" })).toBeVisible();
  await expect(savedCvVersions.getByText("Creative Format")).toBeVisible();
  await expect(savedCvVersions.getByRole("heading", { name: "New CV Excavation" })).toBeVisible();
  await expectCvArchiveScale();
  await expectCommonWorkspaceNav("CV Lab");
  await savedCvVersions.getByRole("link", { name: "View Stripe CV" }).click();

  await expect(page).toHaveURL("/app/archive/stripe", { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "Stripe CV - Senior PM, Payments" })).toBeVisible();
  await expect(page.getByText("Generated CV Preview")).toBeVisible();
  await expect(page.getByRole("button", { name: "Download PDF/Docx" })).toBeVisible();
  const archivedCvInfo = page.getByRole("article", { name: "CV Information" });
  await expect(archivedCvInfo.getByText("Company")).toBeVisible();
  await expect(archivedCvInfo.getByText("Stripe")).toBeVisible();
  await expect(archivedCvInfo.getByText("Match score")).toBeVisible();
  await expect(archivedCvInfo.getByText("94% Match")).toBeVisible();
  await expect(archivedCvInfo.getByText("Optimization")).toBeVisible();
  await expect(archivedCvInfo.getByText("ATS-Optimized")).toBeVisible();
  await expect(page.getByText("Strategic Follow-ups & Growth")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recommended Courses" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Targeted Side Projects" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Networking Tips" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Interview Prep Focus" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to CV Archive" })).toHaveAttribute("href", "/app/archive");
  await expectCommonWorkspaceNav("CV Lab");
  await page.getByRole("link", { name: "Back to CV Archive" }).click();

  await expect(page).toHaveURL("/app/archive");
  await savedCvVersions
    .getByRole("link", { name: "New CV Excavation Start building a new tailored CV from your knowledge base." })
    .click();

  await expect(page).toHaveURL("/app/generate-cv");
  await expect(page.getByRole("heading", { name: "CV Lab: Targeted Strategy for Senior PM at Stripe" })).toBeVisible();
  await expect(page.getByText("Step 1: Job Source")).toBeVisible();
  await expect(page.getByText("Job Source Intake")).toBeVisible();
  await expect(page.getByPlaceholder("Paste the job description here...")).toBeVisible();
  await expect(page.getByRole("button", { name: "Extract Requirements" })).toBeVisible();
  await expect(page.getByText("Job Profile Confirmation")).toBeVisible();
  await expect(page.getByText("Senior Product Manager")).toBeVisible();
  await expect(page.getByText("GENERATION OPTIMIZATION STRATEGY")).toBeVisible();
  await expect(page.getByLabel("Recruiter-First")).toBeChecked();
  await expectCommonWorkspaceNav("CV Lab");
  await page.getByRole("link", { name: "Confirm & Proceed" }).click();

  await expect(page).toHaveURL("/app/generate-cv/preview");
  await expect(page.getByText("Step 2: Generation")).toBeVisible();
  await expect(page.getByText("Generated CV Preview")).toBeVisible();
  await expect(page.getByRole("button", { name: "Download PDF/Docx" })).toBeVisible();
  await expect(page.getByText("Strategic Follow-ups & Growth")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recommended Courses" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Targeted Side Projects" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Networking Tips" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Interview Prep Focus" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to Edit Source" })).toHaveAttribute("href", "/app/generate-cv");
  await expectCommonWorkspaceNav("CV Lab");

  await page.getByRole("link", { name: "Profile" }).click();
  await expect(page.getByRole("heading", { name: "Marcus Thorne" })).toBeVisible();
  await expect(page.getByText("Career Assets Library")).toBeVisible();
});
