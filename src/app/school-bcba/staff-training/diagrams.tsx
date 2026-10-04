const cycleSteps = [
  {
    label: "Instructions",
    detail: "Say what to do and when.",
  },
  {
    label: "Model",
    detail: "Show the response.",
  },
  {
    label: "Rehearse",
    detail: "Staff practices the response.",
  },
  {
    label: "Feedback",
    detail: "Reinforce correct steps and correct errors.",
  },
  {
    label: "Repeat to criterion",
    detail: "Practice again until the written standard is met.",
  },
] as const;

const fidelitySteps = [
  "Prepare materials",
  "Deliver the defined cue",
  "Wait the planned interval",
  "Reinforce the replacement response",
  "Record the event",
  "Ask for help when the safety plan requires it",
] as const;

function DownArrow() {
  return (
    <div aria-hidden="true" className="flex justify-center py-1">
      <svg width="20" height="28" viewBox="0 0 20 28" focusable="false">
        <path d="M10 2 V16" stroke="#1f4d3f" strokeWidth="2" />
        <polygon points="10,26 4,14 16,14" fill="#1f4d3f" />
      </svg>
    </div>
  );
}

export function BstCycleDiagram() {
  return (
    <figure className="my-8">
      <div
        role="img"
        aria-label="Behavior skills training cycle. Instructions: say what to do and when. Model: show the response. Rehearse: staff practices the response. Feedback: reinforce correct steps and correct errors. Repeat to criterion: practice again until the written standard is met. A curved arrow returns from Repeat to criterion to Rehearse."
        className="rounded-[12px] border border-[#d9cdb8] bg-white p-4 text-[#171f1d]"
      >
        <p className="text-base font-semibold text-[#1f4d3f]">Behavior skills training cycle</p>
        <ol className="mt-4 flex flex-col">
          {cycleSteps.map((step, index) => (
            <li key={step.label}>
              <div className="rounded-[12px] border border-[#d9cdb8] bg-[#fbfaf6] px-4 py-3">
                <p className="text-base font-semibold">{step.label}</p>
                <p className="mt-1 text-base leading-7 text-[#365548]">{step.detail}</p>
              </div>
              {index < cycleSteps.length - 1 ? <DownArrow /> : null}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center gap-3">
          <svg aria-hidden="true" width="56" height="56" viewBox="0 0 56 56" focusable="false" className="shrink-0">
            <path
              d="M44 12 C 44 40, 14 44, 12 22"
              fill="none"
              stroke="#1f4d3f"
              strokeWidth="2"
            />
            <polygon points="12,12 4,22 18,20" fill="#1f4d3f" />
          </svg>
          <p className="text-base font-semibold leading-6">Repeat to criterion back to Rehearse</p>
        </div>
      </div>
      <figcaption className="mt-3 text-base leading-7 text-[#365548]">
        Text equivalent: Instructions, say what to do and when. Model, show the response. Rehearse, staff practices the response. Feedback, reinforce correct steps and correct errors. Repeat to criterion, practice again until the written standard is met, then return to Rehearse.
      </figcaption>
    </figure>
  );
}

export function FidelityChecklistDiagram() {
  return (
    <figure className="my-8">
      <div
        role="img"
        aria-label="Fidelity checklist visual. Six steps: prepare materials, deliver the defined cue, wait the planned interval, reinforce the replacement response, record the event, and ask for help when the safety plan requires it. Coaching question: What is the next small change?"
        className="rounded-[12px] border border-[#d9cdb8] bg-white p-4 text-[#171f1d]"
      >
        <p className="text-base font-semibold text-[#1f4d3f]">Fidelity checklist visual</p>
        <ol className="mt-4 flex flex-col gap-3">
          {fidelitySteps.map((step) => (
            <li key={step} className="flex min-h-11 items-center gap-3 rounded-[12px] border border-[#d9cdb8] bg-[#fbfaf6] px-3 py-2">
              <span
                aria-hidden="true"
                className="inline-block h-11 w-11 shrink-0 rounded-[8px] border-2 border-[#1f4d3f] bg-white"
              />
              <span className="text-base leading-6">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-base font-semibold leading-7">What is the next small change?</p>
      </div>
      <figcaption className="mt-3 text-base leading-7 text-[#365548]">
        Text equivalent: Prepare materials. Deliver the defined cue. Wait the planned interval. Reinforce the replacement response. Record the event. Ask for help when the safety plan requires it. Coaching question: What is the next small change?
      </figcaption>
    </figure>
  );
}
