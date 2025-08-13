import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Products</h1>
      <p className="text-lg text-slate-600 mb-10 max-w-3xl">
        Explore Behavior School’s tools designed for school-based BCBAs and supervisors. Build structured systems for student success, streamline supervision, and grow with confidence.
      </p>

      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Behavior Study Tools</h2>
          <p className="mt-2 text-slate-600">AI-powered prep and practice tools to master the BCBA exam with clarity and confidence.</p>
          <div className="mt-4">
            <Link href="/study" className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              Learn more
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Supervision Tools</h2>
          <p className="mt-2 text-slate-600">Simple, scalable workflows and resources to support meaningful, compassionate supervision.</p>
          <div className="mt-4">
            <Link href="/supervisors" className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


