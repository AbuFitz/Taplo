import Link from "next/link"
import { EmptyPanel } from "@/components/taplo/illustrations"
import { PageHeader } from "./Panel"

export { OwnerBookings as BookingsPage } from "@/features/booking/ui/owner/OwnerBookings"

export function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Profile views, call and WhatsApp clicks, bookings and revenue." />
      <EmptyPanel illustration="analytics" title="No numbers yet" action={<Link className="text-sm font-medium underline underline-offset-4" href="/dashboard/page">Share your page</Link>}>
        <p>Views, scans and button clicks will appear here once people start visiting. Share your link or QR code to get the first ones.</p>
        <p>Tracking is not switched on yet. Your own visits from the dashboard are never counted.</p>
      </EmptyPanel>
    </>
  )
}
