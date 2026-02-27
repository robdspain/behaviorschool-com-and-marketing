/**
 * Common Core Standards lookup for IEP Behavior Goal Writer
 * Maps behavior types + grade level to relevant CCSS anchors
 * Source: Common Core State Standards Initiative (corestandards.org)
 */

const CC_BEHAVIOR_MAP = {
  // Self-regulation / on-task / attention behaviors → ELA Speaking & Listening + Math Practice
  "on-task": {
    ela: { domain: "Speaking and Listening", strand: "SL" },
    math: { domain: "Standards for Mathematical Practice", strand: "MP" },
    practices: ["MP.1 Make sense of problems and persevere in solving them", "MP.6 Attend to precision"],
  },
  "off-task": {
    ela: { domain: "Speaking and Listening", strand: "SL" },
    math: { domain: "Standards for Mathematical Practice", strand: "MP" },
    practices: ["MP.1 Make sense of problems and persevere in solving them"],
  },
  "disruptive": {
    ela: { domain: "Speaking and Listening", strand: "SL" },
    practices: [],
  },
  "calling out": {
    ela: { domain: "Speaking and Listening — Comprehension and Collaboration", strand: "SL" },
    practices: [],
  },
  "inappropriate vocalizations": {
    ela: { domain: "Speaking and Listening", strand: "SL" },
    practices: [],
  },
  "aggression": { ela: null, math: null, practices: [] },
  "aggressive": { ela: null, math: null, practices: [] },
  "elopement": { ela: null, math: null, practices: [] },
  "self-injurious": { ela: null, math: null, practices: [] },
  "tantrum": { ela: null, math: null, practices: [] },
};

// CCSS Speaking & Listening standards by grade that relate to behavior (participation, turn-taking, focus)
const CC_SL_BY_GRADE = {
  "K": [
    { code: "CCSS.ELA-LITERACY.SL.K.1", text: "Participate in collaborative conversations with diverse partners about kindergarten topics and texts with peers and adults in small and larger groups." },
    { code: "CCSS.ELA-LITERACY.SL.K.1.A", text: "Follow agreed-upon rules for discussions (e.g., listening to others and taking turns speaking about the topics and texts under discussion)." },
  ],
  "1": [
    { code: "CCSS.ELA-LITERACY.SL.1.1", text: "Participate in collaborative conversations with diverse partners about grade 1 topics and texts with peers and adults in small and larger groups." },
    { code: "CCSS.ELA-LITERACY.SL.1.1.A", text: "Follow agreed-upon rules for discussions (e.g., listening to others with care, speaking one at a time about the topics and texts under discussion)." },
    { code: "CCSS.ELA-LITERACY.SL.1.1.B", text: "Build on others' talk in conversations by responding to the comments of others through multiple exchanges." },
  ],
  "2": [
    { code: "CCSS.ELA-LITERACY.SL.2.1", text: "Participate in collaborative conversations with diverse partners about grade 2 topics and texts with peers and adults in small and larger groups." },
    { code: "CCSS.ELA-LITERACY.SL.2.1.A", text: "Follow agreed-upon rules for discussions (e.g., gaining the floor in respectful ways, listening to others with care, speaking one at a time about the topics and texts under discussion)." },
  ],
  "3": [
    { code: "CCSS.ELA-LITERACY.SL.3.1", text: "Engage effectively in a range of collaborative discussions (one-on-one, in groups, and teacher-led) with diverse partners on grade 3 topics and texts, building on others' ideas and expressing their own clearly." },
    { code: "CCSS.ELA-LITERACY.SL.3.1.B", text: "Follow agreed-upon rules for discussions (e.g., gaining the floor in respectful ways, listening to others with care, speaking one at a time)." },
  ],
  "4": [
    { code: "CCSS.ELA-LITERACY.SL.4.1", text: "Engage effectively in a range of collaborative discussions with diverse partners on grade 4 topics and texts, building on others' ideas and expressing their own clearly." },
    { code: "CCSS.ELA-LITERACY.SL.4.1.B", text: "Follow agreed-upon rules for discussions and carry out assigned roles." },
  ],
  "5": [
    { code: "CCSS.ELA-LITERACY.SL.5.1", text: "Engage effectively in a range of collaborative discussions with diverse partners on grade 5 topics and texts, building on others' ideas and expressing their own clearly." },
    { code: "CCSS.ELA-LITERACY.SL.5.1.B", text: "Follow agreed-upon rules for discussions and carry out assigned roles." },
  ],
  "6": [
    { code: "CCSS.ELA-LITERACY.SL.6.1", text: "Engage effectively in a range of collaborative discussions (one-on-one, in groups, and teacher-led) with diverse partners on grade 6 topics, texts, and issues, building on others' ideas and expressing their own clearly." },
    { code: "CCSS.ELA-LITERACY.SL.6.1.B", text: "Follow rules for collegial discussions, set specific goals and deadlines, and define individual roles as needed." },
  ],
  "7": [
    { code: "CCSS.ELA-LITERACY.SL.7.1", text: "Engage effectively in a range of collaborative discussions with diverse partners on grade 7 topics, texts, and issues, building on others' ideas and expressing their own clearly." },
    { code: "CCSS.ELA-LITERACY.SL.7.1.B", text: "Follow rules for collegial discussions, track progress toward specific goals and deadlines, and define individual roles as needed." },
  ],
  "8": [
    { code: "CCSS.ELA-LITERACY.SL.8.1", text: "Engage effectively in a range of collaborative discussions with diverse partners on grade 8 topics, texts, and issues, building on others' ideas and expressing their own clearly." },
    { code: "CCSS.ELA-LITERACY.SL.8.1.B", text: "Follow rules for collegial discussions and decision-making, track progress toward specific goals and deadlines, and define individual roles as needed." },
  ],
  "9": [
    { code: "CCSS.ELA-LITERACY.SL.9-10.1", text: "Initiate and participate effectively in a range of collaborative discussions with diverse partners on grades 9–10 topics, texts, and issues, building on others' ideas and expressing their own clearly and persuasively." },
    { code: "CCSS.ELA-LITERACY.SL.9-10.1.B", text: "Work with peers to set rules for collegial discussions and decision-making, clear goals and deadlines, and individual roles as needed." },
  ],
  "10": [
    { code: "CCSS.ELA-LITERACY.SL.9-10.1", text: "Initiate and participate effectively in a range of collaborative discussions with diverse partners on grades 9–10 topics, texts, and issues." },
  ],
  "11": [
    { code: "CCSS.ELA-LITERACY.SL.11-12.1", text: "Initiate and participate effectively in a range of collaborative discussions with diverse partners on grades 11–12 topics, texts, and issues, building on others' ideas and expressing their own clearly and persuasively." },
    { code: "CCSS.ELA-LITERACY.SL.11-12.1.B", text: "Work with peers to promote civil, democratic discussions; set clear goals, deadlines, and individual roles as needed." },
  ],
  "12": [
    { code: "CCSS.ELA-LITERACY.SL.11-12.1", text: "Initiate and participate effectively in a range of collaborative discussions on grades 11–12 topics and texts." },
  ],
};

