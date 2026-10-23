"use client"

import * as React from "react"
import { AlertDialog as AlertPrimitive, Dialog as DialogPrimitive } from "radix-ui"
import { ArrowLeft, X } from "lucide-react"
import { usePortalContainer } from "@/components/ui/portal-container"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Taplo's one overlay foundation, built on Radix Dialog (focus trap, focus return, Escape, scroll lock,
 * aria wiring). It adds what the primitives alone do not give a phone:
 *
 *  - `dialog`  a focused task. Centred card from 640px up; a bottom sheet below it.
 *  - `detail`  longer reading (an item, a person, a booking). A large card from 640px up; full screen below it,
 *              with a sticky header and an optional sticky footer.
 *  - `panel`   owner editing flows. A bottom sheet on phones; a side panel from 640px up.
 *
 * Small contextual controls use the Popover primitive instead, never an overlay. Every overlay has a visible
 * title, a visible close or back control, safe-area padding, a scroll body that never traps the page behind it,
 * and a sticky footer that sits above the on-screen keyboard (it follows the visual viewport). `dirty` guards
 * dismissal with an inline "discard changes?" step. `tone="page"` themes it from the business page's tokens.
 * Overlays portal into the nearest ThemeRoot, so inside the editor preview they stay inside the preview frame.
 */

export type OverlayKind = "dialog" | "detail" | "panel"

const SHELL: Record<OverlayKind, string> = {
  dialog: "max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[min(92dvh,var(--tp-vvh,92dvh))] max-sm:rounded-t-[1.75rem] sm:left-1/2 sm:top-1/2 sm:max-h-[min(88dvh,46rem)] sm:w-[min(32rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.5rem]",
  detail: "max-sm:inset-0 max-sm:rounded-none sm:left-1/2 sm:top-1/2 sm:max-h-[min(90dvh,52rem)] sm:w-[min(44rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.5rem] max-sm:h-[var(--tp-vvh,100dvh)]",
  panel: "max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[min(92dvh,var(--tp-vvh,92dvh))] max-sm:rounded-t-[1.75rem] sm:inset-y-0 sm:right-0 sm:h-full sm:w-[min(30rem,100vw)] sm:rounded-l-[1.5rem]",
}

/** Height of the visual viewport, so a sticky footer clears the on-screen keyboard on browsers that do not resize the layout viewport. */
function useVisualViewportVar(el: HTMLElement | null) {
  React.useEffect(() => {
    const vv = typeof window !== "undefined" ? window.visualViewport : null
    if (!el || !vv) return
    const set = () => el.style.setProperty("--tp-vvh", `${Math.round(vv.height)}px`)
    set()
    vv.addEventListener("resize", set)
    return () => vv.removeEventListener("resize", set)
  }, [el])
}

export interface OverlayProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  kind?: OverlayKind
  tone?: "admin" | "page"
  title: string
  description?: string
  /** Show a back arrow instead of the close button (steps in a flow). */
  onBack?: () => void
  /** Unsaved changes: dismissing asks first. */
  dirty?: boolean
  footer?: React.ReactNode
  /** Hide the visible title (it stays available to screen readers). */
  hideTitle?: boolean
  /** Where focus goes on close. Defaults to the trigger; controlled overlays opened from several places use this. */
  onCloseAutoFocus?: (e: Event) => void
  className?: string
  bodyClassName?: string
  testId?: string
  children: React.ReactNode
}

