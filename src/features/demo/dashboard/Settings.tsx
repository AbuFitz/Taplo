"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
  const [section, setSection] = React.useState<"plan" | "connections" | "data">("plan")
  const [confirm, setConfirm] = React.useState(false)
  const plan = state?.plan ?? "business"
  const ent = resolveEntitlements(plan, "active")
  return (
    <>
      <PageHeader title="Settings" description="Your plan, connections and workspace data." />
      <div className="ws-settings"><nav className="ws-settings-nav" aria-label="Settings sections">{([['plan','Plan & features'],['connections','Connections'],['data','Workspace data']] as const).map(([id,label])=><button key={id} type="button" aria-pressed={section===id} onClick={()=>setSection(id)}>{label}</button>)}</nav><div className="ws-settings-body">
        {section === "connections" ? <EmptyPanel illustration="connect" title="Payments, email and domains are not connected">
          <p>Billing, deposits, email confirmations, custom domains and data export each need their own account and will be switched on one at a time. Nothing is charged today.</p>
        </EmptyPanel> : null}
        {section === "plan" ? <Panel title="Plan" description="Billing is not connected, so nothing is charged. Switch plans here to see what each one unlocks.">
          <div className="ws-plan-options" role="group" aria-label="Choose a plan">{PLAN_IDS.map(p=><button key={p} type="button" aria-pressed={plan===p} onClick={()=>update(x=>({...x,plan:p as PlanId}))}><b>{PLANS[p].name}</b><span>{PLANS[p].priceMinorGbp ? `${formatMoney(PLANS[p].priceMinorGbp)}/month` : "Free"}</span></button>)}</div>
          <ul className="mt-4 grid gap-1.5 text-sm sm:grid-cols-2">
            <li>{ent.maxServices === null ? "✓ Unlimited services" : `• Up to ${ent.maxServices} services shown`}</li>
            {ENT_LABEL.map(([k, label]) => <li key={k}>{ent[k] ? "✓" : "✕"} {label}</li>)}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Downgrading never deletes your content; restricted items are hidden and can be restored by upgrading.</p>
        </Panel> : null}
        {section === "data" ? <Panel title="Workspace data" description="Everything is stored only in this browser.">
          {confirm ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">Delete all demo data in this browser?</span>
              <Button variant="destructive" onClick={() => { reset(); router.push("/dashboard") }}>Yes, reset</Button>
              <Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button>
            </div>
          ) : <Button variant="outline" onClick={() => setConfirm(true)}>Reset demo data</Button>}
        </Panel> : null}
      </div></div>
    </>
  )
}
