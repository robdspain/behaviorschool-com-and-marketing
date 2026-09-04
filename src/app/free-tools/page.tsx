import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ClipboardCheck,
  FilePenLine,
  Files,
  ListChecks,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free School Behavior Tools for BCBAs | BehaviorSchool",
  description:
    "Free tools for school BCBAs and behavior teams, including an IEP behavior goal writer, school-based FBA guide, BIP examples, and IEP goal examples.",
  alternates: { canonical: "https://behaviorschool.com/free-tools" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Free School Behavior Tools for BCBAs | BehaviorSchool",
    description:
      "Use free IEP behavior goal, FBA, and behavior intervention planning resources built for school-based teams.",
    url: "https://behaviorschool.com/free-tools",
    type: "website",
    images: [
      {
        url: "/product-suite/iep-goal-writer-live.jpg",
        width: 1280,
        height: 720,
        alt: "BehaviorSchool Goal Writing System interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free School Behavior Tools for BCBAs | BehaviorSchool",
    description:
      "Use free IEP behavior goal, FBA, and behavior intervention planning resources built for school-based teams.",
    images: ["/product-suite/iep-goal-writer-live.jpg"],
  },
};

const libraryResources = [
  {
    title: "IEP Behavior Goal Examples for School Teams",
    description:
      "Review measurable goal examples organized around common behavior-support needs and team decisions.",
    href: "/iep-behavior-goal-examples",
    label: "Examples",
    icon: FilePenLine,
  },
  {
    title: "School-Based Functional Behavior Assessment Guide",
    description:
      "Work through the purpose, information sources, and decision points involved in a school-based FBA.",
    href: "/functional-behavior-assessment-guide",
    label: "Guide",
    icon: ClipboardCheck,
  },
  {
    title: "Behavior Intervention Plan Examples for Schools",
    description:
      "See how assessment information can connect to prevention, teaching, reinforcement, and response planning.",
    href: "/behavior-intervention-plan-examples",
    label: "Examples",
    icon: ListChecks,
  },
] as const;

const taskLinks = [
  {
    title: "Write an IEP behavior goal",
    description: "Build an editable goal draft from student-specific information.",
    href: "#iep-goal-writer",
  },
  {
    title: "Review IEP behavior goal examples",
    description: "Compare goal components before drafting language for a student.",
    href: "/iep-behavior-goal-examples",
  },
  {
    title: "Plan a school-based FBA",
    description: "Review information sources and assessment decision points.",
    href: "/functional-behavior-assessment-guide",
  },
  {
    title: "Connect an FBA to a BIP",
    description: "Review examples of prevention, teaching, reinforcement, and response planning.",
    href: "/behavior-intervention-plan-examples",
  },
] as const;

const frequentlyAskedQuestions = [
  {
    question: "Are these school behavior tools free?",
    answer:
      "Yes. The BehaviorSchool Goal Writing System and the guides and examples on this page can be opened without payment. The goal-writing system does not require an account.",
  },
  {
    question: "Who are these resources designed for?",
    answer:
      "The library is designed for school-based BCBAs, behavior analysts, special educators, school psychologists, and other team members involved in assessment, IEP goal development, and behavior support planning.",
  },
  {
    question: "Does the goal-writing system create a final IEP goal?",
    answer:
      "It creates an editable BehaviorSchool Goal Draft from the information entered. The IEP team remains responsible for reviewing the wording, student-specific appropriateness, measurement plan, and implementation requirements.",
  },
  {
    question: "What types of school behavior resources are included?",
    answer:
      "The current library includes an IEP behavior goal-writing system, IEP behavior goal examples, a school-based functional behavior assessment guide, and behavior intervention plan examples.",
  },
] as const;

const pageUrl = "https://behaviorschool.com/free-tools";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: "Free School Behavior Tools for BCBAs",
    description:
      "A collection of free IEP behavior goal, functional behavior assessment, and behavior intervention planning resources for school-based teams.",
    isPartOf: {
      "@type": "WebSite",
      name: "BehaviorSchool",
      url: "https://behaviorschool.com",
    },
    about: [
      "school-based behavior analysis",
      "IEP behavior goals",
      "functional behavior assessment",
      "behavior intervention plans",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "BehaviorSchool",
        item: "https://behaviorschool.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://behaviorschool.com/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Free Tools and Templates",
        item: pageUrl,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free BehaviorSchool tools and resources",
    numberOfItems: 4,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "BehaviorSchool Goal Writing System",
        url: "https://behaviorschool.com/iep-goals",
      },
      ...libraryResources.map((resource, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: resource.title,
        url: `https://behaviorschool.com${resource.href}`,
      })),
    ],
  },
];

