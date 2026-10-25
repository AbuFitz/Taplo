import { industryPresetSchema, type IndustryPreset } from "../../contracts/industry";
import type { WidgetType } from "@/features/page/contracts/widgets";

/**
 * Industry presets are DATA. Supporting a new industry means adding an entry
 * here (or later, a database row of the same shape) — never a new page.
 * Listed industries are suggestions, not an allowlist: "other" always works.
 */

type Terms = IndustryPreset["terminology"];

const T = {
  trades: { services: "Services", team: "Team", booking: "Book", reviews: "Reviews" },
  beauty: { services: "Treatments", team: "Team", booking: "Book an appointment", reviews: "Reviews" },
  education: { services: "Subjects", team: "Tutors", booking: "Book a session", reviews: "Testimonials" },
  professional: { services: "Services", team: "People", booking: "Request a consultation", reviews: "Client feedback" },
  general: { services: "Services", team: "Team", booking: "Book", reviews: "Reviews" },
} satisfies Record<string, Terms>;

const SUGGESTED_THEME = { trades: "clean", beauty: "clean", education: "clean", professional: "clean", general: "clean" } as const;

/** Compact, link-first starting points. Empty widgets simply stay hidden until content exists. */
const STARTER: Record<keyof typeof T, WidgetType[]> = {
  trades: ["booking", "serviceList", "reviews", "gallery", "serviceArea", "location", "faq"],
  beauty: ["booking", "priceMenu", "gallery", "team", "reviews", "social", "hours", "location"],
  education: ["booking", "text", "serviceList", "team", "credentials", "reviews", "faq"],
  professional: ["booking", "text", "serviceList", "reviews", "credentials", "document", "social"],
  general: ["booking", "serviceList", "text", "gallery", "reviews", "location"],
};

function preset(
  id: string,
  label: string,
  layout: keyof typeof T,
  bookingMode: IndustryPreset["suggestedBookingMode"],
  services: string[],
  keywords: string[] = [],
  terminology: Partial<Terms> = {},
  extra: Partial<IndustryPreset> = {},
): IndustryPreset {
  return {
    id,
    label,
    keywords,
    suggestedThemeId: SUGGESTED_THEME[layout],
    starterWidgets: STARTER[layout],
    terminology: { ...T[layout], ...terminology },
    suggestedServices: services.map((name) => ({ name })),
    suggestedBookingMode: bookingMode,
    onboardingFieldKeys: [],
    ...extra,
  };
}

