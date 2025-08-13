import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Behavior School",
  description:
    "Why Behavior School exists, our story, and how we help school-based behavior professionals create lasting change—without the burnout.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">About Our Behavior School</h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          We help school-based behavior professionals lead with confidence, reduce overwhelm, and create
          lasting change—without burning out.
        </p>
      </header>

      <article className="prose prose-slate max-w-none">
        <p>
          More than 20 years ago, I was a special education teacher who just wanted to help my students learn how to
          read. I was working in a non-public school with students who had significant learning and behavioral
          challenges. One student in particular—who, at the time, wanted to stab me with a pencil—struggled with
          reading so much that he had completely given up. I had no idea how to reach him.
        </p>
        <p>
          Then, a behavior analyst walked into my classroom and told me she knew how to teach him to read. I was
          skeptical. After all, I had been trained in special education—if I didn’t know how, how could she? But I
          watched as she applied principles from behavior analysis, and the results were undeniable. That same student
          went from wanting to attack me to gaining three grade levels in reading within a single year.
        </p>
        <p>
          That moment changed everything for me. Clearly, there was something about the science of learning and
          behavior that I had yet to understand.
        </p>
        <p>
          I went from being a special education teacher to a struggling new behavior analyst, trying to make sense of it
          all. Over time, I evolved into a team leader, developing systems that not only support students but also
          empower school staff to create meaningful, lasting behavior change—without burning out.
        </p>

        <h2>Why We Exist</h2>
        <p>
          If you’re a BCBA working in schools, you’re likely facing some of the same struggles I did:
        </p>
        <ul>
          <li>Managing crisis after crisis without a clear plan</li>
          <li>Trying to get teachers to implement behavior plans (but facing resistance)</li>
          <li>Feeling exhausted, undervalued, and questioning your impact</li>
        </ul>
        <p>
          The truth is, most school-based behavior professionals were never given a reliable, predictable system for
          creating behavior change. That’s why I built this school—to give you the structured, evidence-based framework
          I wish I had when I started.
        </p>
        <p>
          With this system, you’ll not only help your students learn new skills and reduce problem behaviors, but you’ll
          also see a transformation in yourself, your colleagues, and the entire school environment.
        </p>
      </article>

      <section className="mt-12">
        <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Stay in the loop</h3>
          <p className="text-slate-700 mb-4">Subscribe for updates and resources to support your work.</p>
          <div>
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


