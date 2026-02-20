"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { 
  ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Plus, Trash2, 
  BarChart3, Target, Clock, AlertTriangle, CheckCircle, User,
  Brain, Heart, Zap, Shield, FileText, Download, LogIn, Users,
  ClipboardList, Sparkles, Loader2
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

// Types
interface QuestionnaireAnswers {
  studentName: string;
  studentAge: string;
  grade: string;
  assessorName: string;
  assessmentDate: string;
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

// AFQ-Y (Avoidance and Fusion Questionnaire for Youth) - 8 item version
interface AFQYAnswers {
  completed: boolean;
  responses: Record<string, number>; // 0-4 scale (Not at all true - Very true)
}

// Parent CPFQ (Comprehensive Psychological Flexibility Questionnaire)
interface ParentCPFQAnswers {
  completed: boolean;
  parentName: string;
  relationship: string;
  responses: Record<string, number>;
  openResponses: Record<string, string>;
}

// Behavior Profile (Precursors + Triggers + Target Behavior)
interface BehaviorProfile {
  targetBehavior: string; // Operational definition
  precursors: string[]; // Observable behaviors that predict target behavior
  triggers: string[]; // Antecedent events/contexts
}

interface Statement {
  id: string;
  title: string; // Short descriptive title (e.g., "The Shiny Door")
  text: string;
  context: string;
  source: "questionnaire" | "manual" | "afqy" | "parent";
  validatingLatency: number | null;
  challengingLatency: number | null;
  validatingPrecursors: string;
  challengingPrecursors: string;
  // AI-generated scripts (arrays for multiple scripts)
  aiValidatingScripts?: string[];
  aiChallengingScripts?: string[];
  aiRelationType?: string; // e.g., "Causal / Fused"
  aiRelationExplanation?: string; // Rich explanation of the relational frame
  scriptsGenerated?: boolean;
  scriptsLoading?: boolean;
  // Legacy single-script fields (deprecated)
  aiValidating?: string;
  aiChallenging?: string;
  aiFrameType?: string;
}

type Step = "cpfq" | "questionnaire" | "matrix" | "context" | "statements" | "behavior-profile" | "fusion-fa" | "results";

// AFQ-Y Questions (8-item validated version)
const AFQY_QUESTIONS = [
  { id: "afqy1", text: "My life won't be good until I feel happy." },
  { id: "afqy2", text: "My thoughts and feelings mess up my life." },
  { id: "afqy3", text: "If I feel sad or afraid, something must be wrong with me." },
  { id: "afqy4", text: "The bad things I think about myself must be true." },
  { id: "afqy5", text: "I don't try new things if I'm afraid I will fail." },
  { id: "afqy6", text: "I must get rid of my worries and fears so I can have a good life." },
  { id: "afqy7", text: "I do worse in school when I have thoughts that make me feel sad." },
  { id: "afqy8", text: "I am afraid of my feelings." },
];

// Parent CPFQ Questions
const PARENT_CPFQ_QUESTIONS = [
  { id: "pcpfq1", text: "My child avoids activities when they feel anxious or worried.", category: "avoidance" },
  { id: "pcpfq2", text: "My child seems to believe their negative thoughts about themselves.", category: "fusion" },
  { id: "pcpfq3", text: "My child has difficulty doing things that matter to them when upset.", category: "values" },
  { id: "pcpfq4", text: "My child gets stuck on difficult thoughts or feelings.", category: "fusion" },
  { id: "pcpfq5", text: "My child tries to push away or suppress uncomfortable feelings.", category: "avoidance" },
  { id: "pcpfq6", text: "My child can notice their feelings without getting overwhelmed.", category: "acceptance", reverse: true },
  { id: "pcpfq7", text: "My child can do what's important even when feeling nervous.", category: "values", reverse: true },
  { id: "pcpfq8", text: "My child seems to take their thoughts too literally (believes everything they think).", category: "fusion" },
];

const PARENT_OPEN_QUESTIONS = [
  { id: "popen1", label: "What thoughts seem to 'hook' your child the most?", placeholder: "e.g., 'I'm stupid', 'Nobody likes me', 'I can't do it'" },
  { id: "popen2", label: "What does your child avoid because of difficult feelings?", placeholder: "e.g., new activities, social situations, challenging schoolwork" },
  { id: "popen3", label: "What matters most to your child? What do they care about?", placeholder: "e.g., friends, family, sports, games, learning" },
];

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

export default function FusionFAWorkflow() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Workflow state
  const [step, setStep] = useState<Step>("cpfq");
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    studentName: "",
    studentAge: "",
    grade: "",
    assessorName: "",
    assessmentDate: new Date().toISOString().split('T')[0],
    difficultThoughts: [],
    difficultFeelings: [],
    values: [],
    whatMatters: "",
    avoidanceBehaviors: [],
    towardBehaviors: [],
    selfStatements: [],
  });
  
  // AFQ-Y state
  const [afqyAnswers, setAfqyAnswers] = useState<AFQYAnswers>({
    completed: false,
    responses: {},
  });
  
  // Parent CPFQ state
  const [parentCpfq, setParentCpfq] = useState<ParentCPFQAnswers>({
    completed: false,
    parentName: "",
    relationship: "",
    responses: {},
    openResponses: {},
  });
  
  // Behavior Profile state (precursors + triggers)
  const [behaviorProfile, setBehaviorProfile] = useState<BehaviorProfile>({
    targetBehavior: "",
    precursors: [],
    triggers: [],
  });
  const [newPrecursor, setNewPrecursor] = useState("");
  const [newTrigger, setNewTrigger] = useState("");
  
  // Other state
  const [customThought, setCustomThought] = useState("");
  const [customFeeling, setCustomFeeling] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [customAvoidance, setCustomAvoidance] = useState("");
  const [customStatement, setCustomStatement] = useState("");
  const [statements, setStatements] = useState<Statement[]>([]);
  const [customContextIds, setCustomContextIds] = useState<Set<string>>(new Set());
  const [timerStates, setTimerStates] = useState<Record<string, { accumulated: number; isRunning: boolean }>>({});
  const [activeTimer, setActiveTimer] = useState<{ statementId: string; condition: "validating" | "challenging" } | null>(null);
  const [timerInterval, setTimerIntervalState] = useState<NodeJS.Timeout | null>(null);

  // Check auth on mount
  useEffect(() => {
    const supabase = createClient();
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setUserEmail(session?.user?.email || null);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/calaba-2026/assessment-tools/fusion-fa`,
      },
    });
  };

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

  // Calculate AFQ-Y score
  const getAfqyScore = () => {
    const responses = Object.values(afqyAnswers.responses);
    if (responses.length === 0) return null;
    return responses.reduce((sum, val) => sum + val, 0);
  };

  const getAfqyInterpretation = (score: number | null) => {
    if (score === null) return { level: "Incomplete", color: "text-slate-400" };
    if (score <= 8) return { level: "Low psychological inflexibility", color: "text-green-400" };
    if (score <= 16) return { level: "Moderate psychological inflexibility", color: "text-yellow-400" };
    return { level: "High psychological inflexibility", color: "text-red-400" };
  };

  // Calculate Parent CPFQ score
  const getParentCpfqScore = () => {
    const responses = Object.values(parentCpfq.responses);
    if (responses.length === 0) return null;
    let score = 0;
    PARENT_CPFQ_QUESTIONS.forEach(q => {
      const val = parentCpfq.responses[q.id] || 0;
      score += q.reverse ? (4 - val) : val;
    });
    return score;
  };

  // Extract statements from all sources
  const extractStatements = () => {
    const extracted: Statement[] = [];
    
    // From questionnaire
    answers.difficultThoughts.forEach((thought, idx) => {
      extracted.push({
        id: `q-${idx}`,
        title: "",
        text: thought,
        context: "",
        source: "questionnaire",
        validatingLatency: null,
        challengingLatency: null,
        validatingPrecursors: "",
        challengingPrecursors: "",
      });
    });
    
    // From AFQ-Y high-scoring items
    AFQY_QUESTIONS.forEach(q => {
      const score = afqyAnswers.responses[q.id];
      if (score >= 3) { // High endorsement
        extracted.push({
          id: `afqy-${q.id}`,
          title: "",
          text: q.text,
          context: "",
          source: "afqy",
          validatingLatency: null,
          challengingLatency: null,
          validatingPrecursors: "",
          challengingPrecursors: "",
        });
      }
    });
    
    // From Parent open responses
    if (parentCpfq.openResponses.popen1) {
      const thoughts = parentCpfq.openResponses.popen1.split(',').map(t => t.trim()).filter(t => t);
      thoughts.forEach((thought, idx) => {
        if (!extracted.some(e => e.text.toLowerCase() === thought.toLowerCase())) {
          extracted.push({
            id: `parent-${idx}`,
            title: "",
            text: thought,
            context: "",
            source: "parent",
            validatingLatency: null,
            challengingLatency: null,
            validatingPrecursors: "",
            challengingPrecursors: "",
          });
        }
      });
    }
    
    setStatements(extracted);
    setStep("context");
  };

  // Update context for a statement
  const updateStatementContext = (id: string, context: string) => {
    setStatements(prev => prev.map(s => s.id === id ? { ...s, context } : s));
  };

  // Timer functions
  const getTimerKey = (statementId: string, condition: "validating" | "challenging") => `${statementId}-${condition}`;
  
  const getTimerState = (statementId: string, condition: "validating" | "challenging") => {
    const key = getTimerKey(statementId, condition);
    return timerStates[key] || { accumulated: 0, isRunning: false };
  };

  const startTimer = (statementId: string, condition: "validating" | "challenging") => {
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
      setStatements(prev => prev.map(s => {
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
    if (activeTimer?.statementId === statementId && activeTimer?.condition === condition) {
      if (timerInterval) clearInterval(timerInterval);
      setActiveTimer(null);
      setTimerIntervalState(null);
    }
    setTimerStates(prev => ({ ...prev, [key]: { accumulated: 0, isRunning: false } }));
    setStatements(prev => prev.map(s => {
      if (s.id === statementId) {
        return {
          ...s,
          [condition === "validating" ? "validatingLatency" : "challengingLatency"]: null
        };
      }
      return s;
    }));
  };

  const addManualStatement = () => {
    if (customStatement.trim()) {
      setStatements([...statements, {
        id: `m-${Date.now()}`,
        title: "",
        text: customStatement.trim(),
        context: "",
        source: "manual",
        validatingLatency: null,
        challengingLatency: null,
        validatingPrecursors: "",
        challengingPrecursors: "",
      }]);
      setCustomStatement("");
    }
  };

  // Update precursors for a statement
  const updatePrecursors = (id: string, condition: "validating" | "challenging", value: string) => {
    setStatements(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          [condition === "validating" ? "validatingPrecursors" : "challengingPrecursors"]: value
        };
      }
      return s;
    }));
  };

  // Generate AI scripts for a statement
  const generateAIScripts = async (id: string) => {
    const statement = statements.find(s => s.id === id);
    if (!statement) return;

    // Set loading state
    setStatements(prev => prev.map(s => s.id === id ? { ...s, scriptsLoading: true } : s));

    try {
      const response = await fetch('/api/fusion-fa/generate-scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statement: statement.text,
          context: statement.context,
          studentName: answers.studentName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatements(prev => prev.map(s => {
          if (s.id === id) {
            return {
              ...s,
              // New array-based fields
              aiValidatingScripts: data.validatingScripts || [data.validating],
              aiChallengingScripts: data.challengingScripts || [data.challenging],
              aiRelationType: data.relationType || data.frameType,
              aiRelationExplanation: data.relationExplanation || "",
              // Auto-set title if empty
              title: s.title || data.suggestedTitle || s.title,
              // Legacy fields for backward compatibility
              aiValidating: data.validatingScripts?.[0] || data.validating,
              aiChallenging: data.challengingScripts?.[0] || data.challenging,
              aiFrameType: data.relationType || data.frameType,
              scriptsGenerated: true,
              scriptsLoading: false,
            };
          }
          return s;
        }));
      } else {
        throw new Error('Failed to generate scripts');
      }
    } catch (error) {
      console.error('Script generation error:', error);
      setStatements(prev => prev.map(s => s.id === id ? { ...s, scriptsLoading: false } : s));
    }
  };

  // Generate scripts for all statements
  const generateAllScripts = async () => {
    for (const statement of statements) {
      if (!statement.scriptsGenerated) {
        await generateAIScripts(statement.id);
      }
    }
  };

  const removeStatement = (id: string) => {
    setStatements(prev => prev.filter(s => s.id !== id));
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

  // Generate prompts based on statement
  const generatePrompts = (statement: Statement) => {
    const text = statement.text.toLowerCase();
    const originalText = statement.text;
    const context = statement.context || "";
    const ctx = context ? `, especially ${context.toLowerCase()}` : "";
    const ctxStart = context ? `When ${context.toLowerCase()}, ` : "";
    
    let validating = "";
    let challenging = "";
    let frameLabel = "Verbal Relation";
    
    // Self-as-content patterns
    if (/^(i('m| am)|i feel) /.test(text) && /(stupid|dumb|bad|worthless|failure|loser|can't|afraid|scared)/.test(text)) {
      frameLabel = "Self-as-Content";
      validating = `"${ctxStart}I can see why you'd think '${originalText}'. When that thought shows up, it probably feels completely true."`;
      challenging = `"I'm curious about something. Is '${originalText}' a fact about you, or is it more like a thought your mind is having${ctx}? What's the difference?"`;
    }
    // Temporal-always patterns
    else if (/(always|never|every time|won't|can't)/.test(text)) {
      frameLabel = "Temporal-Absolute";
      validating = `"It sounds like '${originalText}' feels like an absolute truth${ctx}—like it happens without exception."`;
      challenging = `"'Always' and 'never' are pretty strong words. Can you think of even one exception to '${originalText}'${ctx}? What would that mean?"`;
    }
    // Conditional patterns
    else if (/(have to|must|should|need to|until|won't be)/.test(text)) {
      frameLabel = "Conditional/Rule";
      validating = `"${ctxStart}I hear you saying '${originalText}'. It sounds like this rule feels absolutely necessary to follow."`;
      challenging = `"What would happen if '${originalText}' wasn't actually a rule you had to follow${ctx}? What's the worst that could realistically happen?"`;
    }
    // Causal patterns
    else if (/(because|mess up|make me|wrong with me)/.test(text)) {
      frameLabel = "Causal";
      validating = `"I understand—when you think '${originalText}'${ctx}, there's a clear cause and effect in your mind."`;
      challenging = `"What if there are other causes besides the one your mind is focused on? Could '${originalText}' have multiple explanations${ctx}?"`;
    }
    // Default
    else {
      validating = `"${ctxStart}I hear you saying '${originalText}'. That thought makes sense given what you've shared."`;
      challenging = `"What if '${originalText}' is just a thought your mind is having, not necessarily the whole truth${ctx}? What else might be true?"`;
    }
    
    return { validating, challenging, frameType: frameLabel };
  };

  const allComplete = statements.length > 0 && statements.every(s => s.validatingLatency !== null && s.challengingLatency !== null);

  // Generate Rich Report (Format matching Rob's example)
  const generateReport = () => {
    const results = getResults();
    const afqyScore = getAfqyScore();
    const parentScore = getParentCpfqScore();
    
    // Build statement rows with AI-generated or fallback content
    const statementRows = statements.map((s, idx) => {
      const fallbackPrompts = generatePrompts(s);
      const result = results.find(r => r.id === s.id);
      return {
        ...s,
        rowNumber: idx + 1,
        title: s.title || `Statement ${idx + 1}`,
        relation: s.aiRelationType || fallbackPrompts.frameType,
        relationExplanation: s.aiRelationExplanation || "",
        validatingScripts: s.aiValidatingScripts || [fallbackPrompts.validating],
        challengingScripts: s.aiChallengingScripts || [fallbackPrompts.challenging],
        delta: result?.delta,
        fusionLevel: result ? getFusionLevel(result.delta).level : null,
      };
    });

    // Generate the rich format report
    const reportContent = `FUSION HIERARCHY ASSESSMENT REPORT
================================================================================
Student: ${answers.studentName || "Not specified"}
Age: ${answers.studentAge || ""} | Grade: ${answers.grade || ""}
Assessor: ${answers.assessorName || "Not specified"}
Date: ${answers.assessmentDate}
Generated: ${new Date().toLocaleString()}

CPFQ SCORE: ${parentScore !== null ? `${parentScore}/32` : "Not completed"}

================================================================================
BEHAVIOR PROFILE
================================================================================

TARGET BEHAVIOR:
${behaviorProfile.targetBehavior || "(Not specified)"}

PRECURSOR BEHAVIORS (observed during latency timing):
${behaviorProfile.precursors.length > 0 ? behaviorProfile.precursors.map(p => `  • ${p}`).join('\n') : "  (None specified)"}

KNOWN TRIGGERS:
${behaviorProfile.triggers.length > 0 ? behaviorProfile.triggers.map(t => `  • ${t}`).join('\n') : "  (None specified)"}

================================================================================
STATEMENT ANALYSIS
================================================================================

${statementRows.map((s) => `
Row ${s.rowNumber}: ${s.title}
--------------------------------------------------------------------------------

Statement: ${s.text}

Context: ${s.context || "Not specified"}

Relation: ${s.relation}${s.relationExplanation ? `. ${s.relationExplanation}` : ""}

Validating Scripts:
${s.validatingScripts.map(script => `• ${script.replace(/^"|"$/g, '')}`).join('\n')}

Challenging Scripts:
${s.challengingScripts.map(script => `• ${script.replace(/^"|"$/g, '')}`).join('\n')}

Precursors (Control/Validating): ${s.validatingPrecursors || "(Not recorded)"}
Time in Control: ${s.validatingLatency !== null ? `${s.validatingLatency}s` : "Not recorded"}

Precursors (Test/Challenging): ${s.challengingPrecursors || "(Not recorded)"}
Time in Test: ${s.challengingLatency !== null ? `${s.challengingLatency}s` : "Not recorded"}

Delta (V-C): ${s.delta !== undefined ? `${s.delta.toFixed(1)}s` : "N/A"}
Fusion Level: ${s.fusionLevel || "N/A"}
`).join('\n')}

================================================================================
ACT MATRIX SUMMARY
================================================================================

INNER + AWAY (Difficult Thoughts/Feelings):
${answers.difficultThoughts.map(t => `  • "${t}"`).join('\n') || "  None recorded"}
${answers.difficultFeelings.map(f => `  • ${f}`).join('\n') || ""}

INNER + TOWARD (Values):
${answers.values.map(v => `  • ${v}`).join('\n') || "  None recorded"}

OUTER + AWAY (Avoidance Behaviors):
${answers.avoidanceBehaviors.map(b => `  • ${b}`).join('\n') || "  None recorded"}

================================================================================
PRIORITY DEFUSION TARGETS
================================================================================
${results.filter(r => getFusionLevel(r.delta).priority).length > 0 
  ? results.filter(r => getFusionLevel(r.delta).priority).map((r, idx) => {
      const statement = statements.find(s => s.id === r.id);
      return `${idx + 1}. ${statement?.title || "Statement"}: "${r.text}" (Δ ${r.delta.toFixed(1)}s) - ${r.context || "No context"}`;
    }).join('\n')
  : "No high-fusion statements identified"}

================================================================================
INTERVENTION RECOMMENDATIONS
================================================================================
1. DEFUSION: Target statements with high fusion scores using challenging scripts above
2. VALUES: Build on ${answers.values.slice(0, 3).join(', ') || "identified values"}
3. ACCEPTANCE: Address avoidance of ${answers.avoidanceBehaviors.slice(0, 2).join(', ') || "identified triggers"}
4. COMMITTED ACTION: Connect values-based goals to challenging scripts

================================================================================
Fusion Hierarchy Assessment Tool | CalABA 2026 | Behavior School Pro
    `.trim();

    // Create download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fusion-fa-report-${answers.studentName || 'student'}-${answers.assessmentDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Step indicator
  const steps = [
    { id: "cpfq", label: "CPFQ", icon: ClipboardList },
    { id: "questionnaire", label: "Interview", icon: User },
    { id: "matrix", label: "ACT Matrix", icon: Brain },
    { id: "context", label: "Context", icon: Target },
    { id: "statements", label: "Review", icon: CheckCircle },
    { id: "behavior-profile", label: "Precursors", icon: AlertTriangle },
    { id: "fusion-fa", label: "Fusion FA", icon: Clock },
    { id: "results", label: "Results", icon: BarChart3 },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Fusion Hierarchy Assessment</h1>
              <p className="text-slate-400">Sign in to access this professional assessment tool</p>
            </div>
            
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
              <p className="text-cyan-300 text-sm">
                <strong>Free with Behavior School Pro</strong><br />
                This tool is part of the free tier. Sign in with Google to continue.
              </p>
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-slate-100 rounded-xl transition-all text-slate-800 font-semibold"
            >
              <FcGoogle className="h-6 w-6" />
              <span>Continue with Google</span>
            </button>
            
            <p className="text-center text-slate-500 text-sm mt-6">
              <Link href="/calaba-2026" className="text-cyan-400 hover:text-cyan-300">
                ← Back to CalABA 2026
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-20 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/calaba-2026"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to CalABA 2026
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-cyan-300">
                Fusion Hierarchy Assessment
              </h1>
              <p className="text-slate-300 text-sm">
                Complete ACT-informed functional assessment with latency-based analysis
              </p>
            </div>
            <div className="text-right text-sm text-slate-400">
              <div>Signed in as</div>
              <div className="text-cyan-400">{userEmail}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3 overflow-x-auto">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const currentIdx = steps.findIndex(x => x.id === step);
            const isPast = currentIdx > idx;
            const isFuture = currentIdx < idx;
            return (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => setStep(s.id as Step)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                    isActive ? "bg-cyan-500/20 text-cyan-300" : 
                    isPast ? "text-emerald-400 hover:bg-emerald-500/10" : 
                    "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
                  }`}
                >
                  {isPast ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  <span className="text-xs font-medium hidden md:inline">{s.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`w-4 md:w-8 h-0.5 mx-1 flex-shrink-0 ${isPast ? "bg-emerald-500" : "bg-slate-700"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        
        {/* STEP 1: CPFQ */}
        {step === "cpfq" && (
          <div className="space-y-6">
            {/* Student & Assessment Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-cyan-400" /> Assessment Info
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Student Name</label>
                  <input
                    type="text"
                    value={answers.studentName}
                    onChange={(e) => setAnswers({ ...answers, studentName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Age</label>
                  <input
                    type="text"
                    value={answers.studentAge}
                    onChange={(e) => setAnswers({ ...answers, studentAge: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Grade</label>
                  <select
                    value={answers.grade}
                    onChange={(e) => setAnswers({ ...answers, grade: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="">Select</option>
                    {["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Assessor</label>
                  <input
                    type="text"
                    value={answers.assessorName}
                    onChange={(e) => setAnswers({ ...answers, assessorName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Your name"
                  />
                </div>
              </div>
            </div>

            {/* CPFQ */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" /> CPFQ - Comprehensive Psychological Flexibility Questionnaire
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Parent/Caregiver report on student's psychological flexibility
              </p>
              
              {/* Parent Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Parent/Caregiver Name</label>
                  <input
                    type="text"
                    value={parentCpfq.parentName}
                    onChange={(e) => setParentCpfq(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Relationship to Student</label>
                  <select
                    value={parentCpfq.relationship}
                    onChange={(e) => setParentCpfq(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="">Select</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              {/* Rating Questions */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Rate how true each statement is for your child:</h4>
                <div className="flex items-center justify-center gap-4 mb-4 text-xs text-slate-400">
                  <span>0 = Not at all</span>
                  <span>1 = A little</span>
                  <span>2 = Somewhat</span>
                  <span>3 = Very</span>
                  <span>4 = Extremely</span>
                </div>
                
                <div className="space-y-4">
                  {PARENT_CPFQ_QUESTIONS.map((q, idx) => (
                    <div key={q.id} className="bg-slate-900/50 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <span className="text-slate-500 text-sm font-mono">{idx + 1}.</span>
                        <div className="flex-1">
                          <p className="text-white mb-3">{q.text}</p>
                          <div className="flex gap-2">
                            {[0, 1, 2, 3, 4].map(val => (
                              <button
                                key={val}
                                onClick={() => setParentCpfq(prev => ({
                                  ...prev,
                                  responses: { ...prev.responses, [q.id]: val }
                                }))}
                                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                  parentCpfq.responses[q.id] === val
                                    ? "bg-purple-600 text-white"
                                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Open-ended Questions */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Additional Information:</h4>
                {PARENT_OPEN_QUESTIONS.map(q => (
                  <div key={q.id} className="bg-slate-900/50 rounded-lg p-4">
                    <label className="text-white text-sm mb-2 block">{q.label}</label>
                    <textarea
                      value={parentCpfq.openResponses[q.id] || ""}
                      onChange={(e) => setParentCpfq(prev => ({
                        ...prev,
                        openResponses: { ...prev.openResponses, [q.id]: e.target.value }
                      }))}
                      placeholder={q.placeholder}
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setParentCpfq(prev => ({ ...prev, completed: true }));
                  setStep("questionnaire");
                }}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                Continue to Interview <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Questionnaire (Clinical Interview) */}
        {step === "questionnaire" && (
          <div className="space-y-6">
            {/* Difficult Thoughts */}
            <div className="bg-slate-800 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" /> Difficult Thoughts
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                "What thoughts show up that make things hard for you at school?"
              </p>
              
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
                <button onClick={addCustomThought} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Difficult Feelings */}
            <div className="bg-slate-800 border border-orange-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-400" /> Difficult Feelings
              </h3>
              <p className="text-slate-400 text-sm mb-4">"What feelings show up that are hard to deal with?"</p>
              
              {answers.difficultFeelings.length > 0 && (
                <div className="mb-4 space-y-2">
                  {answers.difficultFeelings.map((feeling, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-orange-500/20 border border-orange-500/30 rounded-lg px-4 py-2">
                      <span className="text-orange-200">{feeling}</span>
                      <button onClick={() => setAnswers({ ...answers, difficultFeelings: answers.difficultFeelings.filter((_, i) => i !== idx) })} className="text-orange-400 hover:text-orange-300">
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
                  placeholder="Type a feeling..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button
                  onClick={() => {
                    if (customFeeling.trim()) {
                      setAnswers({ ...answers, difficultFeelings: [...answers.difficultFeelings, customFeeling.trim()] });
                      setCustomFeeling("");
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Values */}
            <div className="bg-slate-800 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" /> What Matters
              </h3>
              <p className="text-slate-400 text-sm mb-4">"What's important to you? What do you care about?"</p>
              
              {answers.values.length > 0 && (
                <div className="mb-4 space-y-2">
                  {answers.values.map((value, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-2">
                      <span className="text-emerald-200">{value}</span>
                      <button onClick={() => setAnswers({ ...answers, values: answers.values.filter((_, i) => i !== idx) })} className="text-emerald-400 hover:text-emerald-300">
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
                  placeholder="Type a value..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button
                  onClick={() => {
                    if (customValue.trim()) {
                      setAnswers({ ...answers, values: [...answers.values, customValue.trim()] });
                      setCustomValue("");
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Avoidance Behaviors */}
            <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" /> Avoidance Behaviors
              </h3>
              <p className="text-slate-400 text-sm mb-4">"When those difficult thoughts and feelings show up, what do you usually do?"</p>
              
              {answers.avoidanceBehaviors.length > 0 && (
                <div className="mb-4 space-y-2">
                  {answers.avoidanceBehaviors.map((behavior, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-purple-500/20 border border-purple-500/30 rounded-lg px-4 py-2">
                      <span className="text-purple-200">{behavior}</span>
                      <button onClick={() => setAnswers({ ...answers, avoidanceBehaviors: answers.avoidanceBehaviors.filter((_, i) => i !== idx) })} className="text-purple-400 hover:text-purple-300">
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
                  placeholder="Type a behavior..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button
                  onClick={() => {
                    if (customAvoidance.trim()) {
                      setAnswers({ ...answers, avoidanceBehaviors: [...answers.avoidanceBehaviors, customAvoidance.trim()] });
                      setCustomAvoidance("");
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button onClick={() => setStep("cpfq")} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep("matrix")} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2">
                View ACT Matrix <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ACT Matrix */}
        {step === "matrix" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" /> {answers.studentName || "Student"}'s ACT Matrix
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <h4 className="text-red-400 font-bold text-sm uppercase tracking-wide mb-1">Inner + Away</h4>
                  <p className="text-slate-400 text-xs mb-3">Difficult thoughts & feelings</p>
                  <div className="space-y-1">
                    {answers.difficultThoughts.map(t => <div key={t} className="text-red-200 text-sm">• "{t}"</div>)}
                    {answers.difficultFeelings.map(f => <div key={f} className="text-red-200 text-sm">• {f}</div>)}
                    {answers.difficultThoughts.length === 0 && answers.difficultFeelings.length === 0 && (
                      <p className="text-slate-500 text-sm italic">No thoughts recorded</p>
                    )}
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wide mb-1">Inner + Toward</h4>
                  <p className="text-slate-400 text-xs mb-3">Values & what matters</p>
                  <div className="space-y-1">
                    {answers.values.map(v => <div key={v} className="text-cyan-200 text-sm">• {v}</div>)}
                    {answers.values.length === 0 && <p className="text-slate-500 text-sm italic">No values recorded</p>}
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <h4 className="text-purple-400 font-bold text-sm uppercase tracking-wide mb-1">Outer + Away</h4>
                  <p className="text-slate-400 text-xs mb-3">Avoidance behaviors</p>
                  <div className="space-y-1">
                    {answers.avoidanceBehaviors.map(b => <div key={b} className="text-purple-200 text-sm">• {b}</div>)}
                    {answers.avoidanceBehaviors.length === 0 && <p className="text-slate-500 text-sm italic">No behaviors recorded</p>}
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wide mb-1">Outer + Toward</h4>
                  <p className="text-slate-400 text-xs mb-3">Values-consistent actions</p>
                  <div className="text-slate-500 text-sm italic">(Intervention targets)</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep("questionnaire")} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={extractStatements} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2">
                Extract Statements <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Context */}
        {step === "context" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" /> Statement Context
              </h3>
              <p className="text-slate-400 text-sm mb-4">Identify when/where each statement typically occurs.</p>
              
              <div className="space-y-4">
                {statements.map((s, idx) => (
                  <div key={s.id} className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">{s.source}</span>
                      <span className="text-white">"{s.text}"</span>
                    </div>
                    <select
                      value={s.context}
                      onChange={(e) => updateStatementContext(s.id, e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      <option value="">Select context...</option>
                      {CONTEXT_OPTIONS.map(ctx => <option key={ctx} value={ctx}>{ctx}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep("matrix")} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep("statements")} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2">
                Review Statements <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Statement Review */}
        {step === "statements" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" /> Review Statements
              </h3>
              <p className="text-slate-400 text-sm mb-4">Give each statement a short, memorable title (e.g., "The Shiny Door", "The Bad Day")</p>
              
              <div className="space-y-3 mb-4">
                {statements.map((s, idx) => (
                  <div key={s.id} className="bg-slate-900 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-slate-500">#{idx + 1}</span>
                          <input
                            type="text"
                            value={s.title || ""}
                            onChange={(e) => setStatements(prev => prev.map(st => st.id === s.id ? { ...st, title: e.target.value } : st))}
                            placeholder="Give it a title (e.g., 'The Shiny Door')"
                            className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-cyan-300 text-sm font-semibold placeholder:text-slate-600"
                          />
                        </div>
                        <p className="text-white">"{s.text}"</p>
                        {s.context && <p className="text-slate-500 text-sm mt-1">Context: {s.context}</p>}
                      </div>
                      <button onClick={() => removeStatement(s.id)} className="text-slate-500 hover:text-red-400 mt-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customStatement}
                  onChange={(e) => setCustomStatement(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addManualStatement()}
                  placeholder="Add another statement..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <button onClick={addManualStatement} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep("context")} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep("behavior-profile")}
                disabled={statements.length === 0}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                Define Precursors <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Behavior Profile (Precursors & Triggers) */}
        {step === "behavior-profile" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" /> Behavior Profile
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Define the target behavior, precursor behaviors to observe during the FA, and known triggers.
              </p>

              {/* Target Behavior */}
              <div className="mb-6">
                <label className="text-sm font-medium text-white mb-2 block">Target Behavior (Operational Definition)</label>
                <textarea
                  value={behaviorProfile.targetBehavior}
                  onChange={(e) => setBehaviorProfile({ ...behaviorProfile, targetBehavior: e.target.value })}
                  placeholder="e.g., Dysregulation: defined as crying with or without tears, putting his head down on the table, laying on covering his face/eyes/ears, refusing to talk, shouting in the classroom..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm"
                />
              </div>

              {/* Precursors */}
              <div className="mb-6">
                <label className="text-sm font-medium text-white mb-2 block">
                  Precursor Behaviors <span className="text-yellow-400">(what to observe during latency timing)</span>
                </label>
                <p className="text-slate-500 text-xs mb-3">
                  Observable behaviors that predict the target behavior (e.g., balling fists, tensing body, scowling, verbal refusal)
                </p>
                
                {behaviorProfile.precursors.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {behaviorProfile.precursors.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-3 py-1.5">
                        <span className="text-yellow-200 text-sm">{p}</span>
                        <button
                          onClick={() => setBehaviorProfile({
                            ...behaviorProfile,
                            precursors: behaviorProfile.precursors.filter((_, i) => i !== idx)
                          })}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPrecursor}
                    onChange={(e) => setNewPrecursor(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newPrecursor.trim()) {
                        setBehaviorProfile({
                          ...behaviorProfile,
                          precursors: [...behaviorProfile.precursors, newPrecursor.trim()]
                        });
                        setNewPrecursor("");
                      }
                    }}
                    placeholder="Type a precursor behavior..."
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                  />
                  <button
                    onClick={() => {
                      if (newPrecursor.trim()) {
                        setBehaviorProfile({
                          ...behaviorProfile,
                          precursors: [...behaviorProfile.precursors, newPrecursor.trim()]
                        });
                        setNewPrecursor("");
                      }
                    }}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Triggers */}
              <div className="mb-6">
                <label className="text-sm font-medium text-white mb-2 block">
                  Triggers <span className="text-orange-400">(antecedent events/contexts)</span>
                </label>
                <p className="text-slate-500 text-xs mb-3">
                  Events or situations that set the occasion for behavior (e.g., peer conflict, academic demands, transitions)
                </p>
                
                {behaviorProfile.triggers.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {behaviorProfile.triggers.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-lg px-3 py-1.5">
                        <span className="text-orange-200 text-sm">{t}</span>
                        <button
                          onClick={() => setBehaviorProfile({
                            ...behaviorProfile,
                            triggers: behaviorProfile.triggers.filter((_, i) => i !== idx)
                          })}
                          className="text-orange-400 hover:text-orange-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTrigger.trim()) {
                        setBehaviorProfile({
                          ...behaviorProfile,
                          triggers: [...behaviorProfile.triggers, newTrigger.trim()]
                        });
                        setNewTrigger("");
                      }
                    }}
                    placeholder="Type a trigger..."
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                  />
                  <button
                    onClick={() => {
                      if (newTrigger.trim()) {
                        setBehaviorProfile({
                          ...behaviorProfile,
                          triggers: [...behaviorProfile.triggers, newTrigger.trim()]
                        });
                        setNewTrigger("");
                      }
                    }}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary Preview */}
              {(behaviorProfile.precursors.length > 0 || behaviorProfile.triggers.length > 0) && (
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <h4 className="text-sm font-semibold text-white mb-2">Summary</h4>
                  <div className="text-sm text-slate-400">
                    <p><strong className="text-yellow-400">{behaviorProfile.precursors.length}</strong> precursor behaviors to observe</p>
                    <p><strong className="text-orange-400">{behaviorProfile.triggers.length}</strong> known triggers</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep("statements")} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep("fusion-fa")}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                Start Fusion FA <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: Fusion FA */}
        {step === "fusion-fa" && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" /> Protocol
                </h3>
                <button
                  onClick={generateAllScripts}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Generate All Scripts (AI)
                </button>
              </div>
              <div className="text-sm text-slate-300 space-y-1">
                <p><strong className="text-green-400">Control (Validating):</strong> Support the verbal relation</p>
                <p><strong className="text-red-400">Test (Challenging):</strong> Gently challenge it</p>
                <p><strong className="text-cyan-400">Measure:</strong> Latency to first precursor behavior</p>
              </div>
            </div>

            {statements.map((statement, idx) => {
              const templatePrompts = generatePrompts(statement);
              // Use AI-generated arrays, falling back to single template-based scripts
              const validatingScripts = statement.aiValidatingScripts?.length 
                ? statement.aiValidatingScripts 
                : [statement.aiValidating || templatePrompts.validating];
              const challengingScripts = statement.aiChallengingScripts?.length 
                ? statement.aiChallengingScripts 
                : [statement.aiChallenging || templatePrompts.challenging];
              const relationType = statement.aiRelationType || statement.aiFrameType || templatePrompts.frameType;
              const relationExplanation = statement.aiRelationExplanation || "";
              
              return (
                <div key={statement.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                  {/* Header with title and relation */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Row {idx + 1}</span>
                        <span className="text-cyan-300 font-bold">{statement.title || `Statement ${idx + 1}`}</span>
                      </div>
                      <button
                        onClick={() => generateAIScripts(statement.id)}
                        disabled={statement.scriptsLoading}
                        className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 disabled:opacity-50"
                      >
                        {statement.scriptsLoading ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> Generating...</>
                        ) : (
                          <><Sparkles className="w-3 h-3" /> {statement.scriptsGenerated ? 'Regenerate' : 'Generate AI Scripts'}</>
                        )}
                      </button>
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">"{statement.text}"</p>
                    {statement.context && <p className="text-slate-400 text-sm mb-2">Context: {statement.context}</p>}
                    
                    {/* Relation type and explanation */}
                    <div className="bg-slate-900/50 rounded-lg p-3 mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase font-semibold">{relationType}</span>
                        {statement.scriptsGenerated && (
                          <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI Generated
                          </span>
                        )}
                      </div>
                      {relationExplanation && (
                        <p className="text-slate-400 text-sm italic">{relationExplanation}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Validating */}
                    {(() => {
                      const vState = getTimerState(statement.id, "validating");
                      const isActive = activeTimer?.statementId === statement.id && activeTimer?.condition === "validating";
                      return (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <div className="text-xs text-green-400 font-bold uppercase tracking-wide mb-2">Control Condition (Validating)</div>
                          {/* Show all validating scripts */}
                          <div className="space-y-2 mb-4">
                            {validatingScripts.map((script, scriptIdx) => (
                              <p key={scriptIdx} className="text-green-200/80 text-sm">
                                • {script.replace(/^"|"$/g, '')}
                              </p>
                            ))}
                          </div>
                          <div className="border-t border-green-500/20 pt-3">
                            {statement.validatingLatency !== null ? (
                              <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-green-300">{statement.validatingLatency}s ✓</div>
                                <button onClick={() => resetTimer(statement.id, "validating")} className="text-green-400 hover:text-green-300"><RotateCcw className="w-4 h-4" /></button>
                              </div>
                            ) : (
                              <>
                                <div className="text-2xl font-bold text-green-300 mb-3">{vState.accumulated.toFixed(1)}s</div>
                                <div className="flex gap-2">
                                  {isActive ? (
                                    <button onClick={pauseTimer} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                                      <Pause className="w-4 h-4" /> Pause
                                    </button>
                                  ) : (
                                    <button onClick={() => startTimer(statement.id, "validating")} disabled={activeTimer !== null} className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                                      <Play className="w-4 h-4" /> {vState.accumulated > 0 ? "Resume" : "Start"}
                                    </button>
                                  )}
                                  {vState.accumulated > 0 && !isActive && (
                                    <button onClick={() => recordTimer(statement.id, "validating")} className="bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                                      <CheckCircle className="w-4 h-4" /> Record
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                            {/* Precursor observations */}
                            <div className="mt-3 pt-3 border-t border-green-500/20">
                              <label className="text-xs text-green-400 block mb-1">Precursors Observed:</label>
                              <textarea
                                value={statement.validatingPrecursors}
                                onChange={(e) => updatePrecursors(statement.id, "validating", e.target.value)}
                                placeholder="e.g., posture shift, eye contact break, whispered..."
                                rows={2}
                                className="w-full bg-slate-900 border border-green-500/30 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
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
                          <div className="text-xs text-red-400 font-bold uppercase tracking-wide mb-2">Test Condition (Challenging)</div>
                          {/* Show all challenging scripts */}
                          <div className="space-y-2 mb-4">
                            {challengingScripts.map((script, scriptIdx) => (
                              <p key={scriptIdx} className="text-red-200/80 text-sm">
                                • {script.replace(/^"|"$/g, '')}
                              </p>
                            ))}
                          </div>
                          <div className="border-t border-red-500/20 pt-3">
                            {statement.challengingLatency !== null ? (
                              <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-red-300">{statement.challengingLatency}s ✓</div>
                                <button onClick={() => resetTimer(statement.id, "challenging")} className="text-red-400 hover:text-red-300"><RotateCcw className="w-4 h-4" /></button>
                              </div>
                            ) : (
                              <>
                                <div className="text-2xl font-bold text-red-300 mb-3">{cState.accumulated.toFixed(1)}s</div>
                                <div className="flex gap-2">
                                  {isActive ? (
                                    <button onClick={pauseTimer} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                                      <Pause className="w-4 h-4" /> Pause
                                    </button>
                                  ) : (
                                    <button onClick={() => startTimer(statement.id, "challenging")} disabled={activeTimer !== null} className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                                      <Play className="w-4 h-4" /> {cState.accumulated > 0 ? "Resume" : "Start"}
                                    </button>
                                  )}
                                  {cState.accumulated > 0 && !isActive && (
                                    <button onClick={() => recordTimer(statement.id, "challenging")} className="bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                                      <CheckCircle className="w-4 h-4" /> Record
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                            {/* Precursor observations */}
                            <div className="mt-3 pt-3 border-t border-red-500/20">
                              <label className="text-xs text-red-400 block mb-1">Precursors Observed:</label>
                              <textarea
                                value={statement.challengingPrecursors}
                                onChange={(e) => updatePrecursors(statement.id, "challenging", e.target.value)}
                                placeholder="e.g., said 'I don't know if they're right', looked away..."
                                rows={2}
                                className="w-full bg-slate-900 border border-red-500/30 rounded px-2 py-1 text-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between">
              <button onClick={() => setStep("behavior-profile")} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              {allComplete && (
                <button onClick={() => setStep("results")} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2">
                  View Results <BarChart3 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 9: Results */}
        {step === "results" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-4 text-center">
                <div className="text-xs text-cyan-400 uppercase tracking-wide mb-1">AFQ-Y Score</div>
                <div className="text-2xl font-bold text-white">{getAfqyScore() ?? "—"}/32</div>
                <div className={`text-sm ${getAfqyInterpretation(getAfqyScore()).color}`}>
                  {getAfqyInterpretation(getAfqyScore()).level.split(' ').slice(-1)}
                </div>
              </div>
              <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-4 text-center">
                <div className="text-xs text-purple-400 uppercase tracking-wide mb-1">Parent CPFQ</div>
                <div className="text-2xl font-bold text-white">{getParentCpfqScore() ?? "—"}/32</div>
                <div className="text-sm text-slate-400">Parent report</div>
              </div>
              <div className="bg-slate-800 border border-red-500/30 rounded-xl p-4 text-center">
                <div className="text-xs text-red-400 uppercase tracking-wide mb-1">High Fusion</div>
                <div className="text-2xl font-bold text-white">{getResults().filter(r => getFusionLevel(r.delta).priority).length}</div>
                <div className="text-sm text-slate-400">statements</div>
              </div>
            </div>

            {/* Fusion Hierarchy Table */}
            <div className="bg-slate-800 border-2 border-cyan-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" /> Fusion Hierarchy — {answers.studentName || "Student"}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="pb-3 text-slate-400 text-sm font-medium">#</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium">Statement</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">V</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">C</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">Δ</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getResults().map((result, idx) => {
                      const fusion = getFusionLevel(result.delta);
                      return (
                        <tr key={result.id} className="border-b border-slate-700">
                          <td className="py-3 text-white font-bold">{idx + 1}</td>
                          <td className="py-3 text-white">"{result.text}"</td>
                          <td className="py-3 text-green-300 text-center">{result.validatingLatency}s</td>
                          <td className="py-3 text-red-300 text-center">{result.challengingLatency}s</td>
                          <td className="py-3 text-cyan-300 text-center font-bold">{result.delta.toFixed(1)}s</td>
                          <td className="py-3 text-center">
                            <span className={`${fusion.bg} ${fusion.color} px-2 py-1 rounded text-xs font-medium`}>{fusion.level}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Priority Targets */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h4 className="font-semibold text-red-300 mb-3">🎯 Priority Defusion Targets</h4>
              <div className="space-y-2">
                {getResults().filter(r => getFusionLevel(r.delta).priority).map((r, idx) => (
                  <div key={r.id} className="bg-slate-900/50 rounded-lg p-3">
                    <span className="text-white font-bold">{idx + 1}.</span>
                    <span className="text-white ml-2">"{r.text}"</span>
                    <span className="text-slate-500 text-sm ml-2">(Δ {r.delta.toFixed(1)}s)</span>
                  </div>
                ))}
                {getResults().filter(r => getFusionLevel(r.delta).priority).length === 0 && (
                  <p className="text-slate-400">No high-fusion statements identified.</p>
                )}
              </div>
            </div>

            {/* Clinical Guardrails */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
              <h4 className="font-semibold text-amber-300 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Clinical Guardrails — Verbal Community Effect
              </h4>
              <p className="text-slate-300 text-sm mb-4">
                Extended validation of fused thoughts can strengthen fusion by providing social reinforcement from the verbal community. 
                Use these guardrails to maintain therapeutic alliance while promoting defusion:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* High-Fusion Alerts */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h5 className="text-red-300 font-medium mb-2">⚠️ High-Fusion Alerts</h5>
                  {getResults().filter(r => getFusionLevel(r.delta).priority).length > 0 ? (
                    <ul className="text-sm text-slate-300 space-y-1">
                      {getResults().filter(r => getFusionLevel(r.delta).priority).slice(0, 3).map((r, idx) => (
                        <li key={r.id}>• "{r.text.slice(0, 40)}..." — <span className="text-red-400">Limit validation to &lt;2 min</span></li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400">No high-fusion statements requiring alerts.</p>
                  )}
                </div>

                {/* The 2-Minute Rule */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h5 className="text-cyan-300 font-medium mb-2">⏱️ The 2-Minute Rule</h5>
                  <p className="text-sm text-slate-300">
                    For high-fusion statements, validate the <em>experience</em> for no more than 2 minutes before pivoting to defusion.
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Pivot phrase: "And I notice when that thought shows up..."
                  </p>
                </div>

                {/* Language Swaps */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h5 className="text-green-300 font-medium mb-2">🔄 Language Swaps</h5>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-red-400">❌ "That must be so hard"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-400">✓ "That thought really hooks you"</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Validate experience, not content truth</p>
                  </div>
                </div>

                {/* Session Focus */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h5 className="text-purple-300 font-medium mb-2">📋 Session Focus Recommendation</h5>
                  <p className="text-sm text-slate-300">
                    {getResults().filter(r => getFusionLevel(r.delta).priority).length > 0 
                      ? `Prioritize defusion work for ${getResults().filter(r => getFusionLevel(r.delta).priority).length} high-fusion statement(s). Target ratio: 5 min validation / 15 min defusion.`
                      : "No high-priority targets. Maintain standard session structure with defusion emphasis."}
                  </p>
                </div>
              </div>

              {/* Warning Box */}
              {getResults().filter(r => getFusionLevel(r.delta).priority).length > 0 && (
                <div className="mt-4 bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-200 text-sm">
                    <strong>⚠️ Avoid extended validation</strong> for the {getResults().filter(r => getFusionLevel(r.delta).priority).length} high-fusion statement(s) above. 
                    Extended engagement with this content may strengthen the relational frame rather than promote defusion.
                    Use the "Notice" pivot to shift from content to process.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button onClick={() => setStep("fusion-fa")} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Print
                </button>
                <button onClick={generateReport} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2">
                  <Download className="w-5 h-5" /> Download Report
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        <p>CalABA 2026 Symposium — Fusion Hierarchy Assessment</p>
        <p className="mt-1">Behavior School Pro • Free Tier</p>
      </footer>
    </div>
  );
}
