import type { Metadata } from "next";
import CaseloadAnalyzer from "@/components/caseload-analyzer/CaseloadAnalyzer";

export const metadata: Metadata = {
  title: "BCBA Caseload Analyzer | Free Assessment | BehaviorSchool",
  description:
    "Answer 8 questions about your caseload and get a personalized analysis with recommendations for your highest-risk cases. Free for school-based BCBAs.",
  openGraph: {
    title: "BCBA Caseload Analyzer | Free Assessment | BehaviorSchool",
    description:
      "Answer 8 questions about your caseload and get a personalized analysis with recommendations for your highest-risk cases. Free for school-based BCBAs.",
    url: "https://behaviorschool.com/caseload-analyzer",
  },
};

export default function CaseloadAnalyzerPage() {
  return (
    <main style={{ background: "#f5f5f0", minHeight: "100vh", padding: "48px 24px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "#e8f5ee", color: "#1a4731", padding: "6px 16px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
            Free Assessment
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "#1a3a2a", marginBottom: 12, lineHeight: 1.2 }}>
            BCBA Caseload Stress Analyzer
          </h1>
          <p style={{ color: "#555", fontSize: "1.1rem", maxWidth: 520, margin: "0 auto" }}>
            Answer 8 quick questions and get a caseload health score with personalized recommendations. Takes 2 minutes.
          </p>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: "40px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <CaseloadAnalyzer />
        </div>

        <p style={{ textAlign: "center", color: "#888", fontSize: "0.85rem", marginTop: 24 }}>
          Free tool from{" "}
          <a href="/" style={{ color: "#1a4731" }}>BehaviorSchool</a>
          {" "}· No login required
        </p>
      </div>
    </main>
  );
}
