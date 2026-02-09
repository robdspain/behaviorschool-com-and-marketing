"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Send, CheckCircle, MessageCircle, BookOpen, CreditCard, KeyRound, Smartphone, HelpCircle } from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  FAQ Data                                                            */
/* ------------------------------------------------------------------ */

const faqSections = [
  {
    title: "Account & Login",
    icon: <KeyRound className="w-5 h-5" />,
    items: [
      {
        q: "How do I create an account?",
        a: 'Visit study.behaviorschool.com and click "Sign Up." You can create a free account to explore practice questions and tools.',
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: 'Click "Forgot Password" on the login page. We\'ll send a reset link to your email. Check your spam folder if you don\'t see it within a few minutes.',
      },
      {
        q: "Can I use the same account on multiple devices?",
        a: "Yes! Your account works on any device with a web browser — phone, tablet, laptop, or desktop. Your progress syncs automatically.",
      },
    ],
  },
  {
    title: "Study Tools & Practice Questions",
    icon: <BookOpen className="w-5 h-5" />,
    items: [
      {
        q: "How many practice questions are available?",
        a: "Over 10,000 AI-generated questions mapped to the 5th Edition BCBA Task List. Questions adapt to your performance level.",
      },
      {
        q: "What is the AI Tutor?",
        a: 'The AI Tutor lets you "Discuss This Question" — ask follow-up questions and get detailed explanations for any practice question in real time.',
      },
      {
        q: "How do mock exams work?",
        a: "Mock exams simulate the real BCBA exam format. Your scores are tracked over time so you can see improvement and identify weak areas.",
      },
      {
        q: "Are the questions updated for the current exam?",
        a: "Yes. All questions align with the current BACB 5th Edition Task List.",
      },
    ],
  },
  {
    title: "Billing & Subscriptions",
    icon: <CreditCard className="w-5 h-5" />,
    items: [
      {
        q: "What are the pricing plans?",
        a: "Monthly ($29.99/mo), Quarterly ($89.99/quarter), or Annual ($288/year). All plans include full access to practice questions, mock exams, and the AI Tutor.",
      },
      {
        q: "How do I cancel my subscription?",
        a: "Email us at support@behaviorschool.com with your account email and we'll cancel it immediately. No hoops, no retention calls.",
      },
      {
        q: "Do you offer refunds?",
        a: "If you're not satisfied within the first 7 days, email us for a full refund. After 7 days, we'll prorate remaining time on annual plans.",
      },
      {
        q: "I have a promo code. How do I use it?",
        a: "Enter your promo code during checkout. The discount will be applied before payment is processed.",
      },
    ],
  },
  {
    title: "School-Based Tools",
    icon: <Smartphone className="w-5 h-5" />,
    items: [
      {
        q: "Is the IEP Goal Writer free?",
        a: "Yes! The IEP Goal Writer is free to use at behaviorschool.com/iep-goal-writer.",
      },
      {
        q: "How does the FBA-to-BIP tool work?",
        a: "It walks you through a structured functional behavior assessment and generates a behavior intervention plan based on your inputs. Visit behaviorschool.com/fba-to-bip to get started.",
      },
      {
        q: "Is my student data secure?",
        a: "We take data privacy seriously. We do not store student names or identifying information in our tools. All data is processed in-session and not retained.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Components                                                          */
/* ------------------------------------------------------------------ */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left border-b border-slate-100 last:border-0"
    >
      <div className="flex items-center justify-between py-4 gap-4">
        <span className="font-medium text-slate-800 text-sm sm:text-base">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </div>
      {open && (
        <p className="text-sm text-slate-600 pb-4 leading-relaxed">{a}</p>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */

export function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, category }),
      });
    } catch {
      // best-effort
    }
    setSubmitting(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bs-background to-white pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" /> Support Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-bs-text mb-3">
            How can we help?
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Browse common questions below or send us a message. We typically respond within 24 hours.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8 mb-16">
          {faqSections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
                <span className="text-emerald-600">{section.icon}</span>
                <h2 className="font-bold text-slate-800">{section.title}</h2>
              </div>
              <div className="px-6">
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-800">
              Send Us a Message
            </h2>
          </div>

          {sent ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Message sent!
              </h3>
              <p className="text-slate-500">
                We&apos;ll get back to you within 24 hours at the email you
                provided.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="support-name"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="support-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-slate-800"
                  />
                </div>
                <div>
                  <label
                    htmlFor="support-email"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="support-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="support-category"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="support-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-slate-800 bg-white"
                >
                  <option value="general">General Question</option>
                  <option value="account">Account & Login</option>
                  <option value="billing">Billing & Subscription</option>
                  <option value="study-tools">Study Tools</option>
                  <option value="school-tools">School-Based Tools</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="support-message"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="support-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-slate-800 resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !email || !message}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Direct contact fallback */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            You can also email us directly at{" "}
            <a
              href="mailto:support@behaviorschool.com"
              className="text-emerald-600 font-medium"
            >
              support@behaviorschool.com
            </a>
          </p>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-4"
          >
            ← Back to Behavior School
          </Link>
        </div>
      </div>
    </div>
  );
}
