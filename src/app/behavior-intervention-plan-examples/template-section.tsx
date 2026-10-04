import { PrintTemplateButton } from "./print-button";

const h2Class = "scroll-mt-8 text-2xl font-semibold leading-snug text-[#171f1d]";
const h3Class = "mt-8 text-xl font-semibold leading-snug text-[#171f1d]";
const pClass = "mt-4 text-base leading-7 text-[#171f1d]";
const thClass = "border border-[#d9cdb8] bg-[#f4efe5] px-3 py-3 text-left align-top font-semibold";
const tdClass = "border border-[#d9cdb8] bg-white px-3 py-3 align-top";

const templateRows: [string, string][] = [
  [
    "Student, grade, date written, review date",
    "Names and dates. Set the review date now, no later than the next team meeting.",
  ],
  ["Team members", "Everyone who runs or reviews the plan, with roles."],
  ["1. Target behavior", "What it looks like, what it does not include. Countable by two people."],
  ["2. FBA summary", "Sources used (interview, observation, data), dates, what you saw."],
  ["3. Hypothesis", "When [before], [student] does [behavior], and gets or avoids [result]."],
  [
    "4. Setting events and triggers",
    "Conditions that make the behavior more likely, and what happens right before it.",
  ],
  ["5. Prevention", "What adults change before the behavior starts."],
  ["6. Replacement behavior", "The skill that earns the same result. Easier than the problem behavior."],
  ["7. Teaching plan", "Who teaches, when, how long, how often, how practice is set up."],
  ["8. Response when the replacement happens", "Exactly what each adult does, right away."],
  ["9. Response when the problem behavior happens", "Exactly what each adult does. Include the safety plan."],
  [
    "10. Data plan",
    "What is counted, who counts, when, and the number that tells you the plan is working.",
  ],
  ["11. Who does what", "Each adult, each step, and the date each person is trained."],
  ["12. Fidelity check", "Who observes, how often, which checklist."],
  ["13. Review", "Date, who attends, what you decide if the data do not move."],
];

const fidelityRows = [
  "Prevention step 1 was in place before the trigger",
  "Prevention step 2 was in place before the trigger",
  "Replacement behavior was prompted or reminded when planned",
  "Replacement behavior was followed by the planned response",
  "Problem behavior was followed by the planned response",
  "Data were recorded",
  "Percent of steps done: (yes) divided by (yes + no)",
];

function BlankCell() {
  return (
    <td className={tdClass} aria-label="Blank line for your plan">
      <div className="min-h-11 border-b border-[#d9cdb8]" />
    </td>
  );
}

export function BipTemplate() {
  return (
    <section aria-labelledby="bip-template">
      <h2 id="bip-template" className={h2Class}>
        Free behavior intervention plan template
      </h2>
      <p className={pClass}>
        Copy or print this template and fill it in with your team. Each row says what to write. It follows the
        eight questions in &quot;What a behavior intervention plan includes&quot; above. Use the plan only after
        an FBA.
      </p>
      <PrintTemplateButton />
      <div id="bip-print-root" className="mt-6">
        <p className="text-xl font-semibold leading-snug text-[#171f1d]">Behavior Intervention Plan</p>
        <div className="my-6 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-base leading-7 text-[#171f1d]">
            <caption className="sr-only">Blank behavior intervention plan template</caption>
            <thead>
              <tr>
                <th scope="col" className={thClass}>
                  Field
                </th>
                <th scope="col" className={thClass}>
                  What to write
                </th>
                <th scope="col" className={thClass}>
                  Your plan
                </th>
              </tr>
            </thead>
            <tbody>
              {templateRows.map(([field, instruction]) => (
                <tr key={field}>
                  <th scope="row" className="border border-[#d9cdb8] bg-[#fbfaf6] px-3 py-3 text-left align-top font-semibold">
                    {field}
                  </th>
                  <td className={tdClass}>{instruction}</td>
                  <BlankCell />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={pClass}>
          <strong>How to fill it out:</strong> work in order from row 1 to row 13. Do not write row 5 until rows
          1 to 4 are filled from your assessment data. Write rows 8 and 9 in verbs a new staff member could
          follow, for example &quot;says &apos;Yes, take two minutes&apos; and starts the timer.&quot; Keep the
          plan short enough for a new staff member to read in one sitting, because treatments that are simple,
          precise and brief are more likely to be delivered consistently (Cooper et al., 2020, p. 227).
        </p>
        <h3 className={h3Class}>Fidelity checklist (copy this under the plan)</h3>
        <div className="my-6 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-base leading-7 text-[#171f1d]">
            <caption className="sr-only">Fidelity checklist</caption>
            <thead>
              <tr>
                <th scope="col" className={thClass}>
                  Plan step
                </th>
                <th scope="col" className={thClass}>
                  Done? (yes / no / not needed)
                </th>
                <th scope="col" className={thClass}>
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {fidelityRows.map((step) => (
                <tr key={step}>
                  <th scope="row" className="border border-[#d9cdb8] bg-[#fbfaf6] px-3 py-3 text-left align-top font-semibold">
                    {step}
                  </th>
                  <BlankCell />
                  <BlankCell />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
