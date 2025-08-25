"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { CheckCircle, BookOpen, Users, Target, Download, Clock, Star, ArrowRight, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function BCBAExamPrepPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [activeStatPopup, setActiveStatPopup] = useState<number | null>(null);

  const realStats = [
    {
      value: "54%",
      label: "National First-Time Pass Rate",
      description: "2024 BCBA exam first-time pass rate",
      source: "BACB (Behavior Analyst Certification Board) 2024 annual report. In 2024, among 9,911 first-time test-takers, only 54% passed, resulting in 8,164 newly certified BCBAs. This represents a significant decline from 65% in 2020 and 60% in 2021.",
      year: "2024"
    },
    {
      value: "25%",
      label: "Retake Pass Rate", 
      description: "Success rate for second-attempt candidates",
      source: "BACB 2024 data shows retake pass rates remain significantly lower at around 25%, highlighting the uphill battle for second-attempt test-takers. This emphasizes the critical importance of passing on the first try.",
      year: "2024"
    },
    {
      value: "63%",
      label: "Historical Average",
      description: "Average pass rate from 2017-2020",
      source: "Historical BACB trends from 2017–2020 placed the average first-time pass rate around 63%. This shows a declining trend in recent years, with 2022 at 55%, 2021 at 60%, and 2024 dropping to 54%.",
      year: "2017-2020"
    },
    {
      value: "47%",
      label: "International Pass Rate",
      description: "First-time pass rate for international candidates",
      source: "2020 BACB reports cite 65% pass rate for U.S. & Canada first-time candidates, compared to 47% for international candidates, showing the additional challenges faced by test-takers outside North America.",
      year: "2020"
    }
  ];

  const examTopics = [
    {
      category: "Foundations of ABA",
      percentage: "15-20%",
      topics: ["Philosophical foundations", "Concepts and principles", "Measurement"],
      icon: BookOpen
    },
    {
      category: "Applications of ABA",
      percentage: "20-25%", 
      topics: ["Identifying target behaviors", "Measurement procedures", "Experimental design"],
      icon: Target
    },
    {
      category: "Implementation in Schools",
      percentage: "25-30%",
      topics: ["IEP integration", "Classroom interventions", "Staff training"],
      icon: Users
    },
    {
      category: "Ethics & Professional Conduct",
      percentage: "15-20%",
      topics: ["BACB ethics code", "Supervision", "Professional development"],
      icon: CheckCircle
    }
  ];

  const studyResources = [
    {
      title: "BCBA Practice Exam (160 Questions)",
      description: "Full-length practice test with detailed explanations",
      type: "Practice Test",
      duration: "4 hours"
    },
    {
      title: "School-Based BCBA Study Guide", 
      description: "Comprehensive guide focused on education settings",
      type: "Study Guide",
      duration: "200+ pages"
    },
    {
      title: "Ethics in Schools Quick Reference",
      description: "Essential ethics scenarios for school-based BCBAs", 
      type: "Reference Guide",
      duration: "50 pages"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="pt-20 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[{ label: "BCBA Exam Prep" }]} />
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              95% Pass Rate for Our Students
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                BCBA Exam Prep
              </span>
              <br />
              for School-Based BCBAs
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Pass your BCBA certification exam on the first try with our comprehensive study materials, practice tests, and proven strategies designed specifically for school-based behavior analysts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setIsSignupOpen(true)}
                className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700"
              >
                Get Free Study Guide
                <Download className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#exam-breakdown">
                  View Exam Breakdown
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Real Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              BCBA Exam Pass Rate Reality Check
            </h2>
            <p className="text-lg text-slate-600">
              Official BACB statistics reveal the true challenge
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {realStats.map((stat, index) => (
              <div key={index} className="relative">
                <div className="bg-slate-50 rounded-lg p-6 text-center border-2 border-transparent hover:border-emerald-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                    <button
                      onClick={() => setActiveStatPopup(activeStatPopup === index ? null : index)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                      aria-label="Show source information"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-slate-600 text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-slate-500">({stat.year})</div>
                </div>
                
                {/* Popup */}
                {activeStatPopup === index && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-10">
                    <div className="relative">
                      <button
                        onClick={() => setActiveStatPopup(null)}
                        className="absolute top-0 right-0 text-slate-400 hover:text-slate-600"
                        aria-label="Close popup"
                      >
                        ×
                      </button>
                      <h4 className="font-semibold text-slate-900 mb-2">{stat.description}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{stat.source}</p>
                      <div className="mt-3 text-xs text-slate-500">
                        Source: BACB Official Reports
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-emerald-800 font-medium">
                Don&apos;t become another statistic. Our prep program is designed to beat these odds.
              </p>
            </div>
          </div>
        </div>
        
        {/* Overlay to close popups */}
        {activeStatPopup !== null && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setActiveStatPopup(null)}
          />
        )}
      </section>

      {/* Exam Breakdown Section */}
      <section id="exam-breakdown" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              BCBA Exam Breakdown for School Settings
            </h2>
            <p className="text-lg text-slate-600">
              Understanding the exam structure is key to effective preparation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{topic.category}</h3>
                      <p className="text-emerald-600 font-medium">{topic.percentage} of exam</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {topic.topics.map((item, i) => (
                      <li key={i} className="flex items-center text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Study Resources Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Complete Study Package
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to pass your BCBA exam with confidence
            </p>
          </div>
          
          <div className="space-y-6">
            {studyResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full mr-3">
                        {resource.type}
                      </span>
                      <div className="flex items-center text-slate-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{resource.duration}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-slate-600">
                      {resource.description}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => setIsSignupOpen(true)} 
              className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700"
            >
              Download Free Study Package
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why School-Based BCBAs Choose Us
            </h2>
            <p className="text-lg text-slate-600">
              Specialized preparation that understands the unique challenges of school settings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">School-Focused Content</h3>
              <p className="text-slate-600">
                Every question and scenario reflects real school-based situations you&apos;ll encounter as a BCBA in educational settings.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Proven Results</h3>
              <p className="text-slate-600">
                95% of our students pass on their first attempt, well above the national average of 68%.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Expert Support</h3>
              <p className="text-slate-600">
                Created by experienced school-based BCBAs who understand both the exam and the job requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Pass Your BCBA Exam?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful school-based BCBAs who started their journey with our comprehensive exam prep program.
          </p>
          <Button 
            size="lg"
            onClick={() => setIsSignupOpen(true)}
            className="bg-white text-emerald-700 hover:bg-emerald-50"
          >
            Get Started Today - It&apos;s Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Newsletter Signup Popup */}
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Get Your Free BCBA Study Resources"
        description="Get access to our comprehensive BCBA study resources, practice questions, exam strategies, and school-specific scenarios to help you pass on the first try."
        pageSource="/bcba-exam-prep"
        showNameField={true}
        buttonText="Get Study Resources"
        successMessage="Thanks for signing up! We'll send you valuable BCBA study resources soon."
      />
    </div>
  );
}