import type { BusinessContentInput } from "@/features/businesses/content"
import { art, hours, newWidget, person, svc } from "./helpers"

/**
 * Four more fictional businesses for the inspiration gallery. They are not photographic on purpose: the sample
 * artwork is original (scripts/marketing/illustrations.mjs), so no real person or place is implied. Names,
 * numbers and reviews are invented. Each uses a different starting look and a different mix of content.
 */
const logo = (name: string, alt: string) => ({ src: `/showcase/art/${name}.svg`, alt, width: 256, height: 256 })
const review = (id: string, quote: string, author: string) => ({ id, quote, author, source: "owner_supplied" as const, permissionConfirmed: true })

export const PHYSIO: BusinessContentInput = {
  identity: {
    name: "Hollin Physiotherapy",
    slug: "hollin-physio",
    tagline: "Assessment, treatment and a plan you can follow. Chartered physiotherapists in Leeds.",
    logo: logo("hollin-mark", "Hollin Physiotherapy mark"),
    industryKey: "physio",
    industryLabel: "Physiotherapy",
  },
  location: { mode: "premises", locality: "Headingley, Leeds", addressLine: "2 Otley Road, Leeds LS6", directionsUrl: "https://maps.google.com/?q=Headingley+Leeds", timezone: "Europe/London" },
  contacts: { phone: "0113 496 0123", email: "reception@hollin-physio.example", social: [] },
  about: "A small clinic with long appointments. You see the same physiotherapist each time, and leave with exercises written down.",
  credentials: ["Chartered Society of Physiotherapy members (fictional)", "Private health insurers welcome"],
  hours: [...hours(["mon", "tue", "wed", "thu", "fri"], "08:00", "19:00"), ...hours(["sat"], "09:00", "13:00")],
  services: [
    svc("h1", "Appointments", "Initial assessment", 7500, 60, "A full assessment, a diagnosis and a written plan.", 1, "request"),
    svc("h2", "Appointments", "Follow-up treatment", 5500, 45, "Hands-on treatment and progressed exercises.", 2, "request"),
    svc("h3", "Appointments", "Sports injury review", 6500, 45, "For athletes returning to training.", 3, "request"),
    { ...svc("h4", "Appointments", "Online consultation", 4500, 30, "A video call for advice and exercise review.", 4, "request"), delivery: ["online" as const] },
    { ...svc("h5", "Other", "Insurer or employer enquiry", 0, 15, "Ask us how a claim or referral works.", 5, "contact"), priceMode: "free" as const, priceMinor: undefined },
  ],
  staff: [
    person("amara", "Amara Singh", "Lead physiotherapist", "Amara leads the clinic and sees most back and neck problems. She writes your plan in plain language and expects you to question it.", "priya", ["h1", "h2", "h4"], ["Back and neck", "Rehabilitation"], ["MSc Physiotherapy (fictional)", "Chartered physiotherapist (fictional)"]),
    person("callum", "Callum Reid", "Sports physiotherapist", "Callum works with runners, climbers and rugby players, and is the person to see when you need to be back by a date.", "sam", ["h1", "h2", "h3"], ["Running injuries", "Return to sport"], ["Chartered physiotherapist (fictional)"]),
    person("dani", "Dani Okoro", "Physiotherapist", "Dani looks after post-operative rehabilitation and hip and knee problems, with long, unhurried appointments.", "dan", ["h1", "h2", "h4"], ["Post-operative", "Hips and knees"]),
  ],
  gallery: [],
  testimonials: [
    review("t1", "Clear explanation, a plan I could follow, and I was back running in six weeks.", "R. T."),
    review("t2", "Never rushed. I saw the same person every time.", "M. K."),
  ],
  reviewLinks: [],
  faqs: [
    { id: "f1", question: "Do I need a GP referral?", answer: "No. Most people book directly. If your insurer needs a referral they will tell you." },
    { id: "f2", question: "How long is the first appointment?", answer: "An hour. We assess, explain what we find and agree a plan before you leave." },
    { id: "f3", question: "What if I need to change my appointment?", answer: "You can move or cancel up to 24 hours before, free of charge." },
  ],
  caseStudies: [],
  products: [],
  offers: [],
  booking: { mode: "request", onlineBookingReady: true },
}

