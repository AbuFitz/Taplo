import { getIndustryPreset } from "@/features/themes/presets/industries";

/** One category vocabulary for setup, examples and contextual plan previews. */
export function setupJourney(industryKey: string) {
  const preset = getIndustryPreset(industryKey);
  const photo = ["photographer", "designer", "founder", "filmmaker", "illustrator", "interiors"].includes(preset.id);
  const kind = preset.id === "car-dealer" ? "vehicle" : preset.id === "maker" ? "product" : photo ? "photo" : "service";
  const noun = preset.id === "hospitality" ? "Menu item"
    : ["tutor", "music-teacher", "language-teacher", "driving-instructor"].includes(preset.id) ? "Lesson"
    : ["personal-trainer", "sports-coach", "coach"].includes(preset.id) ? "Session"
    : ["physio", "massage", "beauty-therapist", "nails", "lashes-brows", "hairdresser"].includes(preset.id) ? "Treatment"
    : "Service";
  const heading = kind === "vehicle" ? "Add your first vehicle"
    : kind === "product" ? "Add your first product"
    : kind === "photo" ? "Add your first photos"
    : `Add your first ${noun.toLowerCase()}`;
  const example = preset.suggestedServices[0]?.name ?? "Initial consultation";
  const booking = preset.id === "car-dealer" ? "Arrange a viewing"
    : preset.id === "hospitality" ? "Request a table"
    : photo ? "Discuss a project"
    : preset.terminology.booking;
  return { kind, noun, heading, example, booking, category: preset.label } as const;
}
