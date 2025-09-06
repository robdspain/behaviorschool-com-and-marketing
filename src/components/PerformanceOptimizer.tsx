"use client";

import { useEffect } from 'react';

/**
 * Performance optimization component
 * Defers non-critical resources and optimizes loading
 */
export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.as = 'style';
      document.head.appendChild(fontLink);

      // Preload critical images
      const criticalImages = [
        '/og-image.webp',
        '/optimized/Logos/logo-gold-transparent.webp'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    };

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
    preloadCriticalResources();
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
