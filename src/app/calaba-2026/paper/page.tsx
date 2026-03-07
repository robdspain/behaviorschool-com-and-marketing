import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beyond Observable Behavior -  Draft Article | CalABA 2026 | BehaviorSchool",
  description:
    "Draft article: Beyond Observable Behavior -  Measuring and Modifying the Function of Thought in School-Based Behavioral Assessment and Intervention. Rob Spain, BCBA, IBA.",
};

export default function CalABA2026PaperPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Header bar */}
      <div
        className="px-6 py-4 text-white text-sm"
        style={{ background: "linear-gradient(135deg, #123628 0%, #1f4d3f 60%, #2c6b57 100%)" }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Link href="/calaba-2026" className="text-white/70 hover:text-white transition-colors">
            ← Back to CalABA 2026
          </Link>
          <span className="text-white/60 text-xs uppercase tracking-widest font-semibold">
            Draft -  Not for citation
          </span>
        </div>
      </div>

      {/* Paper content */}
      <article className="max-w-3xl mx-auto px-6 py-12 sm:py-16" style={{ fontFamily: "'Georgia', serif" }}>

        {/* Draft notice */}
        <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <span className="font-semibold">Draft manuscript -  </span>
          This article is under review and has not been submitted for peer review. Data and conclusions are preliminary. Please do not cite without author permission.
        </div>

        {/* Title block */}
        <header className="mb-10 border-b border-slate-200 pb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold leading-tight mb-6"
            style={{ color: "#1E3A34", fontFamily: "'Georgia', serif" }}
          >
            Beyond Observable Behavior: Measuring and Modifying the Function of Thought in School-Based Behavioral Assessment and Intervention
          </h1>
          <div className="space-y-1 text-base" style={{ color: "#1E3A34" }}>
            <p><strong>Rob Spain, BCBA, IBA</strong> -  Kings Canyon Unified School District; BehaviorSchool</p>
            <p><strong>Cristal Lopez, BCaBA</strong> -  Kings Canyon Unified School District</p>
            <p className="text-slate-500 text-sm mt-2">With contributions from: Megan Caluza, BCBA -  Berkeley Unified School District</p>
          </div>
          <p className="mt-4 text-sm text-slate-500 italic">
            Presented at the California Association for Behavior Analysis (CalABA) Annual Conference, Sacramento, California, March 7, 2026.
          </p>
        </header>

        {/* Abstract */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-widest mb-3" style={{ color: "#1E3A34" }}>Abstract</h2>
          <p className="text-base leading-relaxed text-slate-700 mb-3">
            Students with severe externalizing behavior disorders frequently fail to respond to consequence-based behavior intervention plans (BIPs) despite technically sound functional behavior assessments (FBAs). This paper argues that traditional behavioral assessment, while highly effective for externally mediated behavior, contains a systematic gap: it does not account for internally mediated behavior driven by rigid verbal relations and psychological inflexibility. Drawing on Relational Frame Theory (Hayes, Barnes-Holmes, &amp; Roche, 2001), Relational Density Theory (Belisle &amp; Dixon, 2020), and the Acceptance and Commitment Training (ACT) model (Dixon, Paliliunas, &amp; Belisle, 2019), we describe the AIM (Accept and Innovate Mindfully) framework -  a four-phase ACT-informed FBA and BIP model implemented across K–12 settings in two California school districts.
          </p>
          <p className="text-base leading-relaxed text-slate-700 mb-3">
            In a quasi-experimental longitudinal case series (<em>N</em> = 4; grades 5 through 12), participants demonstrated a 58.3% mean increase in psychological flexibility on the Child Psychological Flexibility Questionnaire (CPFQ) and a 75% mean reduction in targeted maladaptive behaviors across an 8-month intervention period. Reliable Change Index (RCI) criteria (&gt; 50% CPFQ composite gain) were met by 100% of participants at a median of 5 months, with gains significant at the 95% confidence level (<em>z</em> &gt; 1.96). These findings suggest the AIM ACT model is a viable, generalizable framework for diverse K–12 educational settings.
          </p>
          <p className="mt-3 text-sm text-slate-500 italic">
            <strong>Keywords:</strong> functional behavior assessment, acceptance and commitment training, AIM curriculum, psychological flexibility, CPFQ, school-based intervention, relational frame theory, behavior intervention plan
          </p>
        </section>

        <hr className="border-slate-200 my-8" />

        {/* Introduction */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1E3A34" }}>Introduction</h2>
          <p className="text-base leading-relaxed text-slate-700 mb-4">
            The functional behavior assessment has long served as the cornerstone of individualized behavior support in school settings (O'Neill et al., 1997; Umbreit, Ferro, Liaupsin, &amp; Lane, 2007). By identifying the environmental antecedents and consequences that maintain problem behavior, FBAs enable practitioners to develop function-based BIPs that teach replacement behaviors, modify setting events, and rearrange contingencies. This model has demonstrated strong empirical support, particularly for behaviors maintained by social positive reinforcement (attention), social negative reinforcement (escape from task demands), or access to tangible items (Hanley, Iwata, &amp; McCord, 2003).
          </p>
          <p className="text-base leading-relaxed text-slate-700 mb-4">
            However, a growing body of behavior-analytic literature suggests that this model encounters consistent limitations when applied to students whose behavior is primarily mediated by private verbal events -  specifically, rigid rules, evaluative self-narratives, and experiential avoidance (Törneke, Luciano, &amp; Valdivia Salas, 2008). For these students, the observable antecedent captured in ABC data is not the functional antecedent. Rather, the functional antecedent is the <em>thought</em> triggered by the environment: an automatically derived verbal relation such as "if I am redirected, then I am stupid" or "if I attempt the task, then I will fail." Standard consequence manipulation does not disrupt these internal contingencies, and BIPs targeting only the external environment frequently fail to produce durable behavior change (Dixon et al., 2018).
          </p>
          <p className="text-base leading-relaxed text-slate-700">
            This paper presents the AIM (Accept and Innovate Mindfully) framework -  implemented across two California school districts -  that extends the standard FBA process to assess and directly target the function of thought. The framework draws on Relational Frame Theory (RFT; Hayes et al., 2001), Relational Density Theory (RDT; Belisle &amp; Dixon, 2020), and Acceptance and Commitment Training (ACT; Dixon et al., 2019).
          </p>
        </section>

        {/* Part 1 */}
        <section className="mb-10">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Part 1 -  Rob Spain, BCBA, IBA</div>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1E3A34" }}>The Assessment Phase: Application of Functional Analysis to the Function of Thought</h2>

          <h3 className="text-base font-semibold mb-2 text-slate-900">Background: The Gap in Traditional FBA</h3>
          <p className="text-base leading-relaxed text-slate-700 mb-4">
            Standard FBA methodology is organized around the three-term contingency: antecedent → behavior → consequence (Cooper, Heron, &amp; Heward, 2020). The critical limitation emerges when behavior is rule-governed. A student who has formed the relational network "teacher = authority = rejection = I am unlovable" will respond to routine redirection with disproportionate escalation poorly predicted by the immediate antecedent alone. Relational Density Theory (Belisle &amp; Dixon, 2020) formalizes this: dense verbal networks resist disconfirmation by direct contingency manipulation -  analogous to the resistance to extinction in conditioned reinforcers after extensive training histories.
          </p>

          <h3 className="text-base font-semibold mb-2 text-slate-900">The KCUSD Pathway B Decision Rule</h3>
          <p className="text-base leading-relaxed text-slate-700 mb-4">
            Kings Canyon Unified School District developed a five-tier behavior support system. Tier 4 Pathway B applies the ACT-informed battery when three indicators are present: (a) a latency from antecedent to behavioral onset exceeding 30 seconds; (b) observable precursor behaviors consistent with internal verbal activity (mumbling, gaze avoidance, emotional escalation without external trigger); and (c) student verbal report of interfering thoughts or feelings.
          </p>

          <h3 className="text-base font-semibold mb-2 text-slate-900">Four-Phase Assessment Battery</h3>
          <p className="text-base leading-relaxed text-slate-700 mb-1"><strong>Phase 1:</strong> Open-ended interview + ACT Matrix (Polk &amp; Schoendorff, 2014) mapping private events, avoidance behaviors, values, and values-consistent behavior.</p>
          <p className="text-base leading-relaxed text-slate-700 mb-1"><strong>Phase 2:</strong> Direct observation with latency recording -  interval from antecedent onset to target behavior or proximal precursor onset.</p>
          <p className="text-base leading-relaxed text-slate-700 mb-1"><strong>Phase 3:</strong> Latency-based functional analysis (fusion hierarchy) -  brief paired validating vs. challenging conditions per verbal statement to rank statements by functional control.</p>
          <p className="text-base leading-relaxed text-slate-700 mb-4"><strong>Phase 4:</strong> CPFQ administration (student self-report + caregiver/teacher form) + values assessment via age-adapted card sort or preference assessment.</p>
        </section>

        {/* Part 2 */}
        <section className="mb-10">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Part 2 -  Cristal Lopez, BCaBA</div>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1E3A34" }}>The Intervention Phase: ACT-Informed BIPs and Values-Based Programming</h2>
          <p className="text-base leading-relaxed text-slate-700 mb-4">
            The ACT-informed BIP integrates Hanley's Skill-Based Treatment (SBT) model (Hanley et al., 2014) with Acceptance and Commitment Training (Dixon et al., 2019). SBT targets externally maintained behavior through functional communication training, tolerance building, and cooperation training. ACT targets the internal verbal processes maintaining experiential avoidance. The integration rests on a key clinical distinction: <em>toleration without psychological flexibility is compliance, not durable behavior change.</em>
          </p>
          <p className="text-base leading-relaxed text-slate-700 mb-2">The ACT-informed BIP is organized around five components:</p>
          <ol className="list-decimal pl-6 space-y-2 text-base text-slate-700 mb-4">
            <li><strong>Acceptance-based antecedent modifications</strong> -  reducing behavioral control of aversive stimuli without reinforcing avoidance ("That sounds really hard. And I still need you to try.").</li>
            <li><strong>Defusion procedures</strong> -  age-adapted metaphors and exercises targeting the highest-control fusion hierarchy statements.</li>
            <li><strong>Values-aligned replacement behaviors</strong> -  replacement behaviors anchored in the student's identified values, functioning as conditioned motivating operations.</li>
            <li><strong>AIM curriculum sessions</strong> -  structured acceptance and present-moment exercises targeting CPFQ subscale deficits (Dixon et al., 2019; Hayes &amp; Ciarrochi, 2015).</li>
            <li><strong>CPFQ progress monitoring</strong> -  re-administered at 6 and 12 weeks to track psychological flexibility gains concurrent with behavioral data.</li>
          </ol>
        </section>

        {/* Part 3 */}
        <section className="mb-10">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Part 3 -  Rob Spain, BCBA, IBA</div>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1E3A34" }}>Implementation and Fidelity: Scaling ACT-Informed Practices Across School Sites</h2>
          <p className="text-base leading-relaxed text-slate-700 mb-4">
            Implementation in public school settings faces distinct challenges: compressed IEP timelines, staff training demands, and the need for ACT-consistent language patterns that differ significantly from standard contingency-management training. The collaborative consultation model -  embedding school psychologists, special education teachers, and paraeducators as co-implementers -  distributed implementation burden and provided natural in-vivo coaching opportunities.
          </p>
          <p className="text-base leading-relaxed text-slate-700 mb-4">
            Intervention fidelity was assessed across three domains: (a) procedural fidelity of defusion/acceptance exercises via BST checklists during direct observation; (b) staff language fidelity via momentary time sampling of ACT-consistent responses; and (c) CPFQ administration fidelity via standardized protocol sheets and inter-rater reliability checks. Staff training followed a modified BST sequence (written instruction → modeling → rehearsal → in-vivo feedback) with an 80% procedural fidelity criterion across three consecutive probes.
          </p>
          <p className="text-base leading-relaxed text-slate-700">
            Social validity data collected via adapted Goal Attainment Scale (Kiresuk &amp; Sherman, 1968) and a purpose-built ACT Intervention Social Validity Survey yielded consistently high ratings, with student participants independently endorsing the intervention as "helping me understand myself better."
          </p>
        </section>

        {/* Part 4 */}
        <section className="mb-10">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Part 4 -  Rob Spain, BCBA, IBA</div>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1E3A34" }}>Method and Results: Longitudinal Case Series (<em>N</em> = 4)</h2>

          <h3 className="text-base font-semibold mb-3 text-slate-900">Participants</h3>

          {/* Table 1 */}
          <p className="text-sm font-semibold text-slate-600 mb-1">Table 1. <em>Participant Demographic Overview</em></p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse border border-slate-300">
              <thead>
                <tr style={{ backgroundColor: "#1E3A34", color: "white" }}>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Grade Level</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Identifier</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Baseline Problem Behaviors</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Educational Setting</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Elementary (5th)", "Student 1", "Aggression, Non-compliance", "General Education / Resource"],
                  ["Middle School", "Student 2", "Disruption, Elopement", "Self-Contained / General Education"],
                  ["High School", "Student 3", "Disruption, Social Withdrawal", "Comprehensive High School"],
                  ["K–8", "Student 4", "Verbal Aggression, Task Avoidance", "Therapeutic / Behavioral Day Program"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-slate-200 px-3 py-2 text-slate-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 italic mb-6">
            Note. Participant identifiers are pseudonyms or initials used to protect student privacy in accordance with FERPA (20 U.S.C. § 1232g). IRB consultation documentation available upon editorial request.
          </p>

          <h3 className="text-base font-semibold mb-3 text-slate-900">Primary Outcome: Psychological Flexibility (CPFQ)</h3>

          {/* Table 2 */}
          <p className="text-sm font-semibold text-slate-600 mb-1">Table 2. <em>Mean Psychological Flexibility Change (CPFQ; N = 4)</em></p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse border border-slate-300">
              <thead>
                <tr style={{ backgroundColor: "#1E3A34", color: "white" }}>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Month</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Mean Δ (%)</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">SD</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Clinical Milestone</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["0", "0.0%", "0.00", "Baseline"],
                  ["2", "20.0%", "5.82", "Initial Skill Acquisition"],
                  ["4", "46.5%", "7.14", "Approaching RCI Threshold"],
                  ["5", "50.8%", "6.45", "Clinical Significance (p < .05)"],
                  ["8", "58.3%", "5.20", "Maintenance Phase"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-slate-200 px-3 py-2 text-slate-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold mb-3 text-slate-900">Secondary Outcome: Behavior Reduction</h3>

          {/* Table 3 */}
          <p className="text-sm font-semibold text-slate-600 mb-1">Table 3. <em>Targeted Behavior Reduction at 8 Months (N = 4)</em></p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse border border-slate-300">
              <thead>
                <tr style={{ backgroundColor: "#1E3A34", color: "white" }}>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Behavior Category</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Baseline (Ep/Day)</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Month 8 (Ep/Day)</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Total Reduction</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Disruption", "14.2", "2.8", "80.3%"],
                  ["Aggression", "6.8", "1.1", "83.8%"],
                  ["Escape/Elopement", "5.4", "2.7", "50.0%"],
                  ["Aggregate Total", "8.8", "2.2", "75.0%"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-slate-200 px-3 py-2 text-slate-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold mb-2 text-slate-900">Reliable Change Index</h3>
          <p className="text-base leading-relaxed text-slate-700 mb-4">
            The RCI threshold (&gt; 50% CPFQ composite gain; Jacobson &amp; Truax, 1991) was met by all four participants (<em>n</em> = 4; 100%) by Month 6. Growth was significant at the 95% confidence level (<em>z</em> &gt; 1.96), indicating genuine individual change rather than regression to the mean.
          </p>
        </section>

        {/* Conclusions */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1E3A34" }}>Conclusions</h2>
          <p className="text-base leading-relaxed text-slate-700 mb-4">
            The AIM ACT framework provides a coherent, operationalizable extension of the FBA process to assess and modify internally mediated behavior. Across four participants spanning elementary through high school, the model produced clinically meaningful and statistically reliable improvements in both psychological flexibility and targeted problem behavior. The cross-developmental scope of the sample directly addresses the critique that ACT repertoires are inaccessible to younger students: the limiting variable is not developmental age, but the functional availability of the relevant verbal repertoires.
          </p>
          <p className="text-base leading-relaxed text-slate-700 font-medium" style={{ color: "#1E3A34" }}>
            For students whose behavior is driven by rigid internal verbal rules, the function that matters is not the function of the external consequence -  it is the function of the thought.
          </p>
        </section>

        {/* References */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#1E3A34" }}>References</h2>
          <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
            <p>A-Tjak, J. G., et al. (2015). A meta-analysis of the efficacy of acceptance and commitment therapy. <em>Psychotherapy and Psychosomatics, 84</em>(1), 30–36.</p>
            <p>Belisle, J., &amp; Dixon, M. R. (2020). Relational density theory. <em>Perspectives on Behavior Science, 43</em>(2), 259–283.</p>
            <p>Cooper, J. O., Heron, T. E., &amp; Heward, W. L. (2020). <em>Applied behavior analysis</em> (3rd ed.). Pearson.</p>
            <p>Dixon, M. R., Paliliunas, D., &amp; Belisle, J. (2019). <em>ACT for children and adolescents.</em> Context Press.</p>
            <p>Greco, L. A., &amp; Hayes, S. C. (Eds.). (2008). <em>Acceptance and mindfulness treatments for children and adolescents.</em> New Harbinger.</p>
            <p>Hanley, G. P., Iwata, B. A., &amp; McCord, B. E. (2003). Functional analysis of problem behavior. <em>Journal of Applied Behavior Analysis, 36</em>(2), 147–185.</p>
            <p>Hanley, G. P., et al. (2014). Producing meaningful improvements in problem behavior via synthesized analyses. <em>Journal of Applied Behavior Analysis, 47</em>(1), 16–36.</p>
            <p>Hayes, S. C., Barnes-Holmes, D., &amp; Roche, B. (Eds.). (2001). <em>Relational frame theory.</em> Kluwer Academic.</p>
            <p>Hayes, S. C., &amp; Ciarrochi, J. (2015). <em>The thriving adolescent.</em> New Harbinger.</p>
            <p>Hayes, S. C., Strosahl, K. D., &amp; Wilson, K. G. (2012). <em>Acceptance and commitment therapy</em> (2nd ed.). Guilford.</p>
            <p>Jacobson, N. S., &amp; Truax, P. (1991). Clinical significance. <em>Journal of Consulting and Clinical Psychology, 59</em>(1), 12–19.</p>
            <p>Kazdin, A. E. (2011). <em>Single-case research designs</em> (2nd ed.). Oxford University Press.</p>
            <p>Kiresuk, T. J., &amp; Sherman, R. E. (1968). Goal attainment scaling. <em>Community Mental Health Journal, 4</em>(6), 443–453.</p>
            <p>Luoma, J. B., Hayes, S. C., &amp; Walser, R. D. (2017). <em>Learning ACT</em> (2nd ed.). New Harbinger.</p>
            <p>O'Neill, R. E., et al. (1997). <em>Functional assessment and program development for problem behavior</em> (2nd ed.). Brooks/Cole.</p>
            <p>Polk, K. L., &amp; Schoendorff, B. (Eds.). (2014). <em>The ACT matrix.</em> Context Press.</p>
            <p>Skinner, B. F. (1957). <em>Verbal behavior.</em> Appleton-Century-Crofts.</p>
            <p>Törneke, N., Luciano, C., &amp; Valdivia Salas, S. (2008). Rule-governed behavior and psychological problems. <em>International Journal of Psychology and Psychological Therapy, 8</em>(2), 141–156.</p>
            <p>Umbreit, J., et al. (2007). <em>Functional behavioral assessment and function-based intervention.</em> Pearson.</p>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-8 mt-8 text-center">
          <p className="text-xs text-slate-400 mb-4">
            Draft manuscript -  CalABA 2026 Symposium. Not for citation without author permission.
          </p>
          <Link
            href="/calaba-2026"
            className="inline-block rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1E3A34" }}
          >
            Back to CalABA 2026 Resources
          </Link>
        </div>
      </article>
    </main>
  );
}
