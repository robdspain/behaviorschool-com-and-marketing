import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClassroomPilot — Your Co-Pilot for Special Education",
  description: "IEP-aligned planning, progress tracking, and reporting with less paperwork.",
  openGraph: {
    title: "ClassroomPilot — Your Co-Pilot for Special Education",
    description: "IEP-aligned planning, progress tracking, and reporting with less paperwork.",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ClassroomPilot",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "description": "IEP-aligned planning, progress tracking, and reporting with less paperwork.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
};

export default function ClassroomPilotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-16 pb-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              ClassroomPilot — Your Co-Pilot for Special Education
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              IEP-aligned planning, progress tracking, and reporting with less paperwork.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">IEP</span>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Progress</span>
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">Accommodations</span>
              <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">Collaboration</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#waitlist" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Join the waitlist
              </a>
              <a 
                href="#features" 
                className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                See features
              </a>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-red-600 mb-6">Current problems</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  IEP goals and data scattered in multiple tools
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  Manual progress notes slow communication
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  Hard to turn raw data into clear reports
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-green-600 mb-6">How this helps</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  Goal-aligned planning templates and checklists
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  Quick daily/weekly progress entry from any device
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  One-click summaries for parents and admins
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-16 bg-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Key features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Plan</h3>
              <p className="text-blue-700">Turn IEP goals into teachable steps and schedules.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-3">Track</h3>
              <p className="text-green-700">Fast entries with time-savers for busy classrooms.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Report</h3>
              <p className="text-purple-700">Readable summaries with evidence attached.</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-900 mb-3">Accommodations</h3>
              <p className="text-orange-700">Document supports and usage with timestamps.</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-pink-900 mb-3">Collaboration</h3>
              <p className="text-pink-700">Loop in paras and service providers.</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-3">Library</h3>
              <p className="text-indigo-700">Reusable strategies and materials.</p>
            </div>
          </div>
        </section>

        {/* Who it's for Section */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Who it&apos;s for</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Special Education Teachers</h3>
              <p className="text-gray-600">Spend more time teaching, less time typing.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Paraeducators</h3>
              <p className="text-gray-600">Log supports and student wins quickly.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Case Managers</h3>
              <p className="text-gray-600">Keep artifacts organized for audits and meetings.</p>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="container mx-auto px-6 py-16 bg-blue-600">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Join the waitlist</h2>
            <form 
              name="waitlist" 
              method="POST" 
              data-netlify="true" 
              netlify-honeypot="bot-field" 
              className="space-y-4"
            >
              <input type="hidden" name="form-name" value="waitlist" />
              <div className="hidden">
                <label>
                  Don&apos;t fill this out: <input name="bot-field" />
                </label>
              </div>
              <input 
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500" 
                type="email" 
                name="email" 
                placeholder="Work email" 
                required 
              />
              <input 
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500" 
                type="text" 
                name="name" 
                placeholder="Full name" 
                required 
              />
              <input 
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500" 
                type="text" 
                name="district" 
                placeholder="District / Organization" 
              />
              <input 
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500" 
                type="text" 
                name="role" 
                placeholder="Role (Teacher, Para, Admin)" 
              />
              <input type="hidden" name="product" value="classroompilot" />
              <button 
                className="w-full bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors" 
                type="submit"
              >
                Request early access
              </button>
              <p className="text-blue-100 text-sm">
                We&apos;ll only contact you about ClassroomPilot. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}