"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { FileText, Target, CheckCircle, Users, BookOpen, Download, ArrowRight, Star, TrendingUp } from "lucide-react";

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

  const goalTypes = [
    {
      category: "Social Skills Goals",
      description: "Peer interaction, communication, and social appropriateness",
      icon: Users,
      examples: [
        "Initiating conversations with peers",
        "Following social rules and expectations", 
        "Resolving conflicts appropriately"
      ]
    },
    {
      category: "Attention & Focus Goals",
      description: "On-task behavior, following directions, and sustained attention",
      icon: Target,
      examples: [
        "Remaining on-task during instruction",
        "Following multi-step directions",
        "Transitioning between activities"
      ]
    },
    {
      category: "Self-Regulation Goals",
      description: "Emotional control, coping strategies, and behavioral responses",
      icon: TrendingUp,
      examples: [
        "Using coping strategies when frustrated",
        "Requesting breaks appropriately",
        "Managing emotional responses"
      ]
    },
    {
      category: "Academic Behavior Goals", 
      description: "Work completion, participation, and academic engagement",
      icon: BookOpen,
      examples: [
        "Completing assignments independently",
        "Participating in class discussions",
        "Organizing materials effectively"
      ]
    }
  ];

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

  const resources = [
    {
      title: "IEP Behavior Goals Template Library",
      description: "50+ pre-written, measurable behavior goals ready to customize",
      downloads: "1,200+"
    },
    {
      title: "Data Collection Sheets",
      description: "Track progress on behavior goals with easy-to-use forms",
      downloads: "800+"
    },
    {
      title: "Parent Communication Templates",
      description: "Share behavior goal progress with families effectively",
      downloads: "600+"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Used by 1,000+ School Teams
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
              IEP Behavior Goals
            </span>
            <br />
            <span className="text-3xl md:text-4xl">Templates & Examples</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Free behavior goal IEP templates with measurable behavioral goals examples. Write effective IEP behavior goals that improve student outcomes with our comprehensive guide for school teams and special education professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setIsSignupOpen(true)}
              className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700"
            >
              Download Goal Templates
              <Download className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#goal-types">
                View Goal Examples
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Navigation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Popular Behavior Goal IEP Resources
            </h2>
            <p className="text-slate-600">
              Jump to the most requested IEP behavior goals examples and templates
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              asChild 
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-emerald-50 hover:border-emerald-300"
            >
              <Link href="#behavioral-goals-examples">
                <Target className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-medium">Behavioral Goals Examples</span>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              asChild 
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-emerald-50 hover:border-emerald-300"
            >
              <Link href="#measurable-goals">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-medium">Measurable Behavioral Goals</span>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              asChild 
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-emerald-50 hover:border-emerald-300"
            >
              <Link href="#goal-components">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-medium">IEP Behavior Goal Writing</span>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              asChild 
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-emerald-50 hover:border-emerald-300"
            >
              <Link href="#resources">
                <FileText className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-medium">Free Templates</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
              <div className="text-slate-600">Behavior Goal Templates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">1,000+</div>
              <div className="text-slate-600">Schools Using IEP Goals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">89%</div>
              <div className="text-slate-600">Behavioral Goal Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
              <div className="text-slate-600">Access to Resources</div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Goal Types Section */}
      <section id="goal-types" className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Common Types of IEP Behavior Goals
            </h2>
            <p className="text-lg text-slate-600">
              Comprehensive coverage of behavior goals across different domains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {goalTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-8 shadow-lg border border-slate-200">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{type.category}</h3>
                      <p className="text-slate-600 text-sm">{type.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {type.examples.map((example, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Measurable Behavioral Goals Examples Section */}
      <section id="measurable-goals" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Measurable Behavioral Goals Examples for IEP Teams
            </h2>
            <p className="text-lg text-slate-600">
              Ready-to-use examples of behavioral goals for IEP implementation. Copy, customize, and use these behavior goal IEP templates with your students. Each behavioral goal includes specific criteria and measurement methods.
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

      {/* Resources Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Free IEP Behavior Goal Resources
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to write, implement, and track behavior goals effectively
            </p>
          </div>
          
          <div className="space-y-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FileText className="w-5 h-5 text-emerald-600 mr-3" />
                      <h3 className="text-xl font-semibold text-slate-900">{resource.title}</h3>
                    </div>
                    <p className="text-slate-600 mb-2">{resource.description}</p>
                    <p className="text-sm text-emerald-600 font-medium">{resource.downloads} downloads</p>
                  </div>
                  <Button 
                    onClick={() => setIsSignupOpen(true)}
                    className="ml-6"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Writing Better Behavior Goals Today
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of school teams using our proven templates and strategies to create meaningful, achievable IEP behavior goals.
          </p>
          <Button 
            size="lg"
            onClick={() => setIsSignupOpen(true)}
            className="bg-white text-emerald-700 hover:bg-emerald-50"
          >
            Get Free Goal Templates
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Newsletter Signup Popup */}
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Download Free IEP Behavior Goal Templates"
        description="Get our complete library of 50+ measurable behavior goals, data collection sheets, and implementation guides for school-based teams."
        pageSource="/iep-behavior-goals"
        showNameField={true}
        buttonText="Download Templates"
        successMessage="Check your email! Your IEP behavior goal templates are on their way."
      />
    </div>
  );
}