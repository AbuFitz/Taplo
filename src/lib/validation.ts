import { z } from "zod";

/** Only http(s) URLs are ever stored or linked. */
export const safeUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch {
      return false;
    }
  }, "Enter a full web address starting with https://");

/** Digits with an optional leading +. Stored normalised; used for tel: and wa.me links. */
export function normalizePhone(input: string): string | null {
  const trimmed = input.trim();
  const plus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return (plus ? "+" : "") + digits;
}

export const phoneSchema = z
  .string()
  .transform((v, ctx) => {
    const n = normalizePhone(v);
    if (!n) {
      ctx.addIssue({ code: "custom", message: "Enter a valid phone number" });
      return z.NEVER;
    }
    return n;
  });

export function telHref(phone: string): string {
  return `tel:${phone}`;
}

/** wa.me wants digits only, with no leading plus. */
export function whatsappHref(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]![0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** True only for http(s) URLs. Used at render time so stored values can never become javascript: links. */
export function isHttpUrl(v: string | undefined | null): v is string {
  if (!v) return false;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** YouTube/Vimeo only. Returns an embeddable URL or null. Nothing else is ever iframed. */
export function videoEmbed(v: string | undefined | null): { provider: "youtube" | "vimeo"; embedUrl: string; } | null {
  if (!isHttpUrl(v)) return null;
  const u = new URL(v);
  const host = u.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return /^[\w-]{6,15}$/.test(id) ? { provider: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` } : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = u.searchParams.get("v") ?? (u.pathname.startsWith("/embed/") ? u.pathname.split("/")[2] : null);
    return id && /^[\w-]{6,15}$/.test(id) ? { provider: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` } : null;
  }
  if (host === "vimeo.com") {
    const id = u.pathname.split("/").filter(Boolean)[0];
    return id && /^\d{5,12}$/.test(id) ? { provider: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1` } : null;
  }
  return null;
}
