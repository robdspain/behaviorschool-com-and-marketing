import Image from "next/image";
import Link from "next/link";
import { Bell, ClipboardCheck, GraduationCap, Lock, Target, UsersRound } from "lucide-react";
import { TRANSFORMATION_PROGRAM } from "@/lib/transformation-program";

const studyDomains = ["Measurement", "Experimental Design", "Behavior Assessment", "Ethics"];

export function ProductsSuiteHero() {
  return (
    <div
      className="relative hidden min-h-[470px] lg:block"
      aria-label="BehaviorSchool product interface previews"
    >
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-3">
        <div className="col-span-7 row-span-4 overflow-hidden border border-white/20 bg-[#102820] shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Image
                src="/behavior-study-tools-icon.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-md object-cover"
                aria-hidden="true"
              />
              <div>
                <p className="text-[11px] font-semibold text-white">Behavior Study Tools</p>
                <p className="text-[9px] uppercase tracking-[0.14em] text-white/55">Live product preview</p>
              </div>
            </div>
            <span className="bg-[#e4b63d]/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#f3d56a]">
              Available now
            </span>
          </div>
          <div className="grid gap-3 p-3 sm:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-md border border-white/10 bg-white/5 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/55">
                Readiness overview
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-[6px] border-white/15 bg-[#0d2b23]">
                  <GraduationCap className="h-5 w-5 text-[#e4b63d]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">See your next study step</p>
                  <p className="mt-1 text-[10px] leading-4 text-white/60">
                    Domain review unlocks after practice sessions.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-md border border-white/10 bg-white p-3">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#51645d]">
                  Domain review
                </p>
                <p className="text-[9px] font-semibold text-[#1f4d3f]">After practice</p>
              </div>
              <div className="mt-3 space-y-2">
                {studyDomains.map((label) => (
                  <div key={label}>
                    <div className="flex justify-between text-[10px] font-medium text-[#263b34]">
                      <span>{label}</span>
                      <span className="text-[#8b6c1f]">Review</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-[#edf5f0]">
                      <div className="h-1.5 w-1/3 rounded-full bg-[#1f4d3f]/35" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5 row-span-3 overflow-hidden border border-white/20 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
          <div className="flex items-center justify-between border-b border-[#173f33]/10 bg-[#f4f2ec] px-3 py-2">
            <div className="flex items-center gap-2 text-[#173f33]">
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                Goal Writing System
              </span>
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1f6b50]">
              Free tool
            </span>
          </div>
          <div className="space-y-2 p-3">
            <div className="flex gap-1">
              {["Student", "Baseline", "Measurement", "Review"].map((step, index) => (
                <span
                  key={step}
                  className={`flex-1 border px-1 py-1 text-center text-[8px] font-semibold uppercase tracking-[0.08em] ${
                    index === 2
                      ? "border-[#1f4d3f] bg-[#edf5f0] text-[#1f4d3f]"
                      : "border-[#173f33]/12 bg-white text-[#51645d]"
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
            <div className="rounded-md border border-[#173f33]/12 bg-[#f8f7f3] p-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8b6c1f]">
                Live draft
              </p>
              <p className="mt-2 text-[10px] leading-4 text-[#263b34]">
                Given teacher observation and a behavior tracking sheet, the student will increase on-task
                behavior to 80% of intervals across selected settings for 5 consecutive school days.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9px] text-[#51645d]">
              <div className="rounded border border-[#173f33]/10 bg-white px-2 py-1.5">
                <span className="font-semibold text-[#173f33]">Baseline</span>
                <p className="mt-0.5">40% intervals</p>
              </div>
              <div className="rounded border border-[#173f33]/10 bg-white px-2 py-1.5">
                <span className="font-semibold text-[#173f33]">Mastery</span>
                <p className="mt-0.5">80% for 5 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5 row-span-3 overflow-hidden border border-[#e4b63d]/35 bg-[#123628] shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e4b63d]">
              Transformation Program
            </p>
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/70">
              Live cohort
            </span>
          </div>
          <div className="space-y-2.5 p-3">
            <p className="text-sm font-semibold leading-snug text-white">
              {TRANSFORMATION_PROGRAM.name}
            </p>
            <p className="text-[10px] leading-4 text-white/65">
              {TRANSFORMATION_PROGRAM.cohort.dateRange} · {TRANSFORMATION_PROGRAM.cohort.sessionTime}
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {TRANSFORMATION_PROGRAM.cohort.sessionDates.slice(0, 3).map((date) => (
                <span
                  key={date}
                  className="border border-white/15 bg-white/5 px-1.5 py-1 text-center text-[9px] font-semibold text-white/80"
                >
                  {date}
                </span>
              ))}
            </div>
            <p className="text-lg font-semibold text-[#e4b63d]">
              {TRANSFORMATION_PROGRAM.pricing.payInFull}
            </p>
            <Link
              href="/transformation-program"
              className="inline-flex w-full items-center justify-center bg-[#e4b63d] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#123628] transition-colors hover:bg-[#d7aa32]"
            >
              View program details
            </Link>
          </div>
        </div>

        <div className="col-span-4 row-span-2 overflow-hidden border border-white/15 bg-[#0a2019]/85 opacity-80">
          <div className="flex h-full flex-col justify-between p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-white/75">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/70">
                <Bell className="h-3 w-3" aria-hidden="true" /> Invite only
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white">BehaviorSchool Pro</p>
              <p className="mt-1 text-[9px] leading-4 text-white/55">
                FBA/BIP workspace in development. Public accounts are not available.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-3 row-span-2 overflow-hidden border border-white/15 bg-[#0a2019]/85 opacity-80">
          <div className="flex h-full flex-col justify-between p-3">
            <div className="flex items-center justify-between">
              <UsersRound className="h-3.5 w-3.5 text-white/75" aria-hidden="true" />
              <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/70">
                <Bell className="h-3 w-3" aria-hidden="true" /> Invite only
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white">Supervision Workspace</p>
              <p className="mt-1 text-[9px] leading-4 text-white/55">
                Fieldwork documentation preview only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
