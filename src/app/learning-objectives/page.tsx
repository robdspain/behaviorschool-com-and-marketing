import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "BCBA & RBT Learning Objectives 2026 | BACB Task List | Behavior School",
  description: "Complete BCBA 6th Edition and RBT 3rd Edition learning objectives aligned with BACB 2026 requirements. All domains, tasks, and exam content coverage.",
  keywords: [
    "BCBA learning objectives",
    "RBT learning objectives 2026",
    "BACB task list 6th edition",
    "RBT task list 3rd edition",
    "BCBA exam domains",
    "RBT exam domains 2026",
    "behavior analyst certification requirements"
  ],
  openGraph: {
    title: "BCBA & RBT Learning Objectives 2026",
    description: "Complete learning objectives aligned with BACB 2026 requirements",
  }
};

// BCBA 6th Edition Task List (Current)
const bcbaObjectives = [
  {
    domain: "Behaviorism and Philosophical Foundations",
    percentage: 5,
    tasks: [
      "Identify the goals of behavior analysis as a science (description, prediction, control)",
      "Explain the philosophical assumptions underlying the science of behavior analysis",
      "Describe and explain behavior from the perspective of radical behaviorism",
      "Distinguish among behaviorism, the experimental analysis of behavior, applied behavior analysis, and professional practice",
      "Identify and describe dimensions of applied behavior analysis"
    ]
  },
  {
    domain: "Concepts and Principles",
    percentage: 14,
    tasks: [
      "Identify and distinguish among behavior, response, and response class",
      "Identify and distinguish between stimulus and stimulus class",
      "Identify and distinguish between respondent and operant conditioning",
      "Identify and distinguish between positive and negative reinforcement contingencies",
      "Identify and distinguish between positive and negative punishment contingencies",
      "Identify and distinguish between automatic and socially mediated contingencies",
      "Identify and distinguish among unconditioned, conditioned, and generalized reinforcers",
      "Identify and distinguish among unconditioned, conditioned, and generalized punishers",
      "Identify and distinguish among simple schedules of reinforcement",
      "Identify and distinguish among concurrent, multiple, mixed, and chained schedules",
      "Identify and distinguish between operant and respondent extinction",
      "Identify examples of stimulus control and discrimination",
      "Identify and distinguish between stimulus and response generalization",
      "Identify examples of response maintenance and motivating operations",
      "Distinguish between motivating operations and stimulus control",
      "Identify and distinguish between rule-governed and contingency-shaped behavior",
      "Identify and distinguish among verbal operants",
      "Identify the role of multiple control in verbal behavior",
      "Identify examples of processes that promote emergent relations",
      "Identify ways behavioral momentum can be used to understand response persistence",
      "Identify ways the matching law can interpret response allocation",
      "Identify and distinguish between imitation and observational learning"
    ]
  },
  {
    domain: "Measurement, Data Display, and Interpretation",
    percentage: 12,
    tasks: [
      "Create operational definitions of behavior",
      "Distinguish among direct, indirect, and product measures of behavior",
      "Measure occurrence and temporal dimensions of behavior",
      "Distinguish between continuous and discontinuous measurement procedures",
      "Design and apply discontinuous measurement procedures",
      "Measure efficiency (trials to criterion, cost-benefit analysis)",
      "Evaluate the validity and reliability of measurement procedures",
      "Select measurement procedures for representative data",
      "Graph data to communicate quantitative relations",
      "Interpret graphed data",
      "Select measurement procedures for procedural integrity data"
    ]
  },
  {
    domain: "Experimental Design",
    percentage: 7,
    tasks: [
      "Distinguish between dependent and independent variables",
      "Distinguish between internal and external validity",
      "Identify threats to internal validity",
      "Identify the defining features of single-case experimental designs",
      "Identify the relative strengths of single-case and group designs",
      "Critique and interpret data from single-case experimental designs",
      "Distinguish among reversal, multiple-baseline, multielement, and changing-criterion designs",
      "Identify rationales for comparative, component and parametric analyses",
      "Apply single-case experimental designs"
    ]
  },
  {
    domain: "Ethical and Professional Issues",
    percentage: 13,
    tasks: [
      "Identify and apply core principles underlying the ethics codes for BACB certificants",
      "Identify the risks of engaging in unethical behavior",
      "Develop and maintain competence through professional development",
      "Comply with requirements for confidential information",
      "Comply with requirements for making public statements",
      "Apply steps for transitioning clients and supervisees",
      "Identify types of and risks associated with multiple relationships",
      "Apply interpersonal skills to establish professional relationships",
      "Engage in cultural humility in service delivery",
      "Apply culturally responsive and inclusive practices",
      "Identify personal biases that might interfere with professional activity",
      "Apply legal, regulatory, and practice requirements"
    ]
  },
  {
    domain: "Behavior Assessment",
    percentage: 13,
    tasks: [
      "Identify relevant sources of information in records",
      "Integrate relevant cultural variables in assessment",
      "Design and evaluate skill assessments",
      "Design and evaluate preference assessments",
      "Design and evaluate descriptive assessments",
      "Design and evaluate functional analyses",
      "Interpret assessment data to determine need for services",
      "Interpret assessment data to prioritize behavior-change goals"
    ]
  },
  {
    domain: "Behavior-Change Procedures",
    percentage: 14,
    tasks: [
      "Design and evaluate positive and negative reinforcement procedures",
      "Design and evaluate differential reinforcement procedures",
      "Design and evaluate time-based reinforcement schedules",
      "Identify procedures to establish conditioned reinforcers",
      "Incorporate motivating operations and discriminative stimuli",
      "Design and evaluate procedures for discriminations",
      "Select and evaluate prompting procedures",
      "Design and implement prompt fading procedures",
      "Design and evaluate modeling procedures",
      "Design and evaluate instructions and rules",
      "Shape dimensions of behavior",
      "Select and implement chaining procedures",
      "Design and evaluate trial-based and free-operant procedures",
      "Design and evaluate group contingencies",
      "Design and evaluate generalization procedures",
      "Design and evaluate maintenance procedures",
      "Design and evaluate punishment procedures",
      "Evaluate emotional and elicited effects of behavior-change procedures",
      "Design and evaluate procedures for emergent relations"
    ]
  },
  {
    domain: "Selecting and Implementing Interventions",
    percentage: 12,
    tasks: [
      "Develop intervention goals in observable and measurable terms",
      "Recommend interventions based on assessment results and evidence",
      "Select socially valid alternative behaviors",
      "Plan for and mitigate unwanted effects of procedures",
      "Plan for and mitigate possible relapse",
      "Make data-based decisions about procedural integrity",
      "Make data-based decisions about intervention effectiveness",
      "Collaborate with others to support client services"
    ]
  },
  {
    domain: "Personnel Supervision and Management",
    percentage: 10,
    tasks: [
      "Identify the benefits of behavior-analytic supervision",
      "Apply strategies for effective supervisory relationships",
      "Implement methods that promote equity in supervision",
      "Select supervision goals based on supervisee assessment",
      "Apply empirically validated performance management procedures",
      "Apply function-based approach to supervisee behavior",
      "Make data-based decisions about supervisory practices"
    ]
  }
];

