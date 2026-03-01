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
  "6-8": [
    {
      title: "Passengers on the Bus",
      description:
        'Use the "Passengers on the Bus" metaphor. Ask the student: "Imagine you\'re driving a bus toward your goals. Some passengers (thoughts/feelings) try to tell you to turn around. You don\'t have to kick them off — you can just keep driving." Role-play the bus with the student using their own Away experiences as passengers.',
    },
    {
      title: "Values Clarification Exercise",
      description:
        "Have the student rank 10 value cards (connection, achievement, adventure, fairness, kindness, etc.). For each top value, ask: \"When you do [Away behavior], does it move you toward or away from this?\" This builds motivation from within rather than external compliance.",
    },
    {
      title: "Defusion Technique: Name It to Tame It",
      description:
        'Help the student notice and name their difficult thoughts/feelings without fusing with them. Teach them to say "I\'m having the thought that I\'m going to fail" instead of "I\'m going to fail." Practice with their specific Inner+Away content.',
    },
  ],
  "9-12": [
    {
      title: "Passengers on the Bus",
      description:
        'Use the "Passengers on the Bus" metaphor. Ask the student: "Imagine you\'re driving a bus toward your goals. Some passengers (thoughts/feelings) try to tell you to turn around. You don\'t have to kick them off — you can just keep driving." Role-play the bus with the student using their own Away experiences as passengers.',
    },
    {
      title: "Values Clarification Exercise",
      description:
        "Have the student rank 10 value cards (connection, achievement, adventure, fairness, kindness, etc.). For each top value, ask: \"When you do [Away behavior], does it move you toward or away from this?\" This builds motivation from within rather than external compliance.",
    },
    {
      title: "Defusion Technique: Name It to Tame It",
      description:
        'Help the student notice and name their difficult thoughts/feelings without fusing with them. Teach them to say "I\'m having the thought that I\'m going to fail" instead of "I\'m going to fail." Practice with their specific Inner+Away content.',
    },
  ],
  "4-5": [
    {
      title: "Tug of War with the Monster",
      description:
        "Explain: \"Imagine your worry/anger is a monster holding one end of a rope. You\'ve been pulling really hard — but the monster gets stronger the more you pull. What if you just dropped the rope?\" Draw this out together. The goal isn\'t to defeat the feeling — it\'s to stop fighting it.",
    },
    {
      title: "Values Card Sort",
      description:
        "Print simple value cards with pictures (being a good friend, being brave, being kind, learning new things). Have the student sort them into \"really important to me\" and \"not as important.\" Then connect their top 2-3 values to the Toward behaviors in their matrix.",
    },
    {
      title: "Thought Train Exercise",
      description:
        "Draw a train on paper. Each car holds a thought or feeling. Explain: \"Thoughts come and go like train cars. You don\'t have to ride every car — you can watch it pass.\" Have the student draw their difficult thoughts in the cars and practice watching them go by.",
    },
  ],
  "1-3": [
    {
      title: "Tug of War with the Monster",
      description:
        "Explain: \"Imagine your worry/anger is a monster holding one end of a rope. You\'ve been pulling really hard — but the monster gets stronger the more you pull. What if you just dropped the rope?\" Draw this out together. The goal isn\'t to defeat the feeling — it\'s to stop fighting it.",
    },
    {
      title: "Values Card Sort",
      description:
        "Print simple value cards with pictures (being a good friend, being brave, being kind, learning new things). Have the student sort them into \"really important to me\" and \"not as important.\" Then connect their top 2-3 values to the Toward behaviors in their matrix.",
    },
    {
      title: "Thought Train Exercise",
      description:
        "Draw a train on paper. Each car holds a thought or feeling. Explain: \"Thoughts come and go like train cars. You don\'t have to ride every car — you can watch it pass.\" Have the student draw their difficult thoughts in the cars and practice watching them go by.",
    },
  ],
  "prek-k": [
    {
      title: "The Feelings Jar",
      description:
        "Use a clear jar with glitter glue and water. When shaken, it\'s messy and hard to see through — like big feelings. When still, the glitter settles and everything is clear. Practice shaking it when upset and waiting for it to settle. Say: \"Our brains are like this jar.\"",
    },
    {
      title: "My Important Things Book",
      description:
        "Help the student draw or cut out pictures of things they care about (friends, pets, a favorite activity). Make it into a small book called \"What I Care About.\" When difficult behaviors arise, refer to the book: \"You care about having friends — what could we try instead?\"",
    },
    {
      title: "The Superhero Pose",
      description:
        "Connect Toward behaviors to a fun identity: \"What does a kind helper do when something feels hard?\" Practice a short \"superhero pose\" (hands on hips, big breath) as a physical anchor to shift from Away to Toward behaviors. Keep it playful and consistent.",
    },
  ],
};

