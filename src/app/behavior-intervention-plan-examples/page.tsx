import { SeoArticlePage } from "@/components/seo/SeoArticlePage";
import { buildPageMetadata } from "@/lib/seo/metadata";

const canonical = "https://behaviorschool.com/behavior-intervention-plan-examples";

export const metadata = buildPageMetadata({
  title: "Behavior Intervention Plan Examples | BIP Guide",
  description:
    "Behavior intervention plan examples for school teams, including function-based strategies, replacement skills, reinforcement, and data collection.",
  canonical,
  type: "article",
});

export default function Page() {
  return (
    <SeoArticlePage
      title="Behavior Intervention Plan Examples"
      description="Strong behavior intervention plan examples connect the FBA hypothesis to prevention strategies, replacement skills, reinforcement, and practical data collection."
      eyebrow="BIP examples"
      breadcrumbLabel="Behavior Intervention Plan Examples"
      canonical={canonical}
      primaryCta={{ label: "Use the free BIP generator", href: "/behavior-plans" }}
      secondaryLinks={[
        { label: "Functional behavior assessment guide", href: "/functional-behavior-assessment-guide" },
        { label: "FBA to BIP tool", href: "/fba-to-bip" },
        { label: "Behavior tools", href: "/behavior-tools" },
      ]}
      sections={[
        {
          heading: "What every BIP example should include",
          body: "A BIP is only useful when each strategy connects to the behavior's function and can be implemented by the adults who support the student.",
          bullets: [
            "Operational definition of the target behavior.",
            "FBA summary and hypothesized function.",
            "Prevention strategies matched to common antecedents.",
            "Replacement skill instruction and reinforcement plan.",
            "Data collection and review schedule.",
          ],
        },
        {
          heading: "Example: escape-maintained behavior",
          body: "If behavior is maintained by escape from difficult work, the plan might include task modification, choice, help requests, break cards, reinforcement for task engagement, and gradual demand fading.",
        },
        {
          heading: "Example: attention-maintained behavior",
          body: "If behavior is maintained by adult attention, the plan might include scheduled attention, teaching appropriate requests, differential reinforcement, and consistent responses to problem behavior.",
        },
      ]}
      faqs={[
        {
          question: "Can I copy a BIP example directly?",
          answer: "No. Examples are starting points. A plan should be matched to the student's assessment data, context, function, and team capacity.",
        },
        {
          question: "What makes a BIP legally and practically stronger?",
          answer: "Clear definitions, function-based strategies, measurable goals, implementation supports, and data-based review make a BIP stronger.",
        },
      ]}
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Function-based BIP example framework</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Escape-maintained disruption",
              items: [
                "Prevention: shorten initial task, offer choice, preteach help routine.",
                "Replacement: request help, break, or smaller chunk of work.",
                "Reinforcement: praise and brief break for appropriate requests and task completion.",
                "Data: frequency of disruption and percentage of independent work completed.",
              ],
            },
            {
              title: "Attention-maintained calling out",
              items: [
                "Prevention: scheduled check-ins and high rates of positive attention.",
                "Replacement: raise hand, use help card, or request teacher attention.",
                "Reinforcement: immediate attention for replacement response, neutral redirection for calling out.",
                "Data: call-outs per period and replacement requests per opportunity.",
              ],
            },
          ].map((example) => (
            <div key={example.title} className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-950">{example.title}</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                {example.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </SeoArticlePage>
  );
}
