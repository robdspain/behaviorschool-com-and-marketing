import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  CtaClickTracker,
  ProgramCtaBlock,
  SoftProgramCta,
} from "@/components/content/ProgramCta";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { BstCycleDiagram, FidelityChecklistDiagram } from "./diagrams";

const canonical = "https://behaviorschool.com/school-bcba/staff-training";
const title = "Behavior Skills Training for School Staff and Paras";
const description =
  "Learn how school BCBAs use behavior skills training to teach paras and teachers, practice BIP routines, give feedback, and check fidelity.";
const campaign = "staff-training";

const linkClass =
  "inline-flex min-h-11 items-center font-semibold text-[#1f4d3f] underline underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

export const metadata = buildPageMetadata({
  title,
  description,
  canonical,
  type: "article",
  imageAlt: "Behavior skills training for school staff and paras",
  keywords: [
    "behavior skills training",
    "paraprofessional training",
    "classroom management training for teachers",
    "BST behavior skills training",
    "staff training for behavior plans",
    "behavior training for school teams",
  ],
});

const faqs = [
  {
    question: "What are the four components of behavioral skills training?",
    answer:
      "The four components are instructions, modeling, rehearsal, and feedback. The trainer describes the skill, demonstrates it, gives the trainee a chance to practice, and provides specific feedback. The cycle is repeated until the trainee meets the written performance criterion. (Parsons, Rollyson, & Reid, 2012, pp. 2-8)",
  },
  {
    question: "What is behavioral skills training?",
    answer:
      "Behavioral skills training is a structured way to teach a person to perform a defined skill. In school staff training, the skill should be observable, practiced in a realistic routine, and checked against a clear criterion. BST is useful for training staff to implement a behavior plan, prompt a replacement response, collect data, or use a classroom routine. (Parsons, Rollyson, & Reid, 2012, pp. 2-11)",
  },
  {
    question: "What are some examples of behavioral skills training?",
    answer:
      "Examples include teaching a para to prompt a break request, teaching a teacher to deliver a transition cue, teaching staff to reinforce a replacement behavior, teaching a team to record ABC events, and teaching a staff member to follow an escalation procedure. Each example should include instructions, a model, practice, and feedback.",
  },
  {
    question: "What are the top 5 behavioral skills?",
    answer:
      "There is no single universal list of five behavioral skills for every school team. Choose the staff responses that match the student’s plan and classroom routine. Common training targets include giving a clear cue, waiting for a response, prompting a replacement behavior, reinforcing the response, and recording what happened. Define each target so another observer can score it.",
  },
  {
    question: "How do you train paraprofessionals to implement a behavior plan?",
    answer:
      "Choose one observable response from the plan, write a short checklist, explain and model it, give the para several role-play opportunities, provide feedback, and observe the response during the real routine. Set the mastery criterion before training and schedule a follow-up check. A long behavior plan can support the team’s decisions, but staff also need a short implementation guide for the moment the routine occurs. (Parsons, Rollyson, & Reid, 2012, pp. 3-4)",
  },
  {
    question: "How do you measure staff training?",
    answer:
      "Measure staff performance during rehearsal and implementation fidelity during the classroom routine. If relevant, also measure the student or classroom outcome connected to the target skill. Use the results to decide whether to reteach, change the materials, adjust the procedure, or continue monitoring.",
  },
] as const;

const planRows = [
  {
    part: "Instructions",
    activity:
      "“Before independent work, place the break card within reach. When early signs named in the plan occur, point to the card and say, ‘Break is available.’ Wait five seconds. If the student hands you the card, say, ‘Break,’ and follow the break routine. Record the response.”",
    check: "The staff member can state the cue, response, wait, consequence, and recording step.",
  },
  {
    part: "Model",
    activity:
      "Demonstrate the complete routine, including the five-second wait and the response when the student does not use the card.",
    check: "The model matches the written steps and the student’s plan.",
  },
  {
    part: "Rehearsal",
    activity:
      "The trainee practices with the trainer acting as the student. Use a calm trial, a delayed response, and an early sign that calls for the prompt.",
    check: "The trainee performs each step in order and uses the agreed words.",
  },
  {
    part: "Feedback",
    activity:
      "“You placed the card before work began. On the next trial, point to it before repeating the verbal cue, then wait.”",
    check: "Feedback is specific, immediate, and followed by another practice opportunity.",
  },
  {
    part: "Classroom check",
    activity: "Observe the routine during independent work and score the checklist.",
    check: "The skill occurs with the real materials, timing, and distractions.",
  },
] as const;

