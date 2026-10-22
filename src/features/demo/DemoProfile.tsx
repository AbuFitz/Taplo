"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ProfileRenderer, buildPublicProfileViewModel } from "@/features/themes/renderer"
import { parseContent, useDemo } from "./store"

/**
 * Renders the draft ("preview") or the frozen published copy through the SAME
 * ProfileRenderer/view-model the real public route uses.
 */
export function DemoProfile({ mode, slug }: { mode: "draft" | "published"; slug?: string }) {
  const { ready, state } = useDemo()
  const source = useMemo(() => {
    if (!state) return null
    if (mode === "draft") return { content: state.content, config: state.config, plan: state.plan }
    const p = state.published
    return p && p.content.identity.slug === slug ? { content: p.content, config: p.config, plan: p.plan } : null
  }, [state, mode, slug])

  const vm = useMemo(() => {
    if (!source) return null
    const parsed = parseContent(source.content)
    if (!parsed.success || !parsed.data.identity.name) return null
    return buildPublicProfileViewModel(parsed.data, { config: source.config, plan: source.plan })
  }, [source])

  if (!ready) return <Message title="Loading…" />
  if (!vm) {
    return mode === "draft" ? (
      <Message title="Your page appears here" body="Add a business name and it will start taking shape." />
    ) : (
      <Message
        title="Nothing published at this address"
        body="Demo pages live only in the browser that created them. Publish from the dashboard, then open the link in the same browser."
        action={<Link className="underline" href="/dashboard">Go to dashboard</Link>}
      />
    )
  }
  return (
    <>
      {mode === "published" ? (
        <div role="note" className="bg-amber-300 px-4 py-2 text-center text-sm font-medium text-black">
          Demo page — stored in this browser only, not a public website.
        </div>
      ) : null}
      <ProfileRenderer vm={vm} />
    </>
  )
}

function Message({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      {body ? <p className="mt-2 text-sm text-neutral-600">{body}</p> : null}
      {action ? <div className="mt-4 text-sm">{action}</div> : null}
    </main>
  )
}
