import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  MessageSquare,
  ExternalLink,
  Bell,
  Megaphone,
  Smartphone,
} from "lucide-react";
import { Shot } from "./Shot";
import { ArrowLink } from "./Scenes";
import { LookSwitcher } from "./home/LookSwitcher";
import { BookingStory } from "./home/BookingStory";
import type { ProductPage } from "./product";
import {
  featureNote,
  featureState,
  type FeatureId,
} from "@/lib/feature-status";
import { cn } from "@/lib/utils";

const heading =
  "font-display font-display-tight text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.06] tracking-[-0.035em]";
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-sm leading-relaxed text-foreground/65">
      {children}
    </p>
  );
}
function Intro({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <h2 className={heading}>{title}</h2>
      <div className="mt-5 text-lg leading-relaxed text-foreground/70">
        {children}
      </div>
    </div>
  );
}
function Design() {
  return (
    <div className="grid gap-20 sm:gap-28">
      <section>
        <Intro title="Start close. Make it yours.">
          Try the same business in a different look. The name, prices and photos
          stay put while the page changes around them.
        </Intro>
        <div className="mt-10">
          <LookSwitcher />
        </div>
      </section>
      <section className="grid gap-10 border-t border-foreground/15 pt-10 lg:grid-cols-[1fr_1.2fr]">
        <Intro title="The small choices make it yours.">
          Keep a look as it is, or change one thing at a time. Your page stays
          in view while you make your choices.
        </Intro>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-7">
          {[
            ["Your colours", "Choose the page, text, cards and accent."],
            ["Your type", "Match the headings and everyday details."],
            [
              "Your first impression",
              "A useful logo, a photo or a bigger introduction.",
            ],
            ["Your buttons", "A clear shape and a clear next step."],
            ["Your sections", "Pick the layout that suits the content."],
            ["Your backdrop", "Keep it simple or bring in a photograph."],
          ].map(([title, body]) => (
            <div key={title}>
              <dt className="font-semibold">{title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-foreground/65">
                {body}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section>
        <Intro title="Made for the phone. Room to breathe on a bigger screen.">
          The same content rearranges for the space available. Try both sizes on
          an example before making a start.
        </Intro>
        <div className="mt-8 grid items-center gap-8 md:grid-cols-[0.4fr_1fr]">
          <Shot
            id="ex-station-road-barbers-phone"
            alt="The Jay’s Barbers page at a real phone width"
            width={310}
            cropTo={610}
            fluid
            className="mx-auto w-full"
          />
          <Shot
            id="ex-station-road-barbers-desk"
            alt="The same Jay’s Barbers content arranged for a desktop"
            width={880}
            fluid
            frame="none"
            className="w-full"
          />
        </div>
        <div className="mt-7">
          <ArrowLink href="/inspiration/jays-barbers">
            Try phone and desktop
          </ArrowLink>
        </div>
      </section>
    </div>
  );
}
function Services() {
  return (
    <div className="grid gap-20">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Intro title="Enough detail before they ask.">
            What is included, how long it takes and who can help. Open a service
            without losing the page, then book or ask a question from there.
          </Intro>
          <div className="mt-7">
            <ArrowLink href="/inspiration/jays-barbers">
              Try a haircut on the example page
            </ArrowLink>
          </div>
        </div>
        <div>
          <Shot
            id="svc-detail"
            alt="Jay’s Barbers's haircut detail: £22, 30 minutes, eligible barbers and the booking action"
            width={680}
            fluid
            frame="none"
            className="w-full"
          />
          <Label>
            Haircut details, price and booking in one view.
          </Label>
        </div>
      </section>
      <section className="grid gap-12 border-t border-foreground/15 pt-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Intro title="Price it the way you work.">
            A straightforward price, a starting point or a quote after a
            conversation. The wording makes the difference clear.
          </Intro>
          <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 text-sm">
            <dt className="font-semibold">£22</dt>
            <dd className="text-foreground/65">One fixed price.</dd>
            <dt className="font-semibold">From £65</dt>
            <dd className="text-foreground/65">
              A starting price when the work varies.
            </dd>
            <dt className="font-semibold">Quote on request</dt>
            <dd className="text-foreground/65">
              Talk about the job before agreeing a price.
            </dd>
            <dt className="font-semibold">Free</dt>
            <dd className="text-foreground/65">
              A viewing or first conversation, clearly labelled.
            </dd>
          </dl>
        </div>
        <div className="grid grid-cols-2 items-start gap-5">
          <figure>
            <Shot
              id="svc-menu-barber"
              alt="A clear grouped haircut price menu"
              width={310}
              fluid
              frame="none"
              className="w-full"
            />
            <Label>A quick price list.</Label>
          </figure>
          <figure className="mt-14">
            <Shot
              id="svc-cards-parkside"
              alt="Detail Dept. valeting packages with descriptions and starting prices"
              width={310}
              fluid
              frame="none"
              className="w-full"
            />
            <Label>Packages with room for the detail.</Label>
          </figure>
        </div>
      </section>
    </div>
  );
}
function Booking() {
  return (
    <div className="grid gap-20">
      <section>
        <Intro title="Follow a haircut from the page to the diary.">
          Choose a step to see what the customer sees. The example follows the
          same booking journey used by your page.
        </Intro>
        <div className="mt-10">
          <BookingStory />
        </div>
      </section>
      <section className="grid items-start gap-10 border-t border-foreground/15 pt-10 lg:grid-cols-2">
        <div>
          <Intro title="Your business. Your way of booking.">
            A clear answer at the end matters as much as a simple start.
          </Intro>
          <ul className="mt-8 grid gap-6">
            {(
              [
                [
                  CalendarCheck,
                  "Book straight away",
                  "The time is confirmed on screen and kept in the diary.",
                ],
                [
                  Clock,
                  "Agree the request first",
                  "The customer knows it is waiting for your approval.",
                ],
                [
                  MessageSquare,
                  "Start with a conversation",
                  "An enquiry asks a question without reserving a time.",
                ],
              ] as const
            ).map(([Icon, title, body]) => {
              const I = Icon;
              return (
                <li key={title} className="flex gap-4">
                  <I
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 text-signal"
                  />
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                      {body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <Shot
            id="bk-request-review"
            alt="Detail Dept.'s appointment request review, clearly labelled as a pending request"
            width={600}
            fluid
            frame="none"
            className="w-full"
          />
          <Label>
            A valet requested, with approval still to come. Preview actions stay
            in this browser.
          </Label>
        </div>
      </section>
      <section>
        <Intro title="Times that fit the working day.">
          Set the hours, breaks and breathing room you need. Give each person
          the right services and let the page show the times that fit.
        </Intro>
        <ul className="mt-8 grid gap-x-12 gap-y-4 border-y border-foreground/15 py-7 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Working hours for each person",
            "Breaks, leave and one-off dates",
            "Time before and after appointments",
            "Notice and how far ahead people can book",
            "Services each person provides",
            "Your time zone and clock changes",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-signal"
              />
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
function Team() {
  return (
    <div className="grid gap-20">
      <section>
        <Intro title="A familiar face before the first visit.">
          A quick introduction, a row to browse or a bigger picture of the team.
          Pick the arrangement that suits your people and your page.
        </Intro>
        <div className="mt-10 grid items-start gap-8 md:grid-cols-3">
          {(
            [
              [
                "team-list",
                "A quick introduction",
                "A compact team list with each person's portrait",
              ],
              [
                "team-swipe",
                "One person at a time",
                "Portrait cards in a swipeable team row",
              ],
              [
                "team-grid",
                "Room for everyone",
                "The same team in a portrait grid",
              ],
            ] as const
          ).map(([id, title, alt], n) => (
            <figure key={id} className={cn(n === 1 && "md:mt-12")}>
              <Shot
                id={id}
                alt={alt}
                width={380}
                fluid
                frame="none"
                className="w-full"
              />
              <Label>{title}</Label>
            </figure>
          ))}
        </div>
      </section>
      <section className="grid items-center gap-10 border-t border-foreground/15 pt-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Intro title="The right person for the right appointment.">
            Open a profile to see their introduction, services and working days.
            Book with that person, with choices limited to the work they
            actually do.
          </Intro>
          <p className="mt-5 text-sm leading-relaxed text-foreground/65">
            Add the qualifications you want to share. Private staff phone
            numbers and email addresses stay private.
          </p>
          <div className="mt-7">
            <ArrowLink href="/inspiration/jays-barbers">
              Meet the example team
            </ArrowLink>
          </div>
        </div>
        <div>
          <Shot
            id="team-profile"
            alt="Sam's actual Jay’s Barbers profile, portrait, eligible services and Book with Sam action"
            width={750}
            fluid
            frame="none"
            className="w-full"
          />
          <Label>
            Introduce each barber with their photo, services and booking button.
          </Label>
        </div>
      </section>
    </div>
  );
}
function Products() {
  return (
    <div className="grid gap-20">
      <section className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Intro title="More than a picture and a price.">
            Give people enough to decide what to do next. A good photo, a useful
            description, availability and a way to ask about that exact item.
          </Intro>
          <div className="mt-7">
            <ArrowLink href="/inspiration/jays-barbers">
              Try the example shop
            </ArrowLink>
          </div>
        </div>
        <div>
          <Shot
            id="product-detail-station"
            alt="Jay’s Barbers's illustrative matte styling paste, £16, with details and an enquiry action"
            width={710}
            fluid
            frame="none"
            className="w-full"
          />
          <Label>
            Product photos, price and details, opened from the page.
          </Label>
        </div>
      </section>
      <section className="border-t border-foreground/15 pt-10">
        <Intro title="Keep selling the way that suits you.">
          Taplo can be the useful starting point for a purchase, wherever the
          next step happens.
        </Intro>
        <ul className="mt-8 grid gap-8 sm:grid-cols-3">
          {(
            [
              [
                MessageSquare,
                "Take an enquiry",
                "Keep the product attached to the question, so you know what they mean.",
              ],
              [
                ExternalLink,
                "Link to your shop",
                "Send people to the shop you already use. It opens in a new tab.",
              ],
              [
                ArrowRight,
                "Share a recommendation",
                "Disclose affiliate links clearly when you recommend another business's product.",
              ],
            ] as const
          ).map(([Icon, title, body]) => {
            const I = Icon;
            return (
              <li key={title} className="border-t border-foreground/15 pt-5">
                <I aria-hidden="true" className="mb-5 size-6 text-signal" />
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                  {body}
                </p>
              </li>
            );
          })}
        </ul>
        <p className="mt-7 text-sm text-foreground/65">
          Checkout on Taplo needs a payment service connected. The preview takes
          no payments.
        </p>
      </section>
    </div>
  );
}
function Vehicles() {
  return (
    <div className="grid gap-16">
      <section>
        <Intro title="Give the stock room to be seen.">
          Large photographs with the year, mileage, fuel, gearbox and price
          close by. It is easy to compare, open the detail and ask about a
          particular car.
        </Intro>
        <div className="mt-10 hidden md:block">
          <Shot
            id="vehicle-catalogue-brookfield"
            alt="Harris Cars's large-card catalogue at desktop width, with two columns and clearly marked vehicle status"
            width={1200}
            cropTo={780}
            fluid
            frame="none"
            className="w-full"
          />
        </div>
        <div className="mt-8 md:hidden">
          <Shot
            id="ex-brookfield-motors-phone"
            alt="Harris Cars's catalogue arranged as one readable column on a phone"
            width={390}
            cropTo={950}
            fluid
            className="mx-auto w-full"
          />
        </div>
        <Label>
          Vehicle photos, prices and specifications stay together on a phone.
        </Label>
      </section>
      <section className="grid items-start gap-10 border-t border-foreground/15 pt-10 lg:grid-cols-2">
        <Intro title="Keep the next step clear.">
          Available cars take enquiries and viewing requests. A reserved car can
          lead to a question about similar stock. A sold car keeps its status,
          without pretending it can still be bought.
        </Intro>
        <div>
          <ul className="grid gap-4">
            {[
              [
                "Available",
                "Open the detail, ask about the car or arrange a viewing.",
              ],
              [
                "Reserved",
                "Show the status and offer a useful alternative enquiry.",
              ],
              [
                "Sold",
                "Keep the listing clear for people returning to the page.",
              ],
            ].map(([t, b]) => (
              <li key={t} className="border-b border-foreground/15 pb-4">
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                  {b}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <ArrowLink href="/inspiration/harris-cars">
              Try the forecourt example
            </ArrowLink>
          </div>
        </div>
      </section>
    </div>
  );
}
function GalleryReviews() {
  return (
    <div className="grid gap-20">
      <section className="grid items-center gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <Intro title="Give a good picture a closer look.">
          Let people open a photo, browse the rest and zoom into the detail.
          Closing the viewer brings them back to the picture they chose.
        </Intro>
        <div>
          <Shot
            id="gal-lightbox"
            alt="The actual Taplo photo viewer displaying an illustrative Jay’s Barbers barber-shop scene"
            width={800}
            fluid
            frame="none"
            className="w-full"
          />
          <Label>
            Swipe, zoom or use the keyboard. The photograph is an illustrative
            example.
          </Label>
        </div>
      </section>
      <section className="grid gap-10 border-t border-foreground/15 pt-10 lg:grid-cols-2">
        <Intro title="Good feedback has a source.">
          Add customer words you have permission to share, with who supplied
          them. Link to your review pages so people can read more for
          themselves.
        </Intro>
        <div>
          <ul className="divide-y divide-foreground/15 border-y border-foreground/15">
            {["Google", "Facebook", "Trustpilot"].map((p) => (
              <li
                key={p}
                className="flex items-center justify-between gap-4 py-5"
              >
                <span className="text-lg font-semibold">{p}</span>
                <span className="text-sm text-foreground/65">
                  Your own review-page link
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-foreground/65">
            Connect your Google reviews destination. Imported ratings and reviews
            require a Google data connection; they cannot be entered manually.
          </p>
        </div>
      </section>
    </div>
  );
}
function Enquiries() {
  return (
    <div className="grid gap-16">
      <section>
        <Intro title="A useful question. A clear next step.">
          Ask for the details you need, let customers check what they have
          written and explain what happens after they send it.
        </Intro>
        <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
          <figure>
            <Shot
              id="enq-inline"
              alt="Detail Dept.'s enquiry form asking about the customer's car and requested work"
              width={390}
              fluid
              frame="none"
              className="mx-auto w-full"
            />
            <Label>A form that feels part of your page.</Label>
          </figure>
          <ArrowRight
            aria-hidden="true"
            className="mx-auto size-8 rotate-90 text-signal md:rotate-0"
          />
          <figure>
            <Shot
              id="enq-sent"
              alt="The actual local preview confirmation, stating that nothing has been sent to a business"
              width={390}
              fluid
              frame="none"
              className="mx-auto w-full"
            />
            <Label>A clear result, with no appointment reserved.</Label>
          </figure>
        </div>
      </section>
      <section className="grid gap-10 border-t border-foreground/15 pt-10 lg:grid-cols-2">
        <Intro title="You know what they are asking about.">
          When a question starts from a service or a product, the context comes
          with it. Keep the conversation about the right item from the start.
        </Intro>
        <div>
          <p className="text-lg font-semibold">Call, message or write</p>
          <p className="mt-3 text-base leading-relaxed text-foreground/65">
            Add the contact methods you actually use. Call and WhatsApp buttons
            open the customer’s own apps; enquiries stay with their details in
            the preview.
          </p>
          <div className="mt-7">
            <ArrowLink href="/inspiration/detail-dept">
              Try an enquiry on the example
            </ArrowLink>
          </div>
        </div>
      </section>
    </div>
  );
}
function Sharing() {
  return (
    <div className="grid gap-20">
      <section className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Intro title="Small enough for a counter. Useful enough to keep.">
            Copy the link, save the QR code or share from your device.
          </Intro>
          <div className="mt-7">
            <ArrowLink href="/inspiration/jays-barbers">
              Open an example page
            </ArrowLink>
          </div>
        </div>
        <div>
          <Shot
            id="qr-options"
            alt="The simple share popup with a scannable QR code and copy link action"
            width={510}
            fluid
            frame="none"
            className="mx-auto w-full"
          />
          <Label>
            The QR code opens the working example. Your own public address needs publishing connected.
          </Label>
        </div>
      </section>
      <section className="border-t border-foreground/15 pt-10">
        <Intro title="One page. Plenty of ways to pass it on.">
          Use what fits the moment: a quick message, a social post or a card
          someone can scan on their way out.
        </Intro>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Copy your link", "For a bio, a message or an email."],
            [
              "Print the code",
              "Save a clear PNG for your own printed material.",
            ],
            [
              "A digital business card",
              "Wallet passes are in development, alongside physical plaques.",
            ],
            ["Share from your phone", "Into the apps your device supports."],
          ].map(([t, b], n) => (
            <li key={t} className="border-t border-foreground/15 pt-5">
              <p className="text-sm font-semibold text-signal">0{n + 1}</p>
              <h3 className="mt-4 text-lg font-semibold">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                {b}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
const MESSAGE_KINDS: {
  id: FeatureId;
  title: string;
  body: string;
  icon: typeof MessageSquare;
}[] = [
  {
    id: "textApp",
    title: "A quick hello",
    body: "Open the customer's own messages app with a useful first line. They can read, edit and send it themselves.",
    icon: Smartphone,
  },
  {
    id: "enquiryInbox",
    title: "A proper enquiry",
    body: "Keep the question with the person's details and what they were asking about. Preview enquiries stay in this browser.",
    icon: MessageSquare,
  },
  {
    id: "appointmentMessages",
    title: "Appointment updates",
    body: "Confirmations, changes and cancellations, tied to the appointment they concern.",
    icon: CalendarCheck,
  },
  {
    id: "reminders",
    title: "A useful reminder",
    body: "A timely nudge before the appointment, with the information the customer needs.",
    icon: Bell,
  },
  {
    id: "promotions",
    title: "Offers people asked for",
    body: "Send offers to people who opted in, with a clear way to opt out.",
    icon: Megaphone,
  },
];
function Messages() {
  return (
    <section>
      <Intro title="The right kind of message for the moment.">
        An enquiry is different from a booking update. Keep the purpose clear,
        and be clear about what has actually been sent.
      </Intro>
      <ol
        className="mt-10 divide-y divide-foreground/15 border-y border-foreground/15"
        aria-label="The five kinds of message"
      >
        {MESSAGE_KINDS.map((m) => {
          const live = featureState(m.id) === "works",
            Icon = m.icon;
          return (
            <li
              key={m.id}
              className="grid gap-5 py-8 md:grid-cols-[3rem_1fr_0.85fr] md:gap-8"
              data-testid="message-kind"
              data-state={live ? "works" : "needs"}
            >
              <Icon aria-hidden="true" className="size-7 text-signal" />
              <div>
                <h3 className="text-xl font-semibold">{m.title}</h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-foreground/65">
                  {m.body}
                </p>
              </div>
              <div>
                <p
                  className={cn(
                    "inline-flex rounded-full px-3 py-1.5 text-sm font-semibold",
                    live
                      ? "bg-neutral-100 text-neutral-900"
                      : "bg-neutral-200 text-neutral-800",
                  )}
                >
                  {live ? "Try in the preview" : "Needs messaging connected"}
                </p>
                {!live && (
                  <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                    {featureNote(m.id)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <Link
        href="/inspiration/detail-dept"
        className="mt-8 inline-flex min-h-11 items-center gap-3 rounded font-semibold underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-signal/50"
      >
        Try the current enquiry flow
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </section>
  );
}
export const SCENES: Record<ProductPage["slug"], () => React.ReactNode> = {
  design: Design,
  services: Services,
  booking: Booking,
  team: Team,
  products: Products,
  vehicles: Vehicles,
  "gallery-reviews": GalleryReviews,
  enquiries: Enquiries,
  sharing: Sharing,
  messages: Messages,
};
