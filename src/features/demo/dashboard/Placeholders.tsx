"use client"
import Link from "next/link"
import { EmptyPanel } from "@/components/taplo/illustrations"
import { PageHeader } from "./Panel"
import { useDraft } from "../hooks"

export { OwnerBookings as BookingsPage } from "@/features/booking/ui/owner/OwnerBookings"

export function AnalyticsPage() {
  const { ent } = useDraft()
  if (ent && !ent.analytics) return (
    <>
      <PageHeader title="Analytics" description="Profile views, call and WhatsApp clicks, bookings and revenue." />
      <EmptyPanel scene="upgrade" title="Analytics comes with a paid plan" action={<Link className="text-sm font-medium underline underline-offset-4" href="/pricing">See plans</Link>}>
        <p>See how many people view your page, scan your code and tap your buttons. Prices and limits are provisional, and nothing is charged today.</p>
      </EmptyPanel>
    </>
  )
  return (
    <>
      <PageHeader title="Analytics" description="Profile views, call and WhatsApp clicks, bookings and revenue." />
      <EmptyPanel scene="analytics" title="No numbers yet" action={<Link className="text-sm font-medium underline underline-offset-4" href="/dashboard/page">Share your page</Link>}>
        <p>Views, scans and button clicks will appear here once people start visiting. Share your link or QR code to get the first ones.</p>
        <p>Tracking is not switched on yet. Your own visits from the dashboard are never counted.</p>
      </EmptyPanel>
    </>
  )
}
