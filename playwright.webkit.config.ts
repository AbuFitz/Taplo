import { defineConfig, devices } from "@playwright/test"

/** Non-Chromium pass: the main config pins a Chromium binary, so WebKit gets its own file. */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  retries: 0,
  reporter: "line",
  use: { ...devices["Desktop Safari"], baseURL: process.env.BASE_URL ?? "http://localhost:3100" },
  projects: [{ name: "webkit" }],
  webServer: process.env.BASE_URL ? undefined : { command: "npx next start -p 3100", url: "http://localhost:3100", reuseExistingServer: true },
})