export const CAFE: BusinessContentInput = {
  identity: {
    name: "Pim's Kitchen",
    slug: "pims-kitchen",
    tagline: "Breakfast, brunch and very good coffee on Chapel Street.",
    logo: logo("pim-mark", "Pim's Kitchen mark"),
    heroImage: art("pim-hero", "An illustrated café front with awning and two plates", 1200, 800, { x: 50, y: 50 }),
    industryKey: "cafe",
    industryLabel: "Café",
  },
  location: { mode: "premises", locality: "Chapel Street, Salford", addressLine: "9 Chapel Street, Salford M3", directionsUrl: "https://maps.google.com/?q=Chapel+Street+Salford", timezone: "Europe/London" },
  contacts: {
    phone: "0161 496 0188",
    whatsapp: "+447700900455",
    email: "hello@pims-kitchen.example",
    social: [{ platform: "instagram", url: "https://instagram.com/pimskitchen" }, { platform: "tiktok", url: "https://tiktok.com/@pimskitchen" }],
  },
  about: "Eggs, good bread and coffee that is roasted twenty minutes away. Walk in any time. Book ahead for groups.",
  credentials: [],
  hours: [...hours(["tue", "wed", "thu", "fri"], "08:00", "16:00"), ...hours(["sat", "sun"], "09:00", "17:00")],
  services: [
    svc("c1", "Breakfast", "Shakshuka with flatbread", 1150, 20, "Baked eggs, peppers and tomato, with warm flatbread.", 1, "contact"),
    svc("c2", "Breakfast", "Cinnamon bun", 380, 5, "Baked every morning. Gone by noon.", 2, "contact"),
    svc("c3", "Coffee", "Flat white", 340, 5, "Two shots, steamed whole milk or oat.", 3, "contact"),
    svc("c4", "Coffee", "Filter, refills included", 300, 5, "Today's single-origin filter.", 4, "contact"),
    { ...svc("c5", "Groups", "Table for four to eight", 0, 90, "Reserve a table for a group. We confirm by message.", 5, "request"), priceMode: "free" as const, priceMinor: undefined },
  ],
  staff: [],
  gallery: [
    { id: "g1", image: art("pim-shakshuka", "Illustrated baked eggs in tomato sauce", 800, 1000), caption: "Shakshuka" },
    { id: "g2", image: art("pim-flatwhite", "Illustrated flat white from above", 800, 1000), caption: "Flat white" },
    { id: "g3", image: art("pim-cinnamon", "Illustrated cinnamon bun from above", 800, 1000), caption: "Cinnamon bun" },
  ],
  testimonials: [review("t1", "The shakshuka alone is worth the walk.", "Imogen P.")],
  reviewLinks: [],
  faqs: [
    { id: "f1", question: "Do you take bookings?", answer: "Walk-ins are welcome any time. For six or more, send a request and we will confirm." },
    { id: "f2", question: "Is there step-free access?", answer: "Yes, through the front door. The accessible toilet is on the ground floor." },
  ],
  caseStudies: [],
  products: [],
  offers: [],
  booking: { mode: "request", onlineBookingReady: true },
}

