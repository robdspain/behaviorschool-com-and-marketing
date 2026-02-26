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
  Zap,
  Mic,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ShimmerButton from "@/components/magicui/shimmer-button";

// 1. Define CalABA-specific demo steps
const DEMO_STEPS = [
  {
    id: 1,
    title: "ACT-Informed Functional Assessment",
    icon: Brain,
    color: "emerald",
    description: "Go beyond topography. Identify internal drivers—cognitive fusion, psychological inflexibility, and thought-driven behavior—that traditional FBAs miss.",
    demo: {
      input: `Student Profile:
• 9th grade, repeated office referrals for classroom disruption
• Traditional FBA: function = attention
• Behavior occurs during unstructured peer work
• Student reports: "I say stuff before I think"
• Precursor FA data: elevated heart rate + self-criticism before outbursts`,
      output: `ACT Behavioral Assessment Summary:

🧠 Primary Function: Cognitive Fusion (thought-action fusion)
External trigger: Unstructured social demands
Internal trigger: Self-critical automatic thoughts → fused response

📊 Psychological Flexibility Profile:
• Present-moment awareness: Low (reactive, not observing)
• Defusion: Low (thoughts = facts, acts on them immediately)  
• Values clarity: Moderate (wants peer connection but avoids vulnerability)
• Committed action: Impaired (behavior inconsistent with stated values)

✅ Assessment Recommendations:
• Latency-based FA: measure time from trigger to disruption
• Thought diary: track automatic thoughts before incidents
• Values clarification interview
• Precursor behavior monitoring (heart rate, self-talk patterns)`
    },
    features: [
      "Latency-based functional analysis",
      "Identifies cognitive fusion patterns",
      "Precursor behavior mapping",
      "Values clarification protocol"
    ]
  },
  {
    id: 2,
    title: "ACT-Informed BIP Generator",
    icon: FileText,
    color: "amber",
    description: "Generate a BIP that targets psychological inflexibility, not just surface behavior. Values-based programming that actually generalizes.",
    demo: {
      input: `Assessment Summary:
• Function: Cognitive fusion + escape from social vulnerability
• Trigger: Unstructured peer work, performance pressure
• Defusion deficit: Low — fuses with self-critical thoughts
• Values: Wants real peer connection, fears rejection
• Strengths: Self-aware, willing to try, good humor`,
      output: `ACT-Informed BIP:

🎯 Intervention Target: Psychological Inflexibility
Behavior: Classroom disruption as cognitive fusion response

📋 Antecedent Strategies (ACT-based):
• Pre-task values check-in: "What matters to you in this class?"
• Structured peer roles to reduce unstructured vulnerability
• Visual "thoughts vs. facts" cue card at desk
• Mindfulness minute before peer work (breathing + noticing)

🧠 Teaching Strategies (ACT hexaflex):
• Defusion skill: "I'm having the thought that..." labeling
• Self-as-context: "Observing self" practice (3x/week)
• Values clarification: weekly 5-min check-in with counselor
• Committed action: daily "one brave thing" goal setting

✅ Consequence/Response Strategies:
• Co-regulation: calm, values-based reflection after disruption
• Avoid: punishment (increases fusion/avoidance)
• Reinforce: noticing thoughts + choosing values-based behavior
• Data: track thought-action gap (latency from trigger to behavior)`
    },
    features: [
      "Targets the hexaflex, not just topography",
      "Values-based reinforcement strategies",
      "Avoids punishment that worsens fusion",
      "Measurable thought-action gap data"
    ]
  },
  {
    id: 3,
    title: "Implementation & Social Validity",
    icon: CheckCircle,
    color: "sky",
    description: "Track what actually changes—behavior, but also psychological flexibility, quality of life, and student-reported values alignment.",
    demo: {
      input: `4-Week Data Summary:
• Baseline disruptions: 8.2/week average
• Week 1: 7.1 (↓ 13%)
• Week 2: 5.4 (↓ 34%)  
• Week 3: 3.8 (↓ 54%)
• Week 4: 2.1 (↓ 74%)

Student self-report: "I notice my thoughts more now"
Teacher report: "Qualitatively different—he's thinking before acting"
Social validity rating: 4.6/5.0 (student), 4.8/5.0 (teacher)`,
      output: `Outcome Analysis: Clinically Significant Change

📈 Behavioral Outcomes:
• 74% reduction in target behavior (4 weeks)
• Rate: 8.2 → 2.1 disruptions/week
• Trend: Decelerating, on track for mastery

🧠 Psychological Flexibility Gains:
• Defusion score: 3/10 → 7/10 (self-report)  
• Thought-action gap (latency): 0.3s → 4.2s average
• Values alignment score: 2/10 → 6/10

❤️ Social Validity (Kaufman Brief Social Validity Scale):
• Student acceptability: 4.6/5.0 ✅ High
• Teacher acceptability: 4.8/5.0 ✅ High
• "The intervention felt meaningful, not punitive"

📋 Recommended Next Steps:
• Fade structured supports (weeks 5-8)
• Generalization plan: 2 additional settings
• Annual IEP goal: update to values-based outcomes language
• Share with parents: social validity summary letter`
    },
    features: [
      "Tracks psychological flexibility gains",
      "Social validity measurement built-in",
      "Automated progress reports",
      "IEP goal update suggestions"
    ]
  }
];

