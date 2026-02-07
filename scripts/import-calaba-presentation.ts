#!/usr/bin/env npx tsx
/**
 * Import CALABA 2026 Symposium Presentation
 * 
 * Usage: npx tsx scripts/import-calaba-presentation.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = 
  process.env.SUPABASE_SERVICE_ROLE || 
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// CALABA Presentation Slides
const slides = [
  {
    title: "Beyond Observable Behavior",
    content: [
      "Measuring and Modifying the Function of Thought in School-Based Assessment",
      "",
      "CALABA 2026 Symposium",
      "Saturday, March 7, 2:55-3:55 PM",
      "Sacramento, California"
    ],
    layout: "title-only" as const
  },
  {
    title: "Session Overview",
    content: [
      "Many students engage in severe externalizing behaviors driven by rigid internal dialogue and psychological inflexibility rather than external contingencies",
      "",
      "Traditional FBAs often fail to assess or address these private events",
      "",
      "This symposium presents four interconnected research projects:",
      "• Latency-based functional analyses to identify thought-driven behaviors",
      "• ACT-informed BIPs targeting psychological flexibility",
      "• Classroom integration and implementation strategies",
      "• Outcome data and social validity measures"
    ],
    layout: "text" as const
  },
  {
    title: "Symposium Structure",
    content: [
      "Paper 1: The Assessment Phase — Rob Spain",
      "Clinical application of precursor functional analysis",
      "",
      "Paper 2: The Intervention Phase — Cristal Lopez",
      "Values-based programming and ACT integration",
      "",
      "Paper 3: Implementation & Fidelity — Megan Caluza",
      "Systems of support for staff training and coaching",
      "",
      "Paper 4: Outcomes & Social Validity — Rob Spain",
      "Evaluating the model's effectiveness and acceptability"
    ],
    layout: "text" as const
  },
  
  // Paper 1: The Assessment Phase
  {
    title: "Paper 1: The Assessment Phase",
    content: [
      "Clinical Application of Precursor Functional Analysis",
      "Identifying Internal Drivers of Behavior",
      "",
      "Presenter: Rob Spain, BCBA",
      "KCUSD Behavior Team"
    ],
    layout: "title-only" as const
  },
  {
    title: "The Challenge: Traditional FBA Limitations",
    content: [
      "Traditional FBAs focus on observable antecedents and consequences",
      "",
      "Problem: Many student behaviors are driven by private events",
      "• Internal dialogue and rigid thinking patterns",
      "• Psychological inflexibility",
      "• Avoidance of internal experiences",
      "",
      "These internal drivers are not captured by standard ABC data",
      "",
      "Result: Interventions that address symptoms, not root causes"
    ],
    layout: "text" as const
  },
  {
    title: "Latency-Based Functional Analysis",
    content: [
      "Novel assessment approach measuring behavioral precursors",
      "",
      "Key Innovation: Measure the TIME between:",
      "• Environmental trigger",
      "• Internal processing (thought/emotion)",
      "• Observable behavior",
      "",
      "Why latency matters:",
      "Longer latencies suggest internal mediation",
      "Immediate responses suggest automatic or direct environmental control",
      "",
      "Allows us to identify when thoughts drive behavior"
    ],
    layout: "two-column" as const
  },
  {
    title: "Measuring Private Events Through Observable Precursors",
    content: [
      "We can't measure thoughts directly, but we can measure:",
      "",
      "Physical indicators:",
      "• Changes in posture or muscle tension",
      "• Facial expressions",
      "• Breathing patterns",
      "",
      "Behavioral indicators:",
      "• Hesitation or pausing",
      "• Self-talk (audible or visible)",
      "• Ritualistic behaviors",
      "",
      "Temporal patterns:",
      "• Time to behavioral onset",
      "• Consistency of latency across trials"
    ],
    layout: "text" as const
  },
  {
    title: "Case Example: Middle School Student",
    content: [
      "Presenting behavior: Classroom disruption and aggression",
      "",
      "Traditional FBA identified: Escape from academic demands",
      "",
      "Latency-based FA revealed:",
      "• 45-90 second delay between task presentation and behavior",
      "• Observable tension and self-talk during delay",
      "• Consistent pattern across different tasks",
      "",
      "Interpretation: Behavior mediated by internal dialogue",
      "'I can't do this' → 'Everyone will think I'm stupid' → Aggression",
      "",
      "Intervention needed to target thoughts, not just task avoidance"
    ],
    layout: "text" as const
  },
  {
    title: "Assessment Protocol",
    content: [
      "1. Initial Observation Phase",
      "Identify potential thought-mediated behaviors",
      "Note presence and duration of precursor behaviors",
      "",
      "2. Structured Trials",
      "Present controlled antecedents",
      "Measure latency to behavior onset",
      "Record observable precursors",
      "",
      "3. Analysis",
      "Compare latencies across conditions",
      "Identify consistent patterns",
      "Interview student about internal experiences",
      "",
      "4. Function Determination",
      "External vs. internal control",
      "Specific thought patterns driving behavior"
    ],
    layout: "text" as const
  },
  {
    title: "Assessment Data Collection",
    content: [
      "Quantitative measures:",
      "• Latency (seconds) from antecedent to behavior",
      "• Frequency of precursor behaviors",
      "• Percentage of trials with delayed onset",
      "",
      "Qualitative measures:",
      "• Student self-report of internal experiences",
      "• Staff observations of emotional state",
      "• Pattern analysis across settings",
      "",
      "Decision rule:",
      "Consistent latencies >30 seconds with observable precursors",
      "= likely internal mediation",
      "= candidate for ACT-informed intervention"
    ],
    layout: "two-column" as const
  },
  {
    title: "Key Findings from Assessment Phase",
    content: [
      "67% of students with severe problem behaviors showed:",
      "• Consistent latencies >30 seconds",
      "• Observable precursor behaviors",
      "• Self-reported internal dialogue",
      "",
      "These students had:",
      "• Higher rates of intervention failure with traditional BIPs",
      "• More frequent crisis episodes",
      "• Greater staff frustration and burnout",
      "",
      "Conclusion: Traditional FBAs miss critical information for majority of complex cases"
    ],
    layout: "text" as const
  },
  {
    title: "Implications for Practice",
    content: [
      "Assessment should include:",
      "✓ Latency measurement as standard practice",
      "✓ Observation of precursor behaviors",
      "✓ Student interviews about internal experiences",
      "✓ Analysis of temporal patterns",
      "",
      "When latency-based FA indicates internal control:",
      "→ Traditional consequence-based interventions will likely fail",
      "→ Need interventions targeting psychological flexibility",
      "→ ACT-informed BIPs become the evidence-based choice"
    ],
    layout: "two-column" as const
  },

  // Paper 2: The Intervention Phase
  {
    title: "Paper 2: The Intervention Phase",
    content: [
      "Values-Based Programming",
      "Integrating ACT into the Standard BIP and IEP Process",
      "",
      "Presenter: Cristal Lopez, BCaBA",
      "KCUSD Behavior Team"
    ],
    layout: "title-only" as const
  },
  {
    title: "From Assessment to Intervention",
    content: [
      "Assessment identified: Behavior driven by internal experiences",
      "",
      "Traditional approach:",
      "Manipulate external consequences to reduce behavior",
      "",
      "ACT-informed approach:",
      "Teach psychological flexibility to change relationship with internal experiences",
      "",
      "Goal: Not to eliminate thoughts or feelings",
      "But to reduce their behavioral impact through acceptance and values-based action"
    ],
    layout: "text" as const
  },
  {
    title: "What is Acceptance and Commitment Therapy (ACT)?",
    content: [
      "Evidence-based psychological intervention",
      "Part of the 'third wave' of behavior therapy",
      "",
      "Core premise:",
      "Suffering comes not from difficult thoughts/emotions",
      "But from our struggle to avoid or control them",
      "",
      "Six core processes:",
      "• Acceptance • Cognitive Defusion",
      "• Present Moment • Self-as-Context",
      "• Values • Committed Action",
      "",
      "Applied to schools: Teaching students to act based on values",
      "even when experiencing difficult internal states"
    ],
    layout: "two-column" as const
  },
  {
    title: "ACT-Informed BIP Components",
    content: [
      "1. Values Identification",
      "What matters most to this student?",
      "What kind of person do they want to be?",
      "",
      "2. Psychological Flexibility Goals",
      "Replace rigid behavioral patterns with flexible responding",
      "Example: 'Will accept feelings of frustration and ask for help'",
      "",
      "3. Skill-Building Interventions",
      "Mindfulness and present-moment awareness",
      "Cognitive defusion techniques",
      "Values-based decision making",
      "",
      "4. Environmental Supports",
      "Cues for valued behavior",
      "Reinforcement tied to values, not just behavior reduction"
    ],
    layout: "text" as const
  },
  {
    title: "Integrating ACT into IEP Goals",
    content: [
      "Traditional goal:",
      "'Student will reduce instances of classroom disruption from 8 to 2 per day'",
      "",
      "ACT-informed goal:",
      "'When experiencing frustration, student will use learned coping strategies",
      "(breathing, cognitive defusion) and request help in 4 out of 5 opportunities'",
      "",
      "Key differences:",
      "• Focuses on skill acquisition, not just behavior reduction",
      "• Acknowledges internal experiences as valid",
      "• Ties behavior to student's values and goals",
      "• Measurable but contextually meaningful"
    ],
    layout: "text" as const
  },
  {
    title: "Values-Based Goal Setting Process",
    content: [
      "Step 1: Values Assessment",
      "Student interview using age-appropriate tools",
      "Identify what matters: friendship, learning, respect, kindness, etc.",
      "",
      "Step 2: Values Clarification",
      "Connect values to school behaviors",
      "'Being a good friend means asking to join, not grabbing toys'",
      "",
      "Step 3: Goal Development",
      "Create measurable objectives aligned with values",
      "Student has voice in goal setting",
      "",
      "Step 4: Visual Supports",
      "Values cards, choice boards, reflection tools",
      "Regular check-ins on values alignment"
    ],
    layout: "text" as const
  },
  {
    title: "Case Example: Elementary Student",
    content: [
      "Student: 3rd grader with work refusal and task avoidance",
      "",
      "Precursor FA showed: Internal dialogue about failure and peer judgment",
      "",
      "Values identified: Being smart, making friends, making family proud",
      "",
      "ACT-informed interventions:",
      "• Cognitive defusion: 'Having the thought' vs. 'being' stupid",
      "• Acceptance: It's okay to feel worried about new tasks",
      "• Committed action: Try tasks that matter (values) even when worried",
      "",
      "IEP Goal: 'Will attempt grade-level work for 15 minutes",
      "while using learned strategies to manage worry, 4/5 days'",
      "",
      "Outcome: 85% reduction in work refusal, improved peer relationships"
    ],
    layout: "text" as const
  },
  {
    title: "Psychological Flexibility as Target Behavior",
    content: [
      "Traditional target: Reduce problem behavior frequency",
      "",
      "ACT target: Increase psychological flexibility",
      "",
      "Measurable indicators of psychological flexibility:",
      "• Willingness to engage in difficult tasks/situations",
      "• Use of coping strategies during distress",
      "• Values-consistent choices even with discomfort",
      "• Recovery time after difficult emotions",
      "• Ability to name and accept internal experiences",
      "",
      "Data collection:",
      "Track both problem behavior AND flexibility indicators",
      "Success = increased flexibility, not just decreased problems"
    ],
    layout: "two-column" as const
  },
  {
    title: "Practical BIP Strategies",
    content: [
      "Acceptance strategies:",
      "• Name the emotion ('I notice I'm feeling angry')",
      "• Body scans and breathing exercises",
      "• 'Make room for' difficult feelings",
      "",
      "Defusion strategies:",
      "• 'Thoughts are just words'",
      "• Labeling thoughts ('My mind says...')",
      "• Silly voices or singing the thought",
      "",
      "Committed action:",
      "• Values choice boards",
      "• 'What would a [valued identity] do right now?'",
      "• Small steps toward valued goals",
      "",
      "Environmental supports:",
      "• Visual cue cards for strategies",
      "• Values-based reinforcement menus",
      "• Reflection journals"
    ],
    layout: "text" as const
  },
  {
    title: "Integration with PBIS and MTSS",
    content: [
      "Tier 3 (Individualized):",
      "Full ACT-informed FBA and BIP",
      "Individual coaching and skill-building",
      "",
      "Tier 2 (Targeted):",
      "Small group social-emotional learning with ACT components",
      "Check-in/Check-out with values reflection",
      "",
      "Tier 1 (Universal):",
      "Schoolwide mindfulness practices",
      "Classroom lessons on values and emotions",
      "Culturally responsive behavior expectations",
      "",
      "Key principle: ACT strategies benefit all students",
      "Not just those with behavior challenges"
    ],
    layout: "text" as const
  },

  // Paper 3: Implementation & Fidelity
  {
    title: "Paper 3: Implementation & Fidelity",
    content: [
      "Systems of Support",
      "Training and Coaching Staff in ACT-Informed Strategies",
      "",
      "Presenter: Megan Caluza, BCBA",
      "KCUSD Behavior Team"
    ],
    layout: "title-only" as const
  },
  {
    title: "The Implementation Challenge",
    content: [
      "Evidence-based interventions only work if implemented with fidelity",
      "",
      "Common barriers:",
      "• Staff unfamiliar with ACT principles",
      "• Perceived complexity of new approach",
      "• Time constraints and competing demands",
      "• Inconsistent implementation across settings",
      "• Lack of ongoing support and coaching",
      "",
      "Question: How do we move from 'a good BIP on paper'",
      "to 'consistently implemented strategies that change student outcomes'?"
    ],
    layout: "text" as const
  },
  {
    title: "Multi-Tiered Implementation System",
    content: [
      "Tier 1: Universal Training",
      "• All staff receive ACT overview and rationale",
      "• Basic strategies for classroom use",
      "• 2-hour workshop + ongoing resources",
      "",
      "Tier 2: Targeted Support",
      "• Staff implementing ACT-informed BIPs",
      "• Monthly coaching and data review",
      "• Peer learning communities",
      "",
      "Tier 3: Intensive Coaching",
      "• Complex cases or struggling implementers",
      "• Weekly observations with feedback",
      "• Performance-based skill building"
    ],
    layout: "text" as const
  },
  {
    title: "Behavioral Skills Training (BST) Model",
    content: [
      "Four-step coaching process:",
      "",
      "1. Instruction",
      "Explain the ACT strategy and rationale",
      "Connect to student's values and goals",
      "",
      "2. Modeling",
      "Coach demonstrates strategy with student",
      "Staff observe successful implementation",
      "",
      "3. Rehearsal",
      "Staff practice in low-stakes scenarios",
      "Role-play common situations",
      "",
      "4. Feedback",
      "Specific, immediate, behavior-focused",
      "Celebrate successes, problem-solve challenges"
    ],
    layout: "text" as const
  },
  {
    title: "Initial Training Content",
    content: [
      "Module 1: ACT Foundations (30 min)",
      "• What is ACT and why it works",
      "• Six core processes simplified",
      "• Research supporting ACT in schools",
      "",
      "Module 2: Practical Strategies (45 min)",
      "• Teaching acceptance and defusion",
      "• Values identification with students",
      "• Environmental supports and cues",
      "",
      "Module 3: Implementation Tools (30 min)",
      "• Data collection methods",
      "• Fidelity self-monitoring",
      "• When to ask for help",
      "",
      "Module 4: Practice & Planning (15 min)",
      "• Role-play scenarios",
      "• Develop action plan"
    ],
    layout: "text" as const
  },
  {
    title: "Ongoing Coaching Structure",
    content: [
      "Weekly implementation cycle:",
      "",
      "Monday: Plan the week",
      "Review student data, identify opportunities for strategy use",
      "",
      "Tuesday-Thursday: Implement",
      "Use ACT strategies, collect fidelity data",
      "",
      "Friday: Reflect and adjust",
      "Coach observation or video review",
      "Problem-solve barriers, celebrate wins",
      "",
      "Coaching time allocation:",
      "15-20 minutes per week per teacher",
      "Group reflection sessions monthly"
    ],
    layout: "two-column" as const
  },
  {
    title: "Implementation Fidelity Measures",
    content: [
      "What we measure:",
      "",
      "Strategy delivery:",
      "✓ Frequency of ACT strategy use",
      "✓ Correct application of techniques",
      "✓ Quality of values-based language",
      "",
      "Environmental supports:",
      "✓ Presence of visual cues and tools",
      "✓ Accessibility to students",
      "✓ Culturally responsive materials",
      "",
      "Data collection:",
      "✓ Consistency of progress monitoring",
      "✓ Accuracy of behavior records",
      "✓ Use of data to inform decisions",
      "",
      "Target: 80% fidelity across all components"
    ],
    layout: "text" as const
  },
  {
    title: "Scaling Across Classrooms",
    content: [
      "Phase 1: Pilot (Year 1)",
      "• 3-5 classrooms with high-need students",
      "• Intensive coaching and support",
      "• Refine training materials and protocols",
      "",
      "Phase 2: Expand (Year 2)",
      "• All classrooms with students on Tier 2/3 BIPs",
      "• Train-the-trainer model for sustainability",
      "• Reduce coaching intensity as competence grows",
      "",
      "Phase 3: Sustain (Year 3+)",
      "• Universal training for all new staff",
      "• Peer coaching model",
      "• Consultation available as needed",
      "• Integration into standard PBIS framework"
    ],
    layout: "text" as const
  },
  {
    title: "Supporting Staff Buy-In",
    content: [
      "Common staff concerns and our responses:",
      "",
      "'This is too complex'",
      "→ Start with 2-3 simple strategies, build gradually",
      "",
      "'I don't have time for this'",
      "→ ACT strategies reduce crisis time, save time long-term",
      "",
      "'I'm not a therapist'",
      "→ You're already teaching social skills; this is just more precise",
      "",
      "'What if I do it wrong?'",
      "→ Coaching and feedback ensure you develop competence",
      "",
      "Key: Share student success stories early and often"
    ],
    layout: "text" as const
  },
  {
    title: "Case Example: 4th Grade Team",
    content: [
      "Setting: 4 teachers, 92 students, 12 with behavior support plans",
      "",
      "Implementation:",
      "• 2-hour initial training (September)",
      "• Bi-weekly coaching for first semester",
      "• Monthly group problem-solving sessions",
      "",
      "Fidelity data:",
      "• Month 1: 45% average fidelity",
      "• Month 3: 72% average fidelity",
      "• Month 6: 88% average fidelity",
      "",
      "Outcome:",
      "• 60% reduction in office referrals",
      "• 4 students transitioned off Tier 3 supports",
      "• Teachers reported increased confidence and reduced stress"
    ],
    layout: "text" as const
  },
  {
    title: "Lessons Learned",
    content: [
      "What worked:",
      "✓ Starting small with willing participants",
      "✓ Frequent, brief coaching vs. occasional long sessions",
      "✓ Celebrating small wins publicly",
      "✓ Providing ready-to-use materials and visual supports",
      "",
      "What didn't work:",
      "✗ Expecting immediate high fidelity",
      "✗ One-time training without follow-up",
      "✗ Focusing only on fidelity, not student outcomes",
      "✗ Ignoring staff's own stress and burnout",
      "",
      "Key insight: Implementation is a behavior",
      "Apply behavior principles to support staff change!"
    ],
    layout: "two-column" as const
  },

  // Paper 4: Outcomes & Social Validity
  {
    title: "Paper 4: Outcomes & Social Validity",
    content: [
      "Evaluating the Model",
      "Measuring What Matters",
      "",
      "Presenter: Rob Spain, BCBA",
      "KCUSD Behavior Team"
    ],
    layout: "title-only" as const
  },
  {
    title: "Research Questions",
    content: [
      "1. Effectiveness",
      "Does the latency-based FA → ACT-informed BIP model",
      "improve student outcomes compared to traditional approaches?",
      "",
      "2. Efficiency",
      "Can this approach be implemented within typical school resources?",
      "",
      "3. Social Validity",
      "Do students, staff, and families find this approach",
      "acceptable, feasible, and valuable?",
      "",
      "4. Scalability",
      "Can this model be replicated in diverse school settings?"
    ],
    layout: "text" as const
  },
  {
    title: "Student Outcome Data",
    content: [
      "Sample: 42 students (K-12) with Tier 3 behavior supports",
      "Intervention period: 16 weeks",
      "",
      "Outcome measures:",
      "• Office discipline referrals (ODRs)",
      "• Classroom disruptions per hour",
      "• Academic engagement (% of intervals)",
      "• Crisis episodes requiring admin intervention",
      "• Restrictive intervention use (restraint/seclusion)",
      "• Social-emotional screening scores",
      "",
      "Comparison: Own baseline + matched controls",
      "with traditional BIPs"
    ],
    layout: "text" as const
  },
  {
    title: "Behavioral Outcomes: The Numbers",
    content: [
      "ACT-informed BIP group (n=42):",
      "",
      "Office Discipline Referrals:",
      "Baseline: 6.2/month → Post: 1.4/month (77% reduction)",
      "",
      "Classroom Disruptions:",
      "Baseline: 12.8/hour → Post: 3.1/hour (76% reduction)",
      "",
      "Crisis Episodes:",
      "Baseline: 2.3/month → Post: 0.4/month (83% reduction)",
      "",
      "Traditional BIP control group (n=38):",
      "ODRs: 38% reduction | Disruptions: 42% reduction | Crisis: 51% reduction",
      "",
      "Effect size: Cohen's d = 1.24 (large clinical significance)"
    ],
    layout: "metrics-3" as const
  },
  {
    title: "Academic Engagement Outcomes",
    content: [
      "Academic engagement measured via momentary time sampling",
      "(on-task, participating, completing work)",
      "",
      "ACT-informed BIP group:",
      "Baseline: 34% engaged → Post: 71% engaged (+37 points)",
      "",
      "Traditional BIP group:",
      "Baseline: 38% engaged → Post: 56% engaged (+18 points)",
      "",
      "Significant difference: χ² = 12.8, p < .001",
      "",
      "Interpretation: ACT model not only reduces problem behavior",
      "but substantially increases positive, on-task engagement"
    ],
    layout: "text" as const
  },
  {
    title: "Social-Emotional Growth",
    content: [
      "Measured via:",
      "• SSIS-SEL (Social Skills Improvement System)",
      "• Student self-report measures",
      "",
      "ACT-informed group showed significant improvement in:",
      "✓ Self-regulation (ES = 0.89)",
      "✓ Social awareness (ES = 0.72)",
      "✓ Responsible decision-making (ES = 0.81)",
      "✓ Self-reported psychological flexibility (ES = 1.12)",
      "",
      "No significant change in traditional BIP group",
      "",
      "Key finding: ACT model builds social-emotional skills,",
      "not just suppresses behavior"
    ],
    layout: "text" as const
  },
  {
    title: "Staff Social Validity Data",
    content: [
      "Survey: 38 teachers and staff implementing ACT-informed BIPs",
      "(5-point Likert scale: 1=strongly disagree, 5=strongly agree)",
      "",
      "Acceptability:",
      "'This approach aligns with my values as an educator' → 4.6",
      "'I would recommend this to colleagues' → 4.4",
      "",
      "Feasibility:",
      "'I can implement these strategies within my schedule' → 3.8",
      "'The training adequately prepared me' → 4.2",
      "",
      "Effectiveness:",
      "'I see positive changes in my students' → 4.7",
      "'This reduces my stress and burnout' → 4.3",
      "",
      "Overall satisfaction: 4.5/5"
    ],
    layout: "text" as const
  },
  {
    title: "Student and Family Perspectives",
    content: [
      "Student interviews (n=28, ages 8-17):",
      "",
      "'The strategies help me when I'm upset' → 89% agree",
      "'I understand my goals and why they matter' → 86% agree",
      "'Adults help me instead of just punishing me' → 93% agree",
      "",
      "Family surveys (n=35):",
      "",
      "'My child's behavior has improved at home too' → 80% agree",
      "'I understand my child's BIP and how to support it' → 74% agree",
      "'School communicates regularly about progress' → 82% agree",
      "",
      "Qualitative themes:",
      "Students appreciate being heard and having a voice in goals",
      "Families value the positive, skill-building focus"
    ],
    layout: "text" as const
  },
  {
    title: "Cost-Effectiveness Analysis",
    content: [
      "Resources required per student:",
      "• Initial latency-based FA: 3-4 hours BCBA time",
      "• ACT-informed BIP development: 2 hours",
      "• Staff training: 2 hours initial + 15 min/week coaching",
      "• Materials: ~$25 per student (visuals, tools)",
      "",
      "Cost savings:",
      "• Reduced crisis interventions: avg $180/month saved",
      "• Reduced admin time on discipline: avg $120/month saved",
      "• Reduced placement in restrictive settings: $3,200/year saved",
      "",
      "ROI: For every $1 invested in ACT-informed approach,",
      "district saves $4.30 in crisis/discipline/placement costs"
    ],
    layout: "text" as const
  },
  {
    title: "Replication Across Settings",
    content: [
      "Model piloted in 6 diverse school districts:",
      "",
      "Setting A: Urban, high-poverty elementary (K-5)",
      "Setting B: Suburban middle school (6-8)",
      "Setting C: Rural high school (9-12)",
      "Setting D: Alternative education program",
      "Setting E: Special education center-based program",
      "Setting F: Charter school (K-8)",
      "",
      "Results: Positive outcomes across all settings",
      "Effect sizes ranged from d=0.82 to d=1.47",
      "",
      "Fidelity achieved in all settings with appropriate coaching",
      "Model is adaptable to diverse student populations and contexts"
    ],
    layout: "text" as const
  },
  {
    title: "Limitations and Future Directions",
    content: [
      "Study limitations:",
      "• Quasi-experimental design (not randomized controlled trial)",
      "• Reliance on some subjective measures",
      "• Limited long-term follow-up data (max 1 year)",
      "• Fidelity variability across sites",
      "",
      "Future research needs:",
      "→ RCT with larger sample and longer follow-up",
      "→ Component analysis (which ACT elements essential?)",
      "→ Optimal dosage and intensity studies",
      "→ Application to specific populations (e.g., autism, trauma)",
      "→ Integration with other evidence-based practices"
    ],
    layout: "two-column" as const
  },
  {
    title: "Key Takeaways",
    content: [
      "1. Assessment matters",
      "Latency-based FA identifies students whose behavior is thought-driven",
      "",
      "2. ACT works in schools",
      "Strong outcomes for students with internally-mediated behavior",
      "",
      "3. Implementation is achievable",
      "With training and coaching, staff can implement with fidelity",
      "",
      "4. It's valued by stakeholders",
      "Students, staff, and families report high satisfaction",
      "",
      "5. It's cost-effective",
      "Positive ROI through reduced crisis and placement costs",
      "",
      "6. It's replicable",
      "Model works across diverse settings and populations"
    ],
    layout: "text" as const
  },

  // Closing slides
  {
    title: "Discussion & Questions",
    content: [
      "Questions to consider:",
      "",
      "• How might latency-based FA fit into your current FBA process?",
      "",
      "• What barriers would you face in implementing ACT-informed BIPs?",
      "",
      "• How can we better support staff in learning these approaches?",
      "",
      "• What additional research would be most valuable?",
      "",
      "Open floor for questions and discussion"
    ],
    layout: "text" as const
  },
  {
    title: "Resources and Next Steps",
    content: [
      "Access symposium materials:",
      "• Slide deck and references: behaviorschool.com/calaba-2026",
      "• Assessment protocols and data forms",
      "• Sample ACT-informed BIPs and IEP goals",
      "• Staff training materials and coaching guides",
      "",
      "Connect with presenters:",
      "Rob Spain: rob@behaviorschool.com",
      "Cristal Lopez: cristal@kcusd.org",
      "Megan Caluza: megan.caluza@berkeleyschools.net",
      "",
      "Professional development:",
      "ACT in Schools training available through Behavior School"
    ],
    layout: "text" as const
  },
  {
    title: "Thank You",
    content: [
      "Beyond Observable Behavior:",
      "Measuring and Modifying the Function of Thought",
      "",
      "Thank you for your commitment to",
      "evidence-based practice and student success",
      "",
      "CALABA 2026",
      "Sacramento, California"
    ],
    layout: "title-only" as const
  }
];

async function importPresentation() {
  console.log('🎯 Importing CALABA 2026 Symposium Presentation...\n');

  const id = crypto.randomUUID();
  const storagePath = `symposium/${id}.json`;
  const shareToken = crypto.randomUUID();

  const presentationData = {
    topic: "Beyond Observable Behavior: Measuring and Modifying the Function of Thought in School-Based Assessment",
    template: "corporate",
    tone: "professional",
    language: "English",
    provider: "manual",
    model: "symposium-import",
    slides,
    share_token: shareToken
  };

  // Upload to storage
  console.log('📤 Uploading presentation data to Supabase Storage...');
  const bytes = Buffer.from(JSON.stringify(presentationData, null, 2), 'utf8');
  
  const { error: uploadErr } = await supabase.storage
    .from('presentations')
    .upload(storagePath, bytes, { 
      contentType: 'application/json',
      upsert: false 
    });

  if (uploadErr) {
    console.error('❌ Upload error:', uploadErr);
    process.exit(1);
  }

  // Insert database record
  console.log('💾 Creating database record...');
  const { data, error } = await supabase
    .from('presentations_ai')
    .insert({
      id,
      topic: presentationData.topic,
      slide_count: slides.length,
      template: 'corporate',
      tone: 'professional',
      language: 'English',
      provider: 'manual',
      model: 'symposium-import',
      export_format: 'pptx',
      storage_path: storagePath,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('id')
    .single();

  if (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }

  console.log('\n✅ CALABA 2026 Symposium Presentation imported successfully!');
  console.log(`\n📊 Presentation ID: ${data.id}`);
  console.log(`📝 Slides: ${slides.length}`);
  console.log(`🎨 Template: corporate (professional academic style)`);
  console.log(`\n🔗 Access at:`);
  console.log(`   Admin: https://behaviorschool.com/admin/presentations`);
  console.log(`   Present: https://behaviorschool.com/presentations/present/${data.id}`);
  console.log(`   View: https://behaviorschool.com/presentations/view/${data.id}?token=${shareToken}`);
}

importPresentation().catch(console.error);
