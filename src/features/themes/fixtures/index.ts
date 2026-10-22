import type { BusinessContentInput } from "@/features/businesses/content";
import type { PlanId } from "@/features/subscriptions/plans";

/**
 * SYNTHETIC fixtures for development and visual QA only.
 * Names, numbers, reviews and photos are invented placeholders. They must never
 * be published as real business information. Phone numbers use Ofcom's reserved
 * drama ranges; emails/URLs use example.com.
 */

const img = (n: number, alt: string) => ({ src: `/fixtures/img-${n}.svg`, alt, width: 1200, height: 900 });
const SAMPLE = "Synthetic placeholder image";

export interface Fixture {
  key: string;
  label: string;
  plan: PlanId;
  content: BusinessContentInput;
}

function svc(
  id: string,
  name: string,
  priceMode: "fixed" | "from" | "quote" | "free",
  priceMinor: number | undefined,
  durationMinutes: number | undefined,
  description: string | undefined,
  extra: Partial<NonNullable<BusinessContentInput["services"]>[number]> = {},
) {
  return { id, name, priceMode, priceMinor, durationMinutes, description, currency: "GBP", delivery: [], bookingMode: "request" as const, sortOrder: 0, ...extra };
}

const mechanic: Fixture = {
  key: "mechanic",
  label: "Mechanic",
  plan: "business",
  content: {
    identity: {
      name: "Northgate Garage",
      slug: "demo-mechanic",
      tagline: "Independent servicing, MOT prep and honest diagnostics.",
      heroImage: img(1, SAMPLE),
      industryKey: "mechanic",
      industryLabel: "Mechanic / garage",
    },
    location: { mode: "premises", locality: "Watford", addressLine: "Unit 4, Example Estate, Watford WD00 0AA", directionsUrl: "https://example.com/directions", timezone: "Europe/London" },
    contacts: { phone: "01632 960123", whatsapp: "07700 900123", email: "hello@example.com", social: [{ platform: "facebook", url: "https://example.com/facebook" }] },
    about: "A small independent garage. We explain what is needed, what can wait, and what it costs before any work starts.",
    credentials: [],
    hours: [],
    services: [
      svc("s1", "Full service", "from", 14900, 180, "Oil and filter, fluid checks, brake and tyre inspection with a written report."),
      svc("s2", "MOT preparation", "fixed", 4500, 60, "Pre-MOT inspection so there are no surprises on the day."),
      svc("s3", "Diagnostics", "fixed", 6000, 60, "Warning lights read and explained with a clear next step."),
      svc("s4", "Brake replacement", "from", 12000, 120, "Pads and discs, fitted and bedded in."),
      svc("s5", "Mobile repair visit", "quote", undefined, undefined, "We come to you for jobs that do not need a ramp."),
    ].map((s, i) => ({ ...s, sortOrder: i })),
    staff: [{ id: "t1", slug: "sam", name: "Sam Example", role: "Lead technician", bio: "Fifteen years in independent workshops.", subjects: [] }],
    gallery: [
      { id: "g1", image: img(1, SAMPLE), caption: "Workshop bay (sample)" },
      { id: "g2", image: img(6, SAMPLE), caption: "Diagnostics (sample)" },
      { id: "g3", image: img(8, SAMPLE), caption: "Brake work (sample)" },
      { id: "g4", image: img(5, SAMPLE), caption: "Servicing (sample)" },
    ],
    testimonials: [
      { id: "r1", quote: "Sample testimonial text for layout testing only.", author: "Sample Customer", source: "owner_supplied", permissionConfirmed: true },
      { id: "r2", quote: "A second synthetic quote to test wrapping across lines and breakpoints.", author: "Another Sample", source: "owner_supplied", permissionConfirmed: true },
    ],
    reviewLinks: [{ platform: "google", url: "https://example.com/google-review" }],
    faqs: [{ id: "f1", question: "Do you give a quote first?", answer: "Yes. You approve the work and price before we start." }],
    caseStudies: [],
    booking: { mode: "request", onlineBookingReady: true },
  },
};

