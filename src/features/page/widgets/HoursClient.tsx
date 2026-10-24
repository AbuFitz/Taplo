"use client"

import * as React from "react"
import { localParts, WEEKDAYS, minutesOf } from "@/features/booking/time"

const ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
const NAME: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" }

export interface HoursDay { day: (typeof ORDER)[number]; opens?: string; closes?: string }

function status(hours: HoursDay[], tz: string, now: number): { today: string; text: string; open: boolean } {
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

/**
 * Opening hours with today highlighted and an "open now" line in the business's own time zone. The live state
 * is worked out in the browser after load, so server and browser markup always match and the page cache stays valid.
 */
export function Hours({ hours, tz, compact }: { hours: HoursDay[]; tz: string; compact?: boolean }) {
  const [s, setS] = React.useState<ReturnType<typeof status> | null>(null)
  React.useEffect(() => {
    const tick = () => setS(status(hours, tz, Date.now()))
    tick()
    const id = window.setInterval(tick, 60000)
    return () => window.clearInterval(id)
  }, [hours, tz])
  return (
    <div>
      {s ? <p className="mb-2 flex items-center gap-2 text-left text-sm font-semibold" data-testid="open-now" data-open={s.open}><span aria-hidden="true" className="inline-block size-2 rounded-full" style={{ background: s.open ? "#16a34a" : "var(--tp-muted)" }} />{s.text}</p> : null}
      <dl className={compact ? "grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm" : "grid grid-cols-[auto_1fr] gap-x-6 gap-y-1"}>
        {ORDER.map((d) => {
          const h = hours.find((x) => x.day === d)
          const on = s?.today === d
          return (
            <div key={d} className="contents" data-today={on || undefined}>
              <dt className={on ? "text-left font-bold" : "text-left font-medium"}>{NAME[d]}{on ? <span className="sr-only"> (today)</span> : null}</dt>
              <dd className={on ? "text-left font-semibold" : "tp-muted text-left"}>{h?.opens && h.closes ? `${h.opens} to ${h.closes}` : "Closed"}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
