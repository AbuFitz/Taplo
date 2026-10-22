import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  workers: 2,
  use: {
    baseURL: "http://localhost:3100",
    launchOptions: { executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" },
  },
  // Dev tools + synthetic fixtures are enabled explicitly for visual QA only.
  webServer: {
    command: "TAPLO_ENABLE_DEV_TOOLS=1 npx next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
  },
});
