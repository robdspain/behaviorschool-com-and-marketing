import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { CheckCircle2, Zap, Target, Brain, TrendingUp, Award } from "lucide-react";

export const metadata = {
  title: "BCBA Exam Prep - Pass First Try | Behavior School",
  description: "AI-powered BCBA practice exams with adaptive learning and instant feedback. Join 1,000+ BCBAs who passed using our free platform with 500+ vetted questions.",
  keywords: "BCBA exam prep, BCBA practice exam, BCBA mock exam, behavior analyst certification, free BCBA study tools",
};

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Hero Section with iPad */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-700 pt-12 pb-24">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        
        <ContainerScroll
          titleComponent={(
            <div className="text-center relative z-10">
              <Badge className="bg-white/20 text-white border-white/30 mb-6 text-base px-4 py-2">
                ⚡ AI-Powered BCBA Exam Prep
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                Pass Your BCBA Exam<br />
                <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  First Try, Guaranteed
                </span>
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-emerald-50 max-w-3xl mx-auto font-medium leading-relaxed">
                Adaptive practice tests that learn from you. Smart analytics that show exactly what to study. Join 1,000+ BCBAs who passed using our platform.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6 font-bold shadow-2xl transform hover:scale-105 transition-all">
                  <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                    Start FREE Mock Exam →
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 font-semibold">
                  <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                    Try Mini Practice Test
                  </Link>
                </Button>
              </div>
              
              <p className="mt-6 text-emerald-100 text-sm">
                ✓ No credit card required  •  ✓ Instant access  •  ✓ 500+ vetted questions
              </p>
            </div>
          )}
        >
          <Image
            src="/study-app-preview.png"
            alt="Behavior Study Tools Dashboard - BCBA Exam Prep Platform"
            width={1200}
            height={800}
            className="w-full h-full object-cover rounded-2xl shadow-2xl ring-4 ring-white/20"
            priority
          />
        </ContainerScroll>
      </section>

      {/* Features Banner */}
      <section className="py-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600">FREE</div>
              <div className="text-sm text-slate-600">Always Free</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-200" />
            <div>
              <div className="text-3xl font-bold text-emerald-600">AI-Powered</div>
              <div className="text-sm text-slate-600">Adaptive Learning</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-200" />
            <div>
              <div className="text-3xl font-bold text-emerald-600">500+</div>
              <div className="text-sm text-slate-600">Practice Questions</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-200" />
            <div>
              <div className="text-3xl font-bold text-emerald-600">Instant</div>
              <div className="text-sm text-slate-600">Feedback</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Works - 3 Columns */}
      <section className="py-20 bg-gradient-to-br from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Why BCBAs Choose Our Platform
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Traditional study guides waste your time on what you already know. We're different.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-2xl bg-gradient-to-br from-emerald-50 to-white">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Adapts to YOU</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  AI analyzes your weak spots and serves up exactly what you need to study next. No wasted time on content you've mastered.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-2xl bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Pinpoint Gaps</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  See exactly which task list items you're struggling with. Get instant feedback that teaches, not just tells you the answer.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-2xl bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Track Progress</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Watch your mastery grow in real-time. Know exactly when you're ready to pass the exam with confidence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features - Big & Bold */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-500 text-white mb-4 text-base px-4 py-2">EVERYTHING YOU NEED</Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Study Smarter, Not Harder
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Full-Length Mock Exams', desc: 'Timed sessions that mirror the real BCBA exam. Get comfortable with the format before test day.' },
              { icon: CheckCircle2, title: 'Mini Practice Tests', desc: 'Quick 10-15 minute sessions perfect for studying on your lunch break or commute.' },
              { icon: Brain, title: 'Adaptive Learning', desc: 'Questions adjust to your skill level. Focus on what you don\'t know, skip what you\'ve mastered.' },
              { icon: Target, title: 'Skill Breakdowns', desc: 'See your mastery by task list item. Know exactly which sections need more work.' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Watch your scores improve over time. Stay motivated with clear progress indicators.' },
              { icon: Award, title: 'Detailed Explanations', desc: 'Every answer includes research-backed rationales and references to help you truly understand.' },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-8 hover:bg-slate-700 transition-all border border-slate-700">
                <feature.icon className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xl px-12 py-7 font-bold shadow-2xl transform hover:scale-105 transition-all">
              <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                Start Practicing FREE →
              </Link>
            </Button>
            <p className="mt-4 text-slate-400">No credit card. No hidden fees. Just results.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Pass Your BCBA Exam?
          </h2>
          <p className="text-2xl text-emerald-50 mb-10 leading-relaxed">
            Join over 1,000 BCBAs who studied smarter and passed faster.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-xl px-12 py-7 font-bold shadow-2xl">
              <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                Take FREE Mock Exam
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-xl px-12 py-7 font-semibold">
              <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                Try Mini Test First
              </Link>
            </Button>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-8 text-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>No Sign-Up Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Start Now</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
