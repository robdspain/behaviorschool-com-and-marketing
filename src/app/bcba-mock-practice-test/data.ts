import { Target, Brain, BarChart3, TrendingUp, Shield } from "lucide-react";

export const mockTestFeatures = [
  {
    title: "Realistic Exam Practice",
    description: "Practice with exam-style questions and timing based on the official BCBA exam structure outlined in the BCBA Handbook.",
    icon: Target,
    highlight: "4-hour timed sessions"
  },
  {
    title: "Instant Detailed Feedback",
    description: "Get immediate explanations for every question, including why answers are correct or incorrect.",
    icon: Brain,
    highlight: "Learn from every question"
  },
  {
    title: "Comprehensive Analytics",
    description: "Track your performance across all content areas and identify exactly where to focus your studies.",
    icon: BarChart3,
    highlight: "Data-driven insights"
  },
  {
    title: "Adaptive Difficulty",
    description: "Questions adjust to your skill level, ensuring you're always challenged at the right level.",
    icon: TrendingUp,
    highlight: "Personalized experience"
  }
];

export const testBenefits = [
  {
    category: "Confidence Building",
    benefits: [
      "Reduce test anxiety through familiarity",
      "Practice time management strategies",
      "Build stamina for 4-hour exam sessions",
      "Experience realistic testing conditions"
    ],
    icon: Shield,
    color: "from-blue-500 to-blue-600"
  },
  {
    category: "Knowledge Assessment",
    benefits: [
      "Identify knowledge gaps early",
      "Focus study time on weak areas",
      "Track improvement over time",
      "Validate your readiness level"
    ],
    icon: Brain,
    color: "from-emerald-500 to-emerald-600"
  },
  {
    category: "Strategic Preparation",
    benefits: [
      "Learn question patterns and formats",
      "Practice elimination techniques",
      "Develop test-taking strategies",
      "Master time allocation skills"
    ],
    icon: Target,
    color: "from-purple-500 to-purple-600"
  }
];

export const practiceOptions = [
  {
    title: "Domain Mini-Exams",
    description: "Target specific BCBA domains with focused practice sessions. Each domain contains the exact number of questions as the real exam.",
    duration: "15-45 minutes",
    questions: "8-35 questions",
    ideal: "Focused practice",
    ctaText: "Start Domain Practice",
    ctaUrl: "https://study.behaviorschool.com/free-practice",
    popular: false,
    features: ["Domain A: 8 questions", "Domain G: 35 questions", "All 9 domains available", "Free with detailed analytics"]
  },
  {
    title: "Full Mock Exam",
    description: "Complete 185-question simulation with exact timing and question distribution matching the real BCBA exam.",
    duration: "4 hours",
    questions: "185 questions",
    ideal: "Complete assessment",
    ctaText: "Take Full Mock Exam",
    ctaUrl: "https://study.behaviorschool.com/free-practice",
    popular: true,
    features: ["One free complete exam", "Exact BACB question distribution", "Comprehensive performance analytics", "Detailed explanations included"]
  },
  {
    title: "Daily Practice Questions",
    description: "Build consistent study habits with daily question practice. Choose your domains and track your progress over time.",
    duration: "Flexible",
    questions: "10 questions daily (free)",
    ideal: "Daily habit building",
    ctaText: "Start Daily Practice",
    ctaUrl: "https://study.behaviorschool.com/free-practice",
    popular: false,
    features: ["10 free questions per day", "Choose specific domains", "Adaptive difficulty", "Progress tracking included"]
  }
];