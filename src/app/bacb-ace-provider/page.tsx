import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Continuing Education Status | Behavior School",
  description:
    "Behavior School continuing education provider information is temporarily unavailable while renewal is processed.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: "https://behaviorschool.com/ceus",
  },
};

export default function ProviderStatusPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Clock className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Provider information temporarily unavailable
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Behavior School is processing its continuing education provider renewal. Provider status,
          provider numbers, and related logo information have been removed from the website until
          renewal is complete.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/ceus"
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            View professional development
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Contact Behavior School
          </Link>
        </div>
      </div>
    </main>
  );
}
