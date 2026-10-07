import type { ReactNode } from "react";
import Link from "next/link";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  CtaClickTracker,
  ProgramCtaBlock,
  SoftProgramCta,
} from "@/components/content/ProgramCta";
import { CaseloadSystemLink } from "./CaseloadSystemLink";
import { SchoolBcbaRoleMap } from "./diagrams";

const CAMPAIGN = "school-bcba";
const CANONICAL = "https://behaviorschool.com/school-bcba";
const BUILD_DATE = new Date().toISOString();
const PERSON_ID = "https://robspain.com/#robert-spain";

const META_DESCRIPTION =
  "What a BCBA does in schools, what it pays (BLS and a posted district schedule), and how to get hired and get through year one.";

const linkClass =
  "inline-block max-w-full min-h-11 py-2 font-semibold text-[#1f4d3f] underline underline-offset-4 hover:text-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

const h2Class = "mt-12 scroll-mt-8 text-2xl font-semibold leading-snug text-[#171f1d]";
const h3Class = "mt-8 scroll-mt-8 text-xl font-semibold leading-snug text-[#171f1d]";
const pClass = "mt-4 text-base leading-7 text-[#171f1d]";
const ulClass = "mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-[#171f1d]";
const olClass = "mt-4 list-decimal space-y-3 pl-6 text-base leading-7 text-[#171f1d]";
const thClass =
  "border-b border-[#d9cdb8] bg-[#1f4d3f] px-4 py-3 text-left align-top text-base font-semibold text-[#fbfaf6]";
const tdClass =
  "border-b border-[#d9cdb8] bg-white px-4 py-3 align-top text-base leading-6 text-[#171f1d]";

const faqs = [
  {
    question: "What is a school BCBA?",
    answer:
      "A school BCBA is a Board Certified Behavior Analyst who works in a public school or district to support students, staff and school systems. Some are full-time district employees and others are contractors from an agency (Copeland et al., 2025). Surveyed school behavior analysts said their roles often include coaching, professional development, supervision, administration and programming for both special education and general education students (Layden et al., 2024).",
  },
  {
    question: "Can BCBAs work in schools?",
    answer:
      "Yes. Educational settings are the second largest area of professional emphasis for behavior analysts (Copeland et al., 2025). Whether a school provides ABA services to a student is a team decision based on whether the student needs them to receive a free appropriate public education (Connecticut State Department of Education, 2025, p. iii). Credential and contract requirements vary by state and district, so check the posting.",
  },
  {
    question: "What does a behavior analyst do in schools?",
    answer:
      "Common roles are assessment, data collection and analysis, training and supervision, and intervention, including classroom management and systems work such as PBIS and MTSS (Connecticut State Department of Education, 2025, p. 4). BCBAs are also often called to respond to escalated behavior, so the role needs written limits and a communication plan with the supervisor (Connecticut State Department of Education, 2025, p. 5).",
  },
  {
    question: "Do BCBAs get paid more than teachers?",
    answer:
      "It depends on the pay schedule your district uses. The US Bureau of Labor Statistics reports a May 2025 national median of $63,970 for elementary school teachers, except special education. One posted district schedule (2022-23, 182 days) lists BCBAs from $73,956.48 at step 1 to $96,412.09 at step 10. A national median and one district schedule are different kinds of numbers, and we found no published national average for school BCBAs, so compare against your own district's teacher schedule.",
  },
  {
    question: "Why are BCBAs leaving the field?",
    answer:
      "Research points to burnout first. In one survey, nearly three-quarters of respondents had left a previous job as a BCBA, and burnout was the top contributor, followed by pay and benefits, supervision and mentorship, collegiality, ethical violations, and training (Blackman et al., 2024). Another survey found that social support at work and supervision opportunities were key predictors of burnout (Plantiveau et al., 2018). Those studies measured job turnover and burnout among behavior analysts, not school BCBAs specifically.",
  },
  {
    question: "Who gets paid more, BCBA or school psychologist?",
    answer:
      "It depends on the district. The US Bureau of Labor Statistics reports a May 2025 national median of $95,990 for school psychologists. One posted district BCBA schedule runs from $73,956.48 to $96,412.09 across ten steps, so a BCBA there earns less than that national median at the bottom step and about the same at the top step. The two roles overlap in training and responsibilities (Snyder et al., 2024).",
  },
] as const;

const jumpLinks = [
  ["What is a school BCBA?", "what-is-a-school-bcba"],
  ["Can BCBAs work in schools?", "can-bcbas-work-in-schools"],
  ["What a behavior analyst does", "what-does-a-behavior-analyst-do-in-schools"],
  ["A day in the role", "a-day-as-a-bcba-in-schools"],
  ["Clinic vs school", "bcba-in-schools-vs-clinic-aba"],
  ["Pay", "do-bcbas-get-paid-more-than-teachers"],
  ["Leaving the field", "why-are-bcbas-leaving-the-field"],
  ["Four problems and fixes", "four-problems-school-bcbas-describe-and-a-fix-for-each"],
  ["Getting hired", "how-to-get-hired-as-a-bcba-in-schools"],
  ["Your first year", "your-first-year-as-a-bcba-in-schools"],
] as const;

function InLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}

function OutLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={linkClass} rel="noopener noreferrer">
      {children}
    </a>
  );
}

function DataTable({
  caption,
  label,
  children,
}: {
  caption: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={label}
      className="my-6 overflow-x-auto rounded-[12px] border border-[#d9cdb8] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]"
    >
      <p className="border-b border-[#d9cdb8] bg-[#fbfaf6] px-4 py-3 text-base leading-6 text-[#365548] md:hidden">
        Scroll sideways to see every column.
      </p>
      <table className="w-full min-w-[44rem] caption-top border-collapse text-left text-base text-[#171f1d]">
        <caption className="bg-[#f4efe5] px-4 py-3 text-left text-base font-semibold leading-7 text-[#171f1d]">
          {caption}
        </caption>
        {children}
      </table>
    </div>
  );
}

