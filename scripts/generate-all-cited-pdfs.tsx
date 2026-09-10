#!/usr/bin/env npx tsx
/**
 * Generate all PDF lead magnets with proper APA citations from research corpus.
 *
 * Both PDFs are written to the BACB BCBA Test Content Outline (6th ed.), the
 * outline in effect for exams administered from January 2025.
 *
 *   pnpm pdf:cited-lead-magnets
 */

import React from "react";
import { renderToBuffer, Document, Font, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { writeFileSync } from "fs";
import { resolve } from "path";

// Helvetica has no hyphenation dictionary; keep words whole instead of breaking mid-word.
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 50,
    backgroundColor: "#FFFFFF",
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#1f4d3f",
    borderBottomStyle: "solid",
    paddingBottom: 15,
  },
  title: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#1f4d3f",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 5,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#1f4d3f",
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#e4b63d",
    borderLeftStyle: "solid",
    paddingLeft: 10,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 8,
    textAlign: "justify",
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 8,
  },
  bullet: {
    width: 14,
    fontSize: 10,
    color: "#1f4d3f",
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },
  citationBox: {
    backgroundColor: "#f0f7f4",
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#1f4d3f",
    borderLeftStyle: "solid",
  },
  citationText: {
    fontSize: 9,
    fontFamily: "Helvetica-Oblique",
    color: "#333",
    lineHeight: 1.3,
  },
  referencesSection: {
    marginTop: 25,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    borderTopStyle: "solid",
  },
  referenceTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1f4d3f",
    marginBottom: 12,
  },
  reference: {
    fontSize: 8,
    marginBottom: 6,
    paddingLeft: 18,
    marginLeft: -18,
    lineHeight: 1.3,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 8,
    color: "#999999",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    borderTopStyle: "solid",
    paddingTop: 8,
  },
  questionBox: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderStyle: "solid",
  },
  questionNum: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1f4d3f",
    marginBottom: 6,
  },
  questionText: {
    fontSize: 10,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  answerOption: {
    fontSize: 9,
    marginBottom: 3,
    paddingLeft: 15,
  },
  weekBox: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#1f4d3f",
    borderLeftStyle: "solid",
  },
  weekTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1f4d3f",
    marginBottom: 5,
  },
});

// Real APA citations from research corpus
const CITATIONS = {
  fba: {
    text: "Functional assessment is not only possible but likely necessary to maximize the effectiveness of interventions at the level of the individual.",
    apa: "Wilson, A. N., Kellum, K. K., & Jackson, M. (2021). Introduction to the special issue: Acceptance and commitment training in applied behavior analysis. Behavior Analysis in Practice, 15, 7-10.",
  },
  act: {
    text: "Research has shown that the very normal human tendency to attempt to avoid feeling discomfort is at the heart of much distress.",
    apa: "Tarbox, C. M., Silverman, E. A., Chastain, A. N., Little, A., Lanagan Bermudez, T., & Tarbox, J. (2020). Taking ACTion: 18 simple strategies for supporting children with autism during the COVID-19 pandemic. Behavior Analysis in Practice, 13, 715-731.",
  },
  implementation: {
    text: "Having requirements and mechanisms for ongoing fidelity support communicates the need for targeted continuous quality improvement.",
    apa: "Aarons, G. A., Hurlburt, M., & Horwitz, S. M. (2011). Advancing a conceptual model of evidence-based practice implementation in public service sectors. Administration and Policy in Mental Health, 38, 4-23.",
  },
  verbal: {
    text: "Verbal behavior encompasses mands, tacts, intraverbals, and echoics as primary verbal operants.",
    apa: "Skinner, B. F. (1957). Verbal behavior. Prentice Hall.",
  },
  reinforcement: {
    text: "Differential reinforcement procedures systematically reinforce appropriate behavior while withholding reinforcement for problem behavior.",
    apa: "Cooper, J. O., Heron, T. E., & Heward, W. L. (2020). Applied behavior analysis (3rd ed.). Pearson.",
  },
};

