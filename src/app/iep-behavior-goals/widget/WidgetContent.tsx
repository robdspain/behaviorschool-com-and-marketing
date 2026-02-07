"use client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { NewsletterSignup } from "@/components/NewsletterSignup";

// Add custom styles to hide scrollbars completely
const iframeStyles = `
  .widget-iframe::-webkit-scrollbar {
    display: none;
  }
  .widget-iframe {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function WidgetContent() {
  return (
    <div className="min-h-screen bg-bs-background w-full max-w-full overflow-x-hidden">
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: iframeStyles }} />
      {/* Breadcrumbs */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "IEP Goal Writer", href: "/iep-goals" },
            { label: "Free Behavior Goals", href: "/iep-behavior-goals" },
            { label: "Generator" }
          ]}
        />
      </div>

      {/* Widget Section - Removed shadows and scrollbars */}
      <section className="w-full">
        <div className="w-full">
          <iframe
            src="https://school-behavior-goals.netlify.app/"
            width="100%"
            height="800px"
            frameBorder="0"
            allowFullScreen
            title="IEP Behavior Goals Generator - Free Tool"
            className="w-full border-0 shadow-none widget-iframe"
            style={{
              maxWidth: '100%',
              width: '100%',
              overflow: 'hidden',
              boxShadow: 'none',
              border: 'none',
              outline: 'none',
              WebkitBoxShadow: 'none',
              MozBoxShadow: 'none',
              borderRadius: '0',
              background: 'transparent',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none' // IE/Edge
            }}
          />
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-indigo-100">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Want to Save Your Goals & Get Weekly IEP Tips?
            </h3>
            <p className="text-slate-600">
              Join our community and get expert tips, templates, and resources for writing effective IEP goals.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}