function schemaJson() {
  const about =
    "Rob Spain, M.S., BCBA, IBA, writes and teaches about school BCBA systems. As listed on robspain.com: he has been a BCBA since September 2011, holds the International Behavior Analyst certification (May 2024), has over 25 years in schools, and is adjunct faculty at Fresno Pacific University. He founded Behavior School and is part of a team that leads district-wide Behavior Intervention Supports.";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "BCBA in Schools",
        description: META_DESCRIPTION,
        author: { "@id": PERSON_ID },
        publisher: {
          "@type": "Organization",
          name: "Behavior School",
          url: "https://behaviorschool.com",
        },
        datePublished: BUILD_DATE,
        dateModified: BUILD_DATE,
        mainEntityOfPage: CANONICAL,
        url: CANONICAL,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
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
            item: CANONICAL,
          },
        ],
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Robert Spain",
        jobTitle: "BCBA",
        url: "https://robspain.com/",
        sameAs: ["https://robspain.com/"],
        description: about,
      },
    ],
  };
}

export function HubContent() {
  return (
    <article className="bg-[#fbfaf6] text-[#171f1d]">
      <CtaClickTracker />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base">
            <li>
              <InLink href="/">Home</InLink>
            </li>
            <li aria-hidden="true" className="text-[#365548]">
              &gt;
            </li>
            <li>
              <span aria-current="page" className="inline-flex min-h-11 items-center font-semibold text-[#171f1d]">
                BCBA in schools
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#171f1d]">BCBA in Schools</h1>
        <p className={pClass}>
          If you are searching for BCBA jobs in schools, you are probably in one of two spots. You are a clinic or home BCBA wondering what a school job really looks like. Or you just started in a school and the plans you write are not getting run. This page covers both.
        </p>
        <p className={pClass}>
          It answers the questions people ask most, shows what the job pays using public sources, and ends with a first-year plan. Every pay and research number comes from a linked source. Where we could not find a published number, we say so.
        </p>

        <section aria-labelledby="the-short-answer">
          <h2 id="the-short-answer" className={h2Class}>
            The short answer
          </h2>
          <ul className={ulClass}>
            <li>Yes. BCBAs work in schools as district employees or as contractors (Copeland et al., 2025).</li>
            <li>
              Much of the work runs through other adults: assessment, data, training and support for teams (Connecticut State Department of Education [CSDE], 2025, p. 4; Layden et al., 2024).
            </li>
            <li>Pay depends on the schedule your district places you on. See the pay sections below.</li>
            <li>
              The hard parts are plans that do not get run, being the only BCBA in the building, and being pulled into crisis. Each one has a fix further down.
            </li>
          </ul>
          <nav aria-label="On this page" className="mt-6">
            <p className="text-base font-semibold leading-7 text-[#171f1d]">On this page:</p>
            <ul className="mt-2 flex flex-col">
              {jumpLinks.map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <section aria-labelledby="what-is-a-school-bcba">
          <h2 id="what-is-a-school-bcba" className={h2Class}>
            What is a school BCBA?
          </h2>
          <p className={pClass}>
            A school BCBA is a Board Certified Behavior Analyst who works in a public school or district to support students, staff and the systems around them. Some are full-time district employees. Others are contractors who come in from an agency (Copeland et al., 2025).
          </p>
          <p className={pClass}>
            School behavior analysts surveyed in one state reported that their roles often include coaching and professional development, supervision and administration tasks, and programming for both special education and general education students, with less emphasis on direct work with students (Layden et al., 2024).
          </p>
          <p className={pClass}>
            Job posts use several names for the same role. <InLink href="/school-bcba/vs-school-based-bcba">Here is how the role names compare</InLink>.
          </p>
        </section>

        <section aria-labelledby="can-bcbas-work-in-schools">
          <h2 id="can-bcbas-work-in-schools" className={h2Class}>
            Can BCBAs work in schools?
          </h2>
          <p className={pClass}>
            Yes. Educational settings are the second largest area of professional emphasis for behavior analysts (Copeland et al., 2025).
          </p>
          <p className={pClass}>
            Whether a school provides ABA services to a particular student is a team decision. Connecticut&apos;s state guidance notes that schools are not required to provide ABA services unless the planning and placement team decides a student needs them to receive a free appropriate public education (CSDE, 2025, p. iii).
          </p>
          <p className={pClass}>
            What a posting requires can vary by state and district, including the credential and the contract type. Read the posting closely, and ask the district which credential and which pay schedule apply to the job.
          </p>
        </section>

        <section aria-labelledby="what-does-a-behavior-analyst-do-in-schools">
          <h2 id="what-does-a-behavior-analyst-do-in-schools" className={h2Class}>
            What does a behavior analyst do in schools?
          </h2>
          <p className={pClass}>
            Connecticut&apos;s state guidance for BCBAs in schools lists the common roles (CSDE, 2025, p. 4). The map below shows the five areas and the people you work through.
          </p>
          <SchoolBcbaRoleMap />
          <p className={pClass}>Here is the same map as a list:</p>
          <ul className={ulClass}>
            <li>
              <strong>Assessment.</strong> Lead or support teams in functional behavior assessments and other behavior-related assessments (CSDE, 2025, p. 4). Our <InLink href="/functional-behavior-assessment-guide">functional behavior assessment guide</InLink> walks through the process.
            </li>
            <li>
              <strong>Data collection and analysis.</strong> Help teams collect and analyze data on interventions, IEPs, skill programs, and classwide, schoolwide or districtwide initiatives (CSDE, 2025, p. 4).
            </li>
            <li>
              <strong>Training.</strong> Supervise BCaBAs, RBTs or other educators who carry out behavior analytic services, and provide coaching and professional development for educators and families (CSDE, 2025, p. 4).
            </li>
            <li>
              <strong>Intervention.</strong> Design and carry out services based on assessments and data, provide direct service to students, help teams set up classrooms that use behavior strategies well, and join teams that run systems work such as PBIS and MTSS (CSDE, 2025, p. 4).
            </li>
            <li>
              <strong>Crisis response.</strong> BCBAs are often called when behavior has escalated beyond what the educators involved can manage. The state guidance says a BCBA and their supervisor need a clear system of communication, so that crisis response does not keep the BCBA from the agreed role. It also says a BCBA is typically more impactful with time to develop interventions that prevent unsafe behavior than when responding to it (CSDE, 2025, p. 5).
            </li>
          </ul>
          <p className={pClass}>
            You will share this work with other people, including school psychologists. A survey found that BCBAs and school psychologists have overlapping training and responsibilities, and that BCBAs were more likely to name differing philosophies as a barrier to working together (Snyder et al., 2024). Rob Spain&apos;s <OutLink href="https://robspain.com/bcba-in-schools/">BCBA in schools guide on robspain.com</OutLink> lists the same partners and explains how the school setting changes the job.
          </p>
          <SoftProgramCta campaign={CAMPAIGN} linkLabel="See how the program works">
            Plans nobody runs and a calendar full of crisis calls are hard to fix one plan at a time. The Transformation Program builds one shared system for your whole caseload.
          </SoftProgramCta>
        </section>

        <section aria-labelledby="a-day-as-a-bcba-in-schools">
          <h2 id="a-day-as-a-bcba-in-schools" className={h2Class}>
            A day as a BCBA in schools
          </h2>
          <DataTable
            label="A day as a BCBA in schools"
            caption="There is no single typical day. This sketch uses the roles above to show how the pieces fit into one school day. It is an illustration, not survey data."
          >
            <thead>
              <tr>
                <th scope="col" className={thClass}>When</th>
                <th scope="col" className={thClass}>What it can look like</th>
                <th scope="col" className={thClass}>Role from the map</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Before the first bell</td>
                <td className={tdClass}>Check messages for new referrals and crisis follow-ups. Look at yesterday&apos;s data for one student.</td>
                <td className={tdClass}>Data</td>
              </tr>
              <tr>
                <td className={tdClass}>Morning</td>
                <td className={tdClass}>Sit in a classroom for part of a lesson and take notes on what happens before and after the behavior.</td>
                <td className={tdClass}>Assessment</td>
              </tr>
              <tr>
                <td className={tdClass}>Late morning</td>
                <td className={tdClass}>Check in with a teacher on which plan steps are hard to fit into the routine, and adjust the steps.</td>
                <td className={tdClass}>Training</td>
              </tr>
              <tr>
                <td className={tdClass}>Lunch window</td>
                <td className={tdClass}>Quick check-in with a paraprofessional on one step of a plan.</td>
                <td className={tdClass}>Training</td>
              </tr>
              <tr>
                <td className={tdClass}>Afternoon</td>
                <td className={tdClass}>IEP team meeting, or an interview with staff for a functional behavior assessment.</td>
                <td className={tdClass}>Assessment</td>
              </tr>
              <tr>
                <td className={tdClass}>Any time</td>
                <td className={tdClass}>A call about a student in crisis. Agree in advance with your supervisor when you respond (CSDE, 2025, p. 5).</td>
                <td className={tdClass}>Crisis response</td>
              </tr>
              <tr>
                <td className={tdClass}>End of day</td>
                <td className={tdClass}>Graph the day&apos;s data and decide who you will check on tomorrow.</td>
                <td className={tdClass}>Data</td>
              </tr>
            </tbody>
          </DataTable>
          <p className={pClass}>
            Time is the limit on all of it. The state guidance lists four things that decide how many students one BCBA can support: how much BCBA service is written into each IEP, how much support and training staff and families need, whether the BCBA has to create separate instruction for the student, and how much the behavior is a safety risk (CSDE, 2025, p. 5). A BCBA who supports students with high service levels, frequent contact and unsafe behavior can support fewer students than one working with students whose needs are less intense (CSDE, 2025, p. 5).
          </p>
          <p className={pClass}>One part of the job can trip up a new school BCBA: the word data.</p>
          {/* Approved story 8: the data shirts */}
          <blockquote className="my-6 rounded-r-[12px] border-l-4 border-[#1f4d3f] bg-[#f4efe5] px-4 py-4">
            <p className="text-base leading-7 text-[#171f1d]">
              Data is sometimes a difficult word for people to handle. Say data to teachers or special education staff who were never required to collect it before, and some of them run the other direction. And then a BCBA walks in and says, I want you to collect data. I think I made the mistake of saying data so many times that when I moved to a new district, they made me shirts with hashtag data across the front. Like, this guy will not shut up about data.
            </p>
            <footer className="mt-3 text-base font-semibold text-[#171f1d]">From Rob Spain</footer>
          </blockquote>
          <p className={pClass}>
            Our suggestion: ask for the smallest count that answers one question, and show the teacher what you did with it the next week.
          </p>
        </section>

        <section aria-labelledby="bcba-in-schools-vs-clinic-aba">
          <h2 id="bcba-in-schools-vs-clinic-aba" className={h2Class}>
            BCBA in schools vs clinic ABA
          </h2>
          <p className={pClass}>
            Moving from clinic or home work to a school changes who carries out the plan, who decides what you do, and who you can ask for help. Rob puts it this way:
          </p>
          {/* Approved story R2-C1 */}
          <blockquote className="my-6 rounded-r-[12px] border-l-4 border-[#1f4d3f] bg-[#f4efe5] px-4 py-4">
            <p className="text-base leading-7 text-[#171f1d]">
              &quot;a lot of the things you&apos;ll do in other settings, like home or clinic, you try to bring that into a school and they&apos;re going to look at you like you&apos;re from outer space.&quot;
            </p>
            <footer className="mt-3 text-base font-semibold text-[#171f1d]">Rob Spain</footer>
          </blockquote>
          <DataTable
            label="BCBA in schools compared with clinic ABA"
            caption="The table compares the two. The school column is sourced. The clinic or home column describes a common pattern and is not from a survey."
          >
            <thead>
              <tr>
                <th scope="col" className={thClass}>What changes</th>
                <th scope="col" className={thClass}>Clinic or home (common pattern)</th>
                <th scope="col" className={thClass}>School</th>
                <th scope="col" className={thClass}>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Who carries out the plan</td>
                <td className={tdClass}>Technicians or caregivers you train and supervise</td>
                <td className={tdClass}>Teachers, paraprofessionals and other staff who have other jobs. Simple, standard plans are easier to carry out as planned</td>
                <td className={tdClass}>Fiske (2008); Cooper et al. (2020, p. 227)</td>
              </tr>
              <tr>
                <td className={tdClass}>What decides whether you serve a student</td>
                <td className={tdClass}>The agency and the service agreement</td>
                <td className={tdClass}>The planning or IEP team decides whether a student needs behavior analytic services to receive a free appropriate public education</td>
                <td className={tdClass}>CSDE (2025, p. iii)</td>
              </tr>
              <tr>
                <td className={tdClass}>What your week holds</td>
                <td className={tdClass}>Direct sessions and treatment plans for a client list</td>
                <td className={tdClass}>Coaching, professional development, supervision and administration, and programming for special education and general education students, often with less direct work with students</td>
                <td className={tdClass}>Layden et al. (2024)</td>
              </tr>
              <tr>
                <td className={tdClass}>Preparation</td>
                <td className={tdClass}>Many trainees complete supervised hours in clinic, community or home settings</td>
                <td className={tdClass}>Most surveyed behavior analysts said their initial training gave no or minimal preparation in school-specific areas such as IEP teams and educational law</td>
                <td className={tdClass}>Syed (n.d.); Copeland et al. (2025)</td>
              </tr>
              <tr>
                <td className={tdClass}>Colleagues nearby</td>
                <td className={tdClass}>Varies by employer</td>
                <td className={tdClass}>It is not uncommon to work with little or no support from other BCBAs in the district</td>
                <td className={tdClass}>Layden (2022)</td>
              </tr>
              <tr>
                <td className={tdClass}>Crisis</td>
                <td className={tdClass}>Varies by program</td>
                <td className={tdClass}>BCBAs are often called in when behavior escalates, so the role needs written limits</td>
                <td className={tdClass}>CSDE (2025, p. 5)</td>
              </tr>
            </tbody>
          </DataTable>
          <p className={pClass}>
            If you are leaving clinic work because of burnout, a school job is not a guaranteed fix. The burnout research below covers behavior analysts in general, and support at work predicted burnout (Plantiveau et al., 2018). Ask the support questions in the hiring section.
          </p>
          <p className={pClass}>
            If you are coming from a clinic, read our <InLink href="/school-bcba/first-90-days">first 90 days guide</InLink> before your first week.
          </p>
        </section>

        <section aria-labelledby="do-bcbas-get-paid-more-than-teachers">
          <h2 id="do-bcbas-get-paid-more-than-teachers" className={h2Class}>
            Do BCBAs get paid more than teachers?
          </h2>
          <p className={pClass}>
            It depends on the pay schedule your district puts you on. We could not find a national average for school BCBAs from the US Bureau of Labor Statistics or a published survey, so this page does not quote one.
          </p>
          <DataTable
            label="Public pay figures"
            caption="Here are the public numbers we can stand behind."
          >
            <thead>
              <tr>
                <th scope="col" className={thClass}>Source</th>
                <th scope="col" className={thClass}>Role</th>
                <th scope="col" className={thClass}>Pay</th>
                <th scope="col" className={thClass}>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>
                  <OutLink href="https://www.bls.gov/ooh/education-training-and-library/kindergarten-and-elementary-school-teachers.htm">
                    US Bureau of Labor Statistics, OEWS, May 2025
                  </OutLink>
                </td>
                <td className={tdClass}>Elementary school teachers, except special education</td>
                <td className={tdClass}>Median $63,970 a year</td>
                <td className={tdClass}>National median</td>
              </tr>
              <tr>
                <td className={tdClass}>
                  <OutLink href="https://www.bls.gov/oes/current/oes193034.htm">
                    US Bureau of Labor Statistics, OEWS, May 2025
                  </OutLink>
                </td>
                <td className={tdClass}>School psychologists</td>
                <td className={tdClass}>Median $95,990 a year</td>
                <td className={tdClass}>National median</td>
              </tr>
              <tr>
                <td className={tdClass}>
                  <OutLink href="https://campussuite-storage.s3.amazonaws.com/prod/1559102/7e7aafe8-8889-11ec-b4d9-0ee6196e6f9b/2598863/ba5bb24a-f986-11ed-8454-020afe8adb75/file/Counselor_BCBA%20Salary%20Schedule%2022-23.pdf">
                    Curtis Creek School District salary schedule, 2022-23, board approved May 9, 2023
                  </OutLink>
                </td>
                <td className={tdClass}>Board Certified Behavior Analyst, 182 days</td>
                <td className={tdClass}>Step 1 $73,956.48 to step 10 $96,412.09</td>
                <td className={tdClass}>One district. The same schedule lists counselors at $71,279.52 to $93,003.60, plus $1,100 for a master&apos;s</td>
              </tr>
            </tbody>
          </DataTable>
          <p className={pClass}>
            National medians and one district&apos;s schedule are different kinds of numbers. Use them as reference points, not as a ranking.
          </p>
          <p className={pClass}>
            On that one schedule, a BCBA at step 1 ($73,956.48) is above the national median for elementary teachers ($63,970). The comparison has limits: the schedule is from 2022-23, the median is from May 2025, and teacher pay varies by district. Compare against your own district&apos;s teacher schedule. On the same schedule, the BCBA column runs about $2,700 above the counselor column at step 1 and about $3,400 above at step 10 (our subtraction from the posted figures).
          </p>
          <p className={pClass}>Where the district places you matters as much as the title. Before you accept an offer, ask:</p>
          <ul className={ulClass}>
            <li>Which salary schedule am I on: the teacher schedule, an administrator schedule, or a separate BCBA schedule?</li>
            <li>How many contract days are there, and is summer pay an option?</li>
            <li>Is there a stipend for the credential or for supervising others?</li>
            <li>Who is my supervisor, and who evaluates me?</li>
            <li>Is my role written down, and does it match the posting? (CSDE, 2025, p. 4)</li>
          </ul>
          <p className={pClass}>
            Our <InLink href="/school-bcba/salary-by-state">salary by state page</InLink> has a state-by-state view. Check any figure there against a posted schedule or job posting.
          </p>
        </section>

        <section aria-labelledby="who-gets-paid-more-bcba-or-school-psychologist">
          <h2 id="who-gets-paid-more-bcba-or-school-psychologist" className={h2Class}>
            Who gets paid more, BCBA or school psychologist?
          </h2>
          <p className={pClass}>
            There is no fixed answer. Nationally, school psychologists had a median of $95,990 in May 2025 (US Bureau of Labor Statistics). The one posted district schedule above runs from $73,956.48 to $96,412.09 across its ten BCBA steps, so a BCBA at the bottom step of that schedule earns less than the national school psychologist median and a BCBA at the top step earns about the same. Your district&apos;s schedules decide it.
          </p>
          <p className={pClass}>The two roles also overlap in training and in the work (Snyder et al., 2024).</p>
        </section>

        <section aria-labelledby="why-are-bcbas-leaving-the-field">
          <h2 id="why-are-bcbas-leaving-the-field" className={h2Class}>
            Why are BCBAs leaving the field?
          </h2>
          <p className={pClass}>
            There is no single reason, and we found no published turnover figure for school BCBAs in particular. Here is what the research on behavior analysts says.
          </p>
          <ul className={ulClass}>
            <li>
              <strong>Burnout leads the list.</strong> In a survey of BCBAs, nearly three-quarters of respondents had left a previous job as a BCBA, and burnout was the top contributor. Pay and benefits, supervision and mentorship, collegiality and professional relationships, ethical violations, and training and professional development were also named (Blackman et al., 2024). This survey asked about leaving a job. It did not measure leaving the field.
            </li>
            <li>
              <strong>Support at work predicts burnout.</strong> In a survey of 183{" "}practitioners who provide behavioral services, about two in three reported moderate to high burnout. Social support at work and supervision opportunities were key predictors of burnout. The authors described a supportive workplace as one with several team members, certified professionals, frequent positive interactions, and frequent relevant staff training (Plantiveau et al., 2018).
            </li>
            <li>
              <strong>Many school BCBAs work alone.</strong> It is not uncommon for BCBAs in public schools to work with little or no support from other BCBAs in their district. The author of one statewide network paper names retention of BCBAs in schools as an area to study (Layden, 2022).
            </li>
          </ul>
          <p className={pClass}>
            Those findings line up with the solo placements and missing training described in the next section. That match is our reading, not a finding from these studies.
          </p>
          <p className={pClass}>
            If you are feeling this now, take the free <InLink href="/bcba-burnout-quiz">BCBA burnout quiz</InLink> or read our article on <InLink href="/blog/school-bcba-burnout-and-workload">school BCBA burnout and workload</InLink>.
          </p>
        </section>

        <section aria-labelledby="four-problems-school-bcbas-describe-and-a-fix-for-each">
          <h2 id="four-problems-school-bcbas-describe-and-a-fix-for-each" className={h2Class}>
            Four problems school BCBAs describe, and a fix for each
          </h2>
          <p className={pClass}>
            These four show up in BCBA forum threads and in the research. Each one has something you can do this month.
          </p>

          <h3 className={h3Class}>Pain point 1: plans nobody runs</h3>
          <p className={pClass}>
            <strong>What it looks like.</strong> You write a plan. A few weeks later the steps are not happening.
          </p>
          <p className={pClass}>
            <strong>Why it happens.</strong> Plans are carried out by people with full jobs. Treatment integrity is the extent to which a plan is implemented as planned (Cooper et al., 2020, p. 226). In consultation research, many teacher consultees struggle to implement interventions (Hagermoser Sanetti et al., 2015). Training alone may not be enough. In a study Cooper and colleagues describe, two one-hour training sessions on a token economy did not produce high levels of implementation by three teachers, and checklist accuracy rose and stayed high once self-monitoring was added (Cooper et al., 2020, p. 662).
          </p>
          <p className={pClass}>
            <strong>The fix.</strong>
          </p>
          <ol className={olClass}>
            <li>Keep the steps simple and standard. Simplifying and standardizing the plan, and giving criterion-based training and practice to the people who will carry it out, enhance treatment integrity (Cooper et al., 2020, p. 227).</li>
            <li>Plan the logistics with the teacher. In one study, Implementation Planning (adapting steps to the context, detailed logistics, and naming barriers with strategies for each) raised teachers&apos; adherence and quality compared with standard consultation (Hagermoser Sanetti et al., 2015).</li>
            <li>Check the steps after training, then give feedback. Performance feedback is highly effective for increasing and maintaining teacher implementation of behavior plans (Fiske, 2008).</li>
          </ol>
          <p className={pClass}>
            Start with our <InLink href="/behavior-intervention-plan-examples">behavior intervention plan examples</InLink>, which show plans written so staff can run them.
          </p>

          <h3 className={h3Class}>Pain point 2: being the only BCBA in the building</h3>
          <p className={pClass}>
            <strong>What it looks like.</strong> Nobody to ask, and every behavior question comes to you.
          </p>
          <p className={pClass}>
            <strong>Why it happens.</strong> It is not uncommon for BCBAs in public schools to work with little or no support from other BCBAs in the district (Layden, 2022). Low collegial support is tied to higher burnout (Plantiveau et al., 2018).
          </p>
          <p className={pClass}>
            <strong>The fix.</strong>
          </p>
          <ol className={olClass}>
            <li>Build your own peer line. One statewide network was created for school BCBAs to have a peer network, continuing education and a place for scholarship (Layden, 2022). Look for the equivalent through your state association.</li>
            <li>
              Train the adults around you so that every behavior question does not route through you. Rob Spain&apos;s <OutLink href="https://robspain.com/bcba-in-schools/">BCBA in schools guide</OutLink> frames the goal as building capacity in the staff.
            </li>
            <li>Teach the steps of a plan with criterion-based training and practice (Cooper et al., 2020, p. 227), then give feedback (Fiske, 2008). Our page on behavior skills training for school staff is not live yet.</li>
          </ol>

          <h3 className={h3Class}>Pain point 3: credentials without knowing the building</h3>
          <p className={pClass}>
            <strong>What it looks like.</strong> You know behavior analysis. You do not yet know IEP timelines, who owns what on the team, or how the school day runs.
          </p>
          <p className={pClass}>
            <strong>Why it happens.</strong> In a survey of 116 behavior analysts, most respondents said their initial training gave no or minimal preparation in areas such as IEP teams, educational law and case law, and grade-level and alternate standards. Respondents who had school fieldwork rated their confidence higher (Copeland et al., 2025). One BCBA ethics writer says school BCBAs need to learn IDEA and FERPA, how IEPs work, the culture of their schools, and the time limits teachers work under (Syed, n.d.).
          </p>
          <p className={pClass}>
            <strong>The fix.</strong>
          </p>
          <ol className={olClass}>
            <li>In your first weeks, learn four things: the IEP process, your state&apos;s timeline for functional behavior assessments and plans, who owns each step on the team, and the school&apos;s daily schedule.</li>
            <li>Ask for a mentor inside the building. Respondents named on-the-job mentorship from other professionals in the school, such as a school psychologist, as a help (Copeland et al., 2025).</li>
            <li>
              Learn the assessment process as schools run it. See our <InLink href="/functional-behavior-assessment-guide">functional behavior assessment guide</InLink>. Our page on ABC data systems for school teams is not live yet.
            </li>
          </ol>

          <h3 className={h3Class}>Pain point 4: admin who only calls you in a crisis</h3>
          <p className={pClass}>
            <strong>What it looks like.</strong> Your calendar fills with crisis calls and there is no time left for prevention.
          </p>
          <p className={pClass}>
            <strong>Why it happens.</strong> BCBAs are often called to respond when behavior escalates, and the state guidance says the BCBA is typically more impactful with time to build prevention than when responding (CSDE, 2025, p. 5). One ethics writer reports that administrators have asked BCBAs to take on 40 to 50 students (Syed, n.d.).
          </p>
          <p className={pClass}>
            <strong>The fix.</strong>
          </p>
          <ol className={olClass}>
            <li>Get the role in writing. The state guidance says BCBAs and their supervisors should co-create a clear, comprehensive written description of the BCBA&apos;s roles and responsibilities in the district (CSDE, 2025, p. 4).</li>
            <li>Agree on a crisis communication plan with your supervisor, so responding does not crowd out the agreed role (CSDE, 2025, p. 5).</li>
            <li>Show where your hours go. Time samples of each part of the day help administrators who may not see the work behind each student (Syed, n.d.).</li>
            <li>
              Move requests for help from crisis to planning. Our <InLink href="/fba-to-bip">FBA to BIP guide</InLink> shows one repeatable path from assessment to plan.
            </li>
          </ol>
        </section>

        <section aria-labelledby="how-to-get-hired-as-a-bcba-in-schools">
          <h2 id="how-to-get-hired-as-a-bcba-in-schools" className={h2Class}>
            How to get hired as a BCBA in schools
          </h2>
          <ol className={olClass}>
            <li>
              <strong>Read the posting for the real job.</strong> Titles vary. Match the duties to the role map above: assessment, data, training, intervention and systems work. Our <InLink href="/school-bcba/job-description">school BCBA job description</InLink> shows what duties and skills a district may list.
            </li>
            <li>
              <strong>Ask the pay questions</strong> from the pay section before you accept.
            </li>
            <li>
              <strong>Bring work samples with student details removed.</strong> Good choices are an assessment summary, a plan with steps written for staff, a graph with a line showing how often the steps were done, and an outline of a staff training. The <InLink href="/school-bcba/job-guide">school BCBA job guide</InLink> lists the work samples districts look for.
            </li>
            <li>
              <strong>Practice the interview.</strong> See the <InLink href="/school-bcba/interview-questions">school BCBA interview questions</InLink> with answer themes.
            </li>
            <li>
              <strong>Know the pathway.</strong> If you are not yet certified, <InLink href="/school-bcba/how-to-become">how to become a school BCBA</InLink> walks from coursework to certification to your first school role.
            </li>
            <li>
              <strong>Ask about support.</strong> Ask who else in the district is a BCBA, who you report to, and whether the role is written down. Support at work and supervision predict burnout (Plantiveau et al., 2018).
            </li>
          </ol>
        </section>

        <section aria-labelledby="your-first-year-as-a-bcba-in-schools">
          <h2 id="your-first-year-as-a-bcba-in-schools" className={h2Class}>
            Your first year as a BCBA in schools
          </h2>
          <p className={pClass}>
            Here is a suggested sequence for a first year. It is ours, not a study result. It builds toward one shared system instead of a pile of one-off plans.
          </p>
          <ul className={ulClass}>
            <li>
              <strong>First 90 days: learn the building.</strong> Get the role in writing. Meet each team lead. Sit in IEP meetings. Observe in classrooms. Learn the paperwork timeline. Find your ally in the building. Our <InLink href="/school-bcba/first-90-days">first 90 days guide</InLink> goes step by step.
            </li>
            <li>
              <strong>Months 4 to 6: pick one problem and fix it as a system.</strong> For example, one shared way to turn a functional behavior assessment into a plan, used every time. See <InLink href="/fba-to-bip">FBA to BIP</InLink>.
            </li>
            <li>
              <strong>Months 7 to 9: move from training to checking.</strong> Check whether plan steps happen, and give feedback on what you see (Fiske, 2008; Cooper et al., 2020, p. 662).
            </li>
            <li>
              <strong>Months 10 to 12: show the results.</strong> Bring administrators a time sample, plan-step data and student data, and propose the role and caseload for next year (CSDE, 2025, pp. 4 to 5; Syed, n.d.).
            </li>
          </ul>
          <p className={pClass}>
            That is a lot to build alone while carrying a caseload. The School BCBA Systems Transformation Program is a live cohort where school BCBAs build this system together.{" "}
            <CaseloadSystemLink />.
          </p>
        </section>

        <section aria-labelledby="more-on-bcba-jobs-and-school-practice">
          <h2 id="more-on-bcba-jobs-and-school-practice" className={h2Class}>
            More on BCBA jobs and school practice
          </h2>
          <h3 className={h3Class}>Job and career guides</h3>
          <ul className={ulClass}>
            <li>
              <InLink href="/school-bcba/job-guide">School BCBA job guide</InLink>: the roles to look for, interview prep and the work samples to bring.
            </li>
            <li>
              <InLink href="/school-bcba/job-guide-2025">2025 school BCBA job guide</InLink>: the 2025 edition.
            </li>
            <li>
              <InLink href="/school-bcba/job-description">School BCBA job description</InLink>: duties and skills a district may list.
            </li>
            <li>
              <InLink href="/school-bcba/interview-questions">School BCBA interview questions</InLink>: sample questions and answer themes.
            </li>
            <li>
              <InLink href="/school-bcba/salary-by-state">School BCBA salary by state</InLink>: the state-by-state page.
            </li>
            <li>
              <InLink href="/school-bcba/how-to-become">How to become a school BCBA</InLink>: from coursework to your first school role.
            </li>
            <li>
              <InLink href="/school-bcba/first-90-days">First 90 days in a school</InLink>: a plan for your first three months.
            </li>
            <li>
              <InLink href="/school-bcba/vs-school-based-bcba">How the role names compare</InLink>: why postings use different titles.
            </li>
          </ul>
          <h3 className={h3Class}>Practice guides</h3>
          <ul className={ulClass}>
            <li>
              <InLink href="/functional-behavior-assessment-guide">Functional behavior assessment guide</InLink>
            </li>
            <li>
              <InLink href="/behavior-intervention-plan-examples">Behavior intervention plan examples</InLink>
            </li>
            <li>
              <InLink href="/fba-to-bip">FBA to BIP</InLink>
            </li>
            <li>
              <InLink href="/iep-behavior-goal-examples">IEP behavior goal examples</InLink>
            </li>
            <li>
              <InLink href="/bcba-burnout-quiz">BCBA burnout quiz</InLink>
            </li>
            <li>
              <InLink href="/blog/school-bcba-burnout-and-workload">School BCBA burnout and workload</InLink>
            </li>
          </ul>
          <h3 className={h3Class}>Free tools</h3>
          <ul className={ulClass}>
            <li>
              <InLink href="/iep-goals">IEP goals tool</InLink>: build an editable behavior goal draft from baseline, context and supports.
            </li>
            <li>
              <InLink href="/behavior-plans">Behavior plan writer</InLink>: draft a function-based behavior intervention plan.
            </li>
            <li>
              <InLink href="/act-matrix">ACT matrix for school BCBAs</InLink>: a values-based framework.
            </li>
          </ul>
          <h3 className={h3Class}>From Rob on robspain.com</h3>
          <ul className={ulClass}>
            <li>
              <OutLink href="https://robspain.com/bcba-in-schools/">BCBA in schools guide</OutLink>
            </li>
            <li>
              <OutLink href="https://robspain.com/blog/how-bcbas-support-pbis-without-becoming-tier-3-crisis/">
                How BCBAs support PBIS without becoming Tier 3
              </OutLink>
            </li>
            <li>
              <OutLink href="https://robspain.com/blog/school-bcba-fba-bip-requests/">Why FBA and BIP requests need a system</OutLink>
            </li>
          </ul>
        </section>

        <section aria-labelledby="about-the-author">
          <h2 id="about-the-author" className={h2Class}>
            About the author
          </h2>
          <p className={pClass}>
            Rob Spain, M.S., BCBA, IBA, writes and teaches about school BCBA systems. As listed on <OutLink href="https://robspain.com/">robspain.com</OutLink>: he has been a BCBA since September 2011, holds the International Behavior Analyst certification (May 2024), has over 25 years in schools, and is adjunct faculty at Fresno Pacific University. He founded Behavior School and is part of a team that leads district-wide Behavior Intervention Supports.
          </p>
        </section>

        <NewsletterSignup />

        <ProgramCtaBlock
          campaign={CAMPAIGN}
          heading="Build your first year as a system"
          line="The Transformation Program is a live cohort for school BCBAs who want one shared way to assess, plan, train staff and check that plans are run."
        />

        <section aria-labelledby="frequently-asked-questions">
          <h2 id="frequently-asked-questions" className={h2Class}>
            Frequently asked questions
          </h2>
          {faqs.map((item) => (
            <div key={item.question}>
              <h3 className={h3Class}>{item.question}</h3>
              <p className={pClass}>{item.answer}</p>
            </div>
          ))}
        </section>

        <section aria-labelledby="sources">
          <h2 id="sources" className={h2Class}>
            Sources
          </h2>
          <ul className={ulClass}>
            <li>
              Blackman, A. L., Ruby, S. A., Wine, B., Reed, D. D., &amp; Li, Y. (2024). Behavior Analysis in Practice, 18(4), 1124-1138.{" "}
              <OutLink href="https://doi.org/10.1007/s40617-024-00998-y">https://doi.org/10.1007/s40617-024-00998-y</OutLink>
            </li>
            <li>
              Connecticut State Department of Education. (2025). BCBAs in Schools: Guidelines and Professional Standards for Connecticut.{" "}
              <OutLink href="https://portal.ct.gov/-/media/sde/special-education/bcbasinschools.pdf">
                https://portal.ct.gov/-/media/sde/special-education/bcbasinschools.pdf
              </OutLink>
            </li>
            <li>Cooper, J. O., Heron, T. E., &amp; Heward, W. L. (2020). Applied behavior analysis (3rd ed.). Pearson.</li>
            <li>
              Copeland, S. R., Duffie, P., &amp; Maez, R. (2025). Behavior Analysis in Practice, 18(4), 1033-1049.{" "}
              <OutLink href="https://doi.org/10.1007/s40617-024-01028-7">https://doi.org/10.1007/s40617-024-01028-7</OutLink>
            </li>
            <li>
              Fiske, K. E. (2008). Behavior Analysis in Practice, 1(2), 19-25.{" "}
              <OutLink href="https://doi.org/10.1007/BF03391724">https://doi.org/10.1007/BF03391724</OutLink>
            </li>
            <li>
              Hagermoser Sanetti, L. M., Collier-Meek, M. A., Long, A. C. J., Byron, J., &amp; Kratochwill, T. R. (2015). Journal of School Psychology, 53(3), 209-229.{" "}
              <OutLink href="https://doi.org/10.1016/j.jsp.2015.03.002">https://doi.org/10.1016/j.jsp.2015.03.002</OutLink>
            </li>
            <li>
              Layden, S. J. (2022). Behavior Analysis in Practice, 16(1), 51-64.{" "}
              <OutLink href="https://doi.org/10.1007/s40617-022-00700-0">https://doi.org/10.1007/s40617-022-00700-0</OutLink>
            </li>
            <li>
              Layden, S. J., Lorio-Barsten, D. K., Gansle, K. A., Austin, K., &amp; Rizvi, S. (2024). Journal of Positive Behavior Interventions, 26(1), 52-64.{" "}
              <OutLink href="https://doi.org/10.1177/10983007231200528">https://doi.org/10.1177/10983007231200528</OutLink>
            </li>
            <li>
              Plantiveau, C., Dounavi, K., &amp; Virués-Ortega, J. (2018). European Journal of Behavior Analysis, 19(2), 195-207.{" "}
              <OutLink href="https://doi.org/10.1080/15021149.2018.1438339">https://doi.org/10.1080/15021149.2018.1438339</OutLink>
            </li>
            <li>
              Snyder, S. M., Huber, H., Hornsby, T., &amp; Leventhal, B. (2024). Behavior Analysis in Practice, 17(3), 880-892.{" "}
              <OutLink href="https://doi.org/10.1007/s40617-023-00904-y">https://doi.org/10.1007/s40617-023-00904-y</OutLink>
            </li>
            <li>
              Syed, N. Y. (n.d.). Focus on... Ethical caseloads and practice in schools. ABA Ethics Hotline.{" "}
              <OutLink href="https://abaethicshotline.com/ethical-caseloads-and-practice-in-schools">
                https://abaethicshotline.com/ethical-caseloads-and-practice-in-schools
              </OutLink>
            </li>
            <li>
              US Bureau of Labor Statistics. (2026). Occupational Employment and Wage Statistics, May 2025: school psychologists (19-3034) and elementary school teachers, except special education (25-2021).{" "}
              <OutLink href="https://www.bls.gov/oes/current/oes193034.htm">https://www.bls.gov/oes/current/oes193034.htm</OutLink>
            </li>
            <li>
              Curtis Creek School District. (2023). 2022-23 Counselor and Board Certified Behavior Analyst salary schedule (board approved May 9, 2023).{" "}
              <OutLink href="https://campussuite-storage.s3.amazonaws.com/prod/1559102/7e7aafe8-8889-11ec-b4d9-0ee6196e6f9b/2598863/ba5bb24a-f986-11ed-8454-020afe8adb75/file/Counselor_BCBA%20Salary%20Schedule%2022-23.pdf">
                PDF
              </OutLink>
            </li>
          </ul>
        </section>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson()).replace(/</g, "\\u003c") }}
      />
    </article>
  );
}
