/**
 * Marketing page content. Every claim here must match what the product does today (preview mode):
 * enquiries are requests sent to the business, not payments; stock status is a label the owner sets;
 * external purchase links open the owner's own shop. Industry pages are written one by one, not templated.
 */

export interface FeaturePage {
  slug: string
  nav: string
  eyebrow: string
  title: string
  lead: string
  points: { title: string; body: string }[]
  note: string
}

export const FEATURES: FeaturePage[] = [
  {
    slug: "make-it-yours",
    nav: "Design",
    eyebrow: "Design",
    title: "Start from a look. End up with your own.",
    lead: "Five starting looks, then every choice is yours: colours, fonts, header, buttons, cards and wallpaper. Change a little or change everything, and your words and prices never move.",
    points: [
      { title: "Global style, deliberate exceptions", body: "Set the page once. When one section needs to be different, change just that section and reset it any time." },
      { title: "Your own saved looks", body: "Found a combination you love? Save it with a name and apply it again whenever you like." },
      { title: "Readable by default", body: "If a colour choice makes text hard to read, Taplo adjusts it and tells you why, instead of quietly shipping it." },
      { title: "Fonts that suit you", body: "Serif, sans, condensed or friendly: pair them from a curated set, with sizes and weights that stay balanced." },
    ],
    note: "Looks are starting points, not templates. Industry never decides how your page looks.",
  },
  {
    slug: "services-and-enquiries",
    nav: "Services",
    eyebrow: "Services and enquiries",
    title: "Prices up front. A clear way to get in touch.",
    lead: "List what you do with prices and durations. Customers pick a service and send a request for a time. You reply from your own phone or email.",
    points: [
      { title: "Grouped price lists", body: "Hair, shave, together: group services your way, show prices and durations, hide what you do not need." },
      { title: "One main action", body: "Choose the action you want first (book, call, message) without reordering your page." },
      { title: "Requests, not guesses", body: "Customers send the service and a preferred time. You confirm. Live availability is not connected yet." },
      { title: "Records you keep once", body: "Services live in one place and appear wherever you choose to show them." },
    ],
    note: "In this preview, booking requests are stored in your browser. Connected email and calendars come with accounts.",
  },
  {
    slug: "products-and-stock",
    nav: "Products and stock",
    eyebrow: "Products and stock",
    title: "A bottle of oil or a forecourt of cars.",
    lead: "Products, vehicles and items you recommend all use the same records: photos, a price, the facts that matter and a clear status. Each can lead to an enquiry or to your own shop.",
    points: [
      { title: "Facts as well as a price", body: "Year, mileage, fuel and gearbox for a car. Size and scent for an oil. You choose what to show." },
      { title: "Honest status", body: "Mark an item as just in, reserved or sold. Nothing disappears when you change its status." },
      { title: "Enquire or link out", body: "Send interested customers to an enquiry, or to a shop or affiliate page you already use." },
      { title: "No pretend checkout", body: "Taplo does not take orders or payments for products yet, and never implies it does." },
    ],
    note: "Checkout and live stock levels are not part of this preview.",
  },
  {
    slug: "share-your-page",
    nav: "Sharing",
    eyebrow: "Sharing",
    title: "One link that works everywhere you are.",
    lead: "Copy your link, print a QR code, download a share image or send it straight from your phone. People see the same page whether they scan, tap or search.",
    points: [
      { title: "A QR code for the counter", body: "Download a QR code for the shop window, a van, a menu or a business card." },
      { title: "A share image", body: "A ready-made image with your name and link for social posts and messages." },
      { title: "Send from your phone", body: "Where your phone supports it, share straight to any app. Otherwise copy the link." },
      { title: "Published pages only", body: "Sharing always uses your published page. Drafts are never exposed." },
    ],
    note: "Social apps decide how a link looks in their feeds and cache it. Taplo cannot guarantee an exact preview there.",
  },
]

export interface IndustryPage {
  slug: string
  nav: string
  eyebrow: string
  title: string
  lead: string
  shots: { id: "hero-barber" | "hero-dealer" | "hero-trades" | "cap-product" | "cap-services" | "cap-vehicles" | "cap-fixed-prices" | "cap-reviews"; alt: string }[]
  uses: { title: string; body: string }[]
  starts: string[]
  caution: string
}