const RAW: IndustryPreset[] = [
  // Trades
  preset("mechanic", "Mechanic / garage", "trades", "request", ["Full service", "MOT preparation", "Diagnostics", "Brake replacement", "Mobile repair visit"], ["car", "vehicle", "garage", "mot"], { booking: "Request a booking" }),
  preset("detailer", "Car detailing", "trades", "request", ["Full valet", "Interior deep clean", "Paint correction", "Ceramic coating"], ["valet", "car wash", "ceramic"]),
  preset("plumber", "Plumber / heating", "trades", "request", ["Emergency call-out", "Boiler service", "Leak repair", "Bathroom fitting"], ["gas", "boiler", "heating"], { booking: "Request a visit" }),
  preset("electrician", "Electrician", "trades", "request", ["Safety inspection", "Rewire", "Fuse board upgrade", "Lighting installation"], [], { booking: "Request a visit" }),
  preset("builder", "Builder / construction", "trades", "request", ["Extensions", "Loft conversion", "Renovation", "Repairs and maintenance"], ["construction", "roofing"], { booking: "Request a quote" }),
  preset("landscaper", "Gardener / landscaper", "trades", "request", ["Garden maintenance", "Lawn care", "Landscaping", "Tree and hedge work"], ["garden", "lawn"], { booking: "Request a quote" }),
  preset("cleaner", "Cleaner", "trades", "request", ["Regular home clean", "Deep clean", "End of tenancy clean", "Office clean"], ["cleaning", "domestic"], { booking: "Request a clean" }),
  preset("locksmith", "Locksmith", "trades", "contact", ["Emergency lockout", "Lock replacement", "Security upgrade"], []),
  preset("removals", "Removals / courier", "trades", "request", ["House move", "Single item delivery", "Packing service"], ["van", "man and van"], { booking: "Request a quote" }),
  preset("handyman", "Handyman", "trades", "request", ["Odd jobs", "Flat-pack assembly", "Painting and decorating", "Small repairs"], []),
  preset("pest-control", "Pest control", "trades", "request", ["Inspection", "Treatment", "Prevention plan"], []),
  // Beauty
  preset("barber", "Barber", "beauty", "instant", ["Haircut", "Skin fade", "Beard trim", "Hot towel shave"], ["hair", "fade"]),
  preset("hairdresser", "Hair salon", "beauty", "instant", ["Cut and finish", "Colour", "Highlights", "Treatment"], ["salon", "stylist"]),
  preset("nails", "Nail technician", "beauty", "instant", ["Gel manicure", "Acrylic set", "Pedicure", "Nail art"], ["manicure"]),
  preset("lashes-brows", "Lashes and brows", "beauty", "instant", ["Lash lift", "Lash extensions", "Brow lamination", "Brow tint"], []),
  preset("beauty-therapist", "Beauty therapist", "beauty", "instant", ["Facial", "Waxing", "Skin treatment"], ["spa", "facial"]),
  preset("massage", "Massage therapist", "beauty", "instant", ["Swedish massage", "Deep tissue", "Sports massage"], ["therapy"]),
  preset("makeup", "Makeup artist", "beauty", "request", ["Bridal makeup", "Event makeup", "Lesson"], []),
  preset("tattoo", "Tattoo / piercing studio", "beauty", "request", ["Consultation", "Custom tattoo", "Piercing"], ["ink"]),
  preset("photographer", "Photographer", "beauty", "request", ["Portrait session", "Event coverage", "Commercial shoot"], [], { booking: "Request a date" }),
  // Education
  preset("tutor", "Tutor", "education", "request", ["GCSE Maths", "A-level Maths", "English", "11+ preparation"], ["teacher", "lessons", "maths", "science"]),
  preset("music-teacher", "Music teacher", "education", "request", ["Piano lessons", "Guitar lessons", "Singing lessons"], ["piano", "guitar"]),
  preset("driving-instructor", "Driving instructor", "education", "request", ["Beginner lessons", "Intensive course", "Refresher lesson", "Mock test"], ["driving"]),
  preset("language-teacher", "Language teacher", "education", "request", ["Conversation lessons", "Exam preparation", "Business language"], []),
  preset("coach", "Coach / mentor", "education", "request", ["Discovery call", "1:1 coaching", "Group programme"], ["mentor", "life coach"]),
  preset("personal-trainer", "Personal trainer", "education", "request", ["Assessment", "1:1 training", "Small-group training"], ["fitness", "gym"], { team: "Trainers" }),
  preset("sports-coach", "Sports coach", "education", "request", ["Individual coaching", "Group sessions", "Team training"], []),
  // Professional
  preset("consultant", "Consultant", "professional", "request", ["Strategy review", "Advisory retainer", "Workshop", "Project delivery"], ["advisor", "adviser"]),
  preset("accountant", "Accountant / bookkeeper", "professional", "request", ["Self-assessment", "Bookkeeping", "Payroll", "Limited company accounts"], ["tax", "bookkeeping"]),
  preset("solicitor", "Solicitor / legal", "professional", "request", ["Initial consultation", "Conveyancing", "Wills and probate"], ["lawyer", "legal"]),
  preset("architect", "Architect / designer", "professional", "request", ["Feasibility study", "Planning application", "Full design service"], ["design", "interior"]),
  preset("financial-adviser", "Financial adviser", "professional", "request", ["Initial meeting", "Retirement planning", "Investment review"], ["mortgage", "ifa"]),
  preset("estate-agent", "Estate / letting agent", "professional", "request", ["Valuation", "Letting service", "Property management"], ["property"]),
  preset("web-designer", "Web / creative freelancer", "professional", "request", ["Brand identity", "Website design", "Ongoing support"], ["freelance", "marketing"]),
  // Clinics and other service businesses -> General layout
  preset("dentist", "Dentist / clinic", "general", "request", ["Check-up", "Hygiene appointment", "Consultation"], ["clinic", "dental"]),
  preset("physio", "Physio / therapist", "general", "request", ["Initial assessment", "Treatment session", "Follow-up"], ["physiotherapy", "chiropractor", "osteopath"]),
  preset("car-dealer", "Car dealer", "general", "instant", ["Book a viewing", "Part-exchange valuation", "Finance conversation"], ["cars", "used cars", "motors", "forecourt"], { booking: "Book a viewing" }, { starterWidgets: ["booking", "products", "serviceList", "team", "reviews", "hours", "location", "enquiry"] }),
  preset("vet", "Vet / pet services", "general", "request", ["Consultation", "Vaccination", "Grooming", "Dog walking"], ["pet", "dog"]),
  preset("hospitality", "Cafe / restaurant", "general", "contact", ["Espresso", "Flat white", "Breakfast", "Cake"], ["food", "cafe", "restaurant", "coffee", "bakery", "pub", "takeaway"], { services: "Menu", booking: "Book a table" }, { suggestedThemeId: "clean", starterWidgets: ["booking", "priceMenu", "document", "hours", "gallery", "location", "social", "reviews"] }),
  preset("event-services", "Events / entertainment", "general", "request", ["Wedding package", "Corporate event", "Party"], ["dj", "catering", "wedding"]),
  // Fallback — always available, publishes immediately.
  preset("designer", "Designer / creative studio", "professional", "contact", ["Brand identity", "Website design", "Design consultation"], ["graphic", "branding", "design", "portfolio"], {services:"Projects",booking:"Discuss a project"}, {suggestedThemeId:"index",starterWidgets:["gallery","text","serviceList","enquiry","social"]}),
  preset("founder", "Founder / entrepreneur", "general", "contact", ["Working session", "Product feedback", "Collaboration"], ["startup", "entrepreneur", "creator", "independent"], {services:"Work together"}, {suggestedThemeId:"founder",starterWidgets:["text","gallery","enquiry","social"]}),
  preset("maker", "Maker / independent shop", "general", "contact", [], ["ceramic", "pottery", "craft", "vintage", "retail", "shop"], {services:"Collection"}, {suggestedThemeId:"kiln",starterWidgets:["products","text","gallery","enquiry"]}),
  preset("florist", "Florist / event stylist", "general", "contact", ["Seasonal bouquet", "Event flowers", "Flowers for a space"], ["floral", "flowers", "event styling"], {}, {suggestedThemeId:"petal",starterWidgets:["gallery","serviceList","enquiry","hours"]}),
  preset("filmmaker", "Filmmaker / videographer", "professional", "contact", ["Brand film", "A day of filming", "Editing"], ["film", "video", "production", "portfolio"], {services:"Work together"}, {suggestedThemeId:"frame",starterWidgets:["gallery","serviceList","text","enquiry"]}),
  preset("illustrator", "Illustrator / artist", "professional", "contact", ["Editorial illustration", "Personal commission"], ["art", "drawing", "lettering", "portfolio"], {services:"Commissions"}, {suggestedThemeId:"canvas",starterWidgets:["gallery","text","serviceList","enquiry"]}),
  preset("interiors", "Interior designer", "professional", "contact", ["Room consultation", "Colour and materials", "Room plan"], ["interior", "styling", "spaces", "portfolio"], {}, {suggestedThemeId:"habitat",starterWidgets:["gallery","serviceList","text","enquiry"]}),
  preset("other", "Other / describe your business", "general", "contact", [], []),
];

export const INDUSTRY_PRESETS: IndustryPreset[] = RAW.map((p) => industryPresetSchema.parse(p));
export const OTHER_INDUSTRY_ID = "other";

const byId = new Map(INDUSTRY_PRESETS.map((p) => [p.id, p]));

/** Unknown keys (e.g. a preset removed after publishing) fall back to General. */
export function getIndustryPreset(id: string): IndustryPreset {
  return byId.get(id) ?? byId.get(OTHER_INDUSTRY_ID)!;
}

export function hasIndustryPreset(id: string): boolean {
  return byId.has(id);
}

/** Searchable catalogue. Empty query returns everything; no match still offers Other. */
export function searchIndustries(query: string): IndustryPreset[] {
  const q = query.trim().toLowerCase();
  if (!q) return INDUSTRY_PRESETS;
  const hits = INDUSTRY_PRESETS.filter(
    (p) =>
      p.id !== OTHER_INDUSTRY_ID &&
      (p.label.toLowerCase().includes(q) || p.keywords.some((k) => k.includes(q) || q.includes(k))),
  );
  return [...hits, byId.get(OTHER_INDUSTRY_ID)!];
}

