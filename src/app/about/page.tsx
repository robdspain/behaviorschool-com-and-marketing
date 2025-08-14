import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ClassroomPilot | Special Education Teacher Software",
  description:
    "Learn how ClassroomPilot helps special education teachers streamline IEP goal tracking, progress monitoring, and data collection—without the overwhelm.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">About ClassroomPilot</h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          We help special education teachers track IEP goals, monitor student progress, and reduce paperwork&mdash;
          so you can focus on what matters most: your students.
        </p>
      </header>

      <article className="prose prose-slate max-w-none">
        <p>
          More than 15 years ago, I was a special education teacher drowning in paperwork. Between IEP meetings, 
          data collection, progress monitoring, and lesson planning, I felt like I was spending more time on 
          documentation than actually teaching my students. Sound familiar?
        </p>
        <p>
          I watched amazing special education teachers burn out because they couldn&rsquo;t keep up with the administrative 
          demands while still providing quality instruction. There had to be a better way to track IEP goals and 
          monitor student progress without sacrificing our sanity or our students&rsquo; success.
        </p>
        <p>
          That&rsquo;s when I realized the problem wasn&rsquo;t the requirements&mdash;it was the tools. Special education teachers 
          needed software designed specifically for our unique challenges: IEP goal tracking, accommodations 
          monitoring, progress data collection, and parent communication.
        </p>
        <p>
          So I built ClassroomPilot&mdash;the special education teacher software I wish I had when I started. Now, 
          thousands of special ed teachers use our platform to streamline their workflow and focus on what they 
          do best: teaching.
        </p>

        <h2>Why ClassroomPilot Exists</h2>
        <p>
          If you&rsquo;re a special education teacher, you&rsquo;re likely facing these same struggles:
        </p>
        <ul>
          <li>Spending hours on IEP data collection instead of teaching</li>
          <li>Juggling multiple spreadsheets for progress monitoring</li>
          <li>Struggling to keep track of student accommodations</li>
          <li>Feeling overwhelmed by IDEA compliance requirements</li>
          <li>Having difficulty communicating progress to parents and administrators</li>
        </ul>
        <p>
          ClassroomPilot solves these problems with specialized tools for IEP goal tracking, progress monitoring, 
          and automated report generation. Our platform is designed by special education professionals, for 
          special education professionals.
        </p>
        <p>
          With ClassroomPilot, you&rsquo;ll spend less time on paperwork and more time doing what you love&mdash;helping 
          your students reach their full potential.
        </p>

        <h2>Built for Special Education</h2>
        <p>
          Unlike generic education software, ClassroomPilot is purpose-built for special education needs:
        </p>
        <ul>
          <li><strong>IEP Goal Tracking:</strong> Import goals, track progress, and generate reports automatically</li>
          <li><strong>Progress Monitoring:</strong> Visual dashboards and data collection tools designed for special ed</li>
          <li><strong>IDEA Compliance:</strong> Built-in compliance checks and documentation</li>
          <li><strong>Parent Communication:</strong> Automated updates and easy-to-understand progress reports</li>
          <li><strong>Accommodations Tracking:</strong> Never miss an accommodation with our reminder system</li>
        </ul>
      </article>

      <section className="mt-12">
        <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to simplify your special education workflow?</h3>
          <p className="text-slate-700 mb-4">Start your free trial and see how ClassroomPilot can transform your IEP data collection and progress monitoring.</p>
          <div>
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


