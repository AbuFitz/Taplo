import type { ImageRef } from "@/features/businesses/content";
import { PROFILE_CHOICES } from "../contracts/style";

export type ArrangementId = (typeof PROFILE_CHOICES)[number]["id"];

/**
 * A plain, repeatable suggestion for how to introduce a business, from the pictures it actually has. It is a rule, not a prediction
 * of taste, it only ever suggests, and the owner's own choice is never replaced by it.
 */
export function recommendArrangement(identity: { name: string; logo?: ImageRef | null; heroImage?: ImageRef | null }): { id: ArrangementId; why: string } {
  const logo = Boolean(identity.logo), cover = Boolean(identity.heroImage);
  const longName = identity.name.trim().length > 26;
  if (logo && cover) return longName ? { id: "masthead", why: "A long name reads best as type, with your picture following." } : { id: "framed", why: "Your cover and logo work together, with the mark overlapping the photo." };
  if (cover) return { id: "melt", why: "Your cover photo leads and flows into the page, with no gap for a logo." };
  if (logo) return { id: "bento", why: "One card keeps your logo and name together, with no empty photo area." };
  return { id: "type", why: "With no pictures yet, confident type leads and nothing is left empty." };
}

/** Arrangements built around a photograph cannot be chosen until there is one; the rest work with or without pictures. */
export const arrangementAvailable = (id: ArrangementId, identity: { heroImage?: ImageRef | null }): boolean => PROFILE_CHOICES.find((c) => c.id === id)?.needs !== "photo" || Boolean(identity.heroImage);