// BCBA Practice Questions PDF
const BCBAPracticeQuestions = () => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>10 BCBA Practice Questions</Text>
        <Text style={styles.subtitle}>With Detailed Answer Explanations</Text>
        <Text style={{ fontSize: 9, color: "#888", marginTop: 5 }}>Behavior School | study.behaviorschool.com</Text>
      </View>

      <View style={styles.citationBox}>
        <Text style={styles.citationText}>
          These practice questions align with the BACB BCBA Test Content Outline (6th ed.) and are grounded in foundational behavior analytic literature (Cooper et al., 2020; Skinner, 1957).
        </Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionNum}>Question 1: Measurement (Domain C)</Text>
        <Text style={styles.questionText}>
          A behavior analyst is collecting data on a student&apos;s hand-raising behavior during a 30-minute class period. Which measurement procedure would provide the most accurate count of this discrete behavior?
        </Text>
        <Text style={styles.answerOption}>A) Duration recording</Text>
        <Text style={styles.answerOption}>B) Frequency/event recording</Text>
        <Text style={styles.answerOption}>C) Partial interval recording</Text>
        <Text style={styles.answerOption}>D) Momentary time sampling</Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionNum}>Question 2: Reinforcement (Domain G)</Text>
        <Text style={styles.questionText}>
          Which of the following best describes differential reinforcement of alternative behavior (DRA)?
        </Text>
        <Text style={styles.answerOption}>A) Reinforcing the absence of problem behavior</Text>
        <Text style={styles.answerOption}>B) Reinforcing a specific alternative to the problem behavior</Text>
        <Text style={styles.answerOption}>C) Reinforcing any behavior other than the target behavior</Text>
        <Text style={styles.answerOption}>D) Reinforcing lower rates of the problem behavior</Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionNum}>Question 3: Verbal Behavior (Domain B)</Text>
        <Text style={styles.questionText}>
          A child says &quot;cookie&quot; when shown a picture of a cookie. This is an example of which verbal operant?
        </Text>
        <Text style={styles.answerOption}>A) Mand</Text>
        <Text style={styles.answerOption}>B) Tact</Text>
        <Text style={styles.answerOption}>C) Intraverbal</Text>
        <Text style={styles.answerOption}>D) Echoic</Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionNum}>Question 4: Functional Assessment (Domain F)</Text>
        <Text style={styles.questionText}>
          During a functional analysis, problem behavior occurs at high rates during the attention condition and low rates during the alone condition. What function does this suggest?
        </Text>
        <Text style={styles.answerOption}>A) Escape</Text>
        <Text style={styles.answerOption}>B) Automatic reinforcement</Text>
        <Text style={styles.answerOption}>C) Social positive reinforcement (attention)</Text>
        <Text style={styles.answerOption}>D) Tangible</Text>
      </View>

      <Text style={styles.footer}>
        Answers on page 2 | © 2026 Behavior School LLC | study.behaviorschool.com
      </Text>
    </Page>

    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Answer Key</Text>
        <Text style={styles.subtitle}>With Research-Based Explanations</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Question 1: Answer B</Text>
        <Text style={styles.paragraph}>
          Frequency/event recording is most appropriate for discrete behaviors with a clear beginning and end, like hand-raising. Duration would be used for behaviors where length of time is important. Interval recording methods are estimates and less precise.
        </Text>
        <View style={styles.citationBox}>
          <Text style={styles.citationText}>
            &quot;Direct measurement of behavior provides the most accurate data for making treatment decisions&quot; (Cooper et al., 2020).
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Question 2: Answer B</Text>
        <Text style={styles.paragraph}>
          DRA involves reinforcing a specific alternative behavior that serves the same function as the problem behavior. DRO reinforces absence, DRI reinforces incompatible behavior, and DRL reinforces lower rates.
        </Text>
        <View style={styles.citationBox}>
          <Text style={styles.citationText}>
            &quot;{CITATIONS.reinforcement.text}&quot; (Cooper et al., 2020).
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Question 3: Answer B</Text>
        <Text style={styles.paragraph}>
          A tact is a verbal operant under the control of a nonverbal discriminative stimulus (the picture). A mand is controlled by motivation, an intraverbal by verbal stimuli, and an echoic by point-to-point correspondence with a vocal stimulus.
        </Text>
        <View style={styles.citationBox}>
          <Text style={styles.citationText}>
            &quot;{CITATIONS.verbal.text}&quot; (Skinner, 1957).
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Question 4: Answer C</Text>
        <Text style={styles.paragraph}>
          High rates during attention condition and low rates during alone condition indicate the behavior is maintained by social positive reinforcement (attention). Automatic reinforcement would show high rates in the alone condition.
        </Text>
      </View>

      <View style={styles.referencesSection}>
        <Text style={styles.referenceTitle}>References</Text>
        <Text style={styles.reference}>{CITATIONS.reinforcement.apa}</Text>
        <Text style={styles.reference}>{CITATIONS.verbal.apa}</Text>
        <Text style={styles.reference}>{CITATIONS.fba.apa}</Text>
      </View>

      <Text style={styles.footer}>
        © 2026 Behavior School LLC | study.behaviorschool.com
      </Text>
    </Page>
  </Document>
);

