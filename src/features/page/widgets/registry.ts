import { googleReviewUrl } from "./google-reviews"
import { referencedRecords as pick, selectedPlatforms, selectedService } from "./selection";
import { serviceListItems } from "./service-list";
import { isHttpUrl, videoEmbed } from "@/lib/validation";
import { WIDGET_TYPES, parseSettings, settingsSchemas, type WidgetType } from "../contracts/widgets";
import type { FieldSpec, WidgetContext, WidgetDefinition, WidgetStatus } from "./types";

const READY: WidgetStatus = { state: "ready" };
const selectionEmpty = (hasRecords: boolean, noun: string, fix: "profile" | "services" | "reviews" | "team" | "products"): WidgetStatus => ({ state: "empty", reason: hasRecords ? `Choose available ${noun} for this section, or show all ${noun}.` : `Add ${noun} to show this section.`, fix });
const channelEmpty = (reason: string): WidgetStatus => ({ state: "empty", reason, fix: "profile" });
const VARIANT_LINK: FieldSpec = { kind: "select", key: "variant", label: "Style", options: [{ value: "button", label: "Button" }, { value: "card", label: "Card with subtitle" }, { value: "compact", label: "Compact" }] };
const TITLE: FieldSpec = { kind: "text", key: "title", label: "Heading (optional)", max: 80 };

const activeOffers = (c: WidgetContext) => c.business.offers.filter((o) => !o.archived && (!o.endsAt || o.endsAt >= c.today));

/**
 * The widget registry. One definition per type: what it is, what it edits, what it needs,
 * and when it has nothing to show. Renderers live in ./renderers.tsx and are looked up by
 * type; nothing here is stored per page except id/type/version/settings/appearance.
 */