// RBT 3rd Edition Task List (Effective January 1, 2026)
const rbtObjectives = [
  {
    domain: "Data Collection and Graphing",
    code: "A",
    percentage: 17,
    questions: 13,
    tasks: [
      "A.1. Implement continuous measurement procedures (frequency, duration, latency, IRT)",
      "A.2. Implement discontinuous measurement procedures (interval, time sampling)",
      "A.3. Implement permanent product recording procedures",
      "A.4. Enter data and update graphs",
      "A.5. Describe behavior and environment in observable and measurable terms",
      "A.6. Calculate and summarize data (rate, mean duration, percentage) ★ NEW",
      "A.7. Identify trends in graphed data ★ NEW",
      "A.8. Describe risks of unreliable data and poor procedural fidelity ★ NEW"
    ]
  },
  {
    domain: "Behavior Assessment",
    code: "B",
    percentage: 11,
    questions: 8,
    tasks: [
      "B.1. Conduct preference assessments (multiple stimulus, paired stimulus, free operant)",
      "B.2. Participate in assessments of skill strengths and deficits",
      "B.3. Participate in functional assessment procedures"
    ]
  },
  {
    domain: "Behavior Acquisition",
    code: "C",
    percentage: 25,
    questions: 19,
    tasks: [
      "C.1. Implement positive and negative reinforcement procedures",
      "C.2. Implement procedures to establish conditioned reinforcers",
      "C.3. Implement discrete-trial teaching procedures",
      "C.4. Implement naturalistic teaching procedures (incidental teaching, NET)",
      "C.5. Implement task analyzed chaining procedures",
      "C.6. Implement discrimination training",
      "C.7. Implement prompting and fading procedures",
      "C.8. Implement generalization procedures",
      "C.9. Distinguish between maintenance and acquisition procedures",
      "C.10. Implement shaping procedures",
      "C.11. Implement token economies"
    ]
  },
  {
    domain: "Behavior Reduction",
    code: "D",
    percentage: 19,
    questions: 14,
    tasks: [
      "D.1. Identify common functions of behavior",
      "D.2. Implement antecedent interventions (NCR, high-p, demand fading)",
      "D.3. Implement differential reinforcement procedures (DRO, DRA, DRI, DRL, FCT)",
      "D.4. Implement extinction procedures",
      "D.5. Implement positive and negative punishment procedures ★ NEW",
      "D.6. Describe secondary effects of extinction and punishment ★ NEW",
      "D.7. Implement crisis/emergency procedures"
    ]
  },
  {
    domain: "Documentation and Reporting",
    code: "E",
    percentage: 13,
    questions: 10,
    tasks: [
      "E.1. Communicate concerns and suggestions with supervisor",
      "E.2. Seek and prioritize clinical direction from supervisor",
      "E.3. Report variables that might affect client progress",
      "E.4. Communicate objectively per legal and workplace requirements"
    ]
  },
  {
    domain: "Ethics",
    code: "F",
    percentage: 15,
    questions: 11,
    tasks: [
      "F.1. Identify and apply core ethics principles ★ NEW",
      "F.2. Provide services only after demonstrating competence",
      "F.3. Provide services only under ongoing supervision",
      "F.4. Identify effective supervision practices",
      "F.5. Comply with requirements for confidential information",
      "F.6. Comply with requirements for public statements",
      "F.7. Identify risks of multiple relationships",
      "F.8. Adhere to gift giving/receiving guidelines ★ NEW",
      "F.9. Apply interpersonal and professional skills",
      "F.10. Engage in cultural humility and responsiveness ★ NEW"
    ]
  }
];

