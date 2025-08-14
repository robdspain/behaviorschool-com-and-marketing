import { Users, Target, HeartHandshake, CheckCircle2 } from "lucide-react";

export function AboutUsOne() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-6 sm:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
      <div className="grid gap-10 md:grid-cols-2 md:gap-12 items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-200">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Built for school teams</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Practical, compassionate behavior systems for real classrooms
          </h2>
          <p className="mt-4 text-slate-700">
            We design tools and training that help BCBAs and educators solve the right problems, in the right order—
            from assessment to implementation to generalization—without burning out the adults who make it work.
          </p>

          <ul className="mt-6 grid gap-4">
            {[
              {
                icon: Target,
                title: "Systems first",
                desc: "Clear workflows from FBAs to skill acquisition with fidelity in mind.",
              },
              {
                icon: HeartHandshake,
                title: "Humane and effective",
                desc: "Compassionate practices grounded in the science of learning and behavior.",
              },
              {
                icon: CheckCircle2,
                title: "School‑ready defaults",
                desc: "Time‑saving templates and documentation that fit the school day.",
              },
            ].map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                  <f.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{f.title}</div>
                  <div className="text-slate-600">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="grid gap-4 sm:gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-medium text-slate-500">Focus</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">Assessment → Planning → Fluency → Generalization</div>
              <p className="mt-2 text-slate-600">A predictable path that teams can follow together.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-medium text-slate-500">Who we serve</div>
              <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1">
                <li>BCBAs and behavior specialists in schools</li>
                <li>Teachers and related service providers</li>
                <li>Graduate students preparing for the BCBA exam</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-medium text-slate-500">Highlights</div>
              <div className="mt-2 grid grid-cols-2 gap-4 text-slate-900">
                <div>
                  <div className="text-2xl font-bold">AI‑assisted</div>
                  <div className="text-slate-600">Study & planning</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">School‑tested</div>
                  <div className="text-slate-600">In real programs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -top-24 right-1/3 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
    </section>
  );
}


