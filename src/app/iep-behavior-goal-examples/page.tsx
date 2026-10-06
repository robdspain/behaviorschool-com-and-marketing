import type { ReactNode } from "react";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  CtaClickTracker,
  ProgramCtaBlock,
  SoftProgramCta,
} from "@/components/content/ProgramCta";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { GoalAnatomyDiagram } from "./diagrams";

const canonical = "https://behaviorschool.com/iep-behavior-goal-examples";
const campaign = "iep-behavior-goal-examples";
const pageTitle = "IEP Behavior Goal Examples School BCBAs Can Measure";
const pageDescription =
  "Write measurable IEP behavior goals with baseline, condition, criterion, and data examples for on-task, adaptive, self-regulation, and social skills.";

const faqs = [
  {
    question: "Can an IEP only have behavior goals?",
    answer:
      "No single goal format answers every student’s needs. An IEP team selects goals from the student’s documented educational needs and present performance. A student may have behavior goals, academic goals, communication goals, adaptive goals, or a combination. A diagnosis alone does not determine which goal areas belong in the IEP. The team should connect each goal to the student’s educational impact, teachable skill, services, and progress-monitoring plan.",
  },
  {
    question: "Are there IEPs for behavior?",
    answer:
      "Behavior can be addressed in an IEP when the student’s behavior affects educational performance or access to instruction and the team identifies a measurable need. The goal may address a replacement response, communication, task engagement, adaptive routine, social response, or safety skill. A behavior intervention plan can describe prevention, teaching, reinforcement, and response procedures; the IEP goal should state the student performance the team will measure.",
  },
  {
    question: "What are some good behavior goals for students?",
    answer:
      "Good goals are specific to a student and a school routine. They describe an action the student can learn and show, use a baseline that measures the same action, set a meaningful criterion, and identify who will collect which data. Examples include requesting help before leaving a difficult task, beginning work within a defined latency, completing a routine from a task analysis, using a communication response when an item is unavailable, or returning from a break within a defined time.",
  },
  {
    question: "What is an example of a behavioral goal?",
    answer:
      "By [annual review date], when given a nonpreferred independent task and a visual support, [Student] will request help or a break using the taught response before leaving the assigned area in 8 of 10 observed opportunities across 2 consecutive weeks, as measured by opportunity recording by classroom staff. This example is only appropriate if the baseline uses the same opportunity definition and the team has taught the response named in the goal.",
  },
  {
    question: "What are self-regulation strategies for IEP goals?",
    answer:
      "Choose a strategy that is observable and teachable for the student and situation. Options may include requesting help, requesting a break, selecting an alternative, using a visual routine, using a taught breathing or movement routine, identifying a choice from a regulation menu, or returning to a task after a break. The IEP goal should measure the student’s use of the response under defined conditions. It should not require staff to guess whether the student is calm inside.",
  },
  {
    question: "What are good IEP behavior goals for a child with ADHD?",
    answer:
      "Start with the school performance that needs support, not the diagnosis label. Possible targets include beginning work after a direction, using a checklist to complete materials steps, raising a hand before speaking, recording assignments, requesting clarification, or returning attention to the assigned task after a defined cue. Specify the class or routine, the observable response, the baseline, the measurement method, and the criterion.",
  },
] as const;

