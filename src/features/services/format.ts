import type { ServiceContent } from "@/features/businesses/content";

export function formatMoney(minor: number, currency = "GBP"): string {
  const whole = minor % 100 === 0;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}

/** Honest price label. "fixed"/"from" without an amount degrades to "Price on request". */
export function formatPrice(s: Pick<ServiceContent, "priceMode" | "priceMinor" | "currency" | "priceUnit">): string {
  const suffix = s.priceUnit ? ` per ${s.priceUnit}` : "";
  switch (s.priceMode) {
    case "free":
      return "Free";
    case "quote":
      return "Quote on request";
    case "fixed":
      return s.priceMinor === undefined ? "Price on request" : formatMoney(s.priceMinor, s.currency) + suffix;
    case "from":
      return s.priceMinor === undefined ? "Price on request" : `From ${formatMoney(s.priceMinor, s.currency)}${suffix}`;
  }
}

export function formatDuration(minutes?: number): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr${h > 1 ? "s" : ""}` : `${h} hr ${m} min`;
}

export function groupServices<T extends { group?: string }>(services: T[]): { name: string | null; items: T[] }[] {
  const groups: { name: string | null; items: T[] }[] = [];
  for (const s of services) {
    const name = s.group ?? null;
    let g = groups.find((x) => x.name === name);
    if (!g) groups.push((g = { name, items: [] }));
    g.items.push(s);
  }
  return groups;
}
