import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Free IEP Data Tracking Checklist | ClassroomPilot",
  description:
    "Download our free 'Top 10 IEP Data Tracking Tips' checklist and discover proven strategies to streamline your special education data collection and progress monitoring.",
  robots: { index: true, follow: true },
};

export default function IEPChecklistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow-lg mb-6">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Free IEP Data Tracking Checklist
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get our proven &ldquo;Top 10 IEP Data Tracking Tips&rdquo; and streamline your special education data collection process
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Left Column - Benefits */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                What You&rsquo;ll Learn:
              </h2>
              <ul className="space-y-4">
                {[
                  "Efficient IEP goal tracking methods that save hours each week",
                  "Progress monitoring shortcuts for accurate data collection",
                  "IDEA compliance tips to avoid common documentation mistakes",
                  "Digital tools and templates for accommodations tracking",
                  "Parent communication strategies for progress reporting",
                  "Time-saving techniques for special education planning",
                  "Data visualization tips for IEP meetings",
                  "Automated workflow ideas to reduce paperwork",
                  "Best practices for assistive technology integration",
                  "Quick reference guide for emergency data collection"
                ].map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-slate-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - Download Form */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-semibold mb-4">
                Download Your Free Checklist
              </h3>
              <p className="mb-6 text-blue-100">
                Join over 5,000 special education teachers who use these proven strategies to streamline their IEP data collection.
              </p>
              
              {/* Email Form */}
              <form className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-blue-100 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-blue-100 mb-2">
                    Role (Optional)
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="w-full px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select your role</option>
                    <option value="special-ed-teacher">Special Education Teacher</option>
                    <option value="case-manager">Case Manager</option>
                    <option value="resource-teacher">Resource Teacher</option>
                    <option value="inclusion-teacher">Inclusion Teacher</option>
                    <option value="administrator">Administrator</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-12 text-base font-semibold bg-white text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Free Checklist
                </Button>
              </form>
              
              <p className="text-xs text-blue-200 mt-4 text-center">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <p className="text-slate-600 mb-4">
            Trusted by special education teachers nationwide
          </p>
          <div className="flex justify-center items-center space-x-8 text-slate-400">
            <div className="text-sm">⭐⭐⭐⭐⭐ 4.9/5 Rating</div>
            <div className="text-sm">5,000+ Downloads</div>
            <div className="text-sm">Used in 500+ Schools</div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-12 bg-slate-50 rounded-xl p-8 text-center">
          <blockquote className="text-lg text-slate-700 italic mb-4">
            &ldquo;This checklist transformed how I handle IEP data collection. I went from spending 3 hours per week on paperwork to just 30 minutes. Game changer!&rdquo;
          </blockquote>
          <cite className="text-slate-600 font-medium">
            — Sarah M., Special Education Teacher, Austin ISD
          </cite>
        </div>
      </div>
    </div>
  );
}