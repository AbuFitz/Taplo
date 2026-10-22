import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous, cookie-free client for public reads. It can only call the
 * deliberately exposed public RPCs / projections; RLS keeps everything else closed.
 */
let cached: SupabaseClient | null = null;

export function getPublicSupabase(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).");
  cached = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return cached;
}
