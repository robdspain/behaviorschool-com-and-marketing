import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen, Clock, Target, TrendingUp, AlertCircle, Award, FileText, Calendar, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "BCBA Mock Exam Guide 2025 | How to Use Practice Tests to Pass Your BCBA",
  description: "Complete guide to BCBA mock exams: when to take them, how to analyze results, and study strategies that work. Learn the proven 3-phase approach that helps school BCBAs pass on their first attempt.",
  keywords: [
    "BCBA mock exam guide",
    "how to use BCBA practice tests",
    "BCBA exam preparation strategy",
    "mock exam study plan",
    "BCBA practice test schedule",
    "when to take BCBA mock exam",
    "analyzing BCBA practice results",
    "school BCBA exam prep",
    "BCBA first-time pass strategy"
  ],
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
  openGraph: {
    title: "BCBA Mock Exam Guide | Complete Strategy to Pass Your BCBA Exam",
    description: "Master BCBA mock exams with our complete guide. Learn when to practice, how to analyze results, and study strategies proven to help school BCBAs pass.",
    type: "article",
    url: "https://behaviorschool.com/bcba-mock-exam-guide",
    images: [
      {
        url: "https://behaviorschool.com/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Mock Exam Guide - Behavior School"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Mock Exam Guide | Pass Your BCBA Exam",
    description: "Complete guide to using BCBA mock exams effectively. Proven strategies for school-based BCBAs.",
    images: ["https://behaviorschool.com/optimized/og-image.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/bcba-mock-exam-guide"
  }
};

// Structured data for Guide/HowTo
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Use BCBA Mock Exams to Pass Your Certification Exam",
  "description": "Complete guide to using BCBA mock practice exams effectively, including timing, analysis strategies, and study adjustments based on results.",
  "image": "https://behaviorschool.com/optimized/og-image.webp",
  "totalTime": "P12W",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "tool": [
    {
      "@type": "HowToTool",
      "name": "BCBA Mock Practice Exam (185 questions)"
    },
    {
      "@type": "HowToTool",
      "name": "Study materials for all 9 content domains"
    },
    {
      "@type": "HowToTool",
      "name": "Performance tracking spreadsheet"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Take Baseline Mock Exam (Week 1-2)",
      "text": "Take your first full-length 185-question mock exam under timed conditions (4 hours) to identify baseline strengths and weaknesses across all 9 content domains.",
      "url": "https://behaviorschool.com/bcba-mock-exam-guide#baseline"
    },
    {
      "@type": "HowToStep",
      "name": "Analyze Results by Domain (Week 2-3)",
      "text": "Break down your scores by content domain, identify patterns in incorrect answers, and create a targeted study plan focusing on domains scoring below 70%.",
      "url": "https://behaviorschool.com/bcba-mock-exam-guide#analyze"
    },
    {
      "@type": "HowToStep",
      "name": "Focused Study Phase (Week 3-8)",
      "text": "Study weak domains using spaced repetition, take domain-specific practice quizzes, and track improvement weekly.",
      "url": "https://behaviorschool.com/bcba-mock-exam-guide#study"
    },
    {
      "@type": "HowToStep",
      "name": "Progress Mock Exam (Week 9)",
      "text": "Take second full-length mock exam to measure improvement and identify remaining gaps.",
      "url": "https://behaviorschool.com/bcba-mock-exam-guide#progress"
    },
    {
      "@type": "HowToStep",
      "name": "Final Preparation (Week 10-12)",
      "text": "Take final mock exam 1-2 weeks before test day, review all flagged questions, and maintain readiness with daily mixed practice.",
      "url": "https://behaviorschool.com/bcba-mock-exam-guide#final"
    }
  ]
};

// Article schema
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "BCBA Mock Exam Guide 2025 | How to Use Practice Tests to Pass Your BCBA",
  "description": "Complete guide to BCBA mock exams: when to take them, how to analyze results, and study strategies that work for school-based BCBAs.",
  "author": {
    "@type": "Person",
    "name": "Rob Spain",
    "jobTitle": "Board Certified Behavior Analyst (BCBA)",
    "url": "https://behaviorschool.com/about/rob-spain"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Behavior School",
    "logo": {
      "@type": "ImageObject",
      "url": "https://behaviorschool.com/optimized/Logos/logo-gold-transparent.webp"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-15",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://behaviorschool.com/bcba-mock-exam-guide"
  }
};

// FAQ schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "When should I take my first BCBA mock exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Take your first mock exam 8-12 weeks before your test date, after you've completed initial content review of all 9 domains. This baseline exam identifies your weaknesses early enough to address them thoroughly. Avoid taking it too early (before content review) or too late (less than 6 weeks out)."
      }
    },
    {
      "@type": "Question",
      "name": "How many BCBA mock exams should I take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Take 3-4 full-length mock exams: Baseline (8-12 weeks out), Progress Check (4-6 weeks out), Final Practice (1-2 weeks out), and optional Confidence Builder (3-5 days before). Space them 3-4 weeks apart to allow focused study between attempts."
      }
    },
    {
      "@type": "Question",
      "name": "What is a good score on a BCBA mock exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aim for 75-80%+ on your final mock exam before test day. The BCBA passing scaled score is 400 (roughly 70% correct), but mock exams should be slightly harder to ensure readiness. Domain scores below 70% indicate areas needing additional study."
      }
    },
    {
      "@type": "Question",
      "name": "How do I analyze my BCBA mock exam results?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Break down scores by content domain, identify question types you're missing (scenario-based vs. definition-based), note if errors are from knowledge gaps or misreading questions, and track patterns across multiple exams. Prioritize domains scoring below 70% and question types with consistent errors."
      }
    },
    {
      "@type": "Question",
      "name": "Should I retake the same BCBA mock exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, don't retake identical exams as you'll memorize answers rather than learn concepts. Use different mock exams or randomized question banks each time. If using the same platform, ensure questions are randomized and not repeated."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate are BCBA mock exams compared to the real test?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Quality mock exams with 185 questions, 4-hour format, and BACB task list alignment are highly predictive. Students scoring 75-80% on realistic mocks typically pass the actual exam. Look for exams with detailed explanations, proper domain distribution, and scenario-based questions matching BACB style."
      }
    }
  ]
};

