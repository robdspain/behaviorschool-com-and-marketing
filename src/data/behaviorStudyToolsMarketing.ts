function trackedStudyUrl(path: string, params: Record<string, string>) {
  const search = new URLSearchParams({
    utm_source: "behaviorschool_admin",
    utm_medium: "owned_marketing",
    utm_campaign: "bst_web_growth",
    ...params,
  });
  return `https://study.behaviorschool.com${path}?${search.toString()}`;
}

function trackedLandingUrl(path: string, params: Record<string, string>) {
  const search = new URLSearchParams({
    utm_source: "behaviorschool_admin",
    utm_medium: "owned_marketing",
    utm_campaign: "bst_web_growth",
    ...params,
  });
  return `https://behaviorstudytools.com${path}?${search.toString()}`;
}

export const behaviorStudyToolsMarketing = {
  productName: "Behavior Study Tools",
  primaryMessage:
    "Know what to study next. Start with practice, review exactly why answers were missed, and use results to choose the next task.",
  primaryCta: {
    label: "Start the web app",
    href: trackedStudyUrl("/free-practice/", {
      intent: "readiness-check",
      utm_content: "admin_primary_cta",
    }),
  },
  secondaryCta: {
    label: "Open public landing page",
    href: "https://behaviorstudytools.com",
  },
  fullMockCta: {
    label: "Take a free full mock",
    href: trackedStudyUrl("/free-mock-exam/", {
      intent: "full-mock",
      utm_content: "admin_full_mock_cta",
    }),
  },
  seoPages: [
    {
      title: "Free BCBA Practice Exam",
      href: "https://study.behaviorschool.com/free-practice/",
      intent: "Candidate wants a free starting point.",
      message: "Start with practice, then see what to study next.",
      keyword: "free BCBA practice exam",
    },
    {
      title: "BCBA Mock Exam 6th Edition",
      href: "https://study.behaviorschool.com/free-mock-exam/",
      intent: "Candidate wants exam-aligned full mock practice.",
      message: "Practice with 6th Edition-aligned mocks and domain-level results.",
      keyword: "BCBA mock exam 6th edition",
    },
    {
      title: "BCBA Study App for School BCBAs",
      href: "https://study.behaviorschool.com/free-practice/",
      intent: "School BCBA candidates want a tool that fits their setting.",
      message: "Study with scenarios and reports that make sense for school BCBA practice.",
      keyword: "BCBA study app school BCBAs",
    },
    {
      title: "BehaviorSchool vs ABA Wizard",
      href: "https://behaviorstudytools.com/compare/behaviorschool-vs-aba-wizard",
      intent: "Candidate is comparing study apps.",
      message: "Choose the tool built around readiness, reviewed explanations, and web access.",
      keyword: "ABA Wizard alternative",
    },
    {
      title: "BehaviorSchool vs BDS Modules",
      href: "https://behaviorstudytools.com/compare/behaviorschool-vs-bds-modules",
      intent: "Candidate is comparing structured modules with adaptive practice.",
      message: "Use practice and results to decide what to study next.",
      keyword: "BDS Modules alternative",
    },
  ],
  postPlan: [
    {
      day: "Monday",
      platform: "LinkedIn",
      hook: "Studying more is not the same as studying the right thing.",
      post:
        "A lot of BCBA candidates finish practice questions and still do not know what to do next. Behavior Study Tools is built around that moment: see the missed domain, review the rationale, and choose the next study task.",
      ctaLabel: "Start a readiness check",
      ctaHref: trackedStudyUrl("/free-mock-exam/", {
        intent: "readiness-check",
        utm_content: "monday_linkedin_readiness",
      }),
      asset: "Readiness dashboard screen",
    },
    {
      day: "Tuesday",
      platform: "Instagram Reel",
      hook: "Before your next mock exam, check your weakest domain.",
      post:
        "Show the user opening results, finding the weakest domain, and starting a short practice session. Close with: Do not guess what to study next.",
      ctaLabel: "Try free BCBA practice",
      ctaHref: trackedStudyUrl("/free-practice/", {
        utm_content: "tuesday_instagram_free_practice",
      }),
      asset: "Results screen on phone",
    },
    {
      day: "Wednesday",
      platform: "YouTube Short",
      hook: "The answer matters, but the rationale is where studying happens.",
      post:
        "Walk through one question review. Show why the correct answer is correct and why a distractor is wrong. Connect it to 6th Edition-aligned practice.",
      ctaLabel: "Start practice",
      ctaHref: trackedStudyUrl("/free-practice/", {
        intent: "timed-practice-set",
        utm_content: "wednesday_youtube_timed_practice",
      }),
      asset: "Question review screen",
    },
    {
      day: "Thursday",
      platform: "Email",
      hook: "Are you near ready, or just getting more questions done?",
      post:
        "Send a short email to the BehaviorSchool audience about readiness: domain accuracy, response time, consistency, and mock endurance. Invite them to start in the web app while iOS approval is pending.",
      ctaLabel: "Start the web app",
      ctaHref: trackedStudyUrl("/free-mock-exam/", {
        intent: "readiness-check",
        utm_content: "thursday_email_readiness",
      }),
      asset: "Readiness score screen",
    },
    {
      day: "Friday",
      platform: "TikTok",
      hook: "If your mock score is stuck, stop reviewing everything equally.",
      post:
        "Show a fast before and after: scattered notes, then dashboard with weak domains and a next session. Keep the message simple: study the gap that costs points.",
      ctaLabel: "Find your weak domain",
      ctaHref: trackedStudyUrl("/free-practice/", {
        intent: "weak-domain-check",
        utm_content: "friday_tiktok_weak_domain",
      }),
      asset: "Dashboard and study plan screens",
    },
    {
      day: "Saturday",
      platform: "Facebook",
      hook: "A full mock should tell you what to study next.",
      post:
        "Show how a timed 185-question mock leads into domain results and a focused next study task instead of ending with only a score.",
      ctaLabel: "Take a free full mock",
      ctaHref: trackedStudyUrl("/free-mock-exam/", {
        intent: "full-mock",
        utm_content: "saturday_facebook_full_mock",
      }),
      asset: "Mock exam and domain results screens",
    },
    {
      day: "Sunday",
      platform: "Review",
      hook: "Weekly signal review",
      post:
        "Check Search Console, customer questions, ad comments, and competitor pages. Pick one page headline or CTA to improve before Monday.",
      ctaLabel: "Review SEO pages",
      ctaHref: trackedLandingUrl("/", {
        utm_content: "sunday_review_homepage",
      }),
      asset: "Search Console and page screenshots",
    },
  ],
}

export type BehaviorStudyToolsMarketing = typeof behaviorStudyToolsMarketing
