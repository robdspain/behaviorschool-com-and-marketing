"use client";

import Link from "next/link";
import { ArrowRight, Target, Clock, Brain, BookOpen, Shield, BarChart3 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PracticeQuiz } from "./PracticeQuiz";

const questions = [
  // === SECTION A: Ethics (1-3) ===
  {
    id: "fp1",
    tag: "A-1: Identify the goals of behavior analysis as a science",
    stem: "A school administrator asks a BCBA to implement a published intervention without first collecting baseline data, citing urgency. The BCBA's most appropriate response is to:",
    choices: [
      "Implement the intervention immediately as requested by the administrator",
      "Explain that behavior-analytic practice requires baseline data to evaluate intervention effects",
      "Refuse to work with the administrator and document the disagreement",
      "Implement the intervention but secretly collect baseline data",
    ],
    answer: "Explain that behavior-analytic practice requires baseline data to evaluate intervention effects",
    letter: "B",
    explanation:
      "Behavior analysis is grounded in data-based decision making. Baseline data are essential for evaluating whether an intervention produces meaningful change. The BCBA should advocate for evidence-based practice while maintaining a collaborative relationship.",
  },
  {
    id: "fp2",
    tag: "A-5: Comply with applicable legal, regulatory, and workplace requirements",
    stem: "A BCBA working in a school district learns that a paraprofessional has been using physical prompts that were not included in the behavior intervention plan. What should the BCBA do FIRST?",
    choices: [
      "Report the paraprofessional to the school principal immediately",
      "Document the incident and provide immediate retraining on the approved plan",
      "Modify the BIP to include physical prompts since they are already being used",
      "Ignore it if the physical prompts appear to be effective",
    ],
    answer: "Document the incident and provide immediate retraining on the approved plan",
    letter: "B",
    explanation:
      "The BCBA's first responsibility is to ensure procedural fidelity. Documenting the deviation and retraining the implementer addresses both the ethical concern and the immediate safety issue. Modifying the BIP to match unauthorized procedures or ignoring the issue would be ethically inappropriate.",
  },
  {
    id: "fp3",
    tag: "A-2: Behave in accordance with the Ethics Code for Behavior Analysts",
    stem: "A BCBA receives a referral for a child whose primary language is Mandarin. The BCBA does not speak Mandarin and there are no bilingual BCBAs available locally. The most ethical course of action is to:",
    choices: [
      "Accept the case and use Google Translate during sessions",
      "Accept the case and rely on the child's older sibling to interpret",
      "Accept the case but arrange for a qualified interpreter and culturally responsive assessment",
      "Decline the referral because the language barrier makes effective service impossible",
    ],
    answer: "Accept the case but arrange for a qualified interpreter and culturally responsive assessment",
    letter: "C",
    explanation:
      "The Ethics Code requires BCBAs to practice within their scope of competence while also ensuring access to services. Using a qualified interpreter and adapting assessment procedures is the most ethical approach. Using untrained interpreters (family members) or automated translation tools introduces significant validity concerns.",
  },
  // === SECTION B: Concepts & Principles (4-7) ===
  {
    id: "fp4",
    tag: "B-3: Define and provide examples of respondent and operant conditioning",
    stem: "A child who was stung by a bee now cries when seeing any flying insect. The crying upon seeing a fly is best described as:",
    choices: [
      "An operant response maintained by negative reinforcement",
      "A conditioned emotional response through respondent generalization",
      "An unconditioned response to an unconditioned stimulus",
      "A mand for removal of the insect",
    ],
    answer: "A conditioned emotional response through respondent generalization",
    letter: "B",
    explanation:
      "The bee sting (US) was paired with the sight of the bee (CS), producing a conditioned emotional response (CR). The child now responds to similar stimuli (other flying insects), demonstrating respondent stimulus generalization. This is not operant behavior because the crying is elicited, not emitted.",
  },
  {
    id: "fp5",
    tag: "B-6: Define and provide examples of positive and negative reinforcement contingencies",
    stem: "A teacher removes a difficult math worksheet when a student raises their hand and says, 'I need help.' The student's hand-raising increases in future math sessions. This is an example of:",
    choices: [
      "Positive reinforcement of hand-raising",
      "Negative reinforcement of hand-raising",
      "Positive punishment of non-compliance",
      "Negative punishment of task avoidance",
    ],
    answer: "Negative reinforcement of hand-raising",
    letter: "B",
    explanation:
      "The removal (negative) of the aversive stimulus (difficult worksheet) contingent on hand-raising increases the future probability of hand-raising (reinforcement). This is a classic example of negative reinforcement — specifically, escape from an aversive task.",
  },
  {
    id: "fp6",
    tag: "B-12: Define and provide examples of stimulus equivalence",
    stem: "After being taught to match the written word 'CAT' to a picture of a cat (AB) and the spoken word 'cat' to the written word 'CAT' (CA), a learner can now match the spoken word 'cat' to the picture of a cat without direct training. This untrained relation demonstrates:",
    choices: [
      "Reflexivity",
      "Symmetry",
      "Transitivity",
      "Stimulus generalization",
    ],
    answer: "Transitivity",
    letter: "C",
    explanation:
      "Transitivity is the emergence of an untrained relation (CB) after training AB and CA relations. If A=B and C=A, then C=B without direct training. This is a key component of stimulus equivalence and differs from reflexivity (A=A), symmetry (if A=B, then B=A), and simple stimulus generalization.",
  },
  {
    id: "fp7",
    tag: "B-7: Define and provide examples of punishment contingencies",
    stem: "Every time a student uses profanity in class, the teacher requires the student to write an apology letter. Profanity decreases over time. This procedure is best classified as:",
    choices: [
      "Negative punishment",
      "Positive punishment",
      "Response cost",
      "Overcorrection",
    ],
    answer: "Positive punishment",
    letter: "B",
    explanation:
      "Adding (positive) the requirement to write an apology letter contingent on profanity, which decreases the behavior (punishment), makes this positive punishment. Response cost involves removing a reinforcer, negative punishment removes something, and overcorrection specifically involves restitution or positive practice related to the target behavior.",
  },
  // === SECTION C: Measurement (8-10) ===
  {
    id: "fp8",
    tag: "C-1: Establish operational definitions of behavior",
    stem: "Which of the following is the BEST operational definition of 'aggression' for data collection purposes?",
    choices: [
      "The student becomes angry and acts out toward peers",
      "Any instance of hitting, kicking, biting, or scratching another person with sufficient force to leave a mark or cause the other person to cry",
      "Physical contact with another person that is inappropriate",
      "The student is aggressive when frustrated or denied access to preferred items",
    ],
    answer: "Any instance of hitting, kicking, biting, or scratching another person with sufficient force to leave a mark or cause the other person to cry",
    letter: "B",
    explanation:
      "A strong operational definition includes specific, observable, and measurable topographies with clear criteria for occurrence. Option B specifies exact behaviors and thresholds. The other options use subjective terms ('angry,' 'inappropriate,' 'aggressive') that cannot be reliably measured.",
  },
  {
    id: "fp9",
    tag: "C-3: Measure occurrence using frequency, rate, duration, latency, and IRT",
    stem: "A BCBA wants to measure how long it takes a student to begin working after the teacher gives an instruction. Which measurement procedure is most appropriate?",
    choices: [
      "Frequency recording",
      "Duration recording",
      "Latency recording",
      "Interval recording",
    ],
    answer: "Latency recording",
    letter: "C",
    explanation:
      "Latency measures the time between the onset of a stimulus (teacher instruction) and the initiation of the response (beginning work). Duration would measure how long the student works once started. Frequency counts total occurrences, and interval recording samples behavior within time blocks.",
  },
  {
    id: "fp10",
    tag: "C-7: Design and interpret data using equal-interval graphs",
    stem: "When graphing data from a changing criterion design, which element is MOST critical for demonstrating experimental control?",
    choices: [
      "Including a trend line through all data points",
      "Showing that behavior changes correspond to each criterion change with phase lines",
      "Using a cumulative record format",
      "Plotting data on a Standard Celeration Chart",
    ],
    answer: "Showing that behavior changes correspond to each criterion change with phase lines",
    letter: "B",
    explanation:
      "In a changing criterion design, experimental control is demonstrated when the behavior systematically changes to meet each new criterion level. Phase lines clearly delineate criterion changes, making visual analysis of correspondence possible. Trend lines, cumulative records, and celeration charts are not specific to this design.",
  },
  // === SECTION D: Experimental Design (11-12) ===
  {
    id: "fp11",
    tag: "D-1: Distinguish between dependent and independent variables",
    stem: "A BCBA implements a token economy (tokens exchanged for iPad time) to increase on-task behavior during reading. In this scenario, the independent variable is:",
    choices: [
      "On-task behavior during reading",
      "The token economy with iPad time as backup reinforcer",
      "The reading instruction",
      "iPad time",
    ],
    answer: "The token economy with iPad time as backup reinforcer",
    letter: "B",
    explanation:
      "The independent variable is what the researcher/practitioner manipulates — in this case, the token economy. On-task behavior is the dependent variable (what is measured). The reading instruction is a contextual variable, and iPad time alone is just the backup reinforcer, not the complete intervention.",
  },
  {
    id: "fp12",
    tag: "D-4: Use a multiple baseline design",
    stem: "A BCBA wants to evaluate the effect of self-monitoring on homework completion across three students but cannot withdraw the intervention once introduced. Which design is MOST appropriate?",
    choices: [
      "ABAB reversal design",
      "Alternating treatments design",
      "Multiple baseline across participants",
      "Changing criterion design",
    ],
    answer: "Multiple baseline across participants",
    letter: "C",
    explanation:
      "Multiple baseline designs are ideal when reversal is not possible or ethical (skills that cannot be unlearned, or when withdrawal would be harmful). Staggering introduction across participants allows demonstration of experimental control without removing the intervention.",
  },
  // === SECTION E: Behavior-Change Procedures (13-16) ===
  {
    id: "fp13",
    tag: "E-4: Use differential reinforcement procedures",
    stem: "A student calls out answers without raising their hand an average of 15 times per class. The BCBA implements a procedure where the student earns a token for every 3-minute interval without calling out, while calling out produces no teacher attention. This procedure is BEST described as:",
    choices: [
      "DRA — differential reinforcement of alternative behavior",
      "DRO — differential reinforcement of other behavior",
      "DRI — differential reinforcement of incompatible behavior",
      "DRL — differential reinforcement of low rates of behavior",
    ],
    answer: "DRO — differential reinforcement of other behavior",
    letter: "B",
    explanation:
      "DRO delivers reinforcement contingent on the absence of the target behavior for a specified interval. The student earns tokens for intervals without calling out — reinforcement is delivered for the non-occurrence of the behavior, not for a specific alternative. DRA requires reinforcing a specific replacement behavior, DRI requires a physically incompatible behavior, and DRL reinforces lower rates of the target behavior itself.",
  },
  {
    id: "fp14",
    tag: "E-6: Use shaping procedures",
    stem: "A BCBA is teaching a nonvocal child to request items. The child currently reaches toward items. The BCBA reinforces reaching, then reaching + any vocalization, then reaching + an approximation of the word. This procedure illustrates:",
    choices: [
      "Stimulus fading",
      "Chaining",
      "Shaping through successive approximations",
      "Prompt delay",
    ],
    answer: "Shaping through successive approximations",
    letter: "C",
    explanation:
      "Shaping involves differentially reinforcing successive approximations toward a terminal behavior. Each step requires a closer approximation of the target (vocal request) before reinforcement is delivered. Stimulus fading changes stimulus features, chaining links discrete responses, and prompt delay is a transfer procedure.",
  },
  {
    id: "fp15",
    tag: "E-10: Use stimulus control transfer procedures",
    stem: "A therapist teaches a child to label 'ball' using a full echoic prompt ('Say ball'), then fades to a partial prompt ('Say b...'), then a time delay with no vocal prompt. This transfer of stimulus control procedure is called:",
    choices: [
      "Stimulus fading",
      "Most-to-least prompt fading",
      "Prompt delay (progressive)",
      "Stimulus shaping",
    ],
    answer: "Most-to-least prompt fading",
    letter: "B",
    explanation:
      "This procedure systematically reduces the level of prompting from most intrusive (full echoic) to least intrusive (time delay/no prompt), which defines most-to-least prompt fading. Stimulus fading changes the physical properties of the discriminative stimulus itself, not the prompt. Progressive prompt delay involves a fixed prompt after a set time interval.",
  },
  {
    id: "fp16",
    tag: "E-2: Use extinction procedures",
    stem: "After implementing extinction for attention-maintained screaming, the behavior initially increases in frequency and intensity for two days before beginning to decrease. A staff member wants to abandon extinction because 'it's making things worse.' The BCBA should:",
    choices: [
      "Agree to discontinue extinction since the behavior increased",
      "Explain that extinction bursts are expected and temporary, and continue the procedure with close monitoring",
      "Add a punishment procedure to suppress the burst",
      "Switch to a different function-based intervention immediately",
    ],
    answer: "Explain that extinction bursts are expected and temporary, and continue the procedure with close monitoring",
    letter: "B",
    explanation:
      "Extinction bursts — temporary increases in the frequency, duration, or intensity of behavior — are a well-documented and expected phenomenon. Abandoning extinction during a burst can inadvertently reinforce more intense behavior. The BCBA should educate staff, provide support, and ensure safety during the burst period.",
  },
  // === SECTION F: Behavior Assessment (17-18) ===
  {
    id: "fp17",
    tag: "F-2: Determine the need for a functional assessment",
    stem: "A 4-year-old child in a preschool program engages in head-banging approximately 20 times per day, resulting in visible bruising. Which type of functional assessment is MOST appropriate as the initial step?",
    choices: [
      "Conduct an analog functional analysis immediately",
      "Begin with indirect assessment (interviews, checklists) and descriptive assessment (direct observation)",
      "Implement a trial-based functional analysis in the classroom",
      "Skip assessment and implement a protective equipment protocol",
    ],
    answer: "Begin with indirect assessment (interviews, checklists) and descriptive assessment (direct observation)",
    letter: "B",
    explanation:
      "Best practice recommends beginning with less intrusive assessment methods (indirect and descriptive) before proceeding to experimental analysis. Given the severity and the child's age, gathering information through interviews and naturalistic observation helps form hypotheses while minimizing risk. A functional analysis may follow if needed, but should not be the first step.",
  },
  {
    id: "fp18",
    tag: "F-8: Identify and distinguish among functional relations",
    stem: "During a functional analysis, a child's self-injury occurs at high rates in the alone condition and near-zero rates in all other conditions. The most likely function of the behavior is:",
    choices: [
      "Attention",
      "Escape from demands",
      "Access to tangibles",
      "Automatic reinforcement",
    ],
    answer: "Automatic reinforcement",
    letter: "D",
    explanation:
      "High rates in the alone condition — where no social contingencies are present — suggest the behavior is maintained by automatic (non-social) reinforcement. The behavior produces its own reinforcing consequence independent of mediation by others. If the behavior were socially maintained, it would be elevated in attention, demand, or tangible conditions.",
  },
  // === SECTION G: Personnel Supervision & Management (19) ===
  {
    id: "fp19",
    tag: "G-1: Use competency-based training for persons who implement behavior-analytic procedures",
    stem: "A BCBA is training a new RBT to implement discrete trial teaching. Which training method provides the STRONGEST evidence that the RBT can implement the procedure correctly?",
    choices: [
      "The RBT passes a written quiz on DTT procedures with 90% accuracy",
      "The RBT watches a video model and verbally describes each step",
      "The RBT demonstrates DTT with a practice learner and meets criterion on a fidelity checklist",
      "The RBT completes an online training module and earns a certificate",
    ],
    answer: "The RBT demonstrates DTT with a practice learner and meets criterion on a fidelity checklist",
    letter: "C",
    explanation:
      "Competency-based training requires demonstration of the skill, not just knowledge about it. Direct observation with a fidelity checklist provides objective evidence that the trainee can perform the procedure correctly. Written tests, video review, and online modules assess knowledge but do not confirm practical competency.",
  },
  // === SECTION H: Implementation, Management, and Supervision (20) ===
  {
    id: "fp20",
    tag: "H-2: Select and use a measurement system to obtain representative data",
    stem: "A BCBA is monitoring treatment integrity across three RBTs implementing a mand training protocol. Treatment integrity data show that RBT A implements at 95%, RBT B at 72%, and RBT C at 88%. What is the MOST appropriate action?",
    choices: [
      "Average the scores and report overall integrity at 85%",
      "Provide additional training and feedback to RBT B, and continue monitoring all three",
      "Remove RBT B from the case and redistribute sessions",
      "Simplify the mand training protocol so all RBTs can achieve higher fidelity",
    ],
    answer: "Provide additional training and feedback to RBT B, and continue monitoring all three",
    letter: "B",
    explanation:
      "Treatment integrity below acceptable levels (typically 80%+) requires targeted retraining rather than removal or protocol simplification. Averaging scores masks individual performance issues. The BCBA should provide specific performance feedback, model correct implementation, and continue monitoring to ensure improvements.",
  },
];

