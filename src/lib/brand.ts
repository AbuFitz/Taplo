/**
 * Taplo's own brand configuration. The final logo is supplied separately; set the flags when the SVGs
 * are placed in /public/brand (see public/brand/README.md). Nothing here describes a business page:
 * owners' pages never read these values.
 */
export const BRAND = {
  name: "Taplo",
  logoSupplied: false,
  markSupplied: false,
  lockupSrc: "/brand/taplo-logo.svg",
  lockupLightSrc: "/brand/taplo-logo-light.svg",
  markSrc: "/brand/taplo-mark.svg",
} as const
