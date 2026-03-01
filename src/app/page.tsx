"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  BarChart3,
  Target,
  Layers,
  ClipboardList,
  FileCheck,
  CheckCircle,
  Users,
  BookOpen,
  Shield,
  GraduationCap,
} from "lucide-react";

const FREE_TOOLS = [
  {
    title: "ACT-Informed FBA + BIP Generator",
    description: "Walk through a complete ACT-informed functional behavior assessment. Generates a printable BIP with values-aligned strategies.",
    icon: Brain,
    href: "/act-fba-bip",
  },
  {
    title: "ABC Function Finder",
    description: "Enter 3–10 ABC observations and get a hypothesized behavior function with confidence score and 3 intervention starting points.",
    icon: BarChart3,
    href: "/abc-function-finder",
  },
  {
    title: "IEP Behavior Goal Writer",
    description: "Enter a target behavior and function — get 3 draft SMART IEP goals with measurable criteria, ready for your next meeting.",
    icon: Target,
    href: "/iep-goal-writer",
  },
  {
    title: "ACT Matrix Builder",
    description: "Fill in the four quadrants for any student. Get a printable matrix and 3 clinically-grounded ACT strategy recommendations.",
    icon: Layers,
    href: "/act-matrix-builder",
  },
  {
    title: "BCBA Caseload Analyzer",
    description: "Answer 8 questions about your caseload and get a personalized risk assessment with specific recommendations.",
    icon: ClipboardList,
    href: "/caseload-analyzer",
  },
  {
    title: "RBT Supervision Hours Calculator",
    description: "Track progress toward your 1,500 hours, check your supervision percentage against BACB requirements, and get a projected completion date.",
    icon: FileCheck,
    href: "/rbt-hours",
  },
];

const PRO_TOOLS = [
  { title: "FBA Builder", description: "Guided prompts, hypothesis development, and complete report draft.", access: "Pro", href: "/act-fba-bip" },
  { title: "BIP Generator", description: "Build a complete Behavior Intervention Plan from your FBA.", access: "Pro", href: "/act-fba-bip" },
  { title: "IEP Goal Writer", description: "Generate measurable, SMART behavior goals from a goal bank.", access: "Free", href: "/iep-goal-writer" },
  { title: "ABC Data Tracker", description: "Log A-B-C observations, view patterns, export for reports.", access: "Pro", href: "/abc-function-finder" },
  { title: "CEU Tracker", description: "Track credits against BACB renewal requirements with deadline reminders.", access: "Pro", href: "/transformation-program" },
  { title: "Supervision Logs", description: "BACB-aligned individual and group supervision documentation.", access: "Pro", href: "/rbt-hours" },
];

const STUDY_FEATURES = [
  { icon: Brain, label: "Adaptive Practice", description: "Questions that adapt to your weak areas so you study smarter, not longer." },
  { icon: BarChart3, label: "Performance Analytics", description: "See exactly where you stand across all BCBA task list domains." },
  { icon: CheckCircle, label: "500+ Vetted Questions", description: "Written and reviewed by practicing BCBAs." },
];

