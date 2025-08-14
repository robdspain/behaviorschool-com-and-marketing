"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface InlineSubscribeFormProps {
  className?: string
  ctaLabel?: string
  compact?: boolean
}

export default function InlineSubscribeForm({ className, ctaLabel = "Notify me", compact = false }: InlineSubscribeFormProps) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, company: "" }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || "Failed to subscribe")
      }
      setSubmitted(true)
      setName("")
      setEmail("")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={className}>
        <p className="text-sm text-white/90 md:text-base" aria-live="polite">
          Thanks! We&apos;ll email you when it&apos;s available.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className={`flex w-full ${compact ? "flex-col gap-2 sm:flex-row" : "flex-col gap-3 sm:flex-row"}`}>
        <Input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/95 text-slate-900 placeholder:text-slate-500 sm:max-w-[220px]"
          aria-label="Your name (optional)"
        />
        <Input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/95 text-slate-900 placeholder:text-slate-500 sm:flex-1"
          aria-label="Email address"
        />
        <Button type="submit" disabled={submitting} className="bg-[#E3B23C] hover:bg-[#d9a42f] text-slate-900">
          {submitting ? "Submitting..." : ctaLabel}
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-100" aria-live="assertive">{error}</p>
      )}
      {!error && (
        <p className="mt-2 text-xs text-white/75">No spam. Unsubscribe any time.</p>
      )}
    </form>
  )
}