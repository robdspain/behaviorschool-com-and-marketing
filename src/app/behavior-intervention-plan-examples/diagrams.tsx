const boxClass =
  "min-w-0 rounded-[12px] border border-[#d9cdb8] bg-white px-3 py-3 text-[16px] leading-6 text-[#171f1d]";
const planBoxClass =
  "min-w-0 rounded-[12px] border-2 border-[#1f4d3f] bg-[#f4efe5] px-3 py-3 text-[16px] leading-6 text-[#171f1d]";
const labelClass = "text-[16px] font-semibold leading-6 text-[#171f1d]";
const detailClass = "mt-1 text-[16px] leading-6 text-[#365548]";
const arrowClass = "flex items-center justify-center text-[16px] font-semibold leading-6 text-[#1f4d3f]";

function Box({
  title,
  detail,
  plan = false,
}: {
  title: string;
  detail: string;
  plan?: boolean;
}) {
  return (
    <div className={plan ? planBoxClass : boxClass}>
      <p className={labelClass}>{title}</p>
      <p className={detailClass}>{detail}</p>
    </div>
  );
}

function DownArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1 text-center">
      {label ? <p className="text-[16px] font-semibold leading-6 text-[#171f1d]">{label}</p> : null}
      <span className={arrowClass} aria-hidden="true">
        ↓
      </span>
    </div>
  );
}

export function CompetingBehaviorPathway() {
  return (
    <figure className="my-8">
      <div
        role="img"
        aria-labelledby="cbp-title"
        aria-describedby="cbp-desc"
        className="rounded-[12px] border border-[#d9cdb8] bg-[#fbfaf6] p-4"
      >
        <p id="cbp-title" className="sr-only">
          Competing behavior pathway
        </p>
        <p id="cbp-desc" className="sr-only">
          A setting event makes the behavior more likely. An antecedent sets it off. The problem behavior
          follows, and the maintaining consequence keeps it going. The plan teaches a replacement behavior
          that follows the same antecedent and earns the same result faster and with less effort than the
          problem behavior. Over time the student moves toward the desired behavior.
        </p>

        <div aria-hidden="true" className="lg:hidden">
          <div className="flex flex-col">
            <Box title="Setting event" detail="Makes the behavior more likely. Example: very little sleep" />
            <DownArrow />
            <Box title="Antecedent" detail="What happens right before. Example: long writing task is handed out" />
            <DownArrow />
            <Box title="Problem behavior" detail="Example: tears the paper" />
            <DownArrow />
            <Box title="Maintaining consequence" detail="What the student gets or avoids. Example: the task is taken away" />
            <p className="my-4 text-[16px] font-semibold leading-6 text-[#171f1d]">What the plan builds</p>
            <DownArrow label="Plan changes this" />
            <Box plan title="Replacement behavior" detail="Same result, easier to do. Example: shows a break card" />
            <DownArrow />
            <Box plan title="Same result, now earned" detail="Example: a two-minute break right away" />
            <DownArrow label="Over time" />
            <Box plan title="Desired behavior" detail="The long-term goal. Example: finishes the task with help" />
            <p className="mt-4 text-[16px] leading-6 text-[#171f1d]">
              These two compete: the easier one that pays off wins.
            </p>
          </div>
        </div>

        <div aria-hidden="true" className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)] lg:items-stretch lg:gap-y-3">
          <Box title="Setting event" detail="Makes the behavior more likely. Example: very little sleep" />
          <span className={arrowClass}>→</span>
          <Box title="Antecedent" detail="What happens right before. Example: long writing task is handed out" />
          <span className={arrowClass}>→</span>
          <Box title="Problem behavior" detail="Example: tears the paper" />
          <span className={arrowClass}>→</span>
          <Box title="Maintaining consequence" detail="What the student gets or avoids. Example: the task is taken away" />

          <div />
          <div />
          <div className="col-span-1">
            <DownArrow label="Plan changes this" />
          </div>
          <div className="col-span-4" />

          <div />
          <div />
          <Box plan title="Replacement behavior" detail="Same result, easier to do. Example: shows a break card" />
          <span className={arrowClass}>→</span>
          <Box plan title="Same result, now earned" detail="Example: a two-minute break right away" />
          <div className="col-span-2" />

          <div className="col-span-4" />
          <div>
            <DownArrow label="Over time" />
          </div>
          <div className="col-span-2" />

          <div className="col-span-4" />
          <Box plan title="Desired behavior" detail="The long-term goal. Example: finishes the task with help" />
          <div className="col-span-2" />

          <p className="col-span-7 text-[16px] leading-6 text-[#171f1d]">
            These two compete: the easier one that pays off wins.
          </p>
        </div>
      </div>
      <figcaption className="mt-3 text-base leading-7 text-[#365548]">
        Text equivalent of the diagram: A setting event makes the behavior more likely. An antecedent sets it
        off. The problem behavior follows, and the maintaining consequence keeps it going. The plan teaches a
        replacement behavior that follows the same antecedent and earns the same result faster and with less
        effort than the problem behavior. Over time the student moves toward the desired behavior.
      </figcaption>
    </figure>
  );
}

