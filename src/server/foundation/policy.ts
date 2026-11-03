import policy from "../../../docs/taplo-blueprint/release-3.0/contracts/authorisation.json";
import { CommandError, hidden } from "./errors";
export type Role = keyof typeof policy.role_presets;
export interface Principal { id: string; audience: "merchant" | "customer" | "workforce"; assurance: "aal1" | "aal2"; stepUpAt?: number }
export interface Membership { userId: string; businessId: string; role: Role; status: "active" | "invited" | "revoked"; locationIds: string[]; resourceIds: string[] }
export interface Target { businessId: string; locationId?: string; resourceId?: string; subjectUserId?: string; fields?: string[]; allowedFields?: string[]; allowedState?: boolean; requiresStepUp?: boolean; workforceCaseId?: string; reason?: string }
/** Grants never bypass tenant, assignment, projection, state or assurance checks. */
export function authorise(principal: Principal, membership: Membership | null, action: string, target: Target, now = Date.now()): void {
  if (!membership || membership.userId !== principal.id || membership.businessId !== target.businessId || membership.status !== "active") throw hidden();
  const consoleAction = action.startsWith("console.") || action === "verified_provider.reconcile";
  if (consoleAction !== (principal.audience === "workforce")) throw new CommandError("FORBIDDEN", 403, "You don’t have access to this action.");
  if (consoleAction && (!target.workforceCaseId || !target.reason?.trim())) throw new CommandError("FORBIDDEN", 403, "Choose a case and record a reason.");
  const grants: readonly string[] = policy.role_presets[membership.role];
  if (!grants?.includes(action)) throw new CommandError("FORBIDDEN", 403, "You don’t have access to this action.");
  if (membership.role !== "owner") {
    if (target.locationId && !membership.locationIds.includes(target.locationId)) throw hidden();
    if (target.resourceId && !membership.resourceIds.includes(target.resourceId)) throw hidden();
    if (action.startsWith("own_") && target.subjectUserId !== principal.id) throw hidden();
    if (action.startsWith("assigned_") && (!target.resourceId || !membership.resourceIds.includes(target.resourceId))) throw hidden();
  }
  if (target.fields?.some((field) => !target.allowedFields?.includes(field))) throw new CommandError("FORBIDDEN", 403, "You can’t change those details.");
  if (target.allowedState === false) throw new CommandError("RULE_NOT_SATISFIED", 422, "This action is not available for the current state.");
  if (target.requiresStepUp && (principal.assurance !== "aal2" || !principal.stepUpAt || principal.stepUpAt > now || now - principal.stepUpAt > 300_000)) throw new CommandError("VERIFICATION_REQUIRED", 403, "Verify your identity to continue.");
}
