import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Props extends React.ComponentProps<typeof Input> {
  label: string
  error?: string
  hint?: string
}

/** Labelled input with associated hint/error text (aria-describedby, aria-invalid). */
export function TaploInput({ label, error, hint, id, className, ...rest }: Props) {
  const auto = React.useId()
  const inputId = id ?? auto
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <Input id={inputId} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className="min-h-11" {...rest} />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
