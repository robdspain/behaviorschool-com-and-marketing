"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { Target, Users, BookOpen, ArrowRight, TrendingUp } from "lucide-react";

export default function IEPBehaviorGoalsPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // FAQ data for structured data
  const faqData = [
    {
      question: "What is a behavior goal IEP?",
      answer: "A behavior goal IEP is a specific, measurable objective written into a student's Individualized Education Program (IEP) to address behavioral challenges. These IEP behavior goals target specific behaviors like attention, social skills, self-regulation, and academic behaviors to help students succeed in school."
    },
    {
      question: "What are examples of behavioral goals for IEP?",
      answer: "Examples of behavioral goals include: on-task behavior (staying focused for specific time periods), social skills (initiating conversations with peers), self-regulation (using coping strategies when frustrated), and academic behaviors (completing assignments independently). Each goal must be measurable and include specific criteria."
    },
    {
      question: "How do you write measurable behavioral goals examples?",
      answer: "Measurable behavioral goals examples include four key components: 1) Observable behavior (what the student will do), 2) Conditions (when/where it occurs), 3) Criteria (success rate and timeframe), 4) Measurement method (how progress is tracked). For example: 'During math class, [Student] will complete assigned work with 80% accuracy in 4 out of 5 consecutive days.'"
    },
    {
      question: "What are behavior IEP goals vs regular IEP goals?",
      answer: "Behavior IEP goals specifically target behavioral challenges and social-emotional skills, while regular IEP goals may focus on academic achievement. Behavior iep goals often address attention, self-regulation, social skills, and classroom behaviors that impact learning, using behavioral measurement techniques."
    },
    {
      question: "How do you track progress on IEP behavior goals?",
      answer: "Track progress on IEP behavior goals through direct observation, data collection sheets, frequency counts, duration recording, and teacher/staff reports. Document daily or weekly progress, review monthly, and adjust goals during quarterly IEP meetings based on student performance data."
    }
  ];

  // Structured data for FAQ
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Article structured data for E-E-A-T and SEO
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "IEP Behavior Goals: Guide & Examples",
    description: "Learn how to write measurable IEP behavior goals with clear, adaptable examples for school teams and special education professionals.",
    author: {
      "@type": "Organization",
      name: "Behavior School",
    },
    publisher: {
      "@type": "Organization",
      name: "Behavior School",
    },
    url: "https://behaviorschool.com/iep-behavior-goals",
    datePublished: "2025-09-16",
    dateModified: "2025-09-16"
  };

  // Removed generic goal types section per request

  const components = [
    {
      title: "Measurable Behavior",
      description: "Clear, observable, and quantifiable target behavior",
      example: "Will raise hand and wait to be called on..."
    },
    {
      title: "Conditions", 
      description: "Setting, materials, and supports provided",
      example: "During whole group instruction with visual reminder..."
    },
    {
      title: "Criteria",
      description: "Performance level and frequency required",
      example: "80% of opportunities across 5 consecutive days..."
    },
    {
      title: "Timeline",
      description: "When the goal will be measured and reviewed", 
      example: "By the end of the IEP year..."
    }
  ];

  // Note: Removed bottom template/resource promos and marketing stats per request

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs 
          items={[
            { label: "Tools", href: "/products" },
            { label: "IEP Behavior Goals" }
          ]}
        />
      </div>
      
      {/* Hero Section */}
      <section className="pt-20 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with numerical claim removed per request */}
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
              IEP Behavior Goals
            </span>
            <br />
            <span className="text-3xl md:text-4xl">Guide & Examples</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Learn how to write measurable IEP behavior goals with clear, adaptable examples for school teams and special education professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setIsSignupOpen(true)}
              className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white"
            >
              Get the Resource Guide (Coming Soon)
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#measurable-goals">
                View Goal Examples
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <p className="text-xs text-slate-500 text-center">Last updated: September 16, 2025 • Reviewed by the Behavior School editorial team</p>
        </div>
      </section>

      {/* Table of Contents (informational) */}
      <section className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Table of contents" className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-slate-800 mb-2">On this page</p>
            <ul className="text-sm text-slate-600 grid gap-2 sm:grid-cols-2">
              <li><a className="hover:text-emerald-700" href="#goal-components">How to write goals</a></li>
              <li><a className="hover:text-emerald-700" href="#measurable-goals">Examples</a></li>
              <li><a className="hover:text-emerald-700" href="#measurement-methods">Measurement methods</a></li>
              <li><a className="hover:text-emerald-700" href="#common-mistakes">Common mistakes</a></li>
              <li><a className="hover:text-emerald-700" href="#faq">FAQ</a></li>
              <li><a className="hover:text-emerald-700" href="#references">References</a></li>
            </ul>
          </nav>
        </div>
      </section>

      {/* Quick Navigation Section removed per request */}

      {/* Stats section removed per request */}

      {/* Goal Components Section */}
      <section id="goal-components" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How to Write IEP Behavior Goals: 4 Essential Components
            </h2>
            <p className="text-lg text-slate-600">
              Every effective behavior goal IEP must include these critical elements for measurable behavioral goals that work in school settings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {components.map((component, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{component.title}</h3>
                </div>
                <p className="text-slate-600 mb-4">{component.description}</p>
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3">
                  <p className="text-emerald-800 text-sm italic">{component.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goal Types Section removed per request */}

      {/* Measurable Behavioral Goals Examples Section */}
      <section id="measurable-goals" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Measurable Behavioral Goals Examples for IEP Teams
            </h2>
            <p className="text-lg text-slate-600">
              Ready-to-use examples of behavioral goals for IEP implementation. Copy and customize these sample goals for your students. Each behavioral goal includes specific criteria and measurement methods.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Attention/Focus Examples */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-slate-900">Attention & Focus Examples</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                  <h4 className="font-semibold text-emerald-800 mb-2">On-Task Behavior Goal:</h4>
                  <p className="text-sm text-emerald-700">
                    &ldquo;During independent work time, [Student] will remain on-task and engaged with assigned activities for 15 consecutive minutes, in 4 out of 5 trials across 2 consecutive weeks, as measured by teacher observation.&rdquo;
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                  <h4 className="font-semibold text-emerald-800 mb-2">Following Directions Goal:</h4>
                  <p className="text-sm text-emerald-700">
                    &ldquo;When given a 2-step direction during classroom instruction, [Student] will complete both steps within 3 minutes without additional prompts, in 80% of opportunities over 4 consecutive weeks.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Social Skills Examples */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-slate-900">Social Skills Examples</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 mb-2">Peer Interaction Goal:</h4>
                  <p className="text-sm text-blue-700">
                    &ldquo;During structured social activities, [Student] will initiate appropriate conversation with peers by asking questions or making comments, at least 3 times per 20-minute session, for 3 consecutive weeks.&rdquo;
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 mb-2">Conflict Resolution Goal:</h4>
                  <p className="text-sm text-blue-700">
                    &ldquo;When experiencing conflict with peers, [Student] will use appropriate conflict resolution strategies (walk away, ask for help, use calm words) in 4 out of 5 opportunities across 2 consecutive weeks.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Self-Regulation Examples */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-slate-900">Self-Regulation Examples</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-800 mb-2">Emotional Regulation Goal:</h4>
                  <p className="text-sm text-purple-700">
                    &ldquo;When feeling frustrated or upset, [Student] will use learned coping strategies (deep breathing, count to 10, request break) before acting out, in 80% of observed situations over 4 consecutive weeks.&rdquo;
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-800 mb-2">Appropriate Help-Seeking Goal:</h4>
                  <p className="text-sm text-purple-700">
                    &ldquo;When needing assistance with academic tasks, [Student] will appropriately request help by raising hand and waiting to be acknowledged, in 9 out of 10 opportunities across 3 consecutive weeks.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Behavior Examples */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-slate-900">Academic Behavior Examples</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-2">Work Completion Goal:</h4>
                  <p className="text-sm text-orange-700">
                    &ldquo;Given classroom assignments at instructional level, [Student] will complete assigned work with 80% accuracy within the designated time frame, in 4 out of 5 consecutive school days over 3 weeks.&rdquo;
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-2">Class Participation Goal:</h4>
                  <p className="text-sm text-orange-700">
                    &ldquo;During whole group discussions, [Student] will participate by raising hand and contributing relevant comments or questions at least 2 times per class period, for 4 out of 5 consecutive days.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-slate-100 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                📋 Why These Examples of Behavioral Goals Work
              </h3>
              <p className="text-slate-700 mb-4">
                Each behavioral goal example above demonstrates the SMART criteria for effective IEP behavior goals: Specific, Measurable, Achievable, Relevant, and Time-bound.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-emerald-600">Observable Behavior</div>
                  <div className="text-slate-600">Clear, specific actions that can be seen and measured by school staff</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-600">Conditions</div>
                  <div className="text-slate-600">When, where, and under what circumstances the behavior should occur</div>
                </div>
                <div>
                  <div className="font-semibold text-purple-600">Criteria</div>
                  <div className="text-slate-600">Success rate and time frame for achievement in school settings</div>
                </div>
                <div>
                  <div className="font-semibold text-orange-600">Measurement</div>
                  <div className="text-slate-600">How progress will be tracked and documented by IEP teams</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-emerald-50 rounded-lg p-6 border border-emerald-200">
            <h3 className="text-xl font-semibold text-emerald-800 mb-4">
              🎯 Using These Behavioral Goals in Your IEP Process
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-emerald-700 mb-2">1. Customize for Your Student</h4>
                <p className="text-emerald-700">Adapt these behavioral goals examples to match your student&apos;s specific needs, current performance level, and classroom environment.</p>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-700 mb-2">2. Set Up Data Collection</h4>
                <p className="text-emerald-700">Create data collection systems that match the measurement criteria specified in each behavior goal IEP.</p>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-700 mb-2">3. Train Your Team</h4>
                <p className="text-emerald-700">Ensure all school staff understand the behavioral goals and know how to support student success with consistent implementation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Measurement Methods */}
      <section id="measurement-methods" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Measurement Methods for Behavior Goals</h2>
            <p className="text-lg text-slate-600">Choose methods that align with the behavior and context you’re targeting.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Frequency</h3>
              <p className="text-slate-600 mb-3">Count how often a behavior occurs (e.g., requests help appropriately 3 times per class).</p>
              <p className="text-sm text-slate-500">Best for discrete, clearly defined behaviors.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Duration</h3>
              <p className="text-slate-600 mb-3">Measure how long a behavior lasts (e.g., on-task for 15 consecutive minutes).</p>
              <p className="text-sm text-slate-500">Best for sustained engagement or problem behaviors with length.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Latency</h3>
              <p className="text-slate-600 mb-3">Time between instruction and behavior (e.g., begins task within 30 seconds of direction).</p>
              <p className="text-sm text-slate-500">Useful for following directions or initiation goals.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Interval Sampling</h3>
              <p className="text-slate-600 mb-3">Record whether a behavior occurs within set intervals (e.g., partial interval every 30 seconds).</p>
              <p className="text-sm text-slate-500">Helpful when continuous observation isn’t feasible.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section id="common-mistakes" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Common Mistakes and How to Fix Them</h2>
            <p className="text-lg text-slate-600">Practical tips to make goals observable, measurable, and achievable.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Vague behaviors</h3>
              <p className="text-slate-600">Replace labels like “behaves appropriately” with specific, observable actions (e.g., “raises hand before speaking”).</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No conditions</h3>
              <p className="text-slate-600">State when/where the behavior occurs (during whole group instruction, in the cafeteria, etc.).</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Unclear criteria</h3>
              <p className="text-slate-600">Set objective thresholds (e.g., 80% across 4/5 consecutive days) and how it’s measured.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Missing generalization</h3>
              <p className="text-slate-600">Plan for multiple settings/people and note supports fading over time where appropriate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Goal Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Complete IEP Behavior Goal Example
            </h2>
            <p className="text-lg text-slate-600">
              See how all components come together in a complete, measurable behavior goal IEP teams can implement
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-xl border border-slate-200">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full mb-4">
                Social Skills Goal Example
              </span>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <blockquote className="border-l-4 border-emerald-500 pl-6 italic text-slate-700 text-lg leading-relaxed">
                &ldquo;When wanting to join a group activity during recess and lunch periods, 
                [Student] will appropriately request to join by asking permission and 
                waiting for a response before joining, in 4 out of 5 observed opportunities 
                across 3 consecutive weeks, as measured by teacher observation and data collection, 
                by the end of the IEP year.&rdquo;
              </blockquote>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">✓ What makes this goal strong:</h4>
                <ul className="text-emerald-700 text-sm space-y-1">
                  <li>• Specific, observable behavior</li>
                  <li>• Clear conditions and setting</li>
                  <li>• Measurable criteria (4/5 opportunities)</li>
                  <li>• Defined timeline and measurement method</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">📊 Data Collection:</h4>
                <ul className="text-slate-700 text-sm space-y-1">
                  <li>• Track during recess and lunch</li>
                  <li>• Record attempts and successes</li>
                  <li>• Weekly progress monitoring</li>
                  <li>• Quarterly IEP team review</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource/template promos removed per request */}

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions About IEP Behavior Goals
            </h2>
            <p className="text-lg text-slate-600">
              Common questions about writing and implementing behavior goals IEP teams ask
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
                <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* References */}
      <section id="references" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">References and Further Reading</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Positive Behavioral Interventions & Supports (PBIS) – pbis.org</li>
            <li>IRIS Center (Vanderbilt) – iris.peabody.vanderbilt.edu</li>
            <li>National Center on Intensive Intervention (NCII) – intensiveintervention.org</li>
            <li>Wrightslaw: Special Education Law – wrightslaw.com</li>
            <li>Individuals with Disabilities Education Act (IDEA) – idea.ed.gov</li>
          </ul>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Related Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link className="block border border-slate-200 rounded-lg p-4 hover:border-emerald-300 hover:bg-emerald-50" href="/iep-goals">
              <h3 className="font-semibold text-slate-900">IEP Goals: Complete Guide</h3>
              <p className="text-sm text-slate-600">Structure, examples, and progress monitoring.</p>
            </Link>
            <Link className="block border border-slate-200 rounded-lg p-4 hover:border-emerald-300 hover:bg-emerald-50" href="/behavior-plans">
              <h3 className="font-semibold text-slate-900">Behavior Plans</h3>
              <p className="text-sm text-slate-600">From assessment to implementation.</p>
            </Link>
            <Link className="block border border-slate-200 rounded-lg p-4 hover:border-emerald-300 hover:bg-emerald-50" href="/school-based-bcba">
              <h3 className="font-semibold text-slate-900">School-Based BCBA</h3>
              <p className="text-sm text-slate-600">Roles, collaboration, and best practices.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Email Signup Popup */}
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Get the IEP Behavior Goals Resource Guide"
        description="The guide is coming soon. Enter your email to be notified when it's ready and receive occasional updates about IEP behavior goals."
        pageSource="/iep-behavior-goals"
        showNameField={true}
        buttonText="Notify Me"
        successMessage="Thanks! We'll email you the guide as soon as it's ready."
      />
    </div>
  );
}
