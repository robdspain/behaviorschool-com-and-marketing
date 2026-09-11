#!/usr/bin/env npx tsx
/**
 * Generate public/ebooks/bcba-exam-guide-2026.pdf (The 2026 BCBA Exam Survival Guide).
 *
 * The guide is written to the BACB BCBA Test Content Outline (6th ed.), which governs
 * BCBA exams administered from January 2025 onward. Domain names, task counts, question
 * counts, and percentages below are copied from that document:
 * https://www.bacb.com/wp-content/bcba-outline-6thEd/
 *
 * Run: npx tsx scripts/generate-bcba-exam-guide-pdf.tsx
 */

import React from "react";
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { writeFileSync } from "fs";
import { resolve } from "path";

Font.registerHyphenationCallback((word) => [word]);

const OUTPUT_PATH = resolve(process.cwd(), "public/ebooks/bcba-exam-guide-2026.pdf");

const FREE_PRACTICE_URL =
  "https://study.behaviorschool.com/free-practice/?utm_source=behaviorstudytools&utm_medium=owned_marketing&utm_campaign=bst_web_growth&intent=bcba_exam_guide_pdf&utm_content=ebook_bcba_exam_guide_pdf";

const GREEN = "#1f4d3f";
const GOLD = "#e4b63d";
const INK = "#1a1a1a";
const MUTED = "#5f6b66";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10.5,
    paddingTop: 54,
    paddingBottom: 58,
    paddingHorizontal: 56,
    color: INK,
    backgroundColor: "#ffffff",
  },
  cover: {
    fontFamily: "Helvetica",
    backgroundColor: GREEN,
    color: "#ffffff",
    padding: 64,
    justifyContent: "space-between",
  },
  coverKicker: {
    fontSize: 11,
    letterSpacing: 2,
    color: GOLD,
    marginBottom: 28,
  },
  coverTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 40,
    lineHeight: 1.1,
    marginBottom: 18,
  },
  coverSubtitle: {
    fontSize: 15,
    lineHeight: 1.4,
    color: "#dfe9e4",
    maxWidth: 380,
  },
  coverRule: {
    width: 56,
    height: 3,
    backgroundColor: GOLD,
    marginVertical: 26,
  },
  coverMeta: {
    fontSize: 10.5,
    lineHeight: 1.5,
    color: "#c9d8d1",
  },
  coverBrand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    letterSpacing: 1,
  },
  chapterKicker: {
    fontSize: 9.5,
    letterSpacing: 1.5,
    color: MUTED,
    marginBottom: 6,
  },
  h1: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: GREEN,
    marginBottom: 14,
    lineHeight: 1.2,
  },
  h2: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: GREEN,
    marginTop: 14,
    marginBottom: 7,
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
    borderLeftStyle: "solid",
    paddingLeft: 8,
  },
  h3: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: INK,
    marginTop: 8,
    marginBottom: 4,
  },
  p: {
    fontSize: 10.5,
    lineHeight: 1.55,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 6,
  },
  bulletDot: {
    width: 12,
    fontSize: 10.5,
    color: GREEN,
  },
  bulletText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 1.45,
  },
  callout: {
    backgroundColor: "#f0f7f4",
    borderLeftWidth: 3,
    borderLeftColor: GREEN,
    borderLeftStyle: "solid",
    padding: 10,
    marginVertical: 10,
  },
  calloutLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: GREEN,
    marginBottom: 3,
  },
  calloutText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  table: {
    marginTop: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d7e0dc",
    borderStyle: "solid",
  },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5ebe8",
    borderBottomStyle: "solid",
  },
  trHead: {
    flexDirection: "row",
    backgroundColor: GREEN,
  },
  trTotal: {
    flexDirection: "row",
    backgroundColor: "#f0f7f4",
  },
  th: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 7,
  },
  td: {
    fontSize: 9.5,
    paddingVertical: 5,
    paddingHorizontal: 7,
    lineHeight: 1.3,
  },
  tdBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    paddingVertical: 5,
    paddingHorizontal: 7,
    lineHeight: 1.3,
  },
  colDomain: { flex: 3.4 },
  colNum: { flex: 0.9, textAlign: "right" },
  twoCol: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 6,
  },
  col: {
    flex: 1,
  },
  fixRow: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 10,
  },
  fixBad: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
    color: "#7a2e2e",
  },
  fixGood: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
    color: GREEN,
  },
  checkbox: {
    flexDirection: "row",
    marginBottom: 5,
  },
  checkboxBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: GREEN,
    borderStyle: "solid",
    marginRight: 8,
    marginTop: 2,
  },
  tocRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5ebe8",
    borderBottomStyle: "dotted",
    paddingVertical: 7,
  },
  tocLabel: {
    fontSize: 11,
  },
  tocPage: {
    fontSize: 11,
    color: MUTED,
  },
  reference: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 6,
    paddingLeft: 16,
    textIndent: -16,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#8a948f",
    borderTopWidth: 1,
    borderTopColor: "#e5ebe8",
    borderTopStyle: "solid",
    paddingTop: 7,
  },
  ctaBox: {
    backgroundColor: GREEN,
    color: "#ffffff",
    padding: 14,
    marginTop: 10,
  },
  ctaTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: "#ffffff",
    marginBottom: 6,
  },
  ctaText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#dfe9e4",
    marginBottom: 6,
  },
  ctaLink: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: GOLD,
    textDecoration: "none",
  },
});

