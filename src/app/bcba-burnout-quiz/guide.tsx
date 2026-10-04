import Link from "next/link";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ProgramCtaBlock, SoftProgramCta } from "@/components/content/ProgramCta";
import { burnoutFaqs, plantiveauSample, questions, riskBands, scaleOptions } from "./quiz-data";

const CAMPAIGN = "bcba-burnout-quiz";

const linkClass =
  "inline-flex min-h-11 items-center font-semibold text-[#1f4d3f] underline underline-offset-4 hover:text-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

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
    <div className="my-6">
      <table className="w-full border-collapse text-base leading-7 text-[#171f1d]">
        <caption className="sr-only">{caption}</caption>
        <thead className="hidden md:table-header-group">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="border border-[#d9cdb8] bg-[#f4efe5] px-3 py-3 text-left font-semibold text-[#171f1d]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[0]}
              className="mb-4 block rounded-[12px] border border-[#d9cdb8] md:mb-0 md:table-row md:rounded-none md:border-0"
            >
              {row.map((cell, index) => (
                <td key={headers[index]} className="block px-4 py-3 align-top md:table-cell md:border md:border-[#d9cdb8]">
                  <span className="mb-1 block font-semibold text-[#171f1d] md:hidden">{headers[index]}</span>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BurnoutGuide() {
  return (
    <article className="pb-4">
      <section aria-labelledby="all-questions">
        <h2 id="all-questions" className="text-2xl font-semibold leading-snug text-[#171f1d]">
          All 12 questions
        </h2>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          Every question has the same four answers. Pick the one that fits best.
        </p>
        <p className="mt-4 text-base leading-7 text-[#171f1d]">Answers and points:</p>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-base leading-7 text-[#171f1d]">
          {scaleOptions.map((option) => (
            <li key={option.value}>
              {option.label} ({option.points} {option.points === 1 ? "point" : "points"})
            </li>
          ))}
        </ul>
        <ol className="mt-6 list-decimal space-y-4 pl-6 text-base leading-7 text-[#171f1d]">
          {questions.map((question) => (
            <li key={question.id} className="pl-1">
              <p>{question.question}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[#365548]">
                {question.options.map((option) => (
                  <li key={option.value}>
                    {option.label} ({option.points} {option.points === 1 ? "point" : "points"})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section id="how-the-score-works" aria-labelledby="score-heading" className="mt-12 scroll-mt-8">
        <h2 id="score-heading" className="text-2xl font-semibold leading-snug text-[#171f1d]">
          How the score works
        </h2>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          Add the points from your 12 answers. The total runs from 0 to 36. A higher total means more burnout risk.
        </p>
        <DataTable
          caption="How the score works"
          headers={["Total score", "Risk band", "What it says"]}
          rows={riskBands.map((band) => [band.range, band.title, band.description])}
        />
      </section>

      <section aria-labelledby="burnout-looks-like" className="mt-12">
        <h2 id="burnout-looks-like" className="text-2xl font-semibold leading-snug text-[#171f1d]">
          What burnout looks like for school BCBAs
        </h2>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          A school BCBA role has its own strain points. The strain comes from how the role is set up and who is around you. Here are five patterns school BCBAs describe.
        </p>

        <h3 className="mt-8 text-xl font-semibold text-[#171f1d]">A caseload spread across buildings</h3>
        <p className="mt-3 text-base leading-7 text-[#365548]">
          Your week is split between schools, classrooms and meetings. When requests arrive faster than the hours to answer them, assessments and plans get finished halfway, and follow-up is the first thing to go. A full{" "}
          <Link href="/functional-behavior-assessment-guide" className={linkClass}>
            functional behavior assessment
          </Link>{" "}
          takes real time, and a long list of them leaves little time for anything else. The hardest part is that you can see exactly what each student needs and still cannot get to all of it.
        </p>

        <h3 className="mt-8 text-xl font-semibold text-[#171f1d]">Being the only BCBA</h3>
        <p className="mt-3 text-base leading-7 text-[#365548]">
          When you are the only BCBA, nobody down the hall can look at your graph or tell you your plan is sound. In a survey of 183 people providing behavioral services, social support at work and supervision opportunities were key predictors of both burnout and job satisfaction. The authors counted team members, certified colleagues, frequent positive contact and regular staff training as parts of a supportive workplace (Plantiveau, Dounavi, {"&"} Virues-Ortega, 2018). If you answered Often on question 10, this is the part of the quiz to take seriously.
        </p>

        <h3 className="mt-8 text-xl font-semibold text-[#171f1d]">Plans nobody runs</h3>
        <p className="mt-3 text-base leading-7 text-[#365548]">
          You write a plan. The next week it is in a binder. Cooper, Heron, and Heward define treatment integrity as the extent to which the independent variable is implemented as planned (Cooper, Heron, {"&"} Heward, 2020, p. 226). They also point out that it can be an error to read a lack of behavior change as proof that a procedure does not work, because it might have worked if it had been implemented as planned (Cooper, Heron, {"&"} Heward, 2020, p. 227). For you, that means a plan that was never carried out tells you very little, and still feels like your failure.
        </p>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          When a plan sits unused, it is worth asking who helped write it. Asking the people who will run it to help write it gives them a stake in it, and it gives you early warning about what will not fit their day. Our{" "}
          <Link href="/behavior-intervention-plan-examples" className={linkClass}>
            behavior intervention plan examples
          </Link>{" "}
          and the{" "}
          <Link href="/fba-to-bip" className={linkClass}>
            FBA to BIP guide
          </Link>{" "}
          show how to build one with the team.
        </p>

        <h3 className="mt-8 text-xl font-semibold text-[#171f1d]">Administrators who call when it is a crisis</h3>
        <p className="mt-3 text-base leading-7 text-[#365548]">
          If the only time you hear from leadership is when a student is in crisis, your week is spent reacting, and routines that could prevent the next call never get built. Question 7 asks about control over your workload and schedule, and this is often where that shows up. Ask for a short standing check-in so the first conversation of the month is not a crisis.
        </p>

        <h3 className="mt-8 text-xl font-semibold text-[#171f1d]">Taking the job home</h3>
        <figure className="my-6 rounded-[12px] border border-[#d9cdb8] border-l-4 border-l-[#1f4d3f] bg-[#f4efe5] px-5 py-4">
          <p className="text-base font-semibold text-[#1f4d3f]">From Rob</p>
          <blockquote className="mt-2 text-base leading-7 text-[#171f1d]">
            The one thing I want to prevent is anyone feeling like they have to come home and do the job they couldn&apos;t finish while they were doing their job. If that is what you are feeling right now, it is one of the most common things among school BCBAs. I have been in that spot.
          </blockquote>
          <figcaption className="mt-3 text-base font-semibold text-[#171f1d]">Rob Spain, BCBA</figcaption>
        </figure>
        <p className="text-base leading-7 text-[#365548]">
          Question 6 asks about working late or on weekends to keep up. If that one is an Often for you, the next steps below start there.
        </p>
        <SoftProgramCta campaign={CAMPAIGN} linkLabel="Build this as a system for your whole caseload">
          Plans nobody runs and requests that never stop come from how the work is set up. The Transformation Program helps you build a system for your school.
        </SoftProgramCta>
      </section>

      <section aria-labelledby="why-leave" className="mt-12">
        <h2 id="why-leave" className="text-2xl font-semibold leading-snug text-[#171f1d]">
          Why BCBAs leave the field
        </h2>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          People ask this one often: why are BCBAs leaving the field? Three published studies of behavior analysts give part of the answer. None of them looked only at schools, so read them as a sign of how common burnout is in behavior analysis, not as a school-only number.
        </p>
        <DataTable
          caption="Why BCBAs leave the field"
          headers={["Study", "Who answered", "What it found"]}
          rows={[
            [
              "Blackman, Ruby, Wine, Reed, & Li (2025)",
              "BCBAs, online anonymous survey",
              "Nearly three-quarters of respondents had left a previous job as a BCBA, and burnout was the top reason given. Pay and benefits, supervision and mentorship, collegiality, ethical violations, and training were also named.",
            ],
            [
              "Plantiveau, Dounavi, & Virues-Ortega (2018)",
              plantiveauSample,
              "About two in three had moderate to high burnout, and about one in three had little to no job satisfaction. Social support at work and supervision opportunities were key predictors.",
            ],
            [
              "Slowiak & DeLongchamp (2022)",
              "826 ABA practitioners",
              "72% reported medium to high burnout. Using self-care strategies and job-crafting practices (changing parts of your own job in response to its demands) predicted better work-life balance, more work engagement and less burnout, beyond gender and years of experience.",
            ],
          ]}
        />
        <p className="mt-4 text-base leading-7 text-[#365548]">
          A fourth study looked at therapists working in ABA schools for young children with autism. In that questionnaire study of 81 therapists, perceived supervisor support played a central role in predicting less burnout and more therapeutic self-efficacy (Gibson, Grey, {"&"} Hastings, 2009). Support from a supervisor mattered in that setting, and the question for a school BCBA is who that supervisor is when you are the only BCBA.
        </p>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          Put together, the studies point at places the quiz also asks about: support, supervision, colleagues and training. That is why the questions cover more than how tired you feel.
        </p>
      </section>

      <section aria-labelledby="read-score" className="mt-12">
        <h2 id="read-score" className="text-2xl font-semibold leading-snug text-[#171f1d]">
          How to read your score
        </h2>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          Your total is a rough guide. It is a short self-check, it is not a clinical instrument, and it cannot diagnose burnout.
        </p>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          Low, 0 to 10. You are not showing much strain right now. Keep the habits that protect you, and take the quiz again when your workload changes, such as a new caseload or a new building.
        </p>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          Moderate, 11 to 20. You are feeling some strain. Look at which items scored Often and start with one small change there. Starting early keeps the change small.
        </p>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          High, 21 to 30. Burnout risk is elevated. Pick the two items with the most points, and turn them into one concrete step each this week. Talk with a colleague or supervisor about the load itself, not only how you cope with it.
        </p>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          Severe, 31 to 36. Your stress load is very high. Make a reset plan: what comes off your plate, who you tell, and who supports you. Bring in someone outside work if you can.
        </p>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          Two items deserve a closer look at any score. Question 11 is about sleep and question 12 is about physical symptoms. If either is Often, talk with your doctor or a licensed mental health professional. In the United States you can call or text{" "}
          <a href="tel:988" className={linkClass}>
            988
          </a>{" "}
          at any time if you are in distress.
        </p>
      </section>

      <section aria-labelledby="next-steps" className="mt-12">
        <h2 id="next-steps" className="text-2xl font-semibold leading-snug text-[#171f1d]">
          Next steps that fit a school week
        </h2>
        <ol className="mt-4 list-decimal space-y-4 pl-6 text-base leading-7 text-[#365548]">
          <li className="pl-1">
            Find your top two items. Look back at the questions where you answered Often. Those two items are your starting point, not all twelve.
          </li>
          <li className="pl-1">
            Write down what comes home with you. For one week, list every task you do after you leave the building. Choose one to finish at work, hand off, or stop.
          </li>
          <li className="pl-1">
            Sort your requests. Put each new request into one of four groups: a quick consult, targeted support, a full assessment, or coaching for staff. Protect time for the full assessments first.
          </li>
          <li className="pl-1">
            Make one plan simpler. Pick the plan that is not being run and cut it down. Cooper, Heron, and Heward note that a simple, brief treatment will probably be applied more accurately and consistently than a complex, extended one (Cooper, Heron, {"&"} Heward, 2020, p. 227). Then train the people who run it and check back with them. Our guides on behavior data systems and staff training for school teams are coming soon.
          </li>
          <li className="pl-1">
            Find one peer. Ask another BCBA, a school psychologist you trust, or a mentor to look at a graph with you every month. The research above links social support and supervision to lower burnout. You can also join the free{" "}
            <a href="https://community.behaviorschool.com" className={linkClass} rel="noopener noreferrer">
              school BCBA community
            </a>
            .
          </li>
          <li className="pl-1">
            Get help for sleep and body signs. If question 11 or 12 is Often, see a doctor or a licensed mental health professional.
          </li>
        </ol>
        <p className="mt-4 text-base leading-7 text-[#365548]">
          If you want a longer read on staying well in this work, you can also take the free{" "}
          <Link href="/bcba-burnout-quiz/playbook" className={linkClass}>
            self-care playbook
          </Link>
          . For the full picture of the role, start with{" "}
          <Link href="/school-bcba" className={linkClass}>
            BCBA in schools
          </Link>
          .
        </p>
      </section>

      <div className="mt-12">
        <p className="text-base leading-7 text-[#365548]">
          Want something smaller to start with? The Weekly Research Brief sends two open full-text studies, the limits of each, and one practical next step for school BCBAs.
        </p>
        <NewsletterSignup />
      </div>

      <section aria-labelledby="faq-heading" className="mt-12">
        <h2 id="faq-heading" className="text-2xl font-semibold leading-snug text-[#171f1d]">
          Questions about burnout and this quiz
        </h2>
        <div className="mt-6 space-y-8">
          {burnoutFaqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-xl font-semibold text-[#171f1d]">{faq.question}</h3>
              <p className="mt-2 text-base leading-7 text-[#365548]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <ProgramCtaBlock
        campaign={CAMPAIGN}
        heading="Build a school BCBA system that fits inside the workday"
        line="The Transformation Program helps you set up referral triage, staff coaching and plan follow-through for your school."
      />
    </article>
  );
}
