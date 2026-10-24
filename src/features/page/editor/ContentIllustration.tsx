import { CalendarDays, CreditCard, Scissors, Car, Package, Tag, Images, Image, Type, Play, Download, Star, Users, BadgeCheck, CircleHelp, Phone, MessageSquare, Mail, Share2, Link, Clock, MapPin, Navigation, Map, Bell } from "lucide-react"
import type { ContentChoice } from "./content-model"

const ICONS = { priceMenu: Scissors, serviceList: Scissors, featuredService: Scissors, products: Package, offers: Tag, booking: CalendarDays, payment: CreditCard, gallery: Images, image: Image, text: Type, video: Play, document: Download, reviews: Star, leaveReview: Star, team: Users, credentials: BadgeCheck, faq: CircleHelp, call: Phone, sms: MessageSquare, whatsapp: MessageSquare, email: Mail, social: Share2, enquiry: Mail, share: Share2, link: Link, hours: Clock, location: MapPin, directions: Navigation, serviceArea: Map, announcement: Bell }

/** A conceptual illustration, never a pretend business record or a preview of saved content. */
export function ContentIllustration({ choice }: { choice: ContentChoice }) {
  const Icon = choice.id === "vehicles" ? Car : ICONS[choice.type] ?? Package
  return <span aria-hidden="true" className="relative grid size-full place-items-center overflow-hidden bg-[#f1f1f1]">
    <span className="absolute -right-5 -top-6 size-24 rounded-full bg-[#ffffff]/60" />
    <span className="absolute left-[18%] top-[20%] h-[63%] w-[57%] -rotate-12 rounded-lg border border-[#111111]/20 bg-[#d6d6d6]" />
    <span className="relative flex h-[70%] w-[66%] rotate-6 items-center gap-3 rounded-lg border border-[#222222]/15 bg-white px-3 shadow-[4px_7px_0_#11111124]">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#111111] text-white"><Icon className="size-6" strokeWidth={1.7} /></span>
      <span className="grid flex-1 gap-2"><i className="h-1.5 w-full rounded-full bg-[#222222]" /><i className="h-1.5 w-3/4 rounded-full bg-[#d6d6d6]" /></span>
    </span>
    {choice.type === "booking" || choice.type === "reviews" ? <span className="absolute bottom-2 right-3 grid size-7 place-items-center rounded-full border-2 border-white bg-[#ffffff] text-[#111111] shadow-md"><BadgeCheck className="size-4" /></span> : null}
  </span>
}
