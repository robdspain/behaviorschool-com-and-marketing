// src/app/iep-behavior-goals/widget/page.tsx
"use client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function IEPBehaviorGoalsWidgetPage() {
  return (
    <div className="min-h-screen bg-white pt-16 w-full max-w-full overflow-x-hidden">
      {/* Breadcrumbs */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "IEP Goal Writer", href: "/iep-goals" },
            { label: "Free Behavior Goals", href: "/iep-behavior-goals" },
            { label: "Generator" }
          ]}
        />
      </div>

      {/* Widget Section */}
      <section className="w-full">
        <div className="w-full">
          <iframe
            src="https://school-behavior-goals.netlify.app/"
            width="100%"
            height="800px"
            frameBorder="0"
            allowFullScreen
            title="IEP Goal Writer Widget"
            className="w-full"
            style={{ maxWidth: '100%', width: '100%', overflow: 'hidden' }}
          ></iframe>
        </div>
      </section>
    </div>
  );
}
