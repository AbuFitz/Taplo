"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { localParts, WEEKDAYS, minutesOf } from "@/features/booking/time"

const ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
const NAME: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" }
export interface HoursDay { day: (typeof ORDER)[number]; opens?: string; closes?: string }

/** Ignore malformed legacy intervals; public display never invents an opening time. */
export function openingPeriods(hours: HoursDay[], day: string): { opens: string; closes: string }[] {
  const validTime = (value?: string): value is string => !!value && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)
  const periods = hours.filter(h => h.day === day && validTime(h.opens) && validTime(h.closes) && minutesOf(h.opens) < minutesOf(h.closes!))
    .map(h => ({ opens: h.opens!, closes: h.closes! })).sort((a, b) => a.opens.localeCompare(b.opens))
  const merged: { opens: string; closes: string }[] = []
  for (const period of periods) {
    const previous = merged.at(-1)
    if (previous && period.opens <= previous.closes) previous.closes = previous.closes > period.closes ? previous.closes : period.closes
    else merged.push({ ...period })
  }
  return merged
}

export function openingStatus(hours: HoursDay[], tz: string, now: number): { today: string; text: string; open: boolean } {
  let lp: ReturnType<typeof localParts>
  try { lp = localParts(now, tz) }
  catch { return { today: "", open: false, text: "See opening hours" } }
  const today = WEEKDAYS[lp.weekday]!
  for (const period of openingPeriods(hours, today)) {
    if (lp.minutes >= minutesOf(period.opens) && lp.minutes < minutesOf(period.closes)) return { today, open: true, text: `Open now · closes ${period.closes}` }
    if (lp.minutes < minutesOf(period.opens)) return { today, open: false, text: `Closed now · opens today at ${period.opens}` }
  }
  for (let i = 1; i <= 7; i++) {
    const d = WEEKDAYS[(lp.weekday + i) % 7]!
    const period = openingPeriods(hours, d)[0]
    if (period) return { today, open: false, text: `Closed now · opens ${i === 1 ? "tomorrow" : NAME[d]} at ${period.opens}` }
  }
  return { today, open: false, text: "Closed now" }
}
function Week({ hours, today }: { hours: HoursDay[]; today?: string }) {
  return <dl className="tp-hours-week">{ORDER.map(d => {
    const periods = openingPeriods(hours, d)
    return <div key={d} data-today={today === d || undefined}><dt>{NAME[d]}{today === d ? <span className="sr-only"> (today)</span> : null}</dt><dd>{periods.length ? periods.map((period, i) => <React.Fragment key={period.opens}>{i ? <><br /><span className="sr-only">and </span></> : null}{period.opens} to {period.closes}</React.Fragment>) : "Closed"}</dd></div>
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
