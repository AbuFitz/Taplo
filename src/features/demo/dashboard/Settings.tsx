"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatMoney } from "@/features/services/format"
import { PLANS, PLAN_IDS, type PlanId } from "@/features/subscriptions/plans"
import { resolveEntitlements } from "@/features/subscriptions/entitlements"
import { useDemo } from "../store"
import { EmptyPanel } from "@/components/taplo/illustrations"
import { PageHeader, Panel } from "./Panel"

const ENT_LABEL: [keyof ReturnType<typeof resolveEntitlements>, string][] = [
  ["themeSwitching", "Layout and colour choices"],
  ["gallery", "Gallery"],
  ["socialLinks", "Social links"],
  ["reviewLinks", "Review links"],
  ["analytics", "Analytics"],
  ["removeBranding", "Taplo branding removed"],
  ["onlineBooking", "Online bookings"],
  ["payments", "Deposits and payments"],
  ["teamPages", "Team pages"],
  ["multiStaff", "Multiple staff"],
  ["customDomains", "Custom domains"],
]

export function Settings() {
  const { state, update, reset } = useDemo()
  const router = useRouter()
  const [confirm, setConfirm] = React.useState(false)
  const plan = state?.plan ?? "business"
  const ent = resolveEntitlements(plan, "active")
  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid max-w-3xl gap-6">
        <Panel title="Plan (demo simulator)" description="Billing isn’t connected. Switch the simulated plan to see exactly what each package unlocks across your page and dashboard. No payment is taken.">
          <div className="grid gap-1.5 sm:max-w-xs">
            <Label htmlFor="plan">Simulated plan</Label>
            <Select value={plan} onValueChange={(v) => update((x) => ({ ...x, plan: v as PlanId }))}>
              <SelectTrigger id="plan" className="min-h-11 w-full"><SelectValue /></SelectTrigger>
              <SelectContent position="popper">
                {PLAN_IDS.map((p) => <SelectItem key={p} value={p}>{PLANS[p].name} · {PLANS[p].priceMinorGbp ? `${formatMoney(PLANS[p].priceMinorGbp)}/month` : "£0"}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <ul className="mt-4 grid gap-1.5 text-sm sm:grid-cols-2">
            <li>{ent.maxServices === null ? "✓ Unlimited services" : `• Up to ${ent.maxServices} services shown`}</li>
            {ENT_LABEL.map(([k, label]) => <li key={k}>{ent[k] ? "✓" : "✕"} {label}</li>)}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Downgrading never deletes your content; restricted items are hidden and can be restored by upgrading.</p>
        </Panel>
        <EmptyPanel illustration="connect" title="Payments, email and domains are not connected">
          <p>Billing, deposits, email confirmations, custom domains and data export each need their own account and will be switched on one at a time. Nothing is charged today.</p>
        </EmptyPanel>
        <Panel title="Demo data" description="Everything is stored only in this browser.">
          {confirm ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">Delete all demo data in this browser?</span>
              <Button variant="destructive" onClick={() => { reset(); router.push("/dashboard") }}>Yes, reset</Button>
              <Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button>
            </div>
          ) : <Button variant="outline" onClick={() => setConfirm(true)}>Reset demo data</Button>}
        </Panel>
      </div>
    </>
  )
}
