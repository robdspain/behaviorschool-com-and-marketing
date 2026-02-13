"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, ArrowLeft, RotateCcw, FileText, Printer } from "lucide-react";
import Link from "next/link";

type Question = {
  id: string;
  text: string;
  description?: string;
};

type Answer = {
  questionId: string;
  value: boolean;
};

type Recommendation = {
  type: "fba-recommended" | "try-tier2" | "document-more" | "consult-team";
  title: string;
  description: string;
  nextSteps: string[];
  color: string;
  icon: React.ReactNode;
};

const questions: Question[] = [
  {
    id: "documented",
    text: "Has the student's behavior been documented for at least 2 weeks?",
    description: "Systematic data collection with clear operational definitions"
  },
  {
    id: "tier1-tier2",
    text: "Have Tier 1 and Tier 2 interventions been tried?",
    description: "Universal supports and targeted interventions like check-in/check-out, social skills groups, or behavior contracts"
  },
  {
    id: "impeding-learning",
    text: "Is the behavior significantly impeding the student's learning or others' learning?",
    description: "The behavior substantially interferes with educational progress or the learning environment"
  },
  {
    id: "iep-requested",
    text: "Has the IEP team requested a behavior assessment?",
    description: "Formal request from the IEP team for functional behavior assessment"
  },
  {
    id: "safety-concern",
    text: "Is the behavior a safety concern?",
    description: "Behavior poses risk of harm to self or others"
  },
  {
    id: "environmental-mods",
    text: "Have environmental modifications been attempted?",
    description: "Changes to setting, schedule, task demands, or antecedent conditions"
  },
  {
    id: "multiple-settings",
    text: "Is the behavior occurring across multiple settings?",
    description: "Behavior happens in classroom, hallway, cafeteria, playground, etc."
  },
];

