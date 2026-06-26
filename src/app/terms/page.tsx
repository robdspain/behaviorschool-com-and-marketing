import Link from "next/link";

const updatedDate = "June 26, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Behavior School
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {updatedDate}</p>

        <div className="mt-8 space-y-8 text-base leading-7 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Acceptance of Terms</h2>
            <p className="mt-3">
              By using BehaviorSchool.com, BehaviorStudyTools.com, or related Behavior School LLC
              services, you agree to these terms. If you do not agree, do not use the services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Educational Use</h2>
            <p className="mt-3">
              Behavior School provides educational content, study tools, professional development,
              and behavior-support resources. Our materials do not replace professional judgment,
              legal advice, clinical supervision, district policy, or individualized team
              decision-making.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Accounts and Access</h2>
            <p className="mt-3">
              You are responsible for maintaining the confidentiality of your account credentials
              and for activity under your account. Access to paid products, courses, or software
              may be limited by subscription, registration, or purchase terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Acceptable Use</h2>
            <p className="mt-3">
              You agree not to misuse the services, interfere with platform security, copy or
              redistribute paid materials without permission, upload unlawful content, or use the
              services in a way that violates applicable laws or professional obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Professional Responsibility</h2>
            <p className="mt-3">
              Behavior School tools may support drafting, studying, documentation, and planning.
              Users remain responsible for reviewing outputs, protecting confidential information,
              following applicable laws and ethics standards, and making final professional
              decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Changes</h2>
            <p className="mt-3">
              We may update these terms from time to time. Continued use of the services after an
              update means you accept the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Contact</h2>
            <p className="mt-3">
              Questions about these terms can be sent through our{" "}
              <Link href="/contact" className="font-semibold text-emerald-700 hover:text-emerald-900">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