const SUPERVISE_FEATURES = [
  { icon: FileCheck, label: "BACB-Aligned Tracking", description: "Log and track supervised hours with tools built around BACB requirements." },
  { icon: ClipboardList, label: "Supervision Logs", description: "Structured documentation templates for individual and group supervision." },
  { icon: Users, label: "Supervisee Resources", description: "Materials to support your supervisees through the credentialing process." },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF3E0", color: "#1C1C1A" }}>

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#1a3d2e" }} className="pt-24 pb-20 sm:pt-32 sm:pb-28 border-b border-black/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300/80 mb-5">
            Rob Spain, BCBA, IBA &nbsp;·&nbsp; CalABA Presenter &nbsp;·&nbsp; Behavior Team Leader &nbsp;·&nbsp; AI Tool Builder
          </p>

          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#FFFFFF",
            marginBottom: "1.5rem",
          }}>
            For school BCBAs who carry a caseload<br />
            no one in the building fully understands.
          </h1>

          <p style={{
            fontSize: "16px",
            color: "#F5EDD6",
            lineHeight: 1.75,
            maxWidth: "36rem",
            margin: "0 auto 2.5rem",
          }}>
            Free tools, practical frameworks, and a community built
            for the behavior analyst who shows up for every student —
            and still drives home with paperwork unfinished.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#free-tools"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 2rem",
                backgroundColor: "#1a3d2e",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "15px",
                border: "2px solid #E8B84B",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2d5a3d")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1a3d2e")}
            >
              Try the Free Tools
            </a>
            <a
              href="/transformation-program"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                padding: "0 2rem",
                backgroundColor: "transparent",
                color: "#E8B84B",
                fontWeight: 600,
                fontSize: "15px",
                border: "1.5px solid #E8B84B",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(232,184,75,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              About the Transformation Program
            </a>
          </div>

          {/* Gold rule */}
          <div style={{
            width: "60px",
            height: "2px",
            backgroundColor: "#C8901A",
            margin: "3rem auto 0",
          }} />
        </div>
      </section>

      {/* ─── FREE TOOLS ────────────────────────────────────────────────── */}
      <section id="free-tools" style={{ backgroundColor: "#FAF3E0" }} className="pt-16 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8901A", fontWeight: 600, marginBottom: "0.75rem" }}>
              Free — No Account Required
            </p>
            <h2 style={{ fontFamily: "system-ui, sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 700, color: "#1C1C1A", marginBottom: "0.75rem" }}>
              Tools that do real clinical work
            </h2>
            <p style={{ fontSize: "16px", color: "#4A4A45", lineHeight: 1.75, maxWidth: "36rem" }}>
              Not PDFs. Not worksheets. Interactive tools built for school BCBAs — enter your data, get a usable output.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FREE_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{
                  display: "block",
                  padding: "1.5rem",
                  backgroundColor: "#FAF3E0",
                  border: "1px solid #D8D0BC",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#C8901A")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#D8D0BC")}
              >
                <div style={{ marginBottom: "0.75rem" }}>
                  <tool.icon size={18} strokeWidth={1.75} style={{ color: "#C8901A" }} />
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1C1C1A", marginBottom: "0.5rem" }}>
                  {tool.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#4A4A45", lineHeight: 1.7, marginBottom: "1rem" }}>
                  {tool.description}
                </p>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a3d2e" }}>
                  Try it free &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ──── */}
      <div style={{ borderTop: "1px solid #D8D0BC" }} />

      {/* ─── PAIN POINTS ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F0E6CE" }} className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 style={{ fontFamily: "system-ui, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1C1C1A", marginBottom: "2rem" }}>
            The job description doesn&rsquo;t capture it.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <p style={{ fontSize: "16px", color: "#4A4A45", lineHeight: 1.75 }}>
              You&rsquo;re the only BCBA in a building of hundreds. You write FBAs that take 4 hours. The BIP gets filed. The behavior continues. The teacher asks if you &ldquo;have a minute&rdquo; in the hallway.
            </p>
            <p style={{ fontSize: "16px", color: "#4A4A45", lineHeight: 1.75 }}>
              Your caseload is 22 students across two schools. You haven&rsquo;t observed three of them this month. The IEP meeting is Thursday.
            </p>
            <p style={{ fontSize: "16px", color: "#4A4A45", lineHeight: 1.75 }}>
              The science you learned in grad school works. But transferring it to a paraeducator with 15 other students and no prep period — that&rsquo;s the actual job. Nobody trained you for that part.
            </p>
          </div>

          <div style={{ width: "60px", height: "2px", backgroundColor: "#C8901A", margin: "2.5rem 0 2rem" }} />

          <p style={{ fontSize: "18px", fontWeight: 700, color: "#1C1C1A" }}>
            BehaviorSchool was built for this.
          </p>
        </div>
      </section>

      {/* ─── DIVIDER ──── */}
      <div style={{ borderTop: "1px solid #D8D0BC" }} />

      {/* ─── PRO TOOLS INDEX ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FAF3E0" }} className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8901A", fontWeight: 600, marginBottom: "0.75rem" }}>
              Platform Tools
            </p>
            <h2 style={{ fontFamily: "system-ui, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1C1C1A" }}>
              Every tool a school BCBA actually needs
            </h2>
          </div>

          <div style={{ border: "1px solid #D8D0BC", borderRadius: "8px", overflow: "hidden" }}>
            {PRO_TOOLS.map((tool, i) => (
              <div
                key={tool.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 1.25rem",
                  borderTop: i > 0 ? "1px solid #D8D0BC" : "none",
                  backgroundColor: "#FAF3E0",
                  gap: "1rem",
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, color: "#1C1C1A", fontSize: "14px", marginBottom: "2px" }}>{tool.title}</p>
                  <p style={{ fontSize: "13px", color: "#7A7A72", lineHeight: 1.5 }}>{tool.description}</p>
                </div>
                <a
                  href={tool.href}
                  style={{
                    flexShrink: 0,
                    fontSize: "12px",
                    fontWeight: 600,
                    color: tool.access === "Free" ? "#C8901A" : "#1a3d2e",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                >
                  Try Free →
                </a>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <a
              href="https://plan.behaviorschool.com/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "44px",
                padding: "0 1.5rem",
                backgroundColor: "#1a3d2e",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "14px",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2d5a3d")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1a3d2e")}
            >
              Start Free — No credit card required
            </a>
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ──── */}
      <div style={{ borderTop: "1px solid #D8D0BC" }} />

      {/* ─── STUDY SECTION ─────────────────────────────────────────────── */}
      <section id="study" style={{ backgroundColor: "#FAF3E0" }} className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8901A", fontWeight: 600, marginBottom: "0.75rem" }}>
                BCBA Exam Prep
              </p>
              <h2 style={{ fontFamily: "system-ui, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1C1C1A", marginBottom: "1rem" }}>
                Exam prep built around how BCBAs actually learn
              </h2>
              <p style={{ fontSize: "16px", color: "#4A4A45", lineHeight: 1.75, marginBottom: "1.75rem" }}>
                Adaptive practice tests that identify your weak spots, analytics that show exactly what to study next, and 500+ vetted questions written by practicing BCBAs.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.75rem" }}>
                {STUDY_FEATURES.map((f) => (
                  <div key={f.label} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <f.icon size={16} strokeWidth={1.75} style={{ color: "#C8901A", marginTop: "3px", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 600, color: "#1C1C1A", fontSize: "14px" }}>{f.label}</p>
                      <p style={{ fontSize: "13px", color: "#4A4A45", lineHeight: 1.6 }}>{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://study.behaviorschool.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "44px",
                  padding: "0 1.5rem",
                  backgroundColor: "#1a3d2e",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "14px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  gap: "0.5rem",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2d5a3d")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1a3d2e")}
              >
                Start Free Mock Exam <ArrowRight size={14} />
              </a>
            </div>

            {/* Practice question mock */}
            <div style={{ border: "1px solid #D8D0BC", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ backgroundColor: "#1a3d2e", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "14px" }}>Practice Question</p>
                  <p style={{ color: "#E8B84B", fontSize: "12px" }}>Behavior Measurement — Question 12 of 40</p>
                </div>
                <span style={{ backgroundColor: "rgba(232,184,75,0.15)", color: "#E8B84B", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px" }}>Adaptive</span>
              </div>
              <div style={{ padding: "1.25rem", backgroundColor: "#FAF3E0" }}>
                <p style={{ fontSize: "14px", color: "#1C1C1A", lineHeight: 1.7, marginBottom: "1rem" }}>
                  A behavior analyst records the number of times a student raises their hand during a 30-minute class period. This is an example of which measurement dimension?
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    { label: "A. Duration", correct: false },
                    { label: "B. Latency", correct: false },
                    { label: "C. Frequency", correct: true },
                    { label: "D. Magnitude", correct: false },
                  ].map((opt) => (
                    <div
                      key={opt.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "5px",
                        border: opt.correct ? "1px solid #1a3d2e" : "1px solid #D8D0BC",
                        backgroundColor: opt.correct ? "#E8F0EC" : "transparent",
                        fontSize: "13px",
                        color: opt.correct ? "#1a3d2e" : "#4A4A45",
                        fontWeight: opt.correct ? 600 : 400,
                      }}
                    >
                      <span>{opt.label}</span>
                      {opt.correct && <CheckCircle size={14} style={{ color: "#1a3d2e" }} />}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #D8D0BC", fontSize: "12px", color: "#7A7A72" }}>
                  <span>Domain: Behavior Measurement</span>
                  <span style={{ color: "#1a3d2e", fontWeight: 600 }}>Correct</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ──── */}
      <div style={{ borderTop: "1px solid #D8D0BC" }} />

      {/* ─── SUPERVISE SECTION ─────────────────────────────────────────── */}
      <section id="supervise" style={{ backgroundColor: "#FAF3E0" }} className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Supervision log mock */}
            <div style={{ border: "1px solid #D8D0BC", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ backgroundColor: "#1a3d2e", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "14px" }}>Supervision Log</p>
                  <p style={{ color: "#E8B84B", fontSize: "12px" }}>Week of Feb 24, 2026</p>
                </div>
                <span style={{ backgroundColor: "rgba(232,184,75,0.15)", color: "#E8B84B", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px" }}>BACB Aligned</span>
              </div>
              <div style={{ padding: "1.25rem", backgroundColor: "#FAF3E0" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { supervisee: "Jordan M., RBT Trainee", type: "Individual", hours: "1.5 hrs", topic: "Skill acquisition programming", date: "Mon, Feb 24" },
                    { supervisee: "Alex T., RBT Trainee", type: "Group", hours: "1.0 hr", topic: "Data collection and graphing", date: "Tue, Feb 25" },
                    { supervisee: "Sam R., RBT Trainee", type: "Individual", hours: "2.0 hrs", topic: "Behavior intervention plan review", date: "Thu, Feb 27" },
                  ].map((entry) => (
                    <div key={entry.supervisee} style={{ padding: "0.75rem", border: "1px solid #D8D0BC", borderRadius: "6px", backgroundColor: "#F0E6CE" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#1C1C1A" }}>{entry.supervisee}</p>
                        <span style={{ fontSize: "10px", fontWeight: 600, color: "#1a3d2e", border: "1px solid #D8D0BC", padding: "1px 6px", borderRadius: "3px" }}>{entry.type}</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "#4A4A45" }}>{entry.topic}</p>
                      <div style={{ display: "flex", gap: "1rem", marginTop: "4px", fontSize: "11px", color: "#7A7A72" }}>
                        <span>{entry.date}</span>
                        <span style={{ fontWeight: 600, color: "#1a3d2e" }}>{entry.hours}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #D8D0BC", fontSize: "12px", color: "#7A7A72" }}>
                  <span>Total hours logged: <strong style={{ color: "#1C1C1A" }}>4.5 / 5.0</strong> this week</span>
                  <span style={{ color: "#C8901A", fontWeight: 600 }}>On Track</span>
                </div>
              </div>
            </div>

            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8901A", fontWeight: 600, marginBottom: "0.75rem" }}>
                For BCBAs
              </p>
              <h2 style={{ fontFamily: "system-ui, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1C1C1A", marginBottom: "1rem" }}>
                Supervision tools built for the real world
              </h2>
              <p style={{ fontSize: "16px", color: "#4A4A45", lineHeight: 1.75, marginBottom: "1.75rem" }}>
                Supervision is one of the most important — and most under-supported — parts of being a BCBA. These tools make the administrative side manageable so you can focus on developing your supervisees.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.75rem" }}>
                {SUPERVISE_FEATURES.map((f) => (
                  <div key={f.label} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <f.icon size={16} strokeWidth={1.75} style={{ color: "#C8901A", marginTop: "3px", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 600, color: "#1C1C1A", fontSize: "14px" }}>{f.label}</p>
                      <p style={{ fontSize: "13px", color: "#4A4A45", lineHeight: 1.6 }}>{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://supervision.behaviorschool.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "44px",
                  padding: "0 1.5rem",
                  backgroundColor: "#1a3d2e",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "14px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  gap: "0.5rem",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2d5a3d")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1a3d2e")}
              >
                Explore Supervision Tools <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ──── */}
      <div style={{ borderTop: "1px solid #D8D0BC" }} />

      {/* ─── TRANSFORMATION PROGRAM CTA ────────────────────────────────── */}
      <section style={{ backgroundColor: "#FAF3E0" }} className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8901A", fontWeight: 600, marginBottom: "0.75rem" }}>
            The Transformation Program
          </p>
          <h2 style={{ fontFamily: "system-ui, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1C1C1A", marginBottom: "1rem" }}>
            A structured path for school BCBAs who want to work differently.
          </h2>
          <p style={{ fontSize: "16px", color: "#4A4A45", lineHeight: 1.75, marginBottom: "2rem" }}>
            Not a course. Not a certification. A focused six-month program built around the real constraints of school-based practice — caseload pressure, system resistance, and the gap between what you learned and what the job actually demands.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="/transformation-program"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "44px",
                padding: "0 1.5rem",
                backgroundColor: "#1a3d2e",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "14px",
                borderRadius: "6px",
                textDecoration: "none",
                gap: "0.5rem",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2d5a3d")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1a3d2e")}
            >
              Learn More <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ──── */}
      <div style={{ borderTop: "1px solid #D8D0BC" }} />

      {/* ─── NEWSLETTER ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#1a3d2e" }} className="py-16 sm:py-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#E8B84B", fontWeight: 600, marginBottom: "0.75rem" }}>
            Weekly for School BCBAs
          </p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem" }}>
            Practical tools. Real frameworks. No filler.
          </h2>
          <p style={{ fontSize: "15px", color: "#F5EDD6", lineHeight: 1.75, marginBottom: "2rem" }}>
            One email a week. Written by Rob Spain, BCBA. For school-based behavior analysts doing the actual work.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}
          >
            <input
              type="email"
              placeholder="Your email address"
              required
              style={{
                height: "44px",
                padding: "0 1rem",
                fontSize: "14px",
                border: "1px solid rgba(248,243,224,0.3)",
                borderRadius: "6px",
                backgroundColor: "rgba(255,255,255,0.07)",
                color: "#FFFFFF",
                minWidth: "220px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                height: "44px",
                padding: "0 1.25rem",
                backgroundColor: "#C8901A",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "14px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <div className="sr-only">
        <h2>About Behavior School</h2>
        <p>
          BehaviorSchool is the platform for school-based BCBAs and behavior analysts. Free tools, practical frameworks, a community, and the Transformation Program — all built for school-based practice.
        </p>
      </div>
    </div>
  );
}
