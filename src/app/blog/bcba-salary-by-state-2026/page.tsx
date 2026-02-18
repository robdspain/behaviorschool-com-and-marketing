import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

const contentPath = path.join(process.cwd(), "src", "content", "blog", "bcba-salary-by-state-2026.md");

function stripFrontmatter(raw: string) {
  if (!raw.startsWith("---")) return raw;
  const end = raw.indexOf("---", 3);
  if (end === -1) return raw;
  return raw.slice(end + 3).trim();
}

export const metadata: Metadata = {
  title: "BCBA Salary by State 2026: What Behavior Analysts Actually Earn | Behavior School",
  description:
    "See real BCBA salary data for 2026—broken down by state, setting (school vs. clinical), and years of experience. Includes what school BCBAs earn vs. their clinical counterparts.",
  alternates: { canonical: "https://behaviorschool.com/blog/bcba-salary-by-state-2026" },
  openGraph: {
    title: "BCBA Salary by State 2026: What Behavior Analysts Actually Earn",
    description:
      "See real BCBA salary data for 2026—broken down by state, setting (school vs. clinical), and years of experience.",
    url: "https://behaviorschool.com/blog/bcba-salary-by-state-2026",
    siteName: "Behavior School",
    type: "article",
    images: [{ url: "/optimized/og-image.webp", width: 1200, height: 630, alt: "BCBA Salary by State 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Salary by State 2026",
    description:
      "See real BCBA salary data for 2026—broken down by state, setting (school vs. clinical), and years of experience.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function BcbaSalaryByState2026Page() {
  const raw = fs.readFileSync(contentPath, "utf-8");
  const body = stripFrontmatter(raw);
  const html = md.render(body);

  return (
    <div className="min-h-screen bg-bs-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: "BCBA Salary by State 2026" },
          ]}
        />
      </div>
      <Section>
        <Container>
          <article className="prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>
        </Container>
      </Section>
    </div>
  );
}
