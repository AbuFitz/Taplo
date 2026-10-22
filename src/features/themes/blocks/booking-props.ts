import type { BookingCardProps } from "@/components/taplo/taplo-booking-card"
import type { PublicProfileViewModel } from "../renderer/view-model"

/** Serializable props for the client-side booking/request dialog. Null when there is nothing to offer. */
export function bookingPropsFor(vm: PublicProfileViewModel): BookingCardProps | null {
  const { business: b, industry } = vm
  const k = b.contacts
  if (!vm.onlineBooking && !k.phone && !k.whatsapp && !k.email) return null
  return {
    businessName: b.identity.name,
    slug: b.identity.slug,
    heading: vm.onlineBooking ? industry.terminology.booking : "Get in touch",
    body: vm.onlineBooking
      ? "Choose a service and pick a time that suits you."
      : "Tell us what you need. We will reply with availability and a clear price.",
    ctaLabel: vm.onlineBooking ? industry.terminology.booking : "Enquire now",
    services: b.services.map((s) => ({ id: s.id, name: s.name })),
    phone: k.phone,
    whatsapp: k.whatsapp,
    email: k.email,
    onlineBooking: vm.onlineBooking,
  }
}