function getRecommendation(answers: Answer[]): Recommendation {
  const answerMap = new Map(answers.map(a => [a.questionId, a.value]));
  
  const documented = answerMap.get("documented") ?? false;
  const tier1tier2 = answerMap.get("tier1-tier2") ?? false;
  const impedingLearning = answerMap.get("impeding-learning") ?? false;
  const iepRequested = answerMap.get("iep-requested") ?? false;
  const safetyConcern = answerMap.get("safety-concern") ?? false;
  const environmentalMods = answerMap.get("environmental-mods") ?? false;
  const multipleSettings = answerMap.get("multiple-settings") ?? false;

  // FBA RECOMMENDED (RED): High priority situations
  if (safetyConcern && documented) {
    return {
      type: "fba-recommended",
      title: "FBA Recommended",
      description: "Safety concerns with documented behavior history warrant a comprehensive functional behavior assessment.",
      nextSteps: [
        "Obtain parental consent for FBA",
        "Assemble your FBA team (BCBA, teacher, parent, student if appropriate)",
        "Review existing behavior data and identify patterns",
        "Conduct indirect assessments (interviews with key stakeholders)",
        "Plan and conduct direct observations across settings",
        "Use our AI-powered FBA Generator at /pro to streamline the process"
      ],
      color: "bg-red-50 border-red-200",
      icon: <XCircle className="w-6 h-6 text-red-600" />
    };
  }

  if (iepRequested && documented && impedingLearning) {
    return {
      type: "fba-recommended",
      title: "FBA Recommended",
      description: "IEP team has requested assessment, behavior is documented and impeding learning. An FBA is appropriate.",
      nextSteps: [
        "Obtain parental consent for FBA",
        "Schedule FBA team meeting to plan assessment",
        "Review previous interventions and their outcomes",
        "Identify assessment tools (ABC data, scatterplots, functional analysis if needed)",
        "Conduct systematic observations and data collection",
        "Use our AI-powered FBA Generator at /pro to write professional reports faster"
      ],
      color: "bg-red-50 border-red-200",
      icon: <XCircle className="w-6 h-6 text-red-600" />
    };
  }

  if (documented && tier1tier2 && impedingLearning && multipleSettings) {
    return {
      type: "fba-recommended",
      title: "FBA Recommended",
      description: "Previous interventions have been tried, behavior is well-documented, and occurs across settings. Time for a comprehensive FBA.",
      nextSteps: [
        "Present data to IEP team showing lack of response to interventions",
        "Obtain parental consent for FBA",
        "Plan comprehensive assessment across all relevant settings",
        "Include ecological assessment (curriculum, instruction, environment)",
        "Develop hypothesis statements based on assessment data",
        "Use our FBA Generator to create compliant, professional FBA reports"
      ],
      color: "bg-red-50 border-red-200",
      icon: <XCircle className="w-6 h-6 text-red-600" />
    };
  }

  // CONSULT WITH TEAM (ORANGE): Complex situations needing collaboration
  if (impedingLearning && !tier1tier2) {
    return {
      type: "consult-team",
      title: "Consult with Team",
      description: "Behavior is impeding learning but interventions haven't been systematically tried. Convene your team before proceeding.",
      nextSteps: [
        "Schedule meeting with IEP team or behavior support team",
        "Present current behavior data and concerns",
        "Develop intervention plan with Tier 2 supports",
        "Establish timeline for intervention implementation (4-6 weeks)",
        "Create data collection system to monitor progress",
        "Schedule follow-up meeting to review outcomes and determine next steps"
      ],
      color: "bg-orange-50 border-orange-200",
      icon: <AlertCircle className="w-6 h-6 text-orange-600" />
    };
  }

  if ((iepRequested || multipleSettings) && !documented) {
    return {
      type: "consult-team",
      title: "Consult with Team",
      description: "Team has concerns but data is insufficient. Meet with team to establish data collection plan.",
      nextSteps: [
        "Convene team meeting to discuss concerns",
        "Develop clear operational definition of target behavior",
        "Create data collection plan across all relevant settings",
        "Assign data collectors and establish consistency (IOA checks)",
        "Set 2-4 week timeline for baseline data collection",
        "Schedule follow-up meeting to review data and determine if FBA is needed"
      ],
      color: "bg-orange-50 border-orange-200",
      icon: <AlertCircle className="w-6 h-6 text-orange-600" />
    };
  }

  // TRY TIER 2 FIRST (YELLOW): Lower-level supports appropriate
  if (documented && !tier1tier2 && !safetyConcern) {
    return {
      type: "try-tier2",
      title: "Try Tier 2 Interventions First",
      description: "You have good baseline data. Try targeted interventions before conducting a full FBA.",
      nextSteps: [
        "Review behavior data to identify patterns (times, settings, triggers)",
        "Select evidence-based Tier 2 intervention matched to behavior pattern",
        "Options: Check-In/Check-Out (CICO), social skills group, behavior contract, self-monitoring",
        "Implement intervention with fidelity for 4-6 weeks",
        "Continue data collection to monitor response to intervention",
        "If behavior doesn't improve after 6 weeks, reconvene team to discuss FBA"
      ],
      color: "bg-yellow-50 border-yellow-200",
      icon: <AlertCircle className="w-6 h-6 text-yellow-600" />
    };
  }

  if (!environmentalMods && documented) {
    return {
      type: "try-tier2",
      title: "Try Environmental Modifications First",
      description: "Environmental changes haven't been systematically tried. These simple modifications may reduce the behavior.",
      nextSteps: [
        "Review ABC data to identify common antecedents",
        "Modify environmental triggers: seating, schedule, task difficulty, choice opportunities",
        "Implement antecedent modifications for 2-4 weeks",
        "Continue data collection to assess impact",
        "If modifications don't reduce behavior, consider Tier 2 interventions",
        "Document all modifications and outcomes for future reference"
      ],
      color: "bg-yellow-50 border-yellow-200",
      icon: <AlertCircle className="w-6 h-6 text-yellow-600" />
    };
  }

  // DOCUMENT MORE DATA FIRST (GREEN): Insufficient data to proceed
  if (!documented) {
    return {
      type: "document-more",
      title: "Document More Data First",
      description: "You need more systematic data collection before determining next steps.",
      nextSteps: [
        "Create clear operational definition of the target behavior (observable, measurable)",
        "Select appropriate measurement method: frequency, duration, latency, or intensity",
        "Set up data collection system across all relevant settings and times",
        "Train staff on consistent data collection procedures",
        "Collect baseline data for minimum 2 weeks (preferably 3-4 weeks)",
        "Review data weekly to identify patterns and determine if intervention or FBA is needed"
      ],
      color: "bg-green-50 border-green-200",
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />
    };
  }

  // DEFAULT: More consultation needed
  return {
    type: "consult-team",
    title: "Consult with Team",
    description: "Based on your responses, team consultation is recommended to determine the best next steps.",
    nextSteps: [
      "Schedule meeting with IEP team or behavior support team",
      "Present all available behavior data and documentation",
      "Discuss interventions already attempted and their outcomes",
      "Collaboratively determine whether to: collect more data, implement interventions, or proceed with FBA",
      "Create action plan with clear timeline and responsible parties",
      "Schedule follow-up meeting to review progress"
    ],
    color: "bg-orange-50 border-orange-200",
    icon: <AlertCircle className="w-6 h-6 text-orange-600" />
  };
}