// Math Practice Standards (apply K–12, relevant for on-task/engagement behaviors)
const CC_MATH_PRACTICES = [
  { code: "CCSS.MATH.PRACTICE.MP1", text: "Make sense of problems and persevere in solving them." },
  { code: "CCSS.MATH.PRACTICE.MP6", text: "Attend to precision." },
];

/**
 * Returns relevant CCSS standards for a given grade and behavior title.
 * Returns empty array if no relevant standards found.
 */
function getCCStandards(gradeValue, behaviorTitle) {
  if (!gradeValue || !behaviorTitle) return [];

  const titleLower = (behaviorTitle || "").toLowerCase();
  const results = [];

  // Check if behavior is related to classroom participation/engagement
  const engagementKeywords = ["on-task", "off-task", "calling out", "disruptive", "vocaliz", "talking", "attention", "engagement", "participation", "work completion", "task completion"];
  const isEngagementBehavior = engagementKeywords.some(kw => titleLower.includes(kw));

  if (isEngagementBehavior) {
    const slStandards = CC_SL_BY_GRADE[gradeValue] || [];
    results.push(...slStandards);

    // Add math practice standards for on-task/attention behaviors
    if (titleLower.includes("on-task") || titleLower.includes("off-task") || titleLower.includes("attention") || titleLower.includes("work completion")) {
      results.push(...CC_MATH_PRACTICES);
    }
  }

  return results;
}

/**
 * Renders CC standards into the #commonCoreStandards box on Step 5.
 * Call this when generating output.
 */
function renderCCStandards(gradeValue, behaviorTitle) {
  const box = document.getElementById("commonCoreStandards");
  const list = document.getElementById("ccStandardsList");
  if (!box || !list) return;

  const standards = getCCStandards(gradeValue, behaviorTitle);
  if (!standards.length) {
    box.style.display = "none";
    return;
  }

  list.innerHTML = standards.map(s =>
    `<div style="margin-bottom:6px;"><span style="font-weight:600;color:#1e3a34;">${s.code}:</span> <span>${s.text}</span></div>`
  ).join("");

  box.style.display = "block";
}

// Hook into output generation — called after app.js generates the goal
document.addEventListener("DOMContentLoaded", () => {
  // Patch the generate/next button on step 4→5 to also render CC standards
  const observer = new MutationObserver(() => {
    const outputEl = document.getElementById("output");
    if (outputEl && outputEl.textContent.trim().length > 20) {
      const grade = (document.getElementById("gradeLevel") || {}).value || "";
      const behavior = (document.getElementById("behaviorTitle") || {}).value || "";
      renderCCStandards(grade, behavior);
    }
  });

  const outputEl = document.getElementById("output");
  if (outputEl) {
    observer.observe(outputEl, { childList: true, subtree: true, characterData: true });
  }
});
