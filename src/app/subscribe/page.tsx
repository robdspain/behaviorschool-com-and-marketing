"use client"

import Script from "next/script"

export default function SubscribePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Join the Community</h1>
        <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
          Get exclusive insights, actionable strategies, and the support you need to lead with confidence and create lasting change.
        </p>
        <div style={{ height: "40vmin", minHeight: 360 }} className="max-w-md mx-auto">
          <Script
            src="https://cdn.jsdelivr.net/ghost/signup-form@~0.2/umd/signup-form.min.js"
            async
            data-background-color="#ffffff"
            data-text-color="#000000"
            data-button-color="#dfbf7c"
            data-button-text-color="#FFFFFF"
            data-title="Behavior School"
            data-description="We help overwhelmed BCBAs create structured behavior systems for student success"
            data-icon="https://behaviorschool.com/content/images/size/w192h192/size/w256h256/2025/02/Behavior-School-Logo.png"
            data-site="https://behaviorschool.com/"
            data-locale="en"
          />
        </div>
      </div>
    </div>
  )
}