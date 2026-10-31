import type { DemoState } from "@/features/demo/store";
import { resolveEntitlements } from "@/features/subscriptions/entitlements";

export type JourneyId =
  | "page"
  | "services"
  | "bookings"
  | "products"
  | "team"
  | "reviews"
  | "analytics"
  | "settings";
export interface JourneyStep {
  id: string;
  title: string;
  detail: string;
  action: string;
  href: string;
  done: boolean;
  blocked?: string;
}
export interface Journey {
  id: JourneyId;
  title: string;
  intro: string;
  outcome: string;
  steps: JourneyStep[];
  note?: string;
}
const page = "/dashboard/page";
const widgetPresent = (s: DemoState, types: string[]) =>
  s.page.widgets.some((w) => types.includes(w.type) && !w.hidden);
/** Completion is derived from saved records, never from watching a tutorial or pressing Next. */
export function journeyFor(id: JourneyId, s: DemoState): Journey {
  const c = s.content,
    ent = resolveEntitlements(s.plan);
  const services = (c.services ?? []).filter((v) => !v.archived && !v.example);
  const products = (c.products ?? []).filter((v) => !v.archived && !v.example);
  const staff = c.staff ?? [];
  const steps: Record<JourneyId, JourneyStep[]> = {
    page: [
      {
        id: "identity",
        title: "Introduce your business",
        detail:
          "Your name and a short introduction are enough. A logo and cover are optional; your page should work beautifully without them.",
        action: "Shape your profile",
        href: `${page}?task=profile`,
        done: Boolean(c.identity.name && c.identity.tagline),
      },
      {
        id: "content",
        title: "Give visitors a useful next step",
        detail:
          "Start with your main action and one useful section. You can add more as your business grows.",
        action: "Choose your content",
        href: `${page}?task=content`,
        done: widgetPresent(s, [
          "call",
          "sms",
          "whatsapp",
          "email",
          "booking",
          "enquiry",
          "link",
        ]),
      },
      {
        id: "look",
        title: "Check the look with your content",
        detail:
          "Choose coordinated colours, then inspect the introduction, longer names and your most important action.",
        action: "Refine your design",
        href: `${page}?task=design`,
        done: Boolean(s.page.appearance.colors),
      },
    ],
    services: [
      {
        id: "service",
        title: "Add one real service",
        detail:
          "Use the name customers recognise. Choose a fixed price, a starting price or an enquiry; add a duration if it can be booked.",
        action: "Add a service",
        href: "/dashboard/services?new=1",
        done: services.length > 0,
      },
      {
        id: "display",
        title: "Show your offer on the page",
        detail:
          "Add a service list or price menu. The block reads these records, so you only update a price once.",
        action: "Arrange your services",
        href: `${page}?task=content`,
        done:
          widgetPresent(s, ["serviceList", "priceMenu", "featuredService"]) &&
          services.length > 0,
      },
      {
        id: "booking",
        title: "Choose what happens next",
        detail:
          "Keep enquiries, link to an existing booking service, or prepare Taplo appointments when your plan includes them.",
        action: ent.onlineBooking
          ? "Prepare appointments"
          : "Review service actions",
        href: ent.onlineBooking
          ? "/dashboard/bookings?section=availability"
          : "/dashboard/services",
        done: services.some(
          (v) => Boolean(v.externalUrl) || v.bookingMode !== "contact",
        ),
      },
    ],
    bookings: [
      {
        id: "offer",
        title: "Make a service bookable",
        detail:
          "Add a duration and choose request or instant booking. Contact-only services will not appear as appointment slots.",
        action: "Set up a service",
        href: "/dashboard/services",
        done: services.some(
          (v) => Boolean(v.durationMinutes) && v.bookingMode !== "contact",
        ),
        blocked: ent.onlineBooking
          ? undefined
          : "Online appointments are included with Pro and Business. Your existing services and enquiries stay available.",
      },
      {
        id: "hours",
        title: "Set the hours you can take bookings",
        detail:
          "Review working hours, notice, buffers and days off. Keep public opening hours separate from individual staff schedules.",
        action: "Review availability",
        href: "/dashboard/bookings?section=availability",
        done: Boolean(c.hours?.some((h) => h.opens && h.closes)),
        blocked: ent.onlineBooking
          ? undefined
          : "Choose a booking plan before enabling appointment slots.",
      },
      {
        id: "ready",
        title: "Check the customer journey",
        detail:
          "Turn on booking only after your services and availability are ready. Try the flow as a customer before sharing.",
        action: "Review booking setup",
        href: "/dashboard/bookings?section=availability",
        done: Boolean(c.booking.onlineBookingReady),
        blocked: ent.onlineBooking
          ? undefined
          : "Appointment setup is available with Pro and Business.",
      },
    ],
    products: [
      {
        id: "item",
        title:
          c.identity.industryKey === "car-dealer"
            ? "Add your first vehicle"
            : "Add a real item",
        detail:
          "Choose a clear photo, useful details and an honest availability status. Affiliate links are disclosed on the page.",
        action:
          c.identity.industryKey === "car-dealer"
            ? "Add a vehicle"
            : "Add an item",
        href: "/dashboard/products?new=1",
        done: products.length > 0,
      },
      {
        id: "action",
        title: "Choose how people buy or enquire",
        detail:
          "An enquiry opens your contact flow. An external link goes to your own shop or checkout; it does not create a Taplo payment.",
        action: "Review your item actions",
        href: "/dashboard/products",
        done: products.some((p) => p.mode === "enquire" || Boolean(p.linkUrl)),
      },
      {
        id: "shelf",
        title: "Build a compact collection",
        detail:
          "Add a products block. Use a compact row, swipeable shelf or grid that fits your stock, then check the expanded details.",
        action: "Arrange your collection",
        href: `${page}?task=content`,
        done: products.length > 0 && widgetPresent(s, ["products"]),
      },
    ],
    team: [
      {
        id: "person",
        title: "Introduce one person",
        detail:
          "A name, role and short speciality make a useful profile. A photograph is optional; initials have a proper place too.",
        action: "Add a team member",
        href: "/dashboard/team?new=1",
        done: staff.length > 0,
      },
      {
        id: "work",
        title: "Match people to their services",
        detail:
          "Choose who does what. Someone without assigned services should not accidentally receive the wrong booking.",
        action: "Review team details",
        href: "/dashboard/team",
        done: staff.some(
          (p) => p.serviceIds === null || Boolean(p.serviceIds?.length),
        ),
      },
      {
        id: "profiles",
        title: "Let customers meet the team",
        detail:
          "Add a team block and check the profile popup. Bookable people also need working hours.",
        action: "Arrange team profiles",
        href: `${page}?task=content`,
        done: staff.length > 0 && widgetPresent(s, ["team"]),
        blocked: ent.teamPages
          ? undefined
          : "You can prepare team records here. Public team profiles are included with Pro and Business.",
      },
    ],
    reviews: [
      {
        id: "source",
        title: "Connect a genuine review source",
        detail:
          "Find your business on Google Maps and copy its Share link. This sends visitors to the original reviews.",
        action: "Add your review link",
        href: "/dashboard/reviews?focus=link",
        done: Boolean(c.reviewLinks?.some((r) => r.platform === "google")),
        blocked: ent.reviewLinks
          ? undefined
          : "Review-source links are included with Core, Pro and Business.",
      },
      {
        id: "proof",
        title: "Place trust near the decision",
        detail:
          "Add reviews or testimonials beside the service or action they support. Do not invent ratings or quote customers without permission.",
        action: "Arrange trust content",
        href: `${page}?task=content`,
        done: widgetPresent(s, ["reviews", "testimonials"]),
      },
    ],
    analytics: [
      {
        id: "publish",
        title: "Make the destination ready",
        detail:
          "Review and publish your page before expecting visitor activity. Watching a demonstration never creates analytics data.",
        action: "Review your page",
        href: page,
        done: Boolean(s.published),
      },
      {
        id: "measurement",
        title: "Understand what will be measured",
        detail:
          "Page views show reach, taps show intent, and QR scans show offline interest. Compare them before drawing conclusions.",
        action: "Review connections",
        href: "/dashboard/settings?section=connections",
        done: false,
        blocked: ent.analytics
          ? "Tracking is not connected in this environment. No visitor data is being collected here."
          : "Analytics is included with Core, Pro and Business.",
      },
    ],
    settings: [
      {
        id: "plan",
        title: "Check what your plan includes",
        detail:
          "Choose the tools your business needs. Changing the development plan does not start billing or remove your saved content.",
        action: "Review plan & features",
        href: "/dashboard/settings?section=plan",
        done: Boolean(s.setupDrafts?.planIntent),
      },
      {
        id: "connect",
        title: "Prepare external connections",
        detail:
          "Payments, messages and domains need verified providers. A saved preference is not a connected service.",
        action: "Review connections",
        href: "/dashboard/settings?section=connections",
        done: false,
        blocked:
          "Provider connections are not available in this environment yet.",
      },
    ],
  };
  const meta: Record<JourneyId, [string, string, string]> = {
    page: [
      "Make this page yours",
      "A clear introduction, useful content and a look that works together.",
      "A visitor understands your business and knows what to do next.",
    ],
    services: [
      "Put your offer together",
      "Start with one service. Reuse it across your page and booking setup.",
      "Customers can compare what you offer and take the right next step.",
    ],
    bookings: [
      "Get appointments ready",
      "Work through services, availability and the customer journey in order.",
      "A customer can request an appropriate time with the right person.",
    ],
    products: [
      "Build your collection",
      "Clear images, useful facts and a straightforward route to buy or enquire.",
      "Visitors can explore an item without losing their place on your page.",
    ],
    team: [
      "Introduce the people behind it",
      "Start with a person, then connect their work and availability.",
      "Customers know who they are choosing and what that person offers.",
    ],
    reviews: [
      "Build trust with real evidence",
      "Use a genuine source and put it where it helps a customer decide.",
      "Visitors can verify the words and ratings they see.",
    ],
    analytics: [
      "Know what brings people in",
      "Understand the measures before you start counting them.",
      "You can distinguish interest from an actual customer action.",
    ],
    settings: [
      "Make the workspace fit your business",
      "Review plan access and connections before relying on a live service.",
      "You know what is enabled, saved and still needs connecting.",
    ],
  };
  return {
    id,
    title: meta[id][0],
    intro: meta[id][1],
    outcome: meta[id][2],
    steps: steps[id],
  };
}
