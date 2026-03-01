"use client";

import { useState } from "react";

type GradeLevel = "prek-k" | "1-3" | "4-5" | "6-8" | "9-12";
type Challenge =
  | "Task refusal"
  | "Verbal aggression"
  | "Physical aggression"
  | "Elopement"
  | "Self-injurious behavior"
  | "Social withdrawal"
  | "Other";

interface MatrixData {
  outerToward: string;
  outerAway: string;
  innerToward: string;
  innerAway: string;
}

const STRATEGIES: Record<string, { title: string; description: string }[]> = {
  "9-12": [
    {
      title: "Behavioral Contrast Mapping",
      description:
        "On a single sheet, draw two columns: 'What I do when I let [Away thought] drive' and 'What I do when I act on what matters.' Have the student populate both from their own matrix. Then ask: 'Which column describes the student you're trying to become?' This externalization creates distance from fused self-stories without requiring the student to believe anything different — only to observe the contrast.",
    },
    {
      title: "Committed Action With a Reversal Test",
      description:
        "Identify one specific Toward behavior from the matrix. Have the student commit to it for one week with a data card they keep (not the teacher). After the week, review: did the Away feeling get easier, harder, or the same? The point is not that the feeling disappears — it's that the student discovers they can act on values regardless of the feeling. Document the result as part of the ACT analysis.",
    },
    {
      title: "Private Events as Setting Events",
      description:
        "Review the student's Inner+Away quadrant and identify which private events (thoughts, feelings, memories) most reliably precede their target behavior. Reframe these as setting events in the FBA — not causes, but conditions that alter the value of escape or attention. Teach the student to track: 'What was I thinking/feeling in the 5 minutes before?' Add this to the ABC data sheet as an additional column.",
    },
  ],
  "6-8": [
    {
      title: "The Two-Choice Write-Up",
      description:
        "Give the student two index cards. On Card A, they write what happens when they do their Away behavior — short-term and long-term. On Card B, they write what happens when they do a Toward behavior instead. No judgment, just outcomes. The student keeps both cards. This works because it bypasses resistance to being told what to do — the student writes the analysis themselves. Review weekly and update as the student's perspective changes.",
    },
    {
      title: "Function-to-Values Bridge",
      description:
        "Take the function identified in the FBA (e.g., escape from academic demands) and connect it explicitly to the student's values. Say: 'So the behavior gets you out of the assignment — and your value is being seen as capable. How does leaving the assignment help with that?' This is not rhetorical. The student often hasn't made this connection. The goal is to surface the contradiction between the function of the behavior and what the student actually cares about.",
    },
    {
      title: "Flexibility Practice Log",
      description:
        "Create a simple daily log the student fills out at the end of class: 'Situation where I felt like doing [Away behavior]: ___ / What I actually did: ___ / Did I move toward [value] or away from it? ___' This is not a behavior chart and should not be shared with parents or used for points. It's a self-monitoring ACT tool. Review it together weekly. Over time it builds the habit of noticing the choice point between feeling and action.",
    },
  ],
  "4-5": [
    {
      title: "The Choice Point Card",
      description:
        "Create a laminated 4x6 card the student keeps at their desk. One side shows a simple diagram: Situation → Feeling/Thought → [two arrows] → Away move OR Toward move. The student identifies their own examples for each box. When they reach a choice point, they physically touch the card. This externalizes the decision process and creates a brief pause — the pause is where flexibility happens. Replace the card when the student's examples change.",
    },
    {
      title: "Classroom Values Interview",
      description:
        "Ask the student three questions and write down their exact words: 'What kind of student do you want your teacher to think you are? What kind of friend do you want to be in this class? What would you want to be better at by the end of the year?' Use their exact language on the values side of their matrix — not adult translations. When the target behavior occurs, reference their words specifically: 'You said you want to be [their word]. Is this move getting you there?'",
    },
    {
      title: "Stuck vs. Moving Check-In",
      description:
        "At the start or end of each day, the student rates two things on a 1-3 scale: 'How stuck did I feel today?' and 'How much did I move toward what I care about?' These two numbers are not correlated on purpose — the student can feel very stuck AND still make Toward moves. This directly teaches that discomfort tolerance and values-based action are separate from each other. Track over 2-3 weeks and show the student their own data.",
    },
  ],
  "1-3": [
    {
      title: "The Two Paths Picture",
      description:
        "Draw a simple fork in the road. Label one path with the student's Away behavior and where it leads (e.g., 'yell → go to office → miss recess'). Label the other with a Toward behavior and where it leads (e.g., 'ask for help → finish work → play with friends'). Use the student's exact words and situations. Post it at their desk or in their folder. Before a known difficult moment, point to the picture and ask: 'Which path?' This replaces verbal prompting with a visual that the student helped create.",
    },
    {
      title: "My Important Job",
      description:
        "Give the student a specific classroom job that connects directly to one of their values. If they care about being helpful, they're the 'supply manager.' If they care about being fair, they're the 'turn-keeper.' The job is not a reward — it's a Toward behavior built into the daily structure. When the target behavior occurs near the job time, redirect: 'Your class needs you to do your job.' This creates a values-relevant competing response without requiring the student to discuss their feelings.",
    },
    {
      title: "The Feelings-First, Then-Second Rule",
      description:
        "Teach the student one rule: feelings can visit, but they don't get to drive. Practice with low-stakes examples first: 'You feel like staying in from recess, but recess matters to you — so you go anyway.' Build up to the target behavior's antecedent situation. The student practices saying: 'I feel [X], and I'm going to [Toward behavior] anyway.' Repeat daily for at least two weeks before expecting generalization.",
    },
  ],
  "prek-k": [
    {
      title: "The Feelings Visitor",
      description:
        "Introduce feelings as visitors who come to the classroom but don't live there. When a big feeling arrives: 'Oh, Angry is visiting. Angry wants you to push. But you're the boss of your body — not Angry.' Make a simple picture book together using the student's name as the main character. The student is always the protagonist who gets to choose what happens next. Read it together before known difficult transitions.",
    },
    {
      title: "My Toward Job",
      description:
        "Identify one specific Toward behavior from the matrix that the student already does sometimes. Name it as their job: 'Your job is to ask for help with words.' Spend one week only reinforcing that job — not reducing the Away behavior directly. Post a picture of the job at eye level. When the Away behavior starts, prompt the job, not the absence of behavior. This approach is based on differential reinforcement of alternative behavior but framed in values-consistent language the teacher can use naturally.",
    },
    {
      title: "The Day Picture",
      description:
        "Create a picture schedule where each transition includes a 'toward' picture next to it — not just what happens next, but what the student cares about at that time. If the student values having a snack with friends, the snack picture is next to the difficult transition that precedes it. This makes the values-behavior connection visible in the environment rather than requiring the student to generate it internally.",
    },
  ],
};