export default function FreeBCBAPracticePage() {
  const SITE_URL =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://behaviorschool.com";

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs
          items={[
            { label: "BCBA Exam Prep", href: "/bcba-exam-prep" },
            { label: "Free Practice Questions" },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-8 md:pt-10 pb-12 sm:pb-16 lg:pb-20 bg-bs-section-even">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full mb-6">
              <Target className="w-4 h-4 mr-2" />
              20 Free Practice Questions
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Free BCBA Practice Exam Questions
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Test your knowledge with 20 expert-written BCBA practice questions
              covering all major domains of the 6th edition task list. Get
              instant feedback with detailed explanations after each question.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <BookOpen className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-900">
                20 Questions
              </span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <Target className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-900">
                6th Edition Task List
              </span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-900">
                Instant Feedback
              </span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <Brain className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-900">
                Detailed Explanations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-bs-section-odd">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PracticeQuiz questions={questions} />
        </div>
      </section>

      {/* Domain Coverage Section */}
      <section className="py-16 lg:py-20 bg-bs-section-even">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Covers All Major Task List Domains
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our practice questions span every critical area of the BCBA 6th
              edition task list so you can identify your strengths and
              weaknesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-emerald-600 transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Ethics & Professional Conduct
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Questions on the Ethics Code, professional responsibilities,
                scope of competence, and navigating ethical dilemmas in applied
                settings.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-emerald-600 transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Measurement & Experimental Design
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Operational definitions, measurement procedures, graphing
                conventions, single-subject designs, and data interpretation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-emerald-600 transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Behavior Change & Assessment
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Reinforcement, punishment, extinction, shaping, stimulus control,
                functional assessment, differential reinforcement, and
                supervision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Are these BCBA practice questions really free?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Yes! All 20 questions with detailed explanations are completely
                free. No credit card or payment required. After finishing, you
                can enter your email to unlock 100+ additional practice
                questions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Are these questions aligned to the 6th edition task list?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Yes. Every question is mapped to specific task list items from
                the BACB 6th Edition Task List, covering ethics, concepts &
                principles, measurement, experimental design, behavior-change
                procedures, assessment, and supervision.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                How difficult are these questions compared to the real exam?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Our questions are written by practicing BCBAs and designed to
                match the complexity and format of the actual BCBA exam.
                They emphasize application and critical thinking, not just rote
                memorization.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Can I retake the practice quiz?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Absolutely! You can retake the quiz as many times as you want.
                We recommend reviewing the explanations carefully before
                retrying to maximize learning.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/bcba-exam-prep"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              View Complete BCBA Exam Prep Guide
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready for the Full Mock Exam?
          </h2>
          <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Take the complete 185-question BCBA mock exam with timed
            simulation, domain scoring, and detailed performance analytics.
          </p>
          <Link
            href="https://study.behaviorschool.com/free-mock-exam/full"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-emerald-600 rounded-xl shadow-xl hover:shadow-2xl hover:bg-emerald-50 transition-all duration-200 transform hover:-translate-y-1"
          >
            Start Full 185-Question Mock Exam
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      {(() => {
        const breadcrumbJsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "BCBA Exam Prep",
              item: `${SITE_URL}/bcba-exam-prep`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Free BCBA Practice Questions",
              item: `${SITE_URL}/free-bcba-practice`,
            },
          ],
        } as const;
        const faqJsonLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Are these BCBA practice questions really free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! All 20 questions with detailed explanations are completely free. No credit card or payment required.",
              },
            },
            {
              "@type": "Question",
              name: "Are these questions aligned to the 6th edition task list?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Every question is mapped to specific task list items from the BACB 6th Edition Task List.",
              },
            },
            {
              "@type": "Question",
              name: "How difficult are these questions compared to the real exam?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our questions are written by practicing BCBAs and designed to match the complexity and format of the actual BCBA exam.",
              },
            },
          ],
        } as const;
        return (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbJsonLd),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
          </>
        );
      })()}
    </div>
  );
}
