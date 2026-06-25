import type { Metadata } from "next";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";

const canonical = "https://behaviorschool.com/school-bcba/job-description";

export const metadata: Metadata = {
  title: "School BCBA Job Description | Duties, Skills, Examples",
  description:
    "School BCBA job description with common duties, required skills, district expectations, and examples of school-based BCBA responsibilities.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <SeoArticlePage
      title="School BCBA Job Description"
      description="A school BCBA job description usually blends assessment, intervention design, IEP support, staff coaching, crisis prevention, and district systems work."
      eyebrow="School BCBA career"
      breadcrumbLabel="School BCBA Job Description"
      canonical={canonical}
      primaryCta={{ label: "Read the school BCBA job guide", href: "/school-bcba/job-guide" }}
      secondaryLinks={[
        { label: "School BCBA salary by state", href: "/school-bcba/salary-by-state" },
        { label: "School BCBA interview questions", href: "/school-bcba/interview-questions" },
        { label: "How to become a school BCBA", href: "/school-bcba/how-to-become" },
      ]}
      sections={[
        {
          heading: "Common duties",
          body: "District job descriptions often ask school BCBAs to support students, teams, and systems rather than provide only one-to-one clinical services.",
          bullets: [
            "Conduct FBAs and help teams build function-based BIPs.",
            "Write or review measurable behavior goals for IEP teams.",
            "Coach teachers and paraprofessionals on implementation fidelity.",
            "Analyze behavior data and recommend next steps.",
          ],
        },
        {
          heading: "Skills districts look for",
          body: "Strong candidates can translate behavior analysis into routines that work in classrooms, meetings, and district systems.",
          bullets: [
            "Clear communication with educators and families.",
            "Practical data systems that teams can maintain.",
            "Ethical judgment around restrictive procedures and inclusion.",
            "Ability to train adults without overwhelming them.",
          ],
        },
        {
          heading: "How to stand out",
          body: "Bring artifacts: a sample FBA summary, a BIP, progress-monitoring graph, coaching checklist, and a 90-day plan for district support.",
        },
      ]}
      faqs={[
        {
          question: "Is a school BCBA job different from a clinic BCBA job?",
          answer: "Yes. School roles usually require more collaboration with IEP teams, educators, administrators, and tiered support systems.",
        },
        {
          question: "Do school BCBAs write IEP goals?",
          answer: "They often draft, review, or support measurable behavior goals as part of the IEP team process.",
        },
      ]}
    />
  );
}
