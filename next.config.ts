import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is deliberately off for now: every public read is a runtime
  // tenant lookup, so the Suspense-everywhere model adds friction without payoff.
  // Revisit when public profiles move to tag-based caching (docs/product-decisions.md).
  cacheComponents: false,
  // Captured artwork uses content hashes to invalidate optimized previews.
  images: { localPatterns: [{ pathname: "/marketing/**" }, { pathname: "/**", search: "" }] },
  partialPrefetching: false,
  devIndicators: false,
  // Earlier marketing addresses keep working.
  async redirects() {
    return [
      { source: "/features/make-it-yours", destination: "/product/design", permanent: true },
      { source: "/features/services-and-enquiries", destination: "/product/services", permanent: true },
      { source: "/features/products-and-stock", destination: "/product/products", permanent: true },
      { source: "/features/share-your-page", destination: "/product/sharing", permanent: true },
      { source: "/features/:slug*", destination: "/product", permanent: true },
      { source: "/for/barbers-and-salons", destination: "/inspiration?industry=beauty", permanent: true },
      { source: "/for/car-dealers", destination: "/inspiration?industry=motoring", permanent: true },
      { source: "/for/tradespeople", destination: "/inspiration?industry=trades", permanent: true },
      { source: "/for/:slug*", destination: "/inspiration", permanent: true },
    ]
  },
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
