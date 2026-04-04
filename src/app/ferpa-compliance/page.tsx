import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Lock, Clock, Database, Ban, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "FERPA Compliance | Behavior School",
  description:
    "Behavior School's student data privacy and FERPA compliance overview for district IT directors, compliance officers, and technology committees.",
  alternates: {
    canonical: "https://behaviorschool.com/ferpa-compliance",
  },
  openGraph: {
    title: "FERPA Compliance | Behavior School",
    description:
      "Security controls and data privacy practices for district IT directors and compliance officers reviewing Behavior School.",
    type: "website",
    url: "https://behaviorschool.com/ferpa-compliance",
  },
};

const controls = [
  {
    icon: ShieldCheck,
    title: "Audit Logging",
    status: "Implemented",
    description:
      "Every access to student-related data is logged with the user ID, timestamp (UTC), action type (read, write, export), and IP address. Logs are retained and reviewable. District compliance teams can request an access report at any time.",
    ferpaNote:
      "Audit trails let districts verify that only authorized personnel accessed education records, and support breach investigation if needed.",
  },
  {
    icon: Lock,
    title: "Multi-Factor Authentication (MFA)",
    status: "Implemented",
    description:
      "All administrator accounts require MFA at login using time-based one-time passwords (TOTP — compatible with Google Authenticator, Authy, and similar apps). Standard staff accounts are encouraged to enable MFA and can be required by district policy.",
    ferpaNote:
      "MFA is a recognized best practice for preventing unauthorized access to systems with access to student data.",
  },
  {
    icon: Lock,
    title: "Password Policy",
    status: "Implemented",
    description:
      "All accounts require a minimum of 12 characters with letters, numbers, and symbols. Accounts lock after 5 consecutive failed login attempts and require administrator reset or email verification to unlock.",
    ferpaNote:
      "Strong credential requirements reduce the risk of brute-force or credential-stuffing attacks.",
  },
  {
    icon: Clock,
    title: "Session Timeout",
    status: "Implemented",
    description:
      "User sessions expire automatically after 30 minutes of inactivity. Users must reauthenticate to continue — across all platform interfaces.",
    ferpaNote:
      "Session timeouts limit exposure from unattended, authenticated browser sessions — a common risk in shared-device school environments.",
  },
  {
    icon: Database,
    title: "Data Residency & Encryption",
    status: "Confirmed",
    description:
      "Application data is stored in Convex, with encryption at rest (AES-256) and in transit (TLS 1.2+), hosted in the United States. The web application is hosted on Netlify with HTTPS enforced (TLS 1.3) on all connections. Neither Convex nor Netlify sells or shares customer data.",
    ferpaNote:
      "Encryption at rest and in transit is a baseline requirement for systems that may store education records.",
  },
];

const summaryRows = [
  { label: "Audit logging (user, timestamp, action, IP)", status: true },
  { label: "MFA for administrator accounts", status: true },
  { label: "Password complexity + lockout policy", status: true },
  { label: "30-minute session timeout", status: true },
  { label: "Encryption at rest (AES-256)", status: true, note: "Via Convex" },
  { label: "Encryption in transit (TLS)", status: true, note: "Via Convex + Netlify" },
  { label: "U.S. data residency", status: true },
  { label: "No third-party data sharing", status: true },
];

const noList = [
  "We do not sell or rent user data to third parties",
  "We do not use student data to train AI models or for any purpose outside delivering our service",
  "We do not transfer data to vendors outside the United States",
  "We do not use student personally identifiable information (PII) in marketing communications",
];

