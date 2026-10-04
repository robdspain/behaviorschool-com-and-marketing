import type { ReactNode } from "react";

function Connector() {
  return <div className="mx-auto h-4 w-0.5 bg-[#1f4d3f]" aria-hidden="true" />;
}

function BranchLabels({ labels }: { labels: string[] }) {
  return (
    <div className="mb-2">
      {labels.map((label) => (
        <p key={label} className="text-base font-bold leading-6 text-[#1f4d3f]">
          {label}
        </p>
      ))}
    </div>
  );
}

function TreeBox({
  children,
  fill,
}: {
  children: ReactNode;
  fill: "paper" | "result" | "format";
}) {
  const background =
    fill === "result" ? "#e4b63d" : fill === "format" ? "#f4efe5" : "#fbfaf6";
  return (
    <div
      className="rounded-[12px] border-2 border-[#1f4d3f] px-4 py-3 text-base leading-6 text-[#171f1d]"
      style={{ backgroundColor: background }}
    >
      {children}
    </div>
  );
}

export function FaDecisionTree() {
  return (
    <figure className="my-8 max-w-full">
      <p className="mb-4 text-xl font-semibold leading-snug text-[#171f1d]">
        Do we need a functional analysis? A decision tree for school teams
      </p>
      <div
        role="img"
        aria-labelledby="fa-decision-tree-title"
        aria-describedby="fa-decision-tree-desc"
        className="flex flex-col"
      >
        <TreeBox fill="paper">
          Indirect and descriptive data are in, and a working hypothesis is written down.
        </TreeBox>
        <Connector />
        <TreeBox fill="paper">
          Do interviews and observations point to the same function across several routines?
        </TreeBox>
        <Connector />
        <BranchLabels labels={["Yes"]} />
        <TreeBox fill="paper">Is the behavior dangerous to the student or others?</TreeBox>
        <Connector />
        <BranchLabels labels={["No"]} />
        <TreeBox fill="paper">
          Did a function-based plan already fail when it was run with good fidelity?
        </TreeBox>
        <Connector />
        <BranchLabels labels={["No"]} />
        <TreeBox fill="result">
          Move to a function-based plan and treat the plan as the test. Collect baseline, choose
          the measure, set a review date.
        </TreeBox>
        <Connector />
        <BranchLabels labels={["Yes"]} />
        <TreeBox fill="result">
          Write the safety plan first. If the school cannot staff it safely, use a precursor or
          latency-based analysis, or refer.
        </TreeBox>
        <Connector />
        <BranchLabels labels={["No, they conflict", "Yes"]} />
        <TreeBox fill="result">Test before you plan. Choose an analysis format.</TreeBox>
        <Connector />
        <TreeBox fill="format">
          <p className="font-semibold">Which analysis format?</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Teacher can step away for short trials: trial-based FA.</li>
            <li>Too severe to repeat many times: latency-based FA, or precursors.</li>
            <li>Several reinforcers arrive together: IISCA.</li>
            <li>Time very short, consultant available: brief FA.</li>
          </ul>
        </TreeBox>
      </div>
      <p id="fa-decision-tree-title" className="sr-only">
        Decision tree for choosing between a function-based plan and a functional analysis
      </p>
      <p id="fa-decision-tree-desc" className="sr-only">
        Start from a written hypothesis. If interviews and observations conflict, test before you
        plan. If they agree, check danger: write a safety plan first, and use a precursor or
        latency-based analysis or a referral if the school cannot staff it safely. If the behavior
        is not dangerous and no function-based plan has failed, move to a function-based plan and
        treat the plan as the test. If a plan failed, test the hypothesis. A format box lists
        trial-based, latency-based or precursor, IISCA, and brief FA.
      </p>
      <p className="mt-4 text-base leading-6 text-[#365548]">
        A planning aid for team discussion, not a professional standard.
      </p>
    </figure>
  );
}
