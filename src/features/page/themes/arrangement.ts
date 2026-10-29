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

export type ArrangementFit = { id: ArrangementId; score: number; why: string };

/**
 * Every arrangement that can be chosen, best fit first, from the pictures and the name. Arrangements built around a photograph
 * are left out until there is one. The rules are plain: photo-led layouts earn their place with a cover, wide wordmarks go where
 * they have room, and a long name goes where type can carry it. The first entry is what recommendArrangement returns.
 */
export function rankArrangements(identity: { name: string; logo?: ImageRef | null; heroImage?: ImageRef | null }): ArrangementFit[] {
  const logo = Boolean(identity.logo), cover = Boolean(identity.heroImage);
  const wide = Boolean(identity.logo?.width && identity.logo?.height && identity.logo.width / identity.logo.height > 1.5);
  const long = identity.name.trim().length > 26;
  const fit = (id: ArrangementId): [number, string] => {
    switch (id) {
      case "framed": return cover ? [logo ? 9 : 7, "The photo fades into a contained profile."] : [3, "Reads as a clean card until a cover photo is added."];
      case "melt": return cover ? [logo ? 7 : 9, "The photo flows into the page."] : [2, "Becomes a plain intro without a cover photo."];
      case "identity": return cover ? [logo ? (wide ? 6 : 8) : 5, "A centred mark under the cover."] : [3, "A centred intro; a cover photo completes it."];
      case "masthead": return [(long ? 9 : 5) + (wide ? 2 : 0), long ? "Long names read best as type." : "Type leads, the photo follows."];
      case "duo": return cover ? [long || wide ? 3 : 6, long || wide ? "The narrow column is tight for a long name or wide mark." : "Identity and photo share one compact intro."] : [3, "Becomes a single card without a cover photo."];
      case "lifted": return cover ? [logo ? 8 : 6, "A profile panel rests on the cover."] : [3, "Becomes a single card without a cover photo."];
      case "split": return cover ? [wide ? 5 : logo ? 8 : 6, "A rounded photo with the mark on its edge."] : [0, "Needs a cover photo."];
      case "bento": return logo ? [cover ? 4 : 8, "One card keeps your mark and name together."] : [cover ? 3 : 4, "One lifted card with everything in reach."];
      case "type": return [cover ? 2 : logo ? 4 : 9, "Bold type with no photo needed."];
    }
  };
  return PROFILE_CHOICES.filter((c) => arrangementAvailable(c.id, identity))
    .map((c) => { const [score, why] = fit(c.id); return { id: c.id, score, why }; })
    .sort((a, b) => b.score - a.score);
}
