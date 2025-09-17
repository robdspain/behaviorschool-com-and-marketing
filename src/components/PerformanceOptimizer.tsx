"use client";

import { useEffect } from 'react';

/**
 * Performance optimization component
 * Defers non-critical resources and optimizes loading
 */
export default function PerformanceOptimizer() {
  useEffect(() => {
    // Note: Critical resources are already preloaded by Next.js
    // This component focuses on runtime optimizations

    // Defer non-critical scripts
    const deferNonCriticalScripts = () => {
      // Defer analytics until after user interaction
      const deferAnalytics = () => {
        if (window.gtag) {
          // Analytics is already loaded, no need to defer
          return;
        }
        
        // Load analytics after first user interaction
        const loadAnalytics = () => {
          const script = document.createElement('script');
          script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-Z3XWL488ZP'}`;
          script.async = true;
          document.head.appendChild(script);
        };

        // Load on first user interaction
        ['mousedown', 'touchstart', 'keydown'].forEach(event => {
          document.addEventListener(event, loadAnalytics, { once: true, passive: true });
        });
      };

      deferAnalytics();
    };

    // Optimize images
    const optimizeImages = () => {
      // Add loading="lazy" to images that don't have it
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
      });
    };

    // Run optimizations
    deferNonCriticalScripts();
    optimizeImages();

    // Cleanup function
    return () => {
      // Remove event listeners if component unmounts
      ['mousedown', 'touchstart', 'keydown'].forEach(event => {
        document.removeEventListener(event, () => {});
      });
    };
  }, []);

  return null; // This component doesn't render anything
}
