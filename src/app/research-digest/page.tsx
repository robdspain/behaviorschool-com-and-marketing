import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  FlaskConical,
  Users,
  FileText,
  Brain,
  CheckCircle2,
  ArrowRight,
  Microscope,
  ClipboardList,
  GraduationCap,
  Lightbulb,
  Target,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'ABA Research Digest for School BCBAs | BehaviorSchool',
  description: 'A free weekly email summarizing peer-reviewed behavior analytic research — written for BCBAs working in K–12 schools. No jargon. Just the science you can use Monday morning.',
  robots: 'noindex',
}

const SAMPLE_PAPERS = [
  {
    journal: 'Journal of Applied Behavior Analysis',
    year: '2024',
    title: 'Neurodiversity-Affirming Applied Behavior Analysis',
    summary: 'Researchers outline a framework for delivering ABA services that centers autistic perspectives, reduces aversive procedures, and aligns behavioral goals with the client\'s own values — directly applicable to school-based IEP goal writing.',
    tag: 'Ethics & Practice',
    tagColor: '#1f4d3f',
    oa: true,
  },
  {
    journal: 'Behavior Analysis in Practice',
    year: '2022',
    title: 'Evaluating an ACT-Based Brief Intervention for Educators',
    summary: 'A short ACT intervention reduced burnout and increased psychological flexibility in special education teachers. Implications for BCBA-led staff training and reducing paraprofessional turnover in school settings.',
    tag: 'Staff Training',
    tagColor: '#7a3b1e',
    oa: true,
  },
  {
    journal: 'Journal of Applied Behavior Analysis',
    year: '2021',
    title: 'Acceptance and Commitment Training in Applied Behavior Analysis: Where Are We Now?',
    summary: 'A comprehensive overview of ACT components being integrated into ABA — acceptance, defusion, values, committed action. Useful for BCBAs writing ACT-informed BIPs or training staff on values-based approaches.',
    tag: 'ACT / Values',
    tagColor: '#2c5f8a',
    oa: true,
  },
  {
    journal: 'Behavior Analysis in Practice',
    year: '2020',
    title: 'Taking ACTion: 18 Simple Strategies for Supporting Children',
    summary: 'Practical ACT strategies BCBAs can embed directly into school-based intervention without requiring extensive ACT training. Includes scripts and visual supports ready for classroom use.',
    tag: 'Intervention',
    tagColor: '#1f4d3f',
    oa: true,
  },
  {
    journal: 'Journal of Applied Behavior Analysis',
    year: '2021',
    title: 'Ongoing, Explicit, and Direct Functional Assessment is a Necessary Component of Function-Based Intervention',
    summary: 'Argues that FBAs should be living documents updated continuously — not one-time assessments. Critical reading for school BCBAs navigating district pressure to rush the assessment process.',
    tag: 'FBA / Assessment',
    tagColor: '#5a2d82',
    oa: true,
  },
]

const TOPICS = [
  {
    icon: ClipboardList,
    title: 'FBA & Assessment',
    desc: 'New findings on functional analysis methodology, indirect assessment tools, and assessment validity in school settings.',
  },
  {
    icon: FileText,
    title: 'BIP Design & Behavior Reduction',
    desc: 'Evidence on function-based interventions, antecedent strategies, and reinforcement-based alternatives to punishment.',
  },
  {
    icon: Brain,
    title: 'ACT & Values-Based Practice',
    desc: 'Acceptance, defusion, psychological flexibility, and how contextual behavioral science applies to school ABA.',
  },
  {
    icon: Users,
    title: 'Staff Training & Supervision',
    desc: 'Research on RBT training, BST effectiveness, caregiver training, and reducing paraprofessional turnover.',
  },
  {
    icon: GraduationCap,
    title: 'IEP Goals & Academic Behavior',
    desc: 'Skill acquisition research — verbal behavior, reading, math, and executive functioning in learners with disabilities.',
  },
  {
    icon: Target,
    title: 'Ethics, Equity & Neurodiversity',
    desc: 'Evolving practice standards, cultural responsiveness, neurodiversity-affirming approaches, and professional ethics.',
  },
  {
    icon: Microscope,
    title: 'PBIS & Tier 2/3 Supports',
    desc: 'Systems-level behavior support, Check-In Check-Out, social skills groups, and school-wide data practices.',
  },
  {
    icon: Lightbulb,
    title: 'Burnout & Practitioner Wellbeing',
    desc: 'Research on compassion fatigue, ACT-based interventions for school staff, and sustainable caseload management.',
  },
]

