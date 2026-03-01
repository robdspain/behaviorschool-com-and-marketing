import type { Metadata } from "next";
import ACTMatrixBuilder from "@/components/act-matrix-builder/ACTMatrixBuilder";

export const metadata: Metadata = {
  title: "ACT Matrix Builder | Free Interactive Tool | BehaviorSchool",
  description:
    "Build an ACT Matrix for any student. Fill in all four quadrants and get printable output with recommended ACT strategies. Free for BCBAs and school behavior teams.",
  openGraph: {
    title: "ACT Matrix Builder | Free Interactive Tool | BehaviorSchool",
    description:
      "Build an ACT Matrix for any student. Fill in all four quadrants and get printable output with recommended ACT strategies. Free for BCBAs and school behavior teams.",
    url: "https://behaviorschool.com/act-matrix-builder",
  },
};

export default function ACTMatrixBuilderPage() {
  return (
    <main style={{ background: "#f5f5f0", minHeight: "100vh", padding: "48px 24px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "#e8f5ee", color: "#1a4731", padding: "6px 16px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
            Free Tool
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "#1a3a2a", marginBottom: 12, lineHeight: 1.2 }}>
            ACT Matrix Builder
          </h1>
          <p style={{ color: "#555", fontSize: "1.1rem", maxWidth: 560, margin: "0 auto" }}>
            Build a complete ACT Matrix for any student in minutes. Get a printable output and 3 evidence-based ACT strategies matched to grade level.
          </p>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: "40px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <ACTMatrixBuilder />
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