const detailer: Fixture = {
  key: "detailer",
  label: "Car detailer",
  plan: "business",
  content: {
    identity: { name: "Mirror Finish Detailing", slug: "demo-detailer", tagline: "Paint correction and protection, done properly.", heroImage: img(6, SAMPLE), industryKey: "detailer", industryLabel: "Car detailing" },
    location: { mode: "service_area", locality: "Hertfordshire and North London", timezone: "Europe/London" },
    contacts: { phone: "01632 960456", whatsapp: "07700 900456", social: [{ platform: "instagram", url: "https://example.com/instagram" }] },
    about: "Mobile and workshop detailing. Every job starts with an honest assessment of the paint.",
    credentials: [],
    hours: [],
    services: [
      svc("s1", "Full valet", "from", 8500, 180, "Inside and out, hand finished."),
      svc("s2", "Interior deep clean", "fixed", 12000, 240, "Steam clean, leather care, odour removal."),
      svc("s3", "Paint correction", "from", 35000, 480, "Multi-stage machine polish to remove swirls and light scratches."),
      svc("s4", "Ceramic coating", "quote", undefined, undefined, "Long-term protection, priced after paint assessment."),
    ].map((s, i) => ({ ...s, sortOrder: i, delivery: ["mobile" as const] })),
    staff: [],
    gallery: [
      { id: "g1", image: img(6, SAMPLE), beforeImage: img(8, SAMPLE), caption: "Bonnet correction (sample before / after)" },
      { id: "g2", image: img(2, SAMPLE), beforeImage: img(7, SAMPLE), caption: "Interior refresh (sample before / after)" },
      { id: "g3", image: img(1, SAMPLE), caption: "Finish check (sample)" },
    ],
    testimonials: [],
    reviewLinks: [{ platform: "google", url: "https://example.com/google-review" }],
    faqs: [],
    caseStudies: [],
    booking: { mode: "request", onlineBookingReady: true },
  },
};

const barber: Fixture = {
  key: "barber",
  label: "Barber",
  plan: "business",
  content: {
    identity: { name: "Olive & Oak Barbers", slug: "demo-barber", tagline: "Classic cuts, sharp fades and a proper hot towel shave.", heroImage: img(2, SAMPLE), industryKey: "barber", industryLabel: "Barber" },
    location: { mode: "premises", locality: "St Albans", addressLine: "12 Example Street, St Albans AL0 0AA", directionsUrl: "https://example.com/directions", timezone: "Europe/London" },
    contacts: { phone: "01632 960789", email: "book@example.com", social: [{ platform: "instagram", url: "https://example.com/instagram" }, { platform: "tiktok", url: "https://example.com/tiktok" }] },
    about: "Three chairs, no rush. Walk-ins when there is space, appointments when there is not.",
    credentials: [],
    hours: [],
    services: [
      svc("s1", "Haircut", "fixed", 2200, 30, "Consultation, cut and style.", { group: "Hair", bookingMode: "instant" }),
      svc("s2", "Skin fade", "fixed", 2600, 40, "Tight blend with a foil finish.", { group: "Hair", bookingMode: "instant" }),
      svc("s3", "Beard trim", "fixed", 1500, 20, "Shape, line-up and hot towel.", { group: "Beard", bookingMode: "instant" }),
      svc("s4", "Hot towel shave", "fixed", 2800, 30, "Straight razor shave.", { group: "Beard", bookingMode: "instant" }),
      svc("s5", "Cut and beard", "fixed", 3600, 55, "The full set.", { group: "Combos", bookingMode: "instant" }),
    ].map((s, i) => ({ ...s, sortOrder: i, image: img((i % 6) + 2, SAMPLE) })),
    staff: [
      { id: "t1", slug: "jo", name: "Jo Example", role: "Senior barber", bio: "Specialises in fades and classic scissor work.", photo: img(7, SAMPLE), subjects: [] },
      { id: "t2", slug: "kai", name: "Kai Example", role: "Barber", bio: "Beard design and razor work.", photo: img(4, SAMPLE), subjects: [] },
    ],
    gallery: [2, 5, 7, 3, 4, 1].map((n, i) => ({ id: `g${i}`, image: img(n, SAMPLE), caption: i === 0 ? "Fade and line-up (sample)" : undefined })),
    testimonials: [{ id: "r1", quote: "Synthetic sample quote used to test the single-quote layout at length without any real customer wording.", author: "Sample Client", source: "owner_supplied", permissionConfirmed: true }],
    reviewLinks: [{ platform: "google", url: "https://example.com/google-review" }],
    faqs: [{ id: "f1", question: "Do you take walk-ins?", answer: "Yes, when a chair is free. Booking guarantees your slot." }],
    caseStudies: [],
    booking: { mode: "instant", onlineBookingReady: true },
  },
};

