"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Plus, Trash2, 
  BarChart3, Target, Clock, AlertTriangle, CheckCircle, User,
  Brain, Heart, Zap, Shield
} from "lucide-react";

// Types
interface QuestionnaireAnswers {
  studentName: string;
  grade: string;
  // Inner + Away (difficult thoughts/feelings)
  difficultThoughts: string[];
  difficultFeelings: string[];
  // Inner + Toward (values, what matters)
  values: string[];
  whatMatters: string;
  // Outer + Away (avoidance behaviors)
  avoidanceBehaviors: string[];
  // Outer + Toward (values-consistent actions)
  towardBehaviors: string[];
  // Direct verbal statements
  selfStatements: string[];
}

interface Statement {
  id: string;
  text: string;
  context: string;
  source: "questionnaire" | "manual";
  validatingLatency: number | null;
  challengingLatency: number | null;
}

type Step = "questionnaire" | "matrix" | "context" | "statements" | "fusion-fa" | "results";

const CONTEXT_OPTIONS = [
  "During math class",
  "During reading/writing",
  "When given a new assignment",
  "When asked to work with others",
  "During transitions",
  "At recess/lunch",
  "When corrected by teacher",
  "When struggling with work",
  "When called on in class",
  "When peers are watching",
  "In the morning",
  "After lunch",
  "During tests",
];

// Examples shown as hints (not clickable options)
const DIFFICULT_THOUGHTS_EXAMPLES = [
  "I'm going to fail",
  "Nobody likes me",
  "I can't do anything right",
];

const DIFFICULT_FEELINGS_EXAMPLES = [
  "Worried/Anxious",
  "Angry/Frustrated",
  "Overwhelmed",
];

const VALUES_EXAMPLES = [
  "Family",
  "Learning new things",
  "Being helpful",
];

const AVOIDANCE_EXAMPLES = [
  "Leave the classroom",
  "Shut down/go quiet",
  "Refuse to work",
];