const writerFeatures = [
  "Build from the student's actual baseline",
  "Select the measurement that fits the behavior",
  "Add editable objectives, generalization, and maintenance when needed",
  "Review, edit, copy, or download the generated wording",
] as const;

export default function FreeToolsPage() {
  return (
    <main className="overflow-hidden bg-[#fbfaf6] text-[#171f1d]">
      {structuredData.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}

      <section className="border-b border-white/15 bg-[#0b3528] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-4xl">
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/65">
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/products" className="transition-colors hover:text-white">Products</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-white">Free tools and templates</span>
            </nav>
            <div className="flex items-center gap-3 text-[#f0cc69]">
              <Files aria-hidden="true" size={22} strokeWidth={1.8} />
              <p className="text-xs font-semibold uppercase tracking-[0.22em]">
                BehaviorSchool resource library
              </p>
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              Free school behavior tools and templates for BCBAs.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              Write an IEP behavior goal, review school-based FBA guidance, and connect assessment information to behavior intervention planning. Each resource is designed to support a specific team decision.
            </p>
            <a
              href="#iep-goal-writer"
              className="mt-9 inline-flex min-h-12 items-center gap-3 bg-[#e4b63d] px-5 py-3 font-semibold text-[#14231f] transition-colors hover:bg-[#f0cc69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b3528]"
            >
              Open the featured tool
              <ArrowRight aria-hidden="true" size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-[#1f4d3f]/15 bg-white" aria-label="Library principles">
        <div className="mx-auto grid max-w-7xl divide-y divide-[#1f4d3f]/12 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
          {["Free to open", "Student-specific inputs", "Team review built in"].map((item, index) => (
            <div key={item} className="flex min-h-20 items-center gap-3 py-5 sm:px-6 first:sm:pl-0 last:sm:pr-0">
              <span className="font-mono text-xs text-[#9a7420]">0{index + 1}</span>
              <span className="text-sm font-semibold text-[#1f4d3f]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-[#1f4d3f]/15 bg-[#fbfaf6]" aria-labelledby="find-resource-heading">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7420]">Choose by task</p>
            <h2 id="find-resource-heading" className="mt-3 text-3xl font-semibold leading-tight text-[#14231f] sm:text-4xl">
              Find the school behavior resource you need.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#51645d]">
              Start with the decision in front of your team. The links below lead directly to the relevant tool, guide, or set of examples.
            </p>
          </div>

          <div className="mt-9 grid border-y border-[#1f4d3f]/15 md:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-[#1f4d3f]/15">
            {taskLinks.map((task, index) => (
              <Link
                key={task.title}
                href={task.href}
                className="group flex min-h-52 flex-col border-b border-[#1f4d3f]/15 px-0 py-7 transition-colors hover:bg-white md:px-6 md:[&:nth-child(odd)]:pl-0 lg:border-b-0 lg:first:pl-0 lg:last:pr-0"
              >
                <span className="font-mono text-xs text-[#9a7420]">0{index + 1}</span>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-[#1f4d3f] group-hover:text-[#1f6b50]">
                  {task.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#5c5449]">{task.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f4d3f]">
                  Open resource
                  <ArrowRight aria-hidden="true" size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="iep-goal-writer" className="border-b border-[#1f4d3f]/15 bg-[#edf5f0]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16 lg:px-10 lg:py-24">
          <div>
            <div className="flex items-center gap-3 text-[#1f6b50]">
              <BookOpenCheck aria-hidden="true" size={21} strokeWidth={1.8} />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Available now</p>
            </div>
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              BehaviorSchool Goal Writing System
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#51645d]">
              Build a measurable behavior goal from the baseline, context, supports, and data-collection decisions your team enters.
            </p>
            <ul className="mt-7 grid gap-3">
              {writerFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-[#263b34]">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-[#1f4d3f] text-white">
                    <Check aria-hidden="true" size={13} strokeWidth={2.4} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/iep-goals"
              className="mt-9 inline-flex min-h-12 items-center gap-3 bg-[#1f4d3f] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#123628] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4d3f] focus-visible:ring-offset-2"
            >
              Use the Goal Writing System
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <p className="mt-4 text-sm leading-6 text-[#5c5449]">
              No login is required. Entries stay in the current browser session and are not submitted.
            </p>
          </div>

          <div className="relative pt-6 lg:pt-0">
            <div aria-hidden="true" className="absolute -left-4 top-0 h-24 w-24 border-l border-t border-[#e4b63d] sm:-left-7 sm:-top-2" />
            <div className="relative overflow-hidden border border-[#1f4d3f]/20 bg-white shadow-[0_28px_70px_rgba(20,35,31,0.16)]">
              <div className="flex h-10 items-center justify-between border-b border-[#1f4d3f]/12 bg-[#f4f2ec] px-4">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-[#d56b5c]" />
                  <span className="h-2 w-2 rounded-full bg-[#dab340]" />
                  <span className="h-2 w-2 rounded-full bg-[#4d9b71]" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#51645d]">
                  Current interface
                </span>
              </div>
              <Image
                src="/product-suite/iep-goal-writer-live.jpg"
                alt="Current BehaviorSchool Goal Writing System showing its five-step workflow"
                width={1280}
                height={720}
                priority
                className="aspect-video w-full origin-bottom scale-[1.4] object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white" aria-labelledby="templates-heading">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-6 border-b border-[#1f4d3f]/18 pb-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7420]">
                Templates and examples
              </p>
              <h2 id="templates-heading" className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                Keep the next decision in view.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#51645d] lg:justify-self-end">
              Use these resources to organize team discussion before placing language into a student plan. Adapt every example to the student, setting, and available data.
            </p>
          </div>

          <div className="grid divide-y divide-[#1f4d3f]/15 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {libraryResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className="group flex min-h-72 flex-col py-8 transition-colors hover:bg-[#fbfaf6] lg:px-7 first:lg:pl-0 last:lg:pr-0"
                >
                  <div className="flex items-center justify-between text-[#1f4d3f]">
                    <Icon aria-hidden="true" size={22} strokeWidth={1.7} />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7420]">
                      {resource.label}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold leading-snug group-hover:text-[#1f6b50]">
                    {resource.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#5c5449]">{resource.description}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#1f4d3f]">
                    Open resource
                    <ArrowRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1f4d3f]/15 bg-[#edf5f0]" aria-labelledby="free-tools-faq-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7420]">About the library</p>
            <h2 id="free-tools-faq-heading" className="mt-3 text-3xl font-semibold leading-tight text-[#14231f] sm:text-4xl">
              Free behavior tools for school teams.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#51645d]">
              BehaviorSchool builds practical resources for behavior analysts and educators working in schools. These tools organize information and support team discussion. They do not replace individualized assessment or professional judgment.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1f4d3f] hover:text-[#1f6b50]">
              About BehaviorSchool
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <div className="divide-y divide-[#1f4d3f]/18 border-y border-[#1f4d3f]/18">
            {frequentlyAskedQuestions.map((item) => (
              <article key={item.question} className="py-6">
                <h3 className="text-lg font-semibold leading-snug text-[#1f4d3f]">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-[#51645d]">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1f4d3f]/15 bg-[#f3c84b]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4d3f]">The library will keep growing</p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight text-[#14231f] sm:text-3xl">
              New school-practice tools will appear here as they are ready to use.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex min-h-12 w-fit items-center gap-3 bg-[#173f33] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#245846]"
          >
            View the full suite
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
