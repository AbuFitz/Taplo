import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Shot } from "./Shot"
import { cn } from "@/lib/utils"

/** Scene A. Three real business pages at true size, cropped on purpose so every line stays readable. */
export function HeroScene() {
  return (
    <div className="relative mx-auto flex w-full max-w-[75rem] items-start justify-center gap-5 overflow-hidden px-5 [mask-image:linear-gradient(to_bottom,black_82%,transparent)]" aria-label="Three example business pages, each with its own identity">
      <Shot id="hero-dealer" alt="A used car dealer's page: showroom look with a Book a viewing button" width={400} priority cropTo={600} className="mt-14 hidden md:block" />
      <Shot id="hero-barber" alt="A barber's page: dark photographic header with a Book your chair button" width={400} priority cropTo={660} />
      <Shot id="hero-trades" alt="A plumber's page: bold blue look with a Request a visit button" width={400} priority cropTo={600} className="mt-14 hidden xl:block" />
    </div>
  )
}

const CAPABILITIES = [
  { id: "cap-services", title: "Services and prices", body: "Grouped, priced and ready to ask about.", alt: "A grouped price menu", crop: undefined },
  { id: "cap-vehicles", title: "Vehicle stock", body: "Photos, price and the facts buyers ask about first.", alt: "Vehicle cards with year, mileage, fuel and gearbox", crop: 720 },
  { id: "cap-product", title: "Products", body: "Take enquiries, or link to your own shop.", alt: "A product card for beard oil", crop: undefined },
] as const satisfies readonly { id: "cap-services" | "cap-vehicles" | "cap-product"; title: string; body: string; alt: string; crop: number | undefined }[]

/** Scene C. One record model, three kinds of business. */
export function CapabilitiesScene() {
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] items-start gap-x-8 gap-y-14 md:grid-cols-3">
      {CAPABILITIES.map((c, n) => (
        <li key={c.id} className={cn("grid min-w-0 grid-cols-[minmax(0,1fr)] justify-items-center gap-5", n === 1 && "md:mt-16")}>
          <Shot id={c.id} alt={c.alt} width={368} frame="phone" cropTo={c.crop} />
          <div className="max-w-[22rem] text-center">
            <h3 className="text-xl font-semibold tracking-[-0.025em]">{c.title}</h3>
            <p className="mt-1.5 text-[0.9375rem] text-foreground/65">{c.body}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ArrowLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={cn("group inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline", className)}>{children}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></Link>
}
