import { ContentLink } from "./content-link";

const h2Class = "scroll-mt-8 text-2xl font-semibold leading-snug text-[#171f1d]";
const h3Class = "mt-10 scroll-mt-8 text-xl font-semibold leading-snug text-[#171f1d]";
const pClass = "mt-4 text-base leading-7 text-[#171f1d]";
const thClass = "border border-[#d9cdb8] bg-[#f4efe5] px-3 py-3 text-left align-top font-semibold";
const rowThClass = "border border-[#d9cdb8] bg-[#fbfaf6] px-3 py-3 text-left align-top font-semibold";
const tdClass = "border border-[#d9cdb8] bg-white px-3 py-3 align-top";

function PlanTable({ caption, rows }: { caption: string; rows: [string, string][] }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-base leading-7 text-[#171f1d]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={`${thClass} w-[34%]`}>
              Part of the plan
            </th>
            <th scope="col" className={thClass}>
              What it says
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([part, says]) => (
            <tr key={part}>
              <th scope="row" className={rowThClass}>
                {part}
              </th>
              <td className={tdClass}>{says}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const examples: { title: string; rows: [string, string][] }[] = [
  {
    title: "Example 1: Escape from a hard writing task (grade 3)",
    rows: [
      [
        "Target behavior",
        "Tears or crumples the paper and pushes materials off the desk during independent writing. One count each time paper is torn or materials land on the floor.",
      ],
      [
        "Hypothesis",
        "When Jordan is given a multi-sentence writing task, Jordan tears the paper and pushes materials, and the task is delayed or taken away (escape).",
      ],
      ["Replacement behavior", "Shows a break card or a help card."],
      [
        "Prevention",
        "Cut the task into two-sentence chunks. Start with two or three quick requests Jordan reliably does, then give the writing chunk right after (a high-probability request sequence; Cooper et al., 2020, p. 619). Give a short break on a schedule, before the behavior starts (noncontingent escape; Cooper et al., 2020, p. 616). Fade the scheduled breaks over time because noncontingent escape can disrupt instruction (Cooper et al., 2020, p. 619).",
      ],
      [
        "Teaching",
        "Teach the card in short lessons during calm times, then practice during real work. Functional communication training teaches a response that earns what the problem behavior earned (Cooper et al., 2020, p. 621).",
      ],
      [
        "Response when the replacement happens",
        "Honor it right away: a two-minute break or the help requested, then back to the next small chunk.",
      ],
      [
        "Response when the problem behavior happens",
        "Stay calm, point to the card, offer the next small step. Tearing paper does not end the task. Do not use time-out, sending Jordan out, or planned ignoring, which are contraindicated for escape-maintained behavior (Cooper et al., 2020, p. 642). Escape extinction means the behavior no longer produces removal of the demand (Cooper et al., 2020, p. 584), and an increase in the behavior at first is possible (Cooper et al., 2020, p. 587), so the team agrees in advance on a safety plan.",
      ],
      [
        "Data plan",
        "Count tears per writing period. Count card uses per writing period. Record the percent of the writing chunk finished. Look at it every week at the grade-level meeting.",
      ],
    ],
  },
  {
    title: "Example 2: Attention from the teacher (grade 5)",
    rows: [
      [
        "Target behavior",
        "Calls out without raising a hand during teacher talk. One count for each call-out that is a word or phrase said at a volume heard across the room.",
      ],
      [
        "Hypothesis",
        "When the teacher is talking to the whole class, Amari calls out, and the teacher looks, answers or reminds Amari (attention).",
      ],
      [
        "Replacement behavior",
        "Raises a hand, or puts a card on the corner of the desk, to ask for attention.",
      ],
      [
        "Prevention",
        "Give attention freely and often on a clock, before the call-out: a quick check-in or a few words every few minutes (noncontingent reinforcement removes the motivation to work for that attention; Cooper et al., 2020, p. 615).",
      ],
      [
        "Teaching",
        "Practice hand raising with a partner for two minutes at the start of the day, and let Amari practice being called on.",
      ],
      [
        "Response when the replacement happens",
        "Answer or acknowledge a raised hand quickly. Cooper and colleagues say practitioners usually find differential reinforcement of alternative behavior the easiest of the three differential reinforcement procedures to apply (Cooper et al., 2020, p. 596).",
      ],
      [
        "Response when the problem behavior happens",
        "A short neutral redirect to the card, with no lecture. Reprimands, discussion or counseling are contraindicated for attention-maintained behavior (Cooper et al., 2020, p. 642). Everyone who works with Amari uses the same redirect.",
      ],
      [
        "Data plan",
        "Count call-outs and hand raises in the same 30-minute block, three days a week. Review with the teacher every Friday.",
      ],
    ],
  },
  {
    title: "Example 3: Getting a preferred item (kindergarten)",
    rows: [
      [
        "Target behavior",
        "Grabs a toy or tablet out of a peer's hands during choice time. One count per grab.",
      ],
      [
        "Hypothesis",
        "When a peer has the toy or tablet Mateo wants, Mateo grabs it, and gets it (tangible).",
      ],
      ["Replacement behavior", "Says or signs \"my turn, please\" and holds out a hand."],
      [
        "Prevention",
        "Show a visual schedule of whose turn comes next. Give Mateo a scheduled turn with the item at set times, so the item is available without grabbing (noncontingent reinforcement with positive reinforcement; Cooper et al., 2020, p. 615).",
      ],
      [
        "Teaching",
        "Teach the request in short practice rounds before choice time, with an adult playing the peer. Functional communication training uses differential reinforcement of alternative behavior to teach a response that earns the same reinforcer (Cooper et al., 2020, p. 621).",
      ],
      [
        "Response when the replacement happens",
        "Give the item, or the next turn on the schedule, right after the request.",
      ],
      [
        "Response when the problem behavior happens",
        "Block the grab safely, return the item to the peer, and prompt the request. Mateo gets the item only after the request.",
      ],
      ["Data plan", "Count grabs and requests per choice period. Review every two weeks."],
    ],
  },
  {
    title: "Example 4: Automatic reinforcement (grade 2)",
    rows: [
      [
        "Target behavior",
        "Chews the collar of the shirt during seatwork. Checked every two minutes: is the collar in the mouth right now, yes or no.",
      ],
      [
        "Hypothesis",
        "The behavior happens in many settings, including when alone, and does not depend on what adults or peers do. The hypothesis is that the chewing produces its own sensory result (automatic reinforcement).",
      ],
      [
        "Replacement behavior",
        "Chews a chewable item the team picks with the student, during seatwork.",
      ],
      [
        "Prevention",
        "First check with the team and the family for medical causes. If an interview points to a medical issue, other assessments come first (Cooper et al., 2020, p. 642). Give access to the chewable item before seatwork starts. An enriched environment is most often applied to behavior maintained by automatic positive reinforcement (Cooper et al., 2020, p. 623).",
      ],
      [
        "Teaching",
        "Teach Riley to take the item from a pouch, use it, and put it away. Practice before each seatwork block for the first week.",
      ],
      ["Response when the replacement happens", "Quiet acknowledgement: a thumbs up."],
      [
        "Response when the problem behavior happens",
        "A gesture toward the pouch. No audible reminder in front of peers.",
      ],
      [
        "Data plan",
        "Percent of two-minute checks with the collar in the mouth, three days a week, graphed every Friday.",
      ],
    ],
  },
  {
    title: "Example 5: Leaving class to avoid lecture (grade 9)",
    rows: [
      [
        "Target behavior",
        "Leaves the classroom without permission during teacher-led instruction. One count each time the student crosses the doorway without a pass.",
      ],
      [
        "Hypothesis",
        "During 15 minutes or more of teacher talk, Devon leaves the room, which ends exposure to the lecture (escape).",
      ],
      [
        "Replacement behavior",
        "Asks for a break pass quietly, or uses a discreet signal agreed with the teacher.",
      ],
      [
        "Prevention",
        "Give a scheduled break pass at planned points in class (noncontingent escape; Cooper et al., 2020, p. 616). Plan to fade the schedule because noncontingent escape can disrupt instruction (Cooper et al., 2020, p. 619).",
      ],
      [
        "Teaching",
        "A 10-minute conversation with Devon, then rehearsal: how to ask, where to go, how long, how to come back. Functional communication training builds a response that serves the same function (Cooper et al., 2020, p. 621).",
      ],
      [
        "Response when the replacement happens",
        "The teacher says yes quickly and without comment. Devon takes the break at the agreed place and returns.",
      ],
      [
        "Response when the problem behavior happens",
        "The teacher follows the school's safety procedure for a student leaving the room and does not make the student the subject of discussion. Suspension is contraindicated for escape-maintained behavior (Cooper et al., 2020, p. 642).",
      ],
      [
        "Data plan",
        "Count leaves and pass requests per class period. Record minutes in the room. Review at the team meeting every two weeks.",
      ],
    ],
  },
];

export function BipExamples() {
  return (
    <section aria-labelledby="bip-examples">
      <h2 id="bip-examples" className={h2Class}>
        Behavior intervention plan examples by function
      </h2>
      <p className={pClass}>
        These five sample plans are composites written for this page. They are not real students. Each one
        starts from a hypothesis, and the strategies match it. Adapt them to your own assessment data, setting
        and team. Do not copy one into a student&apos;s file.
      </p>
      <p className={pClass}>
        The strategy names below come from Cooper, Heron, and Heward (2020). Page numbers are given in each
        example.
      </p>
      {examples.map((example) => (
        <div key={example.title}>
          <h3 className={h3Class}>{example.title}</h3>
          <PlanTable caption={example.title} rows={example.rows} />
        </div>
      ))}
      <p className={pClass}>
        More function-matched strategy ideas live in the{" "}
        <ContentLink href="/functional-behavior-assessment-guide">functional behavior assessment guide</ContentLink>
        . Use the <ContentLink href="/behavior-plans">free BIP generator</ContentLink> when you want a plan
        drafted from your own assessment details.
      </p>
    </section>
  );
}