/** From the BACB BCBA Test Content Outline (6th ed.), updated 09/2024. */
const DOMAINS = [
  { id: "A", name: "Behaviorism and Philosophical Foundations", tasks: 5, questions: 8, pct: "5%" },
  { id: "B", name: "Concepts and Principles", tasks: 24, questions: 24, pct: "14%" },
  { id: "C", name: "Measurement, Data Display, and Interpretation", tasks: 12, questions: 21, pct: "12%" },
  { id: "D", name: "Experimental Design", tasks: 9, questions: 13, pct: "7%" },
  { id: "E", name: "Ethical and Professional Issues", tasks: 12, questions: 22, pct: "13%" },
  { id: "F", name: "Behavior Assessment", tasks: 8, questions: 23, pct: "13%" },
  { id: "G", name: "Behavior-Change Procedures", tasks: 19, questions: 25, pct: "14%" },
  { id: "H", name: "Selecting and Implementing Interventions", tasks: 8, questions: 20, pct: "11%" },
  { id: "I", name: "Personnel Supervision and Management", tasks: 7, questions: 19, pct: "11%" },
] as const;

const TOTAL_TASKS = DOMAINS.reduce((sum, d) => sum + d.tasks, 0);
const TOTAL_SCORED = DOMAINS.reduce((sum, d) => sum + d.questions, 0);

if (TOTAL_TASKS !== 104 || TOTAL_SCORED !== 175) {
  throw new Error(`Domain table does not match the BACB outline (tasks=${TOTAL_TASKS}, scored=${TOTAL_SCORED}).`);
}

const CHAPTERS = [
  { label: "Introduction: what the 2026 exam is", page: 3 },
  { label: "Chapter 1: The 6th Edition Test Content Outline", page: 4 },
  { label: "Chapter 2: A 12-week study schedule by domain", page: 6 },
  { label: "Chapter 3: Concepts the exam keeps coming back to", page: 8 },
  { label: "Chapter 4: Test-taking strategy", page: 10 },
  { label: "Chapter 5: Mistakes to avoid", page: 11 },
  { label: "Chapter 6: Resources and a 30-day action plan", page: 12 },
  { label: "References", page: 13 },
];

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.callout} wrap={false}>
      <Text style={styles.calloutLabel}>{label}</Text>
      <Text style={styles.calloutText}>{children}</Text>
    </View>
  );
}

function Fix({ bad, good }: { bad: string; good: string }) {
  return (
    <View style={styles.fixRow} wrap={false}>
      <Text style={styles.fixBad}>Instead of: {bad}</Text>
      <Text style={styles.fixGood}>Do this: {good}</Text>
    </View>
  );
}

function Checkbox({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.checkbox} wrap={false}>
      <View style={styles.checkboxBox} />
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer} fixed>
      <Text>The 2026 BCBA Exam Survival Guide · Behavior School</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  );
}

function ContentPage({ children }: { children: React.ReactNode }) {
  return (
    <Page size="LETTER" style={styles.page}>
      {children}
      <Footer />
    </Page>
  );
}