export default function FusionFAWorkflow() {
  const [step, setStep] = useState<Step>("questionnaire");
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    studentName: "",
    grade: "",
    difficultThoughts: [],
    difficultFeelings: [],
    values: [],
    whatMatters: "",
    avoidanceBehaviors: [],
    towardBehaviors: [],
    selfStatements: [],
  });
  const [customThought, setCustomThought] = useState("");
  const [customFeeling, setCustomFeeling] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [customAvoidance, setCustomAvoidance] = useState("");
  const [customStatement, setCustomStatement] = useState("");
  const [statements, setStatements] = useState<Statement[]>([]);
  const [customContextIds, setCustomContextIds] = useState<Set<string>>(new Set());
  // Timer state: tracks accumulated time and running state per statement/condition
  const [timerStates, setTimerStates] = useState<Record<string, { accumulated: number; isRunning: boolean }>>({});
  const [activeTimer, setActiveTimer] = useState<{ statementId: string; condition: "validating" | "challenging" } | null>(null);
  const [timerInterval, setTimerIntervalState] = useState<NodeJS.Timeout | null>(null);

  // Toggle selection helpers
  const toggleSelection = (field: keyof QuestionnaireAnswers, value: string) => {
    const current = answers[field] as string[];
    if (current.includes(value)) {
      setAnswers({ ...answers, [field]: current.filter(v => v !== value) });
    } else {
      setAnswers({ ...answers, [field]: [...current, value] });
    }
  };

  const addCustomThought = () => {
    if (customThought.trim() && !answers.difficultThoughts.includes(customThought.trim())) {
      setAnswers({ 
        ...answers, 
        difficultThoughts: [...answers.difficultThoughts, customThought.trim()] 
      });
      setCustomThought("");
    }
  };

  // Move to context step - extract statements from questionnaire
  const extractStatements = () => {
    const extracted: Statement[] = answers.difficultThoughts.map((thought, idx) => ({
      id: `q-${idx}`,
      text: thought,
      context: "",
      source: "questionnaire" as const,
      validatingLatency: null,
      challengingLatency: null,
    }));
    // Add any direct self-statements
    answers.selfStatements.forEach((stmt, idx) => {
      extracted.push({
        id: `s-${idx}`,
        text: stmt,
        context: "",
        source: "questionnaire" as const,
        validatingLatency: null,
        challengingLatency: null,
      });
    });
    setStatements(extracted);
    setStep("context");
  };

  // Update context for a statement
  const updateStatementContext = (id: string, context: string) => {
    setStatements(statements.map(s => s.id === id ? { ...s, context } : s));
  };

  // Timer functions - support pause/resume
  const getTimerKey = (statementId: string, condition: "validating" | "challenging") => `${statementId}-${condition}`;
  
  const getTimerState = (statementId: string, condition: "validating" | "challenging") => {
    const key = getTimerKey(statementId, condition);
    return timerStates[key] || { accumulated: 0, isRunning: false };
  };

  const startTimer = (statementId: string, condition: "validating" | "challenging") => {
    // Stop any existing timer
    if (timerInterval) clearInterval(timerInterval);
    
    const key = getTimerKey(statementId, condition);
    const currentState = timerStates[key] || { accumulated: 0, isRunning: false };
    
    setActiveTimer({ statementId, condition });
    setTimerStates(prev => ({ ...prev, [key]: { ...currentState, isRunning: true } }));
    
    const interval = setInterval(() => {
      setTimerStates(prev => {
        const state = prev[key] || { accumulated: 0, isRunning: true };
        return { ...prev, [key]: { ...state, accumulated: state.accumulated + 0.1 } };
      });
    }, 100);
    setTimerIntervalState(interval);
  };

  const pauseTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    if (activeTimer) {
      const key = getTimerKey(activeTimer.statementId, activeTimer.condition);
      setTimerStates(prev => ({ ...prev, [key]: { ...prev[key], isRunning: false } }));
    }
    setActiveTimer(null);
    setTimerIntervalState(null);
  };

  const recordTimer = (statementId: string, condition: "validating" | "challenging") => {
    const key = getTimerKey(statementId, condition);
    const state = timerStates[key];
    if (state && state.accumulated > 0) {
      setStatements(statements.map(s => {
        if (s.id === statementId) {
          return {
            ...s,
            [condition === "validating" ? "validatingLatency" : "challengingLatency"]: Math.round(state.accumulated * 10) / 10
          };
        }
        return s;
      }));
    }
  };

  const resetTimer = (statementId: string, condition: "validating" | "challenging") => {
    const key = getTimerKey(statementId, condition);
    // Stop if this timer is running
    if (activeTimer?.statementId === statementId && activeTimer?.condition === condition) {
      if (timerInterval) clearInterval(timerInterval);
      setActiveTimer(null);
      setTimerIntervalState(null);
    }
    setTimerStates(prev => ({ ...prev, [key]: { accumulated: 0, isRunning: false } }));
    // Also clear the recorded latency
    setStatements(statements.map(s => {
      if (s.id === statementId) {
        return {
          ...s,
          [condition === "validating" ? "validatingLatency" : "challengingLatency"]: null
        };
      }
      return s;
    }));
  };

  // Legacy stopTimer for backward compatibility
  const stopTimer = () => {
    pauseTimer();
    setTimerIntervalState(null);
  };

  const addManualStatement = () => {
    if (customStatement.trim()) {
      setStatements([...statements, {
        id: `m-${Date.now()}`,
        text: customStatement.trim(),
        context: "",
        source: "manual",
        validatingLatency: null,
        challengingLatency: null,
      }]);
      setCustomStatement("");
    }
  };

  const removeStatement = (id: string) => {
    setStatements(statements.filter(s => s.id !== id));
  };

  const getResults = () => {
    return statements
      .filter(s => s.validatingLatency !== null && s.challengingLatency !== null)
      .map(s => ({
        ...s,
        delta: (s.validatingLatency || 0) - (s.challengingLatency || 0),
      }))
      .sort((a, b) => b.delta - a.delta);
  };

  const getFusionLevel = (delta: number) => {
    if (delta >= 30) return { level: "High", color: "text-red-400", bg: "bg-red-500/20", priority: true };
    if (delta >= 15) return { level: "Moderate", color: "text-yellow-400", bg: "bg-yellow-500/20", priority: false };
    return { level: "Low", color: "text-green-400", bg: "bg-green-500/20", priority: false };
  };

  // Comprehensive Relational Frame Types based on RFT literature
  type RelationalFrameType = 
    | "coordination-self" // I am X (self-as-content)
    | "coordination-other" // They are X, X is Y
    | "opposition" // X is opposite of Y
    | "distinction" // X is different from Y
    | "comparison-self" // I am more/less X than others
    | "comparison-general" // X is better/worse than Y
    | "hierarchical" // I am part of X, X contains Y
    | "temporal-past" // X happened, because of past
    | "temporal-future" // X will happen, prediction
    | "temporal-always" // X always/never happens
    | "causal" // X causes Y, because X then Y
    | "conditional" // If X then Y, must/should/have to
    | "deictic-self" // I-here-now perspective
    | "deictic-other" // You-there-then, they think X
    | "spatial" // Here/there, in/out, close/far
    | "evaluative" // X is good/bad, right/wrong
    | "general";

  // Generate validating and challenging prompts based on statement and context
  const generatePrompts = (statement: Statement) => {
    const text = statement.text.toLowerCase();
    const originalText = statement.text;
    const context = statement.context || "";
    
    // Comprehensive frame detection
    let frameType: RelationalFrameType = "general";
    
    // COORDINATION - Sameness/Equivalence frames
    if (/^i('m| am) (a |an |the )?/.test(text) && /(stupid|dumb|bad|worthless|failure|loser|idiot|ugly|fat|weak|broken|mess|disaster)/.test(text)) {
      frameType = "coordination-self";
    } else if (/^(i('m| am)|i feel) (like )?(nothing|nobody|invisible|alone|empty|lost)/.test(text)) {
      frameType = "coordination-self";
    } else if (/(they|he|she|everyone|people|kids|teachers?) (is|are|think|say|believe)/.test(text)) {
      frameType = "coordination-other";
    }
    // OPPOSITION frames
    else if (/(opposite|contrary|against|versus|rather than)/.test(text)) {
      frameType = "opposition";
    } else if (/(not like|unlike|the reverse|instead of)/.test(text)) {
      frameType = "opposition";
    }
    // DISTINCTION frames  
    else if (/(different|unique|separate|apart|not the same|don't belong|don't fit)/.test(text)) {
      frameType = "distinction";
    } else if (/(outsider|outcast|weirdo|freak|not like (them|others|everyone))/.test(text)) {
      frameType = "distinction";
    }
    // COMPARISON frames
    else if (/(worse|better|more|less|smarter|dumber|prettier|uglier) than/.test(text)) {
      frameType = "comparison-self";
    } else if (/(not (as|good|smart|pretty|fast) (as|enough))/.test(text)) {
      frameType = "comparison-self";
    } else if (/(the worst|the best|most|least|biggest|smallest)/.test(text)) {
      frameType = "comparison-general";
    }
    // HIERARCHICAL frames
    else if (/(part of|belong to|member of|in the group|on the team)/.test(text)) {
      frameType = "hierarchical";
    } else if (/(type of|kind of|category|all \w+ are)/.test(text)) {
      frameType = "hierarchical";
    }
    // TEMPORAL frames
    else if (/(used to|back when|remember when|that time|before|after|since|when i was)/.test(text)) {
      frameType = "temporal-past";
    } else if (/(going to|gonna|will|won't|about to|someday|eventually|soon)/.test(text)) {
      frameType = "temporal-future";
    } else if (/(always|never|every time|all the time|constantly|forever|eternally)/.test(text)) {
      frameType = "temporal-always";
    }
    // CAUSAL frames
    else if (/(because|since|therefore|so|that's why|the reason|caused|made me|fault)/.test(text)) {
      frameType = "causal";
    } else if (/(leads to|results in|ends up|turns into)/.test(text)) {
      frameType = "causal";
    }
    // CONDITIONAL frames (rules)
    else if (/(if i|when i|whenever|unless|only if|as long as)/.test(text)) {
      frameType = "conditional";
    } else if (/(have to|must|should|need to|supposed to|got to|can't|cannot|not allowed)/.test(text)) {
      frameType = "conditional";
    }
    // DEICTIC frames (perspective-taking)
    else if (/(i know|i see|i feel|i think|from my|in my experience|for me)/.test(text)) {
      frameType = "deictic-self";
    } else if (/(they think|they see|from their|in their eyes|they probably|they must think)/.test(text)) {
      frameType = "deictic-other";
    }
    // SPATIAL frames
    else if (/(here|there|inside|outside|close|far|near|away|in this|out of)/.test(text)) {
      frameType = "spatial";
    } else if (/(trapped|stuck|cornered|surrounded|boxed in|no way out)/.test(text)) {
      frameType = "spatial";
    }
    // EVALUATIVE frames
    else if (/(good|bad|right|wrong|fair|unfair|stupid idea|dumb thing|mistake)/.test(text)) {
      frameType = "evaluative";
    } else if (/(sucks|terrible|awful|horrible|great|amazing|perfect)/.test(text)) {
      frameType = "evaluative";
    }

    // Generate context-aware prompts
    const ctx = context ? `, especially ${context.toLowerCase()}` : "";
    const ctxStart = context ? `When ${context.toLowerCase()}, ` : "";
    
    let validating = "";
    let challenging = "";
    let frameLabel = "";
    
    switch (frameType) {
      case "coordination-self":
        frameLabel = "Self-as-Content";
        validating = `"${ctxStart}I can see why you'd think '${originalText}'. When that thought shows up, it probably feels completely true."`;
        challenging = `"I'm curious about something. Is '${originalText}' a fact about you, or is it more like a thought your mind is having${ctx}? What's the difference?"`;
        break;
        
      case "coordination-other":
        frameLabel = "Other-Coordination";
        validating = `"It sounds like you really believe '${originalText}'${ctx}. That must be hard to carry around."`;
        challenging = `"How do you know for certain that '${originalText}'? Is there any way to check if that's actually true, or might your mind be filling in the blanks?"`;
        break;

      case "opposition":
        frameLabel = "Opposition";
        validating = `"I hear you saying '${originalText}'${ctx}. It sounds like you see these as completely opposite."`;
        challenging = `"What if '${originalText}' isn't as black-and-white as it seems? Are there any shades of gray your mind might be missing?"`;
        break;

      case "distinction":
        frameLabel = "Distinction/Difference";
        validating = `"${ctxStart}When you think '${originalText}', it makes sense that you'd feel separate or different."`;
        challenging = `"I wonder—in what ways might you actually be similar to others, even when '${originalText}' feels true${ctx}?"`;
        break;

      case "comparison-self":
        frameLabel = "Self-Comparison";
        validating = `"I can understand why '${originalText}' would feel true${ctx}. Comparing ourselves to others is something we all do."`;
        challenging = `"When your mind tells you '${originalText}', is it comparing you to everyone fairly, or might it be picking specific examples${ctx}?"`;
        break;

      case "comparison-general":
        frameLabel = "Comparison";
        validating = `"It sounds like '${originalText}' feels like an accurate assessment to you${ctx}."`;
        challenging = `"I'm curious—by what standard are you measuring '${originalText}'? Is there another way to look at this${ctx}?"`;
        break;

      case "hierarchical":
        frameLabel = "Hierarchical/Category";
        validating = `"${ctxStart}I hear that '${originalText}' is an important way you see yourself fitting in."`;
        challenging = `"What if '${originalText}' is just one way to categorize things? Are there other groups or categories that might also apply${ctx}?"`;
        break;

      case "temporal-past":
        frameLabel = "Temporal-Past";
        validating = `"When you remember '${originalText}'${ctx}, I can see why that past experience would still affect you."`;
        challenging = `"That happened in the past. I wonder—does '${originalText}' have to define what happens now or in the future${ctx}?"`;
        break;

      case "temporal-future":
        frameLabel = "Temporal-Future";
        validating = `"${ctxStart}When you think '${originalText}', that prediction probably feels very certain."`;
        challenging = `"Has there ever been a time when you predicted something bad would happen and it turned out differently? What would it mean if '${originalText}' wasn't guaranteed${ctx}?"`;
        break;

      case "temporal-always":
        frameLabel = "Temporal-Absolute";
        validating = `"It sounds like '${originalText}' feels like an absolute truth${ctx}—like it happens without exception."`;
        challenging = `"'Always' and 'never' are pretty strong words. Can you think of even one exception to '${originalText}'${ctx}? What would that mean?"`;
        break;

      case "causal":
        frameLabel = "Causal";
        validating = `"I understand—when you think '${originalText}'${ctx}, there's a clear cause and effect in your mind."`;
        challenging = `"What if there are other causes besides the one your mind is focused on? Could '${originalText}' have multiple explanations${ctx}?"`;
        break;

      case "conditional":
        frameLabel = "Conditional/Rule";
        validating = `"${ctxStart}I hear you saying '${originalText}'. It sounds like this rule feels absolutely necessary to follow."`;
        challenging = `"What would happen if '${originalText}' wasn't actually a rule you had to follow${ctx}? What's the worst that could realistically happen?"`;
        break;

      case "deictic-self":
        frameLabel = "Self-Perspective";
        validating = `"From your perspective${ctx}, '${originalText}' makes complete sense."`;
        challenging = `"If your best friend was in this exact situation${ctx}, would they see it the same way? What might they notice that's different from '${originalText}'?"`;
        break;

      case "deictic-other":
        frameLabel = "Other-Perspective";
        validating = `"It sounds like you're pretty sure about what others think—'${originalText}'${ctx}."`;
        challenging = `"I'm curious—can you actually read their minds? Is it possible '${originalText}' is more of a guess than a fact${ctx}?"`;
        break;

      case "spatial":
        frameLabel = "Spatial";
        validating = `"${ctxStart}When you feel '${originalText}', that sense of being trapped or stuck must be overwhelming."`;
        challenging = `"Even when '${originalText}' feels true${ctx}, are there any small movements or options your mind might not be noticing?"`;
        break;

      case "evaluative":
        frameLabel = "Evaluative";
        validating = `"I can see why '${originalText}' would feel like an accurate judgment${ctx}."`;
        challenging = `"Who decides whether '${originalText}' is true? Is this evaluation a fact or an opinion—and whose opinion is it${ctx}?"`;
        break;

      default:
        frameLabel = "Verbal Relation";
        validating = `"${ctxStart}I hear you saying '${originalText}'. That thought makes sense given what you've shared."`;
        challenging = `"What if '${originalText}' is just a thought your mind is having, not necessarily the whole truth${ctx}? What else might be true?"`;
    }
    
    return { validating, challenging, frameType: frameLabel };
  };

  const allComplete = statements.length > 0 && statements.every(s => s.validatingLatency !== null && s.challengingLatency !== null);

  // Step indicator
  const steps = [
    { id: "questionnaire", label: "Questionnaire", icon: User },
    { id: "matrix", label: "ACT Matrix", icon: Brain },
    { id: "context", label: "Context", icon: Target },
    { id: "statements", label: "Review", icon: CheckCircle },
    { id: "fusion-fa", label: "Fusion FA", icon: Clock },
    { id: "results", label: "Results", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-20 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/calaba-2026/assessment-tools"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Assessment Tools
          </Link>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-cyan-300">
            Fusion Hierarchy Assessment Workflow
          </h1>
          <p className="text-slate-300 text-sm">
            Complete student questionnaire → ACT Matrix → Latency-based functional analysis
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isPast = steps.findIndex(x => x.id === step) > idx;
            return (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isActive ? "bg-cyan-500/20 text-cyan-300" : 
                  isPast ? "text-emerald-400" : "text-slate-500"
                }`}>
                  {isPast ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${isPast ? "bg-emerald-500" : "bg-slate-700"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        
        {/* STEP 1: Questionnaire */}
        {step === "questionnaire" && (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" /> Student Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Student Name/ID</label>
                  <input
                    type="text"
                    value={answers.studentName}
                    onChange={(e) => setAnswers({ ...answers, studentName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter name or ID"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Grade</label>
                  <select
                    value={answers.grade}
                    onChange={(e) => setAnswers({ ...answers, grade: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select grade</option>
                    {["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(g => (
                      <option key={g} value={g}>{g === "K" ? "Kindergarten" : `Grade ${g}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Difficult Thoughts (Inner + Away) */}
            <div className="bg-slate-800 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" /> Difficult Thoughts
              </h3>
              <p className="text-slate-400 text-sm mb-2">
                "What thoughts show up that make things hard for you at school?"
              </p>
              <p className="text-slate-500 text-xs mb-4 italic">
                Examples: "{DIFFICULT_THOUGHTS_EXAMPLES.join('", "')}"
              </p>
              
              {/* Recorded thoughts */}
              {answers.difficultThoughts.length > 0 && (
                <div className="mb-4 space-y-2">
                  {answers.difficultThoughts.map((thought, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2">
                      <span className="text-red-200">"{thought}"</span>
                      <button
                        onClick={() => setAnswers({ ...answers, difficultThoughts: answers.difficultThoughts.filter((_, i) => i !== idx) })}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customThought}
                  onChange={(e) => setCustomThought(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomThought()}
                  placeholder="Type a thought the student shared..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button
                  onClick={addCustomThought}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Difficult Feelings */}
            <div className="bg-slate-800 border border-orange-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-400" /> Difficult Feelings
              </h3>
              <p className="text-slate-400 text-sm mb-2">
                "What feelings show up that are hard to deal with?"
              </p>
              <p className="text-slate-500 text-xs mb-4 italic">
                Examples: {DIFFICULT_FEELINGS_EXAMPLES.join(", ")}
              </p>
              
              {/* Recorded feelings */}
              {answers.difficultFeelings.length > 0 && (
                <div className="mb-4 space-y-2">
                  {answers.difficultFeelings.map((feeling, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-orange-500/20 border border-orange-500/30 rounded-lg px-4 py-2">
                      <span className="text-orange-200">{feeling}</span>
                      <button
                        onClick={() => setAnswers({ ...answers, difficultFeelings: answers.difficultFeelings.filter((_, i) => i !== idx) })}
                        className="text-orange-400 hover:text-orange-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFeeling}
                  onChange={(e) => setCustomFeeling(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customFeeling.trim()) {
                      setAnswers({ ...answers, difficultFeelings: [...answers.difficultFeelings, customFeeling.trim()] });
                      setCustomFeeling("");
                    }
                  }}
                  placeholder="Type a feeling the student described..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button
                  onClick={() => {
                    if (customFeeling.trim()) {
                      setAnswers({ ...answers, difficultFeelings: [...answers.difficultFeelings, customFeeling.trim()] });
                      setCustomFeeling("");
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Values (Inner + Toward) */}
            <div className="bg-slate-800 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" /> What Matters to You
              </h3>
              <p className="text-slate-400 text-sm mb-2">
                "What's important to you? What do you care about?"
              </p>
              <p className="text-slate-500 text-xs mb-4 italic">
                Examples: {VALUES_EXAMPLES.join(", ")}
              </p>
              
              {/* Recorded values */}
              {answers.values.length > 0 && (
                <div className="mb-4 space-y-2">
                  {answers.values.map((value, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-2">
                      <span className="text-emerald-200">{value}</span>
                      <button
                        onClick={() => setAnswers({ ...answers, values: answers.values.filter((_, i) => i !== idx) })}
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customValue.trim()) {
                      setAnswers({ ...answers, values: [...answers.values, customValue.trim()] });
                      setCustomValue("");
                    }
                  }}
                  placeholder="Type what the student said matters to them..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button
                  onClick={() => {
                    if (customValue.trim()) {
                      setAnswers({ ...answers, values: [...answers.values, customValue.trim()] });
                      setCustomValue("");
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Avoidance Behaviors (Outer + Away) */}
            <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" /> What You Do When It Gets Hard
              </h3>
              <p className="text-slate-400 text-sm mb-2">
                "When those difficult thoughts and feelings show up, what do you usually do?"
              </p>
              <p className="text-slate-500 text-xs mb-4 italic">
                Examples: {AVOIDANCE_EXAMPLES.join(", ")}
              </p>
              
              {/* Recorded behaviors */}
              {answers.avoidanceBehaviors.length > 0 && (
                <div className="mb-4 space-y-2">
                  {answers.avoidanceBehaviors.map((behavior, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-purple-500/20 border border-purple-500/30 rounded-lg px-4 py-2">
                      <span className="text-purple-200">{behavior}</span>
                      <button
                        onClick={() => setAnswers({ ...answers, avoidanceBehaviors: answers.avoidanceBehaviors.filter((_, i) => i !== idx) })}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAvoidance}
                  onChange={(e) => setCustomAvoidance(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customAvoidance.trim()) {
                      setAnswers({ ...answers, avoidanceBehaviors: [...answers.avoidanceBehaviors, customAvoidance.trim()] });
                      setCustomAvoidance("");
                    }
                  }}
                  placeholder="Type what the student does when it gets hard..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button
                  onClick={() => {
                    if (customAvoidance.trim()) {
                      setAnswers({ ...answers, avoidanceBehaviors: [...answers.avoidanceBehaviors, customAvoidance.trim()] });
                      setCustomAvoidance("");
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setStep("matrix")}
                disabled={answers.difficultThoughts.length === 0}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                View ACT Matrix <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ACT Matrix */}
        {step === "matrix" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" /> {answers.studentName || "Student"}'s ACT Matrix
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Inner + Away */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <h4 className="text-red-400 font-bold text-sm uppercase tracking-wide mb-1">Inner + Away</h4>
                  <p className="text-slate-400 text-xs mb-3">Difficult thoughts & feelings</p>
                  <div className="space-y-1">
                    {answers.difficultThoughts.map(t => (
                      <div key={t} className="text-red-200 text-sm">• "{t}"</div>
                    ))}
                    {answers.difficultFeelings.map(f => (
                      <div key={f} className="text-red-200 text-sm">• {f}</div>
                    ))}
                    {answers.difficultThoughts.length === 0 && answers.difficultFeelings.length === 0 && (
                      <p className="text-slate-500 text-sm italic">No thoughts recorded</p>
                    )}
                  </div>
                </div>

                {/* Inner + Toward */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wide mb-1">Inner + Toward</h4>
                  <p className="text-slate-400 text-xs mb-3">Values & what matters</p>
                  <div className="space-y-1">
                    {answers.values.map(v => (
                      <div key={v} className="text-cyan-200 text-sm">• {v}</div>
                    ))}
                    {answers.values.length === 0 && (
                      <p className="text-slate-500 text-sm italic">No values recorded</p>
                    )}
                  </div>
                </div>

                {/* Outer + Away */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <h4 className="text-purple-400 font-bold text-sm uppercase tracking-wide mb-1">Outer + Away</h4>
                  <p className="text-slate-400 text-xs mb-3">Avoidance behaviors</p>
                  <div className="space-y-1">
                    {answers.avoidanceBehaviors.map(b => (
                      <div key={b} className="text-purple-200 text-sm">• {b}</div>
                    ))}
                    {answers.avoidanceBehaviors.length === 0 && (
                      <p className="text-slate-500 text-sm italic">No behaviors recorded</p>
                    )}
                  </div>
                </div>

                {/* Outer + Toward */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wide mb-1">Outer + Toward</h4>
                  <p className="text-slate-400 text-xs mb-3">Values-consistent actions</p>
                  <div className="text-slate-500 text-sm italic">
                    (Intervention targets — what we want to increase)
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("questionnaire")}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={extractStatements}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                Extract Statements for FA <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Context Capture */}
        {step === "context" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" /> Statement Context
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                For each statement, identify when/where the student typically makes this statement or when this thought occurs.
              </p>
              
              {/* Statement + Context Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-3 text-slate-400 text-sm font-medium w-1/2">Statement</th>
                      <th className="text-left py-3 text-slate-400 text-sm font-medium w-1/2">Context (When does this happen?)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statements.map(s => {
                      const isCustomMode = customContextIds.has(s.id) || (s.context && !CONTEXT_OPTIONS.includes(s.context));
                      return (
                        <tr key={s.id} className="border-b border-slate-700">
                          <td className="py-4 pr-4">
                            <span className="text-white">"{s.text}"</span>
                          </td>
                          <td className="py-4">
                            <div className="space-y-2">
                              <select
                                value={isCustomMode ? "custom" : s.context}
                                onChange={(e) => {
                                  if (e.target.value === "custom") {
                                    // Enable custom mode for this statement
                                    setCustomContextIds(prev => new Set(prev).add(s.id));
                                  } else {
                                    // Disable custom mode and set the selected value
                                    setCustomContextIds(prev => {
                                      const next = new Set(prev);
                                      next.delete(s.id);
                                      return next;
                                    });
                                    updateStatementContext(s.id, e.target.value);
                                  }
                                }}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                              >
                                <option value="">Select context...</option>
                                {CONTEXT_OPTIONS.map(ctx => (
                                  <option key={ctx} value={ctx}>{ctx}</option>
                                ))}
                                <option value="custom">Other (type below)</option>
                              </select>
                              {isCustomMode && (
                                <input
                                  type="text"
                                  value={CONTEXT_OPTIONS.includes(s.context) ? "" : s.context}
                                  placeholder="Describe the context..."
                                  onChange={(e) => updateStatementContext(s.id, e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statement + Context Summary */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
              <h4 className="text-cyan-400 font-semibold mb-3">Statement-Context Summary</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cyan-500/30">
                      <th className="text-left py-2 text-cyan-300">#</th>
                      <th className="text-left py-2 text-cyan-300">Verbal Statement</th>
                      <th className="text-left py-2 text-cyan-300">Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statements.map((s, idx) => (
                      <tr key={s.id} className="border-b border-slate-700">
                        <td className="py-2 text-white">{idx + 1}</td>
                        <td className="py-2 text-white">"{s.text}"</td>
                        <td className="py-2 text-slate-300">{s.context || <span className="text-slate-500 italic">Not specified</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("matrix")}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep("statements")}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                Review Statements <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Statement Review */}
        {step === "statements" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" /> Review Statements
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                These verbal statements will be tested in validating vs. challenging conditions. 
                Remove any that don't apply or add more.
              </p>
              
              <div className="space-y-2 mb-4">
                {statements.map(s => (
                  <div key={s.id} className="flex items-center justify-between bg-slate-900 rounded-lg px-4 py-3">
                    <div>
                      <span className="text-white">"{s.text}"</span>
                      {s.context && <span className="text-slate-500 text-sm ml-2">— {s.context}</span>}
                    </div>
                    <button
                      onClick={() => removeStatement(s.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customStatement}
                  onChange={(e) => setCustomStatement(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addManualStatement()}
                  placeholder="Add another statement to test..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <button
                  onClick={addManualStatement}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("context")}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep("fusion-fa")}
                disabled={statements.length === 0}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                Start Fusion FA <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Fusion FA */}
        {step === "fusion-fa" && (
          <div className="space-y-6">
            {/* Protocol Info */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" /> Fusion FA Protocol
              </h3>
              <div className="text-sm text-slate-300 space-y-2">
                <p><strong className="text-green-400">1. Validating Condition:</strong> Read the green prompt to validate/support the student's verbal relation</p>
                <p><strong className="text-red-400">2. Challenging Condition:</strong> Read the red prompt to gently challenge the verbal relation</p>
                <p><strong className="text-cyan-400">3. Measure:</strong> Start timer when you begin speaking → Stop at first precursor (posture shift, facial tension, self-talk, looking away)</p>
                <p><strong className="text-yellow-400">4. Compare:</strong> Larger Δ (validating − challenging) = higher fusion = priority defusion target</p>
              </div>
            </div>

            {/* Statements with timers */}
            <div className="space-y-6">
              {statements.map((statement, idx) => {
                const prompts = generatePrompts(statement);
                return (
                  <div key={statement.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                    {/* Statement Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-slate-500">Statement {idx + 1}</span>
                          <span className="text-[10px] bg-slate-700 text-slate-400 px-2 py-0.5 rounded uppercase">
                            {prompts.frameType.replace("-", " ")}
                          </span>
                        </div>
                        <p className="text-white font-semibold text-lg">"{statement.text}"</p>
                        {statement.context && (
                          <p className="text-slate-400 text-sm mt-1">Context: {statement.context}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {/* Validating */}
                      {(() => {
                        const vState = getTimerState(statement.id, "validating");
                        const isActive = activeTimer?.statementId === statement.id && activeTimer?.condition === "validating";
                        return (
                          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <div className="text-xs text-green-400 font-bold uppercase tracking-wide mb-2">Validating Prompt</div>
                            <p className="text-green-200/80 text-sm italic mb-4 leading-relaxed">{prompts.validating}</p>
                            
                            <div className="border-t border-green-500/20 pt-3 mt-3">
                              <div className="text-xs text-green-400 mb-2">Latency to Precursor</div>
                              
                              {/* Show recorded value if saved */}
                              {statement.validatingLatency !== null ? (
                                <div className="flex items-center justify-between">
                                  <div className="text-2xl font-bold text-green-300">{statement.validatingLatency}s ✓</div>
                                  <button
                                    onClick={() => resetTimer(statement.id, "validating")}
                                    className="text-green-400 hover:text-green-300"
                                    title="Reset"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {/* Timer display */}
                                  <div className="text-2xl font-bold text-green-300 mb-3">
                                    {vState.accumulated.toFixed(1)}s
                                    {vState.isRunning && <span className="text-green-400 text-sm ml-2 animate-pulse">●</span>}
                                  </div>
                                  
                                  {/* Timer controls */}
                                  <div className="flex gap-2">
                                    {isActive ? (
                                      <button
                                        onClick={pauseTimer}
                                        className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                                      >
                                        <Pause className="w-4 h-4" /> Pause
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => startTimer(statement.id, "validating")}
                                        disabled={activeTimer !== null && !isActive}
                                        className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                                      >
                                        <Play className="w-4 h-4" /> {vState.accumulated > 0 ? "Resume" : "Start"}
                                      </button>
                                    )}
                                    {vState.accumulated > 0 && !isActive && (
                                      <button
                                        onClick={() => recordTimer(statement.id, "validating")}
                                        className="bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                                      >
                                        <CheckCircle className="w-4 h-4" /> Record
                                      </button>
                                    )}
                                    {vState.accumulated > 0 && (
                                      <button
                                        onClick={() => resetTimer(statement.id, "validating")}
                                        className="text-green-400 hover:text-green-300 px-2"
                                        title="Reset"
                                      >
                                        <RotateCcw className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Challenging */}
                      {(() => {
                        const cState = getTimerState(statement.id, "challenging");
                        const isActive = activeTimer?.statementId === statement.id && activeTimer?.condition === "challenging";
                        return (
                          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <div className="text-xs text-red-400 font-bold uppercase tracking-wide mb-2">Challenging Prompt</div>
                            <p className="text-red-200/80 text-sm italic mb-4 leading-relaxed">{prompts.challenging}</p>
                            
                            <div className="border-t border-red-500/20 pt-3 mt-3">
                              <div className="text-xs text-red-400 mb-2">Latency to Precursor</div>
                              
                              {/* Show recorded value if saved */}
                              {statement.challengingLatency !== null ? (
                                <div className="flex items-center justify-between">
                                  <div className="text-2xl font-bold text-red-300">{statement.challengingLatency}s ✓</div>
                                  <button
                                    onClick={() => resetTimer(statement.id, "challenging")}
                                    className="text-red-400 hover:text-red-300"
                                    title="Reset"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {/* Timer display */}
                                  <div className="text-2xl font-bold text-red-300 mb-3">
                                    {cState.accumulated.toFixed(1)}s
                                    {cState.isRunning && <span className="text-red-400 text-sm ml-2 animate-pulse">●</span>}
                                  </div>
                                  
                                  {/* Timer controls */}
                                  <div className="flex gap-2">
                                    {isActive ? (
                                      <button
                                        onClick={pauseTimer}
                                        className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                                      >
                                        <Pause className="w-4 h-4" /> Pause
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => startTimer(statement.id, "challenging")}
                                        disabled={activeTimer !== null && !isActive}
                                        className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                                      >
                                        <Play className="w-4 h-4" /> {cState.accumulated > 0 ? "Resume" : "Start"}
                                      </button>
                                    )}
                                    {cState.accumulated > 0 && !isActive && (
                                      <button
                                        onClick={() => recordTimer(statement.id, "challenging")}
                                        className="bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                                      >
                                        <CheckCircle className="w-4 h-4" /> Record
                                      </button>
                                    )}
                                    {cState.accumulated > 0 && (
                                      <button
                                        onClick={() => resetTimer(statement.id, "challenging")}
                                        className="text-red-400 hover:text-red-300 px-2"
                                        title="Reset"
                                      >
                                        <RotateCcw className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("statements")}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              {allComplete && (
                <button
                  onClick={() => setStep("results")}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
                >
                  View Results <BarChart3 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Results */}
        {step === "results" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border-2 border-cyan-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" /> Fusion Hierarchy Results — {answers.studentName || "Student"}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="pb-3 text-slate-400 text-sm font-medium">Rank</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium">Statement</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium">Context</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">Valid.</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">Chall.</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">Δ</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">Fusion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getResults().map((result, idx) => {
                      const fusion = getFusionLevel(result.delta);
                      return (
                        <tr key={result.id} className="border-b border-slate-700">
                          <td className="py-3 text-white font-bold">{idx + 1}</td>
                          <td className="py-3 text-white">"{result.text}"</td>
                          <td className="py-3 text-slate-400 text-sm">{result.context || "—"}</td>
                          <td className="py-3 text-green-300 text-center">{result.validatingLatency}s</td>
                          <td className="py-3 text-red-300 text-center">{result.challengingLatency}s</td>
                          <td className="py-3 text-cyan-300 text-center font-bold">{result.delta.toFixed(1)}s</td>
                          <td className="py-3 text-center">
                            <span className={`${fusion.bg} ${fusion.color} px-2 py-1 rounded text-xs font-medium`}>
                              {fusion.level}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Intervention Targets */}
              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                <h4 className="font-semibold text-white mb-3">🎯 Priority Defusion Targets</h4>
                <div className="space-y-3">
                  {getResults().filter(r => getFusionLevel(r.delta).priority).map((r, idx) => (
                    <div key={r.id} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <div className="flex items-center gap-3 text-red-300 font-medium">
                        <span className="font-bold">{idx + 1}.</span>
                        <span>"{r.text}"</span>
                        <span className="text-slate-500 text-sm">(Δ {r.delta.toFixed(1)}s)</span>
                      </div>
                      {r.context && (
                        <div className="text-slate-400 text-sm mt-1 ml-6">
                          Context: {r.context}
                        </div>
                      )}
                    </div>
                  ))}
                  {getResults().filter(r => getFusionLevel(r.delta).priority).length === 0 && (
                    <p className="text-slate-400 text-sm">No high-fusion statements identified. Consider retesting or adding more statements.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("fusion-fa")}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => window.print()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium"
              >
                Print Report
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        <p>CalABA 2026 Symposium — Fusion Hierarchy Assessment Demo</p>
        <p className="mt-1">Based on KCUSD Latency-Based FA Methodology</p>
      </footer>
    </div>
  );
}
