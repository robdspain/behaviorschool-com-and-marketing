#!/usr/bin/env npx tsx
/**
 * Import PBIS Conference Presentation into the presentation system.
 * 
 * Usage: npx tsx scripts/import-pbis-presentation.ts
 * 
 * This converts the markdown content from PBIS_Conference_Presentation_Enhanced.md
 * into the slide format expected by the presentation system and creates it via
 * the API or directly in Supabase.
 * 
 * For now, this outputs the JSON that can be pasted into the create-draft + PATCH flow,
 * or used with the generate endpoint's "slides" parameter.
 */

const slides = [
  {
    title: "CEC Compliance Notice",
    content: [
      "This session is approved for Continuing Education Credits",
      "Please check the CA-PBIS website for session details",
      "Approved sessions will be labeled accordingly"
    ],
    layout: "text" as const
  },
  {
    title: "BCBAs in PBIS Leadership Panel",
    content: [
      "Megan Caluza, BCBA — Behavior Specialist, Berkeley Unified School District",
      "Rob Spain, BCBA — Founder, Behavior School | PBIS Systems Consultant",
      "Holly Northcross, BCBA — Multi-Tiered Behavior Support Specialist",
      "Katie Turner, Ed.D., BCBA — Director of Student Support & Family Services"
    ],
    layout: "text" as const
  },
  {
    title: "Learning Objectives",
    content: [
      "Define the evolving role of BCBAs within multi-tiered behavior support systems",
      "Identify collaborative opportunities to maximize BCBA expertise within school districts",
      "Analyze successful collaboration examples from across California",
      "Develop action plans for integrating BCBAs into existing PBIS frameworks"
    ],
    layout: "text" as const
  },
  {
    title: "BCBAs in PBIS: How Districts Can Maximize Behavioral Expertise for Student Success",
    content: [
      "Transforming school-wide behavior support through evidence-based collaboration",
      "CA-PBIS Conference 2025"
    ],
    layout: "title-only" as const
  },
  {
    title: "The Evolution of BCBAs in Schools",
    content: [
      "New position category within the last 10 years",
      "Exponential growth in school-based BCBA positions",
      "Varying role definitions across districts",
      "Limited understanding from decision-makers",
      "Lack of standardized state licensing/credentialing",
      "BCBAs represent untapped potential in most school systems"
    ],
    layout: "text" as const
  },
  {
    title: "Understanding Applied Behavior Analysis — The Foundation of PBIS",
    content: [
      "Board Certified Behavior Analysts (BCBAs) practice Applied Behavior Analysis (ABA)",
      "ABA principles developed from B.F. Skinner's research",
      "PBIS frameworks emerged from ABA research by Rob Horner and George Sugai",
      "Natural alignment between ABA methodology and PBIS implementation",
      "Despite this connection, many districts struggle to effectively utilize BCBAs in PBIS work"
    ],
    layout: "text" as const
  },
  {
    title: "Three Models of BCBAs in Schools",
    content: [
      "Model 1 — Tier 3 Specialist: Special Education Consultation & Assessment, focused on students with IEPs",
      "Model 2 — Multi-Tier Integration: Comprehensive Behavior Support across all three PBIS tiers",
      "Model 3 — Systems Leadership: District-wide PBIS/MTSS coordination, leadership development, technology integration"
    ],
    layout: "text" as const
  },
  {
    title: "BAESIG Research Insights — California's BCBAs in Education",
    content: [
      "Average caseload: 15 students (range: 0-50)",
      "50% of BCBAs serve students outside special education",
      "Primary challenge: Insufficient time for comprehensive service delivery",
      "Expanding presence in all California regions",
      "BAESIG: Professional platform for Behavior Analysts in educational environments"
    ],
    layout: "metrics-3" as const
  },
  {
    title: "Interactive Poll — Current Utilization",
    content: [
      "We utilize BCBAs in special education services",
      "We have BCBAs providing Tier 3 intensive support",
      "We use BCBAs for Tier 2 targeted interventions",
      "We involve BCBAs in Tier 1 universal support",
      "BCBAs participate in our systems-level implementation",
      "Note the progression from reactive (Tier 3) to proactive (Tier 1) utilization"
    ],
    layout: "text" as const
  },
  {
    title: "How BCBAs Enhance PBIS — All Tiers",
    content: [
      "Tier 3: Comprehensive FBAs, function-based BIPs, special ed & 504 support, crisis planning",
      "Tier 2: Evidence-based interventions (CICO), small group social skills, data analysis, staff training",
      "Tier 1: School-wide expectations, classroom management design, discipline analysis, universal screening"
    ],
    layout: "text" as const
  },
  {
    title: "BCBAs as Expert Coaches",
    content: [
      "Systematic approach: Evidence-based training methodologies",
      "Performance-focused: Behavioral skills training (BST) expertise",
      "Data-driven: Objective measurement of implementation fidelity",
      "Sustainable impact: Training existing staff reduces dependency",
      "Key Principle: Train the people already at sites to do the work effectively"
    ],
    layout: "text" as const
  },
  {
    title: "BCBAs in Systems Building — Evidence-Based Support",
    content: [
      "School-wide Information System (SIS) implementation",
      "Tiered intervention matching protocols",
      "Decision-Point Rule (DPR) implementation",
      "Progress monitoring frameworks",
      "Fidelity monitoring across all tiers",
      "Continuous improvement processes"
    ],
    layout: "text" as const
  },
  {
    title: "Tier 3 Deep Dive — Individual Support",
    content: [
      "BCBAs are well-established in Tier 3 services statewide",
      "Comprehensive FBAs for special education students",
      "Behavior intervention plan (BIP) development and monitoring",
      "IEP team collaboration and goal development",
      "Crisis response and safety planning",
      "Expansion: Section 504 plans, general ed students, intake/triage systems"
    ],
    layout: "text" as const
  },
  {
    title: "Tier 3 Success Example — Section 504 Support",
    content: [
      "Student with existing Section 504 plan showing declining response to current interventions",
      "Collaborative assessment with school therapist",
      "Integration with existing Zones of Regulation framework",
      "Function-based intervention design within familiar structure",
      "Key Strategy: Individualization within universal frameworks",
      "Outcome: Improved effectiveness while maintaining consistency"
    ],
    layout: "text" as const
  },
  {
    title: "Audience Share — Tier 3 Examples",
    content: [
      "Do you have successful Tier 3 BCBA collaboration examples to share?",
      "What made the collaboration successful?",
      "What barriers did you encounter?",
      "How did you measure impact?",
      "What would you do differently?"
    ],
    layout: "text" as const
  },
  {
    title: "Tier 2 Deep Dive — Targeted Support",
    content: [
      "Most BCBAs have relevant training but are less frequently deployed at Tier 2",
      "Tier 2 often skipped for special education students, limiting BCBA involvement",
      "BCBA Value-Add: Reinforcement system design, intervention customization",
      "Staff training in evidence-based practices",
      "Data collection and progress monitoring systems",
      "Population: General education students with emerging behavioral concerns"
    ],
    layout: "text" as const
  },
  {
    title: "Tier 2 Success Example — Middle School CICO",
    content: [
      "Challenge: Multiple students showing off-task behavior, calling out, mild disruption",
      "Assessment: Multi-source data review to identify Tier 2 candidates",
      "Design: Streamlined Check-In/Check-Out system with clear procedures",
      "Training: Behavioral Skills Training (BST) for staff on greeting, feedback, reinforcement",
      "Group Intervention: Co-facilitated replacement behavior instruction",
      "Innovation: Evolution from simple star charts to meaningful, targeted goal achievement"
    ],
    layout: "text" as const
  },
  {
    title: "Audience Share — Tier 2 Examples",
    content: [
      "Do you have Tier 2 BCBA collaboration examples to share?",
      "How did you identify students for Tier 2?",
      "What interventions worked best?",
      "How did you train and support staff?",
      "What data did you collect?"
    ],
    layout: "text" as const
  },
  {
    title: "Tier 1 Deep Dive — Universal Support",
    content: [
      "BCBAs often underutilized at Tier 1 despite having relevant expertise",
      "Many schools have Tier 1 support staff not trained in behavior change science",
      "BCBAs typically used reactively rather than proactively",
      "Strategic Positioning: BCBAs can provide the scientific foundation for universal interventions"
    ],
    layout: "text" as const
  },
  {
    title: "Tier 1 Success Example — Comprehensive Universal Support",
    content: [
      "Lead PBIS training sessions and classroom management workshops",
      "Address PBIS myths and misconceptions, share data demonstrating benefits",
      "Conduct behavior observation walkthroughs with real-time feedback",
      "Train staff in universal screening tools and data interpretation",
      "Refine acknowledgment systems, develop behavior lesson plans",
      "Monitor discipline data for disproportionality and ensure culturally responsive practices"
    ],
    layout: "text" as const
  },
  {
    title: "Tier 1 Practical Example — Good Behavior Game",
    content: [
      "System Design: Help teacher develop classwide reinforcement system",
      "Implementation Support: Guide initial setup and procedures",
      "Data Collection: Design simple, sustainable measurement system",
      "Analysis & Refinement: Review data, determine effectiveness, improve",
      "Outcome: Teacher gains concrete skills; students benefit from systematic approach",
      "Sustainability: System becomes teacher-owned with BCBA consultation as needed"
    ],
    layout: "text" as const
  },
  {
    title: "Audience Share — Tier 1 Examples",
    content: [
      "Do you have Tier 1 BCBA collaboration examples to share?",
      "What universal strategies have worked?",
      "How do you build staff buy-in?",
      "What data do you collect schoolwide?",
      "How do you ensure sustainability?"
    ],
    layout: "text" as const
  },
  {
    title: "BCBAs and RBTs — Team Approach",
    content: [
      "Registered Behavior Technicians (RBTs): Expert implementers under BCBA supervision",
      "RBTs model implementation across all PBIS tiers",
      "Provide peer coaching to school staff",
      "Bridge between BCBA design and classroom reality",
      "Case Example: 6-week fade system with intensive initial support and systematic reduction",
      "Sustainable handoff to school staff"
    ],
    layout: "text" as const
  },
  {
    title: "Implementation Barriers",
    content: [
      "Capacity: BCBA job duties far exceed available hours → reactive service delivery",
      "Systems Access: BCBAs hired specifically for special ed → limited access to gen ed and universal",
      "Strategic Solution: Develop flexible roles supporting both prevention AND response",
      "Maximizes BCBA effectiveness while reducing burnout"
    ],
    layout: "two-column" as const
  },
  {
    title: "Getting Started — Action Steps",
    content: [
      "1. Include BCBAs in All PBIS Discussions — invite to team meetings across all tiers",
      "2. Leverage BCBA Training Expertise — co-present PBIS training, utilize BST expertise",
      "3. Provide Coaching Time and Space — allocate time for BCBAs to coach educational staff",
      "4. Strategic Leadership Placement — hire BCBAs into MTSS and PBIS management positions"
    ],
    layout: "text" as const
  },
  {
    title: "Supporting Research",
    content: [
      "Layden, Lorio-Barsten, & Rizvi (2023): Roles and Responsibilities of School-Based Behavior Analysts",
      "Horner & Sugai (2015): Defining and describing schoolwide positive behavior support",
      "Kellam et al. (2011): Good Behavior Game effects on behavior and academic achievement",
      "Sottilare & Blair (2023): Check-in Check-out: A systematic review",
      "School-wide Information System (SIS) research and implementation guides"
    ],
    layout: "text" as const
  },
  {
    title: "Practical Resources",
    content: [
      "Diagnostic Centers: Regional support for complex cases",
      "PENT (Positive Environments, Network of Trainers): Professional development",
      "CAPTAIN: Crisis prevention and intervention training",
      "Character Strong: Social-emotional learning integration",
      "CalABA and BAESIG: Professional organizations for behavior analysts in education",
      "Join our community at behaviorschool.com for additional resources"
    ],
    layout: "text" as const
  },
  {
    title: "90-Day Action Plan",
    content: [
      "Month 1 — Assessment & Planning: Audit current BCBA utilization, identify PBIS gaps, survey readiness",
      "Month 2 — Pilot Implementation: Select one tier, provide targeted PD, establish data collection",
      "Month 3 — Evaluation & Expansion: Analyze pilot data, refine processes, plan expansion",
      "Continuous Cycle: Assessment → Implementation → Evaluation → Refinement"
    ],
    layout: "text" as const
  },
  {
    title: "Measuring Success — Key Performance Indicators",
    content: [
      "Student Outcomes: Reduced ODRs, increased engagement, improved SEL indicators",
      "Systems Indicators: Implementation fidelity, staff confidence, reduced crisis incidents",
      "BCBA Outcomes: Reduced burnout, increased job satisfaction, enhanced role clarity",
      "Staff retention rates and professional growth opportunities"
    ],
    layout: "metrics-3" as const
  },
  {
    title: "Next Steps & Resources",
    content: [
      "Connect with BAESIG: Join our special interest group for ongoing support",
      "Assessment: Complete a district-wide BCBA utilization audit",
      "Planning: Develop a 90-day pilot implementation plan",
      "Training: Invest in BCBA leadership and coaching skills development",
      "Behavior School Platform: Free tools and resources at behaviorschool.com"
    ],
    layout: "text" as const
  },
  {
    title: "CEC Compliance Closing",
    content: [
      "Thank you for attending our CEC-approved session on BCBAs in PBIS!",
      "Please complete any required evaluation forms for continuing education credits"
    ],
    layout: "text" as const
  },
  {
    title: "Stay Connected — Contact & Questions",
    content: [
      "Rob Spain, BCBA: rob@behaviorschool.com | behaviorschool.com",
      "BAESIG: Contact through CalABA website",
      "All presentation materials available at behaviorschool.com/pbis-resources",
      "Thank you for your commitment to evidence-based behavior support in schools!"
    ],
    layout: "text" as const
  }
];

// Output the JSON for use with the API
const presentation = {
  title: "BCBAs in PBIS: Maximizing Behavioral Expertise in School Systems",
  topic: "BCBAs in PBIS: How Districts Can Maximize Behavioral Expertise for Student Success — CA-PBIS Conference 2025",
  slides,
  template: "modern",
  tone: "professional",
  language: "English",
  slideCount: slides.length,
  provider: "manual",
  model: "imported"
};

console.log(JSON.stringify(presentation, null, 2));
console.log(`\n✅ ${slides.length} slides ready for import`);
console.log('\nTo import via API:');
console.log('1. POST /api/admin/presentations/create-draft with topic/template/etc');
console.log('2. PATCH /api/admin/presentations/[id] with { slides: [...] }');
console.log('\nOr use the generate endpoint with the "slides" parameter to skip AI generation.');
