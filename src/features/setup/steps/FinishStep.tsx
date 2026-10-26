"use client"
import * as React from "react"
import { Check, Copy, ExternalLink, Pencil } from "lucide-react"
import { TAPLO_DOMAINS } from "@/lib/domains"
import { PLANS } from "@/features/subscriptions/plans"
import { canPublish, publish, readiness } from "@/features/demo/actions"
import { LOOKS } from "@/features/page/themes/looks"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { useSetup } from "../context"
import { goalOf } from "../goal"
import { actionAdvice } from "../recommend"

type Target = "business" | "industry" | "reach" | "contacts" | "widgets" | "plan"

/** The last step: your page put together, shown properly, with the next move obvious. */
export function FinishStep({ onDashboard, onEdit }: { onDashboard: () => void; onEdit: (to: Target) => void }) {
  const { s, update } = useSetup()
  const reduced = useReducedMotion()
  const c = s.content
  const slug = c.identity.slug
  const offers = (c.services ?? []).filter((x) => !x.archived).length + (c.products ?? []).filter((x) => !x.archived).length + (c.gallery?.length ?? 0)
  const goal = actionAdvice(c.identity.industryKey).find((a) => a.id === goalOf(s))
  const design = LOOKS.find((l) => l.id === s.page.themeId)?.name ?? "Your design"
  const rows: { key: string; label: string; detail: string; to: Target }[] = [
    { key: "id", label: c.identity.name || "Your business", detail: `${TAPLO_DOMAINS.host}/${slug}`, to: "business" },
    { key: "offer", label: offers ? `${offers} ${offers === 1 ? "thing" : "things"} to show` : "Ready for your first items", detail: offers ? "Services, stock or photos" : "Add them from your dashboard", to: "contacts" },
    { key: "look", label: `${design} design`, detail: "Your colours and layout", to: "widgets" },
    { key: "act", label: goal ? `“${goal.label}” button` : "Main button", detail: PLANS[s.setupDrafts?.planIntent ?? "free"].name + " plan", to: "reach" },
  ]
  const [shown, setShown] = React.useState(reduced ? rows.length : 0)
  React.useEffect(() => {
    if (reduced || shown >= rows.length) return
    const t = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 350 : 520)
    return () => window.clearTimeout(t)
  }, [shown, rows.length, reduced])
  const done = shown >= rows.length
  const missing = readiness(s).filter((x) => x.required && !x.done)
  const ok = canPublish(s)
  const [copied, setCopied] = React.useState(false)
  const url = typeof window === "undefined" ? "" : `${window.location.origin}/demo/p/${slug}`
  const save = () => { update((x) => ({ ...publish(x), onboarded: true })); onDashboard() }

  return (
    <div className="sf-finish" data-done={done} data-testid="setup-finish">
      <p className="sf-lede" style={{ marginTop: 0 }}>{done ? `${c.identity.name || "Your page"} is set up and ready for customers.` : "Putting your page together…"}</p>
      <ol className="sf-built" aria-label="What your page includes">
        {rows.map((r, i) => (
          <li key={r.key} data-on={i < shown} aria-hidden={i >= shown ? true : undefined}>
            <span className="sf-built-tick">{i < shown ? <Check aria-hidden="true" /> : null}</span>
            <span className="sf-built-text"><b>{r.label}</b><small>{r.detail}</small></span>
            <button type="button" className="sf-link" tabIndex={done ? 0 : -1} onClick={() => onEdit(r.to)} aria-label={`Change: ${r.label}`}><Pencil aria-hidden="true" />Change</button>
          </li>
        ))}
      </ol>

      {done && missing.length ? (
        <div className="sf-needed" role="alert">
          <p>One thing left before you save:</p>
          <ul>{missing.map((m) => <li key={m.id}>{m.label}<button type="button" className="sf-link" onClick={() => onEdit(m.id === "contact" ? "reach" : "business")}>Add</button></li>)}</ul>
        </div>
      ) : null}

      {done ? (
        <div className="sf-link-card">
          <span className="sf-link-url">{TAPLO_DOMAINS.host}/<b>{slug}</b></span>
          <button type="button" className="sf-link-copy" onClick={() => { void navigator.clipboard?.writeText(url).then(() => setCopied(true)).catch(() => undefined) }} aria-label="Copy your page link"><Copy aria-hidden="true" />{copied ? "Copied" : "Copy"}</button>
        </div>
      ) : null}

      <div className="sf-finish-actions" aria-hidden={!done ? true : undefined}>
        <button type="button" className="sf-btn" data-kind="primary" disabled={!ok || !done} onClick={save}>{s.published ? "Save changes and open my dashboard" : "Save my page and open my dashboard"}</button>
        <button type="button" className="sf-btn" data-kind="soft" disabled={!done} onClick={() => { update((x) => ({ ...x, onboarded: true })); onDashboard() }}><ExternalLink aria-hidden="true" />Customise further</button>
      </div>
      <p className="sf-hint">Your page is saved to this device. You can change anything, any time, from your dashboard.</p>
    </div>
  )
}