export const WIDGETS: Record<WidgetType, WidgetDefinition> = {
  call: {
    type: "call", version: 1, label: "Call button", description: "A one-tap call button.", category: "contact", icon: "Phone", multiple: false, appearance: ["button", "card", "thumbnail"],
    fields: [{ kind: "text", key: "label", label: "Button text", placeholder: "Call us", max: 60 }, { kind: "text", key: "subtitle", label: "Small text (optional)", max: 60 }, VARIANT_LINK],
    status: (_s, c) => (c.business.contacts.phone ? READY : channelEmpty("Add a phone number to show this button.")),
  },
  sms: {
    type: "sms", version: 1, label: "Text us", description: "Opens the customer's own text-message app with a message ready. Nothing is sent by Taplo.", category: "contact", icon: "MessageSquare", multiple: false, appearance: ["button", "card", "thumbnail"],
    fields: [{ kind: "text", key: "label", label: "Button text", placeholder: "Text us", max: 60 }, { kind: "text", key: "subtitle", label: "Small text (optional)", max: 60 }, VARIANT_LINK],
    status: (_s, c) => (c.business.contacts.phone ? READY : channelEmpty("Add a mobile number to show this button.")),
  },
  whatsapp: {
    type: "whatsapp", version: 1, label: "WhatsApp", description: "Opens a WhatsApp chat.", category: "contact", icon: "MessageCircle", multiple: false, appearance: ["button", "card", "thumbnail"],
    fields: [{ kind: "text", key: "label", label: "Button text", placeholder: "Message us on WhatsApp", max: 60 }, { kind: "text", key: "subtitle", label: "Small text (optional)", max: 60 }, VARIANT_LINK],
    status: (_s, c) => (c.business.contacts.whatsapp ? READY : channelEmpty("Add a WhatsApp number to show this button.")),
  },
  email: {
    type: "email", version: 1, label: "Email", description: "Starts an email to you.", category: "contact", icon: "Mail", multiple: false, appearance: ["button", "card", "thumbnail"],
    fields: [{ kind: "text", key: "label", label: "Button text", placeholder: "Email us", max: 60 }, { kind: "text", key: "subtitle", label: "Small text (optional)", max: 60 }, VARIANT_LINK],
    status: (_s, c) => (c.business.contacts.email ? READY : channelEmpty("Add an email address to show this button.")),
  },
  social: {
    type: "social", version: 1, label: "Social links", description: "Your social profiles as icons or a list.", category: "contact", icon: "AtSign", multiple: false, appearance: ["card"],
    fields: [{ kind: "select", key: "variant", label: "Style", options: [{ value: "icons", label: "Icon row" }, { value: "list", label: "List" }] }, { kind: "refs", key: "platforms", label: "Which profiles", source: "socialPlatforms" }],
    status: (s, c) => (!c.ent.socialLinks ? { state: "locked", reason: "Social links are included from the Core plan." } : selectedPlatforms(c.business.contacts.social, s.platforms).length ? READY : channelEmpty("Choose an available social profile, or add a profile link.")),
  },
  link: {
    type: "link", version: 1, label: "Custom link", description: "Link to anything: your shop, a menu, a form.", category: "contact", icon: "Link", multiple: true, appearance: ["button", "card", "thumbnail"],
    fields: [{ kind: "text", key: "label", label: "Button text", max: 60 }, { kind: "url", key: "url", label: "Web address" }, { kind: "text", key: "subtitle", label: "Small text (optional)", max: 60 }, VARIANT_LINK],
    status: (s) => (!String(s.label ?? "").trim() ? { state: "empty", reason: "Add the text for this link." } : !isHttpUrl(String(s.url ?? "")) ? { state: "empty", reason: "Add a full web address starting with https://" } : READY),
  },
  directions: {
    type: "directions", version: 1, label: "Directions", description: "Opens directions to your premises.", category: "contact", icon: "MapPin", multiple: false, appearance: ["button", "card", "thumbnail"],
    fields: [{ kind: "text", key: "label", label: "Button text", placeholder: "Get directions", max: 60 }, { kind: "text", key: "subtitle", label: "Small text (optional)", max: 60 }, VARIANT_LINK],
    status: (_s, c) => (c.business.location.directionsUrl ? READY : channelEmpty("Add a directions link to show this button.")),
  },

  serviceList: {
    type: "serviceList", version: 1, label: "Services", description: "A list of what you offer, with prices.", category: "sales", icon: "ListChecks", multiple: true, appearance: ["card"],
    fields: [TITLE, { kind: "switch", key: "excludeFeatured", label: "Keep featured services out of this list" }, { kind: "refs", key: "serviceIds", label: "Which services", source: "services", help: "Leave on “All” to follow your service list automatically." }, { kind: "select", key: "variant", label: "Style", options: [{ value: "list", label: "List" }, { value: "cards", label: "Cards" }, { value:"tiles", label:"Compact tiles" }, { value: "compact", label: "Compact" }, { value: "spotlight", label: "Spotlight" }, { value: "index", label: "Index with Book buttons" }, { value: "showcase", label: "Photo grid" }] }, { kind: "switch", key: "showPrices", label: "Show prices" }, { kind: "switch", key: "showDuration", label: "Show how long it takes" }, { kind: "switch", key: "showDescriptions", label: "Show descriptions" }],
    status: (s, c) => (serviceListItems(c.business.services, s, c.featuredServiceIds).length ? READY : { state: "empty", reason: s.excludeFeatured && c.business.services.length ? "All selected services are already featured. Add another service or turn off the featured-service filter." : "Add a service to show it here.", fix: "services" }),
  },
  featuredService: {
    type: "featuredService", version: 1, label: "Featured service", description: "Spotlight one service.", category: "sales", icon: "Sparkles", multiple: true, appearance: ["card", "button"],
    fields: [{ kind: "record", key: "serviceId", label: "Which service", source: "services" }, { kind: "text", key: "headline", label: "Headline (optional)", max: 60 }, { kind: "text", key: "ctaLabel", label: "Button text (optional)", max: 60 }],
    status: (s, c) => (selectedService(c.business.services, s.serviceId) ? READY : { state: "empty", reason: c.business.services.length ? "Choose an available service to feature." : "Add a service to feature it.", fix: "services" }),
  },
  priceMenu: {
    type: "priceMenu", version: 1, label: "Price menu", description: "A tidy menu with prices, grouped.", category: "sales", icon: "ReceiptText", multiple: true, appearance: ["card"],
    fields: [TITLE, { kind: "select", key: "variant", label: "Style", options: [{ value: "menu", label: "Price list" }, { value: "panels", label: "Menu panels" }, { value: "compact", label: "Compact menu" }] }, { kind: "refs", key: "serviceIds", label: "Which services", source: "services" }, { kind: "switch", key: "showDescriptions", label: "Show descriptions" }],
    status: (s, c) => (pick(c.business.services, s.serviceIds).length ? READY : selectionEmpty(Boolean(c.business.services.length), "services", "services")),
  },
  booking: {
    type: "booking", version: 1, label: "Book or enquire", description: "Booking or enquiry button.", category: "sales", icon: "CalendarCheck", multiple: true, appearance: ["button", "card"],
    fields: [{ kind: "text", key: "label", label: "Button text (optional)", max: 60 }, { kind: "record", key: "serviceId", label: "Preselect a service (optional)", source: "services" }, { kind: "select", key: "variant", label: "Style", options: [{ value: "button", label: "Button" }, { value: "card", label: "Card with text" }, { value: "times", label: "Next available times" }] }],
    status: (s, c) => {
      if (s.serviceId) {
        const selected=selectedService(c.business.services,s.serviceId)
        if(!selected) return {state:"empty",reason:"Choose an available service for this button.",fix:"services"}
        if(isHttpUrl(selected.externalUrl)) return READY
      }
      return c.onlineBooking || c.business.contacts.phone || c.business.contacts.whatsapp || c.business.contacts.email || c.business.services.some(service=>isHttpUrl(service.externalUrl)) ? READY : channelEmpty("Add a contact method so customers can enquire.")
    },
  },
  products: {
    type: "products", version: 1, label: "Products", description: "Things you sell.", category: "sales", icon: "ShoppingBag", multiple: true, appearance: ["card"],
    fields: [TITLE, { kind: "refs", key: "productIds", label: "Which products", source: "products" }, { kind: "select", key: "variant", label: "Style", options: [{ value: "catalogue", label: "Large cards" }, { value: "swipe", label: "Swipe sideways" }, { value: "grid", label: "Grid" }, { value: "list", label: "Compact list" }] }],
    status: (s, c) => (pick(c.business.products.filter(p => !p.archived), s.productIds).length ? READY : selectionEmpty(c.business.products.some(p => !p.archived), "products", "products")),
  },
  offers: {
    type: "offers", version: 1, label: "Offers", description: "Current deals and promotions.", category: "sales", icon: "BadgePercent", multiple: false, appearance: ["card"],
    fields: [TITLE, { kind: "select", key: "variant", label: "Style", options: [{ value: "list", label: "List" }, { value: "cards", label: "Offer cards" }] }, { kind: "refs", key: "offerIds", label: "Which offers", source: "offers" }],
    status: (s, c) => (pick(activeOffers(c), s.offerIds).length ? READY : { state: "empty", reason: activeOffers(c).length ? "Choose an available offer, or show all offers." : "Add an offer to show it. Expired offers hide themselves.", fix: "services" }),
  },
  payment: {
    type: "payment", version: 1, label: "Pay or deposit", description: "A payment button (simulated until payments are connected).", category: "sales", icon: "CreditCard", multiple: true, appearance: ["button", "card"], simulated: true,
    fields: [{ kind: "text", key: "label", label: "Button text", max: 60 }, { kind: "select", key: "kind", label: "What it takes", options: [{ value: "deposit", label: "A deposit" }, { value: "full", label: "Full payment" }, { value: "pay", label: "A payment" }] }, { kind: "record", key: "serviceId", label: "For which service (optional)", source: "services" }],
    status: (_s, c) => (!c.ent.payments ? { state: "locked", reason: "Taking payments is included from the Pro plan." } : c.paymentsConnected ? READY : { state: "locked", reason: "Payments are not connected yet, so this stays off your page. It needs a payment provider (Stripe) connected to this environment." }),
  },

  reviews: {
    type: "reviews", version: 1, label: "Google reviews", description: "Send customers to your reviews on Google.", category: "trust", icon: "Star", multiple: true, appearance: ["card"],
    fields: [TITLE, { kind: "select", key: "variant", label: "Style", options: [{ value: "cards", label: "Featured" }, { value: "compact", label: "Compact" }] }],
    status: (_s, c) => !c.ent.reviewLinks ? { state: "locked", reason: "Google review links are included from the Core plan." } : googleReviewUrl(c.business) ? READY : { state: "empty", reason: "Add your Google Maps or review link.", fix: "reviews" },
  },
  leaveReview: {
    type: "leaveReview", version: 1, label: "Leave a review", description: "Invite customers to review you on Google.", category: "trust", icon: "ThumbsUp", multiple: false, appearance: ["button", "card"],
    fields: [{ kind: "text", key: "label", label: "Button text (optional)", max: 60 }],
    status: (_s, c) => !c.ent.reviewLinks ? { state: "locked", reason: "Google review links are included from the Core plan." } : googleReviewUrl(c.business) ? READY : { state: "empty", reason: "Add your Google Maps or review link.", fix: "reviews" },
  },
  team: {
    type: "team", version: 1, label: "Team", description: "Introduce the people behind the business.", category: "trust", icon: "Users", multiple: true, appearance: ["card"],
    fields: [TITLE, { kind: "refs", key: "staffIds", label: "Who to show", source: "staff" }, { kind: "select", key: "variant", label: "Style", options: [{ value: "list", label: "Compact list" }, { value: "swipe", label: "Swipe sideways" }, { value: "grid", label: "Grid of cards" }, { value: "avatars", label: "Small photos" }] }],
    status: (s, c) => (!c.ent.teamPages ? { state: "locked", reason: "Team pages are included from the Pro plan." } : pick(c.business.staff, s.staffIds).length ? READY : selectionEmpty(Boolean(c.business.staff.length), "team members", "team")),
  },
  credentials: {
    type: "credentials", version: 1, label: "Credentials", description: "Qualifications and facts you can stand behind.", category: "trust", icon: "BadgeCheck", multiple: false, appearance: ["card"],
    fields: [TITLE, { kind: "select", key: "variant", label: "Style", options: [{ value: "chips", label: "Chips" }, { value: "list", label: "List" }] }],
    status: (_s, c) => (c.business.credentials.length ? READY : { state: "empty", reason: "Add a credential in your profile. Taplo never adds badges for you.", fix: "profile" }),
  },

  text: {
    type: "text", version: 1, label: "Text", description: "A short message, heading or about section.", category: "content", icon: "Type", multiple: true, appearance: ["card"],
    fields: [TITLE, { kind: "select", key: "variant", label: "Style", options: [{ value: "body", label: "About" }, { value: "statement", label: "Statement" }, { value: "note", label: "Note" }] }, { kind: "switch", key: "collapsible", label: "Keep extra paragraphs behind Read more" }, { kind: "textarea", key: "body", label: "Text", rows: 5, max: 4000 }, { kind: "select", key: "align", label: "Alignment", options: [{ value: "left", label: "Left" }, { value: "center", label: "Centred" }] }],
    status: (s) => (String(s.body ?? "").trim() ? READY : { state: "empty", reason: "Write some text to show this." }),
  },
  image: {
    type: "image", version: 1, label: "Image", description: "A single picture with an optional caption.", category: "content", icon: "Image", multiple: true, appearance: ["card"],
    fields: [{ kind: "image", key: "image", label: "Picture" }, { kind: "text", key: "caption", label: "Caption (optional)", max: 240 }, { kind: "url", key: "linkUrl", label: "Link it to (optional)" }, { kind: "select", key: "shape", label: "Shape", options: [{ value: "rounded", label: "Rounded" }, { value: "square", label: "Square" }, { value: "wide", label: "Wide" }] }],
    status: (s) => (s.image ? READY : { state: "empty", reason: "Choose a picture to show." }),
  },
  gallery: {
    type: "gallery", version: 1, label: "Gallery", description: "A set of photos.", category: "content", icon: "Images", multiple: true, appearance: ["card"],
    fields: [TITLE, { kind: "refs", key: "itemIds", label: "Which photos", source: "gallery" }, { kind: "select", key: "fit", label: "Image framing", options: [{ value: "cover", label: "Fill the space" }, { value: "contain", label: "Show whole image" }] }, { kind: "select", key: "variant", label: "Style", options: [{ value: "mosaic", label: "Editorial collage" }, { value: "grid", label: "Photo grid" }, { value: "filmstrip", label: "Filmstrip" }, { value: "carousel", label: "Swipeable row" }, { value: "beforeAfter", label: "Before and after" }, { value: "masonry", label: "Photo wall" }] }],
    status: (s, c) => (!c.ent.gallery ? { state: "locked", reason: "Galleries are included from the Core plan." } : pick(c.business.gallery, s.itemIds).length ? READY : selectionEmpty(Boolean(c.business.gallery.length), "photos", "profile")),
  },
  video: {
    type: "video", version: 1, label: "Video", description: "A YouTube or Vimeo video. Loads only when tapped.", category: "content", icon: "Play", multiple: true, appearance: ["card"],
    fields: [{ kind: "url", key: "url", label: "YouTube or Vimeo address" }, { kind: "text", key: "title", label: "Title (optional)", max: 120 }],
    status: (s) => (videoEmbed(String(s.url ?? "")) ? READY : { state: "empty", reason: "Paste a YouTube or Vimeo link." }),
  },
  faq: {
    type: "faq", version: 1, label: "Questions", description: "Answers to things customers ask.", category: "content", icon: "CircleHelp", multiple: true, appearance: ["card"],
    fields: [TITLE, { kind: "select", key: "variant", label: "Style", options: [{ value: "list", label: "Grouped answers" }, { value: "cards", label: "Answer cards" }] }, { kind: "refs", key: "faqIds", label: "Which questions", source: "faqs" }],
    status: (s, c) => (pick(c.business.faqs, s.faqIds).length ? READY : selectionEmpty(Boolean(c.business.faqs.length), "questions and answers", "profile")),
  },
  document: {
    type: "document", version: 1, label: "Download", description: "A menu, price list or brochure to download.", category: "content", icon: "FileDown", multiple: true, appearance: ["button", "card", "thumbnail"],
    fields: [{ kind: "text", key: "title", label: "Name", max: 100 }, { kind: "url", key: "url", label: "Web address of the file", help: "File uploads need storage, which isn’t connected yet. Link to a file you host elsewhere." }, { kind: "text", key: "description", label: "Small text (optional)", max: 240 }],
    status: (s) => (!String(s.title ?? "").trim() ? { state: "empty", reason: "Name this download." } : !isHttpUrl(String(s.url ?? "")) ? { state: "empty", reason: "Add the web address of the file." } : READY),
  },

  hours: {
    type: "hours", version: 1, label: "Opening hours", description: "When you are open.", category: "info", icon: "Clock", multiple: false, appearance: ["card"],
    fields: [TITLE, { kind: "select", key: "variant", label: "Style", options: [{ value: "list", label: "Full list" }, { value: "compact", label: "Today first" }, { value: "status", label: "Status capsule" }] }],
    status: (_s, c) => (c.business.hours.some((h) => h.opens && h.closes) ? READY : { state: "empty", reason: "Add your opening hours in page settings.", fix: "settings" }),
  },
  location: {
    type: "location", version: 1, label: "Location", description: "Where customers find you.", category: "info", icon: "Map", multiple: false, appearance: ["card"],
    fields: [TITLE, { kind: "select", key: "variant", label: "Style", options: [{ value: "card", label: "Address card" }, { value: "compact", label: "Address row" }, { value: "visit", label: "Visit card" }] }, { kind: "switch", key: "showDirections", label: "Show a directions button" }],
    status: (_s, c) => (c.business.location.mode === "premises" && (c.business.location.locality || c.business.location.addressLine) ? READY : { state: "empty", reason: c.business.location.mode === "premises" ? "Add your town or address." : "Your location is set to travelling/online, so this stays hidden. Use “Areas we cover”.", fix: "profile" }),
  },
  serviceArea: {
    type: "serviceArea", version: 1, label: "Areas we cover", description: "The places you travel to.", category: "info", icon: "Compass", multiple: false, appearance: ["card"],
    fields: [TITLE],
    status: (_s, c) => (c.business.location.mode === "service_area" && c.business.location.locality ? READY : { state: "empty", reason: "Set your location to “I travel to customers” and list the areas.", fix: "profile" }),
  },
  enquiry: {
    type: "enquiry", version: 1, label: "Contact form", description: "A form customers fill in to ask you something. It reserves no time.", category: "contact", icon: "MessageSquare", multiple: false, appearance: ["button", "card"],
    fields: [TITLE, { kind: "textarea", key: "intro", label: "Introduction (optional)", rows: 2, max: 240 }, { kind: "text", key: "buttonLabel", label: "Button text", placeholder: "Send us a message", max: 60 }, { kind: "select", key: "variant", label: "Style", options: [{ value: "button", label: "Button that opens the form" }, { value: "inline", label: "Form shown on the page" }, { value: "card", label: "Enquiry card" }] }],
    status: () => READY,
  },
  share: {
    type: "share", version: 1, label: "Share", description: "A Share button with a link, QR code and image for your page.", category: "contact", icon: "Share2", multiple: false, appearance: ["button", "card"],
    fields: [TITLE, { kind: "text", key: "label", label: "Button text", placeholder: "Share this page", max: 60 }, { kind: "select", key: "variant", label: "Style", options: [{ value: "button", label: "Button" }, { value: "card", label: "Card" }] }],
    status: () => READY,
  },
  announcement: {
    type: "announcement", version: 1, label: "Announcement", description: "A highlighted notice, such as holiday hours or an offer.", category: "info", icon: "Megaphone", multiple: true, appearance: ["card"],
    fields: [{ kind: "textarea", key: "text", label: "Message", rows: 2, max: 240 }, { kind: "select", key: "tone", label: "Look", options: [{ value: "info", label: "Notice" }, { value: "promo", label: "Promotion" }, { value: "warning", label: "Important" }] }, { kind: "text", key: "linkLabel", label: "Link text (optional)", max: 60 }, { kind: "url", key: "linkUrl", label: "Link address (optional)" }, { kind: "date", key: "endsAt", label: "Hide after (optional)" }],
    status: (s, c) => (!String(s.text ?? "").trim() ? { state: "empty", reason: "Write your announcement." } : s.endsAt && String(s.endsAt) < c.today ? { state: "empty", reason: "This announcement has expired and is hidden." } : READY),
  },
};

export const getWidget = (type: string): WidgetDefinition | undefined => (WIDGETS as Record<string, WidgetDefinition>)[type];
export const isWidgetType = (t: string): t is WidgetType => (WIDGET_TYPES as readonly string[]).includes(t);

/** Fresh settings for a new widget (schema defaults). */
export function defaultSettings(type: WidgetType): Record<string, unknown> {
  return settingsSchemas[type].parse({}) as Record<string, unknown>;
}

export { parseSettings };
