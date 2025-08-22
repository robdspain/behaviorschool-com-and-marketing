"use client";
import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Github, Twitter, Facebook, Instagram, Send } from "lucide-react";

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
      setState((s) => ({ ...s, submitting: false, submitted: true }));
    } catch {
      setState((s) => ({ ...s, submitting: false, submitted: false, errors: { submit: "Failed to send" } }));
    }
  };

  return (
    <section className="w-full max-w-screen-md px-2 mx-auto py-10">
      <h2 className="mt-4 mb-5 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 bg-clip-text text-center text-4xl font-bold text-transparent md:text-6xl">
        Let&apos;s Get in Touch
      </h2>
      <p className="text-slate-600 mb-6 text-center">
        Fill out the form below and we&apos;ll get back to you as soon as possible.
      </p>
      <div className="mx-auto mb-6 grid w-full items-start gap-12 rounded-lg border border-emerald-200 bg-white px-4 pt-10 pb-6 shadow-lg shadow-emerald-100/50 md:grid-cols-2 lg:px-12">
        <form className="space-y-8 text-slate-700" onSubmit={handleSubmit} data-netlify="true" name="contact" action="/__forms.html">
          <input type="hidden" name="form-name" value="contact" />
          <input type="hidden" name="page-source" value="contact" />
          <div className="space-y-4 text-lg">
            <label htmlFor="name" className="text-slate-700 font-medium">
              {" "}
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="flex h-10 w-full rounded-md border border-emerald-300 bg-emerald-50/30 px-3 py-2 text-sm text-slate-700 outline-none transition-all hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              placeholder="Enter your name"
              name="name"
              onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
            />
          </div>
          <div className="space-y-4 text-lg">
            <label htmlFor="email" className="text-slate-700 font-medium">
              {" "}
              Email
            </label>
            <input
              id="email"
              placeholder="Enter your email"
              type="email"
              className="flex h-10 w-full rounded-md border border-emerald-300 bg-emerald-50/30 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-500 outline-none transition-all hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              name="email"
              required
              onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
            />
            {state.errors && state.errors.email && <p className="mt-1 text-sm text-red-500">{state.errors.email}</p>}
          </div>
          <div className="space-y-4 text-lg">
            <label htmlFor="message" className="text-slate-700 font-medium text-lg">
              {" "}
              Message
            </label>
            <textarea
              className="mb-5 flex min-h-[100px] w-full rounded-md border border-emerald-300 bg-emerald-50/30 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-500 outline-none transition-all hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              id="message"
              placeholder="Enter your message"
              name="message"
              onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
            />
            {state.errors && (state.errors as Record<string, string>).message && (
              <p className="mt-1 text-sm text-red-500">{(state.errors as Record<string, string>).message}</p>
            )}
          </div>
          <button
            className="group/btn relative block h-10 w-full rounded-md bg-emerald-600 py-2 text-center font-medium text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 ease-in-out hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-200"
            type="submit"
            disabled={state.submitting}
          >
            {state.submitting ? "Sending..." : "Send"}
            <Send className="mx-2 inline h-4" />
          </button>
        </form>
        <div>
          <h3 className="text-emerald-700 mb-10 text-2xl font-semibold">Connect with Us</h3>
          <div className="mb-12 flex gap-8">
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 text-emerald-600 transition-all duration-300 ease-in-out hover:bg-emerald-100 hover:border-emerald-400"
              href="#"
            >
              <Mail className="h-5 w-5" />
            </Link>
            <div className="text-md text-slate-700">
              <p>Email us at</p>
              <p>hello@behaviorschool.com</p>
            </div>
          </div>
          <div className="mb-12 flex gap-8">
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 text-emerald-600 transition-all duration-300 ease-in-out hover:bg-emerald-100 hover:border-emerald-400"
              href="#"
            >
              <Phone className="h-5 w-5" />
            </Link>
            <div className="text-md text-slate-700">
              <p>Call us at</p>
              <p>(555) 555-5555</p>
            </div>
          </div>
          <div className="mb-12 flex gap-8">
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 text-emerald-600 px-2 transition-all duration-300 ease-in-out hover:bg-emerald-100 hover:border-emerald-400"
              href="#"
            >
              <MapPin className="h-5 w-5" />
            </Link>
            <div className="text-md text-slate-700">
              <p>Location</p>
              <p>Remote-first, US-based</p>
            </div>
          </div>
          <div className="flex space-x-12 py-7">
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 text-emerald-600 transition-all duration-300 ease-in-out hover:bg-emerald-100 hover:border-emerald-400"
              href="https://x.com/behavior_school"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 text-emerald-600 transition-all duration-300 ease-in-out hover:bg-emerald-100 hover:border-emerald-400"
              href="https://www.facebook.com/profile.php?id=61564836345571"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 text-emerald-600 transition-all duration-300 ease-in-out hover:bg-emerald-100 hover:border-emerald-400"
              href="https://www.instagram.com/behaviorschool"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 text-emerald-600 transition-all duration-300 ease-in-out hover:bg-emerald-100 hover:border-emerald-400"
              href="https://github.com/robdspain"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      {state.submitted && (
        <p className="text-center text-sm text-emerald-600 font-medium">Thanks! We&apos;ll be in touch.</p>
      )}
    </section>
  );
}