export default function FerpaCompliancePage() {
  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-50 to-emerald-50 py-14 lg:py-20 print:py-8 print:bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium mb-4 print:hidden">
            <ShieldCheck size={16} />
            <span>For Schools &amp; Districts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Student Data Privacy &amp; FERPA Compliance
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl">
            Prepared for district IT directors, compliance officers, and technology committees
            reviewing Behavior School as a vendor.
          </p>
          <p className="text-sm text-slate-500 mt-4">April 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">

        {/* Overview */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Behavior School is a professional learning platform used by BCBAs, behavior
            technicians, and school staff. We do not store or process student records (IEPs,
            evaluations, or identifying student data) as part of our core platform.
          </p>
          <p className="text-slate-700 leading-relaxed">
            This document describes the security controls we have in place to protect any user
            data our platform does handle — and why those controls meet or exceed FERPA
            expectations for a school-contracted service provider.
          </p>
        </section>

        {/* Summary Table */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Summary</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 print:rounded-none print:border-slate-300">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 print:bg-slate-100">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Control</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  >
                    <td className="px-4 py-3 text-slate-700">{row.label}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        {row.note ? row.note : "Implemented"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Technical Controls */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Technical Controls</h2>
          <div className="space-y-6">
            {controls.map((control, i) => {
              const Icon = control.icon;
              return (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl p-6 print:rounded-none print:border-slate-300 print:p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center print:hidden">
                      <Icon size={20} className="text-emerald-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{control.title}</h3>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full print:border print:border-emerald-300">
                          <CheckCircle2 size={11} />
                          {control.status}
                        </span>
                      </div>
                      <p className="text-slate-700 mb-3">{control.description}</p>
                      <div className="bg-slate-50 border-l-4 border-emerald-400 px-4 py-2 rounded-r-lg print:bg-white print:border-l-2">
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold text-slate-700">FERPA relevance: </span>
                          {control.ferpaNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Data Handling */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Handling</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 print:rounded-none print:bg-white print:border-slate-300">
            <div className="flex items-center gap-2 mb-4">
              <Ban size={18} className="text-slate-500 print:hidden" />
              <h3 className="font-semibold text-slate-900">What We Do Not Do</h3>
            </div>
            <ul className="space-y-2">
              {noList.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Request DPA CTA */}
        <section className="mb-12 print:mb-8">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center print:hidden">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Ready to move forward with your district?
            </h2>
            <p className="text-slate-600 mb-6 max-w-xl mx-auto">
              We can provide a signed Data Processing Agreement (DPA), Student Data Privacy
              Agreement (SDPA), or completed vendor security questionnaire. Reach out and
              we&apos;ll respond within 2 business days.
            </p>
            <Link
              href="mailto:hello@behaviorschool.com?subject=DPA%20Request%20-%20Behavior%20School"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Mail size={18} />
              Request a DPA
            </Link>
          </div>
          {/* Print version of CTA */}
          <div className="hidden print:block border border-slate-300 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Contact Us</h2>
            <p className="text-slate-700 mb-2">
              To request a DPA, SDPA, or vendor security questionnaire:
            </p>
            <p className="text-slate-700 font-medium">hello@behaviorschool.com</p>
            <p className="text-slate-500 text-sm mt-1">We respond within 2 business days.</p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
          <p className="text-slate-700 mb-4">
            If your district requires additional documentation or wants to schedule a call with
            our team, contact us directly:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="mailto:hello@behaviorschool.com"
              className="inline-flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-800 print:text-slate-900"
            >
              <Mail size={16} className="print:hidden" />
              hello@behaviorschool.com
            </Link>
          </div>
          <p className="text-slate-600 text-sm mt-4">
            Behavior School is built and operated by a small team. We&apos;re happy to jump on a
            call with your district IT director or compliance officer — just reach out.
          </p>
        </section>

        {/* Related links */}
        <div className="border-t border-slate-200 pt-8 text-sm text-slate-500 flex flex-wrap gap-4 print:hidden">
          <Link href="/privacy-policy" className="hover:text-emerald-700 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-emerald-700 transition-colors">
            Terms of Service
          </Link>
          <Link href="/districts" className="hover:text-emerald-700 transition-colors">
            District Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
