"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { localParts, WEEKDAYS, minutesOf } from "@/features/booking/time"

const ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
const NAME: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" }
export interface HoursDay { day: (typeof ORDER)[number]; opens?: string; closes?: string }

export function openingStatus(hours: HoursDay[], tz: string, now: number): { today: string; text: string; open: boolean } {
  const lp = localParts(now, tz)
  const today = WEEKDAYS[lp.weekday]!
  const t = hours.find((h) => h.day === today)
  if (t?.opens && t.closes && lp.minutes >= minutesOf(t.opens) && lp.minutes < minutesOf(t.closes)) return { today, open: true, text: `Open now · closes ${t.closes}` }
  if (t?.opens && lp.minutes < minutesOf(t.opens)) return { today, open: false, text: `Closed now · opens today at ${t.opens}` }
  for (let i = 1; i <= 7; i++) {
    const d = WEEKDAYS[(lp.weekday + i) % 7]!
    const h = hours.find((x) => x.day === d)
    if (h?.opens && h.closes) return { today, open: false, text: `Closed now · opens ${i === 1 ? "tomorrow" : NAME[d]} at ${h.opens}` }
  }
  return { today, open: false, text: "Closed now" }
}
function Week({ hours, today }: { hours: HoursDay[]; today?: string }) {
  return <dl className="tp-hours-week">{ORDER.map(d => {
    const h = hours.find(x => x.day === d)
    return <div key={d} data-today={today === d || undefined}><dt>{NAME[d]}{today === d ? <span className="sr-only"> (today)</span> : null}</dt><dd>{h?.opens && h.closes ? `${h.opens} to ${h.closes}` : "Closed"}</dd></div>
  })}</dl>
}
/** Status comes only from the owner's opening hours and timezone. No fabricated availability. */
export function Hours({ hours, tz, variant = "list" }: { hours: HoursDay[]; tz: string; variant?: "list" | "compact" | "status" }) {
  const [s, setS] = React.useState<ReturnType<typeof openingStatus> | null>(null)
  React.useEffect(() => {
    const tick = () => setS(openingStatus(hours, tz, Date.now()))
    tick()
    const id = window.setInterval(tick, 60000)
    return () => window.clearInterval(id)
  }, [hours, tz])
  const status = <span className="tp-hours-status" data-testid="open-now" data-open={s?.open}><i aria-hidden="true" /><span>{s?.text ?? "Opening hours"}</span></span>
  if (variant === "status") return <details className="tp-tile tp-status-capsule"><summary>{status}<ChevronDown aria-hidden="true" /></summary><div className="tp-hours-expanded"><Week hours={hours} today={s?.today} /></div></details>
  return <div className="tp-hours" data-hours-layout={variant}>
    {status}
    {variant === "compact" ? <details className="tp-hours-disclosure"><summary>See weekly hours<ChevronDown aria-hidden="true" /></summary><div className="tp-hours-expanded"><Week hours={hours} today={s?.today} /></div></details> : <Week hours={hours} today={s?.today} />}
  </div>
}
