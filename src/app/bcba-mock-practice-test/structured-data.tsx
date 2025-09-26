"use client";

import { memo } from 'react';

const CourseStructuredData = memo(() => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Free BCBA Mock Practice Test",
        "description": "Boost your confidence and pass the BCBA exam with our free mock practice tests. Simulate the real exam, identify your weaknesses, and get detailed feedback to focus your studies.",
        "url": "https://behaviorschool.com/bcba-mock-practice-test",
        "provider": {
          "@type": "Organization",
          "name": "Behavior School",
          "url": "https://behaviorschool.com"
        },
        "educationalLevel": "Professional",
        "courseMode": "Online",
        "hasCourseInstance": [
          {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "name": "Domain Mini-Exams",
            "description": "Target specific BCBA domains with focused practice sessions",
            "duration": "PT30M"
          },
          {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "name": "Full Mock Exam",
            "description": "Complete 185-question simulation with exact timing",
            "duration": "PT4H"
          },
          {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "name": "Daily Practice Questions",
            "description": "Build consistent study habits with daily question practice",
            "duration": "PT15M"
          }
        ],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "name": "Free BCBA Mock Practice Tests"
        },
        "about": [
          {
            "@type": "Thing",
            "name": "BCBA Certification"
          },
          {
            "@type": "Thing",
            "name": "Behavior Analysis"
          },
          {
            "@type": "Thing",
            "name": "Mock Exams"
          }
        ]
      })
    }}
  />
));

CourseStructuredData.displayName = 'CourseStructuredData';

const FAQStructuredData = memo(() => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How realistic are your mock exams compared to the actual BCBA exam?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our mock exams match the real BCBA exam with exact question distribution (Domain A: 8 questions, Domain G: 35 questions, etc.), 4-hour time limit, multiple choice format with detailed scenarios, computer-based interface simulation, and difficulty calibrated to BCBA exam complexity."
            }
          },
          {
            "@type": "Question",
            "name": "What analytics do I get after completing a mock exam?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our comprehensive analytics include millisecond-precision response time analysis, domain-specific performance breakdown across all 9 BCBA domains, answer pattern tracking showing uncertainty, time management insights with pacing recommendations, weak area identification, and trend analysis showing improvement over multiple sessions."
            }
          },
          {
            "@type": "Question",
            "name": "What's included in the free version?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Free access includes one complete 185-question mock exam with 4-hour timing, domain mini-exams for all domains, 10 daily practice questions with adaptive difficulty, complete analytics with all performance metrics, and detailed explanations for every question. No credit card required."
            }
          },
          {
            "@type": "Question",
            "name": "Will I see the same questions if I retake the mock exam?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, our smart question management system includes question exposure tracking so our AI remembers every question you've seen, adaptive selection choosing new questions based on your performance, a large question bank with thousands of unique questions, and difficulty matching calibrated to your skill level."
            }
          }
        ]
      })
    }}
  />
));

FAQStructuredData.displayName = 'FAQStructuredData';

export { CourseStructuredData, FAQStructuredData };