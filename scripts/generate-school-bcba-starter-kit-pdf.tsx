#!/usr/bin/env npx tsx
/**
 * Generate public/ebooks/school-bcba-starter-kit.pdf (The School BCBA Starter Kit).
 *
 * The kit is a set of printable, fill-in working forms for a school-based BCBA. Every
 * form is adapted from templates Rob already uses (caseload triage rules, FBA triage
 * and hypothesis builder, ABC and opportunity data sheets, BIP structure, BIP
 * implementation fidelity checklist, 10-minute staff training structure, coaching
 * language, progress review decision rules). It contains no research claims,
 * statistics, or testimonials.
 *
 * Ethics section numbers are taken from the BACB Ethics Code for Behavior Analysts
 * (effective January 1, 2022): https://www.bacb.com/ethics-information/ethics-codes/
 *
 * Run: pnpm pdf:school-bcba-starter-kit
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

const OUTPUT_PATH = resolve(process.cwd(), "public/ebooks/school-bcba-starter-kit.pdf");

const TRANSFORMATION_URL =
  "https://behaviorschool.com/transformation-program?utm_source=starter_kit_pdf&utm_medium=pdf&utm_campaign=school_bcba_starter_kit";
const ETHICS_CODE_URL = "https://www.bacb.com/ethics-information/ethics-codes/";

const GREEN = "#1f4d3f";
const GOLD = "#e4b63d";
const INK = "#1a1a1a";
const MUTED = "#5f6b66";
const LINE = "#c9d3ce";
const PALE = "#f0f7f4";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 48,
    paddingBottom: 54,
    paddingHorizontal: 50,
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
  coverKicker: { fontSize: 11, letterSpacing: 2, color: GOLD, marginBottom: 28 },
  coverTitle: { fontFamily: "Helvetica-Bold", fontSize: 42, lineHeight: 1.08, marginBottom: 18 },
  coverSubtitle: { fontSize: 15, lineHeight: 1.4, color: "#dfe9e4", maxWidth: 400 },
  coverRule: { width: 56, height: 3, backgroundColor: GOLD, marginVertical: 26 },
  coverList: { fontSize: 11, lineHeight: 1.6, color: "#c9d8d1" },
  coverBrand: { fontFamily: "Helvetica-Bold", fontSize: 13, letterSpacing: 1 },
  coverMeta: { fontSize: 10.5, lineHeight: 1.5, color: "#c9d8d1" },

  kicker: { fontSize: 9, letterSpacing: 1.5, color: MUTED, marginBottom: 5 },
  h1: { fontFamily: "Helvetica-Bold", fontSize: 20, color: GREEN, marginBottom: 6, lineHeight: 1.2 },
  lede: { fontSize: 10, lineHeight: 1.5, color: MUTED, marginBottom: 12 },
  h2: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: GREEN,
    marginTop: 12,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
    borderLeftStyle: "solid",
    paddingLeft: 7,
  },
  h3: { fontFamily: "Helvetica-Bold", fontSize: 10.5, color: INK, marginTop: 6, marginBottom: 3 },
  p: { fontSize: 10, lineHeight: 1.5, marginBottom: 6 },
  small: { fontSize: 8.5, lineHeight: 1.4, color: MUTED },

  bulletRow: { flexDirection: "row", marginBottom: 3, paddingLeft: 4 },
  bulletDot: { width: 11, fontSize: 10, color: GREEN },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.45 },

  checkbox: { flexDirection: "row", marginBottom: 4 },
  checkboxBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: GREEN,
    borderStyle: "solid",
    marginRight: 7,
    marginTop: 2,
  },

  callout: {
    backgroundColor: PALE,
    borderLeftWidth: 3,
    borderLeftColor: GREEN,
    borderLeftStyle: "solid",
    padding: 9,
    marginVertical: 8,
  },
  calloutLabel: { fontFamily: "Helvetica-Bold", fontSize: 9, color: GREEN, marginBottom: 2 },
  calloutText: { fontSize: 9.5, lineHeight: 1.5 },

  fieldRow: { flexDirection: "row", gap: 10, marginBottom: 7 },
  field: { flex: 1 },
  fieldLabel: { fontSize: 8, color: MUTED, marginBottom: 2, letterSpacing: 0.3 },
  fieldLine: {
    borderBottomWidth: 1,
    borderBottomColor: INK,
    borderBottomStyle: "solid",
    height: 14,
  },

  box: {
    borderWidth: 1,
    borderColor: LINE,
    borderStyle: "solid",
    marginBottom: 7,
  },
  boxTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#ffffff",
    backgroundColor: GREEN,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  boxHint: { fontSize: 8, color: MUTED, paddingHorizontal: 7, paddingTop: 4 },
  boxBody: { paddingHorizontal: 7, paddingBottom: 6 },
  ruled: {
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    borderBottomStyle: "solid",
    height: 14,
  },

  table: { borderWidth: 1, borderColor: LINE, borderStyle: "solid", marginBottom: 8 },
  trHead: { flexDirection: "row", backgroundColor: GREEN },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    borderBottomStyle: "solid",
  },
  trBand: {
    flexDirection: "row",
    backgroundColor: PALE,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    borderBottomStyle: "solid",
  },
  th: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#ffffff",
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: "#3d6b5c",
    borderRightStyle: "solid",
  },
  td: {
    fontSize: 8.5,
    paddingVertical: 3,
    paddingHorizontal: 5,
    lineHeight: 1.3,
    borderRightWidth: 1,
    borderRightColor: LINE,
    borderRightStyle: "solid",
  },
  tdBold: { fontFamily: "Helvetica-Bold" },
  tdBlank: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: LINE,
    borderRightStyle: "solid",
  },

  scale: { fontSize: 8.5, color: INK, textAlign: "center", letterSpacing: 2 },

  tocRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5ebe8",
    borderBottomStyle: "dotted",
    paddingVertical: 6,
  },
  tocLabel: { fontSize: 10.5 },
  tocPage: { fontSize: 10.5, color: MUTED },

  footer: {
    position: "absolute",
    bottom: 26,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#8a948f",
    borderTopWidth: 1,
    borderTopColor: "#e5ebe8",
    borderTopStyle: "solid",
    paddingTop: 6,
  },

  ctaBox: { backgroundColor: GREEN, color: "#ffffff", padding: 14, marginTop: 10 },
  ctaTitle: { fontFamily: "Helvetica-Bold", fontSize: 13, color: "#ffffff", marginBottom: 6 },
  ctaText: { fontSize: 10, lineHeight: 1.5, color: "#dfe9e4", marginBottom: 6 },
  ctaLink: { fontFamily: "Helvetica-Bold", fontSize: 11, color: GOLD, textDecoration: "none" },
});

/* ---------- small building blocks ---------- */

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
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

