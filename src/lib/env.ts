/** True when Supabase public env vars are present. Nothing else should assume a backend exists. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Development-only routes and synthetic fixtures. Never enabled in production
 * unless explicitly forced for a staging deployment.
 */
export function devToolsEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.TAPLO_ENABLE_DEV_TOOLS === "1" || demoModeEnabled();
}

/**
 * Demo mode is ON by default while the whole product is a demo: onboarding and the
 * dashboard open WITHOUT authentication and keep all data in the visitor's own
 * browser (localStorage). Set TAPLO_DEMO_MODE=0 to close them (the real, auth-gated
 * behaviour). It must never run alongside real customer data.
 */
export function demoModeEnabled(): boolean {
  return process.env.TAPLO_DEMO_MODE !== "0";
}