export const INDUSTRIES: IndustryPage[] = [
  {
    slug: "barbers-and-salons",
    nav: "Barbers and salons",
    eyebrow: "Barbers, salons and beauty",
    title: "Your chair, your prices, your look.",
    lead: "A price menu people can read at a glance, a button to ask for a time, and room for the products you sell at the counter.",
    shots: [{ id: "hero-barber", alt: "A barber's page with a dark photographic header and a Book your chair button" }, { id: "cap-services", alt: "A grouped price menu for hair, shave and cut and beard" }, { id: "cap-product", alt: "A single product card for beard oil with its size and scent" }],
    uses: [
      { title: "Price menu", body: "Group services by type, show durations, and let customers choose before they ask for a time." },
      { title: "Counter products", body: "Add the oils and tools you sell, with a photo, a price and the facts that matter." },
      { title: "Hours and where you are", body: "Opening hours, and a directions button that opens the map." },
    ],
    starts: ["Price menu", "Booking request", "Products", "Hours", "Location"],
    caution: "Booking sends a request for a time you confirm. Live availability and deposits are not connected.",
  },
  {
    slug: "car-dealers",
    nav: "Car dealers",
    eyebrow: "Independent car dealers",
    title: "Every car on the forecourt, on one page.",
    lead: "Vehicle cards with photos, price and the specifications buyers ask about first, each with a status you control and an enquiry button.",
    shots: [{ id: "hero-dealer", alt: "A used car dealer's page with a showroom look and Book a viewing button" }, { id: "cap-vehicles", alt: "Vehicle stock cards with price, year, mileage, fuel and gearbox" }],
    uses: [
      { title: "Vehicle stock", body: "Photo, price, year, mileage, fuel and gearbox on every card, with badges such as Just arrived or Reserved." },
      { title: "Viewings and valuations", body: "Offer a viewing, a part-exchange valuation or a finance conversation as services people can ask for." },
      { title: "Status that stays honest", body: "Mark a car reserved or sold without deleting it, so your records stay complete." },
    ],
    starts: ["Vehicle stock", "Book a viewing", "Services", "Reviews", "Opening hours"],
    caution: "Enquiries reach you as requests. Taplo does not take deposits, run finance or check live stock feeds.",
  },
  {
    slug: "tradespeople",
    nav: "Tradespeople",
    eyebrow: "Plumbers, electricians and builders",
    title: "Be the easiest one to call.",
    lead: "A big call button, fixed prices where you have them, the areas you cover and answers to the questions customers always ask.",
    shots: [{ id: "hero-trades", alt: "A plumber's page with a bold blue look, a Request a visit button and a Call an engineer button" }, { id: "cap-fixed-prices", alt: "Fixed price cards for boiler service, repair and call-out" }, { id: "cap-reviews", alt: "A customer review quote" }],
    uses: [
      { title: "Call first", body: "Make calling your main action so it is the biggest thing on the page." },
      { title: "Service area", body: "Say where you work, with no address shown if you work from a van or home." },
      { title: "Questions answered", body: "Call-out fees, coverage and how quotes work, written once and always visible." },
    ],
    starts: ["Call button", "Fixed prices", "Service area", "Questions", "Reviews"],
    caution: "Credentials you list are shown as you write them. Taplo does not verify registrations or insurance.",
  },
  {
    slug: "shops-and-makers",
    nav: "Shops and makers",
    eyebrow: "Shops, makers and creators",
    title: "Sell it here, or send people to where you do.",
    lead: "Show what you make or recommend with photos and prices. Each item can lead to an enquiry or to your own shop, marketplace or affiliate link.",
    shots: [{ id: "cap-product", alt: "A product card with a photo, price, size and scent" }, { id: "hero-barber", alt: "A business page with a photographic header" }],
    uses: [
      { title: "Products with facts", body: "Sizes, materials, scents or any detail that helps someone decide." },
      { title: "Link out", body: "Send people to the shop you already use. Links open in a new tab and are clearly yours." },
      { title: "Reviews and links", body: "Show customer words and link to the places your reviews live." },
    ],
    starts: ["Products", "Links", "Reviews", "Gallery", "Social"],
    caution: "Taplo does not process orders or payments for products yet. Purchases happen on your own shop or by enquiry.",
  },
]

export const STEPS = [
  { n: "01", title: "Name it", body: "Your business name and what you do. That is all it takes to see your page." },
  { n: "02", title: "Choose a start", body: "Taplo suggests a page and a look. Change either with one tap." },
  { n: "03", title: "Add what you do", body: "Services, products, photos and links, created right where you need them." },
  { n: "04", title: "Share it", body: "Publish, then share a link, a QR code or an image." },
]
