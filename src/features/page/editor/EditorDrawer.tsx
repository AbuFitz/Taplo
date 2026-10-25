"use client"

import * as React from "react"
import { Drawer } from "@base-ui/react/drawer"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useScrollMemory } from "./scroll-memory"

export type DrawerSnap = number | string
export const PEEK = 0.46
export const TALL = 1

/**
 * The editor's contextual sheet. It is NON-modal on purpose: the page preview behind it stays
 * visible and tappable, so selecting another widget just swaps the sheet's content.
 * Base UI provides the gestures (swipe to dismiss, snap between peek and tall), focus and
 * Escape handling, and keyboard-aware scrolling (VirtualKeyboardProvider). On a short landscape
 * screen it becomes a side panel so the preview keeps its height.
 */
export function EditorDrawer({ open, onOpenChange, snap, onSnap, side, title, onBack, canGoBack, screenKey = "", offsetTop = 0, offsetBottom = 0, children, testId = "editor-drawer" }: {
  open: boolean; onOpenChange: (open: boolean) => void
  snap: DrawerSnap | null; onSnap: (s: DrawerSnap | null) => void
  side: "bottom" | "right"; title: string; /** Space left clear for the top bar / bottom toolbar so they stay tappable. */ offsetTop?: number; offsetBottom?: number; onBack?: () => void; canGoBack?: boolean; /** Identifies the screen shown, so each one keeps its own scroll position. */ screenKey?: string
  children: React.ReactNode; testId?: string
}) {
  const bottom = side === "bottom"
  const [scrollRef, onScroll] = useScrollMemory<HTMLDivElement>(screenKey)
  return (
    <Drawer.Root
      open={open}
      onOpenChange={(o, details) => {
        // Radix task dialogs have their own dismissal layer. Escape must not
        // also close this Base UI sheet and destroy an unsaved record draft.
        if (!o && details.reason === "escape-key" && document.querySelector('[data-overlay][data-state="open"]')) {
          details.cancel()
          return
        }
        onOpenChange(o)
      }}
      modal={false}
      disablePointerDismissal
      swipeDirection={bottom ? "down" : "right"}
      snapPoints={bottom ? [PEEK, TALL] : undefined}
      snapPoint={bottom ? snap : undefined}
      onSnapPointChange={bottom ? (sp) => onSnap(sp) : undefined}
    >
      <Drawer.Portal>
        <Drawer.Viewport style={{ top: offsetTop, bottom: offsetBottom }} className={cn("pointer-events-none fixed inset-x-0 z-40 flex overflow-hidden", bottom ? "items-end justify-center" : "items-stretch justify-end")}>
          <Drawer.Popup
            data-testid={testId}
            className={cn(
              "pointer-events-auto relative flex min-h-0 flex-col bg-white text-neutral-900 outline-none",
              "transition-[transform,box-shadow] duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
              bottom
                ? "w-full max-h-full rounded-t-[1.75rem] shadow-[0_-12px_40px_-12px_rgb(0_0_0/0.28),0_0_0_1px_rgb(0_0_0/0.06)] touch-none [padding-bottom:max(0px,calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))] [transform:translateY(calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))] data-ending-style:[transform:translateY(calc(100%+2px))] data-starting-style:[transform:translateY(calc(100%+2px))] data-starting-style:[padding-bottom:0] data-ending-style:[padding-bottom:0]"
                : "h-full w-[min(24rem,58vw)] border-l border-black/10 shadow-[-12px_0_40px_-16px_rgb(0_0_0/0.3)] pr-[env(safe-area-inset-right)] [transform:translateX(var(--drawer-swipe-movement-x))] data-ending-style:[transform:translateX(calc(100%+2px))] data-starting-style:[transform:translateX(calc(100%+2px))]",
            )}
          >
            <div className={cn("shrink-0 select-none", bottom ? "touch-none" : "")}>
              {bottom ? <div className="mx-auto mt-2.5 h-1.5 w-11 rounded-full bg-black/15" aria-hidden="true" /> : null}
              <div className="flex min-h-14 items-center gap-1 px-3 pt-1 pb-1">
                {canGoBack && onBack ? <Button type="button" variant="ghost" size="icon" onClick={onBack} aria-label="Back" data-testid="drawer-back"><ArrowLeft /></Button> : <span className="size-10" aria-hidden="true" />}
                <Drawer.Title className="min-w-0 flex-1 truncate text-center text-[0.9375rem] font-semibold tracking-[-0.01em]" data-testid="inspector-title">{title}</Drawer.Title>
                <Drawer.Close render={<Button type="button" variant="ghost" size="icon" aria-label="Close panel" data-testid="drawer-close" />}><X /></Drawer.Close>
              </div>
            </div>
            <Drawer.VirtualKeyboardProvider>
              <Drawer.Content ref={scrollRef} onScroll={onScroll} className="min-h-0 flex-1 touch-auto overflow-y-auto overscroll-contain px-4 pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] [scrollbar-width:thin]" data-testid="drawer-body">
                {children}
              </Drawer.Content>
            </Drawer.VirtualKeyboardProvider>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
