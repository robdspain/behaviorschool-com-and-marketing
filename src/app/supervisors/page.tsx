import Link from "next/link";
import {
  ArrowRight,
  Bell,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  ShieldCheck,
  Users,
} from "lucide-react";

const plannedTools = [
  {
    icon: Clock3,
    title: "Fieldwork organization",
    description: "Planned tools for organizing fieldwork entries, documentation, and review status in one workspace.",
  },
  {
    icon: FileCheck2,
    title: "Documentation workflow",
    description: "A planned workflow for preparing records for supervisor review and maintaining required documentation.",
  },
  {
    icon: ClipboardCheck,
    title: "Competency review",
    description: "Planned ways for supervisors and supervisees to organize competency discussions, notes, and next steps.",
  },
  {
    icon: Users,
    title: "Shared supervision workspace",
    description: "A planned view for coordinating supervision activity without relying on disconnected spreadsheets and files.",
  },
];

export default function SupervisorsPage() {
  return (
    <main className="min-h-screen bg-white text-[#17211f]">
      <section className="border-b border-[#1f4d3f]/10 bg-[#f7f5f0]">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:px-12">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border border-[#1f4d3f]/20 bg-white px-3 py-2 text-xs font-bold uppercase text-[#1f4d3f]">
              <Bell className="h-4 w-4" aria-hidden="true" /> Coming soon
            </div>
            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
              Supervision tools for school-based behavior analysts.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#59645f] sm:text-xl">
              BehaviorSchool is developing a shared workspace for supervisors and supervisees to organize fieldwork documentation, review progress, and prepare required records. The platform is not yet available for account creation or hour tracking.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:rob@behaviorschool.com?subject=Supervision%20tools%20launch%20updates"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#1f4d3f] px-6 py-3 font-bold text-white transition-colors hover:bg-[#163a30] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f4d3f]"
              >
                Request launch updates <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center border border-[#1f4d3f]/30 px-6 py-3 font-bold text-[#1f4d3f] transition-colors hover:bg-[#1f4d3f]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f4d3f]"
              >
                Contact BehaviorSchool
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase text-[#1f4d3f]">In development</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">What the team is planning</h2>
            <p className="mt-5 text-lg leading-8 text-[#59645f]">
              These are planned areas of development, not currently available product features. Details may change as the platform is built and reviewed.
            </p>
          </div>

          <div className="mt-12 grid border-l border-t border-[#1f4d3f]/15 sm:grid-cols-2">
            {plannedTools.map(({ icon: Icon, title, description }) => (
              <article key={title} className="min-h-56 border-b border-r border-[#1f4d3f]/15 p-7 sm:p-9">
                <Icon className="h-7 w-7 text-[#1f4d3f]" strokeWidth={1.7} aria-hidden="true" />
                <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-[#59645f]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#1f4d3f]/15 bg-[#eef3f0] py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-start lg:px-12">
          <ShieldCheck className="h-8 w-8 shrink-0 text-[#1f4d3f]" strokeWidth={1.7} aria-hidden="true" />
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold">Continue using your current approved process</h2>
            <p className="mt-3 leading-7 text-[#59645f]">
              Until the platform launches, supervisors and supervisees should continue using current BACB requirements, official forms, and their organization&apos;s approved documentation and record-retention procedures.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
