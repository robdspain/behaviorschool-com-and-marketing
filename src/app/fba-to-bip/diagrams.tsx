const nodeClass =
  "rounded-[12px] border border-[#d9cdb8] bg-white px-4 py-3 text-base leading-6 text-[#171f1d]";

const labelClass = "text-base font-semibold text-[#1f4d3f]";

function FlowNode({ text }: { text: string }) {
  return <p className={nodeClass}>{text}</p>;
}

const workflowSteps = [
  "Referral and records review",
  "Interview and direct observation",
  "FBA summary",
  "Hypothesis statement",
  "Competing behavior pathway",
  "Draft BIP",
  "Team implementation plan",
  "Staff training and practice",
  "Data review and plan revision",
];

export function FbaToBipFlowDiagram() {
  const title = "FBA to BIP workflow";
  const description =
    "A step by step workflow connecting referral, assessment, hypothesis, competing behavior pathway, BIP drafting, team implementation, staff practice, and data review.";

  return (
    <figure className="my-8">
      <div
        role="img"
        aria-label={`${title}. ${description} The steps, in order, are: ${workflowSteps.join(". ")}.`}
        className="rounded-[12px] border border-[#d9cdb8] bg-[#f4efe5] p-4"
      >
        <ol className="flex flex-col">
          {workflowSteps.map((step, index) => (
            <li key={step} className="flex flex-col">
              <FlowNode text={step} />
              {index < workflowSteps.length - 1 ? (
                <p className="py-2 text-center text-base font-semibold text-[#365548]">
                  next decision
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-3 text-base leading-7 text-[#365548]">
        Text equivalent: {description} {workflowSteps.join(", then ")}.
      </figcaption>
    </figure>
  );
}

function BranchCard({
  branch,
  items,
}: {
  branch: string;
  items: { label: string; text: string }[];
}) {
  return (
    <div className="rounded-[12px] border border-[#d9cdb8] bg-[#fbfaf6] p-3">
      <p className={labelClass}>{branch}</p>
      <div className="mt-3 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.label} className={nodeClass}>
            <p className={labelClass}>{item.label}</p>
            <p className="mt-1">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompetingBehaviorPathwayDiagram() {
  const title = "Competing behavior pathway";
  const description =
    "A competing behavior pathway showing a writing task, problem behavior, adult help and task delay, a help or check-in request, and the desired writing behavior.";

  return (
    <figure className="my-8">
      <div
        role="img"
        aria-label={`${title}. ${description} Setting event: difficult writing task or low adult attention. Antecedent: independent writing begins. Problem behavior branch: tear page and call out, then immediate payoff, adult help and task delay. Replacement behavior branch: show help card or request a brief check-in. The branches rejoin at function: adult help or task support. Desired behavior: write for the agreed interval and request help appropriately.`}
        className="rounded-[12px] border border-[#d9cdb8] bg-[#f4efe5] p-4"
      >
        <div className="flex flex-col gap-3">
          <div className={nodeClass}>
            <p className={labelClass}>Setting event</p>
            <p className="mt-1">Difficult writing task or low adult attention</p>
          </div>
          <p className="text-center text-base font-semibold text-[#365548]">then</p>
          <div className={nodeClass}>
            <p className={labelClass}>Antecedent</p>
            <p className="mt-1">Independent writing begins</p>
          </div>
          <p className="text-center text-base font-semibold text-[#365548]">then</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <BranchCard
              branch="Problem behavior branch"
              items={[
                { label: "Problem behavior", text: "Tear page and call out" },
                { label: "Immediate payoff", text: "Adult help and task delay" },
              ]}
            />
            <BranchCard
              branch="Replacement behavior branch"
              items={[
                {
                  label: "Replacement behavior",
                  text: "Show help card or request a brief check-in",
                },
                { label: "Same function", text: "Adult help or task support" },
              ]}
            />
          </div>
          <p className="text-center text-base font-semibold text-[#365548]">rejoin at function</p>
          <div className={nodeClass}>
            <p className={labelClass}>Function</p>
            <p className="mt-1">Adult help or task support</p>
          </div>
          <p className="text-center text-base font-semibold text-[#365548]">then</p>
          <div className={nodeClass}>
            <p className={labelClass}>Desired behavior</p>
            <p className="mt-1">Write for the agreed interval and request help appropriately</p>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-base leading-7 text-[#365548]">
        Text equivalent: {description} Setting event: difficult writing task or low adult
        attention. Antecedent: independent writing begins. One branch is the problem behavior,
        tear page and call out, followed by the immediate payoff, adult help and task delay. The
        other branch is the replacement behavior, show help card or request a brief check-in, for
        the same function, adult help or task support. The branches rejoin at function. Desired
        behavior: write for the agreed interval and request help appropriately.
      </figcaption>
    </figure>
  );
}
