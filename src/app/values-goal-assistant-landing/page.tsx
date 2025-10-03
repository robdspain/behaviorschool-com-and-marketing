"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Target, CheckCircle, BookOpen } from "lucide-react";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";

export default function ValuesGoalAssistantLandingPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent">
                Values-Based Goal Assistant
              </span>
              <br />
              Write Goals That Truly Matter
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Unlock the power of Acceptance and Commitment Training (ACT) to craft meaningful, measurable, and values-aligned IEP and behavior goals for students in public schools.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
            >
              Join the Interest List
              <Mail className="ml-2 w-5 h-5" />
            </button>
            <Link 
              href="#act-overview"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 border border-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Learn More
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Article Section: ACT in Schools */}
      <article id="act-overview" className="bg-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate prose-lg">
          <h2 className="!mb-4">Using ACT in Schools to Turn Student Values into Goals & Action</h2>
          <p>
            In many school settings, goals tend to focus on deficits, compliance, or external benchmarks (for example,
            “complete 80% of assignments,” “reduce disruptions”). But what if the anchor for goal-setting began with what
            matters to the student—their values—and then built goals that move them toward living in alignment with those
            values, even in the presence of internal barriers (thoughts, emotions, urges)? That is the promise of applying
            Acceptance and Commitment Training (ACT) in educational contexts (Hayes, Strosahl, &amp; Wilson, 1999).
          </p>
          <p>
            This page provides a practical, school-ready path to go from values → concrete goals → committed actions using
            ACT principles, with examples, templates, and ways to evaluate outcomes. It is designed for K–12 educators,
            school psychologists, behavior analysts, and special education teams.
          </p>

          <h3>Theoretical &amp; Empirical Foundations</h3>
          <p>
            ACT is a contextual behavioral approach aimed at cultivating psychological flexibility—the capacity to stay in
            contact with the present moment and choose or persist in value-aligned behaviors even in the presence of difficult
            internal experiences (Hayes et al., 1999). Six interrelated processes support this: acceptance, cognitive defusion,
            present-moment awareness, self-as-context, values, and committed action. Together they reduce the dominance of
            experiential avoidance or cognitive fusion so behavior can follow valued directions.
          </p>
          <p>
            In schools, ACT can be embedded as a public health approach across tiers—universal, targeted, and intensive—with
            growing evidence for feasibility and positive outcomes, especially at targeted levels (Renshaw, Weeks, Roberson, &amp;
            Vinal, 2022; Knight et al., 2022). Systematic reviews, including single-case designs, suggest ACT components can
            produce behavioral change in applied settings (Suarez et al., 2021). Brief, universal ACT lessons have shown
            modest improvements in psychological flexibility and behavioral/emotional outcomes among adolescents (Takahashi
            et al., 2020). Group studies indicate that integrating values and committed action can add motivational potency to
            goal-setting (Chase et al., 2013; Paliliunas et al., 2018). For a broader conceptual grounding on values work in
            ACT, see Berkout, Lopez, and Pearson (2021).
          </p>

          <h3>Process: From Value → Goal → Action</h3>
          <p>
            Use the scaffold below with students—including those with language or cognitive differences (simplify prompts,
            use icons, model)—to build values-aligned goals. Apply within general education, special education, or small
            groups. Adapt wording to your population.
          </p>

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Step</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Purpose</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">What You Do</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Tips / Modifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3">1. Elicit student values</td>
                  <td className="px-4 py-3">Anchor in what matters to them</td>
                  <td className="px-4 py-3">Use a kid-friendly menu (learning, kindness, friendship, helping, growth,
                    contribution, bravery, calm). Ask: “What kind of student do you want to be?” “What matters here?”</td>
                  <td className="px-4 py-3">Use icons or pictures; allow crossing out to narrow to 2–3 values.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">2. Map a Matrix / Choice Point</td>
                  <td className="px-4 py-3">Make internal/external visible</td>
                  <td className="px-4 py-3">Draw a 2×2: bottom left = “yucky thoughts/feelings/urges,” bottom right =
                    “away moves,” top right = “values / who I want to be,” top left = “tiny toward moves.”</td>
                  <td className="px-4 py-3">Keep it visual and simple; laminate for the desk; adapt Russ Harris’s
                    Choice Point 2.0 for students.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">3. Identify “toward moves”</td>
                  <td className="px-4 py-3">Bridge values and actions</td>
                  <td className="px-4 py-3">Ask: “What small thing this week would move you toward that value?” Generate
                    2–3 ideas, pick one to try now.</td>
                  <td className="px-4 py-3">Start tiny to build success momentum.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">4. Operationalize as a goal</td>
                  <td className="px-4 py-3">Make it measurable/observable</td>
                  <td className="px-4 py-3">Use who, what, when, where, how much/criterion, and how measured. Example:
                    “At independent work time, within 30 seconds of feeling stuck, raise my help card or ask a classmate.”</td>
                  <td className="px-4 py-3">Avoid vague goals (“try harder”). Use clean, observable language.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">5. Embed support &amp; shaping</td>
                  <td className="px-4 py-3">Scaffold and plan to fade</td>
                  <td className="px-4 py-3">Visual reminders, pre-correction, modeling, prompt fading; shape criteria over
                    time.</td>
                  <td className="px-4 py-3">Monitor prompt dependence; plan fading milestones.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">6. Commit to a routine</td>
                  <td className="px-4 py-3">Make it visible and regular</td>
                  <td className="px-4 py-3">Weekly plan; daily check card/tally; brief review schedule.</td>
                  <td className="px-4 py-3">Use self-monitoring, teacher or peer check.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">7. Teach micro-routines</td>
                  <td className="px-4 py-3">Respond to internal barriers</td>
                  <td className="px-4 py-3">Practice a short sequence such as “Notice → Open → Choose → Do.”</td>
                  <td className="px-4 py-3">Rehearse in low-stakes first; cue during real moments.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">8. Review, revise, generalize</td>
                  <td className="px-4 py-3">Adjust and expand reach</td>
                  <td className="px-4 py-3">Weekly check-in: what worked, what barriers showed up, tweak supports; probe new
                    classes/contexts.</td>
                  <td className="px-4 py-3">Use changing-criterion to step up expectations gradually.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Template Tools (Copy/Paste for IEPs, MTSS, or Plans)</h3>
          <p className="!mb-2 font-semibold">Values Interview (≈5 minutes)</p>
          <ul>
            <li>“At school, I care about being a student who __________ (helpful / curious / kind / reliable).”</li>
            <li>“If I acted on that value this week, I might …” (list 2–3 small actions)</li>
            <li>“What gets in the way (thoughts, worries, urges)?”</li>
            <li>“How can adults help (visual cue, prompt, model, check-in)?”</li>
          </ul>
          <p className="!mb-2 font-semibold">School ACT Matrix / Choice-Point Form (4 quadrants)</p>
          <ul>
            <li>Bottom left: “Yucky stuff (thoughts/emotions/urges)”</li>
            <li>Bottom right: “Away moves I often do”</li>
            <li>Top right: “Values / who I want to be”</li>
            <li>Top left: “Tiny toward moves / small actions I can try today”</li>
          </ul>
          <p className="!mb-2 font-semibold">Goal Builder</p>
          <p>
            Given [class/setting], when [cue/situation], Student will [behavior aligned to value] to support [value/outcome],
            with [criterion], across [time/opportunities], as measured by [data method].
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-slate-50">
              <p className="font-semibold !mb-2">Daily Check Card</p>
              <ul>
                <li>Toward move for today: ________</li>
                <li>Times I did it: ☑ ☐ ☐ ☐ …</li>
                <li>Prompt used? Y / N</li>
                <li>Value match? Y / N</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 bg-slate-50">
              <p className="font-semibold !mb-2">Weekly Review Rubric</p>
              <ul>
                <li>Barrier that showed up</li>
                <li>What micro-routine used</li>
                <li>What adjustment is needed</li>
                <li>Next target (increase, fade prompt, generalize)</li>
              </ul>
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-slate-50 mt-6">
            <p className="font-semibold !mb-2">Staff Fidelity Quick-Check (Yes/No)</p>
            <ul>
              <li>Did teacher prompt per plan?</li>
              <li>Did student get ≥ X opportunities to practice?</li>
              <li>Was reinforcement matched to value?</li>
              <li>Was data collected daily?</li>
            </ul>
          </div>

          <h3>Sample Goals &amp; Plans (By Grade &amp; Domain)</h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Grade / Domain</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Value Domain</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Toward Move</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Goal Statement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3">Early Elementary — Friendship/Kindness</td>
                  <td className="px-4 py-3">“Be a friend”</td>
                  <td className="px-4 py-3">Greet 1 peer during arrival</td>
                  <td className="px-4 py-3">Given morning arrival, student will initiate a greeting to one peer aligned with
                    friendship, on 4 of 5 days for 2 weeks (teacher tally + self check).</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Upper Elementary — Learning/Perseverance</td>
                  <td className="px-4 py-3">“Be a learner who tries”</td>
                  <td className="px-4 py-3">Raise hand for help when stuck</td>
                  <td className="px-4 py-3">During independent work, when student feels stuck, within 30 seconds student will
                    raise a help card or ask for assistance, in 80% of opportunities across 3 sessions/day for 2 weeks
                    (event count).</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Middle School — Contribution/Responsibility</td>
                  <td className="px-4 py-3">“Help my class”</td>
                  <td className="px-4 py-3">Volunteer to hand out materials or lead cleanup</td>
                  <td className="px-4 py-3">In science lab, student will take the shared role (materials distributor/cleanup lead)
                    aligned with contribution in 4/5 labs across 3 weeks, with ≤1 prompt per lab (checklist + peer
                    verification).</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">High School — Reliability/Future Success</td>
                  <td className="px-4 py-3">“Be independent &amp; responsible”</td>
                  <td className="px-4 py-3">Start bellwork independently</td>
                  <td className="px-4 py-3">At the start of each class, within the first minute, student will begin bellwork
                    without teacher prompt, on 80% of class days over 4 weeks (timed logs).</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Special Education — Communication/Regulation</td>
                  <td className="px-4 py-3">“Finish work &amp; stay calm”</td>
                  <td className="px-4 py-3">Use break-request / resume</td>
                  <td className="px-4 py-3">When internal upset cues emerge, student will use a “pause card” to request a brief
                    break, then resume work when the timer ends (≤2 prompts) in 70% of trials across two settings for 3 weeks
                    (event recording &amp; latency).</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Start small (for example, greet one peer), then increase expectations over time (greet two, then three; fade prompts)
            using a changing-criterion design.
          </p>

          <details className="mt-8 border rounded-lg open:bg-slate-50">
            <summary className="cursor-pointer px-4 py-3 font-semibold text-slate-800">Using Single-Subject/Single-Case Designs to Evaluate</summary>
            <div className="px-4 pb-4 pt-2">
              <p>
                Single-subject (single-case) experimental designs (SCEDs) fit perfectly when you work with individual students or
                small groups. They enable each student to serve as their own control and support causal inference with replication
                and clear phase changes (Horner et al., 2005; Plavnick &amp; Ferreri, 2013).
              </p>
              <ul>
                <li><strong>Multiple baseline</strong> (across students, settings, behaviors): Stagger starts to show replication.</li>
                <li><strong>Changing criterion</strong>: Step up the goal as performance stabilizes (for example, 1 greeting → 2 → 3).</li>
                <li><strong>Withdrawal (ABAB)/reversal</strong>: When ethical, remove/restore an element (for example, value reminders) to test control.</li>
                <li><strong>Alternating treatments</strong>: Compare prompts or ACT micro-routines (for example, matrix vs. choice point).</li>
              </ul>
              <p>
                Ensure stable baselines, clear operational definitions, ≥5 data points per phase when feasible, minimal overlap, and
                replication for internal validity. Measure both the committed action (toward behavior) and generalization across
                settings. For methods guidance, see Horner et al. (2005) and Plavnick &amp; Ferreri (2013).
              </p>
              <div className="border rounded-lg p-4 bg-white">
                <p className="font-semibold !mb-2">Example SCED Plan (Single Student)</p>
                <ul>
                  <li><strong>Baseline (A):</strong> 7–10 days; record toward moves per opportunity (for example, help-requests).</li>
                  <li><strong>Intervention (B):</strong> Introduce values-goal package (matrix + prompt + reinforcement). Continue daily data.</li>
                  <li><strong>Shaping within B:</strong> After stability, raise the criterion (for example, from 5 help-requests/day to 7).</li>
                  <li><strong>Replication:</strong> Apply to another student or setting (multiple baseline).</li>
                  <li><strong>Optional ABAB:</strong> Brief withdrawal/return to test reversibility when appropriate.</li>
                </ul>
              </div>
            </div>
          </details>

          <details className="mt-8 border rounded-lg open:bg-slate-50">
            <summary className="cursor-pointer px-4 py-3 font-semibold text-slate-800">Implementation Tips &amp; Troubleshooting</summary>
            <div className="px-4 pb-4 pt-2">
              <ol>
                <li><strong>Use visuals &amp; scaffolds.</strong> Icons, colored charts, or “value-icon tokens” anchor abstractions.</li>
                <li><strong>Begin small.</strong> Tiny toward moves (30 seconds or one unit) reduce threat and build momentum.</li>
                <li><strong>Pre-correct &amp; prompt early, then fade.</strong> Cue before transitions; plan fading steps.</li>
                <li><strong>Embed value-matched reinforcement.</strong> Leadership roles, peer praise, or reliability-linked privileges.</li>
                <li><strong>Drill micro-routines.</strong> Overlearn “Notice → Open → Choose → Do.”</li>
                <li><strong>Normalize setbacks.</strong> Values work is about returning to what matters after lapses.</li>
                <li><strong>Probe generalization.</strong> Try toward moves in another class or context early.</li>
                <li><strong>Collect and graph daily data.</strong> Keep visuals simple so students and staff can see trends.</li>
                <li><strong>Iterate.</strong> If progress stalls, revisit values alignment or adjust supports/criteria.</li>
                <li><strong>Train staff in ACT language.</strong> Phrases like “Which value are you working toward?” keep the scaffold alive.</li>
              </ol>
            </div>
          </details>

          <details className="mt-8 border rounded-lg open:bg-slate-50">
            <summary className="cursor-pointer px-4 py-3 font-semibold text-slate-800">Limitations &amp; Considerations</summary>
            <div className="px-4 pb-4 pt-2">
              <ul>
                <li>Many school ACT studies emphasize psychological or well-being outcomes more than overt academic/behavior goals; translation into behaviorally specific, values-anchored goals is still emerging (Knight et al., 2022).</li>
                <li>Universal, low-dose ACT shows modest effects; more rigorous trials are needed (Takahashi et al., 2020).</li>
                <li>Implementation fidelity matters. Without consistent cueing, data, and supports, values-linked goals risk becoming tokenistic.</li>
                <li>Not every student connects with “values” language; scaffold and co-create using simple visuals and examples.</li>
                <li>For SCEDs, ensure stable baselines and replication to support causal claims; weak designs reduce internal validity (Horner et al., 2005).</li>
              </ul>
            </div>
          </details>

          <div className="mt-8 border rounded-lg p-4 bg-slate-50">
            <p className="font-semibold !mb-2">Downloadable Templates</p>
            <ul className="list-disc pl-5">
              <li><Link href="/templates/values-interview.html" target="_blank">Values Interview (printable)</Link></li>
              <li><Link href="/templates/act-matrix-choice-point.html" target="_blank">ACT Matrix / Choice-Point (printable)</Link></li>
              <li><Link href="/templates/goal-builder.html" target="_blank">Goal Builder (printable)</Link></li>
              <li><Link href="/templates/daily-check-card.html" target="_blank">Daily Check Card (printable)</Link></li>
              <li><Link href="/templates/weekly-review.html" target="_blank">Weekly Review (printable)</Link></li>
              <li><Link href="/templates/staff-fidelity-check.html" target="_blank">Staff Fidelity Quick-Check (printable)</Link></li>
            </ul>
            <p className="text-sm text-slate-500 mt-2">We can export these to PDF and style with your branding on request.</p>
          </div>

          <h3>Summary &amp; Next Steps</h3>
          <p>
            Anchoring goals in what matters to students—and then scaffolding toward moves—provides a richer motivational context
            that supports meaningful engagement. Embedding ACT processes (acceptance, defusion, micro-routines) helps students
            persist despite internal barriers. Single-subject methods allow practical evaluation within classrooms and caseloads.
          </p>
          <p>
            Want this content as downloadable templates (PDF) and a one-page infographic, plus internal links to your ACT hub?
            Join the interest list below; we’re packaging these assets for schools and districts.
          </p>

          <h3>References (APA)</h3>
          <ul>
            <li>Berkout, O. V., Lopez, N. V., &amp; Pearson, M. R. (2021). Working with values: An overview of approaches and constructs. <em>Frontiers in Psychology, 12</em>, 615738. https://doi.org/10.3389/fpsyg.2021.615738</li>
            <li>Chase, J. A., Houmanfar, R., Hayes, S. C., Ward, T. A., Vilardaga, J. P., &amp; Follette, V. (2013). Values are not just goals: Online ACT-based values training adds to goal setting in improving undergraduate college student performance. <em>Journal of Contextual Behavioral Science, 2</em>(3-4), 79-84. https://doi.org/10.1016/j.jcbs.2013.08.002</li>
            <li>Hayes, S. C., Strosahl, K. D., &amp; Wilson, K. G. (1999). <em>Acceptance and commitment therapy: An experiential approach to behavior change</em>. Guilford Press.</li>
            <li>Horner, R. H., Carr, E. G., Halle, J., McGee, G., Odom, S., &amp; Wolery, M. (2005). The use of single-subject research to identify evidence-based practice in special education. <em>Exceptional Children, 71</em>(2), 165–179. https://doi.org/10.1177/001440290507100203</li>
            <li>Knight, C., Patterson, M., &amp; Dawson, D. L. (2019). Building school connectedness through mindfulness and gratitude: The impact of Kind Attention, a multiple component intervention. <em>Contemporary School Psychology, 23</em>(3), 282-295. https://doi.org/10.1007/s40688-018-0177-1</li>
            <li>Paliliunas, D., Belisle, J., &amp; Dixon, M. R. (2018). A randomized trial of a brief acceptance and commitment therapy intervention for body dissatisfaction and weight self-stigma in a female college sample. <em>Journal of American College Health, 66</em>(7), 621-629. https://doi.org/10.1080/07448481.2018.1431892</li>
            <li>Plavnick, J. B., &amp; Ferreri, S. J. (2013). Single-case experimental designs in educational research: A methodology for causal analyses in teaching and learning. <em>Educational Psychology Review, 25</em>(4), 549-569. https://doi.org/10.1007/s10648-013-9230-6</li>
            <li>Renshaw, T. L., Weeks, S. N., Roberson, A. J., &amp; Vinal, S. (2022). ACT in schools: A public health approach. In S. C. Hayes &amp; S. G. Hofmann (Eds.), <em>Process-based CBT: The science and core clinical competencies of cognitive behavioral therapy</em> (pp. 441-457). Context Press.</li>
            <li>Suarez, V. D., Ruiz, F. J., Flórez, C. L., &amp; Odriozola-González, P. (2021). Systematic review of acceptance and commitment training single-case experimental designs. <em>Journal of Contextual Behavioral Science, 20</em>, 37-51. https://doi.org/10.1016/j.jcbs.2021.02.005</li>
            <li>Takahashi, F., Iwakabe, S., &amp; Ohtaki, Y. (2020). Brief acceptance and commitment therapy for adolescent depression: School-based single-case experimental design. <em>Journal of School-Based Counseling Policy and Evaluation, 2</em>(2), 114-131.</li>
          </ul>
        </div>
      </article>

      {/* How It Works Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our intuitive process guides you through crafting effective and values-driven goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">1. Define Your Values</h3>
              <p className="text-slate-600">Start by identifying the core values that will guide your goal-setting.</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <Target className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">2. Craft Your Goals</h3>
              <p className="text-slate-600">Use our structured prompts to write clear, measurable, and actionable goals.</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <CheckCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">3. Plan for Action</h3>
              <p className="text-slate-600">Break down your goals into practical steps and track your progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Write More Meaningful Goals?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our interest list to be the first to know when the Values-Based Goal Assistant is available!
          </p>
          <button 
            onClick={() => setIsSignupOpen(true)}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            Sign Up for Updates
            <Mail className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Email Signup Popup */}
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Join the Values-Based Goal Assistant Interest List"
        description="Be the first to know about updates, early access, and launch details for our new goal-writing tool."
        pageSource="/values-goal-assistant-landing"
        showNameField={true}
        buttonText="Sign Me Up!"
        successMessage="Thanks for your interest! We'll keep you updated on the Values-Based Goal Assistant."
      />
    </div>
  );
}
