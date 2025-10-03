"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { School, Users, Target, TrendingUp, CheckCircle, BookOpen, ArrowRight, Download, Star } from "lucide-react";

export default function SchoolBehaviorSupportPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const services = [
    {
      title: "PBIS Implementation",
      description: "Complete Positive Behavioral Interventions and Supports framework for your school",
      icon: School,
      features: ["School-wide systems", "Tier 1, 2, & 3 supports", "Data collection tools", "Staff training materials"]
    },
    {
      title: "Behavior Intervention Plans",
      description: "Evidence-based BIP development and implementation for individual students",
      icon: Target,
      features: ["Functional behavior assessments", "Intervention strategies", "Data tracking systems", "Progress monitoring"]
    },
    {
      title: "MTSS Behavior Support", 
      description: "Multi-Tiered System of Supports integration with academic interventions",
      icon: TrendingUp,
      features: ["Tier identification", "Progress monitoring", "Team collaboration", "Data-driven decisions"]
    },
    {
      title: "Staff Training & Consultation",
      description: "Professional development for teachers, administrators, and support staff",
      icon: Users,
      features: ["Classroom management", "De-escalation techniques", "Positive reinforcement", "Crisis prevention"]
    }
  ];

  const outcomes = [
    { metric: "Research-Based", description: "Evidence-supported interventions", icon: TrendingUp },
    { metric: "Practical", description: "Real-world implementation focus", icon: Star }, 
    { metric: "Systematic", description: "Structured multi-tier approach", icon: BookOpen },
    { metric: "Sustainable", description: "Long-term behavior support", icon: CheckCircle }
  ];

  const resources = [
    {
      title: "PBIS Quick Start Guide",
      description: "Essential steps to launch PBIS in your school",
      type: "Implementation Guide"
    },
    {
      title: "Behavior Data Collection Templates", 
      description: "Ready-to-use forms for tracking student behavior",
      type: "Data Tools"
    },
    {
      title: "Crisis Prevention Protocols",
      description: "Step-by-step procedures for behavior emergencies", 
      type: "Safety Procedures"
    }
  ];

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs 
          items={[
            { label: "Tools", href: "/products" },
            { label: "School-Based Behavior Support" }
          ]}
        />
      </div>
      
      {/* Hero Section */}
      <section className="pt-20 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
            <School className="w-4 h-4 mr-2" />
            Evidence-Based Behavior Support
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
              School-Based
            </span>
            <br />
            Behavior Support
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Transform your school culture with evidence-based behavior support systems. PBIS implementation, behavior intervention plans, and staff training designed for real educational settings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setIsSignupOpen(true)}
              className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700"
            >
              Get Implementation Guide
              <Download className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#services">
                View Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Research-Based Approach
            </h2>
            <p className="text-lg text-slate-600">
              Evidence-supported principles for effective school behavior support systems
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {outcomes.map((outcome, index) => {
              const Icon = outcome.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">{outcome.metric}</div>
                  <div className="text-slate-600">{outcome.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Behavior Support Services
            </h2>
            <p className="text-lg text-slate-600">
              Everything your school needs to create a positive, supportive learning environment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-6">{service.description}</p>
                  
                  <div className="space-y-3">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contextual CTA after services */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Transform Your School&apos;s Behavior Support?</h3>
              <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
                These services work best when combined with comprehensive training. Get the complete toolkit for building effective, sustainable school-wide behavior systems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/transformation-program" 
                  className="inline-flex items-center px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Get School BCBA Training Program
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  href="/iep-goals" 
                  className="inline-flex items-center px-8 py-3 border border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  Start with IEP Goal Writing
                </Link>
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
              Free Implementation Resources
            </h2>
            <p className="text-lg text-slate-600">
              Get started with these essential tools for behavior support in schools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-slate-200 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full mb-3">
                  {resource.type}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{resource.title}</h3>
                <p className="text-slate-600 mb-4">{resource.description}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsSignupOpen(true)}
                  className="w-full"
                >
                  Download Free
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Implementation Process
            </h2>
            <p className="text-lg text-slate-600">
              A systematic approach to transforming your school&apos;s behavior support system
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Assessment & Planning",
                description: "Comprehensive evaluation of current systems and development of customized implementation plan"
              },
              {
                step: "2", 
                title: "Staff Training & Buy-In",
                description: "Professional development workshops and coaching to ensure all staff understand and support the new systems"
              },
              {
                step: "3",
                title: "Pilot Implementation", 
                description: "Small-scale rollout with selected classrooms or grade levels to test and refine approaches"
              },
              {
                step: "4",
                title: "School-Wide Launch",
                description: "Full implementation with ongoing support, monitoring, and continuous improvement cycles"
              }
            ].map((phase, index) => (
              <div key={index} className="flex items-start">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6 flex-shrink-0">
                  {phase.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{phase.title}</h3>
                  <p className="text-slate-600">{phase.description}</p>
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
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Start implementing positive behavior support systems with our evidence-based resources and guidance.
          </p>
          <Button 
            size="lg"
            onClick={() => setIsSignupOpen(true)}
            className="bg-white text-emerald-700 hover:bg-emerald-50"
          >
            Get Started - Free Resources
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Newsletter Signup Popup */}
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Download Free PBIS Implementation Guide"
        description="Get our comprehensive guide with step-by-step instructions, templates, and proven strategies for implementing positive behavior support in your school."
        pageSource="/school-based-behavior-support"
        showNameField={true}
        buttonText="Download Guide"
        successMessage="Check your email! Your PBIS implementation guide is on its way."
      />
    </div>
  );
}