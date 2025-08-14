import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TierPath — The MTSS/PBIS Operating System",
  description: "From universal screening to Tier 3 fidelity — connect teams, track supports, and report outcomes.",
  openGraph: {
    title: "TierPath — The MTSS/PBIS Operating System",
    description: "From universal screening to Tier 3 fidelity — connect teams, track supports, and report outcomes.",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TierPath",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "description": "From universal screening to Tier 3 fidelity — connect teams, track supports, and report outcomes.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
};

export default function TierPathPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-16 pb-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              TierPath — The MTSS/PBIS Operating System
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              From universal screening to Tier 3 fidelity — connect teams, track supports, and report outcomes.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">MTSS</span>
              <span className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium">PBIS</span>
              <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">Tier 1–3</span>
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">CICO</span>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Progress Monitoring</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#waitlist" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Join the waitlist
              </a>
              <a 
                href="#features" 
                className="bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
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
                  Screening, interventions, and data live in silos
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  No single view of Tier 1–3 supports across schools
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  Fidelity and outcomes are hard to prove
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-green-600 mb-6">How this helps</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  Centralize Tier 1–3 interventions and student rosters
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  Built-in CICO with status and trends
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  Fidelity tracking with dashboards for leadership
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-16 bg-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Key features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Screen</h3>
              <p className="text-purple-700">Universal screening + risk flags.</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-pink-900 mb-3">Intervene</h3>
              <p className="text-pink-700">Assign Tier 2/3 supports and track delivery.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">CICO</h3>
              <p className="text-blue-700">Daily points, trends, and alerts.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-3">Monitor</h3>
              <p className="text-green-700">Progress views by student, school, and district.</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-3">Fidelity</h3>
              <p className="text-indigo-700">Implementation checks and coaching loops.</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-900 mb-3">Report</h3>
              <p className="text-orange-700">Board-ready summaries in minutes.</p>
            </div>
          </div>
        </section>

        {/* Who it's for Section */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Who it&apos;s for</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">District Leaders</h3>
              <p className="text-gray-600">See supports and outcomes across campuses.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">PBIS/MTSS Coaches</h3>
              <p className="text-gray-600">Coordinate delivery and coach to fidelity.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Principals</h3>
              <p className="text-gray-600">Know what&apos;s working and where to staff.</p>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="container mx-auto px-6 py-16 bg-purple-600">
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
                placeholder="Role (Admin, Coach, Leader)" 
              />
              <input type="hidden" name="product" value="tierpath" />
              <button 
                className="w-full bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors" 
                type="submit"
              >
                Request early access
              </button>
              <p className="text-purple-100 text-sm">
                We&apos;ll only contact you about TierPath. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}