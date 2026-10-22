/** True when Supabase public env vars are present. Nothing else should assume a backend exists. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Development-only routes and synthetic fixtures. Never enabled in production
 * unless explicitly forced for a staging deployment.
 */
export function devToolsEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.TAPLO_ENABLE_DEV_TOOLS === "1";
}