export const TUTOR: BusinessContentInput = {
  identity: {
    name: "Ada Okafor Maths",
    slug: "ada-okafor-maths",
    tagline: "GCSE and A-level maths tuition, in person in Bristol or online.",
    logo: logo("ada-mark", "Ada Okafor Maths mark"),
    industryKey: "tutor",
    industryLabel: "Tutoring",
  },
  location: { mode: "online", locality: "Bristol and online", timezone: "Europe/London" },
  contacts: { email: "ada@okafor-maths.example", whatsapp: "+447700900466", social: [{ platform: "youtube", url: "https://youtube.com/@adaokaformaths" }] },
  about: "Ten years teaching maths in secondary schools. I teach one student at a time, build confidence first and show the method before the answer.",
  credentials: ["QTS (fictional)", "Enhanced DBS check (fictional)", "Former head of maths"],
  hours: [...hours(["mon", "tue", "wed", "thu"], "15:30", "20:00"), ...hours(["sat"], "09:00", "13:00")],
  services: [
    { ...svc("a1", "Lessons", "Trial lesson", 0, 30, "Half an hour to meet, find the gaps and agree a plan. No charge.", 1, "instant"), priceMode: "free" as const, priceMinor: undefined },
    { ...svc("a2", "Lessons", "One-to-one lesson (online)", 4000, 60, "A video lesson with a shared whiteboard.", 2, "instant"), delivery: ["online" as const] },
    { ...svc("a3", "Lessons", "One-to-one lesson (in person)", 4500, 60, "At my home in Bristol BS8.", 3, "request"), delivery: ["premises" as const] },
    svc("a4", "Courses", "Exam revision block (6 lessons)", 22000, 60, "Six lessons planned around your exam board and date.", 4, "request"),
  ],
  staff: [],
  gallery: [],
  testimonials: [review("t1", "My son went from dreading maths to asking for extra questions.", "A parent"), review("t2", "She explains why, not just how.", "Year 11 student")],
  reviewLinks: [],
  faqs: [
    { id: "f1", question: "Which exam boards do you teach?", answer: "AQA, Edexcel and OCR for GCSE, and the main A-level maths specifications." },
    { id: "f2", question: "Can parents sit in?", answer: "For the trial lesson, yes. After that it is up to the student." },
    { id: "f3", question: "What if we need to cancel?", answer: "Free up to 24 hours before. After that the lesson is charged." },
  ],
  caseStudies: [],
  products: [],
  offers: [],
  booking: { mode: "instant", onlineBookingReady: true },
}

export const GYM: BusinessContentInput = {
  identity: {
    name: "Forge Strength",
    slug: "forge-strength",
    tagline: "Small-group strength classes. Coached every rep.",
    logo: logo("forge-mark", "Forge Strength mark"),
    heroImage: art("forge-hero", "An illustrated barbell in orange on charcoal", 1200, 800, { x: 50, y: 50 }),
    industryKey: "gym",
    industryLabel: "Fitness studio",
  },
  location: { mode: "premises", locality: "Digbeth, Birmingham", addressLine: "Unit 3, Fazeley Street, Birmingham B5", directionsUrl: "https://maps.google.com/?q=Digbeth+Birmingham", timezone: "Europe/London" },
  contacts: { phone: "0121 496 0144", email: "coach@forge-strength.example", social: [{ platform: "instagram", url: "https://instagram.com/forgestrength" }, { platform: "tiktok", url: "https://tiktok.com/@forgestrength" }] },
  about: "Six people per class, one coach, one plan. Beginners welcome. We teach the lifts before we ask for weight.",
  credentials: [],
  hours: [...hours(["mon", "tue", "wed", "thu", "fri"], "06:00", "20:00"), ...hours(["sat"], "08:00", "13:00")],
  services: [
    { ...svc("g1", "Classes", "Free intro session", 0, 45, "Meet a coach, try the lifts and ask anything.", 1, "instant"), priceMode: "free" as const, priceMinor: undefined },
    svc("g2", "Classes", "Strength class", 1200, 60, "Six people, one coach. Drop in or book a block.", 2, "instant"),
    svc("g3", "Classes", "Beginners foundations", 1000, 60, "Learn the five main lifts, with lighter loads.", 3, "instant"),
    svc("g4", "Coaching", "One-to-one coaching", 5500, 60, "A programme built around you.", 4, "request"),
    { ...svc("g5", "Memberships", "Monthly membership", 6500, 30, "Unlimited classes. Cancel with 30 days' notice.", 5, "contact"), priceMode: "fixed" as const },
  ],
  staff: [
    person("jay", "Jay Brannigan", "Head coach", "Jay founded Forge after ten years coaching powerlifters. He runs the early classes and the beginners block.", "jonah", null, ["Powerlifting", "Beginners"], ["Strength coach (fictional)"]),
    person("sol", "Sol Martins", "Coach", "Sol coaches the evening classes and one-to-ones, with a focus on mobility and getting stronger without getting hurt.", "mira", ["g1", "g2", "g3", "g4"], ["Mobility", "Strength"]),
    person("noa", "Noa Fenwick", "Coach", "Noa leads the Saturday classes and teaches the beginners foundations.", "reece", ["g1", "g2", "g3"], ["Olympic lifting"]),
    person("kit", "Kit Osei", "Coach", "Kit programmes the one-to-one clients and runs recovery sessions.", "kofi", ["g4"], ["Programming"]),
  ],
  gallery: [{ id: "g1", image: art("forge-class", "An illustrated coach silhouette on orange", 800, 1000), caption: "Coached every rep" }],
  testimonials: [review("t1", "Six in a class means the coach actually sees you.", "Dev P."), review("t2", "I came to get fitter and ended up deadlifting my bodyweight.", "Sarah L.")],
  reviewLinks: [],
  faqs: [
    { id: "f1", question: "I have never lifted. Is this for me?", answer: "Yes. Start with the free intro session or the beginners block." },
    { id: "f2", question: "Can I cancel a class?", answer: "Free up to 12 hours before. After that the session is used." },
  ],
  caseStudies: [],
  products: [],
  offers: [],
  booking: { mode: "instant", onlineBookingReady: true },
}

