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
 * Demo mode: opt-in (TAPLO_DEMO_MODE=1). Opens onboarding and the dashboard WITHOUT
 * authentication, keeping all data in the visitor's own browser (localStorage).
 * It exists so the product can be reviewed before auth/backends are configured.
 * It must never be enabled on a deployment holding real customer data.
 */
export function demoModeEnabled(): boolean {
  return process.env.TAPLO_DEMO_MODE === "1";
}