const colorVariants = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-500 to-emerald-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-500 to-amber-600' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-700', gradient: 'from-sky-500 to-sky-600' },
};

// 2. Main Page Component
export default function CalABA2026DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  const step = DEMO_STEPS[currentStep];
  const Icon = step.icon;
  const colors = colorVariants[step.color as keyof typeof colorVariants];

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
  
  const scrollToDemo = () => {
    document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 3. Hero Section */}
      <div className="bg-slate-900 text-white pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-emerald-500/30">
            <Mic className="w-4 h-4" />
            CALABA 2026 · March 7, Sacramento
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 leading-tight">
            See the <span className="text-emerald-400">ACT-FBA-BIP</span> System in Action
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            The ACT-informed assessment and intervention tools used in our symposium—try them now, no login required.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={scrollToDemo}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white h-12 px-8 text-base font-bold"
            >
              Try the Demo
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base font-bold border-slate-600 hover:bg-slate-800 hover:text-white"
            >
              <a href="https://robspain.com/calaba-2026/" target="_blank" rel="noopener noreferrer">View Symposium Details</a>
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Interactive Demo Section */}
      <div id="interactive-demo" className="max-w-6xl mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                {step.title}
              </h2>
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
                <div className="bg-slate-50 rounded-xl p-4 font-mono text-sm text-slate-700 whitespace-pre-wrap min-h-[300px]">
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
                <div className={`bg-slate-50 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap min-h-[300px] transition-all duration-500 ${
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
            <div className="bg-slate-100 rounded-2xl p-6 mb-10">
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
             <div /> // Placeholder for final CTA button
          )}
        </div>
      </div>

      {/* 5. CTA Section */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to use these tools with your students?</h2>
          <p className="text-lg text-emerald-200 mb-8">
            BehaviorSchool Pro includes ACT assessment, FBA-to-BIP generation, supervision tracking, and more—built for school-based BCBAs.
          </p>
          <div className="bg-slate-900/50 border-2 border-dashed border-emerald-400/50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <p className="text-sm text-slate-400 mb-2">Use code at checkout:</p>
            <div className="text-4xl font-mono font-bold text-emerald-300 tracking-widest">
              CALABA26
            </div>
             <p className="text-xs text-slate-400 mt-2">40% off your first year · 200 uses · Expires April 30, 2026</p>
          </div>
          <a href="https://plan.behaviorschool.com/signup?promo=calaba2026" target="_blank" rel="noopener noreferrer">
              <ShimmerButton
                className="h-14 px-10 text-lg font-bold rounded-xl"
                background="linear-gradient(135deg, #34D399 0%, #10B981 100%)"
                shimmerColor="#A7F3D0"
              >
                <span className="text-emerald-900">Start Free Trial with CALABA26</span>
                <ArrowRight className="ml-2 h-5 w-5 text-emerald-900" />
              </ShimmerButton>
            </a>
           <div className="mt-6">
             <a 
              href="https://plan.behaviorschool.com" 
              target="_blank" rel="noopener noreferrer"
              className="text-sm text-emerald-300 hover:text-white"
             >
                See all features →
             </a>
           </div>
        </div>
      </div>
      
      {/* 6. Footer */}
       <div className="bg-slate-900 border-t border-slate-700 py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              FERPA Compliant
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              No credit card required for trial
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Cancel anytime
            </div>
             <div className="flex items-center gap-2">
               <Home className="w-4 h-4 text-emerald-500" />
              <a href="https://robspain.com/calaba-2026/" className="hover:text-white">Symposium Resources</a>
            </div>
          </div>
        </div>
    </div>
  );
}
