"use client";
import React from "react";
import { Send } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export function ContactClient() {
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
      // Reuse newsletter endpoint for simple contact capture
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email, name: state.name, source: "/contact" }),
      });
      if (!res.ok) throw new Error(await res.text());
      setState((s) => ({ ...s, submitting: false, submitted: true, name: "", email: "", message: "" }));
    } catch {
      setState((s) => ({ ...s, submitting: false, submitted: false, errors: { submit: "Failed to send message. Please try again." } }));
    }
  };

  return (
    <div className="min-h-screen bg-bs-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Contact", href: "/contact" },
          ]}
        />

        <div className="mt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Have questions about BCBA certification, behavior analysis training, or need help with school-based behavior support? We&apos;re here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>

              {state.submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                  <div className="text-emerald-600 text-2xl mb-4">✓</div>
                  <h3 className="text-lg font-semibold text-emerald-800 mb-2">Message Sent!</h3>
                  <p className="text-emerald-700">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={state.name}
                      onChange={(e) => setState(s => ({ ...s, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={state.email}
                      onChange={(e) => setState(s => ({ ...s, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={state.message}
                      onChange={(e) => setState(s => ({ ...s, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Tell us how we can help you with BCBA training, certification prep, or behavior analysis..."
                      required
                    />
                  </div>

                  {state.errors.submit && (
                    <div className="text-red-600 text-sm">{state.errors.submit}</div>
                  )}

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {state.submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Let&apos;s Connect</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">BCBA Training & Certification</h3>
                    <p className="text-slate-600">
                      Get personalized guidance on exam prep, supervision requirements, and career development in applied behavior analysis.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">School-Based Behavior Support</h3>
                    <p className="text-slate-600">
                      Expert consultation on IEP goals, behavior intervention plans, and implementing evidence-based practices in schools.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Professional Development</h3>
                    <p className="text-slate-600">
                      Custom training programs for education teams, behavior analysts, and special education professionals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-8">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">Quick Response Promise</h3>
                <p className="text-emerald-700">
                  We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention that in your message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
