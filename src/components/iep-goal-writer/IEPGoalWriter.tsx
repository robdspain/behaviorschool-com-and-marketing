"use client";

import { useState } from "react";

type BehaviorFunction = "attention" | "escape" | "tangible" | "sensory";
type GradeLevel = "prek-k" | "1-3" | "4-5" | "6-8" | "9-12";

interface GoalOutput {
  goal1: string;
  goal2: string;
  goal3: string;
}

const FUNCTION_LABELS: Record<BehaviorFunction, string> = {
  attention: "Attention",
  escape: "Escape / Avoidance",
  tangible: "Tangible / Access",
  sensory: "Sensory / Automatic",
};

const REPLACEMENT_BEHAVIORS: Record<BehaviorFunction, string> = {
  attention: "raise hand and wait to be called on",
  escape: "request a break using an appropriate signal",
  tangible: "use a visual schedule or wait card to delay access",
  sensory: "use an appropriate sensory tool or fidget during transitions",
};

const DATA_TYPES: Record<BehaviorFunction, string> = {
  attention: "frequency count",
  escape: "frequency count and duration",
  tangible: "frequency count",
  sensory: "frequency count and interval data",
};

const ANTECEDENTS: Record<BehaviorFunction, string> = {
  attention: "adult attention is directed elsewhere",
  escape: "presented with a non-preferred task or demand",
  tangible: "preferred item or activity is unavailable",
  sensory: "during transitions or unstructured periods",
};

function generateGoals(
  behavior: string,
  fn: BehaviorFunction,
  grade: GradeLevel,
  baseline: string
): GoalOutput {
  const replacement = REPLACEMENT_BEHAVIORS[fn];
  const dataType = DATA_TYPES[fn];
  const antecedent = ANTECEDENTS[fn];
  const baselineText = baseline ? `a baseline of ${baseline}` : "current baseline levels";
  const targetReduction = baseline ? "50% or fewer occurrences" : "a meaningful reduction";

  const settings: Record<GradeLevel, string> = {
    "prek-k": "classroom and structured play settings",
    "1-3": "classroom and small group settings",
    "4-5": "general education and resource settings",
    "6-8": "core academic classrooms",
    "9-12": "all academic and elective settings",
  };
  const setting = settings[grade];

  const reviewers: Record<BehaviorFunction, string> = {
    attention: "classroom teacher and BCBA",
    escape: "special education teacher and BCBA",
    tangible: "classroom staff and BCBA",
    sensory: "BCBA and school psychologist",
  };
  const reviewer = reviewers[fn];

  return {
    goal1: `The student will decrease ${behavior} from ${baselineText} to ${targetReduction} per day, as measured by frequency data collected by the ${reviewer} across 4 consecutive weeks, in ${setting}.`,
    goal2: `The student will independently ${replacement} in ${setting} when ${antecedent}, as measured by ${dataType} collected by the classroom teacher, with 80% accuracy across 3 consecutive observation sessions.`,
    goal3: `The student will demonstrate ${replacement} across 2 or more settings and staff members, as measured by ${dataType} submitted by at least 2 data collectors, with 75% accuracy by the next annual IEP review date.`,
  };
}

