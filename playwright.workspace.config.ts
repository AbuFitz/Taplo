import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

/** Run against a separately built, explicitly configured test server and throwaway DB. */
export default defineConfig({
  ...base,
  testDir: "tests/e2e-workspace",
  workers: 1,
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run start -- -p 3102 -H 127.0.0.1",
        url: "http://localhost:3102",
        reuseExistingServer: false,
      },
  use: {
    ...base.use,
    baseURL: process.env.BASE_URL ?? "http://localhost:3102",
  },
});
