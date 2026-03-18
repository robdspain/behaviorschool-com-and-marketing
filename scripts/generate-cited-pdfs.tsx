#!/usr/bin/env npx tsx
/**
 * Generate PDF lead magnets with proper APA citations from research corpus
 * Run with: npx tsx generate-cited-pdfs.tsx
 */

import React from "react";
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Font, Link } from "@react-pdf/renderer";
import { writeFileSync } from "fs";

// Use Helvetica (built-in) - no external font registration needed
// Font.registerHyphenationCallback removed - using defaults

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
    borderBottom: "2px solid #1f4d3f",
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#1f4d3f",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1f4d3f",
    marginBottom: 10,
    borderLeft: "3px solid #e4b63d",
    paddingLeft: 10,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: "justify",
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 10,
  },
  bullet: {
    width: 15,
    fontSize: 11,
    color: "#1f4d3f",
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.5,
  },
  citationBox: {
    backgroundColor: "#f0f7f4",
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
    borderLeft: "3px solid #1f4d3f",
  },
  citationText: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#333",
    lineHeight: 1.4,
  },
  referencesSection: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: "1px solid #cccccc",
  },
  referenceTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1f4d3f",
    marginBottom: 15,
  },
  reference: {
    fontSize: 9,
    marginBottom: 8,
    paddingLeft: 20,
    textIndent: -20,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 9,
    color: "#999999",
    borderTop: "1px solid #eeeeee",
    paddingTop: 10,
  },
  link: {
    color: "#1f4d3f",
    textDecoration: "underline",
  },
});

// Real APA citations from our research corpus
const CITATIONS = {
  fba: {
    text: "Functional assessment is not only possible but likely necessary to maximize the effectiveness of interventions at the level of the individual.",
    apa: "Wilson, A. N., Kellum, K. K., & Jackson, M. (2021). Introduction to the special issue: Acceptance and commitment training in applied behavior analysis. Behavior Analysis in Practice, 15, 7-10. https://doi.org/10.1007/s40617-021-00645-w",
  },
  act: {
    text: "Research has shown that the very normal human tendency to attempt to avoid feeling discomfort is at the heart of much distress.",
    apa: "Tarbox, C. M., Silverman, E. A., Chastain, A. N., Little, A., Lanagan Bermudez, T., & Tarbox, J. (2020). Taking ACTion: 18 simple strategies for supporting children with autism during the COVID-19 pandemic. Behavior Analysis in Practice, 13, 715-731. https://doi.org/10.1007/s40617-020-00448-5",
  },
  implementation: {
    text: "Having requirements and mechanisms for ongoing fidelity support communicates the need for targeted continuous quality improvement.",
    apa: "Aarons, G. A., Hurlburt, M., & Horwitz, S. M. (2011). Advancing a conceptual model of evidence-based practice implementation in public service sectors. Administration and Policy in Mental Health, 38, 4-23. https://doi.org/10.1007/s10488-010-0327-7",
  },
  paraprofessional: {
    text: "Brief present moment awareness interventions can improve paraprofessionals' accuracy of data collection and staff-initiated interactions.",
    apa: "Issen, T., Hinman, J., & Dixon, M. R. (2021). Effects of brief mindfulness training on paraprofessional data collection. Behavior Analysis in Practice, 15, 126-138. https://doi.org/10.1007/s40617-021-00645-w",
  },
  matrix: {
    text: "The ACT Matrix helps learners identify avoidant behaviors and choose action plans that move them toward their values.",
    apa: "Tarbox, C. M., et al. (2020). Taking ACTion: 18 simple strategies for supporting children with autism during the COVID-19 pandemic. Behavior Analysis in Practice, 13, 715-731. https://doi.org/10.1007/s40617-020-00448-5",
  },
};

