import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, CalendarDays, CheckCircle2, ExternalLink, UserRound } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "BACB Authorized Continuing Education Provider | Behavior School",
  description:
    "Behavior School LLC is a BACB Authorized Continuing Education Provider, provider number OP-26-12729.",
  canonical: "https://behaviorschool.com/bacb-ace-provider",
});

export default function BacbAceProviderPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Behavior School LLC",
    url: "https://behaviorschool.com",
    logo: "https://behaviorschool.com/BACB-ACE/BACB_ACE-Logo-New.png",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "BACB Authorized Continuing Education Provider",
      credentialCategory: "Continuing Education Provider",
      identifier: "OP-26-12729",
      recognizedBy: {
        "@type": "Organization",
        name: "Behavior Analyst Certification Board",
        url: "https://www.bacb.com/",
      },
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "BACB ACE Provider" }]} className="mb-8" />
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
                <Award className="mr-2 h-4 w-4" aria-hidden="true" />
                BACB Authorized Continuing Education Provider
              </div>
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                BACB Authorized Continuing Education Provider
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                Behavior School LLC is authorized to provide BACB continuing education
                opportunities for behavior analysts and other professionals.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                  <Link href="/ceus">
                    View CEU options
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="https://www.bacb.com/services/o.php?page=101135" target="_blank" rel="noopener noreferrer">
                    BACB provider registry
                    <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex justify-center">
                <Image
                  src="/BACB-ACE/BACB_ACE-Logo-New.png"
                  alt="BACB Authorized Continuing Education Provider Logo - Behavior School"
                  width={220}
                  height={220}
                  priority
                />
              </div>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-700" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-slate-950">Provider</dt>
                    <dd className="text-slate-700">Behavior School LLC</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 flex-none text-emerald-700" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-slate-950">ACE Provider Number</dt>
                    <dd className="text-slate-700">OP-26-12729</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 flex-none text-emerald-700" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-slate-950">Renewal Date</dt>
                    <dd className="text-slate-700">June 30, 2027</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserRound className="mt-0.5 h-5 w-5 flex-none text-emerald-700" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-slate-950">ACE Coordinator</dt>
                    <dd className="text-slate-700">Rob Spain, M.S., BCBA, IBA</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Continuing education for behavior analysts
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Behavior School develops professional development and continuing education
              experiences focused on practical, school-based behavior analysis, supervision,
              assessment, and ethical service delivery.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Course listings identify available continuing education credit, completion
              requirements, and documentation details for each learning opportunity.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">Provider details</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>Provider type: Organization</li>
              <li>Provider name: Behavior School LLC</li>
              <li>Provider number: OP-26-12729</li>
              <li>Renewal date: June 30, 2027</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
