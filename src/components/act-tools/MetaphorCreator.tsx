"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ClipboardCopy, Printer } from "lucide-react";

const steps = [
  "Student",
  "Process",
  "Metaphor",
  "Customize",
  "Finalize",
];

const gradeOptions = ["K-2", "3-5", "6-8", "9-12"] as const;
const actProcesses = ["Defusion", "Acceptance", "Present Moment", "Values"] as const;
const interestOptions = ["Sports", "Video Games", "Animals", "Music", "Art", "Nature"] as const;

type GradeLevel = typeof gradeOptions[number];
type ActProcess = typeof actProcesses[number];

type Metaphor = {
  id: string;
  title: string;
  actProcess: ActProcess;
  gradeLevel: GradeLevel[];
  summary: string;
  setup: string;
  instructions: string[];
  reflection: string[];
  adaptations: {
    younger: string;
    older: string;
    visual: string;
  };
  keywords: string[];
  source: string;
};

const metaphorLibrary: Metaphor[] = [
  {
    id: "leaves-on-a-stream",
    title: "Leaves on a Stream",
    actProcess: "Defusion",
    gradeLevel: ["3-5", "6-8", "9-12"],
    summary: "Watch thoughts float by without grabbing them.",
    setup: "Imagine sitting beside a gentle stream with leaves floating by.",
    instructions: [
      "Picture a thought placed on a leaf.",
      "Let the leaf drift downstream at its own pace.",
      "If your mind grabs a leaf, gently set it back on the water."
    ],
    reflection: [
      "What thoughts showed up?",
      "Was it easy or hard to let them float?",
      "How did it feel to watch without grabbing?"
    ],
    adaptations: {
      younger: "Use a bowl of water and real leaves.",
      older: "Write thoughts on paper leaves and float them.",
      visual: "Draw the stream and place sticky-note leaves."
    },
    keywords: ["thoughts", "mindfulness", "observation"],
    source: "ACT Made Simple (adapted)"
  },
  {
    id: "passengers-on-the-bus",
    title: "Passengers on the Bus",
    actProcess: "Defusion",
    gradeLevel: ["6-8", "9-12"],
    summary: "Thoughts are noisy passengers, but you are the driver.",
    setup: "Imagine you are driving a bus toward something that matters.",
    instructions: [
      "Name your destination (a value).",
      "Add a passenger for each loud thought or feeling.",
      "Keep driving even if the passengers shout."
    ],
    reflection: [
      "Which passengers are the loudest?",
      "What happens if you listen to them?",
      "What helps you keep driving?"
    ],
    adaptations: {
      younger: "Use toy buses and figures for passengers.",
      older: "Write passengers on cards and arrange them.",
      visual: "Draw the bus route with a destination."
    },
    keywords: ["values", "thoughts", "persistence"],
    source: "ACT for Kids (adapted)"
  },
  {
    id: "clouds-in-the-sky",
    title: "Clouds in the Sky",
    actProcess: "Defusion",
    gradeLevel: ["K-2", "3-5", "6-8"],
    summary: "Thoughts pass like clouds without needing action.",
    setup: "Picture your thoughts as clouds drifting across the sky.",
    instructions: [
      "Notice each cloud and name it.",
      "Watch it move without chasing it.",
      "Return attention to the open sky."
    ],
    reflection: [
      "Which clouds showed up?",
      "Did any cloud stick around?",
      "What was the sky like behind them?"
    ],
    adaptations: {
      younger: "Use cotton balls on blue paper.",
      older: "Take photos of clouds and label them.",
      visual: "Draw clouds on a whiteboard."
    },
    keywords: ["thoughts", "mindfulness"],
    source: "School ACT Toolkit (adapted)"
  },
  {
    id: "movie-theater",
    title: "Movie Theater",
    actProcess: "Defusion",
    gradeLevel: ["6-8", "9-12"],
    summary: "Watch thoughts like a movie instead of being in it.",
    setup: "Imagine sitting in a theater watching your thoughts on screen.",
    instructions: [
      "Notice the story playing on the screen.",
      "Stay in your seat as the observer.",
      "Let the scene change without reacting."
    ],
    reflection: [
      "What story was playing?",
      "How did it feel to be the observer?",
      "What changed when you stepped back?"
    ],
    adaptations: {
      younger: "Use a tablet or paper frame as the screen.",
      older: "Write the story as a script and read it.",
      visual: "Draw a theater screen with scenes."
    },
    keywords: ["observer", "distance"],
    source: "ACT in Schools (adapted)"
  },
  {
    id: "tug-of-war",
    title: "Tug of War with a Monster",
    actProcess: "Acceptance",
    gradeLevel: ["3-5", "6-8", "9-12"],
    summary: "Drop the rope instead of fighting feelings.",
    setup: "Imagine you are in a tug of war with a strong monster.",
    instructions: [
      "Notice how tired you feel pulling.",
      "Consider what happens if you drop the rope.",
      "Make room for the monster without letting it win."
    ],
    reflection: [
      "What does the monster say?",
      "How does your body feel while pulling?",
      "What could you do with your hands if you drop the rope?"
    ],
    adaptations: {
      younger: "Use a real rope with a partner.",
      older: "Write the monster's lines and your responses.",
      visual: "Sketch the rope and monster."
    },
    keywords: ["feelings", "struggle", "acceptance"],
    source: "ACT Made Simple (adapted)"
  },
  {
    id: "quicksand",
    title: "Quicksand",
    actProcess: "Acceptance",
    gradeLevel: ["6-8", "9-12"],
    summary: "Fighting feelings makes you sink; steady breathing helps.",
    setup: "Imagine stepping into quicksand.",
    instructions: [
      "Notice how thrashing makes you sink deeper.",
      "Try stillness and slow breathing instead.",
      "Look for steady, slow moves to get out."
    ],
    reflection: [
      "What happens when you fight the quicksand?",
      "What helps you float instead?",
      "How could this apply to big feelings?"
    ],
    adaptations: {
      younger: "Use a bowl of oobleck to show resistance.",
      older: "Compare to stress reactions in real life.",
      visual: "Draw two paths: fighting vs. floating."
    },
    keywords: ["feelings", "calm", "acceptance"],
    source: "ACT for Teens (adapted)"
  },
  {
    id: "beach-ball",
    title: "Beach Ball Underwater",
    actProcess: "Acceptance",
    gradeLevel: ["K-2", "3-5", "6-8"],
    summary: "Pushing feelings down takes energy; let them rise.",
    setup: "Imagine holding a beach ball under the water.",
    instructions: [
      "Notice how hard it is to keep the ball down.",
      "Let the ball rise and float next to you.",
      "Keep playing while the ball is nearby."
    ],
    reflection: [
      "What feelings are like the beach ball?",
      "What changes when you stop pushing?",
      "How can you still do what matters?"
    ],
    adaptations: {
      younger: "Use a real ball in a tub or sink.",
      older: "Link to stress or anxiety examples.",
      visual: "Draw the ball rising with a thought bubble."
    },
    keywords: ["feelings", "energy", "acceptance"],
    source: "ACT for Kids (adapted)"
  },
  {
    id: "five-senses",
    title: "5-4-3-2-1 Grounding",
    actProcess: "Present Moment",
    gradeLevel: ["3-5", "6-8", "9-12"],
    summary: "Use the five senses to return to now.",
    setup: "Let's bring attention back to the present moment.",
    instructions: [
      "Name 5 things you can see.",
      "Name 4 things you can feel.",
      "Name 3 things you can hear, 2 you can smell, 1 you can taste."
    ],
    reflection: [
      "Which sense was easiest to notice?",
      "Did your body feel different?",
      "When might this help you?"
    ],
    adaptations: {
      younger: "Use a scavenger hunt with pictures.",
      older: "Do it silently during class.",
      visual: "Use a hand chart for each sense."
    },
    keywords: ["grounding", "mindfulness"],
    source: "School ACT Toolkit (adapted)"
  },
  {
    id: "mindful-eating",
    title: "Mindful Eating (Raisin Exercise)",
    actProcess: "Present Moment",
    gradeLevel: ["6-8", "9-12"],
    summary: "Slow down and notice details with a small snack.",
    setup: "Hold a raisin or small snack in your hand.",
    instructions: [
      "Look at the texture and color.",
      "Smell it and notice what changes.",
      "Take a slow bite and describe the taste."
    ],
    reflection: [
      "What did you notice that you usually miss?",
      "How did slowing down feel?",
      "Where else could you use this skill?"
    ],
    adaptations: {
      younger: "Use a simple snack like a cracker.",
      older: "Compare fast vs. slow eating.",
      visual: "Draw the snack before eating."
    },
    keywords: ["awareness", "senses"],
    source: "ACT in Schools (adapted)"
  },
  {
    id: "body-scan",
    title: "Body Scan",
    actProcess: "Present Moment",
    gradeLevel: ["6-8", "9-12"],
    summary: "Notice sensations from head to toe.",
    setup: "Sit comfortably and bring attention to your body.",
    instructions: [
      "Start at the top of your head and slowly scan down.",
      "Notice tight, warm, or tired spots.",
      "Breathe into any area that feels tense."
    ],
    reflection: [
      "Where did you feel tension?",
      "Did anything relax as you noticed it?",
      "How could this help before tests or conflicts?"
    ],
    adaptations: {
      younger: "Use a body outline and color sensations.",
      older: "Try a 2-minute scan before class.",
      visual: "Use a simple body chart."
    },
    keywords: ["awareness", "calm"],
    source: "Mindfulness for Schools (adapted)"
  },
  {
    id: "values-compass",
    title: "Values Compass",
    actProcess: "Values",
    gradeLevel: ["6-8", "9-12"],
    summary: "Values are your compass; goals are your destinations.",
    setup: "Imagine carrying a compass that points to what matters most.",
    instructions: [
      "Name a value that matters to you.",
      "Notice how the compass points even when the path is hard.",
      "Choose one small step in that direction."
    ],
    reflection: [
      "What does your compass point to?",
      "What pulls you off course?",
      "What is one toward move today?"
    ],
    adaptations: {
      younger: "Use a paper compass with pictures.",
      older: "Write a value statement on the compass.",
      visual: "Draw a compass with four key values."
    },
    keywords: ["values", "direction"],
    source: "ACT Made Simple (adapted)"
  },
  {
    id: "life-as-garden",
    title: "Life as a Garden",
    actProcess: "Values",
    gradeLevel: ["3-5", "6-8"],
    summary: "Values are the plants you choose to grow.",
    setup: "Imagine your life as a garden you care for.",
    instructions: [
      "Pick a plant to represent something you value.",
      "Name what helps it grow (actions).",
      "Notice the weeds (distractions) that show up."
    ],
    reflection: [
      "What are your main plants right now?",
      "What daily actions are like water and sunlight?",
      "Which weeds need gentle pulling?"
    ],
    adaptations: {
      younger: "Use stickers or drawings of plants.",
      older: "Create a weekly garden care plan.",
      visual: "Draw a garden map."
    },
    keywords: ["values", "growth"],
    source: "ACT for Kids (adapted)"
  },
  {
    id: "climbing-mountain",
    title: "Climbing Your Mountain",
    actProcess: "Values",
    gradeLevel: ["6-8", "9-12"],
    summary: "Values are the summit; goals are the trail markers.",
    setup: "Imagine climbing a mountain that matters to you.",
    instructions: [
      "Name the summit (your value).",
      "Identify trail markers (small goals).",
      "Notice storms (difficult feelings) along the way."
    ],
    reflection: [
      "What summit are you climbing toward?",
      "What helps you keep moving when it gets steep?",
      "Who can hike with you?"
    ],
    adaptations: {
      younger: "Use a sticker trail on paper.",
      older: "Write three trail markers for the week.",
      visual: "Draw a mountain with flags."
    },
    keywords: ["values", "goals"],
    source: "ACT in Schools (adapted)"
  }
];