function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.callout} wrap={false}>
      <Text style={styles.calloutLabel}>{label}</Text>
      <Text style={styles.calloutText}>{children}</Text>
    </View>
  );
}

function Fields({ labels }: { labels: string[] }) {
  return (
    <View style={styles.fieldRow}>
      {labels.map((label) => (
        <View key={label} style={styles.field}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <View style={styles.fieldLine} />
        </View>
      ))}
    </View>
  );
}

function Box({
  title,
  hint,
  lines = 0,
  children,
}: {
  title: string;
  hint?: string;
  lines?: number;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.box} wrap={false}>
      <Text style={styles.boxTitle}>{title}</Text>
      {hint ? <Text style={styles.boxHint}>{hint}</Text> : null}
      <View style={styles.boxBody}>
        {children}
        {Array.from({ length: lines }).map((_, i) => (
          <View key={i} style={styles.ruled} />
        ))}
      </View>
    </View>
  );
}

type Col = { label: string; flex: number; align?: "left" | "center" };

function Table({
  cols,
  rows,
  blankRows = 0,
  blankHeight = 22,
}: {
  cols: Col[];
  rows?: (string | { text: string; bold?: boolean })[][];
  blankRows?: number;
  blankHeight?: number;
}) {
  return (
    <View style={styles.table}>
      <View style={styles.trHead} fixed>
        {cols.map((c, i) => (
          <Text
            key={c.label}
            style={[
              styles.th,
              { flex: c.flex, textAlign: c.align ?? "left" },
              i === cols.length - 1 ? { borderRightWidth: 0 } : {},
            ]}
          >
            {c.label}
          </Text>
        ))}
      </View>
      {(rows ?? []).map((r, ri) => (
        <View key={ri} style={styles.tr} wrap={false}>
          {r.map((cell, ci) => {
            const text = typeof cell === "string" ? cell : cell.text;
            const bold = typeof cell === "string" ? false : Boolean(cell.bold);
            return (
              <Text
                key={ci}
                style={[
                  styles.td,
                  bold ? styles.tdBold : {},
                  { flex: cols[ci].flex, textAlign: cols[ci].align ?? "left" },
                  ci === r.length - 1 ? { borderRightWidth: 0 } : {},
                ]}
              >
                {text}
              </Text>
            );
          })}
        </View>
      ))}
      {Array.from({ length: blankRows }).map((_, ri) => (
        <View key={`b${ri}`} style={[styles.tr, { height: blankHeight }]} wrap={false}>
          {cols.map((c, ci) => (
            <View
              key={ci}
              style={[
                styles.tdBlank,
                { flex: c.flex },
                ci === cols.length - 1 ? { borderRightWidth: 0 } : {},
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer} fixed>
      <Text>The School BCBA Starter Kit · Behavior School · behaviorschool.com</Text>
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

function PageHeading({ kicker, title, lede }: { kicker: string; title: string; lede?: string }) {
  return (
    <View>
      <Text style={styles.kicker}>{kicker}</Text>
      <Text style={styles.h1}>{title}</Text>
      {lede ? <Text style={styles.lede}>{lede}</Text> : null}
    </View>
  );
}

/* ---------- contents ---------- */

const CONTENTS = [
  { label: "How to use this kit", page: 2 },
  { label: "Form 1: First 30 Days Roadmap", page: 3 },
  { label: "Form 2: Caseload Triage Sheet", page: 4 },
  { label: "Form 3: FBA Checklist and Hypothesis Builder", page: 5 },
  { label: "Form 4: ABC Data Sheet", page: 6 },
  { label: "Form 5: Opportunity Data Sheet (+ / -)", page: 7 },
  { label: "Form 6: One-Page Behavior Intervention Plan", page: 8 },
  { label: "Form 7: BIP Feasibility Filter and Staff One-Pager", page: 9 },
  { label: "Form 8: BIP Implementation Fidelity Checklist", page: 10 },
  { label: "Form 9: 15-Minute Teacher Consultation Guide", page: 11 },
  { label: "Form 10: Progress Review Decision Rules", page: 12 },
  { label: "Form 11: Ethics Quick Reference for School Settings", page: 13 },
  { label: "What to do this week", page: 14 },
];

const SCALE = "0     1     2     3";

function Kit() {
  return (
    <Document
      title="The School BCBA Starter Kit"
      author="Behavior School"
      subject="Printable working forms for school-based BCBAs: caseload triage, FBA, data sheets, BIP, fidelity, consultation, decision rules, ethics."
      keywords="school BCBA, FBA checklist, BIP template, ABC data sheet, fidelity checklist, teacher consultation"
      creator="Behavior School"
      producer="Behavior School"
    >
      {/* Cover */}
      <Page size="LETTER" style={styles.cover}>
        <View>
          <Text style={styles.coverKicker}>ELEVEN PRINTABLE WORKING FORMS</Text>
          <Text style={styles.coverTitle}>The School BCBA Starter Kit</Text>
          <Text style={styles.coverSubtitle}>
            The forms a school-based BCBA needs in the first month: triage the caseload, run a
            defensible FBA, write a plan staff can actually follow, check fidelity, and make the next
            decision on time.
          </Text>
          <View style={styles.coverRule} />
          <Text style={styles.coverList}>
            30-day roadmap · Caseload triage · FBA checklist · ABC and opportunity data sheets ·
            One-page BIP · Staff one-pager · Fidelity checklist · 15-minute consultation ·
            Decision rules · Ethics quick reference
          </Text>
        </View>
        <View>
          <Text style={styles.coverBrand}>BEHAVIOR SCHOOL</Text>
          <Text style={styles.coverMeta}>behaviorschool.com · 2026 edition</Text>
        </View>
      </Page>

      {/* How to use */}
      <ContentPage>
        <PageHeading
          kicker="START HERE"
          title="How to use this kit"
          lede="Print it. Most pages are forms meant to be filled in by hand or copied into your own documents. Nothing here replaces your district's required formats; it gives you a working version to bring to the meeting."
        />
        <Text style={styles.h2}>The order the forms are meant to be used</Text>
        <Bullet>
          Week 1: the 30-Day Roadmap (Form 1) and the Caseload Triage Sheet (Form 2). Before touching a
          single student file, decide what needs you first.
        </Bullet>
        <Bullet>
          For each referral: the FBA Checklist (Form 3) tells you the minimum data you need, and the ABC
          and Opportunity Data Sheets (Forms 4 and 5) collect it.
        </Bullet>
        <Bullet>
          Writing the plan: the One-Page BIP (Form 6), then the Feasibility Filter and Staff One-Pager
          (Form 7). If the plan fails the filter, fix the plan before training anyone on it.
        </Bullet>
        <Bullet>
          After the plan starts: the Fidelity Checklist (Form 8) and the 15-Minute Consultation (Form 9)
          are your weekly routine. The Decision Rules (Form 10) tell you what to do with what you find.
        </Bullet>
        <Bullet>Form 11 is the page to read when an adult asks you to do something that feels off.</Bullet>

        <Text style={styles.h2}>Contents</Text>
        {CONTENTS.map((c) => (
          <View key={c.label} style={styles.tocRow}>
            <Text style={styles.tocLabel}>{c.label}</Text>
            <Text style={styles.tocPage}>{c.page}</Text>
          </View>
        ))}

        <Callout label="A note on student information">
          Use a student code, not a name, on every form you carry between rooms. Keep completed forms in
          the record your district designates; do not photograph them on a personal phone.
        </Callout>
      </ContentPage>

      {/* Form 1: 30 days */}
      <ContentPage>
        <PageHeading
          kicker="FORM 1"
          title="First 30 Days Roadmap"
          lede="One goal per week. Check items off as you go. The point of the first month is not to fix every case; it is to learn the system, decide priorities, and set routines that will hold up in November."
        />
        <Text style={styles.h2}>Week 1: Learn the system before you change it</Text>
        <Checkbox>Get the caseload list, the referral process, and the forms your district requires for FBAs and BIPs.</Checkbox>
        <Checkbox>Meet the people who control your calendar: school psychologist, special education director, site principals.</Checkbox>
        <Checkbox>Find out how behavior data is currently collected at each site, if at all.</Checkbox>
        <Checkbox>Read every current BIP on the caseload. Note the date, the last data point, and whether anyone can name the plan&apos;s strategies.</Checkbox>
        <Checkbox>Learn the emergency and restraint reporting procedure before you need it.</Checkbox>

        <Text style={styles.h2}>Week 2: Triage the caseload</Text>
        <Checkbox>Complete the Caseload Triage Sheet (Form 2) for every student and referral.</Checkbox>
        <Checkbox>Flag safety concerns and plans with no data in the last 30 days. Those come first.</Checkbox>
        <Checkbox>Set a review date for every case, even the ones that look fine.</Checkbox>
        <Checkbox>Send your supervisor a one-page summary: priorities, what you need, and what will wait.</Checkbox>

        <Text style={styles.h2}>Week 3: Build the routines</Text>
        <Checkbox>Put a recurring 15-minute consultation on the calendar with each teacher who runs a plan (Form 9).</Checkbox>
        <Checkbox>Do one fidelity observation per active plan using Form 8. Score it; do not just watch.</Checkbox>
        <Checkbox>Start ABC or opportunity data (Forms 4 and 5) on the two highest-priority referrals.</Checkbox>
        <Checkbox>Block a weekly 30-minute caseload review on your own calendar and protect it.</Checkbox>

        <Text style={styles.h2}>Week 4: Make the first decisions</Text>
        <Checkbox>Apply the Decision Rules (Form 10) to every plan you observed. Write the decision, the owner, and the review date.</Checkbox>
        <Checkbox>Write or revise one plan using Forms 6 and 7. Train staff on it in 10 minutes, not 60.</Checkbox>
        <Checkbox>Close or hand off anything on the triage sheet that is not a behavior-analytic problem.</Checkbox>
        <Checkbox>Repeat the Week 2 summary to your supervisor with what changed.</Checkbox>

        <Callout label="If you only do one thing in the first month">
          Get a data point on every plan. A plan with no data cannot be defended, revised, or faded.
        </Callout>
      </ContentPage>

      {/* Form 2: Triage */}
      <ContentPage>
        <PageHeading
          kicker="FORM 2"
          title="Caseload Triage Sheet"
          lede="One row per student or referral. Fill in the whole sheet before acting on any single row; the point is to see the caseload at once."
        />
        <Fields labels={["BCBA", "Site(s)", "Date completed", "Next full review"]} />
        <Table
          cols={[
            { label: "Student code", flex: 1.1 },
            { label: "Referral concern (observable)", flex: 2.4 },
            { label: "Safety risk?", flex: 0.8, align: "center" },
            { label: "Data in last 30 days?", flex: 0.9, align: "center" },
            { label: "Priority", flex: 0.7, align: "center" },
            { label: "Next action", flex: 2 },
            { label: "Owner", flex: 0.9 },
            { label: "Review date", flex: 0.9 },
          ]}
          blankRows={12}
          blankHeight={26}
        />
        <Text style={styles.h2}>How to assign priority</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h3}>Priority 1: this week</Text>
            <Bullet>Any safety risk to the student or others.</Bullet>
            <Bullet>An active plan with no data in 30 days.</Bullet>
            <Bullet>A legal timeline (assessment plan, IEP date) inside 30 days.</Bullet>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.h3}>Priority 2: this month</Text>
            <Bullet>A plan with data that is flat or worsening.</Bullet>
            <Bullet>A new referral with a clear, observable concern.</Bullet>
            <Bullet>Staff who report they cannot run the plan.</Bullet>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.h3}>Priority 3: scheduled</Text>
            <Bullet>Plans with improving data; keep the review date.</Bullet>
            <Bullet>Referrals that are not yet stated in observable terms; send back for clarification.</Bullet>
            <Bullet>Requests that belong to another provider; refer.</Bullet>
          </View>
        </View>
      </ContentPage>

      {/* Form 3: FBA */}
      <ContentPage>
        <PageHeading
          kicker="FORM 3"
          title="FBA Checklist and Hypothesis Builder"
          lede="Collect the minimum data needed for a defensible hypothesis, then stop and write the plan. Assessment that drifts for weeks is a caseload problem."
        />
        <Fields labels={["Student code", "Referral date", "Decision date (assessment ends)", "Assessor"]} />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h2}>A. Triage before you collect</Text>
            <Checkbox>Referral concern is written in observable terms.</Checkbox>
            <Checkbox>Immediate safety or crisis concerns identified and addressed.</Checkbox>
            <Checkbox>Setting, staff, schedule, and known triggers are listed.</Checkbox>
            <Checkbox>Existing data and gaps listed before collecting anything new.</Checkbox>
            <Checkbox>Minimum additional data chosen (see B).</Checkbox>
            <Checkbox>Decision date set and shared with the team.</Checkbox>
            <Text style={styles.h2}>Stop assessing and write the plan when</Text>
            <Checkbox>The hypothesis is one sentence a teacher can repeat.</Checkbox>
            <Checkbox>At least one direct-observation source agrees with the interviews.</Checkbox>
            <Checkbox>A baseline number exists (rate, duration, or percent of opportunities).</Checkbox>
            <Checkbox>The replacement skill is named and is easier than the problem behavior.</Checkbox>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.h2}>B. Data sources (check what you will use)</Text>
            <Text style={styles.h3}>Record review</Text>
            <Checkbox>Previous FBA / BIP and their dates</Checkbox>
            <Checkbox>Current IEP: behavior and social-emotional goals, present levels</Checkbox>
            <Checkbox>Psychoeducational, academic, speech, OT reports</Checkbox>
            <Checkbox>Attendance, discipline, and nurse or health records</Checkbox>
            <Text style={styles.h3}>Interviews</Text>
            <Checkbox>Teacher(s) and paraprofessional(s)</Checkbox>
            <Checkbox>Parent or guardian</Checkbox>
            <Checkbox>Student, when appropriate</Checkbox>
            <Text style={styles.h3}>Direct observation</Text>
            <Checkbox>ABC data across settings and times (Form 4)</Checkbox>
            <Checkbox>Frequency, duration, or opportunity data (Form 5)</Checkbox>
          </View>
        </View>

        <Text style={styles.h2}>C. Hypothesis builder</Text>
        <Table
          cols={[
            { label: "Component", flex: 1.2 },
            { label: "Question to answer", flex: 2.2 },
            { label: "What the data show", flex: 2.6 },
          ]}
          rows={[
            [{ text: "Antecedent / context", bold: true }, "When and where is it most and least likely?", ""],
            [{ text: "Behavior", bold: true }, "What observable action is being counted?", ""],
            [{ text: "Consequence / function clue", bold: true }, "What changes right after it that may maintain it?", ""],
            [{ text: "Skill gap", bold: true }, "What replacement or tolerance skill is missing?", ""],
            [{ text: "Environmental fit", bold: true }, "What adult or system response makes the plan harder to run?", ""],
          ]}
        />
        <Box title="Hypothesis statement" hint="When [antecedent/context], [student] does [behavior], and as a result [consequence]. The behavior is more likely when [setting events]." lines={2} />
      </ContentPage>

      {/* Form 4: ABC */}
      <ContentPage>
        <PageHeading
          kicker="FORM 4"
          title="ABC Data Sheet"
          lede="Describe what happened, not why. Write what the adult did after the behavior, even when it was the right thing. The first row is an example; start recording on row two."
        />
        <Fields labels={["Student code", "Setting / activity", "Observer", "Date"]} />
        <Table
          cols={[
            { label: "Time", flex: 0.6 },
            { label: "Antecedent (what happened right before)", flex: 2 },
            { label: "Behavior (what the student did)", flex: 2 },
            { label: "Consequence (what happened right after)", flex: 2 },
            { label: "Likely function", flex: 0.9 },
          ]}
          rows={[
            [
              "12:30",
              "Teacher asked him to get out his math book.",
              "Pushed the math book onto the floor with his right hand.",
              "Got out of math for 5 minutes until the teacher asked him to pick up the book.",
              "Escape",
            ],
          ]}
          blankRows={10}
          blankHeight={28}
        />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1.2 }}>
            <Text style={styles.h2}>Function tally for this sheet</Text>
            <Table
              cols={[
                { label: "Likely function", flex: 2 },
                { label: "Tally", flex: 2 },
                { label: "Total", flex: 0.7, align: "center" },
              ]}
              rows={[
                [{ text: "Escape / avoidance", bold: true }, "", ""],
                [{ text: "Attention", bold: true }, "", ""],
                [{ text: "Access to items or activities", bold: true }, "", ""],
                [{ text: "Sensory / automatic", bold: true }, "", ""],
              ]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.h2}>Writing tips</Text>
            <Bullet>Antecedent: the instruction, transition, peer action, or change that came immediately before.</Bullet>
            <Bullet>Behavior: what a camera would record. &quot;Refused&quot; is a conclusion; &quot;put head down and did not pick up pencil for 3 minutes&quot; is a behavior.</Bullet>
            <Bullet>Consequence: what people did and what the student got or got out of.</Bullet>
            <Bullet>Likely function is a guess per row. The pattern across rows is what matters.</Bullet>
          </View>
        </View>
      </ContentPage>

      {/* Form 5: Opportunity data */}
      <ContentPage>
        <PageHeading
          kicker="FORM 5"
          title="Opportunity Data Sheet (+ / -)"
          lede="For replacement behaviors and skills the plan is teaching. Each cell is one opportunity: circle + if the student used the skill, - if not. Percent correct per activity is the number you graph."
        />
        <Fields labels={["Student code", "Date", "Recorder"]} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Box title="Skill 1" hint="Name and definition (what it looks like when the student does it):" lines={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Box title="Skill 2" hint="Name and definition:" lines={2} />
          </View>
        </View>

        <Text style={styles.h2}>Skill 1</Text>
        <Table
          cols={[
            { label: "Activity / time", flex: 1.6 },
            ...Array.from({ length: 10 }).map((_, i) => ({ label: `${i + 1}`, flex: 0.5, align: "center" as const })),
            { label: "% correct", flex: 0.9, align: "center" },
          ]}
          rows={Array.from({ length: 5 }).map(() => ["", ...Array.from({ length: 10 }).map(() => "+ / -"), "/10 ="])}
        />

        <Text style={styles.h2}>Skill 2</Text>
        <Table
          cols={[
            { label: "Activity / time", flex: 1.6 },
            ...Array.from({ length: 10 }).map((_, i) => ({ label: `${i + 1}`, flex: 0.5, align: "center" as const })),
            { label: "% correct", flex: 0.9, align: "center" },
          ]}
          rows={Array.from({ length: 5 }).map(() => ["", ...Array.from({ length: 10 }).map(() => "+ / -"), "/10 ="])}
        />

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h2}>Problem behavior count (same day)</Text>
            <Table
              cols={[
                { label: "Behavior", flex: 1.4 },
                { label: "Activity / time", flex: 1.2 },
                { label: "Tally", flex: 1.6 },
                { label: "Total", flex: 0.6, align: "center" },
              ]}
              blankRows={3}
              blankHeight={20}
            />
          </View>
          <View style={{ flex: 0.9 }}>
            <Text style={styles.h2}>Choosing the measure</Text>
            <Bullet>Frequency or rate: discrete behaviors with a clear start and end (hits, call-outs).</Bullet>
            <Bullet>Duration: behaviors that vary in length (out of seat, crying).</Bullet>
            <Bullet>Opportunity (+ / -): skills that only happen when a chance is presented (requesting a break, accepting &quot;no&quot;).</Bullet>
            <Bullet>If staff cannot keep the measure for a full day, simplify it before you decide anything with it.</Bullet>
          </View>
        </View>
      </ContentPage>

      {/* Form 6: BIP */}
      <ContentPage>
        <PageHeading
          kicker="FORM 6"
          title="One-Page Behavior Intervention Plan"
          lede="Every section your district's BIP asks for, on one page, in the order staff will need it during the school day. Draft here, then move it into the required format."
        />
        <Fields labels={["Student code", "Grade / setting", "Plan date", "Review date", "Case manager"]} />
        <Box title="Target behavior for reduction" hint="Observable and measurable definition. Then list precursors (what you see just before) and triggers (what usually sets it off)." lines={2} />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Box title="Baseline" hint="How often or how long, and how it was measured." lines={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Box title="Hypothesized function" hint="To get / to avoid / sensory. From Form 3, in one sentence." lines={2} />
          </View>
        </View>
        <Box title="Replacement behavior" hint="What the student will do instead. Must serve the same function and be easier than the problem behavior. Include the baseline for this skill." lines={2} />
        <Box title="Antecedent strategies (prevention)" hint="Changes to time, space, materials, instructions, choices, or breaks that make the problem behavior less likely. State who does what and when." lines={2} />
        <Box title="Teaching and reinforcement" hint="How and when the replacement behavior is taught and practiced; what the student earns, how often, and from whom." lines={2} />
        <Box title="Response to precursors, target behavior, and escalation" hint="First response to precursors; what staff do if the behavior occurs so it is not reinforced; de-escalation and safety steps; when and how parents are notified." lines={2} />
        <Table
          cols={[
            { label: "Data to be collected", flex: 1.6 },
            { label: "Procedure / form", flex: 1.4 },
            { label: "Person responsible", flex: 1 },
            { label: "How often", flex: 0.8 },
          ]}
          blankRows={2}
          blankHeight={18}
        />
        <Box title="Criteria for success and fading" hint="The numbers that mean the plan is working, and how supports will be reduced when they are met." lines={2} />
      </ContentPage>

      {/* Form 7: Feasibility + one-pager */}
      <ContentPage>
        <PageHeading
          kicker="FORM 7"
          title="BIP Feasibility Filter and Staff One-Pager"
          lede="Run the filter before you train anyone. A plan that fails two or more items will fail in the classroom no matter how good the assessment was."
        />
        <Text style={styles.h2}>Feasibility filter</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Checkbox>Can the staff who will run it explain the plan in plain language?</Checkbox>
            <Checkbox>Can each strategy happen inside the actual school routine, with the adults who are really there?</Checkbox>
            <Checkbox>Is the replacement behavior easier for the student than the problem behavior?</Checkbox>
          </View>
          <View style={{ flex: 1 }}>
            <Checkbox>Are prompts, materials, and timing specified, not implied?</Checkbox>
            <Checkbox>Can fidelity be checked in under five minutes (Form 8)?</Checkbox>
            <Checkbox>Does the plan say what to do when the first attempt fails?</Checkbox>
          </View>
        </View>

        <Text style={styles.h2}>Staff one-pager</Text>
        <Text style={styles.p}>
          This is the version that lives on the clipboard. Fill it in from the full plan, using the exact
          words you will say in training. Keep every cell to two lines.
        </Text>
        <Fields labels={["Student code", "Routine / setting this page covers", "Plan date"]} />
        <Table
          cols={[
            { label: "Section", flex: 1.1 },
            { label: "What staff need to know", flex: 3.6 },
          ]}
          rows={[
            [{ text: "Goal", bold: true }, "The specific behavior or routine we are improving:"],
            [{ text: "When you see...", bold: true }, "The signal or precursor that means act now:"],
            [{ text: "Do this first...", bold: true }, "The antecedent or prompting strategy:"],
            [{ text: "Teach / reinforce...", bold: true }, "The replacement behavior and what the student earns for it:"],
            [{ text: "If escalation starts...", bold: true }, "The de-escalation and safety response:"],
            [{ text: "Track...", bold: true }, "The one measure, and when to record it:"],
            [{ text: "Questions go to...", bold: true }, "Name, room, and the standing check-in time:"],
          ]}
        />
        <Callout label="Training it takes 10 minutes">
          Use the training structure on Form 9: name the routine, show the strategy with one example,
          model it, have staff practice once, clarify what to do when it gets messy, confirm tracking and
          the next check-in.
        </Callout>
      </ContentPage>

      {/* Form 8: Fidelity */}
      <ContentPage>
        <PageHeading
          kicker="FORM 8"
          title="BIP Implementation Fidelity Checklist"
          lede="Write each plan component in the left column before the observation, score during it, compute the percentage after."
        />
        <Fields labels={["Student code", "Date", "Time and setting", "Staff observed", "Observer"]} />
        <Fields labels={["Date of current FBA", "Date of current BIP", "Behavior(s) of concern"]} />
        <Text style={[styles.small, { marginBottom: 6 }]}>
          Scoring: 0 = no opportunity · 1 = not implemented · 2 = partially implemented · 3 = implemented consistently
        </Text>
        <Table
          cols={[
            { label: "BIP component", flex: 1.9 },
            { label: "Score", flex: 1, align: "center" },
            { label: "Notes", flex: 2 },
          ]}
          rows={[
            [{ text: "At the onset of the session", bold: true }, "", ""],
            ["Data sheets or devices prepared and on hand", SCALE, ""],
            ["Designated areas ready (desk, calming area, materials)", SCALE, ""],
            ["Activities and materials for the student's goals set out", SCALE, ""],
            [{ text: "Antecedent strategies (prevention)", bold: true }, "", ""],
            ["", SCALE, ""],
            ["", SCALE, ""],
            ["", SCALE, ""],
            [{ text: "Teaching and reinforcement procedures", bold: true }, "", ""],
            ["", SCALE, ""],
            ["", SCALE, ""],
            [{ text: "Consequence and de-escalation procedures", bold: true }, "", ""],
            ["", SCALE, ""],
            ["", SCALE, ""],
            [{ text: "Data collection and monitoring", bold: true }, "", ""],
            ["", SCALE, ""],
            ["", SCALE, ""],
          ]}
        />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1.5 }}>
            <Text style={styles.h2}>Scoring</Text>
            <Table
              cols={[
                { label: "Section", flex: 1.6 },
                { label: "Points earned", flex: 0.9, align: "center" },
                { label: "Max possible (3 x items scored 1-3)", flex: 1.3, align: "center" },
                { label: "Fidelity %", flex: 0.8, align: "center" },
              ]}
              rows={[
                ["Session onset", "", "", ""],
                ["Antecedent", "", "", ""],
                ["Reinforcement", "", "", ""],
                ["Consequence / de-escalation", "", "", ""],
                ["Data collection", "", "", ""],
              ]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.h2}>Interpretation</Text>
            <Table
              cols={[
                { label: "Fidelity", flex: 1, align: "center" },
                { label: "Meaning", flex: 1.6 },
              ]}
              rows={[
                ["85 to 100%", "High fidelity"],
                ["70 to 84%", "Moderate fidelity"],
                ["Below 70%", "Implementation concern"],
              ]}
            />
            <Text style={styles.h3}>Staff familiarity with the plan (circle)</Text>
            <Text style={styles.p}>Strong     Moderate     Limited</Text>
          </View>
        </View>
      </ContentPage>

      {/* Form 9: Consultation */}
      <ContentPage>
        <PageHeading
          kicker="FORM 9"
          title="15-Minute Teacher Consultation Guide"
          lede="A standing, short meeting beats an occasional long one. Same agenda every week so the teacher knows what to bring, and you leave with one adjustment and a date."
        />
        <Fields labels={["Student code", "Teacher / staff", "Date", "Next check-in"]} />
        <Table
          cols={[
            { label: "Minute", flex: 0.6, align: "center" },
            { label: "Agenda", flex: 2 },
            { label: "Notes from this meeting", flex: 2.6 },
          ]}
          rows={[
            ["0-2", { text: "What went well this week? Name one specific moment.", bold: true }, ""],
            ["2-6", { text: "Look at the data together. What does the graph or tally show since last time?", bold: true }, ""],
            ["6-10", { text: "Pick one adjustment. Model it. One, not three.", bold: true }, ""],
            ["10-13", { text: "Teacher practices or plans exactly when the adjustment will happen tomorrow.", bold: true }, ""],
            ["13-15", { text: "Confirm the measure, who records it, and the next check-in.", bold: true }, ""],
          ]}
        />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h2}>10-minute staff training structure</Text>
            <Table
              cols={[
                { label: "Minute", flex: 0.5, align: "center" },
                { label: "Action", flex: 2.4 },
              ]}
              rows={[
                ["0-1", "Name the target routine and why it matters."],
                ["1-3", "Show the strategy in plain language with one example."],
                ["3-5", "Model the adult response and the expected student response."],
                ["5-7", "Staff practice using a realistic prompt."],
                ["7-9", "Clarify what to do when implementation gets messy."],
                ["9-10", "Confirm tracking, support, and the next check-in."],
              ]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.h2}>Coaching language bank</Text>
            <Bullet>{'"What I noticed was..."'}</Bullet>
            <Bullet>{'"The part that matched the plan was..."'}</Bullet>
            <Bullet>{'"The next small adjustment is..."'}</Bullet>
            <Bullet>{'"Let\'s make this easier to use during this routine by..."'}</Bullet>
            <Bullet>{'"Before we change the plan, let\'s check whether we made it doable for you."'}</Bullet>
            <Text style={styles.h2}>Coaching cycle</Text>
            <Bullet>Agree on one strategy and one routine.</Bullet>
            <Bullet>Model the adult behavior.</Bullet>
            <Bullet>Practice briefly with staff.</Bullet>
            <Bullet>Observe in context (Form 8).</Bullet>
            <Bullet>Give one affirming note and one adjustment.</Bullet>
            <Bullet>Review data and fidelity before changing the plan.</Bullet>
          </View>
        </View>
      </ContentPage>

      {/* Form 10: Decision rules */}
      <ContentPage>
        <PageHeading
          kicker="FORM 10"
          title="Progress Review Decision Rules"
          lede="A caseload produces a constant stream of information. Without explicit rules you will spend the review updating records and miss the decision. Apply these in order at every review date."
        />
        <Table
          cols={[
            { label: "If...", flex: 2.2 },
            { label: "Then...", flex: 2.4 },
            { label: "Do not...", flex: 1.6 },
          ]}
          rows={[
            [
              { text: "Data quality is poor (missing days, staff unsure what counts)", bold: true },
              "Simplify the measure and retrain the recorder first.",
              "Make a major plan decision on data you would not defend.",
            ],
            [
              { text: "Fidelity is below target (under 85%)", bold: true },
              "Revise training and support. Re-check fidelity within two weeks.",
              "Change the plan. You have not tested it yet.",
            ],
            [
              { text: "Fidelity is adequate and data are improving", bold: true },
              "Continue. Set the criterion for fading and the date you will check it.",
              "Add strategies because things are going well.",
            ],
            [
              { text: "Fidelity is adequate and data are flat or worsening", bold: true },
              "Revisit the hypothesis (Form 3) and the strategy-to-function fit. Revise one component at a time.",
              "Blame staff, or stack a second plan on top of the first.",
            ],
            [
              { text: "A safety incident occurred", bold: true },
              "Follow district reporting today. Review precursors and the escalation response this week.",
              "Wait for the scheduled review date.",
            ],
          ]}
        />
        <Text style={styles.h2}>Weekly caseload review (30 minutes, same time every week)</Text>
        <Text style={styles.p}>Update one line per active plan. If a line has no data date in the last 14 days, that is the decision.</Text>
        <Table
          cols={[
            { label: "Student code", flex: 0.9 },
            { label: "Plan status", flex: 0.9 },
            { label: "Last data date", flex: 0.9 },
            { label: "Trend", flex: 0.8, align: "center" },
            { label: "Last fidelity %", flex: 0.8, align: "center" },
            { label: "Decision (rule above)", flex: 1.8 },
            { label: "Owner", flex: 0.8 },
            { label: "Review date", flex: 0.9 },
          ]}
          blankRows={6}
          blankHeight={24}
        />
        <Callout label="Documenting the decision">
          Every review produces three things in writing: the next action, the owner, and the review date.
          A decision without all three has not been made.
        </Callout>
      </ContentPage>

      {/* Form 11: Ethics */}
      <ContentPage>
        <PageHeading
          kicker="FORM 11"
          title="Ethics Quick Reference for School Settings"
          lede="Common school situations, a first move, and where to look in the BACB Ethics Code for Behavior Analysts. This page is a memory aid, not the Code. Read the section before you act, and document what you did."
        />
        <Table
          cols={[
            { label: "Situation", flex: 2 },
            { label: "First move", flex: 2.6 },
            { label: "Code sections", flex: 1.3 },
          ]}
          rows={[
            [
              { text: "An administrator wants a BIP written this week, without an assessment.", bold: true },
              "Explain that the plan has to be based on assessment results. Offer the fastest defensible path: Form 3 with a decision date. Put the timeline in writing.",
              "2.13 Assessments; 2.14 Behavior-change interventions",
            ],
            [
              { text: "You are asked to keep a strategy in a plan that you believe is unsafe or not working.", bold: true },
              "Raise the concern with data, propose a less restrictive alternative, and document the recommendation and the response.",
              "2.15 Minimizing risk; 3.12 Advocating for appropriate services",
            ],
            [
              { text: "A teacher asks about a student in the hallway or the staff room.", bold: true },
              "Move the conversation to a private space and share only what that person needs to run the plan.",
              "2.03 Protecting confidential information; 2.04 Disclosing",
            ],
            [
              { text: "A parent asks you to provide private, paid services for the same student.", bold: true },
              "Decline the dual role, explain why, and refer to another provider if they want outside services.",
              "1.11 Multiple relationships; 3.13 Referrals",
            ],
            [
              { text: "A referral is outside what you have been trained to treat.", bold: true },
              "Say so. Get supervision or consultation, or refer. Do not learn on the student.",
              "1.05 Scope of competence; 3.06 Consulting; 3.13 Referrals",
            ],
            [
              { text: "The plan is not being implemented and you are asked to report progress anyway.", bold: true },
              "Report what the data and fidelity checks actually show, and name the conditions interfering with the plan.",
              "2.06 Accuracy in reporting; 2.17 Data; 2.19 Interfering conditions",
            ],
            [
              { text: "A plan has run for months with no review.", bold: true },
              "Schedule the review now, apply Form 10, and involve the family and team in any change.",
              "2.18 Continual evaluation; 2.09 Involving stakeholders",
            ],
            [
              { text: "You are asked to supervise more RBTs or trainees than you can observe.", bold: true },
              "State the number you can supervise well and document it. Volume is your responsibility, not the district's.",
              "4.02 Supervisory competence; 4.03 Supervisory volume",
            ],
            [
              { text: "A student on your caseload moves schools or districts.", bold: true },
              "Prepare a transition summary, current data, and the plan; make sure the receiving team has what they need.",
              "3.14 Continuity of services; 3.16 Transitioning services",
            ],
          ]}
        />
        <Text style={styles.small}>
          Section numbers refer to the Ethics Code for Behavior Analysts (Behavior Analyst Certification
          Board, effective January 1, 2022). Current text:{" "}
          <Link src={ETHICS_CODE_URL} style={{ color: GREEN }}>
            bacb.com/ethics-information/ethics-codes
          </Link>
          . State law and district policy may impose additional requirements, and where they are stricter,
          follow them.
        </Text>
      </ContentPage>

      {/* Next steps */}
      <ContentPage>
        <PageHeading
          kicker="NEXT"
          title="What to do this week"
          lede="You do not need all eleven forms on Monday. You need these four."
        />
        <Checkbox>Print Form 2 and fill in every row of the caseload, even the ones you have not met yet.</Checkbox>
        <Checkbox>Pick the two Priority 1 rows and start Form 4 or Form 5 data on them tomorrow.</Checkbox>
        <Checkbox>Put one 15-minute consultation (Form 9) on the calendar with the teacher who has the oldest plan.</Checkbox>
        <Checkbox>Block 30 minutes on Friday for the weekly review on Form 10, and keep it.</Checkbox>

        <Text style={styles.h2}>Who made this</Text>
        <Text style={styles.p}>
          Rob Spain, M.S., BCBA, IBA, is a school-based behavior analyst and the founder of Behavior
          School. The forms in this kit are adapted from the working templates he uses with district
          behavior teams: caseload triage rules, FBA triage and hypothesis building, ABC and opportunity
          data sheets, a one-page BIP structure, a BIP implementation fidelity checklist, and a
          ten-minute staff training routine.
        </Text>

        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaTitle}>The forms are the tools. The program is where you build the system.</Text>
          <Text style={styles.ctaText}>
            The School BCBA Transformation Program is a six-week live cohort for school-based BCBAs:
            weekly two-hour sessions on Thursday evenings, an applied assignment each week on your own
            caseload, and a small group so every question gets answered. The October 2026 cohort runs
            October 8 to November 12 and is capped at five seats.
          </Text>
          <Link src={TRANSFORMATION_URL} style={styles.ctaLink}>
            behaviorschool.com/transformation-program
          </Link>
        </View>

        <Text style={[styles.small, { marginTop: 22 }]}>
          BCBA and BACB are registered trademarks of the Behavior Analyst Certification Board, Inc.
          Behavior School is not affiliated with or endorsed by the BACB. This kit is provided for
          professional use in your own practice; it is not legal advice and does not replace your
          district&apos;s required forms or procedures.
        </Text>
        <Text style={[styles.small, { marginTop: 6 }]}>© 2026 Behavior School. behaviorschool.com</Text>
      </ContentPage>
    </Document>
  );
}

async function main() {
  const buffer = await renderToBuffer(<Kit />);
  writeFileSync(OUTPUT_PATH, buffer);
  console.log(`Wrote ${OUTPUT_PATH} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
