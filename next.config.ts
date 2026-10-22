import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is deliberately off for now: every public read is a runtime
  // tenant lookup, so the Suspense-everywhere model adds friction without payoff.
  // Revisit when public profiles move to tag-based caching (docs/product-decisions.md).
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
