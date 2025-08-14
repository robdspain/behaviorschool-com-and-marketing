import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BehaviorPilot — The Behavior Analyst OS for Schools",
  description: "From FBA to BIP to progress monitoring — centralized, fast, and AI-assisted.",
  openGraph: {
    title: "BehaviorPilot — The Behavior Analyst OS for Schools",
    description: "From FBA to BIP to progress monitoring — centralized, fast, and AI-assisted.",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "BehaviorPilot",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "description": "From FBA to BIP to progress monitoring — centralized, fast, and AI-assisted.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
};

export default function BehaviorPilotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-16 pb-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              BehaviorPilot — The Behavior Analyst OS for Schools
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              From FBA to BIP to progress monitoring — centralized, fast, and AI-assisted.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">FBA</span>
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">BIP</span>
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">Progress Monitoring</span>
              <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">Fidelity</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">FERPA/HIPAA aware</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#waitlist" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Join the waitlist
              </a>
              <a 
                href="#features" 
                className="bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
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
                  FBAs and BIPs scattered across docs, drives, and email
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  Manual data collection slows decisions
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  Graphing and reporting chew up planning time
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  Team fidelity is hard to track
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-green-600 mb-6">How this helps</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  AI-assisted FBA builder that captures precursors and functions
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  District-ready BIP templates with goals and strategies
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  Mobile-friendly data capture with instant charts
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  Automated reports and fidelity checklists
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-16 bg-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Key features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-3">Assess (FBA)</h3>
              <p className="text-green-700">Guided FBA flow with prompts; exportable summaries.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Plan (BIP)</h3>
              <p className="text-blue-700">Editable templates aligned to school workflows.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Collect</h3>
              <p className="text-purple-700">ABC, frequency, duration, interval data — on any device.</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-900 mb-3">Monitor</h3>
              <p className="text-orange-700">Auto-graphs, alerts, and goal progress.</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-pink-900 mb-3">Fidelity</h3>
              <p className="text-pink-700">Implementation checks and coaching notes.</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-3">Report</h3>
              <p className="text-indigo-700">Parent-friendly and board-ready exports.</p>
            </div>
          </div>
        </section>

        {/* Who it's for Section */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Who it&apos;s for</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">BCBAs</h3>
              <p className="text-gray-600">Cut paperwork; focus on analysis and coaching.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">School Psychologists</h3>
              <p className="text-gray-600">Coordinate assessment and plans with ease.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Admins</h3>
              <p className="text-gray-600">Visibility into supports and outcomes across campuses.</p>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="container mx-auto px-6 py-16 bg-green-600">
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
                placeholder="Role (BCBA, SPED, Admin)" 
              />
              <input type="hidden" name="product" value="behaviorpilot" />
              <button 
                className="w-full bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors" 
                type="submit"
              >
                Request early access
              </button>
              <p className="text-green-100 text-sm">
                We&apos;ll only contact you about BehaviorPilot. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}