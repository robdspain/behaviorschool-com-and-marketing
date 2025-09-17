// src/app/iep-behavior-goals/widget/page.tsx
"use client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function IEPBehaviorGoalsWidgetPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-3 sm:p-4">
            <iframe
              src="https://school-behavior-goals.netlify.app/"
              width="100%"
              height="800px" // Increased height for better visibility
              frameBorder="0"
              allowFullScreen
              title="IEP Goal Writer Widget"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