function getStrategies(grade: GradeLevel) {
  if (grade === "6-8" || grade === "9-12") return STRATEGIES[grade];
  if (grade === "4-5" || grade === "1-3") return STRATEGIES[grade];
  return STRATEGIES["prek-k"];
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
            <div style={{ background: "#f0faf4", padding: "16px", borderTop: "1px solid #c8e6d0" }}>
              <div style={quadrantLabel}>Outer (Doing)</div>
              <textarea
                value={matrix.outerToward}
                onChange={(e) => setMatrix({ ...matrix, outerToward: e.target.value })}
                placeholder="e.g., Helps classmates, Participates when confident, Asks questions in small groups"
                style={textareaStyle}
                rows={4}
              />
            </div>
            <div style={{ background: "#fff5f5", padding: "16px", borderTop: "1px solid #fecaca", borderLeft: "1px solid #ccc" }}>
              <div style={{ ...quadrantLabel, color: "#991b1b" }}>Outer (Doing) — Target Behavior</div>
              <textarea
                value={matrix.outerAway}
                onChange={(e) => setMatrix({ ...matrix, outerAway: e.target.value })}
                placeholder="e.g., Refuses tasks, Disrupts class, Leaves the room"
                style={{ ...textareaStyle, borderColor: "#fca5a5" }}
                rows={4}
              />
            </div>

            {/* Divider */}
            <div style={{ gridColumn: "1 / -1", height: 1, background: "#ccc" }} />

            {/* Inner row */}
            <div style={{ background: "#faf5ff", padding: "16px" }}>
              <div style={{ ...quadrantLabel, color: "#6d28d9" }}>Inner (Feeling/Thinking)</div>
              <textarea
                value={matrix.innerToward}
                onChange={(e) => setMatrix({ ...matrix, innerToward: e.target.value })}
                placeholder="e.g., Being seen as smart, Having friends, Being good at sports"
                style={{ ...textareaStyle, borderColor: "#c4b5fd" }}
                rows={4}
              />
            </div>
            <div style={{ background: "#fffbeb", padding: "16px", borderLeft: "1px solid #ccc" }}>
              <div style={{ ...quadrantLabel, color: "#92400e" }}>Inner (Feeling/Thinking)</div>
              <textarea
                value={matrix.innerAway}
                onChange={(e) => setMatrix({ ...matrix, innerAway: e.target.value })}
                placeholder="e.g., Feeling stupid, Fear of failing, Embarrassment in front of peers"
                style={{ ...textareaStyle, borderColor: "#fcd34d" }}
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
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", borderTop: "1px solid #ccc" }}>
              <div style={{ padding: "16px 12px", background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#333" }}>OUTER</div>
                  <div style={{ fontSize: "0.75rem", color: "#666" }}>(doing)</div>
                </div>
              </div>
              <div style={{ padding: "16px", background: "#f0faf4", borderLeft: "1px solid #ccc" }}>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#1a3a2a", fontSize: "0.95rem" }}>
                  {matrix.outerToward || <em style={{ color: "#aaa" }}>Not filled in</em>}
                </p>
              </div>
              <div style={{ padding: "16px", background: "#fff5f5", borderLeft: "1px solid #ccc" }}>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#7f1d1d", fontSize: "0.95rem" }}>
                  {matrix.outerAway || <em style={{ color: "#aaa" }}>Not filled in</em>}
                </p>
              </div>
            </div>

            {/* Inner row */}
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", borderTop: "1px solid #ccc" }}>
              <div style={{ padding: "16px 12px", background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#333" }}>INNER</div>
                  <div style={{ fontSize: "0.75rem", color: "#666" }}>(feeling/<br />thinking)</div>
                </div>
              </div>
              <div style={{ padding: "16px", background: "#faf5ff", borderLeft: "1px solid #ccc" }}>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#4c1d95", fontSize: "0.95rem" }}>
                  {matrix.innerToward || <em style={{ color: "#aaa" }}>Not filled in</em>}
                </p>
              </div>
              <div style={{ padding: "16px", background: "#fffbeb", borderLeft: "1px solid #ccc" }}>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#78350f", fontSize: "0.95rem" }}>
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
