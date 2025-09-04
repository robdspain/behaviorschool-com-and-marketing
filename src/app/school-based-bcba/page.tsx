import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, BookOpen, Target, Award, ArrowRight, DollarSign, Briefcase, Clock, ThumbsUp, ThumbsDown } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Become a School-Based BCBA: A Complete Guide",
  description: "Learn how to become a school-based BCBA with our complete guide. Find out about the responsibilities, requirements, salary, and career outlook for school-based behavior analysts.",
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
    "how to become a school bcba",
    "school based bcba",
    "bcba in schools",
    "behavior analyst education",
    "school behavior support",
    "bcba training",
    "educational behavior analysis",
    "school bcba salary",
    "school bcba job description"
  ],
  openGraph: {
    title: "How to Become a School-Based BCBA: A Complete Guide",
    description: "Learn how to become a school-based BCBA with our complete guide. Find out about the responsibilities, requirements, salary, and career outlook for school-based behavior analysts.",
    url: "https://behaviorschool.com/school-based-bcba",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "How to Become a School-Based BCBA",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Become a School-Based BCBA: A Complete Guide",
    description: "Learn how to become a school-based BCBA with our complete guide. Find out about the responsibilities, requirements, salary, and career outlook for school-based behavior analysts.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function SchoolBasedBCBAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "How to Become a School-Based BCBA" }
          ]}
        />
        
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              How to Become a School-Based BCBA: A Complete Guide
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              A comprehensive guide for aspiring behavior analysts who want to make a difference in the lives of students.
            </p>
          </div>

          {/* What is a School-Based BCBA? */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              What is a School-Based BCBA?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              A school-based Board Certified Behavior Analyst (BCBA) is a certified behavior analyst who works within a school system to help students with behavioral challenges succeed academically, socially, and emotionally. Unlike clinical settings, school-based BCBAs work with a wide range of students, from those with severe disabilities to those in general education who need extra support. They are experts in behavior analysis and use their skills to create positive learning environments for all students.
            </p>
          </div>

          {/* What Does a School-Based BCBA Do? */}
          <div className="py-12 bg-white rounded-lg shadow-sm border">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              What Does a School-Based BCBA Do?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Responsibilities</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Conducting Functional Behavior Assessments (FBAs) to identify the reasons for challenging behaviors.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Developing and implementing Behavior Intervention Plans (BIPs) to teach new skills and reduce problem behaviors.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Training and supporting teachers, paraprofessionals, and other school staff on how to implement behavior plans and use evidence-based practices.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Collecting and analyzing data to monitor student progress and make data-driven decisions.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Collaborating with teachers, parents, and other professionals to create a team-based approach to student support.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Participating in Individualized Education Program (IEP) meetings and helping to develop behavior-related goals.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">A Day in the Life</h3>
                <p className="text-slate-600 mb-4">
                  A typical day for a school-based BCBA is varied and dynamic. It might start with observing a student in a classroom, followed by a meeting with a teacher to discuss a behavior plan. In the afternoon, you might lead a training for paraprofessionals on data collection, and then end the day analyzing data and writing reports. No two days are the same, which makes the job both challenging and exciting.
                </p>
              </div>
            </div>
          </div>

          {/* How to Become a School-Based BCBA */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              How to Become a School-Based BCBA
            </h2>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">1</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Earn a Master's Degree</h3>
                  <p className="text-slate-600 mt-2">The first step is to earn a master's degree from an accredited university in a relevant field, such as psychology, education, or applied behavior analysis.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">2</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Complete a Verified Course Sequence (VCS)</h3>
                  <p className="text-slate-600 mt-2">You must complete graduate-level coursework in specific areas of behavior analysis. Many master's programs include a VCS, but if yours doesn't, you can complete the coursework through a post-graduate certificate program.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">3</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Complete Supervised Fieldwork</h3>
                  <p className="text-slate-600 mt-2">You need to complete 2,000 hours of supervised fieldwork under the supervision of a qualified BCBA. This is where you'll get hands-on experience applying the principles of behavior analysis in a real-world setting.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">4</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Pass the BCBA Examination</h3>
                  <p className="text-slate-600 mt-2">After completing your degree, coursework, and fieldwork, you must pass the BCBA certification exam. This is a challenging exam that tests your knowledge of the entire BCBA task list.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">5</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Meet State-Specific Requirements</h3>
                  <p className="text-slate-600 mt-2">In addition to BCBA certification, many states and school districts have their own requirements, such as state licensure or a teaching certificate. Be sure to check the requirements in the state where you want to work.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Salary and Career Outlook */}
          <div className="py-12 bg-white rounded-lg shadow-sm border">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Salary and Career Outlook
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Average Salary</h3>
                <p className="text-4xl font-bold text-green-600 mb-4">$89,075 / year</p>
                <p className="text-slate-600">The average salary for a school-based BCBA in the United States is approximately $89,075 per year. However, salaries can range from $47,500 to $149,000 depending on location, experience, and other factors.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Career Growth</h3>
                <p className="text-slate-600">The demand for BCBAs is growing rapidly, especially in school settings. As schools increasingly recognize the value of behavior analysis, the need for qualified school-based BCBAs will continue to grow. This is a career with excellent job security and opportunities for advancement.</p>
              </div>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Pros and Cons of Being a School-Based BCBA
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center"><ThumbsUp className="h-6 w-6 text-green-500 mr-2" /> Pros</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Making a real difference in the lives of students.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>A dynamic and challenging work environment.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Opportunities for collaboration with other professionals.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>A consistent schedule that often aligns with the school year.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center"><ThumbsDown className="h-6 w-6 text-red-500 mr-2" /> Cons</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Navigating complex school systems and bureaucracy.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <span>A heavy workload and high levels of stress.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Dealing with challenging behaviors and crisis situations.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Potentially lower salaries than in some clinical settings.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How Behavior School Can Help */}
          <div className="py-12 text-center bg-blue-600 rounded-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Behavior School provides the training, tools, and support you need to become a successful school-based BCBA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/transformation-program">
                  <Award className="mr-2 h-5 w-5" />
                  Explore Our Training Programs
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/behavior-study-tools">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Prepare for the BCBA Exam
                </Link>
              </Button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Do I need a teaching certificate to be a school-based BCBA?</h3>
                <p className="text-slate-600">It depends on the state and school district. Some require a teaching certificate, while others do not. It's important to check the specific requirements for the job you are applying for.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I complete my supervised fieldwork in a school setting?</h3>
                <p className="text-slate-600">Yes, and it's highly recommended! Gaining experience in a school setting during your fieldwork will give you a significant advantage when you start your career.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">What is the difference between a school-based BCBA and a clinical BCBA?</h3>
                <p className="text-slate-600">The main difference is the setting. School-based BCBAs work in schools and collaborate with educators, while clinical BCBAs typically work in clinics or homes and focus on providing direct therapy to clients.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