const flowSteps: { title: string; note?: string }[] = [
  { title: "1. Define the behavior" },
  { title: "2. Run the FBA", note: "Needs direct observation, not only interviews." },
  { title: "3. Write the hypothesis" },
  { title: "4. Build the plan with the team" },
  { title: "5. Train the people who run it" },
  { title: "6. Check fidelity and data", note: "Is it being done? Is it working?" },
  { title: "7. Review and revise" },
];

function FlowBox({ title, note }: { title: string; note?: string }) {
  return (
    <div className={boxClass}>
      <p className={labelClass}>{title}</p>
      {note ? <p className={detailClass}>{note}</p> : null}
    </div>
  );
}

export function FbaToBipFlow() {
  return (
    <figure className="my-8">
      <div
        role="img"
        aria-labelledby="fba-flow-title"
        aria-describedby="fba-flow-desc"
        className="rounded-[12px] border border-[#d9cdb8] bg-[#fbfaf6] p-4"
      >
        <p id="fba-flow-title" className="sr-only">
          From assessment to a plan that is running and being reviewed
        </p>
        <p id="fba-flow-desc" className="sr-only">
          Seven steps in order: define the behavior, run the FBA, write the hypothesis, build the plan with
          the team, train the people who run it, check fidelity and data, then review and revise. The team
          returns to step 6 on its review date.
        </p>

        <div aria-hidden="true" className="lg:hidden">
          <div className="flex flex-col border-l-4 border-[#1f4d3f] pl-4">
            {flowSteps.map((step, index) => (
              <div key={step.title}>
                {index > 0 ? <DownArrow /> : null}
                <FlowBox title={step.title} note={step.note} />
              </div>
            ))}
            <p className="mt-4 text-[16px] font-semibold leading-6 text-[#171f1d]">
              Back to step 6 on the review date
            </p>
          </div>
        </div>

        <div aria-hidden="true" className="hidden lg:block">
          <div className="grid grid-cols-[minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)] items-stretch gap-y-3">
            {flowSteps.slice(0, 4).map((step, index) => (
              <div key={step.title} className="contents">
                {index > 0 ? <span className={arrowClass}>→</span> : null}
                <FlowBox title={step.title} note={step.note} />
              </div>
            ))}
            {flowSteps.slice(4).map((step, index) => (
              <div key={step.title} className="contents">
                {index > 0 ? <span className={arrowClass}>→</span> : null}
                <FlowBox title={step.title} note={step.note} />
              </div>
            ))}
          </div>
          <p className="mt-4 border-l-4 border-[#1f4d3f] pl-3 text-[16px] font-semibold leading-6 text-[#171f1d]">
            Repeat on the team&apos;s review date
          </p>
        </div>
      </div>
      <figcaption className="mt-3 text-base leading-7 text-[#365548]">
        Text equivalent of the diagram: Seven steps in order: define the behavior, run the FBA, write the
        hypothesis, build the plan with the team, train the people who run it, check fidelity and data, then
        review and revise. The team returns to step 6 on its review date.
      </figcaption>
    </figure>
  );
}
