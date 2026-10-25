import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductPage } from "./product";

const DETAILS: Record<
  ProductPage["slug"],
  { title: string; intro: string; rows: [string, string][]; demo: string }
> = {
  design: {
    title: "Control the design.",
    intro: "Change the design without re-entering your content.",
    rows: [
      [
        "Profile",
        "Choose a compact introduction, a portrait or a lifted cover profile.",
      ],
      [
        "Colours and backgrounds",
        "Choose your own palette, take colours from a logo or add an animated background.",
      ],
      [
        "Content blocks",
        "Choose which blocks to show and put them in the order you want.",
      ],
    ],
    demo: "sora-fields",
  },
  services: {
    title: "Help customers choose a service.",
    intro:
      "Show enough to help someone decide, then let them open the service for more.",
    rows: [
      [
        "A clear price",
        "Fixed, from, quote or free. Explain what is included before someone enquires.",
      ],
      [
        "Layouts",
        "Group a menu, show a short list or give a package its own card.",
      ],
      [
        "Booking and enquiries",
        "Take an enquiry, request a visit or begin a booking for an eligible service.",
      ],
    ],
    demo: "detail-dept",
  },
  enquiries: {
    title: "Know what customers are asking about.",
    intro:
      "Customers should not have to explain which service, product or vehicle caught their eye.",
    rows: [
      [
        "Context included",
        "Enquiries can begin from the item someone is looking at.",
      ],
      [
        "Their preferred way to talk",
        "Add call, email, WhatsApp and social destinations alongside your form.",
      ],
      [
        "Your inbox",
        "View saved enquiries in Studio with the customer’s contact details.",
      ],
    ],
    demo: "dans-home-repairs",
  },
  messages: {
    title: "Appointment details, ready to share.",
    intro:
      "Include the service, date and time so customers know what to expect.",
    rows: [
      [
        "Start a conversation",
        "Text and WhatsApp actions open the customer’s chosen app.",
      ],
      [
        "Booking details",
        "Appointment confirmations and reminders can include the relevant booking details.",
      ],
      [
        "Marketing preferences",
        "Keep promotional messages separate from appointment updates and send offers only to customers who have opted in.",
      ],
    ],
    demo: "maths-with-aisha",
  },
  booking: {
    title: "Set up your availability.",
    intro:
      "Services, people and working hours shape what customers can request.",
    rows: [
      [
        "Your hours",
        "Set working days, breaks, time off and space between appointments.",
      ],
      [
        "Your people",
        "Assign services to eligible staff and let customers choose who to see.",
      ],
      [
        "Booking approval",
        "Confirm immediately or review requests before accepting.",
      ],
    ],
    demo: "hollin-physio",
  },
  team: {
    title: "Give each person a profile.",
    intro: "Show who’s on your team and which services they provide.",
    rows: [
      [
        "Their own profile",
        "Introduce each person and show the services they provide.",
      ],
      [
        "Their own availability",
        "Working hours, breaks and leave shape each bookable calendar.",
      ],
      [
        "Room for the team",
        "Pro supports up to three staff calendars. Business has no staff-calendar cap.",
      ],
    ],
    demo: "hollin-physio",
  },
  products: {
    title: "Keep the shop you already use.",
    intro: "Your Taplo can sit alongside the shop you already run.",
    rows: [
      [
        "Show the details",
        "Photos, price, description and stock status keep the essential information together.",
      ],
      [
        "Keep your existing shop",
        "Send customers to your product page or let them enquire directly.",
      ],
      [
        "Share a recommendation",
        "Affiliate links can sit alongside your own products, with clear disclosure.",
      ],
    ],
    demo: "form-objects",
  },
  vehicles: {
    title: "The details buyers need.",
    intro:
      "Put the specifications and photographs together on each vehicle listing.",
    rows: [
      [
        "Useful specifications",
        "Price, mileage, year, fuel and gearbox alongside the photographs.",
      ],
      [
        "Stock status",
        "Mark a car available, reserved or sold. Stock is managed by the business.",
      ],
      [
        "Vehicle enquiries",
        "Keep the vehicle attached when someone asks a question or requests a viewing.",
      ],
    ],
    demo: "harris-cars",
  },
  "gallery-reviews": {
    title: "Choose how your gallery looks.",
    intro:
      "Small previews keep a page easy to browse. The full image is there when someone wants a closer look.",
    rows: [
      [
        "Gallery layouts",
        "Choose a photo grid or a swipe row, with a larger image viewer.",
      ],
      [
        "A direct review link",
        "Let customers read your reviews or leave one through your Google destination.",
      ],
      [
        "After a visit",
        "Give customers a direct link to leave a review on Google.",
      ],
    ],
    demo: "sora-fields",
  },
  sharing: {
    title: "Use your link online and in print.",
    intro:
      "Share the same page from your social profiles, emails and printed materials.",
    rows: [
      [
        "Share the link",
        "Copy a page address or use your phone’s share sheet.",
      ],
      [
        "Save the code",
        "Download a scannable QR code for your own print or digital materials.",
      ],
      [
        "Plaques and wallet cards",
        "Counter plaques and digital wallet cards are in development.",
      ],
    ],
    demo: "no-6-coffee",
  },
};

/** Plain, feature-specific details replace repeated full-screen captures. */
export function FeatureDetails({ slug }: { slug: ProductPage["slug"] }) {
  const detail = DETAILS[slug];
  return (
    <section
      className="grid gap-10 md:grid-cols-[.85fr_1.15fr] md:gap-20"
      aria-labelledby={`detail-${slug}`}
    >
      <div>
        <h2
          id={`detail-${slug}`}
          className="font-display max-w-xl text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.04] tracking-[-.05em]"
        >
          {detail.title}
        </h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/70">
          {detail.intro}
        </p>
        <Link
          href={`/inspiration/${detail.demo}`}
          className="mt-6 inline-flex min-h-12 items-center gap-4 text-sm font-semibold underline underline-offset-4"
        >
          Open demo
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid gap-5">
        {detail.rows.map(([title, copy], n) => (
          <article
            key={title}
            className="relative rounded-[22px] bg-foreground/[.035] px-6 py-7 shadow-[0_12px_25px_-22px_#0005] sm:px-8"
          >
            <span
              className="absolute right-6 top-6 text-xs tabular-nums text-foreground/65"
              aria-hidden="true"
            >
              0{n + 1}
            </span>
            <h3 className="pr-7 font-display text-2xl leading-tight tracking-[-.035em]">
              {title}
            </h3>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-foreground/65">
              {copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
