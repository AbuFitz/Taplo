import { createElement } from "react"
import { ICONS } from "./icons"
import { Link } from "lucide-react"

/** Static icon by registry name (avoids creating a component during render). */
export function WidgetIcon({ name, className }: { name: string; className?: string }) {
  return createElement(ICONS[name] ?? Link, { "aria-hidden": true, className })
}
