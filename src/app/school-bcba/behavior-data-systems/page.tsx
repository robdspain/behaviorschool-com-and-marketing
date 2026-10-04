import Link from "next/link";
import type { ReactNode } from "react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { CtaClickTracker, ProgramCtaBlock, SoftProgramCta } from "@/components/content/ProgramCta";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { AbcDataSheetDiagram, MeasureChooserDiagram, ResponsiveTable } from "./diagrams";

const canonical = "https://behaviorschool.com/school-bcba/behavior-data-systems";
const campaign = "behavior-data-systems";
const pageTitle = "ABC Data Sheet: Behavior Data Systems for Schools";
const pageDescription =
  "Build an ABC data system teachers can use: clear definitions, practical sheets, measure selection, staff training, and useful summaries.";
const h1 = "ABC Data Sheets and Behavior Data Systems for Schools";

const proseLink =
  "inline-block min-h-11 rounded-[8px] font-semibold text-[#1f4d3f] underline underline-offset-4 hover:text-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

const faqs = [
  {
    question: "What is ABC data collection?",
    answer:
      "ABC data collection is a descriptive observation method that records the antecedent, behavior, and consequence in time order. It helps a school team describe patterns around a target behavior. It does not prove the behavior\u2019s function by itself (Cooper, Heron, & Heward, 2020, pp. 56 to 57).",
  },
  {
    question: "What should be on an ABC data sheet?",
    answer:
      "Include the student, target behavior definition, observer, date, setting, observation times, and columns for the time, antecedent, behavior, and consequence. Add only fields that help the team answer its decision question.",
  },
  {
    question: "How do you write an antecedent in ABC data?",
    answer:
      "Write the observable event immediately before the behavior, such as \u201cteacher placed the worksheet on the desk and said, \u2018Start problem one.\u2019\u201d Do not write a motive such as \u201cstudent did not want to work.\u201d",
  },
  {
    question: "How many ABC observations should a school team collect?",
    answer:
      "Collect enough observations to compare the relevant settings and answer the team\u2019s decision question. There is no universal count that fits every behavior. Add observations when the sample is too narrow, the behavior is rare, or observers disagree about what happened.",
  },
  {
    question: "Does ABC data identify the function of behavior?",
    answer:
      "No. ABC data can show repeated correlations among events in the observed setting. It does not demonstrate a functional relation by itself. Use it to guide the next assessment step and interpret it with other FBA information (Cooper, Heron, & Heward, 2020, pp. 56 to 57).",
  },
  {
    question: "What is the difference between ABC data and frequency data?",
    answer:
      "ABC data records the context around behavior episodes. Frequency or count data records how many responses occurred. Use ABC data when the team needs context and use count or rate when the team needs the number of discrete responses over a defined observation period (Cooper, Heron, & Heward, 2020, pp. 74 to 75, 78).",
  },
  {
    question: "Should teachers collect ABC data all day?",
    answer:
      "Usually, no. Choose a short observation window tied to a decision and a routine where the behavior is relevant. A focused observation is more practical than asking a teacher to write a long form while teaching.",
  },
  {
    question: "What if staff cannot write during the behavior?",
    answer:
      "Use a brief agreed-upon code, a checkbox, or a simple tally, then complete the sequence as soon as the routine allows. If the event is dangerous, follow safety procedures first.",
  },
  {
    question: "When should a school team use duration, latency, or interval recording?",
    answer:
      "Use duration when time engaged matters, latency when the delay from an opportunity to a response matters, and interval recording when the behavior is ongoing or difficult to count continuously. Choose the measure that matches the behavior dimension and decision (Cooper, Heron, & Heward, 2020, pp. 78 to 81, 88 to 93).",
  },
  {
    question: "What is a scatterplot used for in behavior data collection?",
    answer:
      "A scatterplot shows how behavior is distributed across times, activities, or settings. It can help the team identify where to observe and what routines to compare. It does not establish function by itself (Cooper, Heron, & Heward, 2020, pp. 138 to 140).",
  },
  {
    question: "What should happen after ABC data collection?",
    answer:
      "The team should review the entries, check whether the observations represent relevant contexts, summarize repeated patterns and exceptions, write a cautious working hypothesis, and choose the next assessment or intervention decision. Then document the plan in a behavior intervention plan that staff can implement and measure.",
  },
] as const;

