import { getIndustryPreset } from "@/features/themes/presets/industries";

/** Navigation emphasis, never permission or feature enablement. Every tool stays reachable. */
export function workspaceModel(industryKey?: string, categoryLabel?: string) {
  const preset = getIndustryPreset(industryKey ?? "other");
  const productsFirst = preset.id === "maker" || preset.id === "car-dealer";
  const terms = {
    services: preset.id === "maker" ? "Services" : preset.terminology.services,
    products: preset.id === "car-dealer" ? "Vehicle stock" : "Products",
    team: preset.terminology.team,
  };
  const configured = Boolean(categoryLabel?.trim());
  const primaryWork = configured
    ? productsFirst
      ? ["products"]
      : ["services", "bookings"]
    : [];
  return {
    terms,
    primaryWork,
    mobileWork: configured
      ? productsFirst
        ? "products"
        : "bookings"
      : undefined,
  };
}
