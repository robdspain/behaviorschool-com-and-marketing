"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

type ToastType = "success" | "error" | "info"

type Toast = {
  id: string
  message: string
  type: ToastType
  durationMs: number
}

type ToastContextValue = {
  showToast: (message: string, options?: { type?: ToastType; durationMs?: number }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutsRef = useRef<Record<string, number>>({})

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const handle = timeoutsRef.current[id]
    if (handle) {
      window.clearTimeout(handle)
      delete timeoutsRef.current[id]
    }
  }, [])

  const showToast = useCallback<ToastContextValue["showToast"]>((message, options) => {
    const toast: Toast = {
      id: Math.random().toString(36).slice(2),
      message,
      type: options?.type ?? "info",
      durationMs: options?.durationMs ?? 3500,
    }
    setToasts((prev) => [...prev, toast])
    const handle = window.setTimeout(() => removeToast(toast.id), toast.durationMs)
    timeoutsRef.current[toast.id] = handle
  }, [removeToast])

  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach((h) => window.clearTimeout(h))
      timeoutsRef.current = {}
    }
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-0 bottom-4 z-50 flex w-full justify-center px-4 sm:px-6">
        <div className="flex w-full max-w-md flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              role="status"
              className={[
                "rounded-md border px-4 py-3 shadow-lg transition-all",
                t.type === "success" && "bg-emerald-50 border-emerald-200 text-emerald-900",
                t.type === "error" && "bg-rose-50 border-rose-200 text-rose-900",
                t.type === "info" && "bg-slate-50 border-slate-200 text-slate-900",
              ].filter(Boolean).join(" ")}
            >
              <div className="flex items-start gap-3">
                <span className="sr-only">Toast</span>
                <div className="flex-1 text-sm">{t.message}</div>
                <button
                  aria-label="Dismiss notification"
                  className="text-slate-500 hover:text-slate-700"
                  onClick={() => removeToast(t.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}