function formatMetaphorText(options: {
  metaphor: Metaphor;
  studentName: string;
  interests: string[];
  gradeLevel: GradeLevel | "";
}) {
  const { metaphor, studentName, interests, gradeLevel } = options;
  const nameLine = studentName.trim()
    ? `Student name: ${studentName.trim()}`
    : "Student name: (not provided)";
  const interestsLine = interests.length
    ? `Student interests: ${interests.join(", ")}`
    : "Student interests: (not provided)";
  const gradeLine = gradeLevel ? `Grade level: ${gradeLevel}` : "Grade level: (not provided)";
  const personalization = interests.length
    ? `Personalize by connecting to: ${interests.join(", ")}.`
    : "Personalize by connecting to the student's current interests.";

  return [
    `${metaphor.title} (${metaphor.actProcess})`,
    gradeLine,
    nameLine,
    interestsLine,
    "",
    metaphor.setup,
    personalization,
    "",
    "Instructions:",
    ...metaphor.instructions.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Reflection questions:",
    ...metaphor.reflection.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Adaptations:",
    `Younger students: ${metaphor.adaptations.younger}`,
    `Older students: ${metaphor.adaptations.older}`,
    `Visual learners: ${metaphor.adaptations.visual}`,
    "",
    `Keywords: ${metaphor.keywords.join(", ")}`,
    `Source: ${metaphor.source}`
  ].join("\n");
}

