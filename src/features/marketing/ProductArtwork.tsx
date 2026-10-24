import Image from "next/image";
import { Bell, CalendarCheck, MessageSquare, ArrowRight } from "lucide-react";
import { Shot } from "./Shot";
import type { ProductPage } from "./product";
import { cn } from "@/lib/utils";

type Slug = ProductPage["slug"];
export const PRODUCT_TONES: Record<Slug, { background: string; ink: string }> =
  {
    design: { background: "#e8e8e8", ink: "#111111" },
    services: { background: "#f4f4f4", ink: "#080808" },
    booking: { background: "#ffffff", ink: "#111111" },
    team: { background: "#e6e6e6", ink: "#080808" },
    products: { background: "#ededed", ink: "#111111" },
    vehicles: { background: "#e3e3e3", ink: "#111111" },
    "gallery-reviews": { background: "#ededed", ink: "#111111" },
    enquiries: { background: "#e6e6e6", ink: "#080808" },
    sharing: { background: "#111111", ink: "#ffffff" },
    messages: { background: "#ffffff", ink: "#111111" },
  };
const LABELS: Record<Slug, string> = {
  design: "Jay’s Barbers's same content in four editable looks",
  services:
    "Illustrative local barber scene paired with the actual haircut price menu",
  booking: "The real haircut detail and booking time picker",
  team: "Jay’s Barbers team profiles for Sam, Lee and Iman",
  products: "An illustrative styling-paste product and its real Taplo detail",
  vehicles:
    "An illustrative UK forecourt photograph and the actual Harris Cars vehicle detail",
  "gallery-reviews":
    "An illustrative shop photograph opened in Taplo's actual photo viewer",
  enquiries: "The actual Detail Dept. enquiry form and local preview confirmation",
  sharing: "Jay’s Barbers's downloadable branded share card and actual page",
  messages:
    "The current enquiry interface alongside messaging and appointment symbols",
};
function Photo({
  src,
  alt,
  className,
  position,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  position?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1536}
      height={1024}
      priority={priority}
      sizes="(min-width: 1024px) 45vw, 95vw"
      className={cn("h-full w-full object-cover", className)}
      style={{ objectPosition: position }}
    />
  );
}

