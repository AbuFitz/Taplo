/**
 * Business slug rules. The same normalisation + reserved list is enforced in
 * Postgres (see supabase/migrations) — this module is for fast UI feedback and
 * routing, NOT the uniqueness guarantee. Uniqueness is decided by a unique
 * index inside `claim_business_slug`, which makes concurrent claims safe.
 */

export const SLUG_MIN = 3;
export const SLUG_MAX = 40;

/** Paths that must never resolve to a business. Keep in sync with the SQL table `reserved_slugs`. */
export const RESERVED_SLUGS: readonly string[] = [
  "dashboard", "api", "auth", "onboarding", "review", "reviews", "pricing", "dev", "settings",
  "login", "logout", "signup", "sign-up", "sign-in", "register", "support", "help", "book", "booking",
  "bookings", "admin", "root", "app", "www", "mail", "email", "static", "assets", "public", "_next",
  "taplo", "about", "contact", "terms", "privacy", "legal", "cookies", "blog", "docs", "status",
  "checkout", "billing", "stripe", "webhooks", "webhook", "invite", "invites", "team", "staff",
  "robots", "robots-txt", "sitemap", "sitemap-xml", "favicon", "manifest", "demo", "test", "null", "undefined",
  "nfc", "store", "shop", "account", "profile", "profiles", "u", "me", "new", "edit", "search", "explore",
];

const reserved = new Set(RESERVED_SLUGS);

/** Lowercase ASCII, hyphen separated. Diacritics are folded; anything else is dropped. */
export function normalizeSlug(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX)
    .replace(/-+$/g, "");
}

export function isReservedSlug(slug: string): boolean {
  if (reserved.has(slug)) return true;
  // Block close variants of the platform name to reduce impersonation ("taplo-official", "taplo-support").
  return /(^|-)taplo(-|$)/.test(slug);
}

/** Staff slugs share the `/{businessSlug}/{staffSlug}` namespace with `/book`. */
export function isReservedStaffSlug(slug: string): boolean {
  return slug === "book" || slug === "review" || slug === "reviews" || slug === "api" || slug.startsWith("_");
}

export type SlugProblem = "too_short" | "too_long" | "invalid_characters" | "reserved" | "all_numeric";

export function validateSlug(slug: string): SlugProblem[] {
  const problems: SlugProblem[] = [];
  if (slug.length < SLUG_MIN) problems.push("too_short");
  if (slug.length > SLUG_MAX) problems.push("too_long");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) problems.push("invalid_characters");
  else if (/^\d+$/.test(slug)) problems.push("all_numeric");
  if (isReservedSlug(slug)) problems.push("reserved");
  return problems;
}

export const SLUG_PROBLEM_MESSAGE: Record<SlugProblem, string> = {
  too_short: `Use at least ${SLUG_MIN} characters.`,
  too_long: `Use at most ${SLUG_MAX} characters.`,
  invalid_characters: "Use only lowercase letters, numbers and single hyphens.",
  reserved: "That address is reserved. Try another.",
  all_numeric: "Include at least one letter.",
};