export const metadata = buildPageMetadata({
  title: pageTitle,
  description: pageDescription,
  canonical,
  type: "article",
  imageAlt: "IEP behavior goal examples for school BCBAs",
  keywords: [
    "iep behavior goals",
    "iep behavior goals examples",
    "adaptive behavior goals iep",
    "on task behavior iep goals",
    "measurable behavior goals",
    "self-regulation IEP goals",
    "replacement behavior goals",
    "behavior goals for students",
  ],
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://behaviorschool.com/about#rob-spain",
      name: "Rob Spain",
      honorificSuffix: ["M.S.", "BCBA", "IBA"],
      jobTitle: "Board Certified Behavior Analyst",
      url: "https://behaviorschool.com/about",
      worksFor: {
        "@type": "Organization",
        name: "Behavior School",
        url: "https://behaviorschool.com",
      },
    },
    {
      "@type": "Article",
      headline: pageTitle,
      description: pageDescription,
      url: canonical,
      datePublished: "2026-10-04",
      dateModified: "2026-10-04",
      author: { "@id": "https://behaviorschool.com/about#rob-spain" },
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
          name: "IEP Behavior Goal Examples",
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

const linkClass =
  "inline-flex min-h-11 items-center font-semibold text-[#1f4d3f] underline underline-offset-4 hover:text-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="mt-12 scroll-mt-24 text-2xl font-semibold leading-snug text-[#171f1d]">
      {children}
    </h2>
  );
}

function Subheading({ children }: { children: string }) {
  return <h3 className="mt-8 text-xl font-semibold leading-snug text-[#171f1d]">{children}</h3>;
}

function Prose({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-base leading-7 text-[#171f1d]">{children}</p>;
}

function GoalQuote({ children }: { children: string }) {
  return (
    <blockquote className="mt-3 rounded-[12px] border border-[#d9cdb8] border-l-4 border-l-[#1f4d3f] bg-white px-4 py-3 text-base leading-7 text-[#171f1d]">
      <p>{children}</p>
    </blockquote>
  );
}

function DataTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-base text-[#171f1d]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-[#d9cdb8] bg-[#f4efe5]">
            {headers.map((header) => (
              <th key={header} scope="col" className="px-3 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-[#d9cdb8] align-top">
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={cell} scope="row" className="px-3 py-3 font-semibold">
                    {cell}
                  </th>
                ) : (
                  <td key={cell} className="px-3 py-3 leading-7">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Page() {
  return (
    <div className="bg-[#fbfaf6] text-[#171f1d]">
      <CtaClickTracker />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-base text-[#365548]">
            <li>
              <Link href="/" className={linkClass}>
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-[#171f1d]" aria-current="page">
              IEP Behavior Goal Examples
            </li>
          </ol>
        </nav>

        <h1 className="mt-6 text-3xl font-semibold leading-tight text-[#171f1d] sm:text-4xl">
          {pageTitle}
        </h1>

        <Prose>
          Behavior goals are easier to write, teach, and review when the whole team can answer four
          questions:
        </Prose>
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7 text-[#171f1d]">
          <li>What will the student do that another person can see or hear?</li>
          <li>When and where will the student do it?</li>
          <li>What does the baseline show right now?</li>
          <li>What exact data will tell the team that the goal is improving?</li>
        </ol>
        <Prose>
          This page gives measurable IEP behavior goal examples for on-task behavior, adaptive
          skills, self-regulation, replacement communication, social behavior, and safety. Treat each
          example as a structure to adapt to the student’s assessment, educational need, and school
          routine. Do not paste a percentage into a goal until the team knows what one opportunity,
          trial, interval, or completed product means.
        </Prose>
        <Prose>
          If you want a guided draft after reviewing the components below, use the{" "}
          <Link href="/iep-behavior-goals" className={linkClass}>
            IEP behavior goal writer
          </Link>
          . Review every draft with the student’s team and replace generic fields with verified
          baseline data.
        </Prose>

        <SoftProgramCta campaign={campaign} linkLabel="Build the school BCBA system">
          If the goal is clear but the team still cannot collect and use the data during the school
          day, the problem is the system around the goal. Build a repeatable system for your whole
          caseload.
        </SoftProgramCta>

        <SectionHeading id="measurable-goal">What makes an IEP behavior goal measurable?</SectionHeading>
        <Prose>
          A measurable goal names an observable response, its conditions, a baseline, a criterion, a
          measurement method, and a time frame. The behavior definition should be clear enough that
          two observers can decide whether an instance occurred. Cooper, Heron, and Heward describe
          explicit definitions as necessary for accurate and ongoing evaluation, and describe a good
          definition as objective, clear, complete, and able to distinguish instances from
          noninstances (Cooper, Heron, &amp; Heward, 2020, pp. 67, 69).
        </Prose>
        <Prose>Use this working sentence:</Prose>
        <GoalQuote>
          By [date], when [condition], [student] will [observable behavior] from [baseline] to
          [criterion] across [measurement window], as measured by [person] using [measure].
        </GoalQuote>

        <Subheading>The five parts to check</Subheading>
        <DataTable
          caption="Five parts of a measurable IEP behavior goal"
          headers={["Part", "What to write", "School example"]}
          rows={[
            [
              "Baseline",
              "The student’s current performance using the same kind of measure planned for the goal",
              "During 10 independent-work opportunities, Jordan began within 2 minutes in 3 of 10 opportunities.",
            ],
            [
              "Condition",
              "The activity, setting, materials, prompt level, or opportunity",
              "Given a written independent math assignment and a visual first-then card",
            ],
            [
              "Behavior",
              "An action that can be seen or heard",
              "Jordan opens the assignment, writes the first answer, or requests help using the taught phrase",
            ],
            [
              "Criterion",
              "The level of performance that counts as progress or mastery",
              "8 of 10 opportunities",
            ],
            [
              "Measurement and time frame",
              "Who records, what they record, and when the criterion must occur",
              "Teacher event recording across 2 consecutive weeks",
            ],
          ]}
        />
        <Prose>
          Do not hide the behavior inside a label. “Will improve self-regulation” does not tell a
          teacher what to score. “Will use a break card, help request, or taught breathing routine
          before leaving the assigned area” gives the team an observable response to teach and
          measure.
        </Prose>
        <GoalAnatomyDiagram />

        <SectionHeading id="how-to-write">How to write a measurable behavior goal</SectionHeading>
        <Subheading>1. Start with educational impact and a specific behavior</Subheading>
        <Prose>
          Begin with what is interfering with access, participation, learning, communication,
          independence, or safety at school. Then describe the action. Replace “noncompliance” with
          the behavior the team actually sees, such as “does not begin the assigned task within 3
          minutes after the direction and one visual prompt.” Replace “aggression” with the defined
          response, such as “hits another person with an open or closed hand.” Include what does not
          count when that distinction matters.
        </Prose>

        <Subheading>2. Collect a baseline that matches the target</Subheading>
        <Prose>
          The baseline and goal must measure the same response or skill in comparable conditions. If
          the baseline counts aggression, a goal about walking to a calming area is a different
          target. The team may decide that walking to the calming area is an important replacement
          behavior, but it needs its own baseline, such as the number of opportunities in which the
          student walks there after the agreed cue.
        </Prose>
        <aside
          className="my-8 rounded-[12px] border border-[#d9cdb8] bg-[#f4efe5] px-5 py-4"
          aria-label="From Rob Spain"
        >
          <p className="text-base font-semibold text-[#171f1d]">From Rob Spain</p>
          <blockquote className="mt-2 text-base leading-7 text-[#171f1d]">
            <p>I reviewed an IEP and a behavior plan and thought, “I’m not sure I can create a data sheet from what you wrote.” The baseline measured aggressive behavior, but the goal was about walking to the calming corner. The baseline did not match the goal, so the team could not build a data sheet that showed whether the goal was improving.</p>
          </blockquote>
        </aside>

        <Subheading>3. Define the action in camera-ready terms</Subheading>
        <Prose>
          Ask: If a new staff member watched this routine, could they score the behavior without
          guessing? A useful definition says what the behavior looks or sounds like and what is
          excluded. Cooper et al. explain that clear definitions support consistent measurement and
          application of an intervention (Cooper, Heron, &amp; Heward, 2020, pp. 67-69).
        </Prose>
        <p className="mt-4 text-base leading-7 text-[#171f1d]">Example:</p>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-base leading-7 text-[#171f1d]">
          <li>Vague: The student will reduce defiance.</li>
          <li>
            Observable: Given a teacher direction to begin an assigned task, the student will place
            the required materials on the desk and begin the first task step within 2 minutes, with
            no more than one verbal prompt.
          </li>
        </ul>

        <Subheading>4. Select a measure that fits the behavior</Subheading>
        <Prose>
          Choose the measure before choosing the number. Cooper et al. distinguish measures of
          occurrence, such as count, rate, and percentage, from measures of temporal dimensions, such
          as duration and latency (Cooper, Heron, &amp; Heward, 2020, pp. 73-80).
        </Prose>
        <DataTable
          caption="Measures that fit different behavior questions"
          headers={["If the team needs to know...", "Consider measuring...", "Example"]}
          rows={[
            [
              "How many times a discrete response occurred",
              "Count or rate",
              "Number of hand raises during a 30-minute discussion",
            ],
            [
              "How long a continuous behavior lasted",
              "Duration",
              "Total minutes engaged in independent work",
            ],
            [
              "How long the student took to start",
              "Latency",
              "Seconds from the direction to the first task response",
            ],
            [
              "How often the response occurred when an opportunity was available",
              "Percentage of opportunities",
              "Help requests in 8 of 10 difficult-task opportunities",
            ],
            [
              "Whether a completed product shows the skill",
              "Permanent product",
              "Number of assigned problems completed using the agreed work routine",
            ],
            [
              "Whether behavior was present during sampled intervals",
              "Time sampling",
              "On-task behavior recorded at scheduled checks during independent work",
            ],
          ]}
        />
        <Prose>
          Use the least burdensome measure that answers the question. If the behavior has a clear
          product, a worksheet, completed routine, or recorded response may allow the teacher to
          teach while the team reviews the product later. Cooper et al. describe permanent-product
          measurement as measuring an environmental change after the behavior has occurred, including
          completed worksheets and written work (Cooper, Heron, &amp; Heward, 2020, pp. 93-94).
        </Prose>

        <Subheading>5. Set a criterion and a time window</Subheading>
        <Prose>
          “In 80% of trials” is incomplete if the team does not know how many trials, over what
          period, and under what conditions. Write the opportunity definition and the review window.
          For example: “in 8 of 10 opportunities across 2 consecutive weeks, with data collected
          during independent math.”
        </Prose>
        <Prose>
          The criterion should be meaningful and connected to the student’s baseline. Do not make the
          annual goal a disguised prompt-following goal if independence is the intended outcome. Put
          temporary prompt levels in short-term objectives when the team is intentionally teaching
          the skill toward independence.
        </Prose>

        <SectionHeading id="examples-by-area">IEP behavior goal examples by area</SectionHeading>
        <Prose>
          These are examples, not ready-to-paste goals. Replace the bracketed information with the
          student’s baseline, context, response definition, and measurement plan.
        </Prose>

        <Subheading>On-task behavior IEP goals</Subheading>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Beginning an assignment</h4>
        <GoalQuote>
          By [annual review date], during independent work, after the teacher gives the direction and
          shows the visual first-then support, [Student] will open the assignment, place the required
          materials on the desk, and complete the first response within 2 minutes in 8 of 10 observed
          opportunities across 2 consecutive weeks, as measured by latency recording by classroom
          staff.
        </GoalQuote>
        <Prose>
          Use this when the measurable problem is delayed task initiation. Define whether opening
          materials, writing, selecting an answer, or another response counts as beginning.
        </Prose>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Sustaining engagement</h4>
        <GoalQuote>
          By [annual review date], during a 20-minute independent work period with the agreed visual
          support, [Student] will remain oriented to the assigned task or use the taught help or
          break request for at least 16 of 20 minutes across 3 consecutive data days, as measured by
          momentary time sampling by special education staff.
        </GoalQuote>
        <Prose>
          Use this when the team can define what on-task behavior looks like in that routine. Do not
          score “paying attention” without describing the observable response.
        </Prose>

        <Subheading>Adaptive behavior goals</Subheading>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Following a classroom routine</h4>
        <GoalQuote>
          By [annual review date], when shown the classroom visual schedule, [Student] will complete
          the four steps of the arrival routine, including entering, placing belongings in the
          assigned location, checking the schedule, and joining the opening activity, with no more
          than one adult prompt in 4 of 5 school days across 3 consecutive weeks, as measured by a
          task-analysis checklist.
        </GoalQuote>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Organization and materials</h4>
        <GoalQuote>
          By [annual review date], at the end of each identified class period, [Student] will use the
          three-step materials routine, check the assignment list, place completed work in the
          assigned location, and bring the required materials to the next activity in 4 of 5 observed
          transitions across 3 consecutive weeks, as measured by a permanent-product checklist
          completed by classroom staff.
        </GoalQuote>

        <Subheading>Self-regulation IEP goals</Subheading>
        <Prose>
          Self-regulation is a useful goal area when the team identifies a school need and writes the
          response the student can show. Avoid making the goal “will feel calm” or “will manage
          emotions.” Measure a taught action in a defined situation.
        </Prose>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Using a taught regulation response</h4>
        <GoalQuote>
          By [annual review date], when presented with a nonpreferred task or a denied request,
          [Student] will use one taught response, such as requesting help, requesting a break,
          selecting an available alternative, or using the agreed regulation routine, before leaving
          the assigned area in 4 of 5 identified opportunities across 3 consecutive weeks, as
          measured by opportunity recording.
        </GoalQuote>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Returning to instruction</h4>
        <GoalQuote>
          By [annual review date], after using an approved break during a difficult task, [Student]
          will return to the assigned area and resume the next task step within 3 minutes in 4 of 5
          opportunities across 2 consecutive weeks, as measured by latency recording.
        </GoalQuote>

        <Subheading>Replacement and functional communication goals</Subheading>
        <Prose>
          A replacement goal should describe a response that serves the student in the same situation
          as the interfering behavior. Teach and measure the response rather than only describing
          what the student should stop doing.
        </Prose>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Requesting help or a break</h4>
        <GoalQuote>
          By [annual review date], when an assigned task is difficult or a needed item is
          unavailable, [Student] will use the taught help or break request, using speech, a device,
          sign, or card as specified by the team, before engaging in [defined interfering behavior]
          in 8 of 10 observed opportunities across 2 consecutive weeks, as measured by opportunity
          recording.
        </GoalQuote>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Accepting an unavailable item or activity</h4>
        <GoalQuote>
          By [annual review date], when a preferred item or activity is unavailable, [Student] will
          select an offered alternative, request a turn, or wait with the agreed visual support for 2
          minutes in 4 of 5 opportunities across 3 consecutive data days, as measured by opportunity
          recording.
        </GoalQuote>

        <Subheading>Social behavior goals</Subheading>
        <Prose>
          Social goals need a setting, partner, response, and opportunity. Avoid goals that require
          an adult to infer a private thought or feeling.
        </Prose>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Joining a peer activity</h4>
        <GoalQuote>
          By [annual review date], during a structured or naturally occurring peer activity,
          [Student] will approach within the agreed distance, use the taught greeting or activity
          request, and remain in the shared activity for at least 5 minutes in 4 of 5 opportunities
          across 3 consecutive weeks, as measured by a social-skills task analysis.
        </GoalQuote>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Responding during group work</h4>
        <GoalQuote>
          By [annual review date], during assigned group work, [Student] will use the agreed response
          to request a turn, ask for clarification, or disagree appropriately at least once in 4 of 5
          observed group activities across 3 consecutive weeks, as measured by event recording.
        </GoalQuote>

        <Subheading>Safety goals</Subheading>
        <Prose>
          Safety goals should use precise definitions and a response that staff can teach, prompt,
          and measure. The team should also document the safety procedure separately from the annual
          goal.
        </Prose>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Staying with the assigned group</h4>
        <GoalQuote>
          By [annual review date], during transitions in the school building, [Student] will remain
          within the identified area and follow the adult’s transition cue until reaching the
          destination in 4 of 5 transitions across 3 consecutive weeks, as measured by a transition
          checklist.
        </GoalQuote>
        <h4 className="mt-6 text-lg font-semibold text-[#171f1d]">Responding to a stop cue</h4>
        <GoalQuote>
          By [annual review date], when an adult gives the agreed stop cue during a school safety
          practice or transition, [Student] will stop movement, orient toward the adult, and wait for
          the next direction within 5 seconds in 4 of 5 opportunities across 3 consecutive data days,
          as measured by latency recording.
        </GoalQuote>

        <SectionHeading id="only-behavior-goals">Can an IEP only have behavior goals?</SectionHeading>
        <Prose>{faqs[0].answer}</Prose>

        <SectionHeading id="ieps-for-behavior">Are there IEPs for behavior?</SectionHeading>
        <Prose>{faqs[1].answer}</Prose>
        <Prose>
          For related planning, see the{" "}
          <Link href="/functional-behavior-assessment-guide" className={linkClass}>
            functional behavior assessment guide
          </Link>
          ,{" "}
          <Link href="/behavior-intervention-plan-examples" className={linkClass}>
            behavior intervention plan examples
          </Link>
          , and{" "}
          <Link href="/school-bcba" className={linkClass}>
            BCBA in schools
          </Link>
          .
        </Prose>

        <SectionHeading id="good-goals">What are some good behavior goals for students?</SectionHeading>
        <Prose>{faqs[2].answer}</Prose>

        <SectionHeading id="behavioral-goal-example">What is an example of a behavioral goal?</SectionHeading>
        <Prose>Here is one example:</Prose>
        <GoalQuote>
          By [annual review date], when given a nonpreferred independent task and a visual support,
          [Student] will request help or a break using the taught response before leaving the
          assigned area in 8 of 10 observed opportunities across 2 consecutive weeks, as measured by
          opportunity recording by classroom staff.
        </GoalQuote>
        <Prose>
          This example is only appropriate if the baseline uses the same opportunity definition and
          the team has taught the response named in the goal.
        </Prose>

        <SectionHeading id="self-regulation">What are self-regulation strategies for IEP goals?</SectionHeading>
        <Prose>{faqs[4].answer}</Prose>

        <SectionHeading id="adhd-goals">What are good IEP behavior goals for a child with ADHD?</SectionHeading>
        <Prose>{faqs[5].answer}</Prose>

        <SectionHeading id="objectives">Short-term objectives and benchmarks</SectionHeading>
        <Prose>
          Short-term objectives should show the teaching path toward the annual goal. Each objective
          needs its own observable response and criterion. Do not create several objectives that
          repeat the annual goal with smaller percentages and no instructional change.
        </Prose>
        <DataTable
          caption="Short-term objective stages"
          headers={["Objective stage", "Example"]}
          rows={[
            [
              "Identify the response",
              "Given a visual choice during a difficult task, [Student] will select help or break in 3 of 5 opportunities.",
            ],
            [
              "Use the response with support",
              "Given a difficult task and one verbal prompt, [Student] will request help or a break before leaving in 4 of 5 opportunities.",
            ],
            [
              "Use the response independently",
              "Given a difficult task, [Student] will request help or a break before leaving in 8 of 10 opportunities across 2 consecutive weeks.",
            ],
            [
              "Generalize",
              "During independent work in two identified classes and with two familiar adults, [Student] will meet the annual criterion across 3 consecutive weeks.",
            ],
          ]}
        />
        <Prose>
          The prompt can appear in an objective when it represents a planned teaching step. If
          independence is the annual outcome, make the annual criterion independent and describe
          prompt fading in the teaching plan.
        </Prose>

        <SectionHeading id="fba-bip">Link the goal to the FBA and BIP</SectionHeading>
        <Prose>
          The FBA should help the team understand when the behavior occurs, what the student is
          communicating or accessing, and which replacement response could work in that context. The
          goal should measure the student skill that the team will teach. The BIP should describe how
          staff will prevent, prompt, reinforce, and respond during implementation.
        </Prose>
        <p className="mt-4 text-base leading-7 text-[#171f1d]">Use this alignment check:</p>
        <DataTable
          caption="Alignment between the FBA or BIP and the goal"
          headers={["FBA or BIP element", "Goal-writing question"]}
          rows={[
            [
              "Setting event and antecedent",
              "In what routine or situation should the response occur?",
            ],
            [
              "Interfering behavior",
              "What is the operational definition, and is it the behavior the team needs to reduce?",
            ],
            [
              "Function or outcome",
              "What response could meet the same need more safely or efficiently?",
            ],
            [
              "Replacement skill",
              "Can the student show the response with the available communication and supports?",
            ],
            [
              "Data plan",
              "Can the assigned staff member collect the selected measure during the routine?",
            ],
            [
              "Decision rule",
              "What pattern will prompt the team to continue, adjust, or reassess?",
            ],
          ]}
        />
        <Prose>
          The goal is not a substitute for the FBA or BIP. It is the measurable student outcome that
          keeps those documents connected.
        </Prose>

        <SectionHeading id="data-collection">Data collection that a classroom team can complete</SectionHeading>
        <Prose>
          Make the data plan small enough to survive instruction. Give the person collecting data a
          one-sentence definition, a clear start and stop point, and a response option that can be
          marked quickly. Decide whether the team needs every opportunity, a planned sample, a
          product review, or a brief latency measure.
        </Prose>
        <p className="mt-4 text-base leading-7 text-[#171f1d]">
          Before publishing the goal, test it with the staff member who will collect the data:
        </p>
        <ol className="mt-2 list-decimal space-y-2 pl-6 text-base leading-7 text-[#171f1d]">
          <li>Read the definition aloud.</li>
          <li>Ask the staff member what counts and what does not count.</li>
          <li>Ask when the observation starts and ends.</li>
          <li>Have the staff member score two examples and one nonexample.</li>
          <li>Check whether the data can be recorded without stopping instruction.</li>
          <li>Decide who will graph, review, and discuss the data.</li>
        </ol>
        <Prose>
          If a goal requires a teacher to record every event during a busy class, consider whether a
          short scheduled observation, a permanent product, a task-analysis checklist, or a defined
          sample answers the question with less burden. A lower-burden measure is useful only if it
          still measures the target skill and is applied consistently.
        </Prose>
        <Prose>
          For now, use the data method named in the goal and keep the operational definition with the
          form.
        </Prose>

        <SectionHeading id="checklist">Quick review checklist</SectionHeading>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-[#171f1d]">
          <li>The goal names an observable response.</li>
          <li>The condition identifies when and where the response should occur.</li>
          <li>The baseline measures the same response or skill.</li>
          <li>The criterion states how well and for how long.</li>
          <li>The measurement method fits the behavior.</li>
          <li>The data collector can complete the plan during the school routine.</li>
          <li>The replacement response is taught, prompted, and reinforced when appropriate.</li>
          <li>The goal connects to the FBA, BIP, services, and educational impact.</li>
          <li>The student and team can tell what progress looks like without guessing.</li>
        </ul>

        <section aria-labelledby="faq-heading" className="mt-12">
          <h2 id="faq-heading" className="text-2xl font-semibold leading-snug text-[#171f1d]">
            Questions teams ask
          </h2>
          <div className="mt-4 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-xl font-semibold leading-snug text-[#171f1d]">{faq.question}</h3>
                <p className="mt-2 text-base leading-7 text-[#171f1d]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <NewsletterSignup />
        <ProgramCtaBlock
          campaign={campaign}
          heading="Build measurable goals into a school BCBA system"
          line="The Transformation Program helps school BCBAs connect goals, data, staff routines, and implementation across the caseload."
        />
      </article>
    </div>
  );
}