export function FBADecisionMatrix() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: boolean) => {
    const newAnswers = [...answers, { questionId: questions[currentStep].id, value }];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const recommendation = showResults ? getRecommendation(answers) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF3E0] to-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E3A34] mb-4">
            FBA Decision Matrix
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-2">
            Do you need a Functional Behavior Assessment?
          </p>
          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            Answer 7 quick questions to get a professional recommendation on whether to conduct an FBA, 
            try alternative interventions, or collect more data.
          </p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      {!showResults && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Question {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-slate-700">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <motion.div
                className="bg-[#1E3A34] h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Question Display */}
      <AnimatePresence mode="wait">
        {!showResults && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1E3A34] mb-4">
                {questions[currentStep].text}
              </h2>
              {questions[currentStep].description && (
                <p className="text-slate-600 mb-8">
                  {questions[currentStep].description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  No
                </button>
              </div>

              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="mt-6 text-slate-600 hover:text-slate-800 font-medium flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Question
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Results Display */}
        {showResults && recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          >
            {/* Recommendation Card */}
            <div className={`${recommendation.color} border-2 rounded-lg shadow-xl p-8 mb-8 print:break-inside-avoid`}>
              <div className="flex items-start gap-4 mb-6">
                {recommendation.icon}
                <div>
                  <h2 className="text-3xl font-bold text-[#1E3A34] mb-2">
                    {recommendation.title}
                  </h2>
                  <p className="text-lg text-slate-700">
                    {recommendation.description}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-[#1E3A34] mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Next Steps:
                </h3>
                <ol className="space-y-3">
                  {recommendation.nextSteps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#1E3A34] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-slate-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-xl p-8 text-white print:hidden">
              <h3 className="text-2xl font-bold mb-3">
                Ready to write your FBA?
              </h3>
              <p className="text-emerald-50 mb-6">
                Our AI-powered FBA Generator helps you create compliant, professional Functional Behavior Assessments in 
                a fraction of the time. Generate comprehensive reports with hypothesis statements, data analysis, and 
                intervention recommendations.
              </p>
              <Link
                href="/pro"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold py-3 px-6 rounded-lg hover:bg-emerald-50 transition-all transform hover:scale-105"
              >
                Try AI-Powered FBA Generator
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 print:hidden">
              <button
                onClick={handleRestart}
                className="flex-1 bg-[#1E3A34] hover:bg-[#152825] text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Start Over
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Print Results
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:break-before-page">
        <h2 className="text-3xl font-bold text-[#1E3A34] mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "When is a Functional Behavior Assessment (FBA) required?",
              a: "An FBA is typically required when: (1) behavior significantly impedes the student's or others' learning, (2) the behavior is a safety concern, (3) Tier 1 and Tier 2 interventions have been attempted without success, (4) the IEP team requests a behavior assessment, or (5) a manifestation determination review indicates the behavior is related to the disability."
            },
            {
              q: "What should I try before conducting an FBA?",
              a: "Before conducting a full FBA, schools should typically: (1) document the behavior for at least 2 weeks, (2) implement Tier 1 universal supports, (3) try Tier 2 targeted interventions, (4) attempt environmental modifications, (5) consult with the IEP team or behavior support team, and (6) ensure adequate baseline data collection."
            },
            {
              q: "How do I know if I have enough data to conduct an FBA?",
              a: "You should have: (1) at least 2 weeks of documented behavior data, (2) clear operational definitions of the target behavior, (3) information about when and where the behavior occurs, (4) data on what happens before and after the behavior, and (5) documentation of interventions already attempted."
            },
            {
              q: "What is the difference between an FBA and Tier 2 interventions?",
              a: "Tier 2 interventions are targeted, group-based supports (like check-in/check-out, social skills groups, or behavior contracts) that don't require a full functional assessment. An FBA is a comprehensive, individualized assessment process that identifies the function of behavior through systematic data collection and analysis."
            },
            {
              q: "Can this decision matrix replace professional judgment?",
              a: "No. This FBA Decision Matrix is a screening tool to guide your thinking and help organize your decision-making process. It should not replace professional judgment, team collaboration, or legal requirements. Always consult with your IEP team, behavior specialists, and school administrators."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#1E3A34] mb-2">
                {faq.q}
              </h3>
              <p className="text-slate-600">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 1in;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
          .print\\:break-before-page {
            break-before: page;
          }
          nav, footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