const tutor: Fixture = {
  key: "tutor",
  label: "Tutor",
  plan: "business",
  content: {
    identity: { name: "Clearpath Maths Tuition", slug: "demo-tutor", tagline: "Patient GCSE and A-level maths tuition, online and in person.", heroImage: img(3, SAMPLE), industryKey: "tutor", industryLabel: "Tutor" },
    location: { mode: "online", locality: "Online, and in Bushey", timezone: "Europe/London" },
    contacts: { phone: "01632 960321", whatsapp: "07700 900321", email: "lessons@example.com", social: [] },
    about: "Tuition built around understanding, not memorising. Every student starts with a short diagnostic so lessons target the gaps that matter. Sample text for layout testing.",
    credentials: ["Sample: Maths degree (placeholder credential)", "Sample: Enhanced DBS (placeholder)"],
    hours: [],
    services: [
      svc("s1", "GCSE Maths", "fixed", 4000, 60, "Foundation and higher tier, exam technique included.", { delivery: ["online", "premises"] }),
      svc("s2", "A-level Maths", "fixed", 5000, 60, "Pure, statistics and mechanics.", { delivery: ["online"] }),
      svc("s3", "11+ preparation", "fixed", 3500, 60, "Verbal, non-verbal and maths reasoning.", { delivery: ["online"] }),
      svc("s4", "Free introductory call", "free", undefined, 15, "Meet, discuss goals, no obligation.", { delivery: ["online"], bookingMode: "request" }),
    ].map((s, i) => ({ ...s, sortOrder: i })),
    staff: [
      { id: "t1", slug: "priya", name: "Priya Example", role: "Maths tutor", bio: "Sample biography for layout testing.", photo: img(7, SAMPLE), subjects: ["GCSE Maths", "A-level Maths"] },
      { id: "t2", slug: "daniel", name: "Daniel Example", role: "Science tutor", bio: "Sample biography for layout testing.", photo: img(4, SAMPLE), subjects: ["Physics", "Chemistry"] },
    ],
    gallery: [],
    testimonials: [
      { id: "r1", quote: "Sample parent testimonial for layout testing only.", author: "Sample Parent", source: "owner_supplied", permissionConfirmed: true },
      { id: "r2", quote: "Sample student testimonial for layout testing only.", author: "Sample Student", source: "owner_supplied", permissionConfirmed: true },
    ],
    reviewLinks: [],
    faqs: [
      { id: "f1", question: "Where do lessons happen?", answer: "Online by default; in person where travel is practical." },
      { id: "f2", question: "How do I pay?", answer: "After each lesson. Details are shared when you book." },
    ],
    caseStudies: [],
    booking: { mode: "request", onlineBookingReady: true },
  },
};

