import Link from "next/link";
import type { ReactNode } from "react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  CtaClickTracker,
  ProgramCtaBlock,
  SoftProgramCta,
} from "@/components/content/ProgramCta";
import { StoryPlaceholder } from "@/components/content/StoryPlaceholder";
import { FbaProcessDiagram } from "./diagrams";
import { fbaFaqs } from "./faqs";
import { PrintTemplateButton } from "./print-button";

const CAMPAIGN = "functional-behavior-assessment-guide";

const linkClass =
  "inline-block max-w-full min-h-11 break-words py-2 leading-7 align-middle rounded-[8px] font-semibold text-[#1f4d3f] underline underline-offset-4 hover:text-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f] [overflow-wrap:anywhere]";

const headingClass = "scroll-mt-6 text-[#171f1d]";

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={linkClass}>
        {children}
      </a>
    );
  }
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={linkClass} rel="noopener noreferrer">
      {children}
    </a>
  );
}

function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className={`mt-12 text-2xl font-semibold leading-snug ${headingClass}`}>
      {children}
    </h2>
  );
}

function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className={`mt-8 text-xl font-semibold leading-snug ${headingClass}`}>
      {children}
    </h3>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-base leading-7 text-[#171f1d]">{children}</p>;
}

function BulletList({ children }: { children: ReactNode }) {
  return <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-[#171f1d]">{children}</ul>;
}

function DataTable({
  label,
  headers,
  rows,
}: {
  label: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-sm leading-5 text-[#171f1d]" aria-label={label}>
        <thead>
          <tr>
            {headers.map((header) => (
                <th
                key={header}
                className="min-w-[9rem] border border-[#d9cdb8] bg-[#f4efe5] px-3 py-2 text-left font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${label}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${label}-${rowIndex}-${cellIndex}`} className="min-h-11 min-w-[9rem] border border-[#d9cdb8] bg-white px-3 py-2 align-top">
                  {cell || "\u00a0"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FillLine() {
  return <p className="mt-3 min-h-11 border-b-2 border-[#d9cdb8]">{"\u00a0"}</p>;
}

type HypothesisExample = {
  title: string;
  setting: string;
  antecedent: string;
  behavior: string;
  consequence: string;
  statement: string;
  check: string;
};

const hypothesisGroups: { heading: string; items: HypothesisExample[] }[] = [
  {
    heading: "Escape (4 examples)",
    items: [
      {
        title: "1. Hard written work, grade 4",
        setting: "Math is the last block of the day.",
        antecedent: "Independent worksheet of multi-digit division, no adult nearby.",
        behavior: "Puts head on the desk, then tears the worksheet.",
        consequence:
          "Teacher takes the worksheet away and sends the student to the calm-down area; the worksheet is not returned that day.",
        statement:
          "During independent math at the end of the day, when given a long division worksheet with no adult support, the student puts his head down and tears the paper, and the task is removed. This likely functions to escape difficult written work.",
        check:
          "The behavior should be less likely when the same skill is presented in a shorter format with a staff member beside him. It should also appear when other hard written tasks are given.",
      },
      {
        title: "2. Reading aloud, grade 7",
        setting: "None identified.",
        antecedent: "Teacher calls on the student to read a paragraph aloud in English class.",
        behavior: "Says a curse word and walks out.",
        consequence: "Sent to the office; the reading turn passes to another student.",
        statement:
          "During whole-class reading in English, when called on to read aloud, the student curses and leaves the room, and the turn goes to someone else. This likely functions to escape oral reading in front of peers.",
        check:
          "The behavior should be less likely when the student reads silently first or reads to a partner, and it should show up in other oral tasks such as presentations.",
      },
      {
        title: "3. Ending recess, kindergarten",
        setting: "Recess has been unstructured and long.",
        antecedent: "Staff call the class to line up to go inside.",
        behavior: "Drops to the ground and screams.",
        consequence: "The class goes in; an aide stays outside with the student for several minutes.",
        statement:
          "At the end of recess, when the class is called to line up, the student drops to the ground and screams, and ends up with continued time outside with an adult. This likely functions to escape the transition into the classroom, or to access continued outdoor play.",
        check:
          "If it is escape, the behavior should show up before other demanding transitions. If it is access to play, it should be less likely when the next activity is a preferred one. Collect data in both conditions before you decide.",
      },
      {
        title: "4. Assigned group, grade 8",
        setting: "A conflict with a classmate on the bus that morning.",
        antecedent: "Teacher assigns group work with that classmate.",
        behavior: "Refuses to move desks, then argues with the teacher.",
        consequence: "Teacher lets the student work alone in the hallway.",
        statement:
          "On days after a bus conflict, when assigned to a group with that classmate, the student refuses to move and argues, and then works alone in the hallway. This likely functions to escape working with that peer.",
        check:
          "The behavior should be less likely when paired with a different peer, and should not happen when the same task is given individually.",
      },
    ],
  },
  {
    heading: "Peer attention (2 examples)",
    items: [
      {
        title: "5. Lunch, grade 5",
        setting: "None identified.",
        antecedent: "The aide is at the far end of the cafeteria and peers are seated nearby.",
        behavior: "Makes loud animal noises.",
        consequence: "Nearby peers laugh and look.",
        statement:
          "At lunch, when adults are at a distance and peers are seated close by, the student makes loud animal noises, and peers laugh and look at him. This likely functions to get peer attention.",
        check:
          "The behavior should be more frequent with peers close by than when seated alone or at an adult table, and should drop when peers do not respond.",
      },
      {
        title: "6. Passing period, grade 9",
        setting: "None identified.",
        antecedent: "A group of peers is gathered at lockers.",
        behavior: "Shoves a peer's backpack.",
        consequence: "Peers shout and crowd around.",
        statement:
          "During passing periods, when a group of peers is gathered at lockers, the student shoves a classmate's backpack, and peers shout and gather around. This likely functions to get peer attention.",
        check:
          "The behavior should be less likely when the student walks with a peer who gives positive attention, and should be rare when the hallway is empty.",
      },
    ],
  },
  {
    heading: "Adult attention (2 examples)",
    items: [
      {
        title: "7. Small group time, grade 2",
        setting: "None identified.",
        antecedent: "The teacher turns to work with a reading group while the student has independent work.",
        behavior: "Calls out the teacher's name repeatedly, then leaves his seat to stand beside her.",
        consequence: 'The teacher says "I\'ll be right there" or walks over to redirect him.',
        statement:
          "During small group instruction, when the teacher turns away and the student has independent work, he calls out and leaves his seat, and the teacher responds. This likely functions to get adult attention.",
        check:
          "The behavior should be less likely if the teacher gives brief attention before she turns away, and more likely when attention is scarce for longer stretches.",
      },
      {
        title: "8. Aide helping another student, self-contained classroom",
        setting: "None identified.",
        antecedent: "The aide is helping another student.",
        behavior: "Throws pencils on the floor.",
        consequence: "The aide comes over, speaks to him, and picks up the pencils.",
        statement:
          "In the self-contained classroom, when the aide is helping another student, the student throws pencils, and the aide comes over and talks to him. This likely functions to get adult attention.",
        check:
          "The behavior should happen when the aide is busy, and not when she is next to him. It should stop if aide attention stops following it.",
      },
    ],
  },
  {
    heading: "Tangible (2 examples)",
    items: [
      {
        title: "9. Choice time, kindergarten",
        setting: "None identified.",
        antecedent: "A peer is using the tablet and the teacher says it is another student's turn next.",
        behavior: "Grabs the tablet and hits the peer.",
        consequence: "Staff separate them, and the student ends up holding the tablet to stop the crying.",
        statement:
          "During choice time, when a peer has the tablet and he is told to wait, the student grabs it and hits, and ends up with the tablet. This likely functions to get access to the tablet.",
        check:
          "The behavior should also appear around other preferred items and should be less likely with a visual turn system and a short wait.",
      },
      {
        title: "10. Snack bin, grade 3",
        setting: "Arrived at school without eating breakfast.",
        antecedent: "Sees the snack bin and is told snack comes after reading.",
        behavior: "Grabs the bin and screams when blocked.",
        consequence: "Staff give him a snack right away.",
        statement:
          "On days he arrives without breakfast, when he sees the snack bin and is told to wait until after reading, the student grabs the bin and screams, and receives a snack. This likely functions to get food.",
        check:
          "Look at breakfast status across days. If the behavior is rare on days he has eaten, the setting event matters. Also ask the nurse or family about food access.",
      },
    ],
  },
  {
    heading: "Automatic (2 examples)",
    items: [
      {
        title: "11. Waiting with no task, grade 6",
        setting: "None identified.",
        antecedent: "Finishes a work block and waits with no materials.",
        behavior: "Scratches the skin on his forearm.",
        consequence: "Physical sensation produced by the behavior, with no change in adult or peer response.",
        statement:
          "During waiting periods with no materials, the student scratches his forearm, and the behavior continues whether or not adults or peers respond. This may function as automatic reinforcement.",
        check:
          "Rule out social reinforcers first (Cooper et al., 2020, pp. 628-629). Look at whether it also happens alone, across many settings, and during both demand and free time. Ask the school nurse about skin or medical causes, since Cooper et al. recommend medical evaluation when the interview points to a medical issue (Cooper et al., 2020, p. 642).",
      },
      {
        title: "12. Seatwork, grade 1",
        setting: "None identified.",
        antecedent: "A long stretch of seatwork with few prompts from adults.",
        behavior: "Hums loudly and rocks his chair.",
        consequence: "Sound and movement the behavior produces; adults rarely respond.",
        statement:
          "During long seatwork periods with few prompts, the student hums and rocks, and adults rarely respond. This may function as automatic reinforcement.",
        check:
          "The behavior should happen at high rates across the day, including when no one is paying attention (Cooper et al., 2020, p. 642).",
      },
    ],
  },
];

const references: { text: string; href?: string }[] = [
  {
    text: "ABA in School. (n.d.). How to write a functional behavior assessment.",
    href: "https://abainschool.com/how-to-write-a-functional-behavior-assessment/",
  },
  {
    text: "Bloom, S. E., Iwata, B. A., Fritz, J. N., Roscoe, E. M., & Carreau, A. B. (2011). Classroom application of a trial-based functional analysis. Journal of Applied Behavior Analysis, 44(1), 19-31.",
    href: "https://doi.org/10.1901/jaba.2011.44-19",
  },
  {
    text: "Cooper, J. O., Heron, T. E., & Heward, W. L. (2020). Applied behavior analysis (3rd ed.). Pearson.",
  },
  {
    text: "Hanley, G. P., Jin, C. S., Vanselow, N. R., & Hanratty, L. A. (2014). Producing meaningful improvements in problem behavior of children with autism via synthesized analyses and treatments. Journal of Applied Behavior Analysis, 47(1), 16-36.",
    href: "https://doi.org/10.1002/jaba.106",
  },
  {
    text: "IRIS Center. (n.d.). Functional behavioral assessment (elementary): Page 7, hypothesis statements. Vanderbilt University.",
    href: "https://iris.peabody.vanderbilt.edu/module/fba-elem/cresource/q2/p07/",
  },
  {
    text: "Lloyd, B. P., Weaver, E. S., & Staubitz, J. L. (2016). A review of functional analysis methods conducted in public school classroom settings. Journal of Behavioral Education, 25(3), 324-356.",
    href: "https://doi.org/10.1007/s10864-015-9243-y",
  },
  {
    text: "Thomason-Sassi, J. L., Iwata, B. A., Neidert, P. L., & Roscoe, E. M. (2011). Response latency as an index of response strength during functional analyses of problem behavior. Journal of Applied Behavior Analysis, 44(1), 51-67.",
    href: "https://doi.org/10.1901/jaba.2011.44-51",
  },
  {
    text: "U.S. Department of Education, Office of Special Education and Rehabilitative Services & Office of Elementary and Secondary Education. (2024, November). Using functional behavioral assessments to create supportive learning environments.",
    href: "https://sites.ed.gov/idea/files/Functional-Behavioral-Assessments-11-19-2024.pdf",
  },
  {
    text: "Individuals with Disabilities Education Act regulations, 34 C.F.R. § 300.301(c)(1) (initial evaluation within 60 days of consent or the state timeframe).",
    href: "https://www.law.cornell.edu/cfr/text/34/300.301",
  },
  {
    text: "Individuals with Disabilities Education Act regulations, 34 C.F.R. § 300.530(d)(1)(ii) and (f)(1) (FBA in discipline situations).",
    href: "https://www.law.cornell.edu/cfr/text/34/300.530",
  },
];

export function FbaGuide() {
  return (
    <article className="bg-[#f4efe5] text-[#171f1d]">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #fba-print-sheet, #fba-print-sheet * { visibility: visible; }
          #fba-print-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff;
          }
        }
      `}</style>
      <CtaClickTracker />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-base">
            <li>
              <TextLink href="/">Home</TextLink>
            </li>
            <li aria-hidden="true" className="text-[#365548]">
              /
            </li>
            <li aria-current="page" className="font-semibold">
              FBA guide
            </li>
          </ol>
        </nav>

        <p className="mt-6 text-base leading-7 text-[#365548]">
          By Rob Spain, M.S., BCBA, IBA. Last reviewed: October 4, 2026
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-[#171f1d] md:text-4xl">
          Functional Behavior Assessment in Schools: Examples, Template and Steps
        </h1>
        <P>
          If you are the school BCBA, the FBA request usually lands with a deadline, a worried teacher, and very little data. This guide gives you the steps in the order a school team does them, twelve hypothesis statements written for real school settings, a printable template, and two worked examples. Every technical claim has a source at the bottom of the page.
        </P>
        <nav aria-label="On this page" className="mt-4 flex flex-wrap items-center gap-x-3 text-base">
          <span>Jump to:</span>
          <TextLink href="#steps">Steps</TextLink>
          <TextLink href="#hypothesis-statement-examples">Hypothesis statement examples</TextLink>
          <TextLink href="#fba-template">Printable FBA template</TextLink>
          <TextLink href="#worked-examples">Worked examples</TextLink>
          <TextLink href="#faq">FAQ</TextLink>
        </nav>

        <H2>What is a functional behavior assessment?</H2>
        <P>
          A functional behavior assessment (FBA) is a systematic way to find out why a behavior keeps happening, so the team can build supports that fit. Cooper, Heron, and Heward describe it as obtaining information about the purposes, or functions, a behavior serves for a person, and they compare it to a reinforcer assessment: it identifies what is currently maintaining the problem behavior (Cooper et al., 2020, p. 628).
        </P>
        <P>
          The main purpose is the plan that comes after. If you can name the reinforcers keeping a behavior going, you can change the situation, teach a replacement skill, and change what the behavior produces (Cooper et al., 2020, p. 628). The U.S. Department of Education says the same thing in school terms: an FBA is a process for identifying the reasons behind a student&apos;s behavior, and it can support any student whose behavior interferes with learning (U.S. Department of Education, 2024, pp. 1 to 2).
        </P>
        <P>
          A note on spelling. Behavior analysts write &quot;functional behavior assessment.&quot; The federal special education regulations write &quot;functional behavioral assessment.&quot; They mean the same process.
        </P>
        <P>
          The four functions most school teams work with are attention, access to items or activities (tangibles), escape or avoidance, and automatic reinforcement (Cooper et al., 2020, pp. 628-629; IRIS Center, n.d.).
        </P>
        <H3>Where school FBAs stall</H3>
        <P>These are the places teams tell us the work gets stuck. Each one has a section below.</P>
        <BulletList>
          <li>
            Nobody is sure who does the FBA. See <TextLink href="#who-does-the-fba">Who does the FBA at school?</TextLink>
          </li>
          <li>
            Teachers cannot take the data you ask for. See <TextLink href="#when-teachers-cannot-take-data">When teachers cannot take data</TextLink>.
          </li>
          <li>
            Too many reports say &quot;attention.&quot; See <TextLink href="#why-attention">Why so many FBAs say attention</TextLink>.
          </li>
          <li>
            The referral is a one-time incident or a very small behavior. See <TextLink href="#wrong-first-move">When a full FBA is the wrong first move</TextLink>.
          </li>
          <li>
            The hypothesis statement is vague. See <TextLink href="#hypothesis-statement-examples">FBA hypothesis statement examples</TextLink>.
          </li>
          <li>
            The report is finished and the classroom does not change. See <TextLink href="#from-fba-to-bip">From FBA to BIP</TextLink>.
          </li>
        </BulletList>

        <SoftProgramCta campaign={CAMPAIGN} linkLabel="Build this as a system for your whole caseload">
          An FBA that sits in a folder does not change a classroom. The usual gap is the team routine around it: who takes data, who teaches the replacement skill, and who checks that the plan is being run. The Transformation Program builds that routine with you.
        </SoftProgramCta>

        <H2>The FBA process at a glance</H2>
        <FbaProcessDiagram />
        <P>
          Text version of the diagram: referral question, consent and team, define the behavior, records and interviews, direct observation, find the patterns, write the hypothesis, check it, hand off to the BIP. If the pattern is unclear after step 6, go back to observation. If the hypothesis does not hold in step 8, go back to step 6.
        </P>
        <P>
          Cooper, Heron, and Heward lay out the core as four steps: gather information with indirect and descriptive assessment, interpret it and form hypotheses, test the hypotheses with a functional analysis, and develop intervention options based on function (Cooper et al., 2020, p. 641). The nine steps above add the school pieces around those four: the referral question, consent, a clear behavior definition, and the hand-off.
        </P>

        <H2 id="steps">Steps</H2>
        <H3 id="who-does-the-fba">Who does the FBA at school?</H3>
        <P>
          Federal law does not name a job title for who completes an FBA. The Department of Education says data collection for an FBA should be done by professionals who have the skills, training, and knowledge to identify, analyze, and address the interfering behavior, and who work with parents and students (U.S. Department of Education, 2024, p. 6).
        </P>
        <P>
          In practice, your state rules and district roster decide. It might be the BCBA, the school psychologist, a special education teacher with training, or a team of them. Settle this at the start by writing the roles on the template: who runs the interviews, who observes, who writes the statement, who presents it. A blank &quot;Assigned to&quot; line is the most common reason an FBA drifts.
        </P>

        <H3>Step 1. Write the referral question</H3>
        <P>
          One sentence: what behavior, in which settings, since when, and what the team wants to know. Example: &quot;Why does Student A leave the table during independent writing in room 12, and what would help?&quot; Keep it free of labels like &quot;defiant&quot; or &quot;attention seeking.&quot;
        </P>

        <H3>Step 2. Confirm consent and the team</H3>
        <P>
          Consent rules depend on how the FBA is used. Under IDEA, parent consent is required before an FBA that is part of an initial evaluation or reevaluation, or that is used with other data as one (U.S. Department of Education, 2024, pp. 12 to 13). Check your district procedure before you observe. Details are in <TextLink href="#consent-and-law">Consent, timelines and what the law says</TextLink>.
        </P>
        <P>
          Invite the people who see the behavior: the teacher, the person who runs the hardest part of the day (for example the paraprofessional at recess), the family, the student when it fits, and an administrator who can approve schedule changes.
        </P>

        <H3>Step 3. Define the behavior in observable words</H3>
        <P>
          The Department of Education describes the behavior description as clear, specific, measurable, observable, and objective, free from bias and judgment (U.S. Department of Education, 2024, p. 5). Test your definition by asking whether two adults watching the same minute would both mark it.
        </P>
        <DataTable
          label="Vague labels compared with observable definitions"
          headers={["Too vague", "Observable"]}
          rows={[
            ["Defiant", "Says \"no\" or puts head down within a few seconds of a written direction, and does not start the task"],
            ["Aggressive", "Hits a peer with an open hand or closed fist"],
            ["Elopes", "Leaves the assigned area without permission and moves beyond the staff member's reach"],
            ["Off task", "Is not looking at or touching the assigned materials"],
          ]}
        />

        <H3>Step 4. Review records and interview the people who know the student</H3>
        <P>
          Start with what already exists: attendance, grades, prior incidents, health records, and earlier interventions (U.S. Department of Education, 2024, p. 6).
        </P>
        <P>
          Then interview. Cooper, Heron, and Heward note that interviews with the teacher, parent, or caregiver help the evaluator identify and define target behaviors and likely antecedents and consequences, and give an overall picture that includes the student&apos;s strengths. An interview can also show that another assessment should come first: their example is untreated chronic ear infections, which call for a medical evaluation before more behavioral assessment (Cooper et al., 2020, pp. 641-642). In a school, that is a reason to look at the nurse&apos;s records and any vision or hearing screening before you go further. Where the student has the language to answer, ask the student too (Cooper et al., 2020, p. 642).
        </P>
        <P>Interview questions that work in a hallway or a 15-minute meeting:</P>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-7">
          <li>Tell me what you see, in words a camera could record.</li>
          <li>When does it happen most? What is going on right before?</li>
          <li>When does it never happen, or happen less?</li>
          <li>What happens right after, in the room, in the next few minutes?</li>
          <li>What happens to the task, the group, or the student&apos;s spot when it occurs?</li>
          <li>What does the student do well? What do they like?</li>
          <li>What have you already tried, and what did you see?</li>
          <li>Is anything different on the bad days (sleep, food, a rough bus ride, a change of staff)?</li>
        </ol>
        <P>
          Rating scales and checklists can start a conversation. Cooper, Heron, and Heward caution that closed-ended instruments such as the MAS and QABF have repeatedly been found unreliable for identifying function (Cooper et al., 2020, p. 641). Use them to prompt questions, and do not let one score settle the hypothesis.
        </P>

        <H3 id="watch-the-behavior">Step 5. Watch the behavior yourself</H3>
        <P>
          Indirect information comes from memory. Direct observation tells you whether it matches. Cooper, Heron, and Heward say observation in the natural routine helps confirm or disconfirm what the interviews suggested. They also note that teachers and caregivers sometimes overlook the stimuli that trigger or follow problem behavior (Cooper et al., 2020, p. 642).
        </P>
        <BulletList>
          <li>
            Observe in the times the interviews pointed to, and in at least one time when the behavior is said not to happen. The Department of Education guidance asks for data on when the behavior happens and when it does not (U.S. Department of Education, 2024, p. 5).
          </li>
          <li>
            Use an ABC form: antecedent, behavior, consequence. One example from Cooper, Heron, and Heward shows tantrums recorded when a student is told to wash her hands, followed by removal of the demand, which suggests a hypothesis of escape (Cooper et al., 2020, p. 636).
          </li>
          <li>
            If nobody can say when the behavior is most likely, a scatterplot can show the times of day to target for more observation (Cooper et al., 2020, p. 642).
          </li>
          <li>
            Add setting, people present, and what the student was doing before the antecedent. That information feeds the setting event line of the hypothesis (U.S. Department of Education, 2024, pp. 5-6).
          </li>
        </BulletList>

        <h4 id="when-teachers-cannot-take-data" className={`mt-8 text-lg font-semibold ${headingClass}`}>
          When teachers cannot take data
        </h4>
        <P>Asking a teacher in the middle of instruction to fill in a three-column ABC log usually fails, and that is a design problem. These changes keep the data usable:</P>
        <BulletList>
          <li>You take the first passes of ABC data. The classroom staff do not need to start there.</li>
          <li>Hand over one task: a tally mark on a card each time the defined behavior happens, in one period only.</li>
          <li>Ask for one sentence at the end of that period: &quot;What happened right before the hardest moment?&quot;</li>
          <li>
            Use a short teacher input form instead of open-ended notes. See <TextLink href="/blog/teacher-input-forms-for-fba">Teacher Input Forms for FBA</TextLink>.
          </li>
          <li>Schedule the review before you leave. A date on the calendar protects the data more than a reminder.</li>
        </BulletList>

        <H3>Step 6. Find the patterns</H3>
        <P>Look at the information together. Cooper, Heron, and Heward give these decision rules (Cooper et al., 2020, p. 642):</P>
        <BulletList>
          <li>If problem behavior happens most when little attention is available and it often produces attention, a hypothesis that attention maintains it fits.</li>
          <li>If it happens most in high-demand situations and often produces a break from the task, a hypothesis that escape maintains it fits.</li>
          <li>If it happens in an unpredictable pattern or at high rates across the school day, a hypothesis of automatic reinforcement may fit.</li>
          <li>A student can have more than one function, and different forms of behavior can serve different functions.</li>
        </BulletList>
        <P>
          Cooper, Heron, and Heward also say automatic reinforcement is assumed only after social reinforcers have been ruled out (Cooper et al., 2020, pp. 628-629).
        </P>

        <h4 id="why-attention" className={`mt-8 text-lg font-semibold ${headingClass}`}>
          Why so many FBAs say attention
        </h4>
        <P>
          Descriptive methods such as ABC recording and scatterplots are generally considered invalid for detecting function by Cooper, Heron, and Heward, because they tend to produce false positives for attention. Adults are often nearby and respond to a student in a classroom whether or not the behavior is the thing that earns it. They also note false negatives for escape when adults stop giving demands to avoid the behavior. They advise restricting conclusions to how often environmental events come before and after the behavior (Cooper et al., 2020, p. 635).
        </P>
        <P>
          So if your data show attention after the behavior, ask two questions before you write &quot;attention&quot;: does the behavior also happen when adults are right beside the student, and what happens to the task right after? An observation that includes a task demand and a demand-free period is more useful than a longer observation of one condition.
        </P>

        <H3>Step 7. Write the hypothesis statement</H3>
        <P>Use the format and the twelve school examples in the next section. Write one sentence for each function the data point to.</P>

        <H3>Step 8. Check the hypothesis, then hand off</H3>
        <P>
          Compare your statement with new data. If the next observation does not match, go back to Step 6. If the team needs proof, a functional analysis is the only FBA method that lets practitioners confirm a hypothesis about the relation between problem behavior and environmental events (Cooper et al., 2020, p. 631). See <TextLink href="#go-beyond-observation">When to go beyond observation</TextLink>.
        </P>
        <P>
          Then hand off. The BIP needs the hypothesis statement, the replacement skill, and a review date. See <TextLink href="#from-fba-to-bip">From FBA to BIP</TextLink>.
        </P>

        <H3 id="how-long">How long does an FBA take?</H3>
        <P>
          No single number fits every case. When the FBA is part of an initial evaluation for special education, IDEA sets 60 days from parental consent, or the timeline your state sets (34 C.F.R. § 300.301(c)(1)). Your state or district may set its own timeline for other FBAs. One practitioner who writes about school FBAs says that, for a student the team already knows well and has data on, a full FBA can take days, and that most take 4 to 8 weeks (ABA in School, n.d.). Put dates on the template for each step so the timeline is visible to the team.
        </P>

        <H3 id="consent-and-law">Consent, timelines and what the law says</H3>
        <BulletList>
          <li>
            IDEA requires the IEP team to conduct an FBA, or review and revise an existing BIP, when the team finds that conduct which led to a disciplinary change of placement was a manifestation of the child&apos;s disability (34 C.F.R. § 300.530(f)(1)).
          </li>
          <li>
            When a student with a disability is removed from the current placement for disciplinary reasons, the student must, as appropriate, receive an FBA and behavioral intervention services designed to address the behavior (34 C.F.R. § 300.530(d)(1)(ii)).
          </li>
          <li>
            Consent: parent consent is required before an FBA if the FBA is one of the tools used in an initial evaluation or reevaluation, or if it is used with other data as the evaluation. Outside of evaluation, IDEA does not require consent, though parents and the student may give important information (U.S. Department of Education, 2024, pp. 12 to 14).
          </li>
          <li>
            An FBA cannot be used to delay or deny an evaluation of a child suspected of having a disability (U.S. Department of Education, 2024, pp. 2 and 14).
          </li>
          <li>
            The Department of Education&apos;s 2024 guidance says FBAs can and should be used for any student whose behavior interferes with learning, and notes that FBAs are most often done after safety-related behavior or discipline (U.S. Department of Education, 2024, p. 2).
          </li>
        </BulletList>
        <P>
          This page is practice guidance and does not replace your district&apos;s legal counsel or your state&apos;s rules. Check both before you decide on consent or timelines.
        </P>

        <H3>What does FBA mean in education and in an IEP?</H3>
        <P>
          FBA stands for functional behavioral assessment. In an IEP, it can appear as an assessment used to understand behavior that gets in the way of learning, as part of an evaluation, or as the basis for a behavior intervention plan (BIP). IDEA names it directly in the discipline rules above.
        </P>

        <H2 id="hypothesis-statement-examples">FBA hypothesis statement examples</H2>
        <H3>The format</H3>
        <P>
          A hypothesis statement, sometimes called a summary statement, ties the pattern to a function in one sentence. Cooper, Heron, and Heward say to write it in ABC format: the antecedent hypothesized to trigger the behavior, the form of the behavior, and the maintaining consequence. They add that this helps because it points to two ways to intervene: change the antecedent, or change the reinforcement contingencies (Cooper et al., 2020, p. 642). The IRIS Center adds setting events, the earlier conditions that make the behavior more likely (IRIS Center, n.d.).
        </P>
        <P>Fill-in format:</P>
        <p className="mt-4 rounded-[12px] border border-[#d9cdb8] bg-white p-4 text-base leading-7">
          During [setting or activity], when [antecedent], [student] [observable behavior], and [maintaining consequence]. This likely functions to [get or avoid something]. It is more likely when [setting event].
        </p>
        <P>
          Keep out phrases such as &quot;because he is embarrassed&quot; or &quot;to get what she wants.&quot; IRIS warns that guesses about feelings and motives creep in this way, and recommends keeping to the four functions: attention, items or activities, escape, and automatic (IRIS Center, n.d.).
        </P>

        <H3>Twelve school examples</H3>
        <P>
          These are written for this guide to show the format. They are not real students. Each includes a &quot;check it&quot; line: what you would expect to see next if the statement is right. Cooper, Heron, and Heward note that only a functional analysis confirms a hypothesis (Cooper et al., 2020, p. 631), so treat each statement as your best current explanation and compare it with new data.
        </P>
        {hypothesisGroups.map((group) => (
          <section key={group.heading} className="mt-8">
            <h4 className="text-lg font-semibold text-[#171f1d]">{group.heading}</h4>
            <div className="mt-4 grid gap-4">
              {group.items.map((item) => (
                <article key={item.title} className="rounded-[12px] border border-[#d9cdb8] bg-white p-4 sm:p-5">
                  <h5 className="text-base font-semibold leading-6 text-[#171f1d]">{item.title}</h5>
                  <dl className="mt-3 space-y-2 text-base leading-7">
                    <div>
                      <dt className="inline font-semibold">Setting event: </dt>
                      <dd className="inline">{item.setting}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Antecedent: </dt>
                      <dd className="inline">{item.antecedent}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Behavior: </dt>
                      <dd className="inline">{item.behavior}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Consequence: </dt>
                      <dd className="inline">{item.consequence}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-base leading-7">
                    <span className="font-semibold">Statement: </span>
                    {item.statement}
                  </p>
                  <p className="mt-2 text-base leading-7">
                    <span className="font-semibold">Check it: </span>
                    {item.check}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}

        <P>At a glance:</P>
        <DataTable
          label="Hypothesis statement examples at a glance"
          headers={["#", "Function", "Where", "Behavior"]}
          rows={[
            ["1", "Escape", "Grade 4 math", "Head down, tears worksheet"],
            ["2", "Escape", "Grade 7 English", "Curses, leaves room"],
            ["3", "Escape or access", "Kindergarten recess", "Drops, screams"],
            ["4", "Escape", "Grade 8 group work", "Refuses to move, argues"],
            ["5", "Peer attention", "Grade 5 lunch", "Loud animal noises"],
            ["6", "Peer attention", "Grade 9 hallway", "Shoves backpack"],
            ["7", "Adult attention", "Grade 2 small group", "Calls out, leaves seat"],
            ["8", "Adult attention", "Self-contained room", "Throws pencils"],
            ["9", "Tangible", "Kindergarten choice time", "Grabs tablet, hits"],
            ["10", "Tangible", "Grade 3 snack bin", "Grabs bin, screams"],
            ["11", "Automatic", "Grade 6 waiting", "Scratches forearm"],
            ["12", "Automatic", "Grade 1 seatwork", "Hums, rocks"],
          ]}
        />

        <H3>Weak and strong statements</H3>
        <DataTable
          label="Weak hypothesis statements compared with stronger ones"
          headers={["Weak", "Why it fails", "Stronger"]}
          rows={[
            [
              '"He acts out because he wants attention."',
              "No antecedent, no observable behavior, guesses at motive",
              '"When the teacher turns to a reading group, he calls out and leaves his seat, and she responds. Likely adult attention."',
            ],
            [
              '"She is avoiding because she is anxious."',
              "Names a feeling that no one can observe",
              '"When called on to read aloud, she leaves the room and the turn passes to another student. Likely escape."',
            ],
            [
              '"He is non-compliant."',
              "A label, not a behavior",
              '"After a written direction, he puts his head down and does not start. The direction is repeated and the task is shortened."',
            ],
          ]}
        />
        <P>
          Cooper, Heron, and Heward note that each hypothesis should point to ways to intervene, either by changing the antecedent or by changing the reinforcement contingencies (Cooper et al., 2020, p. 642). A statement that cannot point to either is not finished.
        </P>

        {/* ROB-STORY PLACEHOLDER: a time a school FBA hypothesis was wrong or an assessment was rushed, and what Rob changed in how he gathers data */}
        <StoryPlaceholder
          topic="a time a school FBA hypothesis was wrong or an assessment was rushed, and what Rob changed in how he gathers data"
          candidates={[
            {
              label: "Early-career FBAs and BIPs that did not stick",
              href: "https://robspain.com/blog/the-myth-of-the-behavior-kid/",
            },
            {
              label: "What Rob does now when asked to consult on a behavior kid",
              href: "https://robspain.com/blog/the-myth-of-the-behavior-kid",
            },
            {
              label: "FBA as a paperwork ritual",
              href: "https://robspain.com/blog/school-bcba-fba-bip-requests/",
            },
            {
              label: "A behavior plan does not implement itself",
              href: "https://robspain.com/blog/what-does-a-school-bcba-do/",
            },
          ]}
        />

        <H2 id="fba-template">FBA template you can print</H2>
        <P>
          Use this as a working draft. Fill in the grey lines on screen or print the page. Adjust the headings to match your district form, since many districts require their own forms.
        </P>
        <div className="mt-4">
          <PrintTemplateButton />
        </div>

        <div id="fba-print-sheet" className="mt-6 rounded-[12px] border border-[#d9cdb8] bg-white p-4 sm:p-6">
          <p className="text-lg font-semibold">Functional Behavior Assessment (school team working copy)</p>
          <DataTable
            label="Student and team fields"
            headers={["Field", "Entry"]}
            rows={[
              ["Student ID or initials (no full name on shared copies)", ""],
              ["Grade and school", ""],
              ["Date referral received", ""],
              ["Date consent received (if required)", ""],
              ["Referral source", ""],
              ["FBA lead and role", ""],
              ["Team members and roles", ""],
            ]}
          />

          <h3 className="mt-6 text-lg font-semibold">1. Referral question</h3>
          <P>One sentence: what behavior, which settings, since when, and what the team wants to know.</P>
          <FillLine />

          <h3 className="mt-6 text-lg font-semibold">2. Behavior definition</h3>
          <DataTable
            label="Behavior definition fields"
            headers={["Part", "Entry"]}
            rows={[
              ["Behavior in observable words", ""],
              ["Examples", ""],
              ["Non-examples", ""],
              ["How it is measured (frequency, duration, intensity)", ""],
            ]}
          />

          <h3 className="mt-6 text-lg font-semibold">3. Records reviewed</h3>
          <DataTable
            label="Records reviewed"
            headers={["Record", "Date reviewed", "Notes"]}
            rows={[
              ["Attendance", "", ""],
              ["Grades and work samples", "", ""],
              ["Prior incidents", "", ""],
              ["Health and screening records", "", ""],
              ["Earlier interventions and results", "", ""],
              ["Current IEP or 504 plan", "", ""],
            ]}
          />

          <h3 className="mt-6 text-lg font-semibold">4. Interviews</h3>
          <DataTable
            label="Interview log"
            headers={["Person and role", "Date", "What they described (when, before, after, not happening)"]}
            rows={[
              ["Teacher", "", ""],
              ["Paraprofessional", "", ""],
              ["Parent or caregiver", "", ""],
              ["Student (if appropriate)", "", ""],
            ]}
          />

          <h3 className="mt-6 text-lg font-semibold">5. Direct observation log (ABC)</h3>
          <DataTable
            label="Direct observation ABC log"
            headers={["Date and time", "Setting and activity", "Who is present", "Antecedent", "Behavior", "Consequence", "Notes"]}
            rows={[
              ["", "", "", "", "", "", ""],
              ["", "", "", "", "", "", ""],
              ["", "", "", "", "", "", ""],
              ["", "", "", "", "", "", ""],
            ]}
          />
          <P>Include at least one observation in a time when the behavior is said not to happen.</P>

          <h3 className="mt-6 text-lg font-semibold">6. Patterns</h3>
          <DataTable
            label="Pattern questions"
            headers={["Question", "Answer"]}
            rows={[
              ["When is it most likely?", ""],
              ["When is it least likely or absent?", ""],
              ["What usually comes right before it?", ""],
              ["What usually happens right after it?", ""],
              ["Setting events that make it more likely", ""],
              ["Skills the student may be missing", ""],
            ]}
          />

          <h3 className="mt-6 text-lg font-semibold">7. Hypothesis statement</h3>
          <P>
            During [setting or activity], when [antecedent], [student] [observable behavior], and [maintaining consequence]. This likely functions to [attention, items or activities, escape, or automatic]. It is more likely when [setting event].
          </P>
          <FillLine />

          <h3 className="mt-6 text-lg font-semibold">8. How we will check it</h3>
          <DataTable
            label="How the hypothesis will be checked"
            headers={["Option", "Plan"]}
            rows={[
              ["Next observation: what we expect if the hypothesis is right", ""],
              ["What we expect if it is wrong", ""],
              ["Functional analysis needed? (yes or no, why)", ""],
              ["Date to review", ""],
            ]}
          />

          <h3 className="mt-6 text-lg font-semibold">9. Hand-off to the BIP</h3>
          <DataTable
            label="Hand-off to the behavior intervention plan"
            headers={["Item", "Entry"]}
            rows={[
              ["Replacement behavior to teach", ""],
              ["Changes to antecedents or the setting", ""],
              ["What adults will do after the behavior", ""],
              ["Who teaches, who tracks, who checks", ""],
              ["Date of first plan review", ""],
            ]}
          />

          <h3 className="mt-6 text-lg font-semibold">Before you share the FBA</h3>
          <BulletList>
            <li>The behavior is defined in words anyone can observe.</li>
            <li>The statement has an antecedent, a behavior and a consequence.</li>
            <li>There is no guess about feelings or motives.</li>
            <li>There is at least one observation by someone other than the teacher who referred the student.</li>
            <li>The report says what was not found or is still unclear.</li>
            <li>Roles and a review date for the plan are listed.</li>
          </BulletList>
        </div>

        <NewsletterSignup />

        <H2 id="worked-examples">Worked examples</H2>
        <P>Both examples are composites written for this guide. They are not real students.</P>

        <H3>Worked example 1: Leaving the table during independent writing</H3>
        <P>
          <span className="font-semibold">Referral question: </span>
          Why does Student A leave the table during independent writing in room 12, and what would help?
        </P>
        <P>
          <span className="font-semibold">Behavior definition: </span>
          Leaves the assigned seat without permission and moves more than an arm&apos;s length from the table during independent writing.
        </P>
        <P>
          <span className="font-semibold">Records: </span>
          Attendance is steady. Writing samples show short, incomplete sentences. No earlier behavior plan. The nurse&apos;s record shows no vision or hearing concern.
        </P>
        <P>
          <span className="font-semibold">Interviews: </span>
          The teacher says it happens mostly in writing and not in math. The paraprofessional says Student A starts well when a staff member sits beside him.
        </P>
        <P>
          <span className="font-semibold">ABC observations (three, in the writing block):</span>
        </P>
        <DataTable
          label="Worked example 1 ABC observations"
          headers={["Antecedent", "Behavior", "Consequence"]}
          rows={[
            [
              "Teacher assigns a paragraph to write on his own",
              "Leaves the table and walks to the door",
              'Teacher says "come back and try" and gives a pencil grip; the paragraph is not started',
            ],
            [
              "Teacher assigns a paragraph to write on his own",
              "Leaves the table and sharpens a pencil for several minutes",
              "Writing time ends before he begins",
            ],
            [
              "Teacher sits beside him and writes the first sentence with him",
              "Stays at the table",
              "Writes two more sentences",
            ],
          ]}
        />
        <P>
          <span className="font-semibold">Patterns: </span>
          It occurs when writing is independent and long. It was absent when an adult started the first sentence. The consequence is delay or loss of the writing task.
        </P>
        <P>
          <span className="font-semibold">Hypothesis: </span>
          During independent writing, when asked to write a paragraph on his own, Student A leaves the table, and the writing task is delayed or ends. This likely functions to escape difficult independent writing. It is more likely with no adult support at the start.
        </P>
        <P>
          <span className="font-semibold">Check it: </span>
          Next observation, compare a writing period with a support start to one without. If the pattern holds, the team moves to a plan. If the behavior continues even with support, return to Step 6 and look again.
        </P>
        <P>
          <span className="font-semibold">Hand-off: </span>
          Teach Student A to ask for help or a break in a set way. Provide a sentence-starter and a short first task. Reinforce starting. The teacher decides the first task&apos;s length with the BCBA. Review date on the team calendar.
        </P>

        <H3>Worked example 2: Functional behavior assessment for elopement</H3>
        <P>
          <span className="font-semibold">Referral question: </span>
          Why does Student B leave the classroom or playground area, and what needs to change to keep him safe?
        </P>
        <P>
          <span className="font-semibold">Behavior definition: </span>
          Leaves the assigned area without permission and moves beyond the reach of the nearest staff member.
        </P>
        <P>
          <span className="font-semibold">First step: </span>
          Safety planning happens before anything else. Name who watches the exits, who follows, and who calls the office. The assessment waits until that plan is running.
        </P>
        <P>
          <span className="font-semibold">Records and interviews: </span>
          Notes show most events in the first hour and after recess. Staff report he goes to the same hallway door. He has not run when a preferred task is in front of him.
        </P>
        <P>
          <span className="font-semibold">ABC observations (summary):</span>
        </P>
        <DataTable
          label="Worked example 2 ABC observations"
          headers={["Antecedent", "Behavior", "Consequence"]}
          rows={[
            [
              "Teacher announces a switch from free choice to circle",
              "Walks out of the room toward the hallway door",
              "Staff follow and bring him back; circle begins without him for a few minutes",
            ],
            ["Teacher gives a written task at his desk", "Walks out of the room", "Staff follow; the task is delayed"],
            ["Teacher announces a switch from circle to a preferred activity", "Stays", "Participates"],
          ]}
        />
        <P>
          <span className="font-semibold">Patterns: </span>
          The behavior follows a switch to less preferred activities, and the consequence is delay of the task.
        </P>
        <P>
          <span className="font-semibold">Hypotheses (two, held lightly): </span>
          (a) During transitions from free choice to non-preferred activities, when told the activity is changing, Student B leaves the room, and the demand is delayed. This likely functions to escape the demand. (b) The chase may also provide adult attention. The next observation records what staff do after he leaves, with the safety plan still in place, so the team can see whether adult attention follows the behavior.
        </P>
        <P>
          <span className="font-semibold">Hand-off: </span>
          Teach Student B to ask for a break, give advance warning of changes with a visual, and make the first task shorter. The safety plan stays in place until the new routine is working.
        </P>

        <H2 id="go-beyond-observation">When to go beyond observation</H2>
        <P>
          Observation alone gives a hypothesis. A functional analysis (FA) is the only FBA method that lets practitioners confirm the relation between behavior and environmental events (Cooper et al., 2020, p. 631). A review of FA studies done in public school classrooms found that FA is rarely included in FBAs in practice, and it identified 39 studies, with 88 participants, in which school staff ran FAs in usual classrooms (Lloyd et al., 2016).
        </P>
        <P>Options that are designed for classrooms and short time frames:</P>
        <BulletList>
          <li>
            Trial-based FA: trials are mixed into regular classroom activities across the day. In a study with ten students, the trial-based results matched traditional FA results fully in six cases and partly in a seventh, and the authors concluded it may be a viable method when resources for a standard FA are not available (Bloom et al., 2011).
          </li>
          <li>
            Latency-based FA: sessions end after the first response, which may be useful when repeated occurrences of the behavior are risky or impractical (Thomason-Sassi et al., 2011).
          </li>
          <li>
            Synthesized analyses, including the IISCA from the practical functional assessment approach: Hanley et al. (2014) describe a comprehensive, parent-validated functional assessment and treatment process for three children with autism, carried out in an outpatient clinic consultation. Most school teams will want training and supervision before using it with a student.
          </li>
        </BulletList>
        <P>
          Which approach fits your student depends on safety, staff training, and setting. If you want a decision guide for your caseload, try the <TextLink href="/fba-decision-matrix">FBA decision matrix</TextLink>.
        </P>

        <H2 id="wrong-first-move">When a full FBA is the wrong first move</H2>
        <P>Referrals come in all shapes. A few cases call for a different first step:</P>
        <BulletList>
          <li>
            A single incident. A hypothesis needs a pattern of behavior and environmental events (Cooper et al., 2020, p. 642). One event gives no pattern to analyze. Review the incident, check the safety plan, and set a data plan so a pattern can appear if it happens again.
          </li>
          <li>
            A very small behavior with an obvious fix. The Department of Education guidance encourages wider use of FBAs for any student whose behavior interferes with learning (U.S. Department of Education, 2024, p. 2). Where the behavior is minor, a short consultation, an adjustment to the routine, and a check-in date may come first, and the FBA is still available if it continues. Follow your district process.
          </li>
          <li>
            An old FBA when the plan is the problem. Look first at whether the plan is being run as written. If the function has not changed, the plan may need implementation support more than a new assessment.
          </li>
          <li>A request that is really about staffing, scheduling, or the room. Write down what you saw and bring it to the team.</li>
        </BulletList>
        <P>
          Always check state and district rules before declining or delaying an evaluation. An FBA cannot be used to delay or deny an evaluation of a child suspected of having a disability (U.S. Department of Education, 2024, p. 2).
        </P>

        <H2 id="from-fba-to-bip">From FBA to BIP</H2>
        <P>
          The plan should match the function. Cooper, Heron, and Heward note that an FBA does not tell you which interventions will work, but it does identify antecedents, skill deficits, and contingencies you can change. The intervention should be functionally equivalent: if behavior serves escape, the plan should give the student an acceptable way to get escape (Cooper et al., 2020, p. 642). The Department of Education also says the skills you teach should address the function, such as new social skills or academic strategies, in place of the behavior that interferes with learning (U.S. Department of Education, 2024, p. 6).
        </P>
        <P>Hand-off checklist:</P>
        <BulletList>
          <li>The hypothesis statement is copied into the plan.</li>
          <li>One replacement behavior is named and taught.</li>
          <li>Antecedent changes are listed in words a teacher can follow.</li>
          <li>Adult responses are written out.</li>
          <li>A person is named for teaching, tracking, and checking.</li>
          <li>A review date is on the calendar.</li>
        </BulletList>
        <P>
          Next pages: <TextLink href="/fba-to-bip">FBA to BIP</TextLink> walks through turning a hypothesis into a plan. <TextLink href="/behavior-intervention-plan-examples">Behavior intervention plan examples</TextLink> shows finished plans by function. The <TextLink href="/behavior-plans">Behavior Plan Writer</TextLink> can help draft one.
        </P>

        <H2>FBA and BIP Template Kit: coming soon</H2>
        <div className="mt-4 rounded-[12px] border border-[#d9cdb8] bg-[#fbfaf6] p-5">
          <p className="text-base leading-7">
            We are working on a fillable FBA and BIP template kit for school teams. It is not for sale yet and there is no date. The printable FBA template on this page stays free.
          </p>
        </div>

        <H2>Related guides</H2>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-base leading-7">
          <li>
            <TextLink href="/blog/teacher-input-forms-for-fba">Teacher Input Forms for FBA: How to Get Useful Data from Classroom Staff</TextLink>
          </li>
          <li>
            <TextLink href="/blog/how-to-write-an-fba-step-by-step-guide">How to Write an FBA: Step-by-Step Guide for School BCBAs</TextLink>
          </li>
          <li>
            <TextLink href="/blog/fba-to-bip-workflow-tier-3">FBA to BIP Workflow: A Step-by-Step Guide for Tier 3 Behavior Support</TextLink>
          </li>
          <li>
            <TextLink href="/blog/functional-behavior-assessment-in-public-schools">Functional Behavior Assessment in Public Schools: A Decision Guide</TextLink>
          </li>
          <li>
            <TextLink href="/iep-behavior-goal-examples">IEP behavior goal examples</TextLink>
          </li>
          <li>
            Learn more about the work of a <TextLink href="/school-bcba">BCBA in schools</TextLink>, including the <TextLink href="/school-bcba/job-guide">School BCBA job guide</TextLink>.
          </li>
        </ul>

        <ProgramCtaBlock
          campaign={CAMPAIGN}
          heading="Make FBAs and plans that your school team runs"
          line="The Transformation Program covers assessment, plan writing and the staff routines that keep a plan in use."
        />

        <H2 id="faq">FAQ</H2>
        <div className="mt-4 space-y-6">
          {fbaFaqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-lg font-semibold leading-snug text-[#171f1d]">{faq.question}</h3>
              <p className="mt-2 text-base leading-7">{faq.answer}</p>
            </div>
          ))}
        </div>

        <H2>References</H2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-7">
          {references.map((item) => (
            <li key={item.text}>
              {item.text}{" "}
              {item.href ? <TextLink href={item.href}>{item.href}</TextLink> : null}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
