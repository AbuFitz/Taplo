import { NotBuilt, PageHeader } from "./Panel"

export { OwnerBookings as BookingsPage } from "@/features/booking/ui/owner/OwnerBookings"

export function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Profile views, call and WhatsApp clicks, bookings and revenue." />
      <NotBuilt title="Analytics" phase="Phase 5">
        <p>Not built yet: event collection, de-duplication, daily totals. When it is, dashboard previews and demo pages will never count as visits, and revenue will mean collected payments only.</p>
        <p>The Overview page shows “—” rather than made-up numbers until then.</p>
      </NotBuilt>
    </>
  )
}
