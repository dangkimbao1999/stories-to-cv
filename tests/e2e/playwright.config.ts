import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  retries: 0,
  webServer: {
    command: "pnpm --filter @stories/web dev",
    cwd: "../..",
    env: {
      E2E_AUTH_BYPASS: "1",
    },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://127.0.0.1:3000",
  },
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  reporter: [["list"], ["html", { open: "never" }]],
});
