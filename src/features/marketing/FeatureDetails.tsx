import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductPage } from "./product";

const DETAILS: Record<
  ProductPage["slug"],
  { title: string; intro: string; rows: [string, string][]; demo: string }
> = {
  design: {
    title: "Make the page feel like you.",
    intro:
      "A starting look is the beginning. Your content stays yours as the design changes.",
    rows: [
      [
        "Profile",
        "Choose a compact introduction, a portrait or a lifted cover profile.",
      ],
      [
        "Colour & atmosphere",
        "Choose your own palette, take colours from a logo or add an animated background.",
      ],
      [
        "Content blocks",
        "Arrange services, images, links and practical details around the next step customers need.",
      ],
    ],
    demo: "sora-fields",
  },
  services: {
    title: "One offer. All the useful detail.",
    intro:
      "Show enough to help someone decide, then let them open the service for more.",
    rows: [
      [
        "A clear price",
        "Fixed, from, quote or free. Explain what is included before someone enquires.",
      ],
      [
        "A useful arrangement",
        "Group a menu, show a short list or give a package its own card.",
      ],
      [
        "The right next step",
        "Take an enquiry, request a visit or begin a booking for an eligible service.",
      ],
    ],
    demo: "detail-dept",
  },
  enquiries: {
    title: "Keep the question connected.",
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
        "A place to follow up",
        "Review saved enquiries in Studio. Email delivery uses a connected provider.",
      ],
    ],
    demo: "dans-home-repairs",
  },
  messages: {
    title: "Useful messages, at the right moment.",
    intro:
      "Keep direct contact simple and prepare the details customers need around a visit.",
    rows: [
      [
        "Start a conversation",
        "Text and WhatsApp actions open the customer’s chosen app.",
      ],
      [
        "Prepare the message",
        "Appointment confirmations and reminders can include the relevant booking details.",
      ],
      [
        "Respect the recipient",
        "Offers belong with customers who have opted in. Automated delivery requires a provider.",
      ],
    ],
    demo: "maths-with-aisha",
  },
  booking: {
    title: "Your diary. Your rules.",
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
        "Your next step",
        "Confirm immediately or review requests before accepting.",
      ],
    ],
    demo: "hollin-physio",
  },
  team: {
    title: "Make the introduction personal.",
    intro:
      "A name, a face and a little context help someone choose who they want to see.",
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
    title: "A small shop window. A useful next step.",
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
    title: "Everything a buyer asks first.",
    intro: "Give each vehicle room without making someone hunt for the facts.",
    rows: [
      [
        "Useful specifications",
        "Price, mileage, year, fuel and gearbox alongside the photographs.",
      ],
      [
        "Honest stock status",
        "Mark a car available, reserved or sold. Stock is managed by the business.",
      ],
      [
        "A relevant enquiry",
        "Keep the vehicle attached when someone asks a question or requests a viewing.",
      ],
    ],
    demo: "harris-cars",
  },
  "gallery-reviews": {
    title: "Give the work room to speak.",
    intro:
      "Small previews keep a page easy to browse. The full image is there when someone wants a closer look.",
    rows: [
      [
        "A composed gallery",
        "Choose a photo grid or a swipe row, with a larger image viewer.",
      ],
      [
        "A direct review link",
        "Let customers read your reviews or leave one through your Google destination.",
      ],
      [
        "Trust the source",
        "Imported ratings need a Google data connection and its attribution. Sample stars are not customer proof.",
      ],
    ],
    demo: "sora-fields",
  },
  sharing: {
    title: "One page. More ways to reach it.",
    intro:
      "A link in your bio, a code on a counter, a page someone can pass on.",
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
        "A physical presence",
        "Plaques and digital wallet passes are being developed. The 3D preview is a product concept.",
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
          Open a working example
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