const consultant: Fixture = {
  key: "consultant",
  label: "Consultant",
  plan: "business",
  content: {
    identity: { name: "Halden & Moss Advisory", slug: "demo-consultant", tagline: "Operational strategy for owner-managed businesses.", heroImage: img(4, SAMPLE), industryKey: "consultant", industryLabel: "Consultant" },
    location: { mode: "online", locality: "London and remote", timezone: "Europe/London" },
    contacts: { phone: "01632 960654", email: "enquiries@example.com", website: "https://example.com", social: [{ platform: "linkedin", url: "https://example.com/linkedin" }] },
    about: "We work with founders who have outgrown improvisation. Engagements are short, specific and finish with a plan your team can run without us. This is synthetic sample copy.",
    credentials: ["Sample: Chartered status (placeholder)"],
    hours: [],
    services: [
      svc("s1", "Strategy review", "from", 150000, undefined, "A focused two-week review of positioning, pricing and operations, ending in a prioritised plan.", { bookingMode: "request" }),
      svc("s2", "Advisory retainer", "quote", undefined, undefined, "Monthly access for decisions that cannot wait for a project.", { bookingMode: "request" }),
      svc("s3", "Leadership workshop", "fixed", 90000, 240, "A half-day session for the leadership team.", { bookingMode: "request" }),
    ].map((s, i) => ({ ...s, sortOrder: i })),
    staff: [{ id: "t1", slug: "alex", name: "Alex Example", role: "Principal", bio: "Sample biography.", subjects: [] }],
    gallery: [],
    testimonials: [{ id: "r1", quote: "A synthetic client comment included purely so the pull-quote treatment can be reviewed.", author: "Sample Director", source: "owner_supplied", permissionConfirmed: true }],
    reviewLinks: [],
    faqs: [{ id: "f1", question: "How are engagements priced?", answer: "Fixed fee, agreed after an introductory call." }],
    caseStudies: [
      { id: "c1", title: "Sample: restructuring a regional distributor", summary: "Synthetic case study text used to test the long-form layout. It describes a fictional engagement and contains no real client information.", outcome: "Sample outcome statement (fictional)", image: img(8, SAMPLE) },
      { id: "c2", title: "Sample: pricing review for a service firm", summary: "Another fictional case study for layout testing.", outcome: undefined },
    ],
    booking: { mode: "request", onlineBookingReady: false },
  },
};

const unlisted: Fixture = {
  key: "unlisted",
  label: "Unlisted industry (dog groomer)",
  plan: "core",
  content: {
    identity: { name: "Paws & Polish Grooming", slug: "demo-groomer", tagline: "Gentle grooming for dogs of every size.", industryKey: "other", industryLabel: "Dog groomer" },
    location: { mode: "premises", locality: "Harpenden", addressLine: "3 Example Lane, Harpenden AL0 0AA", timezone: "Europe/London" },
    contacts: { phone: "01632 960987", whatsapp: "07700 900987", social: [] },
    about: "A calm, small-scale grooming studio. One dog at a time.",
    credentials: [],
    hours: [],
    services: [
      svc("s1", "Full groom - small dog", "from", 4500, 90, "Bath, dry, trim and finish.", { bookingMode: "contact" }),
      svc("s2", "Full groom - large dog", "from", 7000, 150, "Bath, dry, trim and finish.", { bookingMode: "contact" }),
      svc("s3", "Bath and brush", "fixed", 3000, 60, undefined, { bookingMode: "contact" }),
    ].map((s, i) => ({ ...s, sortOrder: i })),
    staff: [],
    gallery: [],
    testimonials: [],
    reviewLinks: [],
    faqs: [],
    caseStudies: [],
    booking: { mode: "contact", onlineBookingReady: false },
  },
};

/** Edge-case datasets for the theme acceptance gate (spec 5.8). */
const minimal: Fixture = {
  key: "minimal",
  label: "Edge: bare minimum (no logo/photos/reviews, one service, phone only)",
  plan: "free",
  content: {
    identity: { name: "Ada's Tutoring", slug: "demo-minimal", industryKey: "other", industryLabel: "Tutor" },
    location: { mode: "online", timezone: "Europe/London" },
    contacts: { phone: "01632 960111", social: [] },
    credentials: [],
    hours: [],
    services: [svc("s1", "Maths lesson", "fixed", 3500, 60, undefined, { bookingMode: "contact" })],
    staff: [], gallery: [], testimonials: [], reviewLinks: [], faqs: [], caseStudies: [],
    booking: { mode: "contact", onlineBookingReady: false },
  },
};

