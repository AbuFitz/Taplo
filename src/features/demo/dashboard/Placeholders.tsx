import { NotBuilt, PageHeader } from "./Panel"

export function BookingsPage() {
  return (
    <>
      <PageHeader title="Bookings" description="Requests, appointments and payment state." />
      <NotBuilt title="Bookings, calendar and availability" phase="Phase 6">
        <p>Not built yet: availability rules, transactional slot holds, request/instant booking, cancellation and rescheduling, and confirmation emails.</p>
        <p>What works now: customers reach you through the Call, WhatsApp and Email buttons on your page, with the chosen service pre-filled.</p>
      </NotBuilt>
    </>
  )
}

export function ProductsPage() {
  return (
    <>
      <PageHeader title="Products" description="Optional NFC cards, stickers, keyrings and wristbands." />
      <NotBuilt title="NFC products" phase="Phase 9">
        <p>Not built yet: catalogue, orders, fulfilment and tag activation. NFC is optional merchandise and never required to use Taplo.</p>
      </NotBuilt>
    </>
  )
}

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
