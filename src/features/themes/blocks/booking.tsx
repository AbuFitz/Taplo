import type { BlockOf } from "../contracts/blocks"
import { TaploBookingCard, BookingTrigger } from "@/components/taplo/taplo-booking-card"
import { Section, type BlockProps } from "./shared"
import { bookingPropsFor } from "./booking-props"

/** Band: full-bleed accent strip. High-contrast, one decisive action. */
function BandBooking({ vm }: BlockProps<BlockOf<"booking">>) {
  const p = bookingPropsFor(vm)
  if (!p) return null
  return (
    <section id="booking" aria-labelledby="booking-heading" className="bg-tp-accent text-tp-accent-fg">
      <div className="tp-container flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="booking-heading" className="font-tp-heading text-4xl font-bold uppercase leading-none sm:text-5xl">{vm.onlineBooking ? "Book it in" : "Need it sorted?"}</h2>
          <p className="mt-2 max-w-md text-lg opacity-90">{p.body}</p>
        </div>
        {/* Inverse button so it stays legible on the accent band. */}
        <div className="[&_[data-slot=button]]:border-tp-accent-fg [&_[data-slot=button]]:bg-tp-accent-fg [&_[data-slot=button]]:text-tp-accent [&_[data-slot=button]:hover]:bg-tp-accent-fg/90">
          <BookingTrigger {...p} />
        </div>
      </div>
    </section>
  )
}

function CardBooking({ vm }: BlockProps<BlockOf<"booking">>) {
  const p = bookingPropsFor(vm)
  if (!p) return null
  return (
    <Section id="booking" containerClassName="max-w-3xl">
      <TaploBookingCard {...p} />
    </Section>
  )
}

export function BookingBlock(props: BlockProps<BlockOf<"booking">>) {
  return props.config.variant === "band" ? <BandBooking {...props} /> : <CardBooking {...props} />
}
