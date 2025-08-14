export const dynamic = "force-static";

import Script from "next/script";
import type { FormHTMLAttributes } from "react";

type NetlifyFormProps = FormHTMLAttributes<HTMLFormElement> & { "netlify-honeypot"?: string; "data-netlify"?: string };

export default function ClassroomPilotPage() {
  const netlifyProps: NetlifyFormProps = { "data-netlify": "true", "netlify-honeypot": "bot-field" };
  return (
    <>
      <section className="container hero" aria-labelledby="hero-title">
        <h1 id="hero-title">ClassroomPilot — Your Co-Pilot for Special Education</h1>
        <p>IEP-aligned planning, progress tracking, and reporting with less paperwork.</p>
        <div className="badges">
          <span className="badge">IEP</span>
          <span className="badge">Progress</span>
          <span className="badge">Accommodations</span>
          <span className="badge">Collaboration</span>
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
              <li>IEP goals and data scattered in multiple tools</li>
              <li>Manual progress notes slow communication</li>
              <li>Hard to turn raw data into clear reports</li>
            </ul>
          </div>
          <div className="card">
            <h3>How this helps</h3>
            <ul className="small">
              <li>Goal-aligned planning templates and checklists</li>
              <li>Quick daily/weekly progress entry from any device</li>
              <li>One-click summaries for parents and admins</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="features" className="container section">
        <h2>Key features</h2>
        <div className="grid cols-3">
          <div className="card"><h3>Plan</h3><p className="small">Turn IEP goals into teachable steps and schedules.</p></div>
          <div className="card"><h3>Track</h3><p className="small">Fast entries with time-savers for busy classrooms.</p></div>
          <div className="card"><h3>Report</h3><p className="small">Readable summaries with evidence attached.</p></div>
          <div className="card"><h3>Accommodations</h3><p className="small">Document supports and usage with timestamps.</p></div>
          <div className="card"><h3>Collaboration</h3><p className="small">Loop in paras and service providers.</p></div>
          <div className="card"><h3>Library</h3><p className="small">Reusable strategies and materials.</p></div>
        </div>
      </section>

      <section className="container section" id="waitlist">
        <h2>Join the waitlist</h2>
        <form name="waitlist" method="POST" className="form" {...netlifyProps}>
          <input type="hidden" name="form-name" value="waitlist" />
          <p hidden><label>Don’t fill this out: <input name="bot-field" /></label></p>
          <input className="input" type="email" name="email" placeholder="Work email" required />
          <input className="input" type="text" name="name" placeholder="Full name" required />
          <input className="input" type="text" name="district" placeholder="District / Organization" />
          <input className="input" type="text" name="role" placeholder="Role (Teacher, Para, Admin)" />
          <input type="hidden" name="product" value="classroompilot" />
          <button className="btn" type="submit">Request early access</button>
          <p className="note">We’ll only contact you about ClassroomPilot. Unsubscribe anytime.</p>
        </form>
      </section>

      <Script src="/assets/js/bs-landing.js" strategy="afterInteractive" />
    </>
  );
}