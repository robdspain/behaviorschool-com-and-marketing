export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-50 to-emerald-50 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate max-w-none">
          {/* Effective Date */}
          <div className="bg-slate-50 rounded-lg p-6 mb-8">
            <p className="text-slate-700 mb-2">
              <strong>Effective Date:</strong> January 1, 2025
            </p>
            <p className="text-slate-700">
              <strong>Last Updated:</strong> January 1, 2025
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Personal Information</h3>
            <p className="text-slate-700 mb-4">When you use Behavior Study Tools, we may collect:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
              <li>Name and email address when you create an account</li>
              <li>Payment information when you subscribe to our service</li>
              <li>Study progress and performance data</li>
              <li>Device information and usage analytics</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-4">Automatically Collected Information</h3>
            <p className="text-slate-700 mb-4">We automatically collect certain information when you use our app:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
              <li>IP address and device identifiers</li>
              <li>App usage statistics and performance metrics</li>
              <li>Crash reports and error logs</li>
              <li>Study session data and question responses</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">2. How We Use Your Information</h2>
            <p className="text-slate-700 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
              <li>Provide and improve our adaptive study platform</li>
              <li>Personalize your study experience and track progress</li>
              <li>Process payments and manage your subscription</li>
              <li>Send important updates about your account and our service</li>
              <li>Analyze usage patterns to enhance our AI algorithms</li>
              <li>Provide customer support and respond to your inquiries</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">3. Information Sharing and Disclosure</h2>
            <p className="text-slate-700 mb-4">We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
              <li><strong>Service Providers:</strong> With trusted third parties who help us operate our service (payment processors, analytics providers)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">4. Data Security</h2>
            <p className="text-slate-700 mb-4">We implement industry-standard security measures to protect your information:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information on a need-to-know basis</li>
              <li>Secure payment processing through certified providers</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">5. Data Retention and Deletion</h2>
            <p className="text-slate-700 mb-4">We retain your information for as long as necessary to provide our services and comply with legal obligations:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Study Progress:</strong> Retained to maintain your learning history</li>
              <li><strong>Payment Data:</strong> Retained as required for tax and accounting purposes</li>
            </ul>
            <p className="text-slate-700">You may request deletion of your account and associated data by contacting us at privacy@localhost.</p>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">6. Your Rights and Choices</h2>
            <p className="text-slate-700 mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">7. Children&apos;s Privacy</h2>
            <p className="text-slate-700">Our service is intended for users who are at least 18 years old or studying for professional certification. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.</p>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">8. International Data Transfers</h2>
            <p className="text-slate-700">Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.</p>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">9. Third-Party Services</h2>
            <p className="text-slate-700">Our app may contain links to third-party websites or integrate with third-party services. We are not responsible for their privacy practices. We encourage you to read their privacy policies.</p>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">10. Changes to This Privacy Policy</h2>
            <p className="text-slate-700">We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the &quot;Last Updated&quot; date. Your continued use of our service after any changes constitutes acceptance of the updated policy.</p>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">11. Contact Us</h2>
            <p className="text-slate-700 mb-4">If you have any questions about this privacy policy or our privacy practices, please contact us:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
              <li><strong>Email:</strong> privacy@localhost</li>
              <li><strong>Address:</strong> Behavior School, LLC</li>
              <li><strong>Website:</strong> <a href="http://localhost:3000" className="text-emerald-600 hover:text-emerald-700">localhost:3000</a></li>
            </ul>
          </section>

          {/* Apple App Store Section */}
          <section className="mb-12 bg-slate-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Apple App Store Specific Disclosures</h2>
            <p className="text-slate-700 mb-4">For users who download our app through the Apple App Store:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>This app collects study progress data to provide personalized learning experiences</li>
              <li>Usage analytics are collected to improve app performance</li>
              <li>No data is shared with third parties except as described in this policy</li>
              <li>You can request data deletion by contacting privacy@localhost</li>
              <li>All data collection complies with Apple&apos;s App Store guidelines</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}