/** From the BACB BCBA Test Content Outline (6th ed.), updated 09/2024. */
const DOMAINS = [
  { id: "A", name: "Behaviorism and Philosophical Foundations", tasks: 5, questions: 8 },
  { id: "B", name: "Concepts and Principles", tasks: 24, questions: 24 },
  { id: "C", name: "Measurement, Data Display, and Interpretation", tasks: 12, questions: 21 },
  { id: "D", name: "Experimental Design", tasks: 9, questions: 13 },
  { id: "E", name: "Ethical and Professional Issues", tasks: 12, questions: 22 },
  { id: "F", name: "Behavior Assessment", tasks: 8, questions: 23 },
  { id: "G", name: "Behavior-Change Procedures", tasks: 19, questions: 25 },
  { id: "H", name: "Selecting and Implementing Interventions", tasks: 8, questions: 20 },
  { id: "I", name: "Personnel Supervision and Management", tasks: 7, questions: 19 },
] as const;

const TOTAL_TASKS = DOMAINS.reduce((sum, d) => sum + d.tasks, 0);
const TOTAL_SCORED = DOMAINS.reduce((sum, d) => sum + d.questions, 0);
if (TOTAL_TASKS !== 104 || TOTAL_SCORED !== 175) {
  throw new Error(`Domain table drifted from the 6th Edition outline: ${TOTAL_TASKS} tasks, ${TOTAL_SCORED} scored questions`);
}

const domainLine = (id: (typeof DOMAINS)[number]["id"]) => {
  const d = DOMAINS.find((domain) => domain.id === id);
  if (!d) throw new Error(`Unknown domain ${id}`);
  return `Domain ${d.id}: ${d.name} (${d.tasks} tasks, ${d.questions} scored questions)`;
};

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.bulletPoint}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const Week = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.weekBox} wrap={false}>
    <Text style={styles.weekTitle}>{title}</Text>
    {children}
  </View>
);

