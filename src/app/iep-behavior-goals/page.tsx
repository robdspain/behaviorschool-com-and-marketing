"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { FileText, Target, CheckCircle, Users, BookOpen, Download, ArrowRight, Star, TrendingUp } from "lucide-react";

export const metadata = {
  title: "IEP Behavior Goals: Templates, Examples & Resources | Behavior School",
  description: "Write measurable IEP behavior goals with our free templates, examples, and data collection tools. Designed for BCBAs & special education teams.",
};

export default function IEPBehaviorGoalsPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

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
            Made Simple
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Write measurable, meaningful IEP behavior goals that actually work in classroom settings. Complete templates, examples, and data collection tools for school-based BCBAs and special education teams.
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
              <div className="text-slate-600">Goal Templates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">1,000+</div>
              <div className="text-slate-600">Schools Using</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">89%</div>
              <div className="text-slate-600">Goal Achievement Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
              <div className="text-slate-600">Access to Resources</div>
            </div>
          </div>
        </div>
      </section>

      {/* Goal Components Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              4 Essential Components of Strong Behavior Goals
            </h2>
            <p className="text-lg text-slate-600">
              Every effective IEP behavior goal must include these critical elements
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

      {/* Example Goal Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Example: Well-Written Behavior Goal
            </h2>
            <p className="text-lg text-slate-600">
              See how all components come together in a complete, measurable goal
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