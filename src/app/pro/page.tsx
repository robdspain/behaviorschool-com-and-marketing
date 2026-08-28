import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BookOpen,
  ClipboardCheck,
  FileText,
  Lock,
  ShieldCheck,
  Target,
} from "lucide-react";

const plannedTools = [
  {
    icon: FileText,
    title: "FBA-to-BIP drafting",
    description:
      "Planned workflow for turning functional assessment data into editable behavior intervention plan drafts.",
  },
  {
    icon: Target,
    title: "IEP goal generation",
    description:
      "Planned tools for building measurable school behavior goals from student-specific context and baseline data.",
  },
  {
    icon: BookOpen,
    title: "Goal bank and exports",
    description:
      "Planned searchable goal library and export paths for district documentation workflows.",
  },
  {
    icon: ClipboardCheck,
    title: "Student plan workspace",
    description:
      "Planned workspace for organizing FBA, BIP, and IEP artifacts without relying on disconnected files.",
  },
];

export default function ProPage() {
  return (
    <main className="min-h-screen bg-white text-[#17211f]">
      <section className="border-b border-[#1f4d3f]/10 bg-[#f7f5f0]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:px-12 lg:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#1f4d3f]/20 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1f4d3f]">
              <Lock className="h-4 w-4" aria-hidden="true" /> Invite only
            </div>
            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
              School FBA and BIP work, organized in one workspace.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#59645f] sm:text-xl">
              BehaviorSchool Pro is an invite-only commercial workspace in development for school
              FBA and BIP drafting, IEP goals, and student plan exports. Public account creation
              is not available, and the product is not open for general use today.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pro/waitlist"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#1f4d3f] px-6 py-3 font-bold text-white transition-colors hover:bg-[#123628] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f4d3f]"
              >
                Request invite-only access <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/free-tools"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#1f4d3f]/25 bg-white px-6 py-3 font-bold text-[#1f4d3f] transition-colors hover:bg-[#f2eee6]"
              >
                Use free school tools today
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#e4b63d]/20 blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-[#1f4d3f]/15 bg-white p-3 shadow-[0_24px_70px_rgba(31,77,63,0.16)]">
              <div className="flex items-center justify-between border-b border-[#1f4d3f]/10 px-3 pb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#1f4d3f]">
                <span>BehaviorSchool Pro</span>
                <span className="inline-flex items-center gap-1 bg-[#f5eedc] px-2 py-1 text-[#80621d]">
                  <Bell className="h-3.5 w-3.5" aria-hidden="true" /> Concept preview
                </span>
              </div>
              <div className="mt-3 space-y-3 rounded-[1rem] bg-[#edf2ee] p-4">
                <div className="rounded-lg border border-[#1f4d3f]/10 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f4d3f]">
                    Planned workspace areas
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-[#59645f]">
                    <li>FBA intake and hypothesis review</li>
                    <li>BIP drafting and export</li>
                    <li>IEP goal generation</li>
                    <li>Student plan records</li>
                  </ul>
                </div>
                <p className="text-xs leading-5 text-[#59645f]">
                  This preview shows planned product areas only. BehaviorSchool Pro is not a live
                  product people can use today without an invitation.
                </p>
              </div>
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
              These are planned areas of development, not currently available product features.
              Details may change as the invite-only workspace is built and reviewed.
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
            <h2 className="text-2xl font-semibold">Use the free tools that are live today</h2>
            <p className="mt-3 leading-7 text-[#59645f]">
              Until BehaviorSchool Pro opens by invitation, use the free Goal Writing System, FBA
              helpers, and other school-practice tools already available on BehaviorSchool.com.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-[#1f4d3f] hover:text-[#123628]"
            >
              Explore the BehaviorSchool suite <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