export default function LearningObjectivesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs items={[{ label: "Learning Objectives" }]} />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              BACB 2026 Requirements
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Complete Learning Objectives
            </h1>
            <p className="text-xl text-gray-600">
              All BCBA 6th Edition and RBT 3rd Edition task list items aligned with current BACB requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Important 2026 Update Notice */}
      <section className="py-8 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <h2 className="font-bold text-amber-900 text-lg">Important 2026 Update: RBT Task List 3rd Edition</h2>
              <p className="text-amber-800 mt-1">
                Effective <strong>January 1, 2026</strong>, all RBT exams are based on the new 3rd Edition Test Content Outline. 
                Key changes include 8 new tasks, renamed domains, and expanded ethics requirements. 
                BCBA certification continues to use the 6th Edition Task List.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RBT Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                RBT
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                3rd Edition — Effective 2026
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              RBT Test Content Outline (3rd Edition)
            </h2>
            <p className="text-gray-600">
              6 domains • 43 tasks • 75 exam questions
            </p>
          </div>

          <div className="space-y-8">
            {rbtObjectives.map((domain, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                      {domain.code}. {domain.domain}
                    </h3>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                        {domain.percentage}% of exam
                      </span>
                      <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                        {domain.questions} questions
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {domain.tasks.map((task, taskIdx) => (
                      <li key={taskIdx} className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        <span className={task.includes("★ NEW") ? "text-gray-900 font-medium" : "text-gray-700"}>
                          {task}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BCBA Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                BCBA
              </span>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
                6th Edition — Current
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              BCBA Test Content Outline (6th Edition)
            </h2>
            <p className="text-gray-600">
              9 domains • 105 tasks • 185 exam questions
            </p>
          </div>

          <div className="space-y-8">
            {bcbaObjectives.map((domain, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                      {domain.domain}
                    </h3>
                    <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                      {domain.percentage}% of exam
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {domain.tasks.map((task, taskIdx) => (
                      <li key={taskIdx} className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                        <span className="text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Master These Objectives?
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Our AI-powered study tools adapt to your knowledge level and help you master every task list item.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/free-bcba-practice-test"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
            >
              Try Free BCBA Practice Test
            </Link>
            <Link
              href="/bcba-study-tools"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition-colors"
            >
              Explore Study Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
