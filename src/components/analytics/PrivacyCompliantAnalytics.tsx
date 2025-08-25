"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface AnalyticsProps {
  gaId?: string;
}

export function PrivacyCompliantAnalytics({ gaId }: AnalyticsProps) {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const storedConsent = localStorage.getItem("analytics-consent");
    if (storedConsent) {
      setConsent(storedConsent === "true");
    } else {
      // Show banner after a short delay to not interrupt initial page load
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAnalytics = () => {
    setConsent(true);
    setShowBanner(false);
    localStorage.setItem("analytics-consent", "true");
    
    // Initialize GA with privacy settings
    if (gaId && typeof window !== "undefined") {
      window.gtag?.("config", gaId, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
    }
  };

  const declineAnalytics = () => {
    setConsent(false);
    setShowBanner(false);
    localStorage.setItem("analytics-consent", "false");
    
    // Disable analytics
    if (typeof window !== "undefined") {
      (window as Record<string, unknown>)["ga-disable-" + gaId] = true;
    }
  };

  return (
    <>
      {/* Only load GA if consent is given */}
      {consent && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false,
                  cookie_flags: 'SameSite=Strict;Secure'
                });
              `,
            }}
          />
        </>
      )}

      {/* Privacy-compliant consent banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-lg z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm">
                We use privacy-focused analytics to improve your experience. No personal data is collected or shared.
                <a 
                  href="/privacy" 
                  className="text-emerald-400 hover:text-emerald-300 underline ml-1"
                  target="_blank"
                  rel="noopener"
                >
                  Learn more
                </a>
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={declineAnalytics}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-slate-600 rounded hover:border-slate-500 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={acceptAnalytics}
                className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}