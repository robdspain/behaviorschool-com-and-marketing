"use client";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement & { email: { value: string }; name: { value: string } };
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.value, name: form.name.value, company: "" }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("sent");
      setMessage("Thanks! We'll be in touch.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1F4D3F' }}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
          <p className="mt-3 text-lg text-emerald-100">Have a question about Study Tools or Supervision? Send us a note and we’ll help.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-xl px-6">
          <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4">
              <input name="name" type="text" placeholder="Your name" className="w-full rounded-md border border-slate-300 px-4 py-2" />
              <input name="email" type="email" placeholder="Email address" required className="w-full rounded-md border border-slate-300 px-4 py-2" />
              <textarea name="message" placeholder="How can we help?" rows={5} className="w-full rounded-md border border-slate-300 px-4 py-2" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button disabled={status === "sending"} className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
              {message ? <span className="text-sm text-slate-600">{message}</span> : null}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}


