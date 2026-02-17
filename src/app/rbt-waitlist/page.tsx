import Link from 'next/link'

export const metadata = {
  title: 'RBT Exam Prep Waitlist | Behavior School',
  description: 'Join the RBT Exam Prep waitlist and get early access updates.'
}

export default function RbtWaitlistPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-emerald-700 font-semibold">← Back to Behavior School</Link>

        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">RBT Exam Prep Waitlist</h1>
          <p className="text-slate-600 mt-2">
            Get notified the moment the RBT Exam Prep course launches. Early access, launch pricing, and new resources.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              const form = e.currentTarget as HTMLFormElement
              const formData = new FormData(form)
              const name = String(formData.get('name') || '')
              const email = String(formData.get('email') || '')

              const res = await fetch('/api/rbt-waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, role: 'RBT Waitlist' })
              })

              const data = await res.json()
              const statusEl = document.getElementById('waitlist-status')
              if (statusEl) {
                statusEl.textContent = data.message || 'Submitted'
                statusEl.className = res.ok
                  ? 'text-emerald-700 text-sm'
                  : 'text-red-600 text-sm'
              }

              if (res.ok) form.reset()
            }}
          >
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input
                name="name"
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email *</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700"
            >
              Join Waitlist
            </button>
            <p id="waitlist-status" className="text-slate-500 text-sm" />
          </form>

          <div className="mt-6 text-sm text-slate-500">
            By joining, you agree to receive RBT Exam Prep updates from Behavior School.
          </div>
        </div>
      </div>
    </div>
  )
}
