import type { Scenario } from "@/features/showcase/content"

export type Arrangement = "melt" | "split" | "bento" | "type" | "framed" | "identity" | "masthead" | "duo" | "lifted"

/**
 * The gallery's pages: real, different businesses, each wearing the design that suits it. A design is only ever shown on a
 * business it was made for, so the shelf reads as a spread of ideas rather than one page repeated.
 */
export interface ShowcaseGroup { id: string; title: string; line: string; items: { scenario: Scenario; design: string; note: string; /** Not every business has a logo; false shows the page with its name alone. */ logo?: false; /** The profile arrangement this page wears; every page in the gallery is a distinct arrangement, finish and density. */ arrangement?: Arrangement }[] }

export const SHOWCASE: ShowcaseGroup[] = [
  { id: "book", title: "Book a chair, a table or a slot", line: "Appointments first. The booking button leads and the prices sit right behind it.", items: [
    { scenario: "barber", design: "noir", note: "Barbers. Black, brass and a full-width photograph.", arrangement: "melt" },
    { scenario: "lune", design: "bloom", note: "Nail artist. Soft pastel light behind rounded cards.", arrangement: "melt" },
    { scenario: "physio", design: "glasshouse", note: "Physiotherapy clinic. Light, airy and calm.", arrangement: "duo" },
    { scenario: "liv", design: "sunrise", note: "Pilates teacher. A warm gradient morning.", arrangement: "melt" },
    { scenario: "slow", design: "terra", note: "Yoga teacher. Clay, sand and a characterful serif.", arrangement: "lifted" },
    { scenario: "station", design: "garage", note: "Neighbourhood barber. Tough, fast and local.", logo: false, arrangement: "split" },
    { scenario: "groom", design: "candy", note: "Mobile dog groomer. Friendly, bubbly, we come to you.", logo: false, arrangement: "split" },
    { scenario: "calm", design: "quartz", note: "Counsellor. A quiet page with a free first call.", logo: false, arrangement: "identity" },
    { scenario: "driving", design: "sunrise", note: "Driving instructor. Calm lessons, clear block prices.", logo: false, arrangement: "split" },
    { scenario: "surf", design: "marine", note: "Surf school. Group lessons, kit included.", arrangement: "melt" },
  ] },
  { id: "local", title: "Call, quote, fixed", line: "People with a problem and a phone. The page answers before they have to ask.", items: [
    { scenario: "trades", design: "marine", note: "Heating and plumbing. A call button you cannot miss.", logo: false, arrangement: "split" },
    { scenario: "fixnow", design: "garage", note: "Mobile mechanic. Prices, products and a direct quote link.", arrangement: "split" },
    { scenario: "oakfield", design: "quartz", note: "Home repairs. Calm, exact and trustworthy.", logo: false, arrangement: "duo" },
    { scenario: "current", design: "volt", note: "Phone repair. Electric, quick, obvious next step.", arrangement: "bento" },
    { scenario: "detailer", design: "monochrome", note: "Car detailing. The work, then the price.", arrangement: "split" },
    { scenario: "bike", design: "garage", note: "Bike workshop. Honest quotes and a free safety check.", arrangement: "split" },
    { scenario: "garden", design: "glasshouse", note: "Garden designer. Light, green and unhurried.", logo: false, arrangement: "duo" },
  ] },
  { id: "food", title: "Open, warm and worth the walk", line: "Menus, opening times and a table. Food first, forms last.", items: [
    { scenario: "cafe", design: "candy", note: "Kitchen and café. Playful, punchy and easy to order from.", arrangement: "framed" },
    { scenario: "corner", design: "terra", note: "Neighbourhood coffee. Menu and hours at a glance.", arrangement: "lifted" },
    { scenario: "hours", design: "sunrise", note: "Micro-bakery. A weekend bake, ordered by message.", arrangement: "melt" },
    { scenario: "alba", design: "bloom", note: "Event styling. Delicate, seasonal, photographic.", arrangement: "melt" },
    { scenario: "petal", design: "maison", note: "Florist. Fashion-house type on a flower stall.", arrangement: "framed" },
    { scenario: "taco", design: "volt", note: "Street food truck. A short menu and tonight's pitch.", arrangement: "bento" },
    { scenario: "bnb", design: "terra", note: "Seaside guest house. Rooms, breakfast and a weekend away.", arrangement: "melt" },
  ] },
  { id: "make", title: "Made by hand, sold directly", line: "Objects, rails and collections that need a good photograph and a short path to ask.", items: [
    { scenario: "form", design: "paper", note: "Ceramics. A printed page with numbered pieces.", logo: false, arrangement: "masthead" },
    { scenario: "edit", design: "quartz", note: "Vintage clothing. The current rail, found once.", logo: false, arrangement: "masthead" },
    { scenario: "dealer", design: "marine", note: "Used cars. Specs, status and honest availability.", arrangement: "split" },
    { scenario: "brookfield", design: "quartz", note: "Independent forecourt. Readable stock cards.", arrangement: "lifted" },
    { scenario: "cakes", design: "bloom", note: "Cake maker. Small cakes for big days.", arrangement: "melt" },
    { scenario: "books", design: "maison", note: "Independent bookshop. Staff picks and signed copies.", logo: false, arrangement: "masthead" },
  ] },
  { id: "work", title: "The work, in full voice", line: "Portfolios and studios where the page is part of the pitch.", items: [
    { scenario: "sora", design: "monochrome", note: "Photographer. Stark, oversized and quiet.", arrangement: "identity" },
    { scenario: "ellis", design: "sheet", note: "Brand designer. A bold colour field with a name on it.", arrangement: "type" },
    { scenario: "field", design: "maison", note: "Illustrator. Warm, editorial and hand-made.", arrangement: "type" },
    { scenario: "pace", design: "noir", note: "Filmmaker. Cinematic and dark.", arrangement: "melt" },
    { scenario: "after", design: "borealis", note: "Sound studio. Night colour that slowly moves.", arrangement: "bento" },
    { scenario: "slate", design: "bento", note: "Web designer. A compact grid of confident tiles.", arrangement: "bento" },
    { scenario: "twelve", design: "candy", note: "Social content. Loud, friendly, readable.", arrangement: "bento" },
    { scenario: "nami", design: "glasshouse", note: "Interior stylist. Pale colour and space.", arrangement: "framed" },
    { scenario: "dune", design: "terra", note: "Interiors. Warm rooms, considered.", arrangement: "identity" },
    { scenario: "maya", design: "sheet", note: "Founder and maker. Small ideas, made real.", arrangement: "lifted" },
    { scenario: "leon", design: "bento", note: "Indie developer. Tools laid out like a dashboard.", arrangement: "bento" },
    { scenario: "eden", design: "paper", note: "Product designer. Case studies as printed pages.", arrangement: "bento" },
    { scenario: "tattoo", design: "monochrome", note: "Tattoo studio. Flash, custom and a clean look.", logo: false, arrangement: "type" },
    { scenario: "dj", design: "borealis", note: "Wedding DJ. Night colour for a dance floor.", arrangement: "melt" },
  ] },
  { id: "advice", title: "Learn it, train it, ask about it", line: "Teachers, coaches and advisers. One calm first step beats ten choices.", items: [
    { scenario: "gym", design: "volt", note: "Training studio. High voltage, near black.", arrangement: "melt" },
    { scenario: "north", design: "sunrise", note: "Running club. Warm and encouraging.", arrangement: "melt" },
    { scenario: "good", design: "marine", note: "Consultant. Deep navy and a useful next step.", arrangement: "bento" },
    { scenario: "brightlearn", design: "borealis", note: "Online maths tuition. Calm focus, programmes with prices.", arrangement: "bento" },
    { scenario: "rowan", design: "paper", note: "Maths tutor. A friendly face and a free first chat.", arrangement: "masthead" },
    { scenario: "tutor", design: "candy", note: "Lesson tutor. A free trial that books instantly.", arrangement: "duo" },
    { scenario: "arlo", design: "borealis", note: "Producer. Mix, score and sound design.", arrangement: "bento" },
  ] },
]
export const ALL_SHOWCASE = SHOWCASE.flatMap((g) => g.items.map((i) => ({ ...i, group: g.id })))
