import Link from "next/link";

const updatedDate = "June 26, 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Behavior School
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {updatedDate}</p>

        <div className="mt-8 space-y-8 text-base leading-7 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Overview</h2>
            <p className="mt-3">
              Behavior School LLC provides educational resources, professional development,
              study tools, and behavior-support software for educators, behavior analysts,
              and related professionals. This policy explains how we collect, use, and protect
              information when you use BehaviorSchool.com, BehaviorStudyTools.com, and related
              services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Information We Collect</h2>
            <p className="mt-3">
              We may collect information you provide directly, such as your name, email address,
              account details, form responses, course registrations, support requests, and
              newsletter preferences. We may also collect usage information such as pages visited,
              device type, referral source, and product interactions to improve site performance
              and user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">How We Use Information</h2>
            <p className="mt-3">
              We use information to provide services, process registrations, send requested
              resources, maintain accounts, improve products, respond to support requests,
              deliver newsletters, analyze site performance, and meet legal or compliance
              obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Student and School Data</h2>
            <p className="mt-3">
              Behavior School products are designed for professional use in education and behavior
              analysis. Users are responsible for following district policies, FERPA requirements,
              and applicable privacy laws when entering student-related information. We encourage
              users to avoid entering personally identifiable student information unless a tool,
              agreement, or district-approved workflow explicitly supports that use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Service Providers</h2>
            <p className="mt-3">
              We may use trusted service providers for hosting, analytics, email delivery,
              payments, authentication, support, and product operations. These providers are used
              only as needed to operate and improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Your Choices</h2>
            <p className="mt-3">
              You can unsubscribe from marketing emails using the link in those emails. You may
              also contact us to request access, correction, or deletion of personal information
              when applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Contact</h2>
            <p className="mt-3">
              Questions about this policy can be sent through our{" "}
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
