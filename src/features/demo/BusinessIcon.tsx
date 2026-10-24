import { BookOpen, Building2, Camera, Dumbbell, Flame, Hammer, Scissors, Sparkles, Store, Utensils, Wrench, type LucideIcon } from "lucide-react"

/** One maintained SVG system: consistent optical size, stroke and visible text labels at the call site. */
const ICONS: Record<string, LucideIcon> = { barber: Scissors, hairdresser: Scissors, detailer: Sparkles, "car-dealer": Store, hospitality: Utensils, tutor: BookOpen, plumber: Flame, "personal-trainer": Dumbbell, photographer: Camera, mechanic: Wrench, builder: Hammer }
export function BusinessIcon({ id }: { id: string }) {
  const Icon = ICONS[id] ?? Building2
  return <Icon aria-hidden="true" size={22} strokeWidth={2} className="shrink-0" />
}