const blankRow = [
  "______",
  "__________________________________",
  "__________________________________",
  "__________________________________",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: h1,
      description: pageDescription,
      url: canonical,
      mainEntityOfPage: canonical,
      datePublished: "2026-10-04",
      dateModified: "2026-10-04",
      image: "https://behaviorschool.com/optimized/og-image.webp",
      author: {
        "@type": "Person",
        name: "Rob Spain",
        jobTitle: "Board Certified Behavior Analyst",
        url: "https://behaviorschool.com/about",
      },
      publisher: {
        "@type": "Organization",
        name: "Behavior School",
        url: "https://behaviorschool.com",
      },
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
          name: "BCBA in schools",
          item: "https://behaviorschool.com/school-bcba",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: h1,
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

export const metadata = buildPageMetadata({
  title: pageTitle,
  description: pageDescription,
  canonical,
  type: "article",
  keywords: [
    "abc data sheet",
    "abc data collection",
    "behavior data collection sheets",
    "behavior data collection",
    "classroom behavior data",
    "school BCBA data systems",
  ],
  imageAlt: h1,
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold leading-snug text-[#171f1d]">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-[#171f1d]">{children}</div>
    </section>
  );
}

function Subhead({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-xl font-semibold leading-snug text-[#171f1d]">{children}</h3>;
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ul>
  );
}

function Steps({ items }: { items: readonly string[] }) {
  return (
    <ol className="list-decimal space-y-2 pl-6">
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  );
}

function renderFaqAnswer(answer: string) {
  const phrase = "a behavior intervention plan that";
  const at = answer.indexOf(phrase);
  if (at === -1) return answer;
  return (
    <>
      {answer.slice(0, at)}
      a{" "}
      <Link href="/behavior-intervention-plan-examples" className={proseLink}>
        behavior intervention plan
      </Link>
      {answer.slice(at + "a behavior intervention plan".length)}
    </>
  );
}

export default function BehaviorDataSystemsPage() {
  return (
    <article className="bg-[#fbfaf6] text-[#171f1d]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CtaClickTracker />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base leading-7">
            <li>
              <Link href="/" className={proseLink}>
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#365548]">
              /
            </li>
            <li>
              <Link href="/school-bcba" className={proseLink}>
                BCBA in schools
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#365548]">
              /
            </li>
            <li aria-current="page" className="font-semibold">
              {h1}
            </li>
          </ol>
        </nav>

        <h1 className="mt-6 text-3xl font-semibold leading-tight text-[#171f1d] sm:text-4xl">{h1}</h1>
        <p className="mt-4 text-base leading-7 text-[#171f1d]">
          An ABC data sheet helps a school team record what happened before a behavior, what the student did, and what happened immediately after. The value is not the form by itself. The value is a shared way to observe, summarize, and decide what to do next.
        </p>
        <p className="mt-4 text-base leading-7 text-[#171f1d]">
          If staff are writing long stories after the event, guessing at motives, or collecting data that nobody uses, make the system smaller and clearer. This guide shows school BCBAs how to build an ABC data collection process that fits a classroom.
        </p>

        <Section title="What ABC data is, and what it is not">
          <p>ABC means antecedent, behavior, and consequence.</p>
          <Bullets
            items={[
              "Antecedent: the observable event or condition immediately before the target behavior.",
              "Behavior: the observable action, written so another person could identify it.",
              "Consequence: what happened immediately after the behavior, including what adults, peers, and the student did next.",
            ]}
          />
          <p>
            ABC recording is a descriptive observation method. It records behavior, antecedent conditions, and consequences in temporal sequence in the natural environment. A well-written record can help a team identify patterns and choose what to examine next (Cooper, Heron, & Heward, 2020, p. 56).
          </p>
          <p>
            ABC data does not prove a behavior function. A pattern such as {"\u201c"}task presented, student leaves, task is removed{"\u201d"} is a useful observation. It is not, by itself, experimental evidence that escape maintains the behavior. Direct observations can be limited or skewed when they occur in only one time, setting, or interaction. Broaden observations and connect them to a full functional behavior assessment before making a strong function claim (Cooper, Heron, & Heward, 2020, pp. 56 to 57).
          </p>
          <p>
            For a broader assessment process, use the{" "}
            <Link href="/functional-behavior-assessment-guide" className={proseLink}>
              functional behavior assessment guide
            </Link>
            .
          </p>
        </Section>

        <SoftProgramCta campaign={campaign} linkLabel="Build the data system">
          <>
            If your ABC sheets produce anecdotes but not decisions, the problem is usually the data system around the form. Build a repeatable system for observation, review, staff support, and next steps in the{" "}
            <a
              href="/transformation-program?utm_source=behaviorschool&utm_medium=seo-page&utm_campaign=behavior-data-systems"
              data-cta="program-soft"
              data-cta-page={campaign}
              className={proseLink}
            >
              School BCBA Systems Transformation Program
            </a>
            .
          </>
        </SoftProgramCta>

        <Section title="How to write an ABC observation">
          <p>
            Start with one operationally defined target behavior. Do not ask staff to record {"\u201c"}defiance,{"\u201d"} {"\u201c"}attitude,{"\u201d"} or {"\u201c"}meltdown{"\u201d"} unless the team has defined exactly what counts. Record what a person could see or hear. A definition should help two observers identify the same event.
          </p>
          <Subhead>Example: turn a vague note into usable data</Subhead>
          <p>Vague note: {"\u201c"}He was upset because he did not want to work.{"\u201d"}</p>
          <p>Usable ABC entry:</p>
          <ResponsiveTable
            caption="Usable ABC observation entry"
            headers={["Time", "Antecedent", "Behavior", "Consequence"]}
            rows={[
              [
                "10:14",
                "Teacher placed a math worksheet on the desk and said, \u201cStart problem one.\u201d",
                "Student pushed the worksheet to the floor, stood up, and walked 2 meters toward the door.",
                "Teacher followed, blocked the doorway, and told the student to return. Student stood near the door for 90 seconds.",
              ],
            ]}
          />
          <p>
            The second entry does not claim what the student wanted. It records the instruction, the observable response, the distance, the adult response, and what happened next. It gives the team something to compare across observations.
          </p>
          <Subhead>What to record in each column</Subhead>
          <p className="font-semibold">Antecedent:</p>
          <Bullets
            items={[
              "Activity, location, and people present when they matter.",
              "The instruction, demand, transition, denied request, peer event, or change in attention immediately before the behavior.",
              "Relevant setting events only when they are known and useful, such as a schedule change or a missed routine. Label them as context, not as the immediate antecedent.",
            ]}
          />
          <p className="font-semibold">Behavior:</p>
          <Bullets
            items={[
              "The exact action, words, movement, or measurable response.",
              "Topography and amount when relevant, such as \u201cthrew three pencils\u201d or \u201csaid \u2018no\u2019 twice.\u201d",
              "The start and end of an episode when duration matters.",
            ]}
          />
          <p className="font-semibold">Consequence:</p>
          <Bullets
            items={[
              "What adults did, what peers did, and what changed in the environment.",
              "Whether work, attention, an item, movement, or another event followed.",
              "What the student did next, without claiming that the consequence reinforced the behavior.",
            ]}
          />
        </Section>

        <Section title="Narrative ABC or checklist ABC?">
          <p>
            Use narrative ABC when the team is still learning what matters, the behavior is unusual, or the event needs context. Write short, objective phrases in time order.
          </p>
          <p>
            Use a structured checklist when the team already knows the common options and needs consistent, fast entries. Include an {"\u201c"}other{"\u201d"} option with a small space for details. A checklist can include common events such as a demand, transition, denied access, peer interaction, free time, adult attention, redirection, break, or task removal. The checklist must match the student, target behavior, and school routine.
          </p>
          <p>
            Do not force every observation into a checklist. If the available options do not describe the event, use narrative detail and revise the sheet during the team review.
          </p>
        </Section>

        <Section title="ABC data sheet visual">
          <AbcDataSheetDiagram />
          <Subhead>Printable sheet text equivalent</Subhead>
          <p>Student: ____________________ Target behavior: ____________________</p>
          <p>Observer: ____________________ Date: __________ Setting: ____________________</p>
          <p>Observation start: __________ Observation end: __________</p>
          <ResponsiveTable
            caption="Printable ABC observation record"
            headers={[
              "Time",
              "A, what happened right before?",
              "B, what did the student do?",
              "C, what happened right after?",
            ]}
            rows={[blankRow, blankRow, blankRow, blankRow]}
          />
          <p>
            Observer reminder: Write what you saw and heard. Use the target behavior definition. Record the adult and peer response. Do not write a motive as if it were an observation.
          </p>
        </Section>

        <Section title="How to take ABC data in a classroom">
          <Steps
            items={[
              "Define the target behavior before the observation. Put the definition at the top of the sheet.",
              "Pick one routine and one decision. For example: \u201cDoes leaving the group happen after a transition, and what support should staff test first?\u201d",
              "Tell the observer what counts as one episode and what to do if the behavior continues.",
              "Use a short observation window that can happen without removing the teacher from instruction.",
              "Record each episode as close to the event as possible. If immediate writing is unsafe or impossible, use a brief agreed-upon code and complete the entry as soon as the routine ends.",
              "Review entries with the observer. Ask, \u201cWhat did you see?\u201d before asking, \u201cWhat do you think it means?\u201d",
              "Compare observations across relevant times, people, activities, and settings before writing a hypothesis.",
            ]}
          />
          <p>
            Direct observation is useful for selecting and describing behavior, but an observation can miss a pattern if the team looks only in one setting or with one person. Plan observations that sample the situations relevant to the referral question (Cooper, Heron, & Heward, 2020, pp. 56 to 57).
          </p>
        </Section>

        <section className="mt-12 rounded-[12px] border border-[#d9cdb8] bg-[#f4efe5] px-5 py-5">
          <h2 className="text-2xl font-semibold leading-snug text-[#171f1d]">A recommended practice from Rob Spain</h2>
          <p className="mt-4 text-base leading-7 text-[#171f1d]">
            It is a good practice to do a brief ABC observation to see whether what you were told matches what actually happens, and to see the precursors for yourself.
          </p>
        </section>

        <Section title="How many observations do you need?">
          <p>
            There is no universal observation count that makes an ABC dataset sufficient. The right amount depends on the decision, the behavior{"\u2019"}s frequency, the safety context, and whether the observations represent the settings where the concern occurs.
          </p>
          <p>Use a decision rule instead of a magic number:</p>
          <Bullets
            items={[
              "Continue observing when entries are too sparse to compare.",
              "Add a setting, person, or routine when the current sample may be masking the behavior.",
              "Stop collecting descriptive rows when the same pattern is repeating and the team has enough information to choose the next assessment step.",
              "Collect additional data when team members disagree about the definition, the sequence, or what happened after the behavior.",
              "For dangerous behavior, follow the school\u2019s safety procedures and do not delay safety action while waiting for a fuller dataset.",
            ]}
          />
          <p>
            Direct and frequent measurement helps practitioners detect change and decide whether to continue, modify, or end an intervention. Measurement starts with identifying the behavior, defining it in observable terms, and choosing an appropriate observation and recording method (Cooper, Heron, & Heward, 2020, pp. 74 to 75).
          </p>
        </Section>

        <Section title="Summarize ABC data into a working hypothesis">
          <p>Do not summarize the sheet by counting every word. Summarize the sequence that matters.</p>
          <Steps
            items={[
              "Group entries by target behavior.",
              "Group antecedents into observable categories that match the actual notes.",
              "Group consequences by what changed after the behavior.",
              "Look for repetition across people, activities, times, and settings.",
              "Check exceptions. A pattern with many exceptions needs a narrower question.",
              "Write a conditional hypothesis that names the context, behavior, and common outcome.",
            ]}
          />
          <p>Example:</p>
          <blockquote className="rounded-[12px] border border-[#d9cdb8] border-l-[3px] border-l-[#1f4d3f] bg-white px-4 py-3">
            When independent written work begins after a transition from a preferred activity, Jordan pushes materials away and leaves the work area. Staff commonly follow Jordan and delay the work. This pattern is consistent with a possible escape-related outcome, but ABC data alone does not establish function.
          </blockquote>
          <p>
            Then ask what data would test or clarify the hypothesis. Move the result into the team{"\u2019"}s{" "}
            <Link href="/fba-to-bip" className={proseLink}>
              FBA to BIP workflow
            </Link>
            , and use the{" "}
            <Link href="/behavior-intervention-plan-examples" className={proseLink}>
              behavior intervention plan examples
            </Link>{" "}
            page when the team is ready to document prevention, teaching, and response procedures.
          </p>
        </Section>

        <Section title="Which behavior measure fits?">
          <p>
            ABC recording describes context around episodes. It is not the best measure for every progress question. Choose the measure that matches the dimension of behavior the team needs to change.
          </p>
          <MeasureChooserDiagram />
          <Subhead>Common school measures</Subhead>
          <ResponsiveTable
            caption="Common school behavior measures"
            headers={["Measure", "Use it when you need to know", "School example", "Watch for"]}
            rows={[
              [
                "Count",
                "How many discrete responses occurred",
                "Number of call-outs during a 20-minute lesson",
                "A count without observation time can mislead; record the observation period.",
              ],
              [
                "Rate",
                "How many responses occurred per unit of time",
                "Hand raises per 10 minutes",
                "Use the same time unit when comparing observations.",
              ],
              [
                "Duration",
                "How long the behavior lasts",
                "Minutes engaged in work refusal or on-task behavior",
                "Define when the episode starts and ends.",
              ],
              [
                "Latency",
                "How long it takes to start after an opportunity or instruction",
                "Seconds from \u201copen your book\u201d to beginning the first problem",
                "Define the opportunity and the response onset.",
              ],
              [
                "Whole-interval recording",
                "Whether behavior occurred for the entire interval",
                "Cooperative play for each 30-second interval",
                "It can underestimate the total time behavior occurred.",
              ],
              [
                "Partial-interval recording",
                "Whether behavior occurred at any point in the interval",
                "Any disruption during each 1-minute interval",
                "It can overestimate total duration and does not show how many responses occurred.",
              ],
              [
                "Momentary time sampling",
                "Whether behavior is occurring at the exact check moment",
                "On-task behavior at the end of each 2-minute check",
                "It can miss behavior between checks.",
              ],
              [
                "Permanent product",
                "Whether a reliable product remains to score later",
                "Number of completed, correct worksheet items",
                "The product must be produced by every target response and by no other response.",
              ],
              [
                "Scatterplot",
                "When behavior is distributed across periods, activities, or locations",
                "Episodes by class period across the week",
                "It shows distribution and possible patterns, not a demonstrated functional relation.",
              ],
            ]}
          />
          <p>
            Count, duration, latency, and time sampling measure different dimensions. Duration is appropriate when the amount of time matters, latency is the elapsed time between a stimulus and a response, and time sampling uses intervals or specific moments to sample behavior (Cooper, Heron, & Heward, 2020, pp. 78 to 81, 88 to 93).
          </p>
          <p>
            Whole-interval recording can underestimate occurrence, partial-interval recording can overestimate total duration, and momentary time sampling can miss behavior between checks. Choose one because it fits the question, not because it is the easiest column to add (Cooper, Heron, & Heward, 2020, pp. 88 to 93).
          </p>
          <p>
            Permanent product is useful only when each target response produces the same product and the product cannot be produced by another response or person. A later score is not automatically a valid measure of what happened during instruction (Cooper, Heron, & Heward, 2020, pp. 93 to 96).
          </p>
          <p>
            Scatterplots display the relative distribution of behavior across time or conditions. They can help a team decide where to observe next, but the pattern is not proof of function (Cooper, Heron, & Heward, 2020, pp. 138 to 140).
          </p>
          <p>
            For IEP goal alignment, use the{" "}
            <Link href="/iep-behavior-goal-examples" className={proseLink}>
              IEP behavior goal examples
            </Link>{" "}
            page. The goal, baseline, data method, and review schedule should describe the same behavior or skill.
          </p>
          <p>
            For the broader role and systems context, visit{" "}
            <Link href="/school-bcba" className={proseLink}>
              BCBA in schools
            </Link>
            .
          </p>
        </Section>

        <Section title="Train staff to collect data without making them behavior analysts">
          <p>Staff training should answer four questions:</p>
          <Steps
            items={[
              "What behavior are we recording?",
              "What does one example and one non-example look like?",
              "What is the fastest accurate way to enter the event?",
              "Who reviews the data, when do they review it, and what decision will follow?",
            ]}
          />
          <p>
            Use behavior skills training when the task matters enough to require consistency: instruction, modeling, rehearsal, and feedback (Cooper, Heron, & Heward, 2020, p. 539). Practice with short classroom examples. Have staff write an entry, compare it with a model, and revise it. Then check a few real entries together and give feedback on the definition, sequence, and level of detail.
          </p>
          <p>
            Use the shortest form that lets staff produce usable observations during the routine they already support. For a full staff implementation system, see the future staff training for school teams page when it is live.
          </p>
          <Subhead>A pre-observation briefing</Subhead>
          <Bullets
            items={[
              "\u201cToday we are watching for this one target behavior: [definition].\u201d",
              "\u201cRecord the event that happened immediately before it.\u201d",
              "\u201cWrite what the student did, not what the student wanted.\u201d",
              "\u201cRecord what adults and peers did next.\u201d",
              "\u201cIf you are unsure, mark the row and bring it to the review. Do not fill the gap with a guess.\u201d",
            ]}
          />
        </Section>

        <Section title="Make behavior data collection doable for teachers">
          <p>Treat teacher time as part of the measurement system. If a teacher cannot use the form while teaching, the form is not ready.</p>
          <Bullets
            items={[
              "Limit each sheet to one decision and a small set of response options.",
              "Put the target behavior definition at the point of recording.",
              "Use checkboxes for repeated categories and a short \u201cother\u201d field.",
              "Keep narrative space for the details that cannot be predicted.",
              "Set a beginning and end to the observation.",
              "Decide who enters data, who summarizes it, and when the team will review it.",
              "Offer large-print, high-contrast, paper, and digital options when staff need them.",
              "Remove fields that do not change a decision.",
            ]}
          />
          <p>
            Review the data with the people who collected it. Ask whether the sheet matched the routine, whether the definition was clear, and what made an entry hard to complete. Change the system when the school team finds a repeated barrier.
          </p>
        </Section>

        <NewsletterSignup />

        <Section title="Frequently asked questions">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-t border-[#d9cdb8] pt-4">
              <h3 className="text-xl font-semibold leading-snug text-[#171f1d]">{faq.question}</h3>
              <p className="mt-2">{renderFaqAnswer(faq.answer)}</p>
            </div>
          ))}
        </Section>

        <ProgramCtaBlock
          campaign={campaign}
          heading="Build a behavior data system your school team can use"
          line="Turn ABC observations into a shared process for choosing measures, training staff, reviewing patterns, and taking the next step."
        />
      </div>
    </article>
  );
}