const noContacts: Fixture = {
  key: "no-contacts",
  label: "Edge: no contact channels",
  plan: "free",
  content: {
    identity: { name: "Quiet Studio", slug: "demo-nocontact", industryKey: "other", industryLabel: "Studio" },
    location: { mode: "premises", locality: "Luton", timezone: "Europe/London" },
    contacts: { social: [] },
    about: "A profile with no contact methods configured yet. No dead links should be rendered.",
    credentials: [],
    hours: [],
    services: [svc("s1", "Consultation", "quote", undefined, undefined, undefined, { bookingMode: "contact" })],
    staff: [], gallery: [], testimonials: [], reviewLinks: [], faqs: [], caseStudies: [],
    booking: { mode: "contact", onlineBookingReady: false },
  },
};

const long = "Extraordinarily Long-Named Professional Services and Specialist Consultancy Partnership";
const stress: Fixture = {
  key: "stress",
  label: "Edge: long names, long descriptions, many services",
  plan: "business",
  content: {
    identity: { name: long, slug: "demo-stress", tagline: "A deliberately long tagline that keeps going to test wrapping behaviour across every layout family and every breakpoint we support.", heroImage: img(5, SAMPLE), industryKey: "consultant", industryLabel: "Consultant" },
    location: { mode: "service_area", locality: "Hertfordshire, Bedfordshire, Buckinghamshire, North London and surrounding areas", timezone: "Europe/London" },
    contacts: { phone: "01632 960222", whatsapp: "07700 900222", email: "a-very-long-email-address-for-wrapping-tests@example.com", social: [] },
    about: ("Long about text for wrapping tests. ".repeat(40)).trim(),
    credentials: ["Sample credential with a deliberately long description to test wrapping inside chips and lists"],
    hours: [],
    services: Array.from({ length: 14 }, (_, i) =>
      svc(`s${i}`, `Service number ${i + 1} with a long descriptive name ${i % 2 ? "and more words" : ""}`.trim(), i % 3 === 0 ? "quote" : "from", i % 3 === 0 ? undefined : 5000 + i * 1250, 30 + (i % 4) * 30,
        "A deliberately long service description that runs across several lines to check that cards, rows and menus stay readable. ".repeat(3).trim(), { group: i < 7 ? "Core work" : "Specialist work", sortOrder: i }),
    ),
    staff: [{ id: "t1", slug: "x", name: "Dr Alexandria Montgomery-Featherstonehaugh", role: "Principal consultant and head of long titles", bio: "Sample bio. ".repeat(20).trim(), subjects: [] }],
    gallery: [1, 2, 3, 4, 5].map((n) => ({ id: `g${n}`, image: img(n, SAMPLE), caption: "A long caption used for wrapping tests in galleries." })),
    testimonials: [{ id: "r1", quote: "A long synthetic testimonial. ".repeat(14).trim(), author: "Sample Person With A Long Name", source: "owner_supplied", permissionConfirmed: true }],
    reviewLinks: [{ platform: "google", url: "https://example.com/g" }, { platform: "trustpilot", url: "https://example.com/t" }],
    faqs: [{ id: "f1", question: "A long question that will wrap onto multiple lines in every layout?", answer: "A long answer. ".repeat(30).trim() }],
    caseStudies: [{ id: "c1", title: "A long case study title that wraps across lines", summary: "Long summary. ".repeat(30).trim(), outcome: "Outcome text", image: img(3, SAMPLE) }],
    booking: { mode: "request", onlineBookingReady: true },
  },
};

export const FIXTURES: Fixture[] = [mechanic, detailer, barber, tutor, consultant, unlisted, minimal, noContacts, stress];
export const INDUSTRY_FIXTURE_KEYS = ["mechanic", "detailer", "barber", "tutor", "consultant", "unlisted"];

const byKey = new Map(FIXTURES.map((f) => [f.key, f]));
const bySlug = new Map(FIXTURES.map((f) => [f.content.identity.slug, f]));
export const getFixture = (key: string) => byKey.get(key);
export const getFixtureBySlug = (slug: string) => bySlug.get(slug);