export function Overlay({ open, onOpenChange, trigger, kind = "dialog", tone = "admin", title, description, onBack, dirty, footer, hideTitle, onCloseAutoFocus, className, bodyClassName, testId, children }: OverlayProps) {
  const container = usePortalContainer()
  const [shell, setShell] = React.useState<HTMLElement | null>(null)
  const [confirming, setConfirming] = React.useState(false)
  const [internal, setInternal] = React.useState(false)
  const controlled = open !== undefined
  const isOpen = controlled ? open : internal
  useVisualViewportVar(shell)

  const setOpen = (next: boolean) => {
    if (!next && dirty) { setConfirming(true); return }
    setConfirming(false)
    if (!controlled) setInternal(next)
    onOpenChange?.(next)
  }
  const forceClose = () => { setConfirming(false); if (!controlled) setInternal(false); onOpenChange?.(false) }

  const page = tone === "page"
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      {trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay className={cn("fixed inset-0 z-50 bg-black/35 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 motion-reduce:animate-none", page && "backdrop-blur-[2px]")} />
        <DialogPrimitive.Content
          ref={setShell}
          onCloseAutoFocus={onCloseAutoFocus}
          data-overlay={kind}
          data-testid={testId}
          {...(description ? {} : { "aria-describedby": undefined })}
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden outline-none shadow-[0_24px_64px_-16px_rgb(0_0_0/0.45)] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 motion-reduce:animate-none",
            kind === "panel" ? "sm:data-open:slide-in-from-right sm:data-closed:slide-out-to-right max-sm:data-open:slide-in-from-bottom max-sm:data-closed:slide-out-to-bottom" : "max-sm:data-open:slide-in-from-bottom max-sm:data-closed:slide-out-to-bottom sm:data-open:zoom-in-95 sm:data-closed:zoom-out-95",
            page ? "border border-tp-border bg-tp-bg text-tp-fg" : "bg-background text-foreground ring-1 ring-foreground/10",
            SHELL[kind], className,
          )}
        >
          <header className={cn("flex shrink-0 items-start gap-1 px-4 pb-2 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] sm:pt-4", page ? "border-b border-tp-border/60" : "border-b border-foreground/8")}>
            {onBack ? <Button type="button" variant="ghost" size="icon" className="-ml-2 size-11 shrink-0" onClick={onBack} aria-label="Back"><ArrowLeft /></Button> : null}
            <div className="min-w-0 flex-1 py-1.5">
              <DialogPrimitive.Title className={cn("font-semibold leading-tight tracking-[-0.015em]", hideTitle ? "sr-only" : "text-lg", page && "font-tp-heading")}>{title}</DialogPrimitive.Title>
              {description ? <DialogPrimitive.Description className={cn("mt-1 text-sm", page ? "text-tp-muted" : "text-muted-foreground")}>{description}</DialogPrimitive.Description> : null}
            </div>
            <DialogPrimitive.Close asChild><Button type="button" variant="ghost" size="icon" className="-mr-2 size-11 shrink-0" aria-label="Close"><X /></Button></DialogPrimitive.Close>
          </header>
          <div data-overlay-body className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4", bodyClassName)}>{children}</div>
          {confirming ? (
            <div role="alert" className="shrink-0 border-t border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <p className="font-medium">Discard your changes?</p>
              <div className="mt-2 flex gap-2"><Button size="sm" variant="outline" onClick={() => setConfirming(false)}>Keep editing</Button><Button size="sm" variant="destructive" onClick={forceClose}>Discard</Button></div>
            </div>
          ) : footer ? (
            <footer className={cn("shrink-0 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3", page ? "border-t border-tp-border/60 bg-tp-bg" : "border-t border-foreground/8 bg-background")}>{footer}</footer>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

/** A destructive confirmation. Focus starts on Cancel; the action names exactly what will happen and what is kept. */
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, onConfirm, tone = "admin" }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; description: string; confirmLabel: string; onConfirm: () => void; tone?: "admin" | "page" }) {
  const container = usePortalContainer()
  const cancel = React.useRef<HTMLButtonElement>(null)
  return (
    <AlertPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertPrimitive.Portal container={container}>
        <AlertPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/40 data-open:animate-in data-open:fade-in-0 motion-reduce:animate-none" />
        <AlertPrimitive.Content onOpenAutoFocus={(e) => { e.preventDefault(); cancel.current?.focus() }} className={cn("fixed left-1/2 top-1/2 z-[60] grid w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl p-5 shadow-2xl outline-none motion-reduce:animate-none", tone === "page" ? "border border-tp-border bg-tp-bg text-tp-fg" : "bg-background text-foreground ring-1 ring-foreground/10")}>
          <div><AlertPrimitive.Title className="text-lg font-semibold tracking-[-0.015em]">{title}</AlertPrimitive.Title><AlertPrimitive.Description className="mt-1.5 text-sm text-muted-foreground">{description}</AlertPrimitive.Description></div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertPrimitive.Cancel asChild><Button ref={cancel} variant="outline" className="min-h-11">Cancel</Button></AlertPrimitive.Cancel>
            <AlertPrimitive.Action asChild><Button variant="destructive" className="min-h-11" onClick={onConfirm}>{confirmLabel}</Button></AlertPrimitive.Action>
          </div>
        </AlertPrimitive.Content>
      </AlertPrimitive.Portal>
    </AlertPrimitive.Root>
  )
}
