"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  FileText, 
  Target, 
  BookOpen, 
  Brain,
  Play,
  Shield,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ShimmerButton from "@/components/magicui/shimmer-button";

const DEMO_STEPS = [
  {
    id: 1,
    title: "FBA-to-BIP Generator",
    icon: FileText,
    color: "emerald",
    description: "Transform your Functional Behavior Assessment into a comprehensive Behavior Intervention Plan in minutes.",
    demo: {
      input: "Sample FBA Summary:\n• Student displays off-task behavior during independent work\n• Function: Escape from difficult tasks\n• Triggers: Math worksheets, reading comprehension",
      output: "Generated BIP Preview:\n\n📋 Target Behavior: Off-task behavior during independent work\n\n🎯 Function: Escape from non-preferred academic tasks\n\n✅ Antecedent Interventions:\n• Provide choice of task order\n• Break tasks into smaller chunks\n• Use visual task completion checklist\n\n✅ Teaching Strategies:\n• Teach appropriate break request\n• Self-monitoring training\n• Coping skills instruction\n\n✅ Consequence Strategies:\n• Provide brief break after work completion\n• Positive reinforcement for on-task behavior\n• Planned ignoring for minor off-task"
    },
    features: [
      "Upload or paste FBA data",
      "AI generates complete BIP in under 2 minutes",
      "Aligned to district compliance standards",
      "Export to PDF or Word"
    ]
  },
  {
    id: 2,
    title: "IEP Goal Generator",
    icon: Target,
    color: "amber",
    description: "Generate measurable, SMART IEP goals from a brief student description. Goals are aligned to state standards.",
    demo: {
      input: "Student Profile:\n• 4th grade student\n• Struggles with task initiation\n• Needs support with emotional regulation",
      output: "Generated IEP Goals:\n\n🎯 Goal 1 - Task Initiation:\nGiven a verbal prompt and visual schedule, [Student] will independently begin assigned tasks within 2 minutes of instruction in 4 out of 5 opportunities across 3 consecutive data collection days, as measured by teacher observation and data collection.\n\n🎯 Goal 2 - Emotional Regulation:\nWhen experiencing frustration, [Student] will use a taught coping strategy (deep breathing, taking a break, or asking for help) in 80% of observed opportunities across 4 weeks, as measured by behavior tracking data."
    },
    features: [
      "Behavior, academic, social-emotional domains",
      "Customizable by grade level",
      "Includes baselines & criteria",
      "Copy directly into your IEP system"
    ]
  },
  {
    id: 3,
    title: "IEP Goal Bank",
    icon: BookOpen,
    color: "blue",
    description: "Search and filter 1,000+ pre-written, expert-reviewed IEP goals. Every goal is measurable, specific, and classroom-ready.",
    demo: {
      input: "Search: \"self-regulation elementary\"",
      output: "Search Results (showing 3 of 47):\n\n📚 Goal: Emotional Identification\nGiven visual supports, student will identify their emotional state using a feelings chart in 8/10 opportunities...\n\n📚 Goal: Self-Calming Strategies\nWhen feeling overwhelmed, student will independently select and use a calming strategy from their personal toolkit...\n\n📚 Goal: Transitions\nStudent will transition between activities within 3 minutes with no more than 1 verbal prompt..."
    },
    features: [
      "Filter by domain, grade, and need area",
      "Goals written by practicing BCBAs",
      "Regular updates with new goals",
      "Save favorites to your account"
    ]
  },
  {
    id: 4,
    title: "ACT Module",
    icon: Brain,
    color: "purple",
    description: "Acceptance & Commitment Training tools designed specifically for school-based behavioral support.",
    demo: {
      input: "Student Values Exploration:\n\"I want to be a good friend\"\n\"I want to do well in school\"",
      output: "ACT Matrix Output:\n\n⬆️ Toward Moves (aligned with values):\n• Asking classmates to play\n• Raising hand in class\n• Completing homework\n\n⬇️ Away Moves (avoiding discomfort):\n• Staying alone at recess\n• Not participating in discussions\n• Avoiding challenging work\n\n💭 Difficult Thoughts/Feelings:\n• \"They won't like me\"\n• \"I might get it wrong\"\n\n🎯 Committed Action:\nPractice one toward move this week"
    },
    features: [
      "ACT Matrix worksheets",
      "Values identification exercises",
      "Defusion & mindfulness activities",
      "Progress tracking tools"
    ]
  }
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  const step = DEMO_STEPS[currentStep];
  const Icon = step.icon;
  
  const colorClasses = {
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-300",
      gradient: "from-emerald-500 to-teal-500"
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-300",
      gradient: "from-amber-500 to-yellow-500"
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-300",
      gradient: "from-blue-500 to-indigo-500"
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-300",
      gradient: "from-purple-500 to-pink-500"
    }
  };
  
  const colors = colorClasses[step.color as keyof typeof colorClasses];

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowOutput(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowOutput(false);
    }
  };

  const handleGenerate = () => {
    setShowOutput(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-slate-600 hover:text-slate-900 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Step {currentStep + 1} of {DEMO_STEPS.length}</span>
              <div className="flex gap-1">
                {DEMO_STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentStep ? 'bg-emerald-600' : i < currentStep ? 'bg-emerald-300' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <Link href="https://plan.behaviorschool.com/register" className="text-emerald-700 hover:text-emerald-800 font-medium text-sm">
              Skip to Trial →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step Header */}
            <div className="text-center mb-10">
              <motion.div 
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${colors.bg} mb-4`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Icon className={`w-8 h-8 ${colors.text}`} />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                {step.title}
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {step.description}
              </p>
            </div>

            {/* Demo Area */}
            <div className="grid lg:grid-cols-2 gap-6 mb-10">
              {/* Input Panel */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient}`} />
                  <span className="font-semibold text-slate-900">Input</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 font-mono text-sm text-slate-700 whitespace-pre-wrap min-h-[200px]">
                  {step.demo.input}
                </div>
                
                {!showOutput && (
                  <motion.div className="mt-4">
                    <Button 
                      onClick={handleGenerate}
                      className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Generate with AI
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Output Panel */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient}`} />
                  <span className="font-semibold text-slate-900">AI Output</span>
                  {showOutput && (
                    <span className="ml-auto text-xs text-emerald-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Generated in 1.2s
                    </span>
                  )}
                </div>
                <div className={`bg-slate-50 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap min-h-[200px] transition-all duration-500 ${
                  showOutput ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  {showOutput ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.demo.output}
                    </motion.div>
                  ) : (
                    "Click 'Generate with AI' to see the output..."
                  )}
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-10">
              <h3 className="font-semibold text-slate-900 mb-4">Key Features:</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {step.features.map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                    <span className="text-slate-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep < DEMO_STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              Next Tool
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Link href="https://plan.behaviorschool.com/register">
              <ShimmerButton
                className="h-12 px-8 text-lg font-bold rounded-xl"
                background="linear-gradient(135deg, #E3B23C 0%, #d4a12d 100%)"
                shimmerColor="#ffffff"
              >
                <span className="text-emerald-900">Start Your Free Trial</span>
                <ArrowRight className="ml-2 h-5 w-5 text-emerald-900" />
              </ShimmerButton>
            </Link>
          )}
        </div>

        {/* Trust Footer */}
        <div className="mt-16 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              FERPA Compliant
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
