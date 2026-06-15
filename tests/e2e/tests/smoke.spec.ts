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
  await expect(page.getByRole("heading", { name: "Knowledge Base" })).toBeVisible();
  await expect(page.getByRole("link", { name: "AI Engineer capture project impact KB input" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Product Manager organize existing materials" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Active session" })).toHaveCount(0);

  await page.getByRole("link", { name: "AI Engineer capture project impact KB input" }).click();
  await expect(page).toHaveURL("/app/knowledge-base/session-ai-impact");
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

  await expect(page.getByRole("link", { name: "Generate CV" })).toHaveAttribute("href", "/app/generate-cv");
  await page.goto("/app/generate-cv");
  await expect(page).toHaveURL("/app/generate-cv");
  await expect(page.getByRole("heading", { name: "CV generation sessions" })).toBeVisible();
  await page.getByLabel("JD text").fill("AI Engineer role building RAG systems for support automation.");
  await page.getByLabel("Refinement notes").fill("Highlight RAG systems, LLM evaluation, and support impact.");
  await page.getByRole("button", { name: "Generate CV" }).click();
  await expect(page.getByRole("heading", { name: "Generated CV versions" })).toBeVisible();
  await expect(page.getByText("Target role: AI Engineer")).toBeVisible();
  await expect(page.getByRole("button", { name: "Download" })).toBeVisible();
});
