import { z } from "zod";
import { devToolsEnabled, isSupabaseConfigured } from "@/lib/env";
import { getPublicSupabase } from "@/lib/supabase/public";
import { businessContentSchema, type BusinessContent } from "./content";
import { PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";
import type { SubscriptionStatus } from "@/features/subscriptions/entitlements";
import { getFixtureBySlug } from "@/features/themes/fixtures";

export interface PublishedProfile {
  content: BusinessContent;
  /** Stored page document (any schema version; migrated at render time). Kept as `config` in SQL. */
  page: unknown;
  plan: PlanId;
  subscriptionStatus: SubscriptionStatus;
  /** True for development fixtures; such pages are noindex and visibly labelled. */
  synthetic: boolean;
}

export type ProfileLookup =
  | { kind: "found"; profile: PublishedProfile }
  | { kind: "redirect"; slug: string }
  | { kind: "none" };

/** Shape returned by the `get_public_profile` RPC (published snapshot only). */
const rpcSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("found"),
    snapshot: z.object({ content: z.unknown(), config: z.unknown() }),
    plan: z.enum(PLAN_IDS),
    subscription_status: z.enum(["none", "active", "trialing", "past_due", "unpaid", "canceled", "incomplete"]),
  }),
  z.object({ status: z.literal("redirect"), slug: z.string() }),
  z.object({ status: z.literal("none") }),
]);

/**
 * Public read path: published snapshots only. Drafts are never reachable here;
 * authorised preview goes through a separate, membership-checked path.
 */
export async function getPublishedProfile(slug: string): Promise<ProfileLookup> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getPublicSupabase().rpc("get_public_profile", { p_slug: slug });
    if (error) throw new Error(`get_public_profile failed: ${error.message}`);
    const parsed = rpcSchema.parse(data);
    if (parsed.status === "redirect") return { kind: "redirect", slug: parsed.slug };
    if (parsed.status === "none") return { kind: "none" };
    const content = businessContentSchema.parse(parsed.snapshot.content);
    return {
      kind: "found",
      profile: { content, page: parsed.snapshot.config, plan: parsed.plan, subscriptionStatus: parsed.subscription_status, synthetic: false },
    };
  }

  if (devToolsEnabled()) {
    const fixture = getFixtureBySlug(slug);
    if (fixture) {
      const content = businessContentSchema.parse(fixture.content);
      return {
        kind: "found",
        profile: {
          content,
          page: fixture.page,
          plan: fixture.plan,
          subscriptionStatus: "active",
          synthetic: true,
        },
      };
    }
  }
  return { kind: "none" };
}
