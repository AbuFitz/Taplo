export type JourneyId =
  | "page"
  | "services"
  | "bookings"
  | "products"
  | "team"
  | "reviews"
  | "analytics"
  | "settings"
  | "profile"
  | "design"
  | "order"
  | "sharing";

export const JOURNEY_META: Record<JourneyId, [string, string, string]> = {
  profile: [
    "Arrange your introduction",
    "Choose an intentional layout for the assets you actually have.",
    "The name, imagery and main action work as one introduction.",
  ],
  design: [
    "Find a look that belongs to you",
    "Start coordinated, then make individual changes with a purpose.",
    "A coherent page with readable text, clear actions and your own identity.",
  ],
  order: [
    "Put the important things first",
    "See how the drag handle and movement alternatives work.",
    "You can change the order confidently and reverse the change.",
  ],
  sharing: [
    "Share the right page",
    "Prepare your identity, destination and exported QR code together.",
    "A customer reaches the correct business page from the actual shared asset.",
  ],
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
