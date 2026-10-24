import { defineConfig } from "@playwright/test"
import base from "./playwright.config"

/** Representative native-engine journeys. Install with: npx playwright install firefox webkit. */
export default defineConfig(base, {
  testMatch: "**/cross-browser.spec.ts",
  use: { ...base.use, launchOptions: {}, screenshot: "only-on-failure" },
  projects: [
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
})