/** Native marketing compositions: original illustrative photography paired with current shared-renderer captures. */
export function ProductArtwork({
  slug,
  compact = false,
  priority = false,
}: {
  slug: Slug;
  compact?: boolean;
  priority?: boolean;
}) {
  const tone = PRODUCT_TONES[slug];
  let art: React.ReactNode;
  switch (slug) {
    case "design":
      art = (
        <div
          className="absolute -inset-y-[16%] inset-x-[7%] grid -rotate-6 grid-cols-2 gap-4"
          aria-hidden="true"
        >
          {["highstreet", "journal", "workbay", "forecourt"].map((id) => (
            <div
              key={id}
              className="min-h-0 overflow-hidden rounded-xl border-[3px] border-[#111111] bg-white shadow-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/looks/${id}.webp`}
                alt=""
                width={780}
                height={1080}
                loading={priority ? "eager" : "lazy"}
                className="h-full w-full object-cover object-top"
              />
            </div>
          ))}
        </div>
      );
      break;
    case "services":
      art = (
        <>
          <div className="absolute inset-0">
            <Photo
              src="/taplo-demo/station-road-barber-work.png"
              alt=""
              position="80% center"
              priority={priority}
            />
          </div>
          <Shot
            id="svc-menu-barber"
            alt=""
            width={400}
            cropTo={530}
            fluid
            frame="none"
            priority={priority}
            className="absolute bottom-[-12%] left-[7%] w-[66%] shadow-2xl"
          />
        </>
      );
      break;
    case "booking":
      art = (
        <>
          <Shot
            id="story-2-detail"
            alt=""
            width={280}
            cropTo={570}
            fluid
            priority={priority}
            className="absolute left-[7%] top-[16%] w-[42%]"
          />
          <Shot
            id="story-3-time"
            alt=""
            width={280}
            cropTo={570}
            fluid
            priority={priority}
            className="absolute right-[7%] top-[5%] w-[42%]"
          />
        </>
      );
      break;
    case "team":
      art = (
        <div className="absolute inset-x-[7%] top-[12%] grid grid-cols-3 gap-3">
          {["sam", "lee", "iman"].map((name, n) => (
            <div key={name} className={cn("min-w-0", n === 1 && "mt-[24%]")}>
              <div className="aspect-[2/3] overflow-hidden rounded-xl">
                <Image
                  src={`/taplo-demo/station-${name}.png`}
                  alt=""
                  width={512}
                  height={768}
                  sizes="(min-width: 1024px) 14vw, 28vw"
                  priority={priority}
                  className="size-full object-cover"
                />
              </div>
              <p className="mt-3 font-display text-[clamp(1rem,3cqw,1.5rem)] capitalize">
                {name}
              </p>
              <p className="mt-1 text-xs opacity-75">Jay’s Barbers</p>
            </div>
          ))}
        </div>
      );
      break;
    case "products":
      art = (
        <>
          <div className="absolute inset-0">
            <Photo
              src="/taplo-demo/station-paste.png"
              alt=""
              position="35% center"
              priority={priority}
            />
          </div>
          <Shot
            id="product-detail-station"
            alt=""
            width={360}
            cropTo={480}
            fluid
            frame="none"
            priority={priority}
            className="absolute -bottom-[16%] right-[6%] w-[48%] shadow-2xl"
          />
        </>
      );
      break;
    case "vehicles":
      art = (
        <>
          <div className="absolute inset-0">
            <Photo
              src="/taplo-demo/brookfield-golf.png"
              alt=""
              position="38% center"
              priority={priority}
            />
          </div>
          <Shot
            id="veh-detail"
            alt=""
            width={420}
            cropTo={470}
            fluid
            frame="none"
            priority={priority}
            className="absolute -bottom-[21%] right-[5%] w-[57%] shadow-2xl"
          />
        </>
      );
      break;
    case "gallery-reviews":
      art = (
        <>
          <div className="absolute inset-0">
            <Photo
              src="/taplo-demo/station-road-barber-work.png"
              alt=""
              position="70% center"
              priority={priority}
            />
          </div>
          <Shot
            id="gal-lightbox"
            alt=""
            width={550}
            fluid
            frame="none"
            priority={priority}
            className="absolute bottom-[8%] right-[6%] w-[74%] shadow-2xl"
          />
        </>
      );
      break;
    case "enquiries":
      art = (
        <>
          <Shot
            id="enq-inline"
            alt=""
            width={330}
            cropTo={540}
            fluid
            frame="none"
            priority={priority}
            className="absolute left-[7%] top-[8%] w-[52%] shadow-xl"
          />
          <div className="absolute bottom-[12%] right-[6%] w-[49%]">
            <ArrowRight aria-hidden="true" className="mb-4 ml-auto size-8" />
            <Shot
              id="enq-sent"
              alt=""
              width={310}
              fluid
              frame="none"
              priority={priority}
              className="w-full shadow-xl"
            />
          </div>
        </>
      );
      break;
    case "sharing":
      art = (
        <>
          <Shot
            id="ex-station-road-barbers-phone"
            alt=""
            width={290}
            cropTo={580}
            fluid
            priority={priority}
            className="absolute -bottom-[24%] right-[4%] w-[42%] rotate-6"
          />
          <Shot
            id="share-image"
            alt=""
            width={380}
            fluid
            frame="none"
            priority={priority}
            className="absolute left-[9%] top-[12%] w-[51%] -rotate-6 shadow-2xl"
          />
        </>
      );
      break;
    case "messages":
      art = (
        <>
          <div className="absolute left-[8%] top-[12%] grid gap-5">
            {[MessageSquare, CalendarCheck, Bell].map((Icon, n) => (
              <span
                key={n}
                className="grid size-14 place-items-center rounded-2xl border border-[#111111]/20 bg-white/50 sm:size-20"
              >
                <Icon aria-hidden="true" className="size-7 sm:size-9" />
              </span>
            ))}
          </div>
          <Shot
            id="enq-inline"
            alt=""
            width={350}
            cropTo={570}
            fluid
            frame="none"
            priority={priority}
            className="absolute right-[7%] top-[10%] w-[61%] shadow-xl"
          />
        </>
      );
      break;
  }
  return (
    <div
      className={cn(
        "relative isolate w-full overflow-hidden rounded-[1.5rem] [container-type:inline-size]",
        compact ? "aspect-[1.55]" : "aspect-[1.15]",
      )}
      style={{ background: tone.background, color: tone.ink }}
      {...(compact
        ? { "aria-hidden": true as const }
        : { role: "img", "aria-label": LABELS[slug] })}
    >
      {art}
    </div>
  );
}
