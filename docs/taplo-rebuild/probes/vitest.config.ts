import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("../../../src", import.meta.url)) } },
  test: {
    environment: "node",
    include: [fileURLToPath(new URL("./engine-regressions.test.ts", import.meta.url))],
  },
});
