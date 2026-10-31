"use client"
import Link from "next/link"
import { ArrowUpRight, BarChart3, MousePointer2, QrCode } from "lucide-react"
import { EmptyPanel } from "@/components/taplo/illustrations"
import { PageHeader } from "./Panel"
import { useDraft } from "../hooks"

export { OwnerBookings as BookingsPage } from "@/features/booking/ui/owner/OwnerBookings"

export function AnalyticsPage() {
  const { ent } = useDraft()
  if (ent && !ent.analytics) return (
    <>
      <PageHeader scene="analytics" title="Analytics" description="Profile views, call and WhatsApp clicks, bookings and revenue." />
      <EmptyPanel scene="upgrade" title="Analytics comes with a paid plan" action={<Link className="text-sm font-medium underline underline-offset-4" href="/pricing">See plans</Link>}>
        <p>See how many people view your page, scan your code and tap your buttons. Prices and limits are provisional, and nothing is charged today.</p>
      </EmptyPanel>
    </>
  )
  return <>
    <PageHeader scene="analytics" title="Analytics" description="Understand how customers find and use your page." />
    <div className="ws-analytics-metrics">{[{Icon:BarChart3,label:"Page views"},{Icon:MousePointer2,label:"Button taps"},{Icon:QrCode,label:"QR scans"}].map(({Icon,label})=><section key={label}><Icon aria-hidden="true" /><span>{label}</span><strong>—</strong><small>Tracking not connected</small></section>)}</div>
    <section className="ws-analytics-empty"><BarChart3 aria-hidden="true" /><h2>Your audience starts here.</h2><p>When tracking is connected, this is where you’ll see visits, scans and the actions customers take. We won’t show made-up numbers.</p><Link className="ws-action" href="/dashboard/page">Open your page<ArrowUpRight /></Link></section>
  </>
}
