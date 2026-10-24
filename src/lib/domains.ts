/** Owner-confirmed public addresses. Deployment/DNS activation is tracked separately. */
export const TAPLO_DOMAINS = {
  website: "https://mytaplo.com",
  host: "mytaplo.com",
  dashboard: "https://app.mytaplo.com",
  email: "hello@mytaplo.com",
  uk: "https://taplo.co.uk",
} as const;

/** Display address, without a scheme. A preview is not a claim that a draft is published. */
export function businessAddress(slug = "") {
  return `${TAPLO_DOMAINS.host}${slug ? `/${slug.replace(/^\/+/, "")}` : ""}`;
}

/** Preview deployments keep their working local dashboard until custom hosts are connected. */
export function dashboardDestination(host: string, fallback = "/dashboard") {
  return [TAPLO_DOMAINS.host, `www.${TAPLO_DOMAINS.host}`, "taplo.co.uk"].includes(host) ? TAPLO_DOMAINS.dashboard : fallback;
}
