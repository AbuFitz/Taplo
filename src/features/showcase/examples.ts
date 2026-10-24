import type { BusinessContentInput } from "@/features/businesses/content"
import { hours, newWidget, person, photo, svc } from "./helpers"

/**
 * Four more fictional businesses for the inspiration gallery. They carry no photographs or illustrated people on purpose: the only artwork is each business's flat logo (scripts/marketing/logos.mjs), so no real person or place is implied. Names,
 * numbers and reviews are invented. Each uses a different starting look and a different mix of content.
 */
const logo = (name: string, alt: string) => ({ src: `/showcase/${name}.svg`, alt, width: 256, height: 256 })
const review = (id: string, quote: string, author: string) => ({ id, quote, author, source: "owner_supplied" as const, permissionConfirmed: true })

export const PHYSIO: BusinessContentInput = {
  identity: {
    name: "Hollin Physiotherapy",
    slug: "hollin-physio",
    tagline: "A little more time. A clear plan for moving better.",
    logo: logo("hollin-mark", "Hollin Physiotherapy mark"),
    industryKey: "physio",
    industryLabel: "Physiotherapy",
  },
  location: { mode: "premises", locality: "Headingley, Leeds", addressLine: "2 Otley Road, Leeds LS6", directionsUrl: "https://maps.google.com/?q=Headingley+Leeds", timezone: "Europe/London" },
  contacts: { phone: "0113 496 0123", email: "reception@hollin-physio.example", social: [] },
  about: "A small clinic with long appointments. You see the same physiotherapist each time, and leave with exercises written down.",
  credentials: [],
  hours: [...hours(["mon", "tue", "wed", "thu", "fri"], "08:00", "19:00"), ...hours(["sat"], "09:00", "13:00")],
  services: [
    svc("h1", "Appointments", "Initial assessment", 7500, 60, "A full assessment, time to discuss your goals and a written plan.", 1, "request"),
    svc("h2", "Appointments", "Follow-up treatment", 5500, 45, "Hands-on treatment and progressed exercises.", 2, "request"),
    svc("h3", "Appointments", "Sports injury review", 6500, 45, "For athletes returning to training.", 3, "request"),
    { ...svc("h4", "Appointments", "Online consultation", 4500, 30, "A video call for advice and exercise review.", 4, "request"), delivery: ["online" as const] },
    { ...svc("h5", "Other", "Insurer or employer enquiry", 0, 15, "Ask us how a claim or referral works.", 5, "contact"), priceMode: "free" as const, priceMinor: undefined },
  ],
  staff: [
    person("amara", "Amara Singh", "Lead physiotherapist", "Amara leads the clinic and sees most back and neck problems. She writes your plan in plain language and expects you to question it.", ["h1", "h2", "h4"], ["Back and neck", "Rehabilitation"], []),
    person("callum", "Callum Reid", "Sports physiotherapist", "Callum works with runners, climbers and rugby players, and is the person to see when you need to be back by a date.", ["h1", "h2", "h3"], ["Running injuries", "Return to sport"], []),
    person("dani", "Dani Okoro", "Physiotherapist", "Dani looks after post-operative rehabilitation and hip and knee problems, with long, unhurried appointments.", ["h1", "h2", "h4"], ["Post-operative", "Hips and knees"]),
  ],
  gallery: [],
  testimonials: [],
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
    heroImage: photo("cafe-hero", "A table of eggs, waffles, fruit and coffee seen from above", 1600, 1067, { x: 50, y: 48 }),
    industryKey: "hospitality",
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
    { id: "g1", image: photo("cafe-toast", "Egg on avocado toast on a white plate", 1600, 1600, { x: 50, y: 50 }), caption: "Eggs on toast" },
    { id: "g2", image: photo("cafe-window", "A small table by a tall window with a cafetière and cups", 1600, 1067, { x: 45, y: 55 }), caption: "The window table" },
    { id: "g3", image: photo("cafe-latte", "Two flat whites on a wooden table", 1600, 1067, { x: 55, y: 50 }), caption: "Flat whites" },
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
    heroImage: photo("tutor-hero", "A hand writing notes beside a mug and a notebook", 1600, 1067, { x: 55, y: 50 }),
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
    tagline: "Your first rep starts here. Small groups. Proper coaching.",
    logo: logo("forge-mark", "Forge Strength mark"),
    heroImage: photo("gym-hero", "A lifter gripping a loaded barbell on a rubber gym floor", 1600, 1067, { x: 62, y: 45 }),
    industryKey: "personal-trainer",
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
    person("jay", "Jay Brannigan", "Head coach", "Jay founded Forge after ten years coaching powerlifters. He runs the early classes and the beginners block.", null, ["Powerlifting", "Beginners"], []),
    person("sol", "Sol Martins", "Coach", "Sol coaches the evening classes and one-to-ones, with a focus on mobility and getting stronger without getting hurt.", ["g1", "g2", "g3", "g4"], ["Mobility", "Strength"]),
    person("noa", "Noa Fenwick", "Coach", "Noa leads the Saturday classes and teaches the beginners foundations.", ["g1", "g2", "g3"], ["Olympic lifting"]),
    person("kit", "Kit Osei", "Coach", "Kit programmes the one-to-one clients and runs recovery sessions.", ["g4"], ["Programming"]),
  ],
  gallery: [
    { id: "g1", image: photo("gym-weights", "A rack of dumbbells in a bright gym", 1600, 1067, { x: 40, y: 50 }), caption: "The floor" },
    { id: "g2", image: photo("gym-ropes", "Battle ropes being swung beneath a concrete bridge", 1600, 1069, { x: 55, y: 50 }), caption: "Conditioning" },
    { id: "g3", image: photo("gym-floor", "A spacious white studio with bikes and racks", 1600, 1067, { x: 50, y: 50 }), caption: "The studio" },
  ],
  testimonials: [],
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
    newWidget("hours", { title: "Clinic hours" }),
    newWidget("location", { title: "Find the clinic" }),
  ],
  cafe: () => [
    newWidget("booking", { label: "Request a group table", variant: "button" }),
    newWidget("gallery", { title: "From the kitchen", variant: "grid" }),
    newWidget("priceMenu", { title: "The menu", serviceIds: ["c1", "c2", "c3", "c4"] }),
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
    newWidget("featuredService", { headline: "Start with an introduction", serviceId: "g1" }),
    newWidget("serviceList", { title: "Classes and coaching", variant: "list" }),
    newWidget("gallery", { title: "Inside Forge", variant: "swipe" }),
    newWidget("team", { title: "Your coaches", variant: "swipe" }),
    newWidget("faq", { title: "Questions" }),
    newWidget("hours", { title: "Hours", variant: "compact" }),
    newWidget("location", { title: "Find the studio" }),
  ],
}