export const EXTRA_WIDGETS = {
  physio: () => [
    newWidget("booking", { label: "Request an appointment", variant: "button" }),
    newWidget("serviceList", { title: "Appointments", variant: "list" }),
    newWidget("team", { title: "Your physiotherapists", variant: "grid" }),
    newWidget("faq", { title: "Before you book" }),
    newWidget("credentials", { title: "Standards", variant: "list" }),
    newWidget("reviews", { title: "Patient comments", variant: "quote" }),
    newWidget("hours", { title: "Clinic hours" }),
    newWidget("location", { title: "Find the clinic" }),
  ],
  cafe: () => [
    newWidget("booking", { label: "Request a group table", variant: "button" }),
    newWidget("priceMenu", { title: "The menu" }),
    newWidget("gallery", { title: "This morning", variant: "carousel" }),
    newWidget("reviews", { title: "Regulars say", variant: "quote" }),
    newWidget("hours", { title: "Opening times", variant: "compact" }),
    newWidget("location", { title: "Find us" }),
    newWidget("social", { variant: "icons" }),
    newWidget("share", { label: "Share Pim's Kitchen", variant: "button" }),
  ],
  tutor: () => [
    newWidget("booking", { label: "Book a free trial", serviceId: "a1", variant: "button" }),
    newWidget("whatsapp", { label: "Message on WhatsApp", variant: "button" }),
    newWidget("priceMenu", { title: "Lessons and courses" }),
    newWidget("credentials", { title: "Experience", variant: "chips" }),
    newWidget("reviews", { title: "What students and parents say", variant: "cards" }),
    newWidget("faq", { title: "Common questions" }),
    newWidget("enquiry", { title: "Ask about a subject", intro: "Tell me the year group and exam board and I will reply with a plan.", variant: "inline" }),
  ],
  gym: () => [
    newWidget("booking", { label: "Book your free intro", serviceId: "g1", variant: "button" }),
    newWidget("serviceList", { title: "Classes and coaching", variant: "cards" }),
    newWidget("team", { title: "Your coaches", variant: "swipe" }),
    newWidget("gallery", { title: "The floor", variant: "grid" }),
    newWidget("reviews", { title: "Members", variant: "swipe" }),
    newWidget("faq", { title: "Questions" }),
    newWidget("hours", { title: "Hours", variant: "compact" }),
    newWidget("location", { title: "Find the studio" }),
  ],
}
