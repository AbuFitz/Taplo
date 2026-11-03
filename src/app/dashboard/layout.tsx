import Link from "next/link"
import { demoModeEnabled } from "@/lib/env"
import { DashboardShell } from "@/features/demo/DashboardShell"

// Read the demo flag per request, never frozen at build time.
export const dynamic = "force-dynamic"

export const metadata = { title: "Dashboard · Taplo", robots: { index: false, follow: false } }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!demoModeEnabled()) {
    return (
      <main className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-xl font-semibold">Sign in required</h1>
        <p className="mt-2 text-muted-foreground">Sign in to manage your business.</p>
        <Link className="mt-4 inline-block underline" href="/">Back to home</Link>
      </main>
    )
  }
  return <DashboardShell>{children}</DashboardShell>
}
