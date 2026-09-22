import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck,
  GraduationCap,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const LEARNING_URL = "https://learning.behaviorschool.com";

const learningBenefits = [
  {
    title: "Live and on-demand CEUs",
    description:
      "Enroll in live cohorts or on-demand learning built for school BCBAs, then complete verified continuing education requirements in one place.",
    icon: BookOpen,
  },
  {
    title: "Certificates in your account",
    description:
      "CEU certificates stay available in your Behavior School Learning account after you complete a course.",
    icon: Award,
  },
  {
    title: "ACE completion records",
    description:
      "Learning keeps required objectives, instructor evidence, disclosures, and completion records with the course.",
    icon: FileCheck,
  },
  {
    title: "School-focused professional development",
    description:
      "Continuing education built for school BCBAs, with professional development focused on school practice.",
    icon: GraduationCap,
  },
];

const trustItems = [
  { icon: Award, label: "BACB ACE Provider OP-26-12729" },
  { icon: GraduationCap, label: "School-focused CEUs" },
  { icon: Clock, label: "Live and on-demand learning" },
  { icon: Users, label: "Built by a school BCBA" },
];

export default function CEUsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "BCBA CEUs and Professional Development",
    url: "https://behaviorschool.com/ceus",
    description:
      "Earn BCBA CEUs and school-focused professional development on Behavior School Learning.",
    isPartOf: {
      "@type": "WebSite",
      name: "Behavior School",
      url: "https://behaviorschool.com",
    },
    about: {
      "@type": "EducationalOrganization",
      name: "Behavior School Learning",
      url: LEARNING_URL,
      description:
        "Continuing education and CEU certificate platform for behavior analysts.",
      parentOrganization: {
        "@type": "Organization",
        name: "Behavior School",
        url: "https://behaviorschool.com",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "CEUs & Professional Development" }]} />
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-6 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-800">
            Behavior School Learning
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            CEUs &amp; Professional Development{" "}
            <span className="text-emerald-700">for BCBAs</span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-xl text-slate-600">
            Behavior School Learning is the place for BCBA CEUs, continuing
            education, and certificates for school-based behavior analysts. Enroll
            in live or on-demand courses, complete verified CEU requirements, and
            keep every certificate in one account.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={LEARNING_URL}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-800"
            >
              Go to Behavior School Learning
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href={LEARNING_URL}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-emerald-200 bg-white px-8 py-4 text-lg font-semibold text-emerald-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              Browse CEU courses
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-8 px-4 text-center">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-slate-600">
              <item.icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              What you get on Behavior School Learning
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Continuing education built for school BCBAs: live cohorts, on-demand
              learning, verified completion, and certificates you can keep.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {learningBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <benefit.icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">
                  {benefit.title}
                </h3>
                <p className="leading-relaxed text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={LEARNING_URL}
              className="inline-flex items-center text-lg font-semibold text-emerald-800 hover:text-emerald-900"
            >
              Browse current CEU courses
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            Related Behavior School path
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-slate-600">
            Learning is the CEU platform. The Transformation Program is an
            optional live cohort, not the main continuing education catalog.
          </p>

          <div className="mx-auto max-w-xl">
            <Link
              href="/transformation-program"
              className="group block rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-lg"
            >
              <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-emerald-800">
                School BCBA Transformation Program
              </h3>
              <p className="mb-6 leading-relaxed text-slate-600">
                A live cohort for school BCBAs who want repeatable systems for
                assessment, intervention, and staff implementation. Continuing
                education details are listed with the program.
              </p>
              <span className="inline-flex items-center font-semibold text-emerald-800 group-hover:translate-x-1">
                View program
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">
            BACB Authorized Continuing Education
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
            Behavior School LLC is a BACB Authorized Continuing Education
            Provider. Course listings on Learning identify available credit,
            completion requirements, and documentation for each opportunity.
          </p>
          <ul className="mx-auto mb-8 max-w-xl space-y-3 text-left text-slate-700">
            {[
              "Provider: Behavior School LLC",
              "ACE Provider Number: OP-26-12729",
              "Coordinator: Rob Spain, M.S., BCBA, IBA",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 flex-none text-emerald-700"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/bacb-ace-provider"
            className="inline-flex items-center font-semibold text-emerald-800 hover:text-emerald-900"
          >
            View ACE provider details
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="bg-emerald-800 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Start earning CEUs on Behavior School Learning
          </h2>
          <p className="mb-8 text-xl text-emerald-100">
            Browse live and on-demand continuing education, then keep your
            certificates in one Learning account.
          </p>
          <Link
            href={LEARNING_URL}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-emerald-800 shadow-lg transition-colors hover:bg-emerald-50"
          >
            Go to Behavior School Learning
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
