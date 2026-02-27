import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IEP Behavior Goal Writer | Behavior School",
  description:
    "Free tool for special education teachers and BCBAs to write measurable, standards-compliant IEP behavior goals in minutes. Includes Common Core alignment.",
  openGraph: {
    title: "IEP Behavior Goal Writer — Behavior School",
    description:
      "Write measurable IEP behavior goals with Common Core standards alignment. Free, no login required.",
    url: "https://behaviorschool.com/iep-goal-writer",
  },
};

export default function IEPGoalWriterPage() {
  return (
    <main style={{ margin: 0, padding: 0, minHeight: "100vh", background: "#f5f5f0" }}>
      <iframe
        src="/tools/iep-goal-writer/index.html"
        title="IEP Behavior Goal Writer"
        style={{
          width: "100%",
          minHeight: "100vh",
          border: "none",
          display: "block",
        }}
        allow="clipboard-write"
      />
    </main>
  );
}
