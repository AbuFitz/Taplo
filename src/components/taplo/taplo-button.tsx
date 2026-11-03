import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Tone = "primary" | "secondary" | "ghost"
type Size = "md" | "lg"

/** Static maps: classes are literal so Tailwind keeps them in production. */
const TONE: Record<Tone, string> = {
  primary: "bg-tp-accent text-tp-accent-fg hover:bg-tp-accent/90 dark:bg-tp-accent dark:hover:bg-tp-accent/90 border-transparent",
  secondary: "bg-transparent text-tp-fg border-tp-fg/40 hover:bg-tp-fg/10 dark:bg-transparent dark:border-tp-fg/40 dark:hover:bg-tp-fg/10",
  ghost: "bg-transparent text-tp-fg hover:bg-tp-fg/10 dark:bg-transparent dark:hover:bg-tp-fg/10 border-transparent",
}
const SIZE: Record<Size, string> = {
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
}

interface Props extends Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "asChild"> {
  tone?: Tone
  size?: Size
  /** When set, renders a real link (never a dead button). */
  href?: string
  external?: boolean
}

export function TaploButton({ tone = "primary", size = "md", href, external, className, children, ...rest }: Props) {
  const classes = cn("rounded-tp font-semibold border", TONE[tone], SIZE[size], className)
  if (href) {
    return (
      <Button asChild variant="outline" className={classes} {...rest}>
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      </Button>
    )
  }
  return (
    <Button variant="outline" className={classes} {...rest}>
      {children}
    </Button>
  )
}