export default function BCBAMockExamGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs
          items={[
            { label: "BCBA Exam Prep", href: "/bcba-exam-prep" },
            { label: "BCBA Mock Exam Guide" }
          ]}
        />
      </div>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
              <Target className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              BCBA Mock Exam Guide 2025
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              The complete strategy for using BCBA practice tests to identify weaknesses, optimize your study plan, and pass on your first attempt.
            </p>
          </div>

          {/* Key Stats */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 mb-12 border border-red-200">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">54%</div>
                <div className="text-sm text-slate-600">2024 First-Time Pass Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">25%</div>
                <div className="text-sm text-slate-600">Retake Pass Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">75-80%</div>
                <div className="text-sm text-slate-600">Target Mock Exam Score</div>
              </div>
            </div>
            <p className="text-center text-slate-600 mt-6 text-sm">
              Source: BACB 2024 Annual Data • With first-time pass rates dropping, strategic mock exam use is critical
            </p>
          </div>

          <hr className="border-slate-200 my-12" />

          {/* Table of Contents */}
          <div className="bg-slate-50 rounded-xl p-6 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              Table of Contents
            </h2>
            <ul className="space-y-2">
              <li><a href="#why-mock-exams" className="text-emerald-600 hover:text-emerald-700 hover:underline">1. Why BCBA Mock Exams Are Essential</a></li>
              <li><a href="#timing" className="text-emerald-600 hover:text-emerald-700 hover:underline">2. When to Take Mock Exams (The 3-Phase Timeline)</a></li>
              <li><a href="#taking" className="text-emerald-600 hover:text-emerald-700 hover:underline">3. How to Take a Mock Exam Properly</a></li>
              <li><a href="#analyzing" className="text-emerald-600 hover:text-emerald-700 hover:underline">4. How to Analyze Your Mock Exam Results</a></li>
              <li><a href="#adjusting" className="text-emerald-600 hover:text-emerald-700 hover:underline">5. Adjusting Your Study Plan Based on Results</a></li>
              <li><a href="#mistakes" className="text-emerald-600 hover:text-emerald-700 hover:underline">6. Common Mock Exam Mistakes to Avoid</a></li>
              <li><a href="#resources" className="text-emerald-600 hover:text-emerald-700 hover:underline">7. Best BCBA Mock Exam Resources</a></li>
              <li><a href="#faq" className="text-emerald-600 hover:text-emerald-700 hover:underline">8. Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Section 1: Why Mock Exams Are Essential */}
          <section id="why-mock-exams" className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              1. Why BCBA Mock Exams Are Essential
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              With the 2024 first-time BCBA pass rate at just 54% and retake rates at 25%, strategic preparation is no longer optional—it's essential. Mock exams are your most powerful diagnostic tool for exam readiness.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  What Mock Exams Reveal
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                    <span>Weak content domains requiring focused study</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                    <span>Time management and pacing issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                    <span>Question interpretation patterns (scenario vs. definition)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                    <span>Stamina for 4-hour testing sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                    <span>Test anxiety triggers and coping strategies</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Risks of Skipping Mock Exams
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <span>Discovering weak domains too late to address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <span>Overconfidence from untested knowledge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <span>Poor time management on test day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <span>Unprepared for BACB question style</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">✗</span>
                    <span>Increased test anxiety from uncertainty</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <p className="text-slate-800 font-semibold mb-2">💡 Expert Insight from Rob Spain, BCBA</p>
              <p className="text-slate-700 italic">
                "In 20 years of preparing school BCBAs for certification, I've found that candidates who take 3+ strategically-timed mock exams pass at nearly 2x the rate of those who skip this step. Mock exams aren't just practice—they're your roadmap to targeted improvement."
              </p>
            </div>
          </section>

          {/* Section 2: When to Take Mock Exams */}
          <section id="timing" className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              2. When to Take Mock Exams (The 3-Phase Timeline)
            </h2>

            <div className="space-y-6">
              {/* Phase 1 */}
              <div className="bg-white border-2 border-emerald-200 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Phase 1: Baseline Mock Exam (8-12 Weeks Before Test)
                    </h3>
                    <p className="text-slate-700 mb-4">
                      <strong>Purpose:</strong> Identify strengths and weaknesses after completing initial content review
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-2">✓ DO</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Complete full 185 questions in 4 hours</li>
                          <li>• Simulate real test conditions (quiet, timed)</li>
                          <li>• Review all 9 content domains first</li>
                          <li>• Track domain-by-domain performance</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">✗ DON'T</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Take before content review is complete</li>
                          <li>• Split across multiple days</li>
                          <li>• Look up answers during the exam</li>
                          <li>• Stress about a low score—it's diagnostic</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Phase 2: Progress Check Mock Exam (4-6 Weeks Before Test)
                    </h3>
                    <p className="text-slate-700 mb-4">
                      <strong>Purpose:</strong> Measure improvement and refine weak areas
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-2">✓ DO</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Use a different mock exam than baseline</li>
                          <li>• Compare domain scores to Phase 1</li>
                          <li>• Identify persistent weak areas</li>
                          <li>• Adjust study plan based on gaps</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">✗ DON'T</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Retake the same exam (memorization risk)</li>
                          <li>• Skip if baseline score was high</li>
                          <li>• Ignore domains that improved slightly</li>
                          <li>• Take too close to final exam (no time to adjust)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Phase 3: Final Mock Exam (1-2 Weeks Before Test)
                    </h3>
                    <p className="text-slate-700 mb-4">
                      <strong>Purpose:</strong> Confirm readiness and build confidence
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-2">✓ DO</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Target 75-80%+ overall score</li>
                          <li>• Score 70%+ in all domains</li>
                          <li>• Practice same time of day as real test</li>
                          <li>• Review only flagged/incorrect questions</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">✗ DON'T</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Take within 3 days of test (causes stress)</li>
                          <li>• Panic if one domain is weak—review it</li>
                          <li>• Cram new content after this exam</li>
                          <li>• Over-analyze every missed question</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: How to Take a Mock Exam Properly */}
          <section id="taking" className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              3. How to Take a Mock Exam Properly
            </h2>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Simulate Real Test Conditions</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    Environment Setup
                  </h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <span>Quiet room with no distractions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <span>Computer screen (not phone or tablet)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <span>Water and snack available (like test center)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <span>Same time of day as your scheduled exam</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    Test-Taking Rules
                  </h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <span>Set 4-hour timer (240 minutes)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <span>Complete all 185 questions without pausing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <span>No study materials, notes, or references</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <span>Flag uncertain questions for review</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <p className="text-slate-800 font-semibold mb-2">⚠️ Critical Timing Strategy</p>
              <p className="text-slate-700">
                Aim for <strong>1.3 minutes per question</strong> (185 questions ÷ 240 minutes = 1.3 min/question). This leaves 15-20 minutes to review flagged questions. If you're spending 2+ minutes per question, you'll run out of time.
              </p>
            </div>
          </section>

          {/* Section 4: How to Analyze Results */}
          <section id="analyzing" className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              4. How to Analyze Your Mock Exam Results
            </h2>

            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Your mock exam score is just the starting point. The real value comes from deep analysis of your performance patterns.
            </p>

            <div className="space-y-6">
              {/* Step 1: Domain Analysis */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  Step 1: Break Down Performance by Domain
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-3 text-slate-900 font-semibold">Content Domain</th>
                        <th className="pb-3 text-slate-900 font-semibold">% of Exam</th>
                        <th className="pb-3 text-slate-900 font-semibold">Your Score</th>
                        <th className="pb-3 text-slate-900 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr className="border-b border-slate-100">
                        <td className="py-3">Behavior-Change Procedures</td>
                        <td className="py-3">14%</td>
                        <td className="py-3">72%</td>
                        <td className="py-3 text-emerald-600">✓ Maintain</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3">Experimental Design</td>
                        <td className="py-3">7%</td>
                        <td className="py-3">62%</td>
                        <td className="py-3 text-red-600">⚠ Priority Study</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3">Ethics & Professional Conduct</td>
                        <td className="py-3">13%</td>
                        <td className="py-3">68%</td>
                        <td className="py-3 text-orange-600">↑ Review Scenarios</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-slate-600 mt-4">
                  <strong>Priority Rule:</strong> Domains scoring below 70% need focused study. Domains at 70-75% need review. 75%+ maintain with practice questions.
                </p>
              </div>

              {/* Step 2: Question Type Analysis */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Step 2: Identify Question Type Patterns
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Question Types You're Missing:</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span><strong>Scenario-based:</strong> Application of concepts to real situations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span><strong>Definition-based:</strong> Recall of terminology and concepts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span><strong>Calculation-based:</strong> Data interpretation or measurement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span><strong>Multi-step reasoning:</strong> Complex problem-solving</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Common Error Patterns:</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                        <span>Misreading questions (rushing, missing keywords)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                        <span>Confusing similar concepts (e.g., NCR vs. DRA)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                        <span>Overthinking straightforward questions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                        <span>Knowledge gaps on niche topics</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3: Create Action Plan */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Step 3: Create Your Targeted Study Plan
                </h3>
                <p className="text-slate-700 mb-4">
                  Based on your analysis, prioritize study time using the 70-20-10 rule:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded">70%</span>
                    <span><strong>Priority domains (below 70%):</strong> Deep study with textbooks, examples, and focused practice questions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded">20%</span>
                    <span><strong>Review domains (70-75%):</strong> Scenario practice and application exercises</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded">10%</span>
                    <span><strong>Maintenance domains (75%+):</strong> Daily practice questions to retain knowledge</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Adjusting Your Study Plan */}
          <section id="adjusting" className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              5. Adjusting Your Study Plan Based on Results
            </h2>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-6 border border-blue-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Weekly Study Adjustment Framework</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Week 1-2 After Baseline Mock:</h4>
                  <ul className="space-y-2 text-slate-700 ml-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Focus exclusively on your lowest-scoring domain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Re-study foundational concepts with textbook + examples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Complete 20-30 domain-specific practice questions daily</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Week 3-4:</h4>
                  <ul className="space-y-2 text-slate-700 ml-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Address your second-lowest domain with same approach</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Maintain first domain with 10 practice questions daily</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Take domain-specific mini-quizzes (25 questions, 30 min)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Week 5-6 (Before Progress Mock):</h4>
                  <ul className="space-y-2 text-slate-700 ml-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Tackle remaining weak domains (one per week)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Begin mixed-domain practice (50 questions, all domains)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Review all previously-missed questions from baseline</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Final 2 Weeks (After Final Mock):</h4>
                  <ul className="space-y-2 text-slate-700 ml-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Light review only—no new heavy content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Daily mixed practice (30-50 questions) to maintain sharpness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Review ethics scenarios and BACB code specifics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Rest 1-2 days before exam day (no studying!)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Common Mistakes */}
          <section id="mistakes" className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              6. Common Mock Exam Mistakes to Avoid
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Critical Mistakes
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold text-xl">✗</span>
                    <div>
                      <strong>Taking mock exams too early</strong>
                      <p className="text-sm text-slate-600">Wait until you've reviewed all 9 domains first</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold text-xl">✗</span>
                    <div>
                      <strong>Retaking the same exam</strong>
                      <p className="text-sm text-slate-600">You'll memorize answers, not learn concepts</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold text-xl">✗</span>
                    <div>
                      <strong>Not simulating real conditions</strong>
                      <p className="text-sm text-slate-600">Timed, quiet, no distractions—or results are invalid</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold text-xl">✗</span>
                    <div>
                      <strong>Ignoring domain breakdowns</strong>
                      <p className="text-sm text-slate-600">Overall score doesn't tell the full story</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold text-xl">✗</span>
                    <div>
                      <strong>Taking final mock too close to test</strong>
                      <p className="text-sm text-slate-600">Need 1-2 weeks to address any gaps found</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Best Practices
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Space exams 3-4 weeks apart</strong>
                      <p className="text-sm text-slate-600">Allows time for targeted study between attempts</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Use different exam versions</strong>
                      <p className="text-sm text-slate-600">Tests true knowledge, not memorization</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Track performance trends</strong>
                      <p className="text-sm text-slate-600">Compare domain scores across all mock exams</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Review ALL incorrect answers</strong>
                      <p className="text-sm text-slate-600">Even lucky guesses—understand why answer is right</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Celebrate progress, not perfection</strong>
                      <p className="text-sm text-slate-600">Each mock builds skills and test-day confidence</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7: Best Resources */}
          <section id="resources" className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              7. Best BCBA Mock Exam Resources
            </h2>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 mb-6 border-2 border-emerald-200">
              <div className="flex items-start gap-6">
                <Image
                  src="/optimized/Logos/logo-gold-transparent.webp"
                  alt="Behavior School Logo"
                  width={80}
                  height={80}
                  className="flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Behavior School FREE BCBA Mock Exam
                  </h3>
                  <p className="text-slate-700 mb-4">
                    Our 185-question full-length mock exam is designed specifically for school-based BCBAs, with:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>Full 185 questions, 4-hour format</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>Accurate domain distribution</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>School-focused scenarios</span>
                      </li>
                    </ul>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>Detailed explanations for every answer</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>Domain-by-domain score breakdown</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>Personalized study recommendations</span>
                      </li>
                    </ul>
                  </div>
                  <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Link href="/bcba-mock-practice-test">
                      Start Your FREE Mock Exam →
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">What Makes a Quality BCBA Mock Exam?</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>185 questions</strong> matching actual exam length (not 50-100 question "mini" exams)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>4-hour timed format</strong> to build stamina and pacing skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>BACB Task List alignment</strong> with proper domain distribution (not random questions)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Scenario-based questions</strong> matching BACB's application-focused style</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Detailed explanations</strong> for correct AND incorrect answer choices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Performance analytics</strong> showing domain-by-domain breakdown</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8: FAQ */}
          <section id="faq" className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              8. Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  When should I take my first BCBA mock exam?
                </h3>
                <p className="text-slate-700">
                  Take your first mock exam 8-12 weeks before your test date, after you've completed initial content review of all 9 domains. This baseline exam identifies your weaknesses early enough to address them thoroughly. Avoid taking it too early (before content review) or too late (less than 6 weeks out).
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  How many BCBA mock exams should I take?
                </h3>
                <p className="text-slate-700">
                  Take 3-4 full-length mock exams: <strong>Baseline</strong> (8-12 weeks out), <strong>Progress Check</strong> (4-6 weeks out), <strong>Final Practice</strong> (1-2 weeks out), and optional <strong>Confidence Builder</strong> (3-5 days before). Space them 3-4 weeks apart to allow focused study between attempts.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  What is a good score on a BCBA mock exam?
                </h3>
                <p className="text-slate-700">
                  Aim for <strong>75-80%+</strong> on your final mock exam before test day. The BCBA passing scaled score is 400 (roughly 70% correct), but mock exams should be slightly harder to ensure readiness. Domain scores below 70% indicate areas needing additional study.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  How do I analyze my BCBA mock exam results?
                </h3>
                <p className="text-slate-700">
                  Break down scores by content domain, identify question types you're missing (scenario-based vs. definition-based), note if errors are from knowledge gaps or misreading questions, and track patterns across multiple exams. Prioritize domains scoring below 70% and question types with consistent errors.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Should I retake the same BCBA mock exam?
                </h3>
                <p className="text-slate-700">
                  No, don't retake identical exams as you'll memorize answers rather than learn concepts. Use different mock exams or randomized question banks each time. If using the same platform, ensure questions are randomized and not repeated.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  How accurate are BCBA mock exams compared to the real test?
                </h3>
                <p className="text-slate-700">
                  Quality mock exams with 185 questions, 4-hour format, and BACB task list alignment are highly predictive. Students scoring 75-80% on realistic mocks typically pass the actual exam. Look for exams with detailed explanations, proper domain distribution, and scenario-based questions matching BACB style.
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Test Your BCBA Knowledge?
            </h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto text-lg">
              Take our FREE 185-question BCBA mock exam designed specifically for school-based behavior analysts. Get instant results with domain-by-domain breakdown and personalized study recommendations.
            </p>
            <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-slate-100 text-lg px-8 py-6">
              <Link href="/bcba-mock-practice-test">
                Start Your FREE Mock Exam Now →
              </Link>
            </Button>
            <p className="text-emerald-100 mt-4 text-sm">
              No signup required • 185 questions • 4-hour format • Instant detailed results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
