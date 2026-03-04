"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const products = [
  {
    name: "Behavior School Plans",
    domain: "plan.behaviorschool.com",
    href: "https://plan.behaviorschool.com",
    description: "Practical planning workflows for school-based behavior teams.",
  },
  {
    name: "Behavior School Study",
    domain: "study.behaviorschool.com",
    href: "https://study.behaviorschool.com",
    description: "Focused BCBA exam preparation and structured study practice.",
  },
  {
    name: "Behavior School Supervision",
    domain: "supervision.behaviorschool.com",
    href: "https://supervision.behaviorschool.com",
    description: "Supervision resources, tracking, and support for BCBA supervisors.",
  },
  {
    name: "Behavior School Learning",
    domain: "learning.behaviorschool.com",
    href: "https://learning.behaviorschool.com",
    description: "Training content and learning pathways for behavior professionals.",
  },
  {
    name: "School RBT",
    domain: "schoolrbt.com",
    href: "https://schoolrbt.com",
    description: "RBT-specific resources designed for school implementation.",
  },
  {
    name: "Behavior Study Tools",
    domain: "behaviorstudytools.com",
    href: "https://behaviorstudytools.com",
    description: "Study tools and prep materials to strengthen exam readiness.",
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-emerald-100 bg-gradient-to-b from-emerald-50/70 to-amber-50/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">
              Behavior School Product Suite
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Simple, modern tools for behavior professionals in 2026
            </h1>
            <p className="text-lg leading-relaxed text-slate-700">
              Explore our active product ecosystem across planning, study, supervision,
              and learning for school-based and clinical teams.
            </p>
            <Link
              href="#current-products"
              className="inline-flex rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              View current products
            </Link>
          </div>
        </div>
      </section>

      <section id="current-products" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Current Products</h2>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600">
            These are the currently available Behavior School products and partner domains.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.domain}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-amber-700">
                {product.domain}
              </p>
              <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
              <p className="mt-3 min-h-[3rem] text-sm leading-relaxed text-slate-600">
                {product.description}
              </p>
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-md border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-700 hover:text-white"
              >
                Visit site
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-slate-900">Need help choosing the right product?</h2>
            <p className="mt-2 text-base text-slate-600">
              Contact the Behavior School team and we will point you to the best fit for your role.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-500"
          >
            Contact team
          </Link>
        </div>
      </section>
    </main>
  );
}
