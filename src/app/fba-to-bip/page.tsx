import type { ReactNode } from "react";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  CtaClickTracker,
  ProgramCtaBlock,
  SoftProgramCta,
} from "@/components/content/ProgramCta";
import {
  CompetingBehaviorPathwayDiagram,
  FbaToBipFlowDiagram,
} from "./diagrams";

const pageUrl = "https://behaviorschool.com/fba-to-bip";
const pageTitle = "FBA to BIP: A Step by Step Workflow for School BCBAs";
const pageDescription =
  "Turn FBA findings into a function-based BIP with hypothesis examples, competing behavior pathways, team roles, and data review steps.";

const campaign = "fba-to-bip";

const linkClass =
  "inline-flex min-h-11 items-center rounded-[8px] px-1 font-semibold text-[#1f4d3f] underline underline-offset-4 hover:text-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

const faqs = [
  {
    question: "Can a BIP be created without an FBA?",
    answer:
      "An interim support can be used while the team gathers information, but a durable function-based BIP should be informed by an FBA or another defensible assessment process. The assessment connects the behavior to the conditions and outcomes the plan needs to change (Cooper, Heron, & Heward, 2020, pp. 628-632).",
  },
  {
    question: "Which should be done first, an FBA or a BIP?",
    answer:
      "Start the FBA before the full BIP. Use immediate safety and access supports when necessary, label them as interim, and continue assessment so the complete plan is tied to a clear hypothesis.",
  },
  {
    question: "What does FBA mean in an IEP?",
    answer:
      "FBA means functional behavior assessment. It is a process for gathering and interpreting information about behavior and the environmental conditions related to it. Under federal special education regulations, an IEP team considers positive behavioral interventions and supports when behavior impedes learning, and an FBA and BIP are required in specified disciplinary change-of-placement circumstances (34 C.F.R. §§ 300.324(a)(2)(i), 300.530(d)(1)(ii)).",
  },
  {
    question: "What is a competing behavior pathway?",
    answer:
      "A competing behavior pathway is a visual planning tool that connects setting events, antecedents, problem behavior, the maintaining payoff, a functionally matched replacement behavior, and a desired behavior. It helps the team turn an FBA hypothesis into prevention, teaching, reinforcement, response, and measurement steps.",
  },
  {
    question: "How do I write an FBA hypothesis statement?",
    answer:
      "State the antecedent or routine, the observable behavior, and the consequence that commonly follows it. Then describe the likely function as a working hypothesis. Use direct observation and team information to confirm or revise it (Cooper, Heron, & Heward, 2020, pp. 642-643).",
  },
  {
    question: "How long does it take to go from an FBA to a BIP?",
    answer:
      "There is no responsible universal timeline. The work depends on the referral question, available records, observation opportunities, risk, consent and district procedures, the clarity of the pattern, and whether more assessment is needed. Set the next decision point after each product: referral question, FBA summary, hypothesis, pathway, implementation plan, and data review.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: pageTitle,
      description: pageDescription,
      url: pageUrl,
      dateModified: "2026-10-04",
      author: {
        "@type": "Person",
        name: "Rob Spain",
        jobTitle: "BCBA",
        url: "https://behaviorschool.com/about",
      },
      publisher: {
        "@type": "Organization",
        name: "Behavior School",
        url: "https://behaviorschool.com",
      },
      mainEntityOfPage: pageUrl,
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
          name: "FBA to BIP",
          item: pageUrl,
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
  canonical: pageUrl,
  type: "article",
  imageAlt: "FBA to BIP workflow for school BCBAs",
  keywords: [
    "fba to bip",
    "fba and bip",
    "competing behavior pathway",
    "fba/bip examples",
    "fba hypothesis statement examples",
    "behavior intervention plan",
    "function-based behavior intervention",
    "BIP implementation plan",
    "FBA in an IEP",
  ],
});

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 text-2xl font-semibold leading-snug text-[#171f1d] sm:text-3xl">
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-8 text-xl font-semibold leading-snug text-[#171f1d]">
      {children}
    </h3>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-base leading-7 text-[#171f1d]">{children}</p>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-3 pl-6 text-base leading-7 text-[#171f1d]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function TemplateBlock({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-[12px] border border-[#d9cdb8] bg-white px-4 py-4 text-base leading-7 text-[#171f1d]">
      {children}
    </div>
  );
}

function Matrix({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-6">
      <p className="mb-2 text-base text-[#365548] sm:sr-only">
        Scroll horizontally to read every column.
      </p>
      <div
        tabIndex={0}
        aria-label={caption}
        className="overflow-x-auto rounded-[12px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]"
      >
        <table className="w-full min-w-[46rem] caption-top border-collapse text-left text-base leading-7 text-[#171f1d]">
          <caption className="mb-3 text-left text-base font-semibold text-[#171f1d]">
            {caption}
          </caption>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  scope="col"
                  className={`border border-[#d9cdb8] bg-[#1f4d3f] px-3 py-3 font-semibold text-white ${index === 0 ? "sticky left-0 z-10" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const rowBg = rowIndex % 2 === 1 ? "bg-[#f4efe5]" : "bg-white";
              return (
                <tr key={row[0]}>
                  {row.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <th
                        key={cell}
                        scope="row"
                        className={`sticky left-0 z-10 border border-[#d9cdb8] px-3 py-3 align-top font-semibold ${rowBg}`}
                      >
                        {cell}
                      </th>
                    ) : (
                      <td
                        key={`${row[0]}-${cellIndex}`}
                        className={`border border-[#d9cdb8] px-3 py-3 align-top ${rowBg}`}
                      >
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function FbaToBipPage() {
  return (
    <article className="bg-[#fbfaf6] text-[#171f1d]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CtaClickTracker />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-base text-[#365548]">
            <li>
              <Link href="/" className={linkClass}>
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-[#171f1d]">FBA to BIP</li>
          </ol>
        </nav>

        <h1 className="mt-6 text-3xl font-semibold leading-tight text-[#171f1d] sm:text-4xl">
          FBA to BIP: A Step by Step Workflow for School BCBAs
        </h1>

        <P>
          An FBA gives the team a working account of when behavior occurs and what the behavior may
          produce. A BIP turns that account into actions people can use during the school day
          (Cooper, Heron, & Heward, 2020, pp. 628-632).
        </P>
        <P>
          The handoff fails when the hypothesis does not specify what staff should change. The plan
          then lists generic steps, and the team cannot tell what to do, what to measure, or when
          to revise.
        </P>
        <P>
          This guide shows how to move from referral to FBA, hypothesis statement, competing
          behavior pathway, BIP, staff training, and data review. The examples are teaching
          examples. Use individual assessment, team judgment, family and student input, district
          procedures, and safety protocols for each student.
        </P>

        <FbaToBipFlowDiagram />

        <H2>The short version</H2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-base leading-7 text-[#171f1d]">
          <li>Define the behavior and the school routine precisely.</li>
          <li>Review records, interview people who know the routine, and observe directly.</li>
          <li>Summarize the pattern in an ABC hypothesis statement.</li>
          <li>Check whether more assessment is needed before choosing intervention strategies.</li>
          <li>
            Build a competing behavior pathway: the problem behavior, the payoff, the replacement
            behavior, and the desired routine behavior.
          </li>
          <li>
            Translate the pathway into prevention, teaching, reinforcement, response, and
            measurement steps.
          </li>
          <li>Build the implementation plan with the people who will use it.</li>
          <li>Train, observe, graph, and review before deciding what to change.</li>
        </ol>

        <SoftProgramCta campaign={campaign} linkLabel="Build the system around the plan">
          If your BIPs keep becoming documents that staff cannot run, the missing piece may be the
          system around the plan. Build a repeatable FBA, BIP, staff training, and review system in
          the School BCBA Systems Transformation Program.
        </SoftProgramCta>

        <H2>Start with the question, not the template</H2>
        <P>
          The referral question should describe a meaningful school problem in observable terms.
          “He is noncompliant” does not tell the team which responses to count. “During independent
          math, the student puts his head down, pushes the worksheet away, and leaves the table
          after a direction” gives the team a behavior, a routine, and a starting condition.
        </P>
        <P>
          Before collecting new information, review the records that may change the assessment or
          intervention decision. Look at prior goals, behavior plans, data, health information that
          the team is authorized to consider, attendance, schedule changes, instructional demands,
          and what has already been tried. Cooper, Heron, and Heward describe records review,
          interviews, and direct observation as parts of professional assessment, along with
          checking the integrity of prior interventions and considering generalization across
          settings (Cooper, Heron, & Heward, 2020, pp. 49-50).
        </P>
        <P>Ask four opening questions:</P>
        <BulletList
          items={[
            "What does the behavior look and sound like?",
            "When and where does it happen, and when does it not happen?",
            "What usually happens right before and right after it?",
            "What would the student do instead if the same need could be met safely and efficiently?",
          ]}
        />

        <H3>Can a BIP be created without an FBA?</H3>
        <P>
          Sometimes a team may use an interim support while it gathers information, especially when
          immediate safety or access to instruction requires action. A durable, function-based BIP
          should be informed by assessment. Without an FBA or another defensible assessment
          process, the team is more likely to choose strategies because they are familiar, not
          because they address the conditions maintaining the behavior. FBA is designed to identify
          relations among environmental events and behavior so the team can develop an intervention
          that changes those relations (Cooper, Heron, & Heward, 2020, pp. 628-632).
        </P>
        <P>
          An interim plan should say what the team knows, what it does not know, what staff will do
          to keep the student and others safe, what data will be collected, and when the team will
          review the information. Do not present a temporary response plan as a completed
          functional assessment.
        </P>

        <H3>Which should be done first, an FBA or a BIP?</H3>
        <P>
          Start the FBA before the full BIP. The FBA produces the information and hypothesis that
          the BIP is meant to address. A team may begin immediate prevention and safety supports
          before the FBA is complete, but label those supports as interim and continue the
          assessment.
        </P>

        <H2>The FBA to BIP workflow</H2>

        <H3>1. Referral and records review</H3>
        <P>
          Write the referral question in a way that can guide observation. Identify the target
          routine, the people present, the academic or social demand, the behavior to measure, and
          the effect on instruction or participation.
        </P>
        <P>
          Output: a one paragraph referral question, a preliminary operational definition, a list of
          people to interview, and a plan for direct observation.
        </P>

        <H3>2. Interview and direct observation</H3>
        <P>
          Talk with the teacher, paraprofessional, family, student when appropriate, and others who
          see the routine. Ask what happens before and after the behavior, what the student can
          already do, and what staff have tried. Observe the routine directly, then compare what
          you saw with what people reported. Interviews can guide observation, while direct
          observation can confirm, refine, or disconfirm those reports (Cooper, Heron, & Heward,
          2020, pp. 51, 642).
        </P>
        <P>
          Collect observations across the relevant routine rather than relying on one event. Record
          the antecedent, observable behavior, immediate consequence, setting events, task, people
          present, and whether the student used an alternative.
        </P>
        <P>Output: an FBA summary that separates observed facts from interpretations.</P>

        <H3>3. Hypothesis statement</H3>
        <P>Use an ABC format:</P>
        <TemplateBlock>
          <p>
            “When <span className="font-semibold">[antecedent or routine]</span> occurs,{" "}
            <span className="font-semibold">[student]</span> is likely to{" "}
            <span className="font-semibold">[observable behavior]</span>, which is followed by{" "}
            <span className="font-semibold">[consequence]</span>. This pattern suggests the behavior
            may be maintained by <span className="font-semibold">[function]</span>.”
          </p>
        </TemplateBlock>
        <P>Example:</P>
        <TemplateBlock>
          <p>
            “When independent writing begins and the teacher moves to help another student, Jordan
            calls out, tears the page, and turns toward the teacher. The teacher then provides
            one-to-one help and postpones the writing task. This pattern suggests the behavior may
            be maintained by access to adult attention and delay of the writing task.”
          </p>
        </TemplateBlock>
        <P>
          Keep the language tied to the data. A hypothesis is not a diagnosis of the student or a
          statement about intent. Cooper, Heron, and Heward recommend that a hypothesis statement
          identify the antecedent, topography, and maintaining consequence because that format
          points toward possible intervention changes (Cooper, Heron, & Heward, 2020, pp. 642-643).
        </P>

        <H3>4. Decide whether more assessment is needed</H3>
        <P>
          An FBA may include indirect assessment, descriptive observation, or a functional analysis,
          depending on the question and the conditions of the case (Cooper, Heron, & Heward, 2020,
          pp. 628-632). If the descriptive pattern is clear enough for the decision being made, the
          team may proceed to a function-based intervention. If competing explanations remain, seek
          consultation and select an assessment that fits the student, risk, setting, and available
          expertise.
        </P>
        <P>
          Trial-based functional analysis has been evaluated in classroom routines by embedding
          assessment trials in classroom activities. In one study, results corresponded with
          traditional functional analysis results in most cases, with partial correspondence in
          another case, and the authors described the approach as potentially useful when resources
          for a traditional analysis are unavailable (Bloom, Iwata, Fritz, Roscoe, & Carreau, 2011,
          pp. 19-31). A latency measure can be considered when repeated occurrences of dangerous
          behavior create risk, but the procedure requires qualified planning, safety protections,
          and careful interpretation (Thomason-Sassi, Iwata, Neidert, & Roscoe, 2011, pp. 51-67).
        </P>
        <P>
          Do not choose an assessment format because it sounds advanced. Choose it because it
          answers the remaining question safely and competently.
        </P>

        <H3>5. Competing behavior pathway</H3>
        <P>The competing behavior pathway connects the FBA to the plan. It should show:</P>
        <BulletList
          items={[
            "Setting events or motivating conditions that make the payoff valuable.",
            "The antecedent or trigger.",
            "The problem behavior.",
            "The maintaining consequence or payoff.",
            "A replacement behavior that produces the same payoff more efficiently and safely.",
            "A desired behavior that supports participation in the routine.",
          ]}
        />
        <CompetingBehaviorPathwayDiagram />
        <P>
          The replacement behavior must be possible for the student, easy enough to use early in
          teaching, and connected to the same function as the problem behavior (Cooper, Heron, &
          Heward, 2020, pp. 630-632). If the problem behavior produces escape, teach an appropriate
          break or help request and arrange how that request will work. If the problem behavior
          produces attention, teach an attention request and schedule how adults will respond. If
          the behavior produces access to an item or activity, teach an appropriate request,
          waiting, or choice response. If the behavior appears automatically maintained, consult
          qualified professionals before assuming a socially mediated solution.
        </P>

        <H2>Map each hypothesis to the BIP</H2>
        <P>
          The FBA does not write the BIP for you. It tells you which parts of the environment
          deserve attention. Cooper, Heron, and Heward describe three broad intervention routes:
          alter antecedents, alter consequences, and teach alternative behavior (Cooper, Heron, &
          Heward, 2020, pp. 630-632).
        </P>
        <Matrix
          caption="Hypothesized function mapped to prevention, teaching, reinforcement and response, and measurement"
          headers={[
            "Hypothesized function",
            "Prevention",
            "Teaching",
            "Reinforcement and response",
            "Measurement",
          ]}
          rows={[
            [
              "Adult attention",
              "Plan brief positive check-ins before the difficult routine. Make the attention schedule visible.",
              "Teach a help, check-in, or attention request. Practice it when the student is calm.",
              "Respond to the appropriate request as planned. Keep responses to problem behavior safe, neutral, and consistent with the team plan.",
              "Count problem behavior and independent appropriate requests during the target routine.",
            ],
            [
              "Escape or delay",
              "Adjust task length, offer choices, clarify the first step, and use a predictable break arrangement.",
              "Teach a break, help, or clarification request. Teach returning to the task after the break.",
              "Honor the taught request according to the plan. Reinforce task engagement and return. Do not let the response depend on guessing what staff will do.",
              "Measure task starts, appropriate requests, duration of engagement, and problem behavior.",
            ],
            [
              "Tangible or activity access",
              "Show when and how the item or activity is available. Offer meaningful choices and a waiting signal.",
              "Teach an appropriate request, choice, waiting, or transition response.",
              "Deliver the item or activity for the planned alternative response. Follow the safety plan if problem behavior occurs.",
              "Measure appropriate requests, waiting, transitions, and problem behavior around access periods.",
            ],
            [
              "Automatic or unclear function",
              "Review setting events, sensory features, health information, sleep, pain indicators, and routine variables with the appropriate team members.",
              "Teach usable skills that increase participation and safety while the assessment question is clarified.",
              "Use the least intrusive safe response consistent with the assessment and team plan. Do not label a function from appearance alone.",
              "Measure the behavior directly and record the conditions in which it occurs and does not occur.",
            ],
          ]}
        />
        <P>
          The table is a planning aid, not a menu of generic interventions. Select strategies that
          match the individual hypothesis, the school context, student preferences, staff capacity,
          and safety requirements.
        </P>

        <H2>Three FBA to BIP examples</H2>

        <H3>Example 1: Calling out during group instruction</H3>
        <P>
          Referral: During whole-group science, Maya calls out answers and comments over peers. The
          teacher responds verbally and sometimes moves closer to her.
        </P>
        <P>
          FBA pattern: Calling out is most likely when the teacher is attending to another student.
          The immediate consequence is teacher attention. The working hypothesis is that calling
          out may be maintained by adult attention.
        </P>
        <P>Competing behavior pathway:</P>
        <BulletList
          items={[
            "Setting event: long group lesson with limited individual interaction.",
            "Antecedent: teacher asks the group a question or responds to a peer.",
            "Problem behavior: Maya calls out over the speaker.",
            "Payoff: immediate teacher attention.",
            "Replacement behavior: Maya writes her answer on a response card or raises her hand.",
            "Desired behavior: Maya waits for her turn and contributes during the lesson.",
          ]}
        />
        <P>BIP translation:</P>
        <BulletList
          items={[
            "Prevention: give Maya a response card and preview when she can contribute.",
            "Teaching: practice writing the answer, waiting, and raising her hand during a short rehearsal.",
            "Reinforcement: acknowledge the replacement response quickly and provide planned opportunities to contribute.",
            "Response: redirect to the response card or hand signal without adding a long conversation after calling out.",
            "Measurement: record opportunities, independent replacement responses, and call-outs during the defined group routine.",
          ]}
        />
        <P>
          Review question: Is Maya using the replacement response when the teacher is busy, or does
          the team need to make the response faster and easier?
        </P>

        <H3>Example 2: Leaving independent work</H3>
        <P>
          Referral: During independent writing, Leo pushes materials away and walks toward the door
          after a writing direction.
        </P>
        <P>
          FBA pattern: The behavior is most likely after a lengthy or unclear writing demand. Staff
          often remove the worksheet and direct Leo to a quiet area. The working hypothesis is that
          the behavior may be maintained by escape from the task.
        </P>
        <P>Competing behavior pathway:</P>
        <BulletList
          items={[
            "Setting event: difficult writing assignment and uncertainty about how to begin.",
            "Antecedent: independent writing direction.",
            "Problem behavior: pushes materials away and leaves the area.",
            "Payoff: task delay or removal.",
            "Replacement behavior: points to a help card or requests a brief break.",
            "Desired behavior: starts the first step, works for the agreed interval, and requests help or a break appropriately.",
          ]}
        />
        <P>BIP translation:</P>
        <BulletList
          items={[
            "Prevention: provide a model, a choice of writing prompts, and a clear first step.",
            "Teaching: practice the help and break requests, then practice returning to the first step.",
            "Reinforcement: provide the planned brief break or help for the taught request, then reinforce returning and completing the agreed step.",
            "Response: block unsafe exit according to the safety plan and prompt the taught communication response.",
            "Measurement: record task starts, appropriate requests, return after break, duration of engagement, and leaving behavior.",
          ]}
        />
        <P>
          Review question: Does the replacement response produce predictable task support without
          requiring Leo to leave the area?
        </P>

        <H3>Example 3: Taking materials from peers</H3>
        <P>
          Referral: During centers, Sam takes preferred materials from peers and argues when an
          adult removes the item.
        </P>
        <P>
          FBA pattern: Taking is most likely when a preferred item is visible and another student
          has it. Adults often give Sam a different item to end the argument. The working
          hypothesis is that taking may be maintained by access to preferred materials.
        </P>
        <P>Competing behavior pathway:</P>
        <BulletList
          items={[
            "Setting event: limited access to a highly preferred center.",
            "Antecedent: another student has the material Sam wants.",
            "Problem behavior: reaches for the material and argues.",
            "Payoff: occasional access to the item or a different preferred item.",
            "Replacement behavior: points to a choice card, asks for a turn, or selects an available alternative.",
            "Desired behavior: waits, exchanges, or chooses another center while following the center routine.",
          ]}
        />
        <P>BIP translation:</P>
        <BulletList
          items={[
            "Prevention: show the turn order, offer two available choices, and use a visible waiting cue.",
            "Teaching: model asking, choosing, waiting, and accepting “later.” Practice with short waits.",
            "Reinforcement: honor the request or choice according to the schedule and reinforce safe waiting.",
            "Response: calmly block grabbing, prompt the communication response, and follow the team’s safety and access procedures.",
            "Measurement: record appropriate requests, waiting, exchanges, and grabbing during center opportunities.",
          ]}
        />
        <P>
          Review question: Does the taught response contact access to the same type of outcome
          often enough to compete with grabbing?
        </P>

        <H2>Common breakdowns in FBA and BIP work</H2>

        <H3>Plans nobody runs</H3>
        <P>
          Cause: the plan requires steps that are hard to remember, takes more time than the
          routine allows, or assigns responsibility to “staff” without naming who does what.
        </P>
        <P>
          Fix: write the plan in the order the routine occurs. Name the implementer, the prompt,
          the student response, the consequence, the measurement, and the next review. Ask an
          implementer to explain the plan in their own words, then practice it.
        </P>

        <H3>Generic plans</H3>
        <P>
          Cause: the plan lists praise, redirection, breaks, or visuals without connecting them to
          the FBA hypothesis.
        </P>
        <P>
          Fix: for every strategy, answer “Which part of the hypothesis does this change?” If the
          answer is unclear, remove the strategy or gather more information. FBA-informed
          interventions are intended to alter antecedents or consequences and teach an alternative
          that contacts the relevant outcome (Cooper, Heron, & Heward, 2020, pp. 630-632).
        </P>

        <H3>No replacement behavior</H3>
        <P>
          Cause: the team focuses on stopping the problem behavior without teaching a response that
          works for the student.
        </P>
        <P>
          Fix: name the payoff. Choose a response the student can perform, teach it before the
          difficult routine, prompt it early, and reinforce it according to the plan. Check that
          the response gives the student a workable way to contact the same outcome (Cooper, Heron,
          & Heward, 2020, pp. 630-632).
        </P>

        <H3>No data plan</H3>
        <P>
          Cause: the BIP says “monitor progress” but does not define the behavior, measurement
          dimension, opportunity, person responsible, or review rule.
        </P>
        <P>Fix: complete this sentence:</P>
        <TemplateBlock>
          <p>
            “During <span className="font-semibold">[routine]</span>,{" "}
            <span className="font-semibold">[person]</span> will record{" "}
            <span className="font-semibold">[observable behavior]</span> using{" "}
            <span className="font-semibold">[measure]</span> for{" "}
            <span className="font-semibold">[opportunities or duration]</span>. The team will review{" "}
            <span className="font-semibold">[graph or summary]</span> on{" "}
            <span className="font-semibold">[review schedule]</span> and decide{" "}
            <span className="font-semibold">[continue, adjust, or reassess]</span>.”
          </p>
        </TemplateBlock>
        <P>
          Measurement should match the behavior and the decision the team needs to make (Cooper,
          Heron, & Heward, 2020, pp. 99-104).
        </P>

        <H3>Baseline and goal do not match</H3>
        <P>
          Cause: the baseline measures aggression while the goal measures walking to a calming
          area, or the plan teaches a request while the data sheet counts only problem behavior.
        </P>
        <P>
          Fix: put the baseline behavior, replacement behavior, goal, and data sheet side by side.
          Each should describe the same decision path. Add separate measures when the team needs to
          know both whether problem behavior is changing and whether the replacement skill is being
          acquired.
        </P>

        <H2>Build the implementation plan with the team</H2>
        <P>
          The written BIP is not the implemented BIP. A plan becomes usable when the people who
          will run it help specify how it fits their routines, materials, time, and
          responsibilities.
        </P>

        <H3>Team roles</H3>
        <Matrix
          caption="Team member responsibilities before implementation, during implementation, and at review"
          headers={["Team member", "Before implementation", "During implementation", "At review"]}
          rows={[
            [
              "School BCBA or behavior specialist",
              "Lead assessment, write the hypothesis, draft the pathway, and prepare the meeting.",
              "Model, train, observe, and support data collection.",
              "Graph data, check fidelity, and recommend continuing, adjusting, or reassessing.",
            ],
            [
              "Teacher",
              "Describe the routine, instructional demands, and feasible prevention steps.",
              "Use the plan during instruction and record the agreed measure.",
              "Report contextual changes, student response, and practical barriers.",
            ],
            [
              "Paraprofessional or other implementer",
              "Explain what can be done during transitions, centers, arrival, or other assigned routines.",
              "Prompt, reinforce, respond, and record according to the plan.",
              "Share examples of what was easy or difficult to implement.",
            ],
            [
              "Student",
              "Share preferences, communication options, and what makes the routine workable when appropriate.",
              "Use the taught replacement response and participate in practice.",
              "Help the team identify whether the plan feels understandable and useful.",
            ],
            [
              "Family or caregiver",
              "Share patterns across settings and important strengths, preferences, and concerns.",
              "Support consistent communication across settings when appropriate.",
              "Review progress and help identify changes outside school that affect the pattern.",
            ],
            [
              "Administrator or case manager",
              "Protect time for training, materials, communication, and review.",
              "Remove logistical barriers and coordinate required IEP processes.",
              "Confirm responsibilities, next steps, and documentation.",
            ],
          ]}
        />
        <P>Bring a draft, not a finished verdict. Ask the team:</P>
        <BulletList
          items={[
            "Can this prevention step happen in the actual routine?",
            "What will the adult say or do first?",
            "What will the student do next?",
            "What will count as reinforcement?",
            "What happens if the replacement response is not used?",
            "Who records the data, and when will the graph be reviewed?",
          ]}
        />

        <H2>A practical timeline</H2>
        <Matrix
          caption="Point in the process, product, and decision"
          headers={["Point in the process", "Product", "Decision"]}
          rows={[
            [
              "Referral and records review",
              "Referral question and records summary",
              "Is the concern defined well enough to observe?",
            ],
            [
              "Interviews and observation",
              "FBA information and direct data",
              "Is there a consistent pattern?",
            ],
            [
              "FBA summary",
              "Antecedent, behavior, consequence, and setting event summary",
              "Is the hypothesis clear enough to guide a plan?",
            ],
            [
              "Hypothesis and pathway",
              "Function-linked competing behavior pathway",
              "Does the replacement response match the likely payoff?",
            ],
            [
              "Draft BIP meeting",
              "Prevention, teaching, reinforcement, response, and data steps",
              "Can the team run the plan in the real routine?",
            ],
            [
              "Training and launch",
              "Demonstration, practice, feedback, and materials",
              "Can each implementer perform the critical steps?",
            ],
            [
              "Early review",
              "Fidelity check and graph",
              "Is the plan being implemented as written?",
            ],
            [
              "Data review",
              "Student response and implementation data",
              "Continue, adjust, or return to assessment?",
            ],
          ]}
        />
        <P>
          Do not treat a calendar date as proof that a plan is working. Review both implementation
          fidelity and student data. If staff are not using the plan, first fix training,
          materials, prompts, time, or role clarity. If the plan is being implemented and the
          pattern does not change, revisit the hypothesis, measurement, and competing behavior
          pathway.
        </P>

        <H2>Keep building the system</H2>
        <P>
          For the broader role and systems context, visit{" "}
          <Link href="/school-bcba" className={linkClass}>
            BCBA in schools
          </Link>
          , the{" "}
          <Link href="/functional-behavior-assessment-guide" className={linkClass}>
            functional behavior assessment guide
          </Link>
          ,{" "}
          <Link href="/behavior-intervention-plan-examples" className={linkClass}>
            behavior intervention plan examples
          </Link>
          , and the{" "}
          <Link href="/fba-decision-matrix" className={linkClass}>
            FBA decision matrix
          </Link>
          .
        </P>

        <aside
          aria-label="From Rob Spain"
          className="my-10 rounded-[12px] border border-[#d9cdb8] border-l-4 border-l-[#1f4d3f] bg-[#f4efe5] px-5 py-5"
        >
          <p className="text-base leading-7 text-[#171f1d]">
            From Rob: “A bad reason to reassess is you kind of made this intervention that you
            tried for a couple of weeks and you think your intervention stinks. You should not have
            bad interventions if you do good assessments and your interventions are matched to your
            assessments. That is one thing I had to learn the hard way. I had to revise so many
            plans over and over and over. What is wrong with this? Why? Why are we not getting this
            right the first time? And I realized, oh, you spend a lot more time doing really good
            assessments. You do not revise plans like that.”
          </p>
        </aside>

        <H2>FBA and BIP in an IEP</H2>
        <P>
          FBA means functional behavior assessment. In an IEP context, the team considers
          behavioral supports when behavior interferes with the student’s learning or the learning
          of others. Federal regulations require a school to conduct a functional behavioral
          assessment and implement a behavior intervention plan when a disciplinary change of
          placement is made in the circumstances described in 34 C.F.R. § 300.530(d)(1)(ii). The
          IEP team must also consider positive behavioral interventions and supports, and other
          strategies, when a student’s behavior impedes learning under 34 C.F.R. §
          300.324(a)(2)(i).
        </P>
        <P>
          The exact process, consent rules, documentation, and timelines can depend on the
          circumstances and state or district requirements. Coordinate with the case manager and
          follow the applicable procedures. This page is a behavior planning workflow, not legal
          advice.
        </P>

        <H2>Frequently asked questions</H2>
        {faqs.map((faq) => (
          <section key={faq.question} className="mt-8">
            <h3 className="text-xl font-semibold leading-snug text-[#171f1d]">{faq.question}</h3>
            <p className="mt-4 text-base leading-7 text-[#171f1d]">{faq.answer}</p>
          </section>
        ))}

        <div className="[&_button]:focus-visible:outline [&_button]:focus-visible:outline-[3px] [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-[#fbfaf6] [&_input]:focus-visible:outline [&_input]:focus-visible:outline-[3px] [&_input]:focus-visible:outline-offset-2 [&_input]:focus-visible:outline-[#1f4d3f]">
          <NewsletterSignup />
        </div>

        <ProgramCtaBlock
          campaign={campaign}
          heading="Build an FBA to BIP system your team can run"
          line="Get live support for assessment, function-based BIPs, staff training, and data review."
        />
      </div>
    </article>
  );
}