export default function MetaphorCreator() {
  const [stepIndex, setStepIndex] = useState(0);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | "">("");
  const [actProcess, setActProcess] = useState<ActProcess | "">("");
  const [selectedMetaphorId, setSelectedMetaphorId] = useState<string>("");
  const [studentName, setStudentName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  const filteredMetaphors = useMemo(() => {
    return metaphorLibrary.filter((metaphor) => {
      const matchesProcess = actProcess ? metaphor.actProcess === actProcess : true;
      const matchesGrade = gradeLevel ? metaphor.gradeLevel.includes(gradeLevel) : true;
      return matchesProcess && matchesGrade;
    });
  }, [actProcess, gradeLevel]);

  const selectedMetaphor = useMemo(() => {
    return metaphorLibrary.find((metaphor) => metaphor.id === selectedMetaphorId) || null;
  }, [selectedMetaphorId]);

  const finalText = useMemo(() => {
    if (!selectedMetaphor) return "";
    return formatMetaphorText({
      metaphor: selectedMetaphor,
      studentName,
      interests,
      gradeLevel,
    });
  }, [selectedMetaphor, studentName, interests, gradeLevel]);

  const canContinue = useMemo(() => {
    if (stepIndex === 0) return Boolean(gradeLevel);
    if (stepIndex === 1) return Boolean(actProcess);
    if (stepIndex === 2) return Boolean(selectedMetaphor);
    return true;
  }, [stepIndex, gradeLevel, actProcess, selectedMetaphor]);

  const handleCopy = async () => {
    if (!finalText) return;
    try {
      await navigator.clipboard.writeText(finalText);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("idle");
    }
  };

  const handleToggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />
      <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center space-y-4">
          <p className="text-xs font-semibold tracking-[0.3em] text-emerald-600 uppercase">ACT Tools</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">ACT Metaphor Creator</h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Build age-appropriate metaphors that help students notice thoughts, make room for feelings, and move toward what matters.
          </p>
        </div>

        <div className="mt-10 bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Step {stepIndex + 1} of {steps.length}</span>
                <span className="font-medium text-slate-700">{steps[stepIndex]}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`h-2 rounded-full transition-all ${
                      index <= stepIndex ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {stepIndex === 0 && (
                <section className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Select student grade level</h2>
                    <p className="text-sm text-slate-600">Choose the grade band for age-appropriate language.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {gradeOptions.map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setGradeLevel(grade)}
                        className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition-all ${
                          gradeLevel === grade
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200"
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {stepIndex === 1 && (
                <section className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Choose the ACT process</h2>
                    <p className="text-sm text-slate-600">Match the metaphor to today&apos;s skill focus.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {actProcesses.map((process) => (
                      <button
                        key={process}
                        type="button"
                        onClick={() => setActProcess(process)}
                        className={`rounded-2xl border p-5 text-left transition-all ${
                          actProcess === process
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-emerald-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                            actProcess === process ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"
                          }`}>
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-slate-900">{process}</p>
                            <p className="text-sm text-slate-600">
                              {process === "Defusion" && "Separating from unhelpful thoughts"}
                              {process === "Acceptance" && "Making room for big feelings"}
                              {process === "Present Moment" && "Grounding and mindfulness"}
                              {process === "Values" && "Clarifying what matters most"}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {stepIndex === 2 && (
                <section className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Browse the metaphor library</h2>
                    <p className="text-sm text-slate-600">Select a metaphor that fits the student and process.</p>
                  </div>
                  {filteredMetaphors.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-600">
                      No metaphors match that combination. Try adjusting the grade level or process.
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredMetaphors.map((metaphor) => (
                        <div
                          key={metaphor.id}
                          className={`rounded-2xl border p-5 transition-all ${
                            selectedMetaphorId === metaphor.id
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <p className="text-lg font-semibold text-slate-900">{metaphor.title}</p>
                              <p className="text-sm text-slate-600">{metaphor.summary}</p>
                              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                                <span className="rounded-full bg-slate-100 px-2 py-1">{metaphor.actProcess}</span>
                                {metaphor.gradeLevel.map((grade) => (
                                  <span key={grade} className="rounded-full bg-slate-100 px-2 py-1">{grade}</span>
                                ))}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant={selectedMetaphorId === metaphor.id ? "default" : "outline"}
                              className="h-11 px-6"
                              onClick={() => setSelectedMetaphorId(metaphor.id)}
                            >
                              {selectedMetaphorId === metaphor.id ? "Selected" : "Select"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {stepIndex === 3 && selectedMetaphor && (
                <section className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Customize the metaphor</h2>
                    <p className="text-sm text-slate-600">Add personal details to make the story stick.</p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700" htmlFor="student-name">Student name (optional)</label>
                        <input
                          id="student-name"
                          type="text"
                          value={studentName}
                          onChange={(event) => setStudentName(event.target.value)}
                          placeholder="e.g., Maya"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">Student interests</p>
                        <div className="flex flex-wrap gap-2">
                          {interestOptions.map((interest) => (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => handleToggleInterest(interest)}
                              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                interests.includes(interest)
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                              }`}
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Preview</p>
                      <h3 className="text-lg font-semibold text-slate-900 mt-2">{selectedMetaphor.title}</h3>
                      <p className="text-sm text-slate-600 mt-2">{selectedMetaphor.summary}</p>
                      <p className="text-sm text-slate-600 mt-4">{selectedMetaphor.setup}</p>
                      {interests.length > 0 && (
                        <p className="text-sm text-emerald-700 mt-3">
                          We can connect this to {interests.join(", ")}.
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {stepIndex === 4 && selectedMetaphor && (
                <section className="space-y-6">
                  <div className="print:hidden">
                    <h2 className="text-xl font-semibold text-slate-900">Final metaphor</h2>
                    <p className="text-sm text-slate-600">Print or copy the session-ready script.</p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg print:shadow-none print:border-none print:bg-white">
                    <div className="hidden print:block text-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">ACT Metaphor Creator</h2>
                      <p className="text-sm text-slate-600">Prepared for classroom or counseling sessions</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{selectedMetaphor.actProcess}</p>
                        <h3 className="text-2xl font-bold text-slate-900">{selectedMetaphor.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {gradeLevel ? `Grade level: ${gradeLevel}` : "Grade level: (not set)"}
                        </p>
                        {studentName.trim() && (
                          <p className="text-sm text-slate-600">Student: {studentName.trim()}</p>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">Setup</h4>
                        <p className="text-sm text-slate-700 mt-1">{selectedMetaphor.setup}</p>
                        <p className="text-sm text-slate-700 mt-2">
                          {interests.length > 0
                            ? `Personalize by connecting to ${interests.join(", ")}.`
                            : "Personalize by connecting to the student's current interests."}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">Instructions</h4>
                        <ol className="mt-2 list-decimal list-inside text-sm text-slate-700 space-y-1">
                          {selectedMetaphor.instructions.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">Reflection questions</h4>
                        <ul className="mt-2 list-disc list-inside text-sm text-slate-700 space-y-1">
                          {selectedMetaphor.reflection.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-emerald-50 p-4">
                          <p className="text-xs font-semibold text-emerald-700 uppercase">Younger</p>
                          <p className="text-sm text-emerald-900 mt-2">{selectedMetaphor.adaptations.younger}</p>
                        </div>
                        <div className="rounded-2xl bg-sky-50 p-4">
                          <p className="text-xs font-semibold text-sky-700 uppercase">Older</p>
                          <p className="text-sm text-sky-900 mt-2">{selectedMetaphor.adaptations.older}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold text-slate-700 uppercase">Visual</p>
                          <p className="text-sm text-slate-900 mt-2">{selectedMetaphor.adaptations.visual}</p>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500">
                        Keywords: {selectedMetaphor.keywords.join(", ")}
                      </div>
                      <div className="text-xs text-slate-500">Source: {selectedMetaphor.source}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                    <Button type="button" className="h-11 px-6" onClick={handleCopy}>
                      <ClipboardCopy className="mr-2 h-4 w-4" />
                      {copyStatus === "copied" ? "Copied" : "Copy to clipboard"}
                    </Button>
                    <Button type="button" variant="outline" className="h-11 px-6" onClick={() => window.print()}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                  </div>
                </section>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 print:hidden">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
                disabled={stepIndex === 0}
              >
                Back
              </Button>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={() => setStepIndex(0)}
                >
                  Start over
                </Button>
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))}
                  disabled={!canContinue || stepIndex === steps.length - 1}
                >
                  {stepIndex === steps.length - 1 ? "Done" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
