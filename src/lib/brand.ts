/**
 * Taplo's own brand configuration. The supplied logo files live in /public/logo (unchanged); this file
 * only says which one each placement uses. Nothing here describes a business page: owners' pages never
 * read these values.
 */
export const BRAND = {
  name: "Taplo",
  logoSupplied: true,
  /** Horizontal lockup: symbol and wordmark. */
  lockup: { dark: "/logo/taplo-horizontal-black.svg", light: "/logo/taplo-horizontal-white.svg", ratio: 800 / 300 },
  /** The wordmark alone: flat geometry, the most legible supplied form at small sizes. The platform's primary logo. */
  wordmark: { dark: "/logo/taplo-wordmark-black.svg", light: "/logo/taplo-wordmark-white.svg", ratio: 1000 / 390 },
  /** The symbol alone. */
  mark: { dark: "/logo/taplo-symbol-black.svg", light: "/logo/taplo-symbol-white.svg" },
  /** Rounded-square app icon, black or white. */
  app: { dark: "/logo/taplo-app-black.svg", light: "/logo/taplo-app-white.svg" },
  stacked: { dark: "/logo/taplo-stacked-black.svg", light: "/logo/taplo-stacked-white.svg" },
} as const