const fidelityRows = [
  "Materials were ready before the routine began.",
  "Staff used the agreed cue.",
  "Staff waited for the planned interval.",
  "Staff reinforced or responded according to the plan.",
  "Staff recorded the required information.",
  "Staff followed the escalation or help procedure when needed.",
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: title,
      description,
      url: canonical,
      datePublished: "2026-10-04",
      dateModified: "2026-10-04",
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
      mainEntityOfPage: canonical,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://behaviorschool.com/",
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
          name: "Staff training",
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

function CheckField() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-11 w-11 rounded-[8px] border-2 border-[#1f4d3f] bg-white"
    />
  );
}

function NoteField() {
  return (
    <span
      aria-hidden="true"
      className="block min-h-11 rounded-[8px] border border-[#d9cdb8] bg-[#fbfaf6]"
    />
  );
}

export default function StaffTrainingPage() {
  return (
    <article className="bg-[#fbfaf6] text-[#171f1d]">
      <CtaClickTracker />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <style>{`
        .bst-table { width: 100%; border-collapse: collapse; }
        .bst-table caption { text-align: left; font-size: 16px; font-weight: 600; margin-bottom: 8px; }
        @media (max-width: 767px) {
          .bst-table thead {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
          .bst-table tr {
            display: block;
            margin-bottom: 12px;
            border: 1px solid #d9cdb8;
            border-radius: 12px;
            background: #ffffff;
            padding: 8px 0;
          }
          .bst-table td,
          .bst-table tbody th {
            display: block;
            padding: 8px 16px;
            font-size: 16px;
            line-height: 1.7;
            text-align: left;
          }
          .bst-table td::before,
          .bst-table tbody th::before {
            content: attr(data-label);
            display: block;
            font-weight: 600;
            margin-bottom: 4px;
          }
        }
        @media (min-width: 768px) {
          .bst-table th,
          .bst-table td {
            border: 1px solid #d9cdb8;
            padding: 12px;
            vertical-align: top;
            text-align: left;
            font-size: 16px;
            line-height: 1.7;
          }
          .bst-table th { background: #f4efe5; font-weight: 600; }
        }
        @media print {
          .bst-table { display: table; }
          .bst-table thead {
            display: table-header-group;
            position: static;
            width: auto;
            height: auto;
            margin: 0;
            overflow: visible;
            clip: auto;
          }
          .bst-table tbody { display: table-row-group; }
          .bst-table tr { display: table-row; margin: 0; border: 0; padding: 0; }
          .bst-table th,
          .bst-table td { display: table-cell; border: 1px solid #171f1d; }
          .bst-table td::before,
          .bst-table tbody th::before { content: none; }
        }
      `}</style>

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 text-base text-[#365548]">
            <li>
              <a href="/" className={linkClass}>
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/school-bcba" className={linkClass}>
                BCBA in schools
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span aria-current="page" className="inline-flex min-h-11 items-center font-semibold text-[#171f1d]">
                Staff training
              </span>
            </li>
          </ol>
        </nav>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 text-base text-[#365548]">Rob Spain, BCBA</p>
        </header>

        <div className="mt-6 space-y-5 text-base leading-7">
          <p>
            When a behavior plan depends on a teacher or paraprofessional doing something at the right moment, a handout is not training. Staff need to see the response, practice it, and receive useful feedback while the skill is still fresh.
          </p>
          <p>
            This guide shows school BCBAs how to use behavior skills training, often called BST, to teach one observable staff skill at a time. You will see the four components, a school example, a fidelity checklist, and a way to train a whole building when your calendar is already full.
          </p>
        </div>

        <section className="mt-10" aria-labelledby="what-is-bst">
          <h2 id="what-is-bst" className="text-2xl font-semibold leading-snug">
            What is behavior skills training?
          </h2>
          <div className="mt-4 space-y-5 text-base leading-7">
            <p>
              Behavior skills training is a competency-based method for teaching a person to perform a defined skill. The usual components are instructions, modeling, rehearsal, and feedback. Training continues until the person meets a written performance criterion, then the skill is checked in the regular work setting. (Parsons, Rollyson, & Reid, 2012, pp. 2-11; Cooper, Heron, & Heward, 2020, p. 107)
            </p>
            <p>In a school, the skill might be:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>delivering a visual cue before a difficult transition</li>
              <li>prompting a student to request a break</li>
              <li>reinforcing the replacement response named in a behavior plan</li>
              <li>recording an ABC event using the team’s agreed definitions</li>
              <li>responding to early signs of escalation and following the safety plan</li>
            </ul>
            <p>
              The training target is staff performance. A person can describe a strategy and still need practice using it with a student, during a transition, with other students present.
            </p>
          </div>
          <BstCycleDiagram />
          <SoftProgramCta campaign={campaign} linkLabel="Build the system for your caseload">
            If your plans are clear but staff still call you for every difficult moment, the missing piece may be a repeatable training system. The Transformation Program helps school BCBAs build that system across a caseload.
          </SoftProgramCta>
        </section>

        <section className="mt-10" aria-labelledby="four-components">
          <h2 id="four-components" className="text-2xl font-semibold leading-snug">
            What are the four components of behavioral skills training?
          </h2>

          <h3 className="mt-6 text-xl font-semibold leading-snug">1. Instructions</h3>
          <div className="mt-3 space-y-5 text-base leading-7">
            <p>
              Describe the skill in plain language. Include the cue that should prompt the response, the exact staff action, what to do if the student does not respond, and how to record or communicate the result. Explain why the skill matters, but keep the performance directions easy to find.
            </p>
            <p>
              A useful instruction is observable: “When the student moves toward the door after the transition cue, point to the break card, wait five seconds, and honor the card when the student hands it to you.” A weak instruction is “Use the plan consistently.”
            </p>
            <p>
              Parsons, Rollyson, and Reid describe a brief written description and a performance checklist as part of staff training because a long formal plan may not give staff the short set of actions they need at the moment of implementation. (Parsons, Rollyson, & Reid, 2012, pp. 3-4)
            </p>
          </div>

          <h3 className="mt-6 text-xl font-semibold leading-snug">2. Modeling</h3>
          <p className="mt-3 text-base leading-7">
            Show the skill exactly as staff should use it. Model the words, wait time, materials, body position, and response to likely errors. A live demonstration, a short video, or a carefully scripted role-play can work. The model should match the classroom routine as closely as possible.
          </p>

          <h3 className="mt-6 text-xl font-semibold leading-snug">3. Rehearsal</h3>
          <p className="mt-3 text-base leading-7">
            Give the trainee a turn. Use role-play first when the skill is new or safety-sensitive, then practice in the classroom when appropriate. Rehearsal reveals details that a presentation cannot: the visual is out of reach, the cue is too long, the wait time is unclear, or the staff member does not know what to do after the first response.
          </p>

          <h3 className="mt-6 text-xl font-semibold leading-snug">4. Feedback</h3>
          <div className="mt-3 space-y-5 text-base leading-7">
            <p>
              Respond to the performance. Name what was correct, identify one change to make, and let the trainee try again. Feedback should be specific and tied to the checklist. “Good job” is less useful than “You showed the break card before the prompt, and you honored the request within the routine.”
            </p>
            <p>
              The four components are usually repeated until the trainee reaches the stated criterion. Feedback is where the trainer can reinforce accurate steps, correct errors, and decide whether the instruction or model needs clarification. (Parsons, Rollyson, & Reid, 2012, pp. 5-8)
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="why-pd-fails">
          <h2 id="why-pd-fails" className="text-2xl font-semibold leading-snug">
            Why one-time professional development fails
          </h2>
          <div className="mt-4 space-y-5 text-base leading-7">
            <p>
              One-time professional development often measures attendance or recall. Staff may leave with a definition of function, a copy of a BIP, or a list of classroom strategies. None of those show that a person can perform the target response during a real transition.
            </p>
            <p>Common failure points include:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>the training names a strategy without defining the staff response</li>
              <li>the written plan is long, so the critical steps are hard to find</li>
              <li>the trainer demonstrates but staff never rehearse</li>
              <li>staff rehearse once but receive no feedback</li>
              <li>the BCBA checks only whether staff attended, not whether the skill occurred</li>
              <li>the response is practiced in a quiet room but never checked during the school routine</li>
              <li>new staff receive no booster when the routine changes</li>
            </ul>
            <p>
              Evidence-based staff training is performance based and competency based. That means the trainer watches the skill, collects information against a criterion, and continues training until the criterion is met. (Parsons, Rollyson, & Reid, 2012, pp. 2-3)
            </p>
            <p>
              Cooper, Heron, and Heward also describe the need for explicit, systematic observer training, practice with examples and nonexamples, feedback, and a predetermined accuracy criterion before data collection. Their guidance is useful when the staff skill includes recording behavior or implementation data. (Cooper, Heron, & Heward, 2020, pp. 107-108)
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="para-steps">
          <h2 id="para-steps" className="text-2xl font-semibold leading-snug">
            BST for paraprofessionals, step by step
          </h2>

          <h3 className="mt-6 text-xl font-semibold leading-snug">Step 1: Choose one staff response</h3>
          <p className="mt-3 text-base leading-7">
            Start with one action that matters in the next school routine. Do not train “behavior management” as a whole. Choose “prompt the break request during independent work” or “deliver the transition warning and point to the visual.”
          </p>

          <h3 className="mt-6 text-xl font-semibold leading-snug">Step 2: Define the response</h3>
          <p className="mt-3 text-base leading-7">
            Write what an observer should see and hear. Include the beginning and end of the response. State what counts as an error. If staff cannot score the skill from the description, the description needs work.
          </p>

          <h3 className="mt-6 text-xl font-semibold leading-snug">Step 3: Ask what the routine requires</h3>
          <div className="mt-3 space-y-5 text-base leading-7">
            <p>Ask the teacher and para:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>When does this situation usually occur?</li>
              <li>What materials are already available?</li>
              <li>What part of the current routine is hardest to carry out?</li>
              <li>What would make the response possible during instruction?</li>
              <li>What should happen if the student does not respond?</li>
            </ul>
            <p>
              The answers make the training fit the classroom instead of adding another procedure that staff must remember.
            </p>
          </div>

          <h3 className="mt-6 text-xl font-semibold leading-snug">Step 4: Teach and model</h3>
          <p className="mt-3 text-base leading-7">
            Give the short instruction and checklist. Model the response once at normal speed. Model one likely mistake and the correction if that will help the trainee discriminate the important step.
          </p>

          <h3 className="mt-6 text-xl font-semibold leading-snug">Step 5: Rehearse and give feedback</h3>
          <p className="mt-3 text-base leading-7">
            Run several short role-plays. Change one detail at a time, such as the student starting the routine late or another student asking for help. After each turn, give feedback tied to the checklist and ask the trainee to try again.
          </p>

          <h3 className="mt-6 text-xl font-semibold leading-snug">Step 6: Check the routine in context</h3>
          <div className="mt-3 space-y-5 text-base leading-7">
            <p>
              Observe the skill during the actual classroom routine. Record each checklist step as correct, incorrect, or not applicable. Compare the result with the criterion you set before training. Plan a booster when the criterion is not met or when the routine changes.
            </p>
            <p>
              Training paraprofessionals to implement school interventions can improve implementation fidelity when the training is tied to a real role and a real routine. In one school study, paraprofessionals were trained to provide social interventions during unstructured school periods, and the researchers measured implementation and student social behavior. (Koegel, Kern Koegel, & Carter, 2014)
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="sample-plan">
          <h2 id="sample-plan" className="text-2xl font-semibold leading-snug">
            A sample BST plan for one skill
          </h2>
          <div className="mt-4 space-y-5 text-base leading-7">
            <p>Skill: Prompt and reinforce a break request during independent work.</p>
            <p>Setting: Independent work in a classroom with the student’s visual break card available.</p>
            <p>
              Mastery criterion: The staff member completes every critical step correctly across three role-play opportunities, then completes the steps during two observed classroom opportunities. The team may adjust this criterion when the student’s plan or safety needs require a different standard.
            </p>
          </div>

          <div className="my-6 overflow-x-auto">
            <table className="bst-table text-[#171f1d]">
              <caption>Sample behavior skills training plan</caption>
              <thead>
                <tr>
                  <th scope="col">BST part</th>
                  <th scope="col">Trainer wording and activity</th>
                  <th scope="col">What the trainer checks</th>
                </tr>
              </thead>
              <tbody>
                {planRows.map((row) => (
                  <tr key={row.part}>
                    <th scope="row" data-label="BST part" className="font-semibold">
                      {row.part}
                    </th>
                    <td data-label="Trainer wording and activity">{row.activity}</td>
                    <td data-label="What the trainer checks">{row.check}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-base leading-7">
            This example is a training plan, not a replacement for an individualized assessment,{" "}
            <a href="/behavior-intervention-plan-examples" className={linkClass}>behavior plan</a>
            {", safety plan, or team decision. The BCBA should define the target response and confirm that the procedure is appropriate for the student and setting."}
          </p>
        </section>

        <section className="mt-10" aria-labelledby="fidelity">
          <h2 id="fidelity" className="text-2xl font-semibold leading-snug">
            Fidelity checklists that staff can use
          </h2>
          <p className="mt-4 text-base leading-7">
            A fidelity checklist should fit on the page or screen staff will actually use. Put the critical steps first. Avoid scoring a long list of background information when the question is whether the intervention happened.
          </p>

          <div className="my-6 overflow-x-auto">
            <table className="bst-table text-[#171f1d]">
              <caption>Printable fidelity checklist</caption>
              <thead>
                <tr>
                  <th scope="col">Step</th>
                  <th scope="col">Yes</th>
                  <th scope="col">No</th>
                  <th scope="col">Not applicable</th>
                  <th scope="col">Brief note</th>
                </tr>
              </thead>
              <tbody>
                {fidelityRows.map((step) => (
                  <tr key={step}>
                    <th scope="row" data-label="Step" className="text-left font-semibold">
                      {step}
                    </th>
                    <td data-label="Yes">
                      <CheckField />
                    </td>
                    <td data-label="No">
                      <CheckField />
                    </td>
                    <td data-label="Not applicable">
                      <CheckField />
                    </td>
                    <td data-label="Brief note">
                      <NoteField />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-base leading-7">
            Use the checklist as a coaching tool, not a surprise inspection. Tell staff what will be observed, observe a short routine, share one strength and one next step, and schedule the next check. If several staff miss the same step, review the instruction, model, materials, or routine before deciding that the problem is staff motivation.
          </p>
          <FidelityChecklistDiagram />
        </section>

        <section className="mt-10" aria-labelledby="feedback-busy">
          <h2 id="feedback-busy" className="text-2xl font-semibold leading-snug">
            How to give feedback in a busy building
          </h2>
          <div className="mt-4 space-y-5 text-base leading-7">
            <p>
              Feedback does not need to be a long meeting. A useful coaching loop can take place in a doorway, during a planning period, or immediately after a routine:
            </p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>Describe the step you observed.</li>
              <li>Name the part that was correct.</li>
              <li>Give one specific correction if needed.</li>
              <li>Ask the staff member to rehearse the corrected step.</li>
              <li>Agree on when you will check again.</li>
            </ol>
            <p>
              Keep the feedback about the defined action. “You did not use the plan” is too broad. “The visual was available, but the cue came after the student had left the area. Let’s practice placing the visual before the transition starts” gives the person a workable next step.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="only-bcba">
          <h2 id="only-bcba" className="text-2xl font-semibold leading-snug">
            How to train many staff when you are the only BCBA
          </h2>
          <p className="mt-4 text-base leading-7">
            Train the smallest group that shares the same skill and routine. Use a group for the instruction and model, then create enough practice turns for every staff member. If time is limited, train a teacher or experienced para to use the checklist for a defined booster, while the BCBA keeps responsibility for the training standard and follow-up.
          </p>

          <aside className="my-8 rounded-[12px] border border-[#d9cdb8] bg-[#f4efe5] px-5 py-4 shadow-[inset_3px_0_0_#1f4d3f]">
            <h3 className="text-xl font-semibold leading-snug">From Rob: avoid the BCBA trap</h3>
            <p className="mt-3 text-base leading-7">
              You do not want to be the person in the chair for every assessment and training moment. You want to be the observer of the process. Otherwise, you can fall into the BCBA trap: you become the only person who can handle the behavior. Staff start saying, “She is the only one who can do it. I cannot work with him.” When staff take part in the assessment and practice the response themselves, they can leave saying, “I have got it.”
            </p>
            <p className="mt-3 text-base font-semibold">Rob Spain</p>
          </aside>

          <div className="space-y-5 text-base leading-7">
            <p>Use a pyramidal rollout when it fits the team:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>teach a small group the skill and the checklist</li>
              <li>have trained staff practice the skill with colleagues</li>
              <li>observe samples of the training and implementation</li>
              <li>correct drift with a booster</li>
            </ul>
            <p>
              Pyramidal training can extend a BCBA’s reach, but it does not remove the need to check whether the skill is taught accurately and used in the classroom. (Parsons, Rollyson, & Reid, 2013)
            </p>
            <p>
              Protect the training target from scope creep. A session about a break routine should not become a full review of every student’s behavior. Capture those questions for a separate meeting so staff leave knowing the one response they can use next.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="schedule">
          <h2 id="schedule" className="text-2xl font-semibold leading-snug">
            How to schedule staff training
          </h2>
          <div className="mt-4 space-y-5 text-base leading-7">
            <p>Build BST into existing school rhythms:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>10 minutes to define the skill and review the checklist</li>
              <li>10 minutes to model and answer questions</li>
              <li>15 minutes for each staff member to rehearse</li>
              <li>5 minutes to set the classroom observation and booster date</li>
            </ul>
            <p>
              For a larger team, run the instruction and model together, then use brief practice stations. Train new staff when the routine begins, not only during annual professional development. Recheck after a schedule change, a staff change, or a new version of the behavior plan.
            </p>
            <p>
              If coverage is difficult, use short sessions across several days. A shorter practice block with feedback is more useful than a long meeting where staff only listen. The plan should state who observes, which routine is checked, where the checklist lives, and what happens when a critical step is missed.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="measure">
          <h2 id="measure" className="text-2xl font-semibold leading-snug">
            How to measure whether training worked
          </h2>
          <div className="mt-4 space-y-5 text-base leading-7">
            <p>
              For a complete review of a training plan, check three levels. Research on BST with teachers and other professionals evaluates training performance and implementation, with student or classroom measures where relevant. (Slane & Lieberman-Betz, 2021; Courtemanche et al., 2021)
            </p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>Staff skill during rehearsal: Can the person perform the defined response in role-play?</li>
              <li>Staff fidelity in context: Does the response occur during the classroom routine?</li>
              <li>Student or classroom outcome: Does the selected student or routine show the change the team expected?</li>
            </ol>
            <p>
              Do not treat a better student outcome as proof that staff used the procedure correctly. A fidelity measure helps the team decide whether to adjust training, the intervention, or the assessment. When staff collect behavior data, train them to use the same definitions, examples, nonexamples, recording procedure, and accuracy criterion. (Cooper, Heron, & Heward, 2020, pp. 107-108)
            </p>
            <p>Review the data with the staff member. Ask:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Which step was easiest?</li>
              <li>Which step was missed most often?</li>
              <li>Did the classroom routine make the step difficult?</li>
              <li>What support would make the next attempt easier?</li>
              <li>When will we observe again?</li>
            </ul>
            <p>
              The goal is a team that can perform and maintain the routine without waiting for the BCBA to enter the room. If you are building that capacity across a full caseload, start with the{" "}
              <a href="/school-bcba" className={linkClass}>BCBA in schools</a>
              {" hub and consider the Transformation Program as a deeper systems option: "}
              <a
                href="/transformation-program?utm_source=behaviorschool&utm_medium=seo-page&utm_campaign=staff-training"
                data-cta="program-soft"
                data-cta-page="staff-training"
                className={linkClass}
              >build the system for your caseload</a>
              {"."}
            </p>
          </div>

          <nav aria-label="Related guides" className="mt-8 rounded-[12px] border border-[#d9cdb8] bg-white px-5 py-4">
            <h2 className="text-xl font-semibold leading-snug">Related guides</h2>
            <ul className="mt-2">
              <li>
                <a href="/behavior-intervention-plan-examples" className={linkClass}>
                  Behavior intervention plan examples
                </a>
              </li>
              <li>
                <a href="/fba-to-bip" className={linkClass}>
                  FBA to BIP
                </a>
              </li>
              <li>
                <a href="/functional-behavior-assessment-guide" className={linkClass}>
                  Functional behavior assessment guide
                </a>
              </li>
            </ul>
          </nav>
        </section>

        <NewsletterSignup />

        <section className="mt-10" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-semibold leading-snug">
            Frequently asked questions
          </h2>
          <div className="mt-4 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-xl font-semibold leading-snug">{faq.question}</h3>
                <p className="mt-2 text-base leading-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="build-system">
          <h2 id="build-system" className="text-2xl font-semibold leading-snug">
            Build a staff training system
          </h2>
          <p className="mt-4 text-base leading-7">
            A useful staff training plan is specific enough to use during a real school day. Define the skill, show it, let people practice, give feedback, and return to the routine to check fidelity.
          </p>
        </section>

        <ProgramCtaBlock
          campaign={campaign}
          heading="Build staff skills that hold up in the school day"
          line="The Transformation Program helps school BCBAs turn individual training moments into a repeatable system for their caseload."
        />
      </div>
    </article>
  );
}
