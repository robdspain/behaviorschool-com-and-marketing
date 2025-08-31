"use client";
import React from "react";
import { Send } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function ContactPage() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    message: "",
    errors: {} as Record<string, string>,
    submitting: false,
    submitted: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, submitting: true }));
    try {
      // Reuse subscribe endpoint for simple contact capture
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email, name: state.name, message: state.message, company: "" }),
      });
      if (!res.ok) throw new Error(await res.text());
      setState((s) => ({ ...s, submitting: false, submitted: true, name: "", email: "", message: "" }));
    } catch {
      setState((s) => ({ ...s, submitting: false, submitted: false, errors: { submit: "Failed to send message. Please try again." } }));
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs 
          items={[
            { label: "Contact" }
          ]}
        />
      </div>
      <section className="w-full max-w-screen-md px-4 sm:px-6 mx-auto pt-20 md:pt-24 pb-4">
      <h2 className="mb-3 bg-gradient-to-br from-emerald-800 via-emerald-600 to-emerald-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-5xl">
        Let&apos;s Get in Touch
      </h2>
      <p className="text-slate-600 mb-4 text-center text-sm md:text-base">
        Fill out the form below and we&apos;ll get back to you as soon as possible.
      </p>
      <div className="mx-auto mb-4 w-full max-w-lg items-start rounded-lg border border-emerald-200 bg-white px-4 pt-6 pb-4 shadow-lg shadow-emerald-100/50 lg:px-8">
        <form className="space-y-4 text-slate-700" onSubmit={handleSubmit} data-netlify="true" name="contact" action="/__forms.html">
          <input type="hidden" name="form-name" value="contact" />
          <input type="hidden" name="page-source" value="contact" />
          <div className="space-y-2">
            <label htmlFor="name" className="text-slate-700 font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="flex h-10 w-full rounded-md border border-emerald-300 bg-emerald-50/30 px-3 py-2 text-sm text-slate-700 outline-none transition-all hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              placeholder="Enter your name"
              name="name"
              value={state.name}
              onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-slate-700 font-medium">
              Email
            </label>
            <input
              id="email"
              placeholder="Enter your email"
              type="email"
              className="flex h-10 w-full rounded-md border border-emerald-300 bg-emerald-50/30 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-500 outline-none transition-all hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              name="email"
              required
              value={state.email}
              onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
            />
            {state.errors && state.errors.email && <p className="mt-1 text-sm text-red-500">{state.errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-slate-700 font-medium">
              Message
            </label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-emerald-300 bg-emerald-50/30 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-500 outline-none transition-all hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none"
              id="message"
              placeholder="Enter your message"
              name="message"
              value={state.message}
              onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
            />
            {state.errors && (state.errors as Record<string, string>).message && (
              <p className="mt-1 text-sm text-red-500">{(state.errors as Record<string, string>).message}</p>
            )}
          </div>
          <button
            className="group/btn relative flex items-center justify-center h-12 w-full rounded-md bg-emerald-600 py-2 text-center font-medium text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 ease-in-out hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={state.submitting}
          >
            <span className="mr-2">{state.submitting ? "Sending..." : "Send"}</span>
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
      {state.submitted && (
        <p className="text-center text-sm text-emerald-600 font-medium">Thanks! We&apos;ll be in touch.</p>
      )}
      {state.errors.submit && (
        <p className="text-center text-sm text-red-500 font-medium mt-2">{state.errors.submit}</p>
      )}
      </section>
    </>
  );
}



