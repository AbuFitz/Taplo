import type { Pool } from "pg";
import { transaction } from "./database";
import { emit, idempotent, newId } from "./commands";
import { validateInput, validateRecord } from "./contracts";
import { authorise, type Membership, type Principal, type Role } from "./policy";
import { CommandError, hidden } from "./errors";

interface Money { minor: number; currency: string }
interface OfferInput { kind: "goods" | "appointment" | "class" | "quote"; title: string; price_mode: "fixed" | "from" | "quote" | "free"; price?: Money }
export interface OfferDraft extends OfferInput {
 id: string; business_id: string; version: number; created_at: string; updated_at: string;
 visibility: "draft"; delivery_modes: string[];
}
/** A deliberate price is preserved; missing configuration stays incomplete, never filled with fictitious references. */
export async function createOfferDraft(db: Pool, principal: Principal, businessId: string, raw: unknown, key: string, requestId: string) {
 const input = validateInput<OfferInput>("CreateOfferDraft", raw);
 if (!input.title.trim()) throw new CommandError("RULE_NOT_SATISFIED", 422, "Give your offer a name.");
 if (input.price && (!Number.isSafeInteger(input.price.minor) || input.price.currency !== "GBP" || (input.price_mode === "free" && input.price.minor !== 0))) throw new CommandError("RULE_NOT_SATISFIED", 422, "Review the price for this offer.");
 return transaction(db, { actorId: principal.id, businessId }, async c => {
  const member = (await c.query("SELECT m.* FROM taplo.membership m JOIN taplo.\"user\" u ON u.id=m.user_id WHERE m.business_id=$1 AND m.user_id=$2 AND u.status='active'", [businessId, principal.id])).rows[0];
  const membership: Membership | null = member ? { userId: member.user_id, businessId: member.business_id, role: member.role as Role, status: member.status, locationIds: member.location_ids, resourceIds: member.resource_ids } : null;
  const business = (await c.query("SELECT status FROM taplo.business WHERE id=$1", [businessId])).rows[0];
  if (!business) throw hidden();
  authorise(principal, membership, "catalogue.write", { businessId, allowedState: !["closing", "closed"].includes(business.status) });
  // Current authority is checked before an earlier receipt can be returned.
  return idempotent(c, { businessId, actorId: principal.id, command: "CreateOfferDraft", key, requestId, input }, async () => {
   const row = (await c.query("INSERT INTO taplo.offer(id,business_id,kind,title,price_mode,price) VALUES($1,$2,$3,$4,$5,$6) RETURNING *", [newId("offer"), businessId, input.kind, input.title.trim(), input.price_mode, input.price ? JSON.stringify(input.price) : null])).rows[0];
   const value: OfferDraft = validateRecord("Offer", { id: row.id, version: Number(row.version), created_at: row.created_at.toISOString(), updated_at: row.updated_at.toISOString(), business_id: businessId, kind: row.kind, title: row.title, visibility: "draft", price_mode: row.price_mode, ...(row.price ? { price: row.price } : {}), delivery_modes: [] });
   await emit(c, { businessId, actorId: principal.id, action: "create_offer_draft.v1", subjectId: value.id, version: value.version, requestId, fields: ["kind", "title", "price_mode", ...(input.price ? ["price"] : [])] });
   return value;
  });
 });
}
