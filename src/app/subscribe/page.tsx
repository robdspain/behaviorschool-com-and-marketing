"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  Check,
  ClipboardCheck,
  Mail,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

type FormStatus = "idle" | "loading" | "success" | "error";

const issueContents = [
  {
    title: "A problem from school-based practice",
    description: "One concrete challenge that shows up in the work of school-based behavior analysts.",
    icon: ClipboardCheck,
  },
  {
    title: "Two useful research briefs",
    description: "Plain-language summaries of what researchers asked, found, and why it matters at school.",
    icon: BookOpenText,
  },
  {
    title: "One practical next step",
    description: "A small action you can use with your team, even if you never purchase anything from us.",
    icon: Check,
  },
];

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const { trackEmailSignup, trackFormSubmission } = useAnalytics();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "/subscribe" }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok && response.status !== 409) {
        throw new Error("Subscription failed");
      }

      const alreadySubscribed = response.status === 409 || result.isNew === false;
      setStatus("success");
      setMessage(
        alreadySubscribed
          ? "You are already subscribed. Watch your inbox for the next issue."
          : "Check your inbox to confirm. We will send the latest issue as soon as you confirm."
      );
      trackFormSubmission("newsletter_subscribe_page", true, { source: "/subscribe" });
      if (!alreadySubscribed) {
        trackEmailSignup("newsletter", undefined, {
          source: "/subscribe",
          newsletter_name: "the_weekly_research_brief",
        });
      }
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("We could not start your subscription. Please try again.");
      trackFormSubmission("newsletter_subscribe_page", false, {
        source: "/subscribe",
        error: "request_failed",
      });
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-[#1f4d3f]/10 bg-[#f7f3ee]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#1f4d3f]">For school-based behavior analysts</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#1a1a1a] sm:text-5xl">
              The Weekly Research Brief
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Keep up with useful research without adding another long read to your week. Each Tuesday, Rob connects two full-text studies to one problem school-based behavior analysts face in everyday practice.
            </p>

            {status === "success" ? (
              <div
                className="mt-8 max-w-xl border-l-4 border-[#1f4d3f] bg-white px-5 py-4 text-sm leading-6 text-[#1f4d3f]"
                role="status"
              >
                <span className="font-semibold">You are almost there.</span> {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 max-w-xl" noValidate={false}>
                <label htmlFor="newsletter-email" className="block text-sm font-semibold text-slate-800">
                  Email address
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <Mail
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={status === "loading"}
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-12 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1f4d3f] focus:ring-2 focus:ring-[#1f4d3f]/15 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1f4d3f] px-6 text-sm font-bold text-white transition hover:bg-[#123628] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4d3f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                    {status !== "loading" && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
                {status === "error" && (
                  <p className="mt-3 text-sm font-medium text-red-700" role="alert">
                    {message}
                  </p>
                )}
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Confirm your email to join. Unsubscribe or change your preferences at any time.
                </p>
              </form>
            )}
          </div>

          <div className="mx-auto w-full max-w-[280px] lg:max-w-none">
            <div className="overflow-hidden rounded-lg border border-[#1f4d3f]/15 bg-white p-3 shadow-sm">
              <Image
                src="/optimized/profile-Rob.webp"
                alt="Rob Spain, school-based behavior analyst and founder of Behavior School"
                width={560}
                height={560}
                priority
                className="aspect-square w-full rounded-md object-cover"
              />
              <div className="px-2 pb-2 pt-4">
                <p className="font-semibold text-slate-950">Written by Rob Spain, BCBA, IBA</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">School-based practice, research, and tools you can use.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#1f4d3f]">What to expect</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Short enough to read. Specific enough to use.
            </h2>
          </div>

          <div className="mt-10 grid border-y border-slate-200 md:grid-cols-3 md:divide-x md:divide-slate-200">
            {issueContents.map(({ title, description, icon: Icon }, index) => (
              <div key={title} className="border-b border-slate-200 py-7 last:border-b-0 md:border-b-0 md:px-7 md:first:pl-0 md:last:pr-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4d3f]/10 text-[#1f4d3f]">
                    <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold uppercase text-slate-400">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#1f4d3f]/10 bg-[#f7f3ee] py-14 sm:py-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#1f4d3f]">See the format before you subscribe</p>
          <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
            Read the latest Weekly Research Brief.
          </h2>
          <p className="max-w-2xl leading-7 text-slate-600">
            Each issue is published publicly with links to the full-text research, so you can decide whether the brief belongs in your Tuesday routine.
          </p>
          <Link
            href="https://robspain.com/newsletter/"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#1f4d3f] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4d3f] focus-visible:ring-offset-2"
          >
            Browse recent issues <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
