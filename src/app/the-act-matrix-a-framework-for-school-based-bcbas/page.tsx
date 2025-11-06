import { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Users,
  BookOpen,
  ArrowRight,
  Heart,
  Brain,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Download,
  TrendingUp,
  Compass,
  Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "The ACT Matrix: A Framework for School-Based BCBAs | Complete Implementation Guide",
  description: "Complete guide to implementing the ACT Matrix framework in school-based BCBA practice. Learn values-based intervention strategies, see real examples, and access free resources for psychological flexibility in schools.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    "act matrix framework",
    "school based bcba",
    "act matrix bcba",
    "acceptance commitment therapy schools",
    "school bcba framework",
    "act matrix behavior analyst",
    "psychological flexibility schools",
    "values based behavior support"
  ],
  openGraph: {
    title: "The ACT Matrix: A Framework for School-Based BCBAs",
    description: "Comprehensive guide to using the ACT Matrix framework in school-based BCBA practice with implementation strategies and real examples.",
    type: "article",
    url: "https://behaviorschool.com/the-act-matrix-a-framework-for-school-based-bcbas",
    siteName: "Behavior School",
    locale: "en_US",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School",
      },
    ],
  },
  alternates: {
    canonical: "https://behaviorschool.com/the-act-matrix-a-framework-for-school-based-bcbas"
  }
};

export default function ACTMatrixFrameworkPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <section className="container mx-auto px-6 pt-24 pb-4">
        <nav className="flex items-center text-sm text-slate-600" aria-label="Breadcrumb">
          <Link className="hover:text-emerald-600 transition-colors" href="/blog">
            Blog
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-900 font-medium">ACT Matrix Framework</span>
        </nav>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full mb-6">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-semibold text-emerald-700">School-Based Practice Framework</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            The ACT Matrix: A Framework for School-Based BCBAs
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mb-8">
            How the Acceptance and Commitment Therapy Matrix transforms behavior analysis practice in educational settings by building psychological flexibility and values-based decision making in students.
          </p>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Published August 15, 2024</span>
            <span>•</span>
            <span>Updated January 5, 2025</span>
            <span>•</span>
            <span>12 min read</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/* Main Content Area */}
          <article className="lg:col-span-2 space-y-8">

            {/* Introduction */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                As a school-based BCBA, you've likely encountered students whose behavior challenges seem to resist traditional interventions. You implement function-based interventions, modify antecedents, and adjust consequences, yet some students continue to struggle with motivation, emotional regulation, and behavioral flexibility.
              </p>

              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border-l-4 border-emerald-500">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-emerald-900 mb-2">Key Takeaway</h3>
                    <p className="text-emerald-800 text-sm leading-relaxed">
                      The ACT Matrix provides school-based BCBAs with a values-centered framework that complements traditional behavior analysis by building intrinsic motivation and emotional resilience in students. It helps students make choices based on what truly matters to them, not just external contingencies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What is the ACT Matrix */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Compass className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">What is the ACT Matrix Framework?</h2>
                  <p className="text-sm text-slate-600">Understanding the four quadrants and center</p>
                </div>
              </div>

              <p className="text-slate-700 mb-6 leading-relaxed">
                The ACT Matrix is a visual tool from Acceptance and Commitment Therapy (ACT) that organizes human experience into four quadrants, all centered around personal values. For school-based BCBAs, it serves as a comprehensive framework for understanding and intervening with complex behavioral presentations.
              </p>

              {/* Visual ACT Matrix */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-2xl p-8 my-8 shadow-xl">
                <div className="relative">
                  <div className="grid grid-cols-2 gap-0 text-center relative">
                    {/* Center circle - positioned absolutely */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="bg-gradient-to-br from-amber-100 to-yellow-100 border-4 border-amber-400 rounded-full w-32 h-32 flex items-center justify-center shadow-lg">
                        <div>
                          <Heart className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                          <div className="text-amber-900 font-bold text-sm">Student Values</div>
                        </div>
                      </div>
                    </div>

                    {/* Quadrant Lines */}
                    <div className="absolute inset-x-0 top-1/2 border-t-2 border-slate-400 transform -translate-y-1/2"></div>
                    <div className="absolute inset-y-0 left-1/2 border-l-2 border-slate-400 transform -translate-x-1/2"></div>

                    {/* Top Left - Away Moves */}
                    <div className="p-8 pb-16">
                      <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                        <div className="flex items-center gap-2 justify-center mb-3">
                          <ArrowRight className="w-5 h-5 text-red-600 transform rotate-180" />
                          <h4 className="text-lg font-bold text-red-700">Away Moves</h4>
                        </div>
                        <div className="text-sm text-red-800 space-y-1">
                          <p>• Avoiding difficult tasks</p>
                          <p>• Acting out behaviors</p>
                          <p>• Escaping social situations</p>
                          <p>• Shutting down emotionally</p>
                        </div>
                      </div>
                    </div>

                    {/* Top Right - Toward Moves */}
                    <div className="p-8 pb-16">
                      <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                        <div className="flex items-center gap-2 justify-center mb-3">
                          <ArrowRight className="w-5 h-5 text-emerald-600" />
                          <h4 className="text-lg font-bold text-emerald-700">Toward Moves</h4>
                        </div>
                        <div className="text-sm text-emerald-800 space-y-1">
                          <p>• Asking for help</p>
                          <p>• Trying new challenges</p>
                          <p>• Being kind to peers</p>
                          <p>• Practicing resilience</p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Left - Unhelpful Internal */}
                    <div className="p-8 pt-16">
                      <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                        <h4 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2 justify-center">
                          <Brain className="w-5 h-5" />
                          Unhelpful Internal
                        </h4>
                        <div className="text-sm text-red-800 space-y-1">
                          <p>• "I can't do this"</p>
                          <p>• Feeling anxious</p>
                          <p>• Fear of failure</p>
                          <p>• Self-doubt thoughts</p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Right - Helpful Internal */}
                    <div className="p-8 pt-16">
                      <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                        <h4 className="text-lg font-bold text-emerald-700 mb-3 flex items-center gap-2 justify-center">
                          <Sparkles className="w-5 h-5" />
                          Helpful Internal
                        </h4>
                        <div className="text-sm text-emerald-800 space-y-1">
                          <p>• "I can learn from mistakes"</p>
                          <p>• Feeling motivated</p>
                          <p>• Curiosity about learning</p>
                          <p>• Growth mindset</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                This framework recognizes that all behavior occurs in a context of internal experiences (thoughts, feelings, sensations) and that sustainable behavior change happens when students connect with their deeper values and purposes. The ACT Matrix helps students notice their internal experiences without being controlled by them.
              </p>
            </div>

            {/* Why School-Based BCBAs Need This */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Why School-Based BCBAs Need the ACT Matrix</h2>
                  <p className="text-sm text-slate-600">Bridging traditional BA with values-based intervention</p>
                </div>
              </div>

              <p className="text-slate-700 mb-6 leading-relaxed">
                Traditional behavior analytic interventions excel at addressing function-based behaviors through environmental modifications and contingency management. However, school-based BCBAs often encounter situations where external reinforcement alone is insufficient for lasting change.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center">
                      <span className="text-red-700 font-bold">!</span>
                    </div>
                    <h3 className="font-bold text-red-900">Traditional Challenges</h3>
                  </div>
                  <ul className="text-sm text-red-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Students comply but lack intrinsic motivation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Behaviors return when external supports removed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Emotional regulation difficulties persist</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Students struggle with novel situations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Limited generalization across settings</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    </div>
                    <h3 className="font-bold text-emerald-900">ACT Matrix Solutions</h3>
                  </div>
                  <ul className="text-sm text-emerald-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Builds psychological flexibility and resilience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Develops values-based decision making</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Improves emotional acceptance and regulation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Enhances self-directed behavior change</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Promotes generalization through values connection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Implementation Steps */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Implementing the ACT Matrix in Your Practice</h2>
                  <p className="text-sm text-slate-600">4-step integration approach</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="relative pl-12 border-l-4 border-emerald-500 pb-6">
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">1</span>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Values Assessment and Exploration</h3>
                    <p className="text-slate-700 text-sm mb-4 leading-relaxed">
                      Begin by helping the student identify what truly matters to them. Use age-appropriate language and activities to explore values across domains like relationships, learning, personal growth, and contribution to others.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-emerald-200">
                      <p className="text-sm font-semibold text-slate-900 mb-2">BCBA Implementation Tip:</p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        For younger students (K-5), use concrete examples: "What kind of friend do you want to be?" For older students (6-12), explore abstract concepts like integrity, growth, and purpose. Create visual representations of values using drawings or collages.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-12 border-l-4 border-blue-500 pb-6">
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">2</span>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Behavioral Analysis Through the Matrix</h3>
                    <p className="text-slate-700 text-sm mb-4 leading-relaxed">
                      Map current behaviors into "toward moves" (behaviors that move the student toward their values) and "away moves" (behaviors that move them away from their values). This reframes problem behaviors as ineffective attempts to cope rather than just "bad" behaviors.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm font-semibold text-slate-900 mb-2">Example:</p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Student values "being a good friend." <strong>Toward moves:</strong> sharing, helping classmates, listening. <strong>Away moves:</strong> pushing others when frustrated, refusing to participate in group work, isolating during lunch.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-12 border-l-4 border-purple-500 pb-6">
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">3</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Internal Experience Mapping</h3>
                    <p className="text-slate-700 text-sm mb-4 leading-relaxed">
                      Help students identify the thoughts, feelings, and physical sensations that show up when they engage in toward or away moves. Normalize all internal experiences while focusing on behavioral choice. The goal is awareness, not suppression.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <p className="text-sm font-semibold text-slate-900 mb-2">ACT Language:</p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        "When anxiety shows up (unhelpful internal), you can notice it's there AND still make a toward move (asking for help). The anxiety doesn't have to control your choice." This builds defusion and acceptance skills.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-12 border-l-4 border-emerald-500">
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">4</span>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Integration with Traditional BA Interventions</h3>
                    <p className="text-slate-700 text-sm mb-4 leading-relaxed">
                      Use the ACT Matrix to inform your traditional behavior analytic interventions. Design reinforcement systems that support values-based behaviors and help students understand how environmental supports can facilitate toward moves.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-emerald-200">
                      <p className="text-sm font-semibold text-slate-900 mb-2">Integration Example:</p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Rather than "earn points for compliance," frame it as "earn recognition for toward moves that match your values." The external reinforcement supports the internal motivation rather than replacing it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Examples */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Real-World Case Examples</h2>
                  <p className="text-sm text-slate-600">How the ACT Matrix transforms student outcomes</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Case 1: Middle School Student with Task Avoidance</h3>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h4 className="font-bold text-red-900 mb-2 text-sm">Traditional Approach Only:</h4>
                      <p className="text-sm text-slate-700 mb-3">
                        Implemented escape extinction and positive reinforcement for task completion. Token economy with preferred activities as backup reinforcers.
                      </p>
                      <p className="text-sm font-semibold text-red-700">
                        Result: Compliance during intervention but return to avoidance when supports removed or with novel tasks.
                      </p>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <h4 className="font-bold text-emerald-900 mb-2 text-sm">ACT Matrix Integration:</h4>
                      <p className="text-sm text-slate-700 mb-3">
                        Discovered student valued "being smart and helpful to others." Connected task engagement to growth ("toward becoming the person you want to be").
                      </p>
                      <p className="text-sm font-semibold text-emerald-700">
                        Result: Student began viewing challenging tasks as opportunities to grow competence and eventually help classmates.
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-500">
                    <p className="text-sm text-emerald-900">
                      <strong>Key Learning:</strong> By connecting task engagement to the student's values of learning and helping others, intrinsic motivation increased and behavior generalized across settings without external reinforcement.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Case 2: High School Student with Social Anxiety</h3>

                  <p className="text-slate-700 mb-4 text-sm leading-relaxed">
                    Student valued friendship and belonging but engaged in social avoidance due to anxiety. Traditional exposure therapy was meeting with resistance. The ACT Matrix helped differentiate between helpful anxiety (alerting to social cues) and unhelpful anxiety (leading to avoidance).
                  </p>

                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-blue-900 mb-2">
                      <strong>Intervention Integration:</strong>
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Combined systematic desensitization with values-based exposure. Student practiced "brave moves toward friendship" rather than just "exposure trials." Anxiety was reframed as something that shows up when we care about something (values connection), not as something to eliminate before taking action.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources & Next Steps */}
            <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-3">Transform Your School-Based Practice</h2>
                <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                  The ACT Matrix framework represents a powerful evolution in school-based behavior analysis, combining the precision of behavior science with the depth of values-based intervention.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link href="/act-matrix">
                  <button className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Free ACT Matrix Guide
                  </button>
                </Link>

                <Link href="/transformation-program">
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    Get Complete BCBA Training
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>

              <p className="text-center text-sm text-emerald-100">
                Join 1,000+ school-based BCBAs already using these evidence-based approaches
              </p>
            </div>

            {/* Related Resources */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Complete ACT Matrix Resource Collection</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-3">ACT Implementation Hub</h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Central resource hub with implementation guides, research, and practical tools for schools.
                  </p>
                  <Link href="/act-matrix-schools-hub" className="text-emerald-700 font-semibold text-sm hover:underline flex items-center gap-2">
                    Visit Hub <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-3">K-12 ACT Activities</h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Classroom-ready ACT activities organized by grade level with implementation guides.
                  </p>
                  <Link href="/act-activities-k12-students" className="text-blue-700 font-semibold text-sm hover:underline flex items-center gap-2">
                    View Activities <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-3">Age-Appropriate ACT Metaphors</h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Developmental guide to using ACT metaphors effectively with children and adolescents.
                  </p>
                  <Link href="/age-appropriate-act-metaphors" className="text-purple-700 font-semibold text-sm hover:underline flex items-center gap-2">
                    Explore Metaphors <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-3">Implementation Challenges & Solutions</h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Evidence-based solutions to common ACT implementation challenges in school settings.
                  </p>
                  <Link href="/act-implementation-challenges-solutions" className="text-emerald-700 font-semibold text-sm hover:underline flex items-center gap-2">
                    Find Solutions <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Quick Links */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  Related School BCBA Resources
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/iep-goals">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">Values-Based IEP Goals</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/supervisors">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">School BCBA Supervision</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/school-based-behavior-support">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">Behavior Support Systems</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/school-bcba">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">School BCBA Hub</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Key Takeaways */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  Key Implementation Points
                </h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Start with values exploration (age-appropriate)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Map behaviors as "toward" vs "away" moves</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Normalize all internal experiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Integrate with traditional BA interventions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Focus on choice, not emotion control</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-xl mb-3">Master ACT-Informed Practice</h3>
                <p className="text-emerald-100 text-sm mb-4 leading-relaxed">
                  Learn to integrate ACT principles with behavior analysis in our School BCBA Transformation System.
                </p>
                <Link href="/transformation-program">
                  <button className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    Join Program
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "The ACT Matrix: A Framework for School-Based BCBAs",
            "description": "Comprehensive guide to implementing the ACT Matrix framework in school-based behavior analysis practice with real-world examples and practical strategies.",
            "author": {
              "@type": "Person",
              "name": "Rob Spain",
              "jobTitle": "Board Certified Behavior Analyst (BCBA)"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Behavior School"
            },
            "datePublished": "2024-08-15",
            "dateModified": "2025-01-05"
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the ACT Matrix framework for school-based BCBAs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The ACT Matrix is a visual framework from Acceptance and Commitment Therapy that helps school-based BCBAs guide students in making values-based behavioral choices. It organizes experiences into four quadrants: toward moves, away moves, helpful internal experiences, and unhelpful internal experiences, all centered around student values."
                }
              },
              {
                "@type": "Question",
                "name": "How do school-based BCBAs implement the ACT Matrix?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Implementation follows 4 steps: 1) Values assessment and exploration with age-appropriate activities, 2) Mapping behaviors as toward or away moves, 3) Helping students identify internal experiences without being controlled by them, 4) Integrating the framework with traditional behavior analytic interventions like reinforcement systems."
                }
              },
              {
                "@type": "Question",
                "name": "What makes the ACT Matrix different from traditional BCBA interventions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Unlike traditional behavior interventions that focus primarily on consequence-based strategies, the ACT Matrix framework emphasizes building psychological flexibility and intrinsic motivation. It helps students make choices based on personal values rather than just avoiding consequences or seeking rewards, leading to better generalization and maintenance."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}