function Guide() {
  return (
    <Document
      title="The 2026 BCBA Exam Survival Guide"
      author="Behavior School"
      subject="BCBA exam preparation guide written to the BACB 6th Edition Test Content Outline"
      keywords="BCBA exam, 6th Edition Test Content Outline, BCBA study schedule"
      creator="Behavior School"
      producer="Behavior School"
    >
      {/* Cover */}
      <Page size="LETTER" style={styles.cover}>
        <View>
          <Text style={styles.coverKicker}>2026 EDITION</Text>
          <Text style={styles.coverTitle}>The BCBA Exam Survival Guide</Text>
          <Text style={styles.coverSubtitle}>
            What to study, in what order, and how to check your readiness before test day.
          </Text>
          <View style={styles.coverRule} />
          <Text style={styles.coverMeta}>
            Written to the BACB BCBA Test Content Outline (6th ed.), the outline in effect for exams
            administered from January 2025 onward.
          </Text>
        </View>
        <View>
          <Text style={styles.coverBrand}>BEHAVIOR SCHOOL</Text>
          <Text style={styles.coverMeta}>behaviorschool.com</Text>
        </View>
      </Page>

      {/* Contents */}
      <ContentPage>
        <Text style={styles.chapterKicker}>CONTENTS</Text>
        <Text style={styles.h1}>What is in this guide</Text>
        {CHAPTERS.map((chapter) => (
          <View key={chapter.label} style={styles.tocRow}>
            <Text style={styles.tocLabel}>{chapter.label}</Text>
            <Text style={styles.tocPage}>{chapter.page}</Text>
          </View>
        ))}
        <Callout label="How to use this guide">
          Read the introduction and Chapter 1 first, even if your exam is weeks away. They tell you
          which edition your study materials need to match. Then build your schedule from Chapter 2
          and use Chapters 3 through 5 as you go.
        </Callout>
      </ContentPage>

      {/* Introduction */}
      <ContentPage>
        <Text style={styles.chapterKicker}>INTRODUCTION</Text>
        <Text style={styles.h1}>What the 2026 BCBA exam is</Text>
        <Text style={styles.p}>
          The BCBA examination is built from the Behavior Analyst Certification Board&apos;s BCBA Test
          Content Outline (6th ed.). Every exam administered since January 2025 draws its questions from
          the 104 tasks in that outline, organized into nine domains lettered A through I.
        </Text>
        <Text style={styles.p}>
          The exam has 185 multiple-choice questions: 175 that count toward your score and 10 unscored
          pilot questions that the BACB is testing for future forms. You cannot tell which are which, so
          treat every question as scored. You have four hours.
        </Text>
        <Text style={styles.h2}>Check your materials before you study</Text>
        <Text style={styles.p}>
          A lot of study material still on the market was written to the 5th Edition Task List, which
          the 6th Edition outline replaced. The quickest way to tell: the 5th Edition gave
          Behavior-Change Procedures the single largest share, about a fifth of the exam, and called
          Section A &quot;Philosophical Underpinnings.&quot; If your notes, flashcards, or question bank use those
          labels and weights, they are describing an exam you will not sit.
        </Text>
        <Callout label="Two edition tells">
          6th Edition materials say &quot;Test Content Outline,&quot; not &quot;Task List,&quot; and name
          Domain A &quot;Behaviorism and Philosophical Foundations&quot; and Domain E &quot;Ethical and
          Professional Issues.&quot;
        </Callout>
        <Text style={styles.h2}>What this guide gives you</Text>
        <Bullet>The 6th Edition domains with task counts, question counts, and exam weights (Chapter 1).</Bullet>
        <Bullet>A 12-week schedule that assigns each domain to a week (Chapter 2).</Bullet>
        <Bullet>The concepts and decision rules that show up across domains (Chapter 3).</Bullet>
        <Bullet>Pacing, question analysis, and anxiety management for a four-hour exam (Chapter 4).</Bullet>
        <Bullet>Study and exam-day mistakes, each paired with what to do instead (Chapter 5).</Bullet>
        <Bullet>Official resources and a 30-day action plan (Chapter 6).</Bullet>
      </ContentPage>

      {/* Chapter 1 */}
      <ContentPage>
        <Text style={styles.chapterKicker}>CHAPTER 1</Text>
        <Text style={styles.h1}>The 6th Edition Test Content Outline</Text>
        <Text style={styles.p}>
          The table below is the BACB&apos;s own breakdown. &quot;Tasks&quot; is how many numbered
          statements the domain contains; &quot;Questions&quot; is how many scored items the exam draws
          from that domain.
        </Text>
        <View style={styles.table}>
          <View style={styles.trHead}>
            <Text style={[styles.th, styles.colDomain]}>Domain</Text>
            <Text style={[styles.th, styles.colNum]}>Tasks</Text>
            <Text style={[styles.th, styles.colNum]}>Questions</Text>
            <Text style={[styles.th, styles.colNum]}>% of exam</Text>
          </View>
          {DOMAINS.map((domain) => (
            <View key={domain.id} style={styles.tr}>
              <Text style={[styles.td, styles.colDomain]}>
                {domain.id}. {domain.name}
              </Text>
              <Text style={[styles.td, styles.colNum]}>{domain.tasks}</Text>
              <Text style={[styles.td, styles.colNum]}>{domain.questions}</Text>
              <Text style={[styles.td, styles.colNum]}>{domain.pct}</Text>
            </View>
          ))}
          <View style={styles.trTotal}>
            <Text style={[styles.tdBold, styles.colDomain]}>Total scored questions</Text>
            <Text style={[styles.tdBold, styles.colNum]}>{TOTAL_TASKS}</Text>
            <Text style={[styles.tdBold, styles.colNum]}>{TOTAL_SCORED}</Text>
            <Text style={[styles.tdBold, styles.colNum]}>100%</Text>
          </View>
        </View>
        <Text style={styles.p}>
          Plus 10 unscored pilot questions, for 185 questions on the day.
        </Text>
        <Text style={styles.h2}>How the weight is spread</Text>
        <Text style={styles.p}>
          No domain dominates. The two largest, Behavior-Change Procedures (G) and Concepts and
          Principles (B), are 14% each. Behavior Assessment (F) and Ethical and Professional Issues (E)
          are 13% each. Six of the nine domains sit between 11% and 14%, so skipping any one of them
          costs you a meaningful share of the exam.
        </Text>
        <Text style={styles.p}>
          The two smallest domains, Behaviorism and Philosophical Foundations (A, 5%) and Experimental
          Design (D, 7%), together still account for 21 scored questions.
        </Text>
        <Text style={styles.h2}>Questions per task: where study time pays back fastest</Text>
        <Text style={styles.p}>
          Divide each domain&apos;s questions by its tasks and the outline tells you something the
          percentages alone do not. Behavior Assessment has 8 tasks carrying 23 questions, about
          three questions per task. Personnel Supervision and Management (7 tasks, 19 questions) and
          Selecting and Implementing Interventions (8 tasks, 20 questions) are close behind. Concepts
          and Principles has 24 tasks for 24 questions: the most to learn per point on the exam.
        </Text>
        <Text style={styles.p}>
          That does not mean you skip Domain B. It means domains F, H, and I reward depth on a small
          number of tasks, while Domain B rewards breadth and precise definitions. Plan your time
          accordingly.
        </Text>
        <Text style={styles.h2}>What changed from the 5th Edition</Text>
        <Bullet>
          The document is now a Test Content Outline, not a Task List, and it grew from 92 items to
          104 tasks.
        </Bullet>
        <Bullet>
          Domain A was renamed Behaviorism and Philosophical Foundations. Domain E was renamed Ethical
          and Professional Issues.
        </Bullet>
        <Bullet>
          Domain E now includes explicit tasks on cultural humility (E.9), culturally responsive and
          inclusive service (E.10), and identifying personal biases (E.11). Cultural variables also
          appear in Behavior Assessment (F.2) and Supervision (I.3, I.5).
        </Bullet>
        <Bullet>
          Weight moved away from Behavior-Change Procedures and toward Assessment, Interventions, and
          Supervision. Supervision alone is now 11% of the exam.
        </Bullet>
        <Bullet>
          Domain B added items on emergent relations and generative performance (B.21), behavioral
          momentum (B.22), the matching law (B.23), and imitation versus observational learning (B.24).
        </Bullet>
        <Callout label="Do this today">
          Download the BCBA Test Content Outline (6th ed.) from bacb.com and keep it open while you
          study. Every practice question you miss should map back to a numbered task on that list.
        </Callout>
      </ContentPage>

      {/* Chapter 2 */}
      <ContentPage>
        <Text style={styles.chapterKicker}>CHAPTER 2</Text>
        <Text style={styles.h1}>A 12-week study schedule by domain</Text>
        <Text style={styles.p}>
          Twelve weeks is enough for a candidate who has finished coursework and can study about ten
          hours a week. If you have less time, compress the foundation weeks; do not compress the
          mock-exam weeks.
        </Text>
        <Text style={styles.h2}>Weeks 1 to 4: Foundation (Domains A, B, C)</Text>
        <Bullet>Week 1: Domain A and the first half of Domain B (B.1 to B.12).</Bullet>
        <Bullet>Week 2: Second half of Domain B (B.13 to B.24). Build a definitions deck as you go.</Bullet>
        <Bullet>Week 3: Domain C. Practice reading graphs and choosing measurement systems.</Bullet>
        <Bullet>
          Week 4: Take a timed practice set that reports results by domain. Record your accuracy for
          each domain; this is your baseline.
        </Bullet>
        <Text style={styles.h2}>Weeks 5 to 8: Application (Domains D, E, F, G)</Text>
        <Bullet>Week 5: Domain D. Single-case designs, internal validity, and when each design fits.</Bullet>
        <Bullet>
          Week 6: Domain E. Read the Ethics Code for Behavior Analysts alongside the E tasks, not
          instead of them.
        </Bullet>
        <Bullet>Week 7: Domain F. Preference, descriptive, and functional assessment; interpreting the data.</Bullet>
        <Bullet>Week 8: Domain G. Reinforcement, prompting, shaping, chaining, generalization, punishment.</Bullet>
        <Text style={styles.h2}>Weeks 9 to 11: Integration (Domains H, I) and full mocks</Text>
        <Bullet>Week 9: Domains H and I. Goal writing, intervention selection, procedural integrity, supervision.</Bullet>
        <Bullet>
          Weeks 10 and 11: One full-length timed mock each week (185 questions, four hours, no
          breaks beyond what the real exam allows). Spend the rest of the week reviewing every
          missed item against its task number.
        </Bullet>
        <Text style={styles.h2}>Week 12: Review and rest</Text>
        <Bullet>Light review of your lowest two domains. No new material.</Bullet>
        <Bullet>Reread your own notes on the questions you missed twice.</Bullet>
        <Bullet>Take the day before the exam off.</Bullet>
        <Text style={styles.h2}>A daily structure that holds up</Text>
        <View style={styles.table}>
          <View style={styles.trHead}>
            <Text style={[styles.th, { flex: 1 }]}>Block</Text>
            <Text style={[styles.th, { flex: 2.5 }]}>Activity</Text>
            <Text style={[styles.th, { flex: 1 }]}>Time</Text>
          </View>
          <View style={styles.tr}>
            <Text style={[styles.td, { flex: 1 }]}>Session 1</Text>
            <Text style={[styles.td, { flex: 2.5 }]}>New content for the week&apos;s domain</Text>
            <Text style={[styles.td, { flex: 1 }]}>45 to 60 min</Text>
          </View>
          <View style={styles.tr}>
            <Text style={[styles.td, { flex: 1 }]}>Session 2</Text>
            <Text style={[styles.td, { flex: 2.5 }]}>Practice questions, then read the rationale for every item, right or wrong</Text>
            <Text style={[styles.td, { flex: 1 }]}>30 min</Text>
          </View>
          <View style={styles.tr}>
            <Text style={[styles.td, { flex: 1 }]}>Session 3</Text>
            <Text style={[styles.td, { flex: 2.5 }]}>Definitions and terminology review</Text>
            <Text style={[styles.td, { flex: 1 }]}>15 to 20 min</Text>
          </View>
        </View>
        <Text style={styles.h2}>What to track</Text>
        <Text style={styles.p}>
          Keep one page per domain. Each time you miss a question, write the task number, what the
          question was really testing, and the rule you should have applied. By week 9 those pages
          are your personalized review guide, and they are more useful than any generic summary.
        </Text>
        <Text style={styles.p}>Four signals tell you whether you are ready, and a good practice tool reports all four:</Text>
        <Bullet>Domain accuracy: consistently correct in every domain, not just the ones you like.</Bullet>
        <Bullet>Response time: answering within about 75 seconds without rushing.</Bullet>
        <Bullet>Consistency: the same result on a domain across several sessions, not one good day.</Bullet>
        <Bullet>Mock endurance: holding accuracy through the fourth hour of a full-length mock.</Bullet>
        <Callout label="If you are short on time">
          Eight weeks: fold weeks 1 and 2 together and weeks 5 and 6 together, and keep both full mocks.
          Sixteen weeks: add a second pass through Domains B and G, and add a third full mock in week 14.
        </Callout>
      </ContentPage>

      {/* Chapter 3 */}
      <ContentPage>
        <Text style={styles.chapterKicker}>CHAPTER 3</Text>
        <Text style={styles.h1}>Concepts the exam keeps coming back to</Text>
        <Text style={styles.h2}>Reinforcement and punishment (B.4, B.5)</Text>
        <Text style={styles.p}>
          Classify by two questions only: was a stimulus added or removed, and did the behavior
          increase or decrease over time? Whether the stimulus seems pleasant is irrelevant.
        </Text>
        <Bullet>Positive reinforcement: stimulus added, behavior increases. Praise after a completed task.</Bullet>
        <Bullet>Negative reinforcement: stimulus removed, behavior increases. Silencing an alarm by getting up.</Bullet>
        <Bullet>Positive punishment: stimulus added, behavior decreases. A reprimand following a response.</Bullet>
        <Bullet>Negative punishment: stimulus removed, behavior decreases. Loss of screen time after a rule violation.</Bullet>
        <Callout label="Exam tip">
          The stem will describe the consequence. Look for the future-behavior clause (&quot;and the
          behavior increased over the next week&quot;) before you name the process. No effect on
          behavior, no reinforcement or punishment.
        </Callout>
        <Text style={styles.h2}>Functions of behavior (F.5 to F.8)</Text>
        <Text style={styles.p}>
          Assessment questions want you to identify what the behavior produces, then choose an
          intervention that addresses that function. Four functions cover most scenarios:
        </Text>
        <Bullet>Automatic: the behavior itself produces the reinforcer, without another person.</Bullet>
        <Bullet>Escape or avoidance: the behavior removes or postpones a demand or aversive stimulus.</Bullet>
        <Bullet>Attention: the behavior produces social interaction.</Bullet>
        <Bullet>Access to tangibles: the behavior produces items or activities.</Bullet>
        <Text style={styles.p}>
          Know which assessment method the question describes: indirect (interviews, rating scales),
          descriptive (ABC recording in the natural setting), or functional analysis (conditions are
          manipulated). Only a functional analysis demonstrates a function; the others suggest one.
        </Text>
        <Text style={styles.h2}>Ethics decision-making (Domain E)</Text>
        <Text style={styles.p}>
          Domain E is 22 questions, and most are scenarios with more than one defensible-sounding
          option. Work them in order:
        </Text>
        <Bullet>Name the Ethics Code standards involved. There are often two.</Bullet>
        <Bullet>Ask what protects the client first. Client welfare outranks convenience, cost, and the supervisor&apos;s preference.</Bullet>
        <Bullet>Check for a required step you would skip: consent, assent, documentation, consultation, referral.</Bullet>
        <Bullet>Consider cultural variables and your own biases (E.9 to E.11). The 6th Edition tests this directly.</Bullet>
        <Bullet>Choose the option that resolves the problem at the lowest appropriate level before escalating.</Bullet>
        <Text style={styles.h2}>Measurement and graphs (Domain C)</Text>
        <Text style={styles.p}>
          Expect to match a measurement system to a behavior (count, rate, duration, latency, IRT,
          percent of opportunities, trials to criterion) and to read a graph for level, trend, and
          variability. Continuous measurement records every instance; discontinuous measurement
          (interval recording, momentary time sampling) samples and can over- or underestimate.
        </Text>
        <Text style={styles.h2}>Supervision (Domain I)</Text>
        <Text style={styles.p}>
          At 11% of the exam, Domain I is larger than many candidates expect. The tasks ask you to
          treat supervision the way you treat any other behavior-change effort: assess the supervisee&apos;s
          skills (I.4), use empirically validated and culturally responsive training methods such as
          behavioral skills training (I.5), take a function-based approach to performance problems
          (I.6), and make data-based decisions about whether supervision is working (I.7).
        </Text>
        <Callout label="A useful habit">
          When you miss a question, name the domain and the task, then say in one sentence why the
          correct answer is correct. If you cannot, the miss is a gap, not a slip. Put it on the domain
          page from Chapter 2.
        </Callout>
      </ContentPage>

      {/* Chapter 4 */}
      <ContentPage>
        <Text style={styles.chapterKicker}>CHAPTER 4</Text>
        <Text style={styles.h1}>Test-taking strategy</Text>
        <Text style={styles.h2}>Before the exam</Text>
        <Bullet>Sleep seven to eight hours the night before. Cramming buys less than rest does.</Bullet>
        <Bullet>Eat a normal meal. The exam is four hours; plan for it.</Bullet>
        <Bullet>Arrive 30 minutes early and bring the identification your appointment confirmation requires.</Bullet>
        <Bullet>Know the testing center&apos;s break policy in advance so a break is a decision, not a surprise.</Bullet>
        <Text style={styles.h2}>Pacing</Text>
        <Text style={styles.p}>
          185 questions in 240 minutes is about 78 seconds per question. Aim for a first pass at
          roughly 60 to 70 seconds each so you bank time for flagged items. Check the clock at
          question 50, 100, and 150; you should be near 65, 130, and 195 minutes.
        </Text>
        <Bullet>Flag anything that takes more than two minutes and move on.</Bullet>
        <Bullet>Answer every question on the first pass, even flagged ones. The score counts correct answers; a blank cannot be right.</Bullet>
        <Text style={styles.h2}>Reading the question</Text>
        <Bullet>Read the whole stem. Identify the domain and, if you can, the task it is testing.</Bullet>
        <Bullet>Predict the answer before you look at the options.</Bullet>
        <Bullet>Eliminate options that are true statements but do not answer this question.</Bullet>
        <Bullet>Pick the most correct answer, not the first correct-sounding one.</Bullet>
        <Text style={styles.h2}>Qualifier words</Text>
        <Bullet>&quot;First,&quot; &quot;best,&quot; and &quot;most appropriate&quot; ask you to rank, not to identify anything acceptable.</Bullet>
        <Bullet>&quot;Except&quot; and &quot;not&quot; reverse the logic. Reread the stem after you choose.</Bullet>
        <Bullet>Absolute language (&quot;always,&quot; &quot;never&quot;) in an option deserves a second look.</Bullet>
        <Text style={styles.h2}>Managing anxiety in the room</Text>
        <Bullet>Slow breathing: in for four counts, hold for four, out for six. Three cycles.</Bullet>
        <Bullet>Feet on the floor, hands on the desk, eyes on one fixed point for ten seconds.</Bullet>
        <Bullet>Return to the process: read, predict, eliminate, choose. The process is what you practiced.</Bullet>
      </ContentPage>

      {/* Chapter 5 */}
      <ContentPage>
        <Text style={styles.chapterKicker}>CHAPTER 5</Text>
        <Text style={styles.h1}>Mistakes to avoid</Text>
        <Text style={styles.h2}>While studying</Text>
        <Fix
          bad="Studying from materials that still use the 5th Edition Task List."
          good="Check the edition first. Map everything you use to the 6th Edition outline."
        />
        <Fix
          bad="Memorizing definitions without applying them."
          good="After each definition, write a scenario and name the concept in it."
        />
        <Fix
          bad="Reading rationales only for the questions you missed."
          good="Read the rationale for every question. A lucky guess is a gap you have not seen yet."
        />
        <Fix
          bad="Studying only the domains you enjoy."
          good="Follow your domain accuracy, not your preferences. The weak domain is the assignment."
        />
        <Fix
          bad="Taking untimed practice only."
          good="Take full-length timed mocks. Endurance through hour four is a skill you have to practice."
        />
        <Fix
          bad="Studying up to the night before."
          good="Take the last day off. Rest is part of the plan."
        />
        <Text style={styles.h2}>On exam day</Text>
        <Fix
          bad="Changing an answer because of a feeling."
          good="Change an answer only when you can name the specific reason the new one is better."
        />
        <Fix
          bad="Leaving questions blank."
          good="Answer everything. Only correct answers count; there is no penalty for a wrong one."
        />
        <Fix
          bad="Spending five minutes on one hard item."
          good="Flag it, answer your best guess, and come back with the time you banked."
        />
        <Fix
          bad="Overthinking ethics scenarios."
          good="Apply the sequence from Chapter 3. The answer that protects the client and follows the Code is the answer."
        />
        <Fix
          bad="Skipping the break to save time."
          good="Take it if you need it. Four hours of accuracy beats ten saved minutes."
        />
      </ContentPage>

      {/* Chapter 6 */}
      <ContentPage>
        <Text style={styles.chapterKicker}>CHAPTER 6</Text>
        <Text style={styles.h1}>Resources and a 30-day action plan</Text>
        <Text style={styles.h2}>Official BACB documents (free at bacb.com)</Text>
        <Bullet>BCBA Test Content Outline (6th ed.). The source for every domain and task in this guide.</Bullet>
        <Bullet>BCBA Handbook. Eligibility, application, scheduling, retake rules, and exam-day policies.</Bullet>
        <Bullet>Ethics Code for Behavior Analysts. Read it with the Domain E tasks beside it.</Bullet>
        <Text style={styles.h2}>Textbooks</Text>
        <Bullet>Cooper, Heron, and Heward, Applied Behavior Analysis (3rd ed.). Covers Domains A through H.</Bullet>
        <Bullet>Bailey and Burch, Ethics for Behavior Analysts. Case-based practice for Domain E.</Bullet>
        <Text style={styles.h2}>Practice</Text>
        <Text style={styles.p}>
          Behavior Study Tools, from Behavior School, has free BCBA practice questions written to the 6th
          Edition outline, with results by domain and a rationale on every answer. Use it for the week-4
          baseline in Chapter 2.
        </Text>
        <Text style={styles.h2}>Your first 30 days</Text>
        <Text style={styles.h3}>This week</Text>
        <Checkbox>Download the BCBA Test Content Outline (6th ed.) and read it once, start to finish.</Checkbox>
        <Checkbox>Check every study resource you own against the two edition tells in the introduction.</Checkbox>
        <Checkbox>Take a timed practice set, record your accuracy by domain, and put the 12-week schedule on a calendar.</Checkbox>
        <Text style={styles.h3}>Days 8 to 30</Text>
        <Checkbox>Finish Domains A, B, and C (weeks 1 to 3 of the schedule).</Checkbox>
        <Checkbox>Start a domain page for every domain and log each missed question against its task number.</Checkbox>
        <Checkbox>Take your week-4 timed set and compare it with the baseline.</Checkbox>
        <Checkbox>Confirm your eligibility status and schedule the exam date so the plan has an end.</Checkbox>
        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaTitle}>The guide tells you what to study. Practice tells you where you stand.</Text>
          <Text style={styles.ctaText}>
            Start with the free 6th Edition practice set: see the missed domain, review the rationale,
            and choose the next study task.
          </Text>
          <Link src={FREE_PRACTICE_URL} style={styles.ctaLink}>
            study.behaviorschool.com/free-practice
          </Link>
        </View>
      </ContentPage>

      {/* References */}
      <ContentPage>
        <Text style={styles.chapterKicker}>REFERENCES</Text>
        <Text style={styles.h1}>Sources</Text>
        <Text style={styles.reference}>
          Bailey, J. S., &amp; Burch, M. R. (2022). Ethics for behavior analysts (4th ed.). Routledge.
        </Text>
        <Text style={styles.reference}>
          Behavior Analyst Certification Board. (2020). Ethics code for behavior analysts.
          https://www.bacb.com/ethics-information/ethics-codes/
        </Text>
        <Text style={styles.reference}>
          Behavior Analyst Certification Board. (2022). BCBA test content outline (6th ed.).
          https://www.bacb.com/wp-content/bcba-outline-6thEd/
        </Text>
        <Text style={styles.reference}>
          Cooper, J. O., Heron, T. E., &amp; Heward, W. L. (2020). Applied behavior analysis (3rd ed.).
          Pearson.
        </Text>
        <Text style={[styles.p, { marginTop: 24, color: MUTED, fontSize: 9.5 }]}>
          Domain names, task counts, question counts, and percentages in Chapter 1 are reproduced from
          the BCBA Test Content Outline (6th ed.), updated September 2024. Verify against the current
          document at bacb.com before your exam; the BACB may revise it.
        </Text>
        <Text style={[styles.p, { marginTop: 8, color: MUTED, fontSize: 9.5 }]}>
          BCBA and BACB are registered trademarks of the Behavior Analyst Certification Board, Inc.
          Behavior School is not affiliated with or endorsed by the BACB.
        </Text>
        <Text style={[styles.p, { marginTop: 8, color: MUTED, fontSize: 9.5 }]}>
          © 2026 Behavior School. behaviorschool.com
        </Text>
      </ContentPage>
    </Document>
  );
}

async function main() {
  const buffer = await renderToBuffer(<Guide />);
  writeFileSync(OUTPUT_PATH, buffer);
  console.log(`Wrote ${OUTPUT_PATH} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