export default function ResearchDigestPage() {
  return (
    <main style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#111', background: '#fff' }}>

      {/* Hero */}
      <section style={{ background: '#1f4d3f', padding: '72px 24px 64px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e4b63d' }}>
            BehaviorSchool &mdash; Free Weekly Email
          </p>
          <h1 style={{ margin: '0 0 20px', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#fff', lineHeight: 1.15 }}>
            The ABA Research Digest<br />for School BCBAs
          </h1>
          <p style={{ margin: '0 0 36px', fontSize: 17, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            Every Monday morning: 5 peer-reviewed behavior analytic studies — summarized in plain language so you can stay current without spending your weekend reading abstracts.
          </p>

          {/* Signup form */}
          <form
            action="https://api.resend.com/audiences/subscriptions"
            method="POST"
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <input type="hidden" name="audience_id" value={process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID || ''} />
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              style={{
                flex: '1 1 240px',
                maxWidth: 320,
                padding: '13px 16px',
                fontSize: 15,
                border: 'none',
                borderRadius: 6,
                outline: 'none',
                color: '#111',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '13px 24px',
                fontSize: 15,
                fontWeight: 700,
                background: '#e4b63d',
                color: '#1f4d3f',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Subscribe Free
            </button>
          </form>
          <p style={{ margin: '14px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            Free. No spam. Unsubscribe any time.
          </p>
        </div>
      </section>

      {/* What's inside */}
      <section style={{ padding: '64px 24px', background: '#f8f8f6' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>What you get</p>
          <h2 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 800, color: '#111' }}>
            Research that actually applies to your job
          </h2>
          <p style={{ margin: '0 0 40px', fontSize: 16, color: '#555', lineHeight: 1.7 }}>
            Most ABA journals publish dozens of articles a month. Most of them aren&apos;t relevant to a BCBA working in a K–12 building. We filter for school-relevant research across 8 topic areas — then pick the 5 most relevant — summarized in 2–3 sentences each. Total read time: under 3 minutes.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {TOPICS.map((t) => {
              const Icon = t.icon
              return (
                <div key={t.title} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: '20px 22px', display: 'flex', gap: 14 }}>
                  <div style={{ flexShrink: 0, width: 36, height: 36, background: '#f0f5f2', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color="#1f4d3f" />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#111' }}>{t.title}</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.6 }}>{t.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sample issue */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>Sample issue</p>
          <h2 style={{ margin: '0 0 32px', fontSize: 28, fontWeight: 800, color: '#111' }}>
            What a Monday morning looks like
          </h2>

          {/* Email mockup */}
          <div style={{ border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            {/* Email header */}
            <div style={{ background: '#1f4d3f', padding: '22px 28px' }}>
              <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e4b63d' }}>BehaviorSchool</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>ABA Research Digest</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Issue #12 &nbsp;&middot;&nbsp; March 10, 2026 &nbsp;&middot;&nbsp; 5 papers</p>
            </div>

            {/* Papers */}
            <div style={{ padding: '0 28px' }}>
              {SAMPLE_PAPERS.map((paper, i) => (
                <div key={i} style={{ padding: '20px 0', borderBottom: i < SAMPLE_PAPERS.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888' }}>
                      {paper.journal}
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 3,
                      background: paper.tagColor,
                      color: '#fff',
                      whiteSpace: 'nowrap',
                    }}>
                      {paper.tag}
                    </span>
                    {paper.oa && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: '#e8f2ed', color: '#1f4d3f' }}>
                        FREE PDF
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: '#111', lineHeight: 1.4 }}>{paper.title}</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#444', lineHeight: 1.65 }}>{paper.summary}</p>
                </div>
              ))}
            </div>

            {/* CTA in email */}
            <div style={{ background: '#f9f9f9', borderTop: '1px solid #eee', padding: '20px 28px' }}>
              <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#333' }}>Put this research to work</p>
              <p style={{ margin: '0 0 14px', fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                BehaviorSchool Pro includes AI-assisted FBA/BIP drafting, ACT-informed goal generation, and session transcription — grounded in the same research you just read.
              </p>
              <span style={{ display: 'inline-block', background: '#1f4d3f', color: '#fff', fontSize: 12, fontWeight: 700, padding: '9px 18px', borderRadius: 5 }}>
                Try BehaviorSchool Pro Free &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why this exists */}
      <section style={{ padding: '64px 24px', background: '#f8f8f6' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 26, fontWeight: 800, color: '#111' }}>
            Built for school BCBAs specifically
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: 16, color: '#444', lineHeight: 1.75 }}>
            Most research digests are written for clinicians in home-based ABA or private practice. School BCBAs deal with IEPs, PBIS teams, paraprofessionals, district mandates, and caseloads that would make most clinic BCBAs sweat. The research that matters to you is different.
          </p>
          <p style={{ margin: '0 0 32px', fontSize: 16, color: '#444', lineHeight: 1.75 }}>
            This digest filters specifically for studies relevant to K–12 settings — assessment in school contexts, staff training with educational paraprofessionals, ACT-based approaches for both students and practitioners, and the ethical tensions BCBAs navigate inside school systems every day.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Pulls from JABA, BAP, JEIBI, Behavioral Interventions, and more',
              'Summarized in plain language — no abstract-ese',
              'Links to free PDFs when available',
              'Filtered for school-based relevance — not clinic or home ABA',
              'Sent Monday morning, ready before your first IEP meeting',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="#1f4d3f" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, fontSize: 15, color: '#333' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <BookOpen size={36} color="#1f4d3f" style={{ marginBottom: 16 }} />
          <h2 style={{ margin: '0 0 16px', fontSize: 28, fontWeight: 800, color: '#111' }}>
            Start your Monday with the science
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: 16, color: '#555', lineHeight: 1.7 }}>
            Free. No credit card. No pitch. Just peer-reviewed research summarized for the reality of working in a K–12 building.
          </p>

          <form
            action="https://api.resend.com/audiences/subscriptions"
            method="POST"
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <input type="hidden" name="audience_id" value={process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID || ''} />
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              style={{
                flex: '1 1 240px',
                maxWidth: 300,
                padding: '13px 16px',
                fontSize: 15,
                border: '1.5px solid #ddd',
                borderRadius: 6,
                outline: 'none',
                color: '#111',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '13px 24px',
                fontSize: 15,
                fontWeight: 700,
                background: '#1f4d3f',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Subscribe Free
            </button>
          </form>
          <p style={{ margin: '14px 0 0', fontSize: 12, color: '#aaa' }}>
            Unsubscribe any time. We never sell your email.
          </p>
        </div>
      </section>

    </main>
  )
}
