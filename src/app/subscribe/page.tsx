"use client"

import Script from "next/script"
import { CheckCircle, Users, Mail, ArrowLeft, Shield, Clock, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header with back button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main signup section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-100 p-4 rounded-full">
              <Mail className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Join the Community</h1>
          <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto">
                         Get exclusive insights, actionable strategies, and the support you need to lead with confidence and create lasting change in your school&apos;s behavior program.
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">2,500+ BCBAs</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">Weekly Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">Expert Resources</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Signup form */}
          <div className="order-2 lg:order-1">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Get Early Access</h3>
                <div style={{ height: "40vmin", minHeight: 360 }} className="w-full">
                  <Script
                    src="https://cdn.jsdelivr.net/ghost/signup-form@~0.2/umd/signup-form.min.js"
                    async
                    data-background-color="#ffffff"
                    data-text-color="#000000"
                    data-button-color="#059669"
                    data-button-text-color="#FFFFFF"
                    data-title="Behavior School"
                    data-description="We help overwhelmed BCBAs create structured behavior systems for student success"
                    data-icon="https://behaviorschool.com/content/images/size/w192h192/size/w256h256/2025/02/Behavior-School-Logo.png"
                    data-site="https://behaviorschool.com/"
                    data-locale="en"
                  />
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-500 text-center">
                    By joining, you agree to receive occasional emails from Behavior School. 
                    You can unsubscribe at any time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">What You&apos;ll Get</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Early Access to Tools</h4>
                  <p className="text-slate-600">Be the first to try our digital FBA templates, intervention planning tools, and data collection systems.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Weekly Insights</h4>
                  <p className="text-slate-600">Practical strategies, case studies, and research updates delivered to your inbox every week.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Community Access</h4>
                  <p className="text-slate-600">Connect with other school-based BCBAs, share experiences, and get support when you need it.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Expert Training</h4>
                  <p className="text-slate-600">Free webinars, workshops, and professional development opportunities designed for busy school teams.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Implementation Support</h4>
                  <p className="text-slate-600">Step-by-step guides and templates to help you implement evidence-based practices in your school.</p>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-8 p-6 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-700">Trusted by 2,500+ BCBAs</span>
              </div>
                             <blockquote className="text-slate-700 italic">
                 &ldquo;Behavior School has been a game-changer for our team. The practical tools and supportive community have helped us implement more effective behavior interventions.&rdquo;
               </blockquote>
              <cite className="text-sm text-slate-600 mt-2 block">— Sarah M., School BCBA</cite>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-16 border-t border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Is this really free?</h4>
              <p className="text-slate-600">Yes! Our community and weekly insights are completely free. We believe in supporting behavior analysts in education.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">How often will I receive emails?</h4>
              <p className="text-slate-600">We send one weekly newsletter with insights and updates, plus occasional announcements about new tools and training.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Can I unsubscribe anytime?</h4>
              <p className="text-slate-600">Absolutely. Every email includes an easy unsubscribe link, and you can manage your preferences at any time.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">When will the tools be available?</h4>
                             <p className="text-slate-600">We&apos;re launching our first tools in early 2025. Community members get exclusive early access and special pricing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}