export default function IEPGoalWriter() {
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("6-8");
  const [targetBehavior, setTargetBehavior] = useState("");
  const [behaviorFunction, setBehaviorFunction] = useState<BehaviorFunction>("escape");
  const [baseline, setBaseline] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [goals, setGoals] = useState<GoalOutput | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBehavior.trim()) return;
    setShowEmailGate(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const generated = generateGoals(targetBehavior, behaviorFunction, gradeLevel, baseline);
      await fetch("/api/tool-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          tool: "iep-goal-writer",
          data: { gradeLevel, targetBehavior, behaviorFunction, baseline },
        }),
      });
      setGoals(generated);
      setShowEmailGate(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (showEmailGate) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a4731" strokeWidth="2" style={{ display: "inline-block" }}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1a3a2a", marginBottom: 8 }}>
            Your IEP goals are ready.
          </h2>
          <p style={{ color: "#555" }}>
            Enter your email to view 3 draft SMART behavior goals for your student.
          </p>
        </div>
        <form onSubmit={handleEmailSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email Address (required)</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Your Name (optional)</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
          </div>
          {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
          <button type="submit" disabled={submitting} style={{ ...primaryBtn, width: "100%" }}>
            {submitting ? "Generating..." : "View My IEP Goals →"}
          </button>
          <p style={{ textAlign: "center", color: "#888", fontSize: "0.8rem", marginTop: 12 }}>
            No spam. Unsubscribe anytime.
          </p>
          <button type="button" onClick={() => setShowEmailGate(false)} style={{ display: "block", margin: "8px auto 0", background: "none", border: "none", color: "#888", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}>
            Back
          </button>
        </form>
      </div>
    );
  }

  if (goals) {
    const goalItems = [
      { num: 1, title: "Behavior Reduction", text: goals.goal1 },
      { num: 2, title: "Replacement Behavior", text: goals.goal2 },
      { num: 3, title: "Generalization", text: goals.goal3 },
    ];

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1a3a2a", margin: 0 }}>
              3 Draft SMART IEP Behavior Goals
            </h2>
            <p style={{ color: "#555", margin: "4px 0 0", fontSize: "0.9rem" }}>
              {targetBehavior} · {FUNCTION_LABELS[behaviorFunction]} function · {gradeLabel(gradeLevel)}
            </p>
          </div>
          <button onClick={() => window.print()} style={secondaryBtn}>Print Goals</button>
        </div>

        <div style={{ background: "#fff8e7", border: "1px solid #fcd34d", borderRadius: 8, padding: "14px 18px", marginBottom: 24, fontSize: "0.9rem", color: "#78350f" }}>
          <strong>Note:</strong> These are starting drafts. Adjust baselines, settings, and criteria to match your specific student data and IEP team decisions.
        </div>

        {goalItems.map((g) => (
          <div key={g.num} style={{ background: "#f9f9f6", border: "1px solid #e0e0d8", borderRadius: 10, padding: "24px", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ background: "#1a4731", color: "white", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>
                {g.num}
              </div>
              <div style={{ fontWeight: 700, color: "#1a3a2a", fontSize: "1rem" }}>
                GOAL {g.num} — {g.title}
              </div>
            </div>
            <p style={{ margin: 0, lineHeight: 1.8, color: "#333", fontSize: "0.95rem", paddingLeft: 44 }}>
              {g.text}
            </p>
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: 24, marginBottom: 16 }}>
          <button
            onClick={() => { setGoals(null); setShowEmailGate(false); setEmail(""); setName(""); }}
            style={secondaryBtn}
          >
            Write Goals for Another Student
          </button>
        </div>

        {/* CTA */}
        <div style={{ background: "#1a3a2a", color: "white", borderRadius: 12, padding: "32px", marginTop: 40, textAlign: "center" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>
            Want to build behavior-based IEP goals systematically, with FBAs that actually drive BIP design?
          </h3>
          <p style={{ color: "#a7d4b8", marginBottom: 24, fontSize: "0.95rem" }}>
            The School BCBA Transformation Program cohort starts March 26. Early bird through March 21.
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

  // Input form
  return (
    <form onSubmit={handleGenerate}>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Student Grade Level</label>
        <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value as GradeLevel)} style={inputStyle}>
          <option value="prek-k">Pre-K / Kindergarten</option>
          <option value="1-3">Grades 1–3</option>
          <option value="4-5">Grades 4–5</option>
          <option value="6-8">Grades 6–8</option>
          <option value="9-12">Grades 9–12</option>
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Target Behavior (describe specifically)</label>
        <input
          type="text"
          required
          value={targetBehavior}
          onChange={(e) => setTargetBehavior(e.target.value)}
          placeholder="e.g., leaving assigned area without permission"
          style={inputStyle}
        />
        <p style={{ color: "#888", fontSize: "0.8rem", marginTop: 4 }}>Be specific — avoid vague labels like &quot;aggression.&quot; Describe the observable behavior.</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Behavior Function (from FBA)</label>
        <select value={behaviorFunction} onChange={(e) => setBehaviorFunction(e.target.value as BehaviorFunction)} style={inputStyle}>
          <option value="attention">Attention</option>
          <option value="escape">Escape / Avoidance</option>
          <option value="tangible">Tangible / Access</option>
          <option value="sensory">Sensory / Automatic</option>
        </select>
      </div>

      <div style={{ marginBottom: 32 }}>
        <label style={labelStyle}>Current Baseline Rate (optional)</label>
        <input
          type="text"
          value={baseline}
          onChange={(e) => setBaseline(e.target.value)}
          placeholder="e.g., 4–6 times per day, or 3 incidents per week"
          style={inputStyle}
        />
        <p style={{ color: "#888", fontSize: "0.8rem", marginTop: 4 }}>If unknown, leave blank and we&apos;ll use placeholder language.</p>
      </div>

      <button type="submit" style={primaryBtn}>
        Generate IEP Goals →
      </button>
    </form>
  );
}

function gradeLabel(g: GradeLevel) {
  const map: Record<GradeLevel, string> = {
    "prek-k": "Pre-K / Kindergarten",
    "1-3": "Grades 1–3",
    "4-5": "Grades 4–5",
    "6-8": "Grades 6–8",
    "9-12": "Grades 9–12",
  };
  return map[g];
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

const secondaryBtn: React.CSSProperties = {
  background: "white",
  color: "#1a4731",
  border: "2px solid #1a4731",
  padding: "11px 24px",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
};