function getStrategies(grade: GradeLevel) {
  return STRATEGIES[grade] ?? STRATEGIES["prek-k"];
}

export default function ACTMatrixBuilder() {
  const [step, setStep] = useState(1);
  const [studentName, setStudentName] = useState("");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("6-8");
  const [challenge, setChallenge] = useState<Challenge>("Task refusal");
  const [matrix, setMatrix] = useState<MatrixData>({
    outerToward: "",
    outerAway: "",
    innerToward: "",
    innerAway: "",
  });
  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError("");
    try {
      await fetch("/api/tool-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: contactName,
          tool: "act-matrix-builder",
          data: { studentName, gradeLevel, challenge, matrix },
        }),
      });
      setStep(4);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const strategies = getStrategies(gradeLevel);

  return (
    <div className="act-matrix-tool">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
          .act-matrix-tool { max-width: 100% !important; padding: 0 !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* Step 1: Student Info */}
      {step === 1 && (
        <div className="no-print" style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a2a", marginBottom: 8 }}>
            Step 1: Student Information
          </h2>
          <p style={{ color: "#555", marginBottom: 28 }}>
            Tell us a bit about the student you&apos;re building this matrix for.
          </p>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Student First Name (optional)</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g., Alex"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Grade Level</label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
              style={inputStyle}
            >
              <option value="prek-k">Pre-K / Kindergarten</option>
              <option value="1-3">Grades 1–3</option>
              <option value="4-5">Grades 4–5</option>
              <option value="6-8">Grades 6–8</option>
              <option value="9-12">Grades 9–12</option>
            </select>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={labelStyle}>Primary Challenge Behavior</label>
            <select
              value={challenge}
              onChange={(e) => setChallenge(e.target.value as Challenge)}
              style={inputStyle}
            >
              <option>Task refusal</option>
              <option>Verbal aggression</option>
              <option>Physical aggression</option>
              <option>Elopement</option>
              <option>Self-injurious behavior</option>
              <option>Social withdrawal</option>
              <option>Other</option>
            </select>
          </div>

          <button onClick={() => setStep(2)} style={primaryBtn}>
            Continue to Matrix →
          </button>
        </div>
      )}

      {/* Step 2: Fill the Matrix */}
      {step === 2 && (
        <div className="no-print">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a2a", marginBottom: 8 }}>
            Step 2: Fill the ACT Matrix
          </h2>
          <p style={{ color: "#555", marginBottom: 24 }}>
            Complete all four quadrants for{" "}
            <strong>{studentName || "your student"}</strong>
            {" "}({challenge}).
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "2px solid #1a3a2a", borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
            {/* Header row */}
            <div style={{ background: "#1a3a2a", color: "white", padding: "10px 16px", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
              Toward What Matters
            </div>
            <div style={{ background: "#1a3a2a", color: "white", padding: "10px 16px", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center", borderLeft: "1px solid #2d5a3d" }}>
              Away from Discomfort
            </div>

            {/* Outer row */}
            <div style={{ background: "#f0fdf4", padding: "16px", borderTop: "1px solid #bbf7d0" }}>
              <div style={quadrantLabel}>Outer (Doing)</div>
              <textarea
                value={matrix.outerToward}
                onChange={(e) => setMatrix({ ...matrix, outerToward: e.target.value })}
                placeholder="e.g., Helps classmates, Participates when confident, Asks questions in small groups"
                style={textareaStyle}
                rows={4}
              />
            </div>
            <div style={{ background: "#fff7ed", padding: "16px", borderTop: "1px solid #fed7aa", borderLeft: "1px solid #e5e5e5" }}>
              <div style={{ ...quadrantLabel, color: "#7c3d0f" }}>Outer (Doing) — Target Behavior</div>
              <textarea
                value={matrix.outerAway}
                onChange={(e) => setMatrix({ ...matrix, outerAway: e.target.value })}
                placeholder="e.g., Refuses tasks, Disrupts class, Leaves the room"
                style={{ ...textareaStyle, borderColor: "#fed7aa" }}
                rows={4}
              />
            </div>

            {/* Divider */}
            <div style={{ gridColumn: "1 / -1", height: 1, background: "#e5e5e5" }} />

            {/* Inner row */}
            <div style={{ background: "#f0f7f4", padding: "16px" }}>
              <div style={{ ...quadrantLabel, color: "#1a4731" }}>Inner (Feeling/Thinking)</div>
              <textarea
                value={matrix.innerToward}
                onChange={(e) => setMatrix({ ...matrix, innerToward: e.target.value })}
                placeholder="e.g., Being seen as smart, Having friends, Being good at sports"
                style={{ ...textareaStyle, borderColor: "#a7d4b8" }}
                rows={4}
              />
            </div>
            <div style={{ background: "#fefce8", padding: "16px", borderLeft: "1px solid #e5e5e5" }}>
              <div style={{ ...quadrantLabel, color: "#854d0e" }}>Inner (Feeling/Thinking)</div>
              <textarea
                value={matrix.innerAway}
                onChange={(e) => setMatrix({ ...matrix, innerAway: e.target.value })}
                placeholder="e.g., Feeling stupid, Fear of failing, Embarrassment in front of peers"
                style={{ ...textareaStyle, borderColor: "#fde68a" }}
                rows={4}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(1)} style={secondaryBtn}>
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!matrix.outerAway && !matrix.innerToward}
              style={primaryBtn}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Email Gate */}
      {step === 3 && (
        <div className="no-print" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a4731" strokeWidth="2" style={{ display: "inline-block" }}>
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a2a", marginBottom: 8 }}>
              Your ACT Matrix is ready to view and print
            </h2>
            <p style={{ color: "#555" }}>
              Enter your email to unlock your completed matrix and 3 ACT strategy recommendations.
            </p>
          </div>

          <form onSubmit={handleEmailSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email Address (required)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Your Name (optional)</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your name"
                style={inputStyle}
              />
            </div>
            {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
            <button type="submit" disabled={submitting} style={{ ...primaryBtn, width: "100%" }}>
              {submitting ? "Loading..." : "View Matrix + Strategies →"}
            </button>
            <p style={{ textAlign: "center", color: "#888", fontSize: "0.8rem", marginTop: 12 }}>
              No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      )}

      {/* Step 4: Output */}
      {step === 4 && (
        <div>
          {/* Print controls */}
          <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a2a", margin: 0 }}>
                ACT Matrix: {studentName || "Student"}
              </h2>
              <p style={{ color: "#555", margin: "4px 0 0" }}>{challenge} · {gradeLabel(gradeLevel)}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => window.print()} style={secondaryBtn}>
                Print Matrix
              </button>
              <a href="/act-fba-bip" style={{ ...primaryBtn, textDecoration: "none", display: "inline-block" }}>
                Try Full ACT-FBA Tool →
              </a>
            </div>
          </div>

          {/* Matrix output */}
          <div style={{ border: "2px solid #1a3a2a", borderRadius: 8, overflow: "hidden", marginBottom: 32 }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", background: "#1a3a2a", color: "white" }}>
              <div style={{ padding: "10px 12px" }} />
              <div style={{ padding: "10px 16px", fontWeight: 600, fontSize: "0.85rem", textAlign: "center", borderLeft: "1px solid #2d5a3d" }}>
                Toward What Matters
              </div>
              <div style={{ padding: "10px 16px", fontWeight: 600, fontSize: "0.85rem", textAlign: "center", borderLeft: "1px solid #2d5a3d" }}>
                Away from Discomfort
              </div>
            </div>

            {/* Outer row */}
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", borderTop: "1px solid #e5e5e5" }}>
              <div style={{ padding: "16px 12px", background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#333" }}>OUTER</div>
                  <div style={{ fontSize: "0.75rem", color: "#666" }}>(doing)</div>
                </div>
              </div>
              <div style={{ padding: "16px", background: "#f0fdf4", borderLeft: "1px solid #e5e5e5" }}>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#1a3a2a", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {matrix.outerToward || <em style={{ color: "#aaa" }}>Not filled in</em>}
                </p>
              </div>
              <div style={{ padding: "16px", background: "#fff7ed", borderLeft: "1px solid #e5e5e5" }}>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#7c3d0f", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {matrix.outerAway || <em style={{ color: "#aaa" }}>Not filled in</em>}
                </p>
              </div>
            </div>

            {/* Inner row */}
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", borderTop: "1px solid #e5e5e5" }}>
              <div style={{ padding: "16px 12px", background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#333" }}>INNER</div>
                  <div style={{ fontSize: "0.75rem", color: "#666" }}>(feeling/<br />thinking)</div>
                </div>
              </div>
              <div style={{ padding: "16px", background: "#f0f7f4", borderLeft: "1px solid #e5e5e5" }}>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#1a3a2a", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {matrix.innerToward || <em style={{ color: "#aaa" }}>Not filled in</em>}
                </p>
              </div>
              <div style={{ padding: "16px", background: "#fefce8", borderLeft: "1px solid #e5e5e5" }}>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#854d0e", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {matrix.innerAway || <em style={{ color: "#aaa" }}>Not filled in</em>}
                </p>
              </div>
            </div>
          </div>

          {/* Strategies */}
          <div className="no-print">
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1a3a2a", marginBottom: 6 }}>
              3 Recommended ACT Strategies
            </h3>
            <p style={{ color: "#555", marginBottom: 20 }}>
              Selected based on grade level: <strong>{gradeLabel(gradeLevel)}</strong>
            </p>

            {strategies.map((s, i) => (
              <div key={i} style={{ background: "#f9f9f6", border: "1px solid #e0e0d8", borderRadius: 8, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ background: "#1a4731", color: "white", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0, marginTop: 2 }}>
                    {i + 1}
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 8px", fontWeight: 700, color: "#1a3a2a" }}>{s.title}</h4>
                    <p style={{ margin: 0, color: "#444", lineHeight: 1.7 }}>{s.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="no-print" style={{ background: "#1a3a2a", color: "white", borderRadius: 12, padding: "32px", marginTop: 40, textAlign: "center" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>
              Want to apply ACT frameworks systematically to your whole caseload?
            </h3>
            <p style={{ color: "#a7d4b8", marginBottom: 24, fontSize: "0.95rem" }}>
              The School BCBA Transformation Program cohort starts March 26. Early bird pricing available through March 21.
            </p>
            <a
              href="/transformation-program"
              style={{ display: "inline-block", background: "#c8a84b", color: "#1a1a1a", padding: "14px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "1rem" }}
            >
              Learn More →
            </a>
          </div>
        </div>
      )}
    </div>
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

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1.5px solid #ccc",
  borderRadius: 6,
  fontSize: "0.9rem",
  resize: "vertical",
  boxSizing: "border-box",
  lineHeight: 1.6,
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

const quadrantLabel: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "#1a4731",
  marginBottom: 8,
};