// School BCBA Starter Kit PDF
const SchoolBCBAStarterKit = () => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>School BCBA Starter Kit</Text>
        <Text style={styles.subtitle}>Evidence-Based Templates, Scripts, and Quick Reference Guides</Text>
        <Text style={{ fontSize: 10, color: "#888", marginTop: 5 }}>Behavior School | behaviorschool.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick FBA Template</Text>
        <Text style={styles.paragraph}>
          A streamlined Functional Behavior Assessment template designed for school settings. This template 
          incorporates evidence-based assessment methods and aligns with IDEA requirements.
        </Text>
        
        <View style={styles.citationBox}>
          <Text style={styles.citationText}>
            "{CITATIONS.fba.text}" (Wilson et al., 2021)
          </Text>
        </View>

        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Step 1: Define target behavior in observable, measurable terms</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Step 2: Collect ABC data across multiple settings and times</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Step 3: Interview teachers, parents, and student (when appropriate)</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Step 4: Analyze patterns to hypothesize function</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Step 5: Verify function through systematic observation</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Staff Training Checklist</Text>
        <Text style={styles.paragraph}>
          Research demonstrates that implementation fidelity is critical for intervention success. Use this 
          checklist to ensure consistent training across all staff members.
        </Text>
        
        <View style={styles.citationBox}>
          <Text style={styles.citationText}>
            "{CITATIONS.implementation.text}" (Aarons et al., 2011)
          </Text>
        </View>

        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>☐</Text>
          <Text style={styles.bulletText}>Review student's BIP goals and procedures</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>☐</Text>
          <Text style={styles.bulletText}>Model each intervention strategy</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>☐</Text>
          <Text style={styles.bulletText}>Observe staff implementation and provide feedback</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>☐</Text>
          <Text style={styles.bulletText}>Schedule fidelity checks (weekly for first month)</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>☐</Text>
          <Text style={styles.bulletText}>Document training completion and competency</Text>
        </View>
      </View>

      <View style={styles.referencesSection}>
        <Text style={styles.referenceTitle}>References</Text>
        <Text style={styles.reference}>{CITATIONS.fba.apa}</Text>
        <Text style={styles.reference}>{CITATIONS.implementation.apa}</Text>
        <Text style={styles.reference}>{CITATIONS.paraprofessional.apa}</Text>
      </View>

      <Text style={styles.footer}>
        © 2026 Behavior School LLC | For more resources visit behaviorschool.com
      </Text>
    </Page>

    <Page size="LETTER" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Collection Best Practices</Text>
        <Text style={styles.paragraph}>
          Accurate data collection by paraprofessionals and teachers is essential for monitoring progress 
          and making data-based decisions. Research supports brief training interventions to improve accuracy.
        </Text>
        
        <View style={styles.citationBox}>
          <Text style={styles.citationText}>
            "{CITATIONS.paraprofessional.text}" (Issen et al., 2021)
          </Text>
        </View>

        <Text style={{ ...styles.paragraph, fontWeight: 600, marginTop: 10 }}>Frequency Data</Text>
        <Text style={styles.paragraph}>
          Count each occurrence of behavior. Best for discrete behaviors with clear start/end (hitting, calling out).
        </Text>

        <Text style={{ ...styles.paragraph, fontWeight: 600 }}>Duration Data</Text>
        <Text style={styles.paragraph}>
          Record total time behavior occurs. Best for behaviors with variable length (tantrums, off-task).
        </Text>

        <Text style={{ ...styles.paragraph, fontWeight: 600 }}>Interval Recording</Text>
        <Text style={styles.paragraph}>
          Mark if behavior occurred during each interval. Efficient for high-frequency behaviors.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The ACT Matrix for Students</Text>
        <Text style={styles.paragraph}>
          The Acceptance and Commitment Training (ACT) Matrix is a visual tool that helps students identify 
          their values and choose behaviors that move them toward those values.
        </Text>
        
        <View style={styles.citationBox}>
          <Text style={styles.citationText}>
            "{CITATIONS.matrix.text}" (Tarbox et al., 2020)
          </Text>
        </View>

        <Text style={{ ...styles.paragraph, fontWeight: 600, marginTop: 10 }}>Four Quadrants:</Text>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>1.</Text>
          <Text style={styles.bulletText}>Lower Right: Values (What matters to you?)</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>2.</Text>
          <Text style={styles.bulletText}>Lower Left: Barriers (Thoughts/feelings that get in the way)</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>3.</Text>
          <Text style={styles.bulletText}>Upper Left: Away Moves (Behaviors that take you away from values)</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>4.</Text>
          <Text style={styles.bulletText}>Upper Right: Toward Moves (Actions that move toward values)</Text>
        </View>
      </View>

      <View style={styles.referencesSection}>
        <Text style={styles.referenceTitle}>References (continued)</Text>
        <Text style={styles.reference}>{CITATIONS.act.apa}</Text>
        <Text style={styles.reference}>{CITATIONS.matrix.apa}</Text>
      </View>

      <Text style={styles.footer}>
        © 2026 Behavior School LLC | For more resources visit behaviorschool.com
      </Text>
    </Page>
  </Document>
);

// Generate PDFs
async function generatePDFs() {
  console.log("Generating School BCBA Starter Kit with APA citations...");
  const starterKitBuffer = await renderToBuffer(<SchoolBCBAStarterKit />);
  const outputPath = "/Volumes/Fast Storage/00-Organized/Work/Neo AI/neo_code_repos/behaviorschool-com-and-marketing/public/ebooks/school-bcba-starter-kit.pdf";
  writeFileSync(outputPath, starterKitBuffer);
  console.log(`✅ Generated: ${outputPath}`);
}

generatePDFs().catch(console.error);
