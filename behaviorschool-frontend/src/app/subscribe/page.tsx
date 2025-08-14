"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useToast } from "@/components/toast"
import { Button } from "@/components/ui/button"

const SubscribeSchema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters").max(80, "Name is too long").optional().or(z.literal("")),
  company: z.string().max(0).optional(),
})

type SubscribeInput = z.infer<typeof SubscribeSchema>

export default function SubscribePage() {
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubscribeInput>({
    resolver: zodResolver(SubscribeSchema),
    defaultValues: { email: "", name: "", company: "" },
    mode: "onSubmit",
  })

  const onSubmit = async (data: SubscribeInput) => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        const message = json?.error ?? "Subscription failed. Please try again."
        showToast(message, { type: "error" })
        return
      }
      showToast("You're in! Check your inbox.", { type: "success" })
      reset({ email: "", name: "", company: "" })
    } catch {
      showToast("Network error. Please try again.", { type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Join the Community</h1>
        <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
          Get exclusive insights, actionable strategies, and the support you need to lead with confidence and create lasting change.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-slate-200 max-w-md mx-auto text-left"
          noValidate
        >
          <div className="grid gap-4">
            <div className="grid gap-1">
              <label htmlFor="email" className="text-sm font-medium text-slate-900">
                Email
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-rose-700" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <label htmlFor="name" className="text-sm font-medium text-slate-900">
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-rose-700" role="alert">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            <div className="hidden">
              <label htmlFor="company" className="text-sm">
                Company
              </label>
              <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing…" : "Subscribe"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}