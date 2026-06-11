import { expect, test } from "@playwright/test";

test("landing page is reachable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Stories to CV" })).toBeVisible();
});
