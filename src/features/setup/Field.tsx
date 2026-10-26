"use client"
import * as React from "react"

/** A labelled pill input with an optional hint and error, wired for screen readers. */
export function Field({ label, optional, hint, error, className, ...input }: { label: string; optional?: boolean; hint?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const auto = React.useId()
  const id = input.id ?? auto
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className="sf-field">
      <label htmlFor={id}>{label}{optional ? <small>optional</small> : null}</label>
      <input {...input} id={id} className={`sf-input ${className ?? ""}`} aria-invalid={error ? true : undefined} aria-describedby={describedBy} />
      {error ? <p id={`${id}-error`} className="sf-error" role="alert">{error}</p> : hint ? <p id={`${id}-hint`} className="sf-hint">{hint}</p> : null}
    </div>
  )
}
