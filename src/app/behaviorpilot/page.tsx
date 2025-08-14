"use client";

import Script from "next/script";

export const dynamic = "force-static";

export default function BehaviorPilotPage() {
  return (
    <>
      <main>
        <section className="container hero" aria-labelledby="hero-title">
          <h1 id="hero-title">BehaviorPilot — The Behavior Analyst OS for Schools</h1>
          <p>From FBA to BIP to progress monitoring — centralized, fast, and AI-assisted.</p>
          <div className="badges">
            <span className="badge">FBA</span>
            <span className="badge">BIP</span>
            <span className="badge">Progress Monitoring</span>
            <span className="badge">Fidelity</span>
            <span className="badge">FERPA/HIPAA aware</span>
          </div>
          <div className="cta">
            <a className="btn" href="#waitlist">Join the waitlist</a>
            <a className="btn secondary" href="#features">See features</a>
          </div>
        </section>

        <section className="container section">
          <div className="grid cols-2">
            <div className="card">
              <h3>Current problems</h3>
              <ul className="small">
                <li>FBAs and BIPs scattered across docs, drives, and email</li>
                <li>Manual data collection slows decisions</li>
                <li>Graphing and reporting chew up planning time</li>
                <li>Team fidelity is hard to track</li>
              </ul>
            </div>
            <div className="card">
              <h3>How this helps</h3>
              <ul className="small">
                <li>AI-assisted FBA builder that captures precursors and functions</li>
                <li>District-ready BIP templates with goals and strategies</li>
                <li>Mobile-friendly data capture with instant charts</li>
                <li>Automated reports and fidelity checklists</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className="container section">
          <h2>Key features</h2>
          <div className="grid cols-3">
            <div className="card"><h3>Assess (FBA)</h3><p className="small">Guided FBA flow with prompts; exportable summaries.</p></div>
            <div className="card"><h3>Plan (BIP)</h3><p className="small">Editable templates aligned to school workflows.</p></div>
            <div className="card"><h3>Collect</h3><p className="small">ABC, frequency, duration, interval data — on any device.</p></div>
            <div className="card"><h3>Monitor</h3><p className="small">Auto-graphs, alerts, and goal progress.</p></div>
            <div className="card"><h3>Fidelity</h3><p className="small">Implementation checks and coaching notes.</p></div>
            <div className="card"><h3>Report</h3><p className="small">Parent-friendly and board-ready exports.</p></div>
          </div>
        </section>

        <section className="container section">
          <h2>Who it&apos;s for</h2>
          <div className="grid cols-3">
            <div className="card"><h3>BCBAs</h3><p className="small">Cut paperwork; focus on analysis and coaching.</p></div>
            <div className="card"><h3>School Psychologists</h3><p className="small">Coordinate assessment and plans with ease.</p></div>
            <div className="card"><h3>Admins</h3><p className="small">Visibility into supports and outcomes across campuses.</p></div>
          </div>
        </section>

        <section className="container section" id="waitlist">
          <h2>Join the waitlist</h2>
          <form name="waitlist" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" className="form">
            <input type="hidden" name="form-name" value="waitlist" />
            <p hidden><label>Don’t fill this out: <input name="bot-field" /></label></p>
            <input className="input" type="email" name="email" placeholder="Work email" required />
            <input className="input" type="text" name="name" placeholder="Full name" required />
            <input className="input" type="text" name="district" placeholder="District / Organization" />
            <input className="input" type="text" name="role" placeholder="Role (BCBA, SPED, Admin)" />
            <input type="hidden" name="product" value="behaviorpilot" />
            <button className="btn" type="submit">Request early access</button>
            <p className="note">We’ll only contact you about BehaviorPilot. Unsubscribe anytime.</p>
          </form>
        </section>
      </main>

      <Script src="/assets/js/bs-landing.js" strategy="afterInteractive" />
    </>
  );
}