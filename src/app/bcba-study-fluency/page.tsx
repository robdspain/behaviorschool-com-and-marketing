import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Target, Clock, TrendingUp, BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "BCBA Study Fluency: The Secret to Passing the BCBA Exam",
  description: "Discover how fluency-based learning can help you pass the BCBA exam. Learn about the benefits of fluency, how to use it in your studies, and how our tools can help you succeed.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    "bcba study fluency practice test",
    "bcba fluency practice",
    "bcba exam prep",
    "behavior analyst study",
    "bcba practice questions",
    "fluency based learning",
    "precision teaching",
    "safmeds"
  ],
  openGraph: {
    title: "BCBA Study Fluency: The Secret to Passing the BCBA Exam",
    description: "Discover how fluency-based learning can help you pass the BCBA exam. Learn about the benefits of fluency, how to use it in your studies, and how our tools can help you succeed.",
    url: "https://behaviorschool.com/bcba-study-fluency",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Study Fluency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Study Fluency: The Secret to Passing the BCBA Exam",
    description: "Discover how fluency-based learning can help you pass the BCBA exam. Learn about the benefits of fluency, how to use it in your studies, and how our tools can help you succeed.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function BCBAStudyFluencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "BCBA Study Fluency" }
          ]}
        />
        
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              The Fluency Factor: The Missing Piece in Your BCBA Exam Prep
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              The BCBA exam is tough, and many students struggle despite knowing the material. Fluency is the key to not just knowing the material, but mastering it. It's the difference between hesitation and confidence, between passing and excelling.
            </p>
          </div>

          {/* What is Fluency-Based Learning? */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              What is Fluency-Based Learning and Why Does It Matter for the BCBA Exam?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Fluency is more than just getting the right answer. It's about getting the right answer quickly, confidently, and without hesitation. In the context of the BCBA exam, fluency means that your knowledge is so automatic that you can recall it instantly, even under the pressure of a timed exam. This frees up your cognitive resources to focus on what really matters: analyzing the question and choosing the best answer.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Zap className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Speed</h3>
                <p className="text-slate-600">Answer questions quickly and efficiently, leaving more time for complex scenarios.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Accuracy</h3>
                <p className="text-slate-600">Maintain precision and correctness, even when answering at a rapid pace.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <TrendingUp className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Automaticity</h3>
                <p className="text-slate-600">Recall information effortlessly, freeing up your brain to focus on critical thinking.</p>
              </div>
            </div>
          </div>

          {/* The Science Behind Fluency */}
          <div className="py-12 bg-white rounded-lg shadow-sm border">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              The Science Behind Fluency: Precision Teaching and SAFMEDS
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Fluency-based learning is not just a study hack; it's a science-based methodology rooted in the principles of behavior analysis. Precision Teaching, developed by Ogden Lindsley, is a system for mastering skills by focusing on frequency—the number of correct responses in a given time. One of the most effective tools in Precision Teaching is SAFMEDS (Say All Fast Minute Every Day Shuffled), a flashcard-based system designed to build fluency.
            </p>
          </div>

          {/* How to Use Fluency-Based Learning */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              How to Use Fluency-Based Learning in Your BCBA Exam Studies
            </h2>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl">1</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Create Your Study Materials (SAFMEDS)</h3>
                  <p className="text-slate-600 mt-2">Create flashcards for key terms, concepts, and principles from the BCBA task list. Each card should have a term on one side and a concise definition on the other.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl">2</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Set Your Fluency Goals</h3>
                  <p className="text-slate-600 mt-2">Aim for a high rate of correct responses with few to no errors. A common goal is 14-20 cards per minute. Start with a lower goal and gradually increase it as you become more fluent.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl">3</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Practice, Practice, Practice</h3>
                  <p className="text-slate-600 mt-2">Set a timer for one minute and go through your flashcards as quickly as you can, saying the answer out loud. Separate the cards you get right from the ones you get wrong.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl">4</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Chart Your Progress</h3>
                  <p className="text-slate-600 mt-2">At the end of each one-minute timing, count the number of correct and incorrect responses and plot them on a chart. This will give you a visual representation of your progress over time.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl">5</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Make Data-Driven Decisions</h3>
                  <p className="text-slate-600 mt-2">Use your chart to identify areas where you are struggling and adjust your study plan accordingly. If you are not making progress, you may need to break down the concepts into smaller parts or try a different study method.</p>
                </div>
              </div>
            </div>
          </div>

          {/* The Benefits of Fluency-Based Learning */}
          <div className="py-12 bg-white rounded-lg shadow-sm border">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              The Benefits of Fluency-Based Learning for the BCBA Exam (and Beyond)
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Improved Comprehension</h3>
                <p className="text-slate-600">When you can recall information quickly and accurately, you can focus on understanding the deeper meaning of the concepts and how they apply to real-world situations.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Reduced Anxiety</h3>
                <p className="text-slate-600">Fluency builds confidence. When you know you can answer questions quickly and accurately, you'll feel less anxious on exam day and be able to perform at your best.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Better Retention</h3>
                <p className="text-slate-600">Fluency-based learning creates stronger neural pathways, which leads to better long-term retention. You'll remember the material long after the exam is over.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Enhanced Application</h3>
                <p className="text-slate-600">As a BCBA, you'll need to make quick, data-driven decisions in the moment. Fluency practice prepares you for the fast-paced nature of the job.</p>
              </div>
            </div>
          </div>

          {/* How Behavior School Can Help */}
          <div className="py-12 text-center bg-emerald-600 rounded-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Take Your BCBA Exam Prep to the Next Level?</h2>
            <p className="text-xl mb-8 opacity-90">
              Behavior School's fluency practice tools automate the process of fluency-based learning, so you can focus on what matters most: mastering the material.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="https://study.behaviorschool.com/product-tour">
                <Zap className="mr-2 h-5 w-5" />
                Take a Tour of Our Fluency Practice Tools
              </Link>
            </Button>
          </div>

          {/* FAQ Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Is fluency really that important for the BCBA exam?</h3>
                <p className="text-slate-600">Yes! The BCBA exam is a timed test with complex questions. Fluency allows you to answer questions quickly and accurately, which gives you more time to focus on the more challenging questions.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">How is fluency different from memorization?</h3>
                <p className="text-slate-600">Memorization is about recalling information. Fluency is about recalling information quickly, accurately, and without hesitation. It's the difference between knowing something and owning it.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I use fluency-based learning for other subjects?</h3>
                <p className="text-slate-600">Absolutely! Fluency-based learning can be used to master any subject that requires the rapid recall of information, from math facts to foreign language vocabulary.</p>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="py-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Go Beyond Memorization and Achieve True Mastery</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Don't just study for the BCBA exam; train for it. By incorporating fluency-based learning into your study routine, you'll not only be better prepared to pass the exam, but you'll also be a more effective and confident behavior analyst.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
