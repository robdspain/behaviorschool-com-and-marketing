"use client";

import { useState } from "react";

interface Question {
  id: number;
  text: string;
  options: { label: string; score: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How many students are currently on your active caseload?",
    options: [
      { label: "Under 10", score: 0 },
      { label: "10–15", score: 1 },
      { label: "16–20", score: 2 },
      { label: "21–30", score: 3 },
      { label: "Over 30", score: 3 },
    ],
  },
  {
    id: 2,
    text: "How many of your students have a current, active BIP?",
    options: [
      { label: "All of them", score: 0 },
      { label: "Most (75%+)", score: 1 },
      { label: "About half", score: 2 },
      { label: "Less than half", score: 3 },
      { label: "None have BIPs", score: 3 },
    ],
  },
  {
    id: 3,
    text: "How often do you collect direct observation data on your highest-need students?",
    options: [
      { label: "Daily", score: 0 },
      { label: "2–3x per week", score: 1 },
      { label: "Weekly", score: 2 },
      { label: "Monthly or less", score: 3 },
      { label: "Rarely", score: 3 },
    ],
  },
  {
    id: 4,
    text: "How many of your students have behaviors that are escalating or not responding to current BIPs?",
    options: [
      { label: "None", score: 0 },
      { label: "1–2", score: 1 },
      { label: "3–5", score: 2 },
      { label: "More than 5", score: 3 },
    ],
  },
  {
    id: 5,
    text: "How much time per week do you have for RBT/staff training and coaching?",
    options: [
      { label: "5+ hours", score: 0 },
      { label: "3–4 hours", score: 1 },
      { label: "1–2 hours", score: 2 },
      { label: "Less than 1 hour", score: 3 },
      { label: "No dedicated time", score: 3 },
    ],
  },
  {
    id: 6,
    text: "Do you have a structured system for tracking FBA completion, BIP review dates, and data collection?",
    options: [
      { label: "Yes, fully systematic", score: 0 },
      { label: "Partially", score: 1 },
      { label: "Mostly informal", score: 2 },
      { label: "No system", score: 3 },
    ],
  },
  {
    id: 7,
    text: "How often do you feel you have adequate time to complete quality FBAs (not just checklists)?",
    options: [
      { label: "Always", score: 0 },
      { label: "Usually", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Rarely", score: 2 },
      { label: "Never", score: 3 },
    ],
  },
  {
    id: 8,
    text: "What is your primary role at your school/district?",
    options: [
      { label: "Solo BCBA at one school", score: 1 },
      { label: "BCBA serving multiple schools", score: 2 },
      { label: "Lead BCBA with a team", score: 1 },
      { label: "District-level consultant", score: 2 },
      { label: "Private practice", score: 0 },
      { label: "Other", score: 1 },
    ],
  },
];

function getScoreLevel(total: number) {
  if (total <= 6) return "low";
  if (total <= 13) return "moderate";
  if (total <= 18) return "high";
  return "critical";
}

const SCORE_CONFIG = {
  low: {
    label: "Low Stress",
    color: "#166534",
    bg: "#f0fdf4",
    border: "#86efac",
    headline: "Your caseload appears manageable.",
    summary:
      "Your data suggests a relatively healthy caseload structure. The key now is protecting and systematizing what's working.",
  },
  moderate: {
    label: "Moderate Stress",
    color: "#854d0e",
    bg: "#fefce8",
    border: "#fde047",
    headline: "Some risk factors identified.",
    summary:
      "There are a few areas where your caseload shows strain. Addressing these proactively will prevent them from becoming crises.",
  },
  high: {
    label: "High Stress",
    color: "#9a3412",
    bg: "#fff7ed",
    border: "#fdba74",
    headline: "Your caseload shows significant stress indicators.",
    summary:
      "Multiple risk factors are present. Without intervention, quality of service and your own wellbeing are at risk.",
  },
  critical: {
    label: "Critical Overload",
    color: "#991b1b",
    bg: "#fef2f2",
    border: "#fca5a5",
    headline: "Critical caseload overload detected.",
    summary:
      "Your caseload is operating in crisis mode. Immediate action is needed to protect your students and your professional sustainability.",
  },
};

function getRecommendations(answers: number[]): string[] {
  const recs: string[] = [];
  const [caseload, bips, dataFreq, escalating, trainingTime, system, fbaTime] = answers;

  if (bips >= 2) {
    recs.push(
      "Priority: Complete or update FBAs for your 3 highest-need students. Without a current FBA, BIPs are unlikely to reduce behavior."
    );
  }
  if (dataFreq >= 2) {
    recs.push(
      "Increase data collection frequency for escalating students. Even a simple 5-minute frequency tally by the classroom teacher can restore progress visibility."
    );
  }
  if (system >= 2) {
    recs.push(
      "Implement a caseload tracking system — even a simple spreadsheet with FBA dates, BIP review dates, and last observation date per student will reduce cognitive load significantly."
    );
  }
  if (trainingTime >= 2) {
    recs.push(
      "Schedule protected coaching time with your highest-need staff. Even 30 minutes per week of structured feedback is more effective than ad-hoc check-ins."
    );
  }
  if (escalating >= 2) {
    recs.push(
      "For escalating students: request a formal FBA meeting and update the BIP with new hypotheses. Doing more of a failing plan is not the answer."
    );
  }
  if (caseload >= 2 && fbaTime >= 2) {
    recs.push(
      "Advocate to administration for caseload reduction or additional support. Document your capacity concerns in writing — this protects you professionally and creates a paper trail."
    );
  }

  if (recs.length === 0) {
    recs.push(
      "Maintain your current systems. Schedule a quarterly caseload review to catch early warning signs before they escalate."
    );
    recs.push(
      "Consider mentoring newer BCBAs or building peer consultation structures to continue growing professionally."
    );
  }

  return recs.slice(0, 4);
}

export default function CaseloadAnalyzer() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [roleLabel, setRoleLabel] = useState("");

  // Email gate
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (idx: number) => {
    setSelectedOption(idx);
    if (currentQ === 7) {
      setRoleLabel(QUESTIONS[7].options[idx].label);
    }
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const score = QUESTIONS[currentQ].options[selectedOption].score;
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowEmailGate(true);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const total = answers.reduce((a, b) => a + b, 0);
      await fetch("/api/tool-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          tool: "caseload-analyzer",
          data: { score: total, level: getScoreLevel(total), role: roleLabel, answers },
        }),
      });
      setShowResults(true);
      setShowEmailGate(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const total = answers.reduce((a, b) => a + b, 0);
  const level = getScoreLevel(total);
  const config = SCORE_CONFIG[level];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  // Results view
  if (showResults) {
    const recs = getRecommendations(answers);
    return (
      <div>
        {/* Score card */}
        <div style={{ background: config.bg, border: `2px solid ${config.border}`, borderRadius: 12, padding: "28px 32px", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ background: config.color, color: "white", padding: "6px 16px", borderRadius: 20, fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
              {config.label}
            </div>
            <div style={{ fontWeight: 800, fontSize: "1.8rem", color: config.color }}>
              {total} / 24
            </div>
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: config.color, marginBottom: 8 }}>
            {config.headline}
          </h2>
          <p style={{ color: "#444", margin: 0, lineHeight: 1.7 }}>{config.summary}</p>
        </div>

        {/* Recommendations */}
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a3a2a", marginBottom: 16 }}>
          Personalized Recommendations
        </h3>
        {recs.map((rec, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, background: "#f9f9f6", border: "1px solid #e0e0d8", borderRadius: 8, padding: "16px 20px" }}>
            <div style={{ background: "#1a4731", color: "white", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0, marginTop: 2 }}>
              {i + 1}
            </div>
            <p style={{ margin: 0, color: "#333", lineHeight: 1.7 }}>{rec}</p>
          </div>
        ))}

        {/* CTA */}
        <div style={{ background: "#1a3a2a", color: "white", borderRadius: 12, padding: "32px", marginTop: 40, textAlign: "center" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>
            The School BCBA Transformation Program addresses all of these systematically.
          </h3>
          <p style={{ color: "#a7d4b8", marginBottom: 8, fontSize: "0.95rem" }}>
            Cohort starts March 26. Early bird pricing available through March 21.
          </p>
          <p style={{ color: "#a7d4b8", marginBottom: 24, fontSize: "0.9rem" }}>
            6 sessions · Thursdays 6–8 PM Pacific · Maximum 20 participants · $2,499 early bird
          </p>
          <a
            href="/transformation-program"
            style={{ display: "inline-block", background: "#c8a84b", color: "#1a1a1a", padding: "14px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "1rem" }}
          >
            Learn More →
          </a>
        </div>
      </div>
    );
  }

  // Email gate
  if (showEmailGate) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#1a4731" strokeWidth="2" style={{ display: "inline-block" }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1a3a2a", marginBottom: 8 }}>
            Your caseload analysis is ready.
          </h2>
          <p style={{ color: "#555" }}>
            Enter your email to see your caseload health score and personalized recommendations.
          </p>
        </div>

        <form onSubmit={handleEmailSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email Address (required)</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Your Name (optional)</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Your Role</label>
            <input type="text" value={roleLabel} readOnly style={{ ...inputStyle, background: "#f5f5f0", color: "#555" }} />
          </div>
          {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
          <button type="submit" disabled={submitting} style={{ ...primaryBtn, width: "100%" }}>
            {submitting ? "Loading..." : "View My Results →"}
          </button>
          <p style={{ textAlign: "center", color: "#888", fontSize: "0.8rem", marginTop: 12 }}>
            No spam. Unsubscribe anytime.
          </p>
        </form>
      </div>
    );
  }

  // Quiz view
  const q = QUESTIONS[currentQ];
  return (
    <div>
      {/* Progress bar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: "0.85rem", color: "#555", fontWeight: 600 }}>
            Question {currentQ + 1} of {QUESTIONS.length}
          </span>
          <span style={{ fontSize: "0.85rem", color: "#555" }}>
            {Math.round(progress)}% complete
          </span>
        </div>
        <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3 }}>
          <div style={{ height: "100%", background: "#1a4731", borderRadius: 3, width: `${progress}%`, transition: "width 0.3s ease" }} />
        </div>
      </div>

      {/* Question */}
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1a3a2a", marginBottom: 24, lineHeight: 1.4 }}>
        {q.text}
      </h2>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionSelect(idx)}
            style={{
              padding: "14px 20px",
              border: selectedOption === idx ? "2px solid #1a4731" : "2px solid #e0e0d8",
              borderRadius: 8,
              background: selectedOption === idx ? "#e8f5ee" : "white",
              textAlign: "left",
              cursor: "pointer",
              fontWeight: selectedOption === idx ? 600 : 400,
              color: selectedOption === idx ? "#1a3a2a" : "#333",
              fontSize: "0.95rem",
              transition: "all 0.15s ease",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={selectedOption === null}
        style={{ ...primaryBtn, opacity: selectedOption === null ? 0.5 : 1, cursor: selectedOption === null ? "not-allowed" : "pointer" }}
      >
        {currentQ === QUESTIONS.length - 1 ? "See My Results →" : "Next →"}
      </button>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginBottom: 6,
  color: "#1a3a2a",
  fontSize: "0.9rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #ccc",
  borderRadius: 6,
  fontSize: "1rem",
  background: "white",
  boxSizing: "border-box",
};

const primaryBtn: React.CSSProperties = {
  background: "#1a4731",
  color: "white",
  border: "none",
  padding: "12px 28px",
  borderRadius: 8,
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};
