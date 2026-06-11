import { expect, test } from "@playwright/test";

test("first-login foundation flow is reachable", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/login");

  await expect(page.getByRole("heading", { name: "Stories to CV" })).toBeVisible();
  await page.getByRole("button", { name: "Continue with Google" }).click();

  await expect(page).toHaveURL("/onboarding");
  await expect(page.getByRole("heading", { name: "Help us shape your workspace" })).toBeVisible();
  await expect(page.getByText("What do you want Stories to CV to help with first?")).toBeVisible();
  await page.getByRole("button", { name: "Finish setup" }).click();

  await expect(page).toHaveURL("/app/knowledge-base");
  await expect(page.getByRole("heading", { name: "Conversation sessions" })).toBeVisible();
  await expect(page.getByText("KB input")).toBeVisible();
  await expect(
    page.getByLabel("New session context").getByText("How many years of AI engineering experience do you have so far?"),
  ).toBeVisible();

  await page.getByRole("button", { name: "New session" }).click();
  await expect(page.getByRole("region", { name: "Active session" })).toBeVisible();
  await page.getByLabel("Session message").fill("Built a RAG workflow that reduced support response time.");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("measurable result, scope, or stakeholder detail")).toBeVisible();

  await page.getByLabel("Extracted source text").fill("Resume source: led support automation with LLM evaluation.");
  await page.getByRole("button", { name: "Attach source" }).click();
  await expect(page.getByText("1 source attached to this session.")).toBeVisible();
  await page.getByRole("button", { name: "Save to my knowledge base" }).click();
  await expect(page.getByRole("heading", { name: "Saved knowledge" })).toBeVisible();
  await expect(page.getByText("facts extracted")).toBeVisible();

  await page.getByRole("link", { name: "Generate CV" }).click();
  await expect(page).toHaveURL("/app/generate-cv");
  await expect(page.getByRole("heading", { name: "CV generation sessions" })).toBeVisible();
  await page.getByLabel("JD text").fill("AI Engineer role building RAG systems for support automation.");
  await page.getByLabel("Refinement notes").fill("Highlight RAG systems, LLM evaluation, and support impact.");
  await page.getByRole("button", { name: "Generate CV" }).click();
  await expect(page.getByRole("heading", { name: "Generated CV versions" })).toBeVisible();
  await expect(page.getByText("Target role: AI Engineer")).toBeVisible();
  await expect(page.getByRole("button", { name: "Download" })).toBeVisible();
});