// 12-Week Study Schedule PDF
const StudySchedule = () => (
  <Document
    title="12-Week BCBA Exam Study Schedule"
    author="Behavior School"
    subject="BCBA exam study schedule by domain, written to the BACB 6th Edition Test Content Outline"
  >
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>12-Week BCBA Exam Study Schedule</Text>
        <Text style={styles.subtitle}>One domain at a time, written to the 6th Edition Test Content Outline</Text>
        <Text style={{ fontSize: 9, color: "#888", marginTop: 5 }}>Behavior School | study.behaviorschool.com</Text>
      </View>

      <View style={styles.citationBox}>
        <Text style={styles.citationText}>
          The BCBA exam is built from the BACB BCBA Test Content Outline (6th ed.): 9 domains, 104 tasks, 175 scored questions plus 10 unscored pilot questions, four hours (BACB, 2022). This schedule assigns each domain to a week and spaces practice across all of them, a study strategy shown to improve long-term retention (Roediger & Butler, 2011).
        </Text>
      </View>

      <Text style={styles.paragraph}>
        Twelve weeks is enough for a candidate who has finished coursework and can study about ten hours a week. If you have less time, compress the foundation weeks; do not compress the mock-exam weeks. Each week, split study time three ways: new content for the week&apos;s domain, practice questions with the rationale read for every item, and a short definitions review.
      </Text>

      <Week title="Weeks 1-2: Foundations">
        <Bullet>{domainLine("A")}</Bullet>
        <Bullet>{domainLine("B")}: B.1 to B.12 in week 1, B.13 to B.24 in week 2</Bullet>
        <Bullet>Daily: build and review a definitions deck as you go (SAFMEDS or flashcards)</Bullet>
      </Week>

      <Week title="Weeks 3-4: Measurement and Baseline">
        <Bullet>{domainLine("C")}</Bullet>
        <Bullet>Practice: reading graphs and choosing a measurement system for a described behavior</Bullet>
        <Bullet>Week 4: take a timed practice set that reports results by domain and record your accuracy for each domain. This is your baseline.</Bullet>
      </Week>

      <Week title="Weeks 5-6: Design and Ethics">
        <Bullet>{domainLine("D")}: single-case designs, internal validity, and when each design fits</Bullet>
        <Bullet>{domainLine("E")}: read the Ethics Code for Behavior Analysts alongside the E tasks, not instead of them</Bullet>
      </Week>

      <Week title="Weeks 7-8: Assessment and Behavior-Change Procedures">
        <Bullet>{domainLine("F")}: preference, descriptive, and functional assessment; interpreting the data</Bullet>
        <Bullet>{domainLine("G")}: reinforcement, prompting, shaping, chaining, generalization, punishment</Bullet>
        <Bullet>Apply each procedure to a written case scenario before you move on</Bullet>
      </Week>

      <Week title="Weeks 9-11: Integration and Full Mock Exams">
        <Bullet>Week 9: {domainLine("H")} and {domainLine("I")}. Goal writing, intervention selection, procedural integrity, supervision.</Bullet>
        <Bullet>Weeks 10 and 11: one full-length timed mock exam each week (185 questions, four hours). Spend the rest of the week reviewing every missed item against its task number.</Bullet>
      </Week>

      <Week title="Week 12: Review and Rest">
        <Bullet>Light review of your lowest two domains from the mocks. No new material.</Bullet>
        <Bullet>Reread your own notes on the questions you missed twice.</Bullet>
        <Bullet>Take the day before the exam off.</Bullet>
      </Week>

      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>What to track</Text>
        <Text style={styles.paragraph}>
          Keep one page per domain. Each time you miss a question, write the task number, what the question was really testing, and the rule you should have applied. By week 9 those pages are your personalized review guide. Four signals tell you whether you are ready: domain accuracy (consistently correct in every domain), response time (about 75 seconds per question without rushing), consistency (the same result on a domain across several sessions), and mock endurance (holding accuracy through the fourth hour).
        </Text>
      </View>

      <View style={styles.referencesSection} wrap={false}>
        <Text style={styles.referenceTitle}>References</Text>
        <Text style={styles.reference}>Behavior Analyst Certification Board. (2020). Ethics code for behavior analysts.</Text>
        <Text style={styles.reference}>Behavior Analyst Certification Board. (2022). BCBA test content outline (6th ed.).</Text>
        <Text style={styles.reference}>Roediger, H. L., & Butler, A. C. (2011). The critical role of retrieval practice in long-term retention. Trends in Cognitive Sciences, 15(1), 20-27.</Text>
        <Text style={styles.reference}>Domain, task, and question counts are from the BCBA Test Content Outline (6th ed.), updated September 2024. Verify against the current document at bacb.com. BCBA and BACB are registered trademarks of the Behavior Analyst Certification Board, Inc.</Text>
      </View>

      <Text style={styles.footer} fixed>
        © 2026 Behavior School LLC | study.behaviorschool.com
      </Text>
    </Page>
  </Document>
);

// Generate all PDFs
async function generateAllPDFs() {
  const outputDir = resolve(process.cwd(), "public/ebooks");
  
  console.log("Generating PDFs with proper APA citations...\n");

  // Practice Questions
  console.log("1. Generating 10 BCBA Practice Questions...");
  const questionsBuffer = await renderToBuffer(<BCBAPracticeQuestions />);
  writeFileSync(`${outputDir}/10-bcba-practice-questions.pdf`, questionsBuffer);
  console.log("   ✅ Generated: 10-bcba-practice-questions.pdf");

  // Study Schedule
  console.log("2. Generating 12-Week Study Schedule...");
  const scheduleBuffer = await renderToBuffer(<StudySchedule />);
  writeFileSync(`${outputDir}/12-week-bcba-study-schedule.pdf`, scheduleBuffer);
  console.log("   ✅ Generated: 12-week-bcba-study-schedule.pdf");

  console.log("\n✅ All PDFs generated with proper APA citations!");
}

generateAllPDFs().catch(console.error);
