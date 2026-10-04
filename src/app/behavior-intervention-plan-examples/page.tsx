import type { ReactNode } from "react";
import Link from "next/link";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { CtaClickTracker, ProgramCtaBlock, SoftProgramCta } from "@/components/content/ProgramCta";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { BipExamples } from "./examples-section";
import { CompetingBehaviorPathway, FbaToBipFlow } from "./diagrams";
import { BipTemplate } from "./template-section";
import { CAMPAIGN, ContentLink, linkClass } from "./content-link";
import { ProgramTextLink } from "./program-text-link";

const canonical = "https://behaviorschool.com/behavior-intervention-plan-examples";
const title = "Behavior Intervention Plan Examples and Free Template";
const description =
  "Behavior intervention plan examples for school teams: what a BIP is, how to write one, 5 samples by function, a free printable template, fidelity checks.";
const h1 = "Behavior Intervention Plan Examples and Free Template for School Teams";
const published = "2026-10-03";

export const metadata = buildPageMetadata({
  title,
  description,
  canonical,
  type: "article",
});

const faqs: { question: string; answer: string }[] = [
  {
    question: "What does BIP stand for?",
    answer:
      "BIP stands for behavior intervention plan. Some districts and states use other names, such as behavior support plan, so check your district's form.",
  },
  {
    question: "What is the difference between an IEP and a BIP?",
    answer:
      "An IEP is a student's special education program: present levels, goals, services and accommodations. A BIP is a plan for one behavior that gets in the way of learning, built from an FBA. For a child whose behavior impedes learning, the IEP team must consider positive behavioral interventions and supports (34 CFR 300.324(a)(2)(i)). A BIP spells out what adults will change, what the student is taught, and how the team responds.",
  },
  {
    question: "How do I write a good behavior intervention plan?",
    answer:
      "Define the behavior in countable terms, run an FBA, write a one-sentence hypothesis, choose prevention, teaching and response strategies that match the function, write the plan with the people who will run it, train them, and set a data plan and review date. Then check fidelity. The steps are laid out in this page's step-by-step section.",
  },
  {
    question: "How do I fill out a behavior intervention plan?",
    answer:
      "Use the free template on this page and work in order. Fill in the behavior, the FBA summary and the hypothesis first. Write prevention, the replacement behavior, teaching, and the two response plans after that, in words a new staff member could follow. Finish with the data plan, who does what, the fidelity check and the review date.",
  },
  {
    question: "What do behavior intervention plans include?",
    answer:
      "A defined target behavior, what the FBA found about why it happens, prevention, a replacement behavior and how it will be taught, what adults do when the replacement and the problem behavior happen, a data plan, who does what, and a review date. Michigan's state fact sheet lists the problem behavior, why it is happening, and how to replace it as the core (Michigan Department of Education, 2024).",
  },
  {
    question: "What are some examples of behavioral interventions?",
    answer:
      "Examples that match the function include a high-probability request sequence and scheduled breaks for escape-maintained behavior, scheduled attention and differential reinforcement for attention-maintained behavior, and functional communication training such as teaching a student to ask for a turn (Cooper et al., 2020, pp. 615, 616, 619, 621). See the five sample plans on this page.",
  },
  {
    question: "Can you provide an example of a behavior support plan?",
    answer:
      "Yes. The five examples on this page cover escape, attention, tangible and automatic functions. Each lists a target behavior, hypothesis, replacement behavior, prevention, teaching, responses and a data plan. They are composite examples, so adapt them to your own assessment.",
  },
  {
    question: "Can you have a behavior intervention plan without an IEP?",
    answer:
      "Yes. Michigan's state guidance says any child having difficulty with behavior can have a BIP, not only students with IEPs or 504 plans (Michigan Department of Education, 2024). IDEA's specific requirements, including 34 CFR 300.530(f), apply to children with disabilities. For other students, your state and district set the process.",
  },
  {
    question: "Can a BIP be written without an FBA?",
    answer:
      "A team can write one, but it would be guessing at the function. After certain disciplinary changes of placement, IDEA requires the IEP team to conduct an FBA, unless one was done before, and to implement a BIP or review the existing one (34 CFR 300.530(f)(1)). In general, treatment begins with an assessment of the behavior's function (Cooper et al., 2020, p. 583).",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: h1,
      description,
      url: canonical,
      datePublished: published,
      dateModified: published,
      author: {
        "@type": "Person",
        name: "Rob Spain",
        jobTitle: "BCBA",
        url: "https://behaviorschool.com/about",
        affiliation: {
          "@type": "Organization",
          name: "Behavior School",
          url: "https://behaviorschool.com",
        },
      },
      publisher: {
        "@type": "Organization",
        name: "Behavior School",
        url: "https://behaviorschool.com",
      },
      mainEntityOfPage: canonical,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://behaviorschool.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Behavior Intervention Plan Examples",
          item: canonical,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

const printCss = `
@media print {
  body > *:not(#bip-print-holder) { display: none !important; }
  #bip-print-holder { display: block !important; width: 100%; }
  #bip-print-holder table { width: 100% !important; min-width: 0 !important; border-collapse: collapse; }
  #bip-print-holder th, #bip-print-holder td { border: 1px solid #171f1d; }
  #bip-print-holder tr { break-inside: avoid; }
}
`;

const onThisPage = [
  ["What is a BIP", "#what-is-a-bip"],
  ["What a BIP includes", "#what-a-bip-includes"],
  ["BIP vs IEP", "#bip-vs-iep"],
  ["BIP without an IEP", "#bip-without-an-iep"],
  ["How to write a BIP", "#how-to-write-a-bip"],
  ["Examples", "#bip-examples"],
  ["Free template", "#bip-template"],
  ["Common mistakes", "#common-mistakes"],
  ["Check fidelity", "#check-fidelity"],
  ["FAQ", "#faq"],
] as const;

const h2Class = "scroll-mt-8 text-2xl font-semibold leading-snug text-[#171f1d]";
const h3Class = "mt-8 scroll-mt-8 text-xl font-semibold leading-snug text-[#171f1d]";
const pClass = "mt-4 text-base leading-7 text-[#171f1d]";
const thClass = "border border-[#d9cdb8] bg-[#f4efe5] px-3 py-3 text-left align-top font-semibold";
const tdClass = "border border-[#d9cdb8] bg-white px-3 py-3 align-top";

const includeItems: [string, string][] = [
  [
    "Target behavior, defined so two people would count it the same way.",
    " What it looks like and what it does not include. Michigan's fact sheet names the problem behavior as part of the core of a BIP (Michigan Department of Education, 2024).",
  ],
  [
    "What the FBA found.",
    " The hypothesis about function: what the student gets or avoids when the behavior happens (Cooper et al., 2020, p. 626).",
  ],
  [
    "Setting events and triggers.",
    " The conditions that make the behavior more likely, and what usually happens right before it. Cooper and colleagues note that the term setting event describes the same kind of environmental variables they classify as motivating operations (Cooper et al., 2020, p. 373).",
  ],
  ["Prevention.", " What adults change before the behavior starts."],
  [
    "Replacement behavior and teaching.",
    " The skill that gets the student the same result, and when and how it will be taught. Cooper and colleagues describe functional communication training as teaching an alternative response that produces the same reinforcer the problem behavior produced (Cooper et al., 2020, p. 621).",
  ],
  [
    "Response plan.",
    " What each adult does when the replacement behavior happens, and what each adult does when the problem behavior happens.",
  ],
  [
    "Data plan.",
    " What gets counted, by whom, how often, and when the team meets to look at it. The FBA is not finished when the plan starts: function can change and the plan can stop working, so monitoring continues (Cooper et al., 2020, p. 642).",
  ],
  [
    "Who does what, and training.",
    " Names, roles, and how each person learns the plan. Treatment procedures need to be described in enough detail that others can train on them and judge whether they were carried out (Cooper et al., 2020, p. 227).",
  ],
];

function RobStory({ children }: { children: ReactNode }) {
  return (
    <aside className="my-6 rounded-[12px] border-2 border-[#1f4d3f] bg-[#f4efe5] px-5 py-4">
      <p className="text-base font-semibold text-[#171f1d]">From Rob Spain</p>
      <blockquote className="mt-2 text-base leading-7 text-[#171f1d]">{children}</blockquote>
    </aside>
  );
}

export default function Page() {
  return (
    <>
      <CtaClickTracker />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <style dangerouslySetInnerHTML={{ __html: printCss }} />
      <article className="bg-[#fbfaf6] px-4 py-8 text-[#171f1d] sm:px-6">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-3 text-base">
              <li>
                <Link href="/" className={linkClass}>
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#365548]">
                /
              </li>
              <li className="font-semibold" aria-current="page">
                Behavior Intervention Plan Examples
              </li>
            </ol>
          </nav>

          <p className="mt-6 text-base text-[#365548]">
            <time dateTime={published}>Updated October 3, 2026</time>
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{h1}</h1>
          <p className={pClass}>
            A behavior intervention plan (BIP) is a written plan that tells the adults around a student what to
            change, what to teach, and how to respond, based on why the behavior is happening. This page explains
            what goes in one, how to write one with your team, five sample plans organized by function, a free
            template you can print from this page, and how to check that the plan is actually being run.
          </p>

          <nav aria-label="On this page" className="mt-6">
            <p className="text-base font-semibold">On this page</p>
            <ul className="mt-1 flex flex-wrap gap-x-4">
              {onThisPage.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section className="mt-10" aria-labelledby="what-is-a-bip">
            <h2 id="what-is-a-bip" className={h2Class}>
              What is a behavior intervention plan?
            </h2>
            <p className={pClass}>
              A behavior intervention plan is a written, individualized plan built from the results of a
              functional behavior assessment (FBA). The FBA finds what keeps a behavior going. The BIP says what
              the team will do about it: what the problem behavior is, why it is happening, and which behavior
              the student will be taught to use instead (Michigan Department of Education, 2024). The plan teaches
              a replacement behavior that serves the same purpose as the behavior of concern (Michigan Department
              of Education, 2024), and it is designed from what the FBA found about the behavior&apos;s function
              (Cooper et al., 2020, p. 626).
            </p>
            <p className={pClass}>
              <strong>What does BIP stand for?</strong> BIP stands for behavior intervention plan. Some districts
              and states use other names, such as behavior support plan. Check the form your district uses,
              because the legal and paperwork steps follow your district&apos;s procedures.
            </p>
            <p className={pClass}>
              Who writes it: a team. For students with an IEP, the IEP team leads the process and includes
              parents, teachers, support staff and, when appropriate, the student (Michigan Department of
              Education, 2024). A school BCBA may run the assessment and draft the plan, but the plan belongs to
              the people who will carry it out.
            </p>
            <SoftProgramCta campaign={CAMPAIGN} linkLabel="See how the Transformation Program works">
              Plans nobody runs are a systems problem. The Transformation Program builds the system for your
              whole caseload.
            </SoftProgramCta>
          </section>

          <section className="mt-10" aria-labelledby="what-a-bip-includes">
            <h2 id="what-a-bip-includes" className={h2Class}>
              What a behavior intervention plan includes
            </h2>
            <p className={pClass}>
              A usable BIP answers the same eight questions every time. If a section is empty, the person running
              the plan will fill it in with a guess.
            </p>
            <ol className="mt-4 list-decimal space-y-4 pl-6 text-base leading-7">
              {includeItems.map(([lead, rest]) => (
                <li key={lead}>
                  <strong>{lead}</strong>
                  {rest}
                </li>
              ))}
            </ol>
            <h3 className={h3Class}>The competing behavior pathway</h3>
            <p className={pClass}>
              The pathway puts the plan on one page. Read the top row left to right to see why the behavior works
              for the student. Then read the bottom row to see the two behaviors the plan builds: the replacement
              behavior, which earns the same result as the problem behavior, and the desired behavior, which is
              the longer-term goal.
            </p>
            <CompetingBehaviorPathway />
          </section>

          <section className="mt-10" aria-labelledby="bip-vs-iep">
            <h2 id="bip-vs-iep" className={h2Class}>
              BIP vs IEP: what is the difference?
            </h2>
            <p className={pClass}>
              An IEP is the student&apos;s special education program. A BIP is one targeted plan inside or
              alongside it that deals with a specific behavior. The two documents do different jobs:
            </p>
            <div className="my-6 overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-base leading-7 text-[#171f1d]">
                <caption className="sr-only">Difference between an IEP and a BIP</caption>
                <thead>
                  <tr>
                    <th scope="col" className={thClass}>
                      <span className="sr-only">Topic</span>
                    </th>
                    <th scope="col" className={thClass}>
                      IEP
                    </th>
                    <th scope="col" className={thClass}>
                      BIP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className={thClass}>
                      What it is
                    </th>
                    <td className={tdClass}>The written special education program for a student with a disability</td>
                    <td className={tdClass}>A written plan for one behavior that gets in the way of learning</td>
                  </tr>
                  <tr>
                    <th scope="row" className={thClass}>
                      What it covers
                    </th>
                    <td className={tdClass}>Present levels, goals, services, accommodations</td>
                    <td className={tdClass}>
                      The behavior, why it happens, what adults change, what the student is taught, how the team
                      responds
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className={thClass}>
                      Where the law speaks to it
                    </th>
                    <td className={tdClass}>
                      34 CFR 300.324: for a child whose behavior impedes the child&apos;s learning or that of
                      others, the IEP team must consider positive behavioral interventions and supports and other
                      strategies
                    </td>
                    <td className={tdClass}>
                      34 CFR 300.530(f): after certain disciplinary changes of placement, the IEP team conducts an
                      FBA (unless one was done before) and implements a BIP, or reviews and modifies the existing
                      BIP
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className={thClass}>
                      Built from
                    </th>
                    <td className={tdClass}>Evaluation data and the team&apos;s decisions</td>
                    <td className={tdClass}>The FBA</td>
                  </tr>
                  <tr>
                    <th scope="row" className={thClass}>
                      Who can have one
                    </th>
                    <td className={tdClass}>A student found eligible for special education</td>
                    <td className={tdClass}>
                      Any student having difficulty with behavior, according to Michigan&apos;s state guidance
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className={thClass}>
                      Measured with
                    </th>
                    <td className={tdClass}>IEP goals and progress reports</td>
                    <td className={tdClass}>A data plan for the specific behavior and the replacement skill</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={pClass}>
              Sources: 34 CFR 300.324(a)(2)(i) and 300.530(f)(1) (eCFR, current text); Michigan Department of
              Education (2024).
            </p>
            <p className={pClass}>
              If the behavior goals in the IEP and the data in the BIP do not describe the same behavior, the team
              cannot tell whether either one is working. For writing the IEP side, see{" "}
              <ContentLink href="/iep-behavior-goal-examples">IEP behavior goal examples</ContentLink>.
            </p>
          </section>

          <section className="mt-10" aria-labelledby="bip-without-an-iep">
            <h2 id="bip-without-an-iep" className={h2Class}>
              Can you have a behavior intervention plan without an IEP?
            </h2>
            <p className={pClass}>
              Yes. Michigan&apos;s state fact sheet says BIPs are not created only for students with IEPs or 504
              plans, and that any child having difficulty with behavior can have one (Michigan Department of
              Education, 2024). For a student with an IEP or a 504 plan, the team decides whether an FBA and a BIP
              are needed (Michigan Department of Education, 2024).
            </p>
            <p className={pClass}>
              The federal IDEA language applies to children with disabilities. Under 34 CFR 300.324(a)(2)(i), an
              IEP team must consider positive behavioral interventions and supports for a child whose behavior
              impedes learning. Under 34 CFR 300.530(f)(1), when a change of placement follows a code of conduct
              violation that is found to be a manifestation of the disability, the IEP team conducts an FBA
              (unless one was done before) and implements a BIP, or reviews and modifies the existing plan.
            </p>
            <p className={pClass}>
              For a general education student, the rules and forms come from your state and district, not from
              IDEA. Ask your district for its procedure before you promise a family a specific process.
            </p>
          </section>

          <section className="mt-10" aria-labelledby="how-to-write-a-bip">
            <h2 id="how-to-write-a-bip" className={h2Class}>
              How to write a behavior intervention plan, step by step
            </h2>
            <FbaToBipFlow />
            <h3 className={h3Class}>Step 1. Define the behavior.</h3>
            <p className={pClass}>
              Write what it looks like and what it does not include, in words anyone could use to count it.
              &quot;Disruptive&quot; is not countable. &quot;Calls out without raising a hand during teacher
              talk&quot; is.
            </p>
            <h3 className={h3Class}>Step 2. Run the FBA.</h3>
            <p className={pClass}>
              An FBA gathers information about the purposes a behavior serves (Cooper et al., 2020, p. 626). Plan
              on direct observation, not only interviews. The sequence in Cooper&apos;s chapter includes testing
              hypotheses using functional analysis and ends with developing intervention options based on the
              function of the behavior (Cooper et al., 2020, p. 641). Skipping the assessment means choosing
              strategies without knowing the function. Best practice for treating problem behavior begins with an
              assessment to determine the behavior&apos;s function (Cooper et al., 2020, p. 583). For the full
              assessment process, see the{" "}
              <ContentLink href="/functional-behavior-assessment-guide">functional behavior assessment guide</ContentLink>
              . To see how the two kinds of assessment differ, see FBA vs functional analysis in schools.
            </p>
            <h3 className={h3Class}>Step 3. Write the hypothesis.</h3>
            <p className={pClass}>
              Use one sentence: &quot;When [what happens right before], [student] does [behavior], and gets or
              avoids [result].&quot; If you cannot write it from your data, collect more data before you write
              strategies. The tools in behavior data systems cover ABC observations.
            </p>
            <h3 className={h3Class}>Step 4. Choose strategies that match the function.</h3>
            <p className={pClass}>
              Match prevention, teaching and response to the hypothesis. Some common choices do harm when they do
              not match: time-out, in-school or out-of-school suspension, and planned ignoring are contraindicated
              for escape-maintained behavior, and reprimands, discussion or counseling are contraindicated for
              attention-maintained behavior (Cooper et al., 2020, p. 642). If the interview points to a medical
              issue, such as chronic ear infections, other assessments come before a fuller FBA (Cooper et al.,
              2020, p. 642).
            </p>
            <h3 className={h3Class}>Step 5. Write the plan with the people who will run it.</h3>
            <p className={pClass}>
              Come with your draft and your ideas, and ask questions so the team writes it together.
            </p>
            <RobStory>
              No school BCBA ever sits in their office and writes behavior plans by themselves. You write the
              plan with the people who will actually run it. Come with all of your ideas and what you think
              should go in it, then write it together by asking questions. Building the plan with the team is how
              you get buy-in and real implementation, even when most of the ideas were yours. Everyone feels like
              they wrote it, because it&apos;s their plan. They wrote it.
            </RobStory>
            <h3 className={h3Class}>Step 6. Train the people who run it.</h3>
            <p className={pClass}>
              Give each adult the plan, the one-sentence hypothesis so they know why each step is there, a short
              demonstration of the steps, practice with feedback, and a follow-up observation. Handing over a
              document is the weak version. Traditional didactic staff training has generally not proven
              particularly effective, and Parsons, Rollyson, and Reid (2012) describe a behavioral skills
              training approach with on-the-job follow-up. For school staff, see behavior skills training for
              school staff.
            </p>
            <h3 className={h3Class}>Step 7. Set the data plan and the review date.</h3>
            <p className={pClass}>
              Pick one number for the problem behavior and one for the replacement behavior. Write who collects
              it, when, and the date the team will look at it.
            </p>
            <p className={pClass}>
              Want the whole process, from FBA through a plan staff can run?{" "}
              <ProgramTextLink href="/transformation-program">
                Build this as a system for your whole caseload
              </ProgramTextLink>
              .
            </p>
            <p className={pClass}>
              For a deeper walk through the bridge from assessment to plan, see{" "}
              <ContentLink href="/fba-to-bip">FBA to BIP</ContentLink>.
            </p>
          </section>

          <div className="mt-10">
            <BipExamples />
          </div>
          <div className="mt-10">
            <BipTemplate />
          </div>

          <section className="mt-10" aria-labelledby="common-mistakes">
            <h2 id="common-mistakes" className={h2Class}>
              Common mistakes: why some plans never get run
            </h2>
            <p className={pClass}>
              A plan that nobody runs cannot help the student. These are the common ways it goes wrong.
            </p>
            <ul className="mt-4 list-disc space-y-4 pl-6 text-base leading-7">
              <li>
                <strong>The plan is delivered as a document.</strong> In Dodge&apos;s (2026) scenario, one teacher
                gets a fifteen-minute meeting in September, another gets the plan by email, and a third is never
                trained. The student then gets different responses from different adults. Dodge calls five adults
                responding five different ways to the same behavior the part that should worry a team.
              </li>
              <li>
                <strong>The BCBA does not have time or support to train.</strong> A qualitative study of BCBAs who
                work with school staff found they were not given adequate time or resources to train, and that
                they reported a lack of support from administrators (Max &amp; Lambright, 2021).
              </li>
              <li>
                <strong>The plan was written without the people who run it.</strong> Plans that look right on
                paper can be impossible to run when one teacher is dividing attention across a class. Ask the team
                what is realistic before you finalize.
              </li>
              <li>
                <strong>The strategies do not match the function.</strong> Time-out for escape and reprimands for
                attention are on Cooper&apos;s contraindicated list (Cooper et al., 2020, p. 642).
              </li>
              <li>
                <strong>Planned ignoring is used on everything.</strong> Extinction can bring a burst of the
                behavior at first (Cooper et al., 2020, p. 587). Staff who expect the burst can plan for it, and
                staff who do not may give in when it comes.
              </li>
              <li>
                <strong>The plan is long.</strong> All else equal, a simple and brief treatment is applied more
                accurately and consistently than a complex and extended one (Cooper et al., 2020, p. 227).
              </li>
              <li>
                <strong>Nobody checks.</strong> Treatment drift happens when the plan is applied differently than
                it was at the start (Cooper et al., 2020, p. 227).
              </li>
            </ul>
            <RobStory>
              The written behavior plan is not the implemented BIP, but people act as if it is. If I wrote the
              plan, it&apos;s done. It isn&apos;t. The plan is the starting point. It&apos;s the instructions.
              Sometimes in schools we act as if we opened an IKEA box, laid the instructions on the floor, and
              the furniture was built. The people who write the plans often have that reaction: I wrote it, so
              just do it. A written plan handed to staff does not get implemented without training and follow-up.
              &quot;Just do it&quot; never, ever happens.
            </RobStory>
          </section>

          <section className="mt-10" aria-labelledby="check-fidelity">
            <h2 id="check-fidelity" className={h2Class}>
              How to check that a BIP is being run (fidelity)
            </h2>
            <p className={pClass}>
              Treatment integrity is the extent to which a plan is implemented as planned (Cooper et al., 2020, p.
              226). It matters for two reasons. If the plan is not done as written, a team cannot tell whether the
              plan failed or was never really tried. And when the plan is applied inconsistently, the results are
              hard to interpret with confidence (Cooper et al., 2020, p. 226).
            </p>
            <p className={pClass}>A short fidelity routine for a school team:</p>
            <ol className="mt-4 list-decimal space-y-4 pl-6 text-base leading-7">
              <li>
                <strong>Write the steps as a checklist.</strong> Use the fidelity checklist above, one line per
                step.
              </li>
              <li>
                <strong>Observe a short sample.</strong> Watch one block of the time the behavior usually happens,
                and tick each step: done, not done, not needed.
              </li>
              <li>
                <strong>Calculate percent of steps done.</strong> Done divided by done plus not done.
              </li>
              <li>
                <strong>Give feedback right after the observation.</strong> In one study of special education
                teachers, performance feedback increased the integrity of the antecedent components of a behavior
                support plan for 4 of 5 teachers and of the consequence components for all 5 (Codding et al.,
                2005). In another study of 45 elementary students referred for consultation, performance feedback
                was associated with better treatment implementation and child outcomes than weekly follow-up
                interviews or an emphasis on commitment (Noell et al., 2005).
              </li>
              <li>
                <strong>Simplify what staff cannot keep up.</strong> Standardizing the plan and giving
                criterion-based training and practice enhances integrity (Cooper et al., 2020, p. 227).
              </li>
              <li>
                <strong>Read the data and the checklist together.</strong> If fidelity is low, retrain and
                simplify before you rewrite strategies. If fidelity is high and the data do not move, go back to
                the assessment, because the function may have been read wrongly or may have changed (Cooper et
                al., 2020, p. 642).
              </li>
            </ol>
            <p className={pClass}>
              Your data system should hold both numbers. See behavior data systems for ABC data and graphs, and
              behavior skills training for school staff for training.
            </p>
            <p className={pClass}>
              If you are a BCBA in schools carrying this alone on a large caseload, the hard part is the system
              that gets the plan run.{" "}
              <ProgramTextLink href="/transformation-program">Learn about the Transformation Program</ProgramTextLink>
              .
            </p>
            <p className={pClass}>
              For the school BCBA role itself, see <ContentLink href="/school-bcba">BCBA in schools</ContentLink>.
            </p>
          </section>

          <nav aria-label="Related pages" className="mt-8 flex flex-col">
            <ContentLink href="/functional-behavior-assessment-guide">Functional behavior assessment guide</ContentLink>
            <ContentLink href="/fba-to-bip">FBA to BIP</ContentLink>
            <ContentLink href="/iep-behavior-goal-examples">IEP behavior goal examples</ContentLink>
            <ContentLink href="/behavior-tools">Behavior tools</ContentLink>
            <ContentLink href="/behavior-plans">Free BIP generator</ContentLink>
          </nav>

          <NewsletterSignup />

          <section className="mt-10" aria-labelledby="faq">
            <h2 id="faq" className={h2Class}>
              Behavior intervention plan FAQ
            </h2>
            <div className="mt-5 space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-xl font-semibold leading-snug text-[#171f1d]">{faq.question}</h3>
                  <p className="mt-2 text-base leading-7 text-[#171f1d]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <ProgramCtaBlock
            campaign={CAMPAIGN}
            heading="Get plans that staff actually run"
            line="The School BCBA Transformation Program helps you build the system that gets plans run across your caseload."
          />
        </div>
      </article>
    </>
  );
